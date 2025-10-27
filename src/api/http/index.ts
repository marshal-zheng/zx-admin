/**
 * HTTP请求封装主入口
 * 基于Axios的统一请求配置，适配Element Plus
 */
import { ElMessage, ElMessageBox } from 'element-plus'

import { ZXAxios } from './Axios.js'
import checkStatus from './checkStatus.js'
import { joinTimestamp } from './helper.js'
import type { CreateAxiosOptions } from './types'
import { AxiosTransform } from './types'

/**
 * 请求方法枚举
 */
const RequestEnum = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

/**
 * 内容类型枚举
 */
const ContentTypeEnum = {
  // json
  JSON: 'application/json;charset=UTF-8',
  // form data
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  // form data
  FORM_DATA: 'multipart/form-data;charset=UTF-8'
}

/**
 * 判断是否为字符串
 * @param val - 待判断的值
 * @returns 是否为字符串
 */
function isString(val: unknown): val is string {
  return typeof val === 'string'
}

/**
 * 深度合并对象
 * @param target - 目标对象
 * @param sources - 源对象
 * @returns 合并后的对象
 */
function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * 判断是否为对象
 * @param val - 待判断的值
 * @returns 是否为对象
 */
function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object'
}

/**
 * 将对象转换为URL参数
 * @param obj - 对象
 * @returns URL参数字符串
 */
function setObjToUrlParams(obj: Record<string, string | number | boolean>): string {
  const params = new URLSearchParams()
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      params.append(key, String(obj[key]))
    }
  }
  return params.toString()
}

/**
 * 获取token
 * @returns token值
 */
function getToken(): string {
  return localStorage.getItem('token') || ''
}

/**
 * 根据模式展示提示信息
 * @param content - 提示内容
 * @param mode - 展示模式
 * @param type - 提示类型
 */
function showNotice(
  content: string,
  mode: 'message' | 'modal' | 'none' = 'message',
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
): void {
  if (!content || !mode || mode === 'none') return

  if (mode === 'modal') {
    const title = type === 'error' ? '错误' : '提示'
    ElMessageBox.alert(content, title, { type })
    return
  }

  if (mode === 'message') {
    const messageTypeMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    }
    const handlerType = messageTypeMap[type] || 'info'
    const handler = ElMessage[handlerType] || ElMessage
    handler(content)
  }
}

/**
 * 解析成功提示模式
 * @param {'auto'|'message'|'modal'|'none'|undefined} mode - 配置的提示模式
 * @param {string} method - 请求方法
 * @returns {'message'|'modal'|'none'} 最终提示模式
 */
function resolveSuccessMode(mode, method = '') {
  if (!mode || mode === 'auto') {
    return method.toUpperCase() === 'GET' ? 'none' : 'message'
  }
  return mode
}

/**
 * 保留原始响应数据的内部字段
 */
const RAW_RESPONSE_KEY = '__ZXHL_RAW_RESPONSE__'

/**
 * 具体的 AxiosTransform 实现类
 */
class ConcreteAxiosTransform extends AxiosTransform {}

/**
 * 数据处理，方便区分多种处理方式
 */
const transform = new ConcreteAxiosTransform()

/**
 * 请求之前处理config
 */
transform.beforeRequestHook = (config, options) => {
  const { joinParamsToUrl, joinTime = true } = options

  const params = config.params || {}
  // 标记是否为 FormData，用于在后续流程中跳过参数标准化与覆盖
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
  // const data = config.data || false

  if (config.method?.toUpperCase() === RequestEnum.GET) {
    if (!isString(params)) {
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
      config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
    } else {
      // 兼容restful风格
      config.url = `${config.url}/${params}${joinTimestamp(joinTime, true)}`
      config.params = undefined
    }
  } else if (isString(params)) {
    // 兼容restful风格
    config.url += params
    config.params = undefined
  } else {
    // 对于 FormData 认为已经有有效数据，避免被覆盖
    const hasValidData =
      Reflect.has(config, 'data') &&
      config.data &&
      (isFormData ||
        (typeof config.data === 'object' &&
          (Object.keys(config.data).length > 0 || Array.isArray(config.data))))

    if (!hasValidData) {
      config.data = params || {}
      config.params = undefined
    }

    if (joinParamsToUrl) {
      // 当 body 为 FormData 时，不应把 body 合并到 URL 上
      const paramsForUrl = Object.assign({}, config.params)
      if (!isFormData && config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
        Object.assign(paramsForUrl, config.data)
      }
      const paramString = setObjToUrlParams(paramsForUrl as any)
      config.url = config.url + (config.url?.includes('?') ? '&' : '?') + paramString
    }
  }

  return config
}

/**
 * 处理响应数据
 */
transform.transformRequestHook = (res, options) => {
  const { isTransformResponse, isReturnNativeResponse, showErrorMessage = true } = options

  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  if (isReturnNativeResponse) {
    return res
  }

  // 不进行任何处理，直接返回
  if (!isTransformResponse) {
    return res.data
  }

  const payload = res?.data
  const rawData = res?.[RAW_RESPONSE_KEY] ?? payload

  if (!rawData) {
    throw new Error('请求出错，请稍候重试')
  }

  // 处理标准返回格式：{ code, success, msg, data }
  const { code, msg, message, data, success } = rawData
  const hasCode = Reflect.has(rawData, 'code')

  if (hasCode) {
    // code === 200 表示成功
    if (Number(code) === 200) {
      // 成功时根据配置显示提示
      const method = res?.config?.method || ''
      const successMessageMode = resolveSuccessMode(options.successMessageMode, method)
      // const successMsg = msg || message || '操作成功'
      const successMsg = '操作成功'
      showNotice(successMsg, successMessageMode, 'success')
      // 返回 data 字段
      return data !== undefined ? data : rawData
    } else {
      // code !== 200 表示业务错误
      // 处理特定业务错误码
      let errMsg = msg || message || '操作失败'

      // 对特定错误码进行特殊处理
      if (code === 401) {
        errMsg = errMsg || '用户没有权限（令牌、用户名、密码错误）!'
        // 清除token并跳转登录页
        localStorage.removeItem('token')
      } else if (code === 403) {
        errMsg = errMsg || '用户得到授权，但是访问是被禁止的!'
      } else if (code === 404) {
        errMsg = errMsg || '请求的资源不存在!'
      } else if (code === 500) {
        errMsg = errMsg || '服务器错误,请联系管理员!'
      }

      if (showErrorMessage) {
        const errorMessageMode = options.errorMessageMode || 'message'
        showNotice(errMsg, errorMessageMode, 'error')
      }
      throw new Error(errMsg)
    }
  }

  // 兼容第三方常见返回：{ success, data, msg/message }
  if (Reflect.has(rawData, 'success')) {
    const ok = rawData.success
    if (ok) {
      // 成功直接返回内部数据
      if (rawData.data !== undefined) return rawData.data
      if (rawData.result !== undefined) return rawData.result
      return payload ?? rawData
    }
    const errMsg = rawData.msg || rawData.message || '请求出错，请稍候重试'
    if (showErrorMessage) {
      const errorMessageMode = options.errorMessageMode || 'message'
      showNotice(errMsg, errorMessageMode, 'error')
    }
    throw new Error(errMsg)
  }

  // 未匹配到已知包裹结构，直接返回数据本体
  return payload ?? rawData
}

/**
 * 请求拦截器处理
 */
transform.requestInterceptors = (config, options) => {
  // 请求之前处理config
  const token = getToken()
  if (token && config?.requestOptions?.withToken !== false) {
    // jwt token
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = options?.authenticationScheme
      ? `${options.authenticationScheme} ${token}`
      : token
  }

  // 当请求体为 FormData 时，移除默认的 JSON Content-Type，让浏览器自动补 boundary
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (!config.headers) config.headers = {}
    const keys = Object.keys(config.headers)
    for (const k of keys) {
      if (k.toLowerCase() === 'content-type') {
        delete (config.headers as any)[k]
      }
    }
  }

  return config
}

/**
 * 响应拦截器处理
 */
transform.responseInterceptors = (res) => {
  if (res && Object.prototype.hasOwnProperty.call(res, 'data')) {
    res[RAW_RESPONSE_KEY] = res.data
  }

  // 处理文件下载
  const contentDisposition = res.headers?.['content-disposition']
  if (contentDisposition && contentDisposition.includes('attachment')) {
    // 这是一个文件下载响应
    const blob = new Blob([res.data as BlobPart])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url

    // 尝试从 Content-Disposition 中提取文件名
    let filename = '下载文件'
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '')
      // 处理 UTF-8 编码的文件名
      if (filename.includes('UTF-8')) {
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/)
        if (utf8Match && utf8Match[1]) {
          filename = decodeURIComponent(utf8Match[1])
        }
      }
    }

    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // 返回下载成功的标识
    res.data = { success: true, message: '文件下载成功' }
  }

  return res
}

/**
 * 响应错误处理
 */
transform.responseInterceptorsCatch = (error: any) => {
  const { response, code, message, config } = error || {}
  const errorMessageMode = config?.requestOptions?.errorMessageMode || 'message'
  const showErrorMessage = config?.requestOptions?.showErrorMessage !== false
  const msg = response?.data?.error?.message ?? ''
  const err = error?.toString?.()
  let errMessage = ''

  try {
    if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      errMessage = '接口请求超时,请刷新页面重试!'
    }
    if (err?.includes('Network Error')) {
      errMessage = '网络异常，请检查您的网络连接是否正常!'
    }

    if (errMessage) {
      if (showErrorMessage) {
        if (errorMessageMode === 'modal') {
          ElMessageBox.alert(errMessage, '错误', { type: 'error' })
        } else if (errorMessageMode === 'message') {
          ElMessage.error(errMessage)
        }
      }
      return Promise.reject(error)
    }
  } catch (error) {
    throw new Error(String(error))
  }

  // HTTP 错误处理
  if (response?.status) {
    const status = response.status
    let statusMessage = ''

    switch (status) {
      case 401:
        statusMessage = '用户没有权限（令牌、用户名、密码错误）!'
        // 清除token并跳转登录页
        localStorage.removeItem('token')
        break
      case 403:
        statusMessage = '用户得到授权，但是访问是被禁止的!'
        break
      case 404:
        statusMessage = '网络请求错误,未找到该资源!'
        break
      case 408:
        statusMessage = '网络请求超时!'
        break
      case 500:
        statusMessage = '服务器错误,请联系管理员!'
        break
      case 501:
        statusMessage = '网络未实现!'
        break
      case 502:
        statusMessage = '网络错误!'
        break
      case 503:
        statusMessage = '服务不可用，服务器暂时过载或维护!'
        break
      case 504:
        statusMessage = '网络超时!'
        break
      case 505:
        statusMessage = 'http版本不支持该请求!'
        break
      default:
        statusMessage = msg || `HTTP错误: ${status}`
    }

    if (showErrorMessage) {
      if (errorMessageMode === 'modal') {
        ElMessageBox.alert(statusMessage, '错误', { type: 'error' })
      } else if (errorMessageMode === 'message') {
        ElMessage.error(statusMessage)
      }
    }
  }

  return Promise.reject(error)
}

/**
 * 创建axios实例
 * @param opt - 配置选项
 * @returns axios实例
 */
function createAxios(opt?: Partial<CreateAxiosOptions>): ZXAxios {
  return new ZXAxios(
    deepMerge(
      {
        // 认证方案，例如: Bearer
        authenticationScheme: 'Bearer',
        timeout: 10 * 1000,
        // 基础接口地址
        baseURL: '/api',
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          // 开启后 API 返回的结果将是后端 data/result 的纯数据，不包含 success/code 包裹
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: '/api',
          // 接口拼接地址
          urlPrefix: '',
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          // 成功消息提示模式
          successMessageMode: 'auto',
          // 是否在拦截器里自动弹出错误消息（全局开关）
          showErrorMessage: true
        }
      },
      opt || {}
    )
  )
}

// 创建默认实例
const ZXR = createAxios()

// 导出默认实例
export default ZXR
