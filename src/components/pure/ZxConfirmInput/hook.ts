import { ref, computed, watch, nextTick, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const SUCCESS_CODE_SET = new Set([0, 200, '0', '200'])

/**
 * 表单验证逻辑 Hook
 * @param {Object} props - 组件属性
 */
export function useFormValidation(props) {
  const form = reactive({ value: '' })
  const localValid = ref(!props.requireKeyword)

  // 标准化正则表达式
  const normalizedPattern = computed(() => {
    if (!props.pattern) return null
    if (props.pattern instanceof RegExp) return props.pattern
    try {
      return new RegExp(props.pattern)
    } catch (e) {
      console.warn('Invalid pattern:', props.pattern)
      return null
    }
  })

  // 关键字比较（考虑大小写敏感性）
  const keywordForCompare = computed(() =>
    props.caseSensitive ? props.keyword : props.keyword.toLowerCase()
  )

  const inputForCompare = computed(() =>
    props.caseSensitive ? form.value : form.value.toLowerCase()
  )

  // 异步验证函数
  const isMatch = async () => {
    if (!props.requireKeyword) return true

    // 自定义校验优先
    if (props.validator) {
      try {
        const res = await props.validator(form.value)
        if (res === true) return true
        if (typeof res === 'string') return false // 字符串表示报错信息
        return res !== false
      } catch (error) {
        console.error('Validator error:', error)
        return false
      }
    }

    // 正则校验
    if (normalizedPattern.value) {
      return normalizedPattern.value.test(form.value)
    }

    // 关键字精确匹配；若未提供关键字则要求非空
    if (!props.keyword) return form.value.trim().length > 0
    return inputForCompare.value === keywordForCompare.value
  }

  // 错误提示文本
  const errorText = computed(() => {
    if (normalizedPattern.value) return '输入不符合要求的格式'
    if (props.keyword) return '输入内容与要求不一致'
    return '请输入内容'
  })

  // 表单验证规则
  const rules = {
    value: [
      {
        validator: async (_rule, _val, callback) => {
          if (!props.requireKeyword) return callback()
          const passed = await isMatch()
          if (passed) callback()
          else callback(new Error(errorText.value))
        },
        trigger: 'change'
      }
    ]
  }

  // 监听输入变化，实时验证
  watch(
    () => form.value,
    async () => {
      if (!props.requireKeyword) {
        localValid.value = true
        return
      }
      localValid.value = await isMatch()
    },
    { immediate: true }
  )

  return {
    form,
    localValid,
    rules,
    isMatch,
    errorText,
    normalizedPattern
  }
}

/**
 * 对话框状态管理 Hook
 * @param {Object} props - 组件属性
 * @param {Function} emit - 事件发射器
 */
// 将 emit 统一为函数：既支持 Vue 的 emit 函数，也支持 { eventName: fn } 的对象
function normalizeEmit(emit) {
  if (typeof emit === 'function') return emit
  return (event, ...args) => {
    if (emit && typeof emit[event] === 'function') {
      return emit[event](...args)
    }
  }
}

export function useDialogState(props, emit) {
  const _emit = normalizeEmit(emit)
  const visible = ref(props.modelValue)

  // 双向绑定
  watch(
    () => props.modelValue,
    (v) => (visible.value = v)
  )
  watch(
    () => visible.value,
    (v) => _emit('update:modelValue', v)
  )

  const handleOpen = () => {
    _emit('open')
  }

  const handleClose = () => {
    _emit('close')
  }

  const handleCancel = () => {
    visible.value = false
    _emit('cancel')
  }

  return {
    visible,
    handleOpen,
    handleClose,
    handleCancel
  }
}

/**
 * 确认操作 Hook
 * @param {Object} props - 组件属性
 * @param {Function} emit - 事件发射器
 * @param {Object} formValidation - 表单验证相关数据
 * @param {Object} dialogState - 对话框状态
 */
export function useConfirmAction(props, emit, { form, isMatch, localValid }, dialogState) {
  const _emit = normalizeEmit(emit)
  const internalLoading = ref(false)

  const isResultSuccessful = (result) => {
    if (typeof result === 'boolean') {
      return { ok: result, message: !result ? '操作未成功' : '' }
    }

    if (result && typeof result === 'object') {
      if ('success' in result) {
        return { ok: Boolean(result.success), message: result.message || result.msg || '' }
      }

      if ('ok' in result) {
        return { ok: Boolean(result.ok), message: result.message || result.msg || '' }
      }

      if ('code' in result) {
        const code = result.code
        if (SUCCESS_CODE_SET.has(code)) {
          return { ok: true }
        }
        // 以 2xx 默认成功
        if (typeof code === 'number' && code >= 200 && code < 300) {
          return { ok: true }
        }
        return { ok: false, message: result.message || result.msg || '' }
      }
    }

    if (result === undefined || result === null) {
      return { ok: true }
    }

    return { ok: true }
  }

  // 计算 loading 状态
  const isLoading = computed(() => props.okLoading || internalLoading.value)

  // 计算按钮禁用状态
  const confirmDisabled = computed(() => {
    if (!props.disabledWhenMismatch) {
      return isLoading.value
    }

    // 当要求匹配时，禁用条件：无输入、正在加载、或本地校验未通过
    return !form.value || !localValid.value || isLoading.value
  })

  /**
   * 尝试确认操作
   * @param {Object} formRef - 表单引用
   */
  const tryConfirm = async (formRef) => {
    // 验证输入
    if (props.disabledWhenMismatch && !(await isMatch())) {
      // 触发校验提示
      formRef?.validate?.()
      return
    }

    const payload = { value: form.value }

    // 如果提供了 confirmAction，则执行异步操作
    if (props.confirmAction && typeof props.confirmAction === 'function') {
      internalLoading.value = true
      return Promise.resolve()
        .then(() => props.confirmAction(payload))
        .then((result) => {
          const { ok, message } = isResultSuccessful(result)
          if (!ok) {
            const error: any = new Error(message || '操作未成功，请重试')
            error.result = result
            throw error
          }
          // 成功后关闭对话框并触发确认事件
          if (dialogState && dialogState.visible) {
            dialogState.visible.value = false
          }
          _emit('confirm', { ...payload, result })
          return result
        })
        .catch((error) => {
          const resolvedError =
            error instanceof Error ? error : new Error(error?.message || '操作未成功，请重试')

          // 触发错误事件，但不抛出，让对话框保持打开供用户重试
          _emit('error', { error: resolvedError, payload, result: (resolvedError as any)?.result })

          if (resolvedError.message && props.showErrorMessage !== false) {
            ElMessage.error(resolvedError.message)
          }

          return undefined
        })
        .finally(() => {
          internalLoading.value = false
        })
    } else {
      // 没有提供 confirmAction，关闭对话框并直接触发 confirm 事件
      if (dialogState && dialogState.visible) {
        dialogState.visible.value = false
      }
      _emit('confirm', payload)
      return payload
    }
  }

  return {
    internalLoading,
    isLoading,
    confirmDisabled,
    tryConfirm
  }
}

/**
 * 表单重置 Hook
 * @param {Object} form - 表单数据
 * @param {Object} formRef - 表单引用
 * @param {Object} props - 组件属性
 */
export function useFormReset(form, formRef, props) {
  const resetForm = () => {
    form.value = ''
    nextTick(() => {
      formRef.value?.clearValidate?.()
    })
  }

  const focusInput = () => {
    if (props.autofocus) {
      nextTick(() => {
        const el = document.querySelector('.zx-confirm-input input') as HTMLInputElement
        el?.focus()
      })
    }
  }

  const handleDialogOpen = () => {
    resetForm()
    focusInput()
  }

  return {
    resetForm,
    focusInput,
    handleDialogOpen
  }
}

/**
 * 键盘事件处理 Hook
 */
export function useKeyboardEvents() {
  const handleEnterKey = (event, confirmCallback) => {
    // 阻止事件冒泡，防止 Dialog 接收到 Enter 键事件
    event.preventDefault()
    event.stopPropagation()

    // 调用确认逻辑
    confirmCallback()
  }

  const handleEscapeKey = (event, cancelCallback) => {
    event.preventDefault()
    event.stopPropagation()
    cancelCallback()
  }

  return {
    handleEnterKey,
    handleEscapeKey
  }
}

/**
 * 消息提示 Hook
 */
export function useMessage() {
  const showSuccess = (message) => {
    ElMessage.success(message)
  }

  const showError = (message) => {
    ElMessage.error(message)
  }

  const showWarning = (message) => {
    ElMessage.warning(message)
  }

  const showInfo = (message) => {
    ElMessage.info(message)
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

/**
 * 主要的 ZxConfirmInput Hook
 * 整合所有功能
 */
export function useZxConfirmInput(props, emit) {
  const _emit = normalizeEmit(emit)
  const formRef = ref(null)

  // 表单验证
  const formValidation = useFormValidation(props)

  // 对话框状态
  const dialogState = useDialogState(props, _emit)

  // 确认操作
  const confirmAction = useConfirmAction(props, _emit, formValidation, dialogState)

  // 表单重置
  const formReset = useFormReset(formValidation.form, formRef, props)

  // 键盘事件
  const keyboardEvents = useKeyboardEvents()

  // 消息提示
  const message = useMessage()

  // 监听对话框打开状态
  watch(
    () => dialogState.visible.value,
    (v) => {
      if (v) {
        formReset.handleDialogOpen()
      }
    }
  )

  // 包装确认函数，传入表单引用
  const wrappedTryConfirm = () => confirmAction.tryConfirm(formRef.value)

  // 包装键盘事件处理
  const wrappedHandleEnterKey = (event) => {
    keyboardEvents.handleEnterKey(event, wrappedTryConfirm)
  }

  const wrappedHandleEscapeKey = (event) => {
    keyboardEvents.handleEscapeKey(event, dialogState.handleCancel)
  }

  return {
    // 引用
    formRef,

    // 表单验证
    ...formValidation,

    // 对话框状态
    ...dialogState,

    // 确认操作
    ...confirmAction,
    tryConfirm: wrappedTryConfirm,

    // 表单重置
    ...formReset,

    // 键盘事件（已包装）
    handleEnterKey: wrappedHandleEnterKey,
    handleEscapeKey: wrappedHandleEscapeKey,

    // 消息提示
    ...message
  }
}
