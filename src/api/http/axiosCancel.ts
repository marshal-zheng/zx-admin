/**
 * Axios请求取消管理
 * 用于管理和取消重复的HTTP请求
 */
import axios from 'axios'

// 存储待处理请求的Map
let pendingMap = new Map()

/**
 * 获取请求的唯一标识
 * @param {object} config - axios配置对象
 * @returns {string} 请求的唯一标识
 */
export const getPendingUrl = (config) => [config.method, config.url].join('&')

/**
 * 判断是否为函数
 * @param {any} fn - 待判断的值
 * @returns {boolean} 是否为函数
 */
function isFunction(fn) {
  return typeof fn === 'function'
}

/**
 * Axios取消器类
 */
export class AxiosCanceler {
  /**
   * 添加请求到pending列表
   * @param {object} config - axios配置对象
   */
  addPending(config) {
    this.removePending(config)
    const url = getPendingUrl(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // 非重复请求，存入pending中
          pendingMap.set(url, cancel)
        }
      })
  }

  /**
   * 清理全部pending中的请求
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      if (cancel && isFunction(cancel)) {
        cancel()
      }
    })
    pendingMap.clear()
  }

  /**
   * 取消并移除指定请求
   * @param {object} config - axios配置对象
   */
  removePending(config) {
    const url = getPendingUrl(config)

    if (pendingMap.has(url)) {
      // 根据标识找到pending中对应的请求并取消
      const cancel = pendingMap.get(url)
      if (cancel) {
        cancel(url)
      }
      pendingMap.delete(url)
    }
  }

  /**
   * 重置pending列表
   */
  static reset() {
    pendingMap = new Map()
  }
}
