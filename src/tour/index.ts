/**
 * Tour 引导系统导出入口
 *
 * 使用示例:
 * ```ts
 * import { startTour, tourRegistry } from '@/tour'
 *
 * // 注册引导流程
 * tourRegistry.register({
 *   key: 'onboarding.home',
 *   name: '首页引导',
 *   steps: [...],
 *   once: true
 * })
 *
 * // 启动引导
 * startTour('onboarding.home')
 * ```
 */

// 导出类型
export type * from './types'

// 导出核心服务
export { tourService, startTour, stopTour, resetTour, resetAllTours, configureTour } from './service'

// 导出注册表
export { tourRegistry } from './registry'

// 导出存储管理
export { tourStorage, shouldRun, markCompleted, markIncomplete, getCompletionInfo, clearAll } from './storage'

// 导出工具函数
export {
  sleep,
  waitForElement,
  waitForElementByFunction,
  isElementVisible,
  scrollToElement,
  safeStorage,
  debugLog
} from './utils'

// 默认导出服务实例
export default tourService


