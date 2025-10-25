/**
 * Tour 引导服务 - 核心控制器
 */

import { nextTick } from 'vue'
import type { TourHostRefs, TourFlow, TourStep, TourStartOptions, TourConfig, ITourService } from './types'
import { tourRegistry } from './registry'
import { tourStorage } from './storage'
import { waitForElement, waitForElementByFunction, debugLog } from './utils'

/**
 * Tour 服务类
 */
class TourService implements ITourService {
  private hostRefs: TourHostRefs | null = null
  private currentFlow: TourFlow | null = null
  private config: TourConfig = {
    debug: false,
    defaultTimeout: 8000,
    storagePrefix: 'app'
  }

  /**
   * 配置 Tour 服务
   */
  configure(config: Partial<TourConfig>): void {
    this.config = { ...this.config, ...config }
    debugLog('Tour 配置已更新:', this.config)
  }

  /**
   * 获取当前配置
   */
  getConfig(): TourConfig {
    return { ...this.config }
  }

  /**
   * 挂载宿主组件
   */
  mount(refs: TourHostRefs): void {
    this.hostRefs = refs
    debugLog('Tour 宿主组件已挂载')
  }

  /**
   * 启动指定的引导流程
   */
  async start(flowKey: string, options: TourStartOptions = {}): Promise<boolean> {
    try {
      // 检查宿主是否已挂载
      if (!this.hostRefs) {
        console.error('[Tour] 宿主组件未挂载，无法启动引导')
        return false
      }

      // 获取流程配置
      const flow = tourRegistry.get(flowKey)
      if (!flow) {
        console.error(`[Tour] 未找到流程配置: ${flowKey}`)
        return false
      }

      // 检查是否应该运行（一次性限制）
      if (flow.once && !options.force && !tourStorage.shouldRun(flowKey)) {
        debugLog(`流程 "${flowKey}" 已完成过，跳过`)
        return false
      }

      // 调用流程开始钩子
      if (flow.onStart) {
        await flow.onStart()
      }

      // 使用自定义步骤或流程中的步骤
      const steps = options.customSteps || flow.steps

      // 过滤可见步骤
      const visibleSteps = this.filterVisibleSteps(steps)
      if (visibleSteps.length === 0) {
        console.warn(`[Tour] 流程 "${flowKey}" 没有可显示的步骤`)
        return false
      }

      // 预等待所有目标元素
      debugLog(`开始预等待 ${visibleSteps.length} 个目标元素...`)
      const waitPromises = visibleSteps.map((step) => this.waitForStepTarget(step))
      await Promise.allSettled(waitPromises)

      // 设置当前流程
      this.currentFlow = flow

      // 更新宿主状态
      this.hostRefs.steps.value = visibleSteps
      await nextTick()

      const startIndex = options.startFrom ?? 0
      this.hostRefs.current.value = startIndex
      this.hostRefs.open.value = true

      debugLog(`流程 "${flowKey}" 已启动，共 ${visibleSteps.length} 个步骤`)
      return true
    } catch (error) {
      console.error('[Tour] 启动引导失败:', error)
      return false
    }
  }

  /**
   * 停止当前引导
   */
  stop(): void {
    if (!this.hostRefs) return

    this.hostRefs.open.value = false
    this.currentFlow = null
    debugLog('引导已停止')
  }

  /**
   * 跳转到指定步骤
   */
  goToStep(index: number): void {
    if (!this.hostRefs) return

    const totalSteps = this.hostRefs.steps.value.length
    if (index < 0 || index >= totalSteps) {
      console.warn(`[Tour] 步骤索引越界: ${index} (总共 ${totalSteps} 步)`)
      return
    }

    this.hostRefs.current.value = index
    debugLog(`跳转到步骤 ${index}`)
  }

  /**
   * 获取当前流程
   */
  getCurrentFlow(): TourFlow | null {
    return this.currentFlow
  }

  /**
   * 重置指定流程的完成状态
   */
  reset(flowKey: string): void {
    tourStorage.markIncomplete(flowKey)
    debugLog(`流程 "${flowKey}" 已重置`)
  }

  /**
   * 重置所有流程
   */
  resetAll(): void {
    tourStorage.clearAll()
    debugLog('所有流程已重置')
  }

  /**
   * 步骤变化时的回调
   */
  async onChange(index: number): Promise<void> {
    try {
      const steps = this.hostRefs?.steps.value || []
      const step = steps[index]

      if (!step) return

      debugLog(`步骤切换到 ${index}: ${step.title}`)

      // 执行步骤进入钩子
      if (step.onEnter) {
        await step.onEnter()
      }

      // 可以在这里添加埋点逻辑
      // analytics.track('tour_step', { flowKey: this.currentFlow?.key, stepId: step.id, index })
    } catch (error) {
      console.error('[Tour] onChange 处理失败:', error)
    }
  }

  /**
   * 完成时的回调
   */
  async onFinish(): Promise<void> {
    try {
      if (!this.currentFlow) return

      const flowKey = this.currentFlow.key
      const stepsCount = this.hostRefs?.steps.value.length || 0

      debugLog(`流程 "${flowKey}" 已完成`)

      // 标记为已完成
      if (this.currentFlow.once) {
        tourStorage.markCompleted(flowKey, stepsCount)
      }

      // 执行流程完成钩子
      if (this.currentFlow.onFinish) {
        await this.currentFlow.onFinish()
      }

      // 可以在这里添加埋点逻辑
      // analytics.track('tour_finish', { flowKey, stepsCount })

      this.currentFlow = null
    } catch (error) {
      console.error('[Tour] onFinish 处理失败:', error)
    }
  }

  /**
   * 关闭时的回调（未完成就关闭）
   */
  async onClose(): Promise<void> {
    try {
      if (!this.currentFlow) return

      const flowKey = this.currentFlow.key
      const currentIndex = this.hostRefs?.current.value || 0
      const totalSteps = this.hostRefs?.steps.value.length || 0

      debugLog(`流程 "${flowKey}" 在第 ${currentIndex + 1}/${totalSteps} 步被关闭`)

      // 执行流程关闭钩子
      if (this.currentFlow.onClose) {
        await this.currentFlow.onClose()
      }

      // 可以在这里添加埋点逻辑
      // analytics.track('tour_close', { flowKey, currentStep: currentIndex, totalSteps })

      this.currentFlow = null
    } catch (error) {
      console.error('[Tour] onClose 处理失败:', error)
    }
  }

  /**
   * 过滤可见步骤
   */
  private filterVisibleSteps(steps: TourStep[]): TourStep[] {
    return steps.filter((step) => {
      if (step.visible === undefined) return true
      return typeof step.visible === 'function' ? step.visible() : step.visible
    })
  }

  /**
   * 等待步骤的目标元素出现
   */
  private async waitForStepTarget(step: TourStep): Promise<void> {
    try {
      const target = step.target
      const timeout = this.config.defaultTimeout || 8000

      if (typeof target === 'string') {
        await waitForElement(target, { timeout, throwOnTimeout: false })
      } else if (typeof target === 'function') {
        await waitForElementByFunction(target, { timeout, throwOnTimeout: false })
      }
    } catch (error) {
      console.warn(`[Tour] 等待步骤目标失败: ${step.id}`, error)
    }
  }
}

// 导出单例
export const tourService = new TourService()

// 导出便捷方法
export const startTour = (flowKey: string, options?: TourStartOptions) =>
  tourService.start(flowKey, options)
export const stopTour = () => tourService.stop()
export const resetTour = (flowKey: string) => tourService.reset(flowKey)
export const resetAllTours = () => tourService.resetAll()
export const configureTour = (config: Partial<TourConfig>) => tourService.configure(config)


