/**
 * Tour 引导工具函数
 */

import type { WaitForElementOptions } from './types'

/**
 * 异步等待指定毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 等待指定选择器的元素出现在 DOM 中
 * @param selector CSS 选择器
 * @param options 配置选项
 * @returns 找到的元素，如果超时且 throwOnTimeout 为 false 则返回 null
 */
export function waitForElement(
  selector: string,
  options: WaitForElementOptions = {}
): Promise<HTMLElement | null> {
  const {
    timeout = 5000,
    interval = 100,
    throwOnTimeout = false
  } = options

  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const checkElement = () => {
      const element = document.querySelector(selector) as HTMLElement | null

      if (element) {
        resolve(element)
        return
      }

      const elapsed = Date.now() - startTime
      if (elapsed >= timeout) {
        if (throwOnTimeout) {
          reject(new Error(`等待元素超时: ${selector} (${timeout}ms)`))
        } else {
          console.warn(`[Tour] 等待元素超时: ${selector}`)
          resolve(null)
        }
        return
      }

      setTimeout(checkElement, interval)
    }

    checkElement()
  })
}

/**
 * 等待函数返回的元素出现
 * @param targetFn 获取元素的函数
 * @param options 配置选项
 * @returns 找到的元素，如果超时且 throwOnTimeout 为 false 则返回 null
 */
export function waitForElementByFunction(
  targetFn: () => HTMLElement | null,
  options: WaitForElementOptions = {}
): Promise<HTMLElement | null> {
  const {
    timeout = 5000,
    interval = 100,
    throwOnTimeout = false
  } = options

  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const checkElement = () => {
      try {
        const element = targetFn()

        if (element) {
          resolve(element)
          return
        }

        const elapsed = Date.now() - startTime
        if (elapsed >= timeout) {
          if (throwOnTimeout) {
            reject(new Error(`等待元素超时 (函数模式) (${timeout}ms)`))
          } else {
            console.warn('[Tour] 等待元素超时 (函数模式)')
            resolve(null)
          }
          return
        }

        setTimeout(checkElement, interval)
      } catch (error) {
        console.error('[Tour] 获取元素时出错:', error)
        reject(error)
      }
    }

    checkElement()
  })
}

/**
 * 检查元素是否可见（在视口内且不被隐藏）
 */
export function isElementVisible(element: HTMLElement): boolean {
  if (!element) return false

  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false
  }

  const rect = element.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

/**
 * 滚动元素到视口中心
 */
export function scrollToElement(
  element: HTMLElement,
  options: ScrollIntoViewOptions = {}
): void {
  if (!element) return

  const defaultOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  }

  element.scrollIntoView({ ...defaultOptions, ...options })
}

/**
 * 安全的 localStorage 操作（处理 SSR、隐私模式等异常情况）
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null
      }
      return window.localStorage.getItem(key)
    } catch (error) {
      console.warn('[Tour] localStorage.getItem 失败:', error)
      return null
    }
  },

  set(key: string, value: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false
      }
      window.localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.warn('[Tour] localStorage.setItem 失败:', error)
      return false
    }
  },

  remove(key: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false
      }
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn('[Tour] localStorage.removeItem 失败:', error)
      return false
    }
  },

  clear(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false
      }
      window.localStorage.clear()
      return true
    } catch (error) {
      console.warn('[Tour] localStorage.clear 失败:', error)
      return false
    }
  }
}

/**
 * 调试日志（仅在调试模式下输出）
 */
export function debugLog(message: string, ...args: any[]): void {
  // 可以通过配置控制是否输出
  if (import.meta.env.DEV) {
    console.log(`[Tour Debug] ${message}`, ...args)
  }
}


