import { ref, computed, reactive } from 'vue'
import useDialogState from './useDialogState.js'

/**
 * 表单对话框 Hook
 * 专门处理包含表单的对话框，支持表单验证、提交、重置等
 *
 * @param {Object} options - 配置选项
 * @param {Array} [options.fields] - 表单字段配置
 * @param {Object} [options.initialData] - 初始表单数据
 * @param {Object} [options.validationRules] - 验证规则
 * @param {Function} [options.onSubmit] - 提交回调函数
 * @param {Function} [options.onReset] - 重置回调函数
 * @param {boolean} [options.showReset] - 是否显示重置按钮
 * @param {string} [options.submitText] - 提交按钮文本
 * @param {string} [options.resetText] - 重置按钮文本
 */
export default function useDialogForm(options = {}) {
  // 继承基础状态
  const dialogState = useDialogState(options)

  // 表单相关状态
  const formData = reactive({ ...options.initialData })
  const formRef = ref()
  const errors = ref({})
  const touched = ref({})

  // 表单属性
  const formProps = computed(() => ({
    ...dialogState.baseProps.value,
    showReset: options.showReset || false,
    submitText: options.submitText || '提交',
    resetText: options.resetText || '重置',
    formRef: formRef.value,
    formModel: formData,
    autoResetForm: options.autoResetForm !== false,
    preValidate: options.preValidate !== false,
    autoScrollToError: options.autoScrollToError !== false,
    scrollErrorOffset: options.scrollErrorOffset || 24
  }))

  // 表单事件
  const formEvents = computed(() => ({
    ...dialogState.baseEvents.value,
    confirm: async () => {
      if (await validateForm()) {
        if (options.onSubmit) {
          dialogState.setLoading(true)
          try {
            const submitResult = await options.onSubmit(formData)
            if (submitResult !== false) {
              dialogState.close()
            }
          } catch (error) {
            console.error('Form submit error:', error)
          } finally {
            dialogState.setLoading(false)
          }
        } else {
          dialogState.close()
        }
      }
    },
    cancel: () => {
      resetForm()
      clearErrors()
      dialogState.close()
    }
  }))

  // 表单验证
  const validateForm = async () => {
    if (formRef.value) {
      try {
        await formRef.value.validate()
        return true
      } catch (error) {
        return false
      }
    }
    return true
  }

  // 验证单个字段
  const validateField = (fieldKey) => {
    const field = options.fields?.find((f) => f.key === fieldKey)
    if (!field) return true

    const value = formData[fieldKey]

    // 必填验证
    if (field.required && (!value || value === '')) {
      errors.value[fieldKey] = `${field.label}是必填项`
      return false
    }

    // 自定义规则验证
    if (field.rules) {
      for (const rule of field.rules) {
        if (rule.validator) {
          const result = rule.validator(value)
          if (result !== true) {
            errors.value[fieldKey] = rule.message || '验证失败'
            return false
          }
        }
      }
    }

    delete errors.value[fieldKey]
    return true
  }

  // 重置表单
  const resetForm = () => {
    Object.keys(formData).forEach((key) => {
      if (options.initialData?.[key] !== undefined) {
        formData[key] = options.initialData[key]
      } else {
        delete formData[key]
      }
    })

    if (options.onReset) {
      options.onReset()
    }
  }

  // 清除错误
  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
  }

  // 设置字段值
  const setFieldValue = (key, value) => {
    formData[key] = value
    touched.value[key] = true
    validateField(key)
  }

  // 获取字段错误
  const getFieldError = (key) => {
    return touched.value[key] ? errors.value[key] : undefined
  }

  // 设置表单数据
  const setFormData = (data) => {
    Object.assign(formData, data)
  }

  return {
    // 继承基础状态和方法
    ...dialogState,

    // 表单状态
    formData,
    formRef,
    errors,
    touched,

    // 计算属性
    formProps,
    formEvents,

    // 方法
    validateForm,
    validateField,
    resetForm,
    clearErrors,
    setFieldValue,
    getFieldError,
    setFormData
  }
}
