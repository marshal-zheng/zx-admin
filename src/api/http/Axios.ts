/**
 * Axios封装类
 * 提供统一的HTTP请求接口
 */
import { cloneDeep } from 'lodash-es'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

import { AxiosCanceler } from './axiosCancel.js'
import { handleThirdPartyRequest, handleThirdPartyResponse } from './thirdPartyAdapter.js'
import {
  handleGridListRequest,
  handleGridListResponse,
  isGridListRequest,
  isGridListResponse
} from './gridListUtils.js'
import { normalizeParams, serializeResponse } from './util.js'

// 导出类型定义
export * from './types'
import type { CreateAxiosOptions, RequestOptions } from './types'

/**
 * 扩展 AxiosRequestConfig 接口
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    requestOptions?: RequestOptions
  }
}

/**
 * 判断是否为函数
 * @param fn - 要判断的值
 * @returns 是否为函数
 */
function isFunction(fn: unknown): fn is Function {
  return typeof fn === 'function'
}

// 用户登出函数已移除，如需要可在具体业务模块中实现

/**
 * 内容类型枚举
 */
export const ContentTypeEnum = {
  // json
  JSON: 'application/json;charset=UTF-8',
  // form data
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  // form data
  FORM_DATA: 'multipart/form-data;charset=UTF-8'
} as const

/**
 * Axios封装类
 */
export class ZXAxios {
  private options: CreateAxiosOptions
  private axiosInstance: AxiosInstance
  private axiosCanceler: AxiosCanceler

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.axiosCanceler = new AxiosCanceler()

    this.setupInterceptors()
  }

  /**
   * 获取转换器
   * @returns {object} 转换器对象
   */
  getTransform() {
    const { transform } = this.options
    return transform
  }

  /**
   * 配置拦截器
   */
  setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const { requestInterceptors, responseInterceptors, responseInterceptorsCatch } = transform

    // 请求拦截器
    this.axiosInstance.interceptors.request.use((config) => {
      // 如果ignoreCancelToken为true，则不添加到pending中
      const ignoreCancelToken = config.requestOptions?.ignoreCancelToken
      const ignoreCancel =
        ignoreCancelToken !== undefined
          ? ignoreCancelToken
          : this.options.requestOptions?.ignoreCancelToken

      if (!ignoreCancel) {
        this.axiosCanceler.addPending(config)
      }
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options) as any
      }

      // 处理请求参数标准化 (将嵌套结构转换为扁平结构)
      // 注意：跳过 FormData 类型的数据，避免破坏文件上传
      if (config.method?.toLowerCase() === 'get' && config.params) {
        config.params = normalizeParams(config.params)
      } else if (config.data && !(config.data instanceof FormData)) {
        config.data = normalizeParams(config.data)
      }

      // 处理第三方接口请求适配
      config = handleThirdPartyRequest(config)

      // 处理 ZxGridList 相关请求
      if (isGridListRequest(config)) {
        config = handleGridListRequest(config)
      }

      return config
    }, undefined)

    // 响应拦截器
    this.axiosInstance.interceptors.response.use((res) => {
      if (res) {
        this.axiosCanceler.removePending(res.config)
      }
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }

      // 处理响应数据序列化（标准化分页信息）
      res.data = serializeResponse(res as any)

      // 处理第三方接口响应适配
      res = handleThirdPartyResponse(res)

      // 处理 ZxGridList 相关响应
      if (isGridListResponse(res)) {
        res = handleGridListResponse(res)
      }

      return res
    }, undefined)

    // 响应错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        return responseInterceptorsCatch(this.axiosInstance, error)
      })
    }
  }

  /**
   * 文件上传
   * @param {object} config - axios配置
   * @param {object} params - 上传参数
   * @param {string} customFileKey - 自定义文件字段名
   * @param {boolean} isMultiple - 是否多文件上传
   * @returns {Promise} 上传结果
   */
  uploadFile(config, params, customFileKey = '', isMultiple = false) {
    const formData = new window.FormData()
    const fileName = isMultiple ? 'files' : 'file'
    const customKey = customFileKey || fileName

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data[key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }
        formData.append(key, params.data[key])
      })
    }

    if (params.file) {
      if (isMultiple && Array.isArray(params.file)) {
        params.file.forEach((file) => {
          formData.append(customKey, file)
        })
      } else {
        formData.append(customKey, params.file)
      }
    }

    return this.axiosInstance.request({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true
      }
    })
  }

  /**
   * GET请求
   * @param config - 请求配置
   * @param options - 请求选项
   * @returns 请求结果
   */
  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  /**
   * POST请求
   * @param config - 请求配置
   * @param options - 请求选项
   * @returns 请求结果
   */
  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  /**
   * PUT请求
   * @param config - 请求配置
   * @param options - 请求选项
   * @returns 请求结果
   */
  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  /**
   * DELETE请求
   * @param config - 请求配置
   * @param options - 请求选项
   * @returns 请求结果
   */
  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  /**
   * 取消所有请求
   */
  cancelAllRequest(): void {
    this.axiosCanceler.removeAllPending()
  }

  /**
   * 取消指定请求
   * @param url - 请求URL
   */
  cancelRequest(url: string): void {
    this.axiosCanceler.removePending({ url, method: 'GET' } as any)
  }

  /**
   * 通用请求方法
   * @param config - 请求配置
   * @param options - 请求选项
   * @returns 请求结果
   */
  request<T = unknown>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf = cloneDeep(config)
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt = Object.assign({}, requestOptions, options)

    const { beforeRequestHook, transformRequestHook } = transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    conf.requestOptions = opt

    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .request(conf)
        .then((res) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt)
              resolve(ret as T)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          resolve(res as T)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
}
