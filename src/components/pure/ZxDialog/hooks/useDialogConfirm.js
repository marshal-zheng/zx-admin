import { ref, computed } from 'vue'
import useDialogState from './useDialogState.js'

/**
 * 确认对话框 Hook
 * 专门处理需要用户确认的对话框，支持异步操作、多按钮等
 *
 * @param {Object} options - 配置选项
 * @param {string} [options.okText] - 确认按钮文本
 * @param {string} [options.cancelText] - 取消按钮文本
 * @param {string} [options.saveContinueText] - 保存并继续按钮文本
 * @param {boolean} [options.showCancel] - 是否显示取消按钮
 * @param {boolean} [options.showContinue] - 是否显示继续按钮
 * @param {Function} [options.onConfirm] - 确认回调函数
 * @param {Function} [options.onCancel] - 取消回调函数
 * @param {Function} [options.onContinue] - 继续回调函数
 * @param {Function} [options.onBeforeClose] - 关闭前回调函数
 */
export default function useDialogConfirm(options = {}) {
  // 继承基础状态
  const dialogState = useDialogState(options)

  // 确认对话框特有状态
  const switchValue = ref(false)

  // 扩展属性
  const confirmProps = computed(() => ({
    ...dialogState.baseProps.value,
    okText: options.okText || '确定',
    cancelText: options.cancelText || '取消',
    saveContinueText: options.saveContinueText || '保存并继续',
    showCancel: options.showCancel !== false,
    showContinue: options.showContinue || false
  }))

  // 确认事件处理
  const confirmEvents = computed(() => ({
    ...dialogState.baseEvents.value,
    confirm: async () => {
      if (options.onConfirm) {
        dialogState.setLoading(true)
        try {
          await options.onConfirm(switchValue.value)
          dialogState.close()
        } catch (error) {
          console.error('Dialog confirm error:', error)
          // 发生错误时不关闭对话框，让用户处理
        } finally {
          dialogState.setLoading(false)
        }
      } else {
        dialogState.close()
      }
    },
    cancel: () => {
      if (options.onCancel) {
        options.onCancel()
      }
      dialogState.close()
    },
    continue: () => {
      if (options.onContinue) {
        options.onContinue()
      }
    }
  }))

  // 处理关闭前的回调
  const handleBeforeClose = async (done) => {
    if (options.onBeforeClose) {
      try {
        const canClose = await options.onBeforeClose()
        if (canClose) {
          done()
        }
      } catch (error) {
        console.error('Before close error:', error)
      }
    } else {
      done()
    }
  }

  // 设置开关值
  const setSwitchValue = (value) => {
    switchValue.value = value
  }

  return {
    // 继承基础状态和方法
    ...dialogState,

    // 确认对话框特有状态
    switchValue,

    // 计算属性
    confirmProps,
    confirmEvents,

    // 方法
    setSwitchValue,
    handleBeforeClose
  }
}
