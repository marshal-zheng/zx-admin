/**
 * Tour 引导流程注册表
 * 集中管理所有引导流程的配置
 */

import type { TourFlow, TourStep } from './types'

/**
 * 引导流程注册表
 */
class TourRegistry {
  private flows: Map<string, TourFlow> = new Map()

  /**
   * 注册一个引导流程
   */
  register(flow: TourFlow): void {
    if (this.flows.has(flow.key)) {
      console.warn(`[TourRegistry] 流程 "${flow.key}" 已存在，将被覆盖`)
    }
    this.flows.set(flow.key, flow)
  }

  /**
   * 批量注册引导流程
   */
  registerAll(flows: TourFlow[]): void {
    flows.forEach((flow) => this.register(flow))
  }

  /**
   * 获取指定引导流程
   */
  get(flowKey: string): TourFlow | undefined {
    return this.flows.get(flowKey)
  }

  /**
   * 检查流程是否存在
   */
  has(flowKey: string): boolean {
    return this.flows.has(flowKey)
  }

  /**
   * 获取所有流程
   */
  getAll(): TourFlow[] {
    return Array.from(this.flows.values())
  }

  /**
   * 按优先级排序获取所有流程
   */
  getAllSorted(): TourFlow[] {
    return this.getAll().sort((a, b) => {
      const priorityA = a.priority ?? 0
      const priorityB = b.priority ?? 0
      return priorityB - priorityA // 降序
    })
  }

  /**
   * 注销指定流程
   */
  unregister(flowKey: string): boolean {
    return this.flows.delete(flowKey)
  }

  /**
   * 清空所有流程
   */
  clear(): void {
    this.flows.clear()
  }

  /**
   * 获取流程数量
   */
  get size(): number {
    return this.flows.size
  }
}

// 导出单例
export const tourRegistry = new TourRegistry()

// ==================== 示例流程定义 ====================

/**
 * 示例：首页引导步骤
 * 在实际业务中，可以在独立文件中定义具体的引导流程
 */
export const exampleHomeSteps: TourStep[] = [
  {
    id: 'home.welcome',
    target: '#app-logo', // 假设存在的元素
    title: '欢迎使用系统',
    description: '这是一个示例引导步骤，展示如何使用 Tour 功能',
    placement: 'bottom'
  },
  {
    id: 'home.menu',
    target: () => document.querySelector('.menu-container') as HTMLElement,
    title: '导航菜单',
    description: '通过左侧菜单可以访问各个功能模块',
    placement: 'right'
  }
]

/**
 * 示例：首页引导流程
 */
export const exampleHomeFlow: TourFlow = {
  key: 'onboarding.home',
  name: '首页引导',
  steps: exampleHomeSteps,
  priority: 10,
  once: true,
  onStart: async () => {
    console.log('[Tour] 首页引导开始')
  },
  onFinish: async () => {
    console.log('[Tour] 首页引导完成')
  },
  onClose: async () => {
    console.log('[Tour] 首页引导关闭')
  }
}

// 默认注册示例流程（仅用于演示，实际使用时可以移除）
if (import.meta.env.DEV) {
  // tourRegistry.register(exampleHomeFlow)
}


