import { cloneDeep } from 'lodash-es'
import { get } from 'lodash-es'

import type { RequestParams, NormalizedParams, ResponseData, ApiResponse } from './types'

/**
 * 检查值是否有效（非 null、undefined、空字符串）
 * @param value 要检查的值
 * @returns 是否有效
 */
function isValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== ''
}

/**
 * 标准化请求参数，将嵌套结构转换为扁平结构
 * @param params - 原始参数对象
 * @returns 标准化后的参数对象
 */
function normalizeParams(params: RequestParams): NormalizedParams {
  const normalized: NormalizedParams = {}

  // Handle pagination parameters
  if (params.pager && typeof params.pager === 'object') {
    const { page, size } = params.pager
    if (isValue(page) && typeof page === 'number') normalized.pageNumber = page
    if (isValue(size) && typeof size === 'number') normalized.pageSize = size
  }

  // Handle query parameters and sorting
  if (params.query && typeof params.query === 'object') {
    const { sortProp, sortOrder, ...restQuery } = params.query

    // Process sorting
    if (
      isValue(sortProp) &&
      isValue(sortOrder) &&
      typeof sortProp === 'string' &&
      typeof sortOrder === 'string'
    ) {
      const orderMap: Record<string, string> = { ascending: 'asc', descending: 'desc' }
      normalized.col = sortProp
      normalized.order = (orderMap[sortOrder] || sortOrder) as 'asc' | 'desc'
    }

    // Merge remaining query parameters with type checking
    Object.keys(restQuery).forEach((key) => {
      const value = restQuery[key]
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        normalized[key] = value
      }
    })
  }

  // Handle other top-level parameters
  Object.keys(params).forEach((key) => {
    if (key !== 'pager' && key !== 'query' && key !== 'total') {
      const value = params[key]
      // 保留基本类型、数组和对象
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        Array.isArray(value) ||
        (typeof value === 'object' && value !== null)
      ) {
        normalized[key] = value
      }
    }
  })

  return normalized
}

/**
 * 序列化响应数据，标准化分页信息
 * @param res - 响应对象
 * @returns 序列化后的数据对象
 */
function serializeResponse(res: ApiResponse): ResponseData {
  // 修复数据路径，直接从 res.data 获取数据
  const data = get(res, 'data.data') || get(res, 'data') || {}
  const copyData: ResponseData = (cloneDeep(data) as ResponseData) || ({} as ResponseData)

  // 处理新格式的分页数据 (current, pages, records, size, total)
  const { current, pages, records, size, total, page } = copyData

  // 兼容新旧两种格式
  if ([current, size, total].some((v) => isValue(v))) {
    // 新格式：使用 current, pages, records
    copyData.pager = {
      page: current,
      size,
      total,
      pages
    }

    // 如果有 records 字段，将其映射为 list 以保持向后兼容
    if (records && Array.isArray(records)) {
      copyData.list = records
      // 清理原始字段
      delete copyData.records
      delete copyData.current
      delete copyData.pages
    }
  } else if ([page, size, total].some((v) => isValue(v))) {
    // 旧格式：使用 page, size, total
    copyData.pager = { page, size, total }
    // list 字段保持不变
  }

  // 清理多余的分页字段
  delete copyData.size
  delete copyData.total

  // 开发环境下输出调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('serializeResponse copyData:', copyData)
  }

  return copyData
}

// 导出工具函数
export { normalizeParams, serializeResponse, isValue }
