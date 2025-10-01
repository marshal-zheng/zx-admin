import type { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'

/**
 * 请求选项接口
 */
export interface RequestOptions {
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean
  // 需要对返回数据进行处理
  isTransformResponse?: boolean
  // 是否返回原生的错误信息
  isReturnErrorMessageFromServer?: boolean
  // post请求的时候添加参数到url
  joinParamsToUrl?: boolean
  // 格式化提交参数时间
  formatDate?: boolean
  // 消息提示类型
  errorMessageMode?: 'none' | 'modal' | 'message' | undefined
  // 接口地址
  apiUrl?: string
  // 接口拼接地址
  urlPrefix?: string
  //  是否加入时间戳
  joinTime?: boolean
  // 忽略重复请求
  ignoreCancelToken?: boolean
  // 是否携带token
  withToken?: boolean
  // 重试
  retryRequest?: RetryRequest
  // 默认将prefix 添加到url
  joinPrefix?: boolean
  // 成功消息提示模式
  successMessageMode?: 'auto' | 'none' | 'message' | 'modal'
  // 是否在拦截器里自动弹出错误消息（全局开关）
  showErrorMessage?: boolean
}

/**
 * 重试请求配置
 */
export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}

/**
 * 创建 Axios 实例的选项
 */
export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}

/**
 * 上传文件参数
 */
export interface UploadFileParams {
  // 其他参数
  data?: Record<string, unknown>
  // 文件参数接口字段名
  name?: string
  // 文件
  file: File | Blob
  // 文件名
  filename?: string
  [key: string]: unknown
}

/**
 * Axios转换抽象类
 * 定义了请求和响应的各种钩子函数
 */
export abstract class AxiosTransform {
  /**
   * 请求之前处理配置
   * @param config - axios配置
   * @param options - 请求选项
   * @returns 处理后的配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig

  /**
   * 处理请求数据。如果数据不是预期格式，可直接抛出错误
   * @param res - axios响应对象
   * @param options - 请求选项
   * @returns 处理后的数据
   */
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => unknown

  /**
   * 请求失败处理
   * @param e - 错误对象
   * @param options - 请求选项
   * @returns 处理后的错误
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<unknown>

  /**
   * 请求之前的拦截器
   * @param config - axios配置
   * @param options - 创建axios的选项
   * @returns 处理后的配置
   */
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions
  ) => AxiosRequestConfig

  /**
   * 请求之后的拦截器
   * @param res - axios响应对象
   * @returns 处理后的响应
   */
  responseInterceptors?: (res: AxiosResponse<unknown>) => AxiosResponse<unknown>

  /**
   * 请求之前的拦截器错误处理
   * @param error - 错误对象
   */
  requestInterceptorsCatch?: (error: AxiosError) => void

  /**
   * 请求之后的拦截器错误处理
   * @param axiosInstance - axios实例
   * @param error - 错误对象
   */
  responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: AxiosError) => void
}

/**
 * 通用结果类型
 */
export interface Result<T = unknown> {
  code: number
  type: 'success' | 'error' | 'warning'
  message: string
  result: T
}
