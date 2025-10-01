import { ref, computed, unref, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'

type MaybeRef<T> = T | Ref<T>

export interface DialogOptions {
  // 基础配置
  title?: string
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

  // 开关配置
  switchProps?: {
    showSwitch?: boolean
    switchName?: string
    switchTooltip?: string
    enable?: boolean
  }

  // 样式配置
  dialogSize?: 'small' | 'large'
  noContentPadding?: boolean
  customClass?: string | string[] | object
  headerPadding?: string
  bodyPadding?: string
  footerPadding?: string

  // 回调函数
  onConfirm?: (switchValue?: boolean, result?: unknown) => Promise<unknown> | unknown
  onConfirmError?: (error: unknown) => void
  onCancel?: () => void
  onContinue?: () => void
  onOpen?: () => void
  onClose?: () => void
  onBeforeClose?: () => boolean | Promise<boolean>

  // 表单增强
  formRef?: MaybeRef<FormInstance | null>
  formModel?: MaybeRef<Record<string, unknown> | null>
  autoResetForm?: boolean
  preValidate?: boolean
  autoScrollToError?: boolean
  scrollErrorOffset?: number
}

export interface DialogState {
  visible: boolean
  loading: boolean
  disabled: boolean
  switchValue: boolean
}

export default function useDialog(options: DialogOptions = {}) {
  // 对话框状态
  const visible = ref(false)
  const loading = ref(false)
  const disabled = ref(false)
  const switchValue = ref(options.switchProps?.enable ?? false)

  // 计算属性
  const dialogProps = computed(() => ({
    modelValue: visible.value,
    title: options.title || '提示',
    width: options.width || '50%',
    showCancel: options.showCancel !== false,
    showContinue: options.showContinue || false,
    closable: options.closable !== false,
    maskClosable: options.maskClosable || false,
    okText: options.okText || '确定',
    cancelText: options.cancelText || '取消',
    saveContinueText: options.saveContinueText || '保存并继续',
    okLoading: loading.value,
    okDisabled: disabled.value,
    dialogSize: options.dialogSize || 'small',
    noContentPadding: options.noContentPadding || false,
    customClass: options.customClass || '',
    headerPadding: options.headerPadding,
    bodyPadding: options.bodyPadding,
    footerPadding: options.footerPadding,
    switchProps:
      options.switchProps && options.switchProps.showSwitch
        ? {
            ...options.switchProps,
            enable: switchValue.value
          }
        : undefined,
    formRef: options.formRef !== undefined ? unref(options.formRef) : undefined,
    formModel: options.formModel !== undefined ? unref(options.formModel) : undefined,
    autoResetForm: options.autoResetForm ?? true,
    preValidate: options.preValidate ?? true,
    autoScrollToError: options.autoScrollToError ?? true,
    scrollErrorOffset: options.scrollErrorOffset
  }))

  // 对话框事件处理
  const dialogEvents = computed(() => ({
    'update:modelValue': (val: boolean) => {
      visible.value = val
    },
    confirm: async (result?: unknown) => {
      if (!options.onConfirm) {
        visible.value = false
        return
      }
      loading.value = true
      try {
        const actionResult = await options.onConfirm(switchValue.value, result)
        if (actionResult !== false) {
          visible.value = false
        }
      } catch (error) {
        console.error('Dialog confirm error:', error)
        options.onConfirmError?.(error)
        // 不关闭对话框，让用户处理错误
      } finally {
        loading.value = false
      }
    },
    cancel: () => {
      if (options.onCancel) {
        options.onCancel()
      }
      visible.value = false
    },
    continue: () => {
      if (options.onContinue) {
        options.onContinue()
      }
    },
    open: () => {
      if (options.onOpen) {
        options.onOpen()
      }
    },
    close: () => {
      if (options.onClose) {
        options.onClose()
      }
    },
    'confirm-error': (error: unknown) => {
      options.onConfirmError?.(error)
    }
  }))

  // 公共方法
  const open = () => {
    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const setDisabled = (isDisabled: boolean) => {
    disabled.value = isDisabled
  }

  const setSwitchValue = (value: boolean) => {
    switchValue.value = value
  }

  // 更新配置
  const updateOptions = (newOptions: Partial<DialogOptions>) => {
    Object.assign(options, newOptions)
  }

  return {
    // 状态
    visible,
    loading,
    disabled,
    switchValue,

    // 计算属性
    dialogProps,
    dialogEvents,

    // 方法
    open,
    close,
    setLoading,
    setDisabled,
    setSwitchValue,
    updateOptions
  }
}
