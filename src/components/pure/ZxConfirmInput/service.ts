import { createApp, h, nextTick, AppContext, App } from 'vue'
import ZxConfirmInputComponent from './index.vue'

// 全局应用上下文
let hostAppContext: AppContext | null = null

interface ConfirmInputOptions {
  rejectOnError?: boolean
  onConfirm?: (payload: any) => void
  onCancel?: () => void
  onClose?: () => void
  onError?: (payload: any) => void
  [key: string]: any
}

interface ConfirmInputPayload {
  error?: Error
  [key: string]: any
}

/**
 * 设置宿主应用上下文
 * @param {Object} appContext Vue 应用上下文
 */
export const setHostAppContext = (appContext: AppContext) => {
  hostAppContext = appContext
}

/**
 * 创建确认输入对话框实例
 * @param {Object} options 配置选项
 * @returns {Promise} 返回 Promise，resolve 时传入用户输入的值
 */
export const createConfirmInput = (options: ConfirmInputOptions = {}) => {
  const {
    rejectOnError = false,
    onConfirm: userOnConfirm,
    onCancel: userOnCancel,
    onClose: userOnClose,
    onError: userOnError,
    ...componentOptions
  } = options

  return new Promise((resolve, reject) => {
    // 创建容器
    const container = document.createElement('div')
    document.body.appendChild(container)

    let app: App | null = null
    let cleaned = false
    let settled = false

    const cleanup = () => {
      if (cleaned) return
      cleaned = true
      nextTick(() => {
        app?.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      })
    }

    const resolveOnce = (payload: any) => {
      if (settled) return
      settled = true
      cleanup()
      resolve(payload)
    }

    const rejectOnce = (error: Error) => {
      if (settled) return
      settled = true
      cleanup()
      reject(error)
    }

    // 创建 Vue 应用实例
    app = createApp({
      render() {
        return h(ZxConfirmInputComponent, {
          modelValue: true,
          ...componentOptions,
          onConfirm: (payload: any) => {
            userOnConfirm?.(payload)
            resolveOnce(payload)
          },
          onCancel: () => {
            userOnCancel?.()
            rejectOnce(new Error('用户取消操作'))
          },
          onClose: () => {
            userOnClose?.()
            rejectOnce(new Error('对话框关闭'))
          },
          onError: (payload: ConfirmInputPayload) => {
            if (settled) return

            userOnError?.(payload)

            if (rejectOnError) {
              // 仅在明确要求时才对外拒绝 Promise；不清理，允许用户修正后重试
              reject(payload?.error ?? new Error('确认操作失败'))
            }
          }
        })
      }
    })

    // 如果有宿主应用上下文，使用它
    if (hostAppContext) {
      ;(app as any)._context.provides = {
        ...hostAppContext.provides,
        ...(app as any)._context.provides
      }
      ;(app as any)._context.components = {
        ...hostAppContext.components,
        ...(app as any)._context.components
      }
      ;(app as any)._context.directives = {
        ...hostAppContext.directives,
        ...(app as any)._context.directives
      }
      ;(app as any)._context.mixins = [
        ...(hostAppContext.mixins || []),
        ...((app as any)._context.mixins || [])
      ]
    }

    // 挂载应用
    app.mount(container)
  })
}

/**
 * 危险操作确认（红色主题）
 * @param {Object} options 配置选项
 */
export const danger = (options: ConfirmInputOptions = {}) => {
  const defaultOptions = {
    tone: 'danger',
    okText: '确认删除',
    title: '危险操作确认'
  }
  return createConfirmInput({ ...defaultOptions, ...options })
}

/**
 * 警告操作确认（橙色主题）
 * @param {Object} options 配置选项
 */
export const warning = (options: ConfirmInputOptions = {}) => {
  const defaultOptions = {
    tone: 'warning',
    okText: '确认操作',
    title: '警告'
  }
  return createConfirmInput({ ...defaultOptions, ...options })
}

/**
 * 信息确认（蓝色主题）
 * @param {Object} options 配置选项
 */
export const info = (options: ConfirmInputOptions = {}) => {
  const defaultOptions = {
    tone: 'info',
    okText: '确认',
    title: '信息确认'
  }
  return createConfirmInput({ ...defaultOptions, ...options })
}

// 主服务对象
export const service = {
  create: createConfirmInput,
  danger,
  warning,
  info
}

// 默认导出
export default {
  setHostAppContext,
  createConfirmInput,
  service,
  danger,
  warning,
  info
}

// 将服务暴露到全局变量，供 index.js 使用
if (typeof window !== 'undefined') {
  ;(window as any).__ZxConfirmInputService = {
    setHostAppContext,
    createConfirmInput,
    service,
    danger,
    warning,
    info
  }
}
