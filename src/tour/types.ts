/**
 * Tour 引导系统类型定义
 */

import type { Ref } from 'vue'
import type { TourProps } from 'element-plus'

/**
 * 引导步骤定义
 */
export interface TourStep {
  /** 步骤唯一标识 */
  id: string
  /** 目标元素选择器或获取函数 */
  target: string | (() => HTMLElement | null)
  /** 步骤标题 */
  title: string
  /** 步骤描述 */
  description?: string
  /** 气泡位置 */
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'
  /** 是否显示该步骤（支持条件渲染） */
  visible?: boolean | (() => boolean)
  /** 步骤进入前的钩子 */
  onEnter?: () => void | Promise<void>
  /** 步骤离开前的钩子 */
  onLeave?: () => void | Promise<void>
}

/**
 * 引导流程配置
 */
export interface TourFlow {
  /** 流程唯一标识 */
  key: string
  /** 流程名称 */
  name: string
  /** 步骤列表 */
  steps: TourStep[]
  /** 优先级（数字越大优先级越高） */
  priority?: number
  /** 是否只触发一次 */
  once?: boolean
  /** 流程开始前的钩子 */
  onStart?: () => void | Promise<void>
  /** 流程完成时的钩子 */
  onFinish?: () => void | Promise<void>
  /** 流程关闭时的钩子（未完成就关闭） */
  onClose?: () => void | Promise<void>
}

/**
 * 宿主组件引用
 */
export interface TourHostRefs {
  /** 是否显示引导 */
  open: Ref<boolean>
  /** 当前步骤索引 */
  current: Ref<number>
  /** 当前显示的步骤列表 */
  steps: Ref<TourStep[]>
}

/**
 * 启动选项
 */
export interface TourStartOptions {
  /** 强制启动（忽略一次性限制） */
  force?: boolean
  /** 从指定步骤开始 */
  startFrom?: number
  /** 自定义步骤列表（覆盖注册表中的步骤） */
  customSteps?: TourStep[]
}

/**
 * 等待元素选项
 */
export interface WaitForElementOptions {
  /** 超时时间（毫秒） */
  timeout?: number
  /** 轮询间隔（毫秒） */
  interval?: number
  /** 是否在超时后抛出错误 */
  throwOnTimeout?: boolean
}

/**
 * 存储标记类型
 */
export interface TourStorageFlags {
  [flowKey: string]: {
    /** 是否已完成 */
    completed: boolean
    /** 完成时间戳 */
    timestamp: number
    /** 完成的步骤数 */
    stepsCompleted?: number
  }
}

/**
 * Tour 服务接口
 */
export interface ITourService {
  /** 挂载宿主组件 */
  mount(refs: TourHostRefs): void
  /** 启动指定引导流程 */
  start(flowKey: string, options?: TourStartOptions): Promise<boolean>
  /** 停止当前引导 */
  stop(): void
  /** 跳到指定步骤 */
  goToStep(index: number): void
  /** 获取当前流程 */
  getCurrentFlow(): TourFlow | null
  /** 重置指定流程的完成状态 */
  reset(flowKey: string): void
  /** 重置所有流程 */
  resetAll(): void
  /** 步骤变化回调 */
  onChange(index: number): void
  /** 完成回调 */
  onFinish(): void
  /** 关闭回调 */
  onClose(): void
}

/**
 * Tour 配置
 */
export interface TourConfig {
  /** 全局遮罩配置 */
  mask?: TourProps['mask']
  /** 全局 z-index */
  zIndex?: number
  /** 全局滚动配置 */
  scrollIntoViewOptions?: ScrollIntoViewOptions
  /** 是否启用调试模式 */
  debug?: boolean
  /** 默认等待元素超时时间 */
  defaultTimeout?: number
  /** 存储键前缀 */
  storagePrefix?: string
}


