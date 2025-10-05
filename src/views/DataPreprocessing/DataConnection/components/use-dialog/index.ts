import { ref, computed, unref, reactive, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'

type MaybeRef<T> = T | Ref<T>

export interface DialogOptions<T = any> {
  // 基础配置
  title?: string | ((data: T) => string)
  width?: string | number

  // 功能配置
  showCancel?: boolean
  showContinue?: boolean
  closable?: boolean
  maskClosable?: boolean

  // 文本配置
  okText?: string
  cancelText?: string
  saveContinueText?: string

  // 样式配置
  dialogSize?: 'small' | 'large'
  noContentPadding?: boolean
  customClass?: string | string[] | object
  headerPadding?: string
  bodyPadding?: string
  footerPadding?: string
  draggable?: boolean

  // 数据配置
  defaultData?: () => T
  dataTransform?: (rawData: any) => T

  // 回调函数
  onConfirm?: (data: T) => Promise<unknown> | unknown
  onConfirmError?: (error: unknown) => void
  onCancel?: (data: T) => void
  onContinue?: (data: T) => void
  onOpen?: (data: T) => void
  onClose?: (data: T) => void
  onBeforeClose?: (data: T) => boolean | Promise<boolean>
  onDataChange?: (data: T, key?: keyof T) => void

  // 表单增强
  formRef?: MaybeRef<FormInstance | null>
  autoResetForm?: boolean
  preValidate?: boolean
  autoScrollToError?: boolean
  scrollErrorOffset?: number
}

export interface DialogState<T = any> {
  visible: boolean
  loading: boolean
  disabled: boolean
  title: string
  data: T
}

export function useDialog<T extends Record<string, any> = Record<string, any>>(
  options: DialogOptions<T> = {}
) {
  // 获取默认数据
  const getDefaultData = (): T => {
    if (options.defaultData) {
      return options.defaultData()
    }
    return {} as T
  }

  // 对话框状态 - 使用 reactive 统一管理
  const state = reactive<DialogState<T>>({
    visible: false,
    loading: false,
    disabled: false,
    title: typeof options.title === 'string' ? options.title : '提示',
    data: getDefaultData()
  })

  // 初始数据快照（用于重置）
  const initialDataSnapshot = ref<T>(getDefaultData())

  // 深拷贝工具
  const deepClone = <K>(obj: K): K => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as any
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
    if (obj instanceof Object) {
      const clonedObj = {} as K
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = deepClone(obj[key])
        }
      }
      return clonedObj
    }
    return obj
  }

  // 计算 title（支持函数形式）
  const computedTitle = computed(() => {
    if (typeof options.title === 'function') {
      return options.title(state.data as T)
    }
    return state.title
  })

  // 计算属性
  const dialogProps = computed(() => ({
    modelValue: state.visible,
    title: computedTitle.value,
    width: options.width || '50%',
    showCancel: options.showCancel !== false,
    showContinue: options.showContinue || false,
    closable: options.closable !== false,
    maskClosable: options.maskClosable || false,
    okText: options.okText || '确定',
    cancelText: options.cancelText || '取消',
    saveContinueText: options.saveContinueText || '保存并继续',
    okLoading: state.loading,
    okDisabled: state.disabled,
    dialogSize: options.dialogSize || 'small',
    noContentPadding: options.noContentPadding || false,
    customClass: options.customClass || '',
    headerPadding: options.headerPadding,
    bodyPadding: options.bodyPadding,
    footerPadding: options.footerPadding,
    draggable: options.draggable,
    formRef: options.formRef !== undefined ? unref(options.formRef) : undefined,
    formModel: state.data,
    autoResetForm: options.autoResetForm ?? true,
    preValidate: options.preValidate ?? true,
    autoScrollToError: options.autoScrollToError ?? true,
    scrollErrorOffset: options.scrollErrorOffset
  }))

  // 对话框事件处理
  const dialogEvents = computed(() => ({
    'update:modelValue': (val: boolean) => {
      state.visible = val
    },
    confirm: async (result?: unknown) => {
      if (!options.onConfirm) {
        state.visible = false
        return
      }
      state.loading = true
      try {
        const actionResult = await options.onConfirm(state.data as T)
        if (actionResult !== false) {
          state.visible = false
        }
      } catch (error) {
        console.error('Dialog confirm error:', error)
        options.onConfirmError?.(error)
      } finally {
        state.loading = false
      }
    },
    cancel: () => {
      options.onCancel?.(state.data as T)
      state.visible = false
    },
    continue: () => {
      options.onContinue?.(state.data as T)
    },
    open: () => {
      options.onOpen?.(state.data as T)
    },
    close: () => {
      options.onClose?.(state.data as T)
      resetData()
    },
    'confirm-error': (error: unknown) => {
      options.onConfirmError?.(error)
    }
  }))

  // 重置数据到初始状态
  const resetData = () => {
    state.data = deepClone(initialDataSnapshot.value)
    state.title = typeof options.title === 'string' ? options.title : '提示'
  }

  // 打开对话框
  const open = (data?: Partial<T> | T, title?: string) => {
    if (data) {
      // 支持数据转换
      const transformedData = options.dataTransform
        ? options.dataTransform(data)
        : data

      // 合并数据
      const mergedData = {
        ...getDefaultData(),
        ...transformedData
      } as T
      state.data = mergedData as any

      // 更新初始快照
      initialDataSnapshot.value = deepClone(mergedData)
    } else {
      // 重置为默认数据
      const defaultData = getDefaultData()
      state.data = defaultData as any
      initialDataSnapshot.value = deepClone(defaultData)
    }

    if (title) {
      state.title = title
    }

    state.visible = true
  }

  // 关闭对话框
  const close = () => {
    state.visible = false
  }

  // 更新单个字段
  const updateField = <K extends keyof T>(key: K, value: T[K]) => {
    (state.data as T)[key] = value
    options.onDataChange?.(state.data as T, key)
  }

  // 批量更新数据
  const updateData = (data: Partial<T>) => {
    Object.assign(state.data as T, data)
    options.onDataChange?.(state.data as T)
  }

  // 设置完整数据
  const setData = (data: T) => {
    state.data = deepClone(data) as any
    options.onDataChange?.(state.data as T)
  }

  // 设置 title
  const setTitle = (title: string) => {
    state.title = title
  }

  const setLoading = (isLoading: boolean) => {
    state.loading = isLoading
  }

  const setDisabled = (isDisabled: boolean) => {
    state.disabled = isDisabled
  }

  // 更新配置
  const updateOptions = (newOptions: Partial<DialogOptions<T>>) => {
    Object.assign(options, newOptions)
  }

  return {
    // 状态（使用 reactive 的 state）
    state,

    // 计算属性
    dialogProps,
    dialogEvents,

    // 方法
    open,
    close,
    updateField,
    updateData,
    setData,
    setTitle,
    setLoading,
    setDisabled,
    resetData,
    updateOptions
  }
}

// 导出类型
export type UseDialogReturn<T extends Record<string, any> = Record<string, any>> = ReturnType<typeof useDialog<T>>
