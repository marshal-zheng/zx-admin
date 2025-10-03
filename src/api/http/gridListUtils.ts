/**
 * ZxGridList 组件数据格式转换工具
 * 统一处理分页数据格式，避免在组件中重复处理
 */
import { get, set } from 'lodash-es'

/**
 * 处理 ZxGridList 相关请求
 * @param {object} config - axios配置对象
 * @returns {object} 处理后的配置
 */
export function handleGridListRequest(config) {
  // 如果请求数据中包含 pager 对象，转换为后端期望的格式
  if (config.data && config.data.pager) {
    const configCopy = { ...config }
    const { pager, ...otherData } = config.data

    // 将分页参数提取到顶层或params中
    if (config.method?.toLowerCase() === 'get') {
      configCopy.params = {
        ...configCopy.params,
        page: pager.page,
        size: pager.size,
        ...otherData
      }
      configCopy.data = undefined
    } else {
      configCopy.data = {
        ...otherData,
        page: pager.page,
        size: pager.size
      }
    }

    return configCopy
  }

  return config
}

/**
 * 处理 ZxGridList 相关响应
 * @param {object} res - axios响应对象
 * @returns {object} 处理后的响应
 */
export function handleGridListResponse(res) {
  console.log('res', res)
  // 检查是否是需要转换的响应格式
  const data = get(res, 'data.data', {})

  // 如果响应数据包含 list 和 total，但没有 pager 对象，则构造 pager
  if (data && data.list && typeof data.total !== 'undefined' && !data.pager) {
    const resCopy = { ...res }

    // 从请求配置中获取分页参数
    const requestParams = res.config.params || {}
    const requestData = res.config.data || {}

    const page = requestParams.page || requestData.page || 1
    const size = requestParams.size || requestData.size || 10

    // 构造标准的 ZxGridList 数据格式
    set(resCopy, 'data.data.pager', {
      page: Number(page),
      size: Number(size),
      total: Number(data.total)
    })

    return resCopy
  }

  return res
}

/**
 * 检查是否是 ZxGridList 相关的请求
 * @param {object} config - axios配置对象
 * @returns {boolean} 是否是 ZxGridList 请求
 */
export function isGridListRequest(config) {
  // 可以根据 URL 模式、请求头或其他标识来判断
  // 这里简单判断是否包含 pager 参数
  return (
    !!(config.data && config.data.pager) ||
    !!(config.params && (config.params.page || config.params.size))
  )
}

/**
 * 检查是否是 ZxGridList 相关的响应
 * @param {object} res - axios响应对象
 * @returns {boolean} 是否是 ZxGridList 响应
 */
export function isGridListResponse(res) {
  const data = get(res, 'data.data', {})
  // 判断响应是否包含列表数据和总数
  return !!(data && data.list && typeof data.total !== 'undefined')
}
