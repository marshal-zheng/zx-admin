/**
 * 第三方厂商接口适配器
 *
 * 职责：
 * - 统一第三方 API 的请求参数格式（排序/过滤/关键词等）
 * - 统一第三方 API 的响应数据结构（仅做结构适配，不处理 success/code 等业务状态）
 * - 适配后在响应拦截阶段直接返回“纯数据对象”给上层使用
 */
import { get, set, snakeCase } from 'lodash-es'

/**
 * 判断是否属于第三方接口
 * 可按需扩展识别规则（域名、url 前缀、header 标记等）
 */
export function isThirdPartyUrl(url = '') {
  // 目前约定：包含 /v2 的接口走第三方适配
  return typeof url === 'string' && url.includes('/v2')
}

/**
 * 第三方接口请求适配
 * - 规范排序：{ sort: { foo: 'asc' } } -> orders: [{ name: 'foo', type: 'asc' }]
 * - 规范过滤：filter -> filters
 * - 规范关键词：keyword -> name（若 name 未提供）
 * - 不包含任何具体业务特例（不感知具体路径，如 /performance/*）
 */
export function handleThirdPartyRequest(config) {
  if (!isThirdPartyUrl(config.url) || !config.data) {
    return config
  }

  const configCopy = { ...config }

  // 排序适配
  if (configCopy.data.sort) {
    configCopy.data.orders = Object.keys(configCopy.data.sort).map((key) => ({
      name: snakeCase(key),
      type: configCopy.data.sort[key]
    }))
    delete configCopy.data.sort
  }

  // 过滤适配
  if (configCopy.data.filter) {
    configCopy.data.filters = configCopy.data.filter
    delete configCopy.data.filter
  }

  // 关键词适配
  if (!configCopy.data.name) {
    set(configCopy, 'data.name', configCopy.data?.keyword || '')
    Reflect.deleteProperty(configCopy.data, 'keyword')
  }

  return configCopy
}

/**
 * 第三方接口响应适配
 * - 仅做结构适配，不做业务 success/code 逻辑
 * - 兼容包裹字段：优先 data，其次 result，最后顶层
 * - 兼容分页返回：listObject/totalCount -> list/total，并补齐 pageSize/pageIndex（从 url 推断）
 * - 适配完成后：res.data 指向“纯数据对象”
 */
export function handleThirdPartyResponse(res) {
  if (!isThirdPartyUrl(res.config?.url)) {
    return res
  }

  const resCopy = { ...res }
  const raw = get(resCopy, 'data')

  let payload = get(raw, 'data')
  if (payload === undefined) payload = get(raw, 'result')
  if (payload === undefined) payload = raw
  if (payload === undefined) payload = {}

  const data = payload && typeof payload === 'object' ? payload : {}

  if (data?.listObject) {
    const urlArr = (res.config.url || '').split('/')
    const pageSize = +urlArr.slice(-2, -1)
    const pageIndex = +urlArr.slice(-1)

    set(resCopy, 'data.data.list', data.listObject)
    set(resCopy, 'data.data.total', data.totalCount || 0)
    set(resCopy, 'data.data.pageSize', pageSize || 10)
    set(resCopy, 'data.data.pageIndex', pageIndex || 1)

    Reflect.deleteProperty(data, 'listObject')
    Reflect.deleteProperty(data, 'totalCount')
  }

  // 若原始返回包含包装结构（如 success/code/message），保留包装，仅将数据统一到 data 字段
  if (
    raw &&
    typeof raw === 'object' &&
    (Reflect.has(raw, 'success') ||
      Reflect.has(raw, 'code') ||
      Reflect.has(raw, 'message') ||
      Reflect.has(raw, 'result'))
  ) {
    const wrapped = { ...raw, data }
    // 去掉旧的 result，统一使用 data
    if (Reflect.has(wrapped, 'result')) {
      Reflect.deleteProperty(wrapped, 'result')
    }
    resCopy.data = wrapped
  } else {
    // 无包装结构，直接返回纯数据对象
    resCopy.data = data
  }
  return resCopy
}
