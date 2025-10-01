/**
 * 时间戳工具函数
 * 用于给请求添加时间戳参数，避免缓存
 */

/**
 * 添加时间戳参数
 * @param {boolean} join - 是否添加时间戳
 * @param {boolean} restful - 是否为restful风格
 * @returns {string|object} 返回时间戳字符串或对象
 */
export function joinTimestamp(join, restful = false) {
  if (!join) {
    return restful ? '' : {}
  }
  const now = new Date().getTime()
  if (restful) {
    return `?_t=${now}`
  }
  return { _t: now }
}
