/**
 * Tour 引导流程完成状态存储管理
 */

import type { TourStorageFlags } from './types'
import { safeStorage } from './utils'

// 默认存储键
const DEFAULT_STORAGE_KEY = 'app_tour_flags'

/**
 * 存储管理类
 */
export class TourStorage {
  private storageKey: string

  constructor(storagePrefix: string = 'app') {
    this.storageKey = `${storagePrefix}_tour_flags`
  }

  /**
   * 读取所有完成标记
   */
  private readFlags(): TourStorageFlags {
    try {
      const raw = safeStorage.get(this.storageKey)
      if (!raw) return {}
      return JSON.parse(raw) as TourStorageFlags
    } catch (error) {
      console.error('[TourStorage] 读取标记失败:', error)
      return {}
    }
  }

  /**
   * 写入所有完成标记
   */
  private writeFlags(flags: TourStorageFlags): boolean {
    try {
      const raw = JSON.stringify(flags)
      return safeStorage.set(this.storageKey, raw)
    } catch (error) {
      console.error('[TourStorage] 写入标记失败:', error)
      return false
    }
  }

  /**
   * 检查指定流程是否应该运行
   * @param flowKey 流程标识
   * @returns true 表示应该运行，false 表示已完成不应再运行
   */
  shouldRun(flowKey: string): boolean {
    const flags = this.readFlags()
    const flag = flags[flowKey]
    return !flag || !flag.completed
  }

  /**
   * 标记指定流程为已完成
   */
  markCompleted(flowKey: string, stepsCompleted?: number): boolean {
    const flags = this.readFlags()
    flags[flowKey] = {
      completed: true,
      timestamp: Date.now(),
      stepsCompleted
    }
    return this.writeFlags(flags)
  }

  /**
   * 标记指定流程为未完成（重置）
   */
  markIncomplete(flowKey: string): boolean {
    const flags = this.readFlags()
    delete flags[flowKey]
    return this.writeFlags(flags)
  }

  /**
   * 获取指定流程的完成信息
   */
  getCompletionInfo(flowKey: string) {
    const flags = this.readFlags()
    return flags[flowKey] || null
  }

  /**
   * 获取所有完成信息
   */
  getAllCompletionInfo(): TourStorageFlags {
    return this.readFlags()
  }

  /**
   * 清除所有完成标记
   */
  clearAll(): boolean {
    return safeStorage.remove(this.storageKey)
  }

  /**
   * 批量重置指定流程
   */
  resetFlows(flowKeys: string[]): boolean {
    const flags = this.readFlags()
    flowKeys.forEach((key) => {
      delete flags[key]
    })
    return this.writeFlags(flags)
  }
}

// 导出默认实例
export const tourStorage = new TourStorage()

// 导出便捷方法
export const shouldRun = (flowKey: string) => tourStorage.shouldRun(flowKey)
export const markCompleted = (flowKey: string, stepsCompleted?: number) =>
  tourStorage.markCompleted(flowKey, stepsCompleted)
export const markIncomplete = (flowKey: string) => tourStorage.markIncomplete(flowKey)
export const getCompletionInfo = (flowKey: string) => tourStorage.getCompletionInfo(flowKey)
export const clearAll = () => tourStorage.clearAll()


