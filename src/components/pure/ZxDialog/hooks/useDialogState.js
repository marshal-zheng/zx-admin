import { ref, computed } from 'vue'

/**
 * 对话框基础状态管理 Hook
 * 负责管理对话框的显示/隐藏、加载状态、禁用状态等基础状态
 *
 * @param {Object} options - 配置选项
 * @param {string} [options.title] - 对话框标题
 * @param {string|number} [options.width] - 对话框宽度
 * @param {string} [options.dialogSize] - 对话框尺寸 'small' | 'large'
 * @param {boolean} [options.closable] - 是否显示关闭按钮
 * @param {boolean} [options.maskClosable] - 点击遮罩是否关闭
 * @param {string|Array|Object} [options.customClass] - 自定义类名
 * @param {boolean} [options.noContentPadding] - 是否去除内容区域padding
 * @param {string} [options.headerPadding] - 头部 padding
 * @param {string} [options.bodyPadding] - 内容 padding
 * @param {string} [options.footerPadding] - 底部 padding
 */
export default function useDialogState(options = {}) {
  // 基础状态
  const visible = ref(false)
  const loading = ref(false)
  const disabled = ref(false)

  // 计算对话框基础属性
  const baseProps = computed(() => ({
    modelValue: visible.value,
    title: options.title || '提示',
    width: options.width || '50%',
    dialogSize: options.dialogSize || 'small',
    closable: options.closable !== false,
    maskClosable: options.maskClosable || false,
    customClass: options.customClass || '',
    noContentPadding: options.noContentPadding || false,
    okLoading: loading.value,
    okDisabled: disabled.value,
    headerPadding: options.headerPadding,
    bodyPadding: options.bodyPadding,
    footerPadding: options.footerPadding
  }))

  // 基础事件
  const baseEvents = computed(() => ({
    'update:modelValue': (val) => {
      visible.value = val
    }
  }))

  // 控制方法
  const open = () => {
    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  const setDisabled = (isDisabled) => {
    disabled.value = isDisabled
  }

  const toggle = () => {
    visible.value = !visible.value
  }

  return {
    // 状态
    visible,
    loading,
    disabled,

    // 计算属性
    baseProps,
    baseEvents,

    // 方法
    open,
    close,
    toggle,
    setLoading,
    setDisabled
  }
}
