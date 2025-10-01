/**
 * 分页参数接口
 */
export interface PagerParams {
  page?: number
  size?: number
  total?: number
  pages?: number
}

/**
 * 查询参数接口
 */
export interface QueryParams {
  sortProp?: string
  sortOrder?: 'ascending' | 'descending' | 'asc' | 'desc'
  [key: string]: string | number | boolean | undefined
}

/**
 * 请求参数接口
 */
export interface RequestParams {
  pager?: PagerParams
  query?: QueryParams
  total?: number
  [key: string]: string | number | boolean | PagerParams | QueryParams | undefined
}

/**
 * 标准化后的参数接口
 */
export interface NormalizedParams {
  pageNumber?: number
  pageSize?: number
  col?: string
  order?: 'asc' | 'desc'
  [key: string]: string | number | boolean | undefined
}

/**
 * 列表项类型
 */
export type ListItem = Record<string, unknown>

/**
 * 响应数据接口
 */
export interface ResponseData {
  data?: unknown
  current?: number
  pages?: number
  records?: ListItem[]
  size?: number
  total?: number
  page?: number
  list?: ListItem[]
  pager?: PagerParams
  [key: string]: unknown
}

/**
 * API 响应接口
 */
export interface ApiResponse {
  data?: ResponseData | unknown
  [key: string]: unknown
}
