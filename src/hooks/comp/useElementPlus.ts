import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'

// 类型定义
interface MessageOptions {
  duration?: number
  showClose?: boolean
  center?: boolean
  dangerouslyUseHTMLString?: boolean
  customClass?: string
  iconClass?: string
  id?: string
  zIndex?: number
  offset?: number
  appendTo?: string | HTMLElement
  grouping?: boolean
  repeatNum?: number
  onClose?: () => void
}

interface NotificationOptions {
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showClose?: boolean
  dangerouslyUseHTMLString?: boolean
  customClass?: string
  iconClass?: string
  zIndex?: number
  offset?: number
  appendTo?: string | HTMLElement
  onClick?: () => void
  onClose?: () => void
}

interface MessageBoxOptions {
  confirmButtonText?: string
  cancelButtonText?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  center?: boolean
  lockScroll?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  beforeClose?: (action: string, instance: any, done: () => void) => void
  distinguishCancelAndClose?: boolean
  cancelButtonClass?: string
  confirmButtonClass?: string
  customClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  closeOnHashChange?: boolean
  showInput?: boolean
  inputPlaceholder?: string
  inputType?: string
  inputValue?: string
  inputPattern?: RegExp
  inputValidator?: (value: string) => boolean | string
  inputErrorMessage?: string
}

interface LoadingOptions {
  target?: string | HTMLElement
  body?: boolean
  fullscreen?: boolean
  lock?: boolean
  text?: string
  spinner?: string
  background?: string
  customClass?: string
}

/**
 * Element Plus Message utilities
 */
export function useMessage() {
  const showMessage = (
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    options: MessageOptions = {}
  ) => {
    return ElMessage({
      message,
      type,
      duration: 3000,
      showClose: true,
      ...options
    })
  }

  const showSuccess = (message: string, options: MessageOptions = {}) =>
    showMessage(message, 'success', options)
  const showWarning = (message: string, options: MessageOptions = {}) =>
    showMessage(message, 'warning', options)
  const showError = (message: string, options: MessageOptions = {}) =>
    showMessage(message, 'error', options)
  const showInfo = (message: string, options: MessageOptions = {}) =>
    showMessage(message, 'info', options)

  return {
    showMessage,
    showSuccess,
    showWarning,
    showError,
    showInfo
  }
}

/**
 * Element Plus MessageBox utilities
 */
export function useMessageBox() {
  const showConfirm = (title: string, message: string, options: MessageBoxOptions = {}) => {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      ...options
    })
  }

  const showAlert = (title: string, message: string, options: MessageBoxOptions = {}) => {
    return ElMessageBox.alert(message, title, {
      confirmButtonText: '确定',
      type: 'info',
      ...options
    })
  }

  const showPrompt = (title: string, message: string, options: MessageBoxOptions = {}) => {
    return ElMessageBox.prompt(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'text',
      ...options
    })
  }

  return {
    showConfirm,
    showAlert,
    showPrompt
  }
}

/**
 * Element Plus Notification utilities
 */
export function useNotification() {
  const showNotification = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    options: NotificationOptions = {}
  ) => {
    return ElNotification({
      title,
      message,
      type,
      duration: 4500,
      position: 'top-right',
      ...options
    })
  }

  const showSuccess = (title: string, message: string, options: NotificationOptions = {}) =>
    showNotification(title, message, 'success', options)

  const showWarning = (title: string, message: string, options: NotificationOptions = {}) =>
    showNotification(title, message, 'warning', options)

  const showError = (title: string, message: string, options: NotificationOptions = {}) =>
    showNotification(title, message, 'error', options)

  const showInfo = (title: string, message: string, options: NotificationOptions = {}) =>
    showNotification(title, message, 'info', options)

  return {
    showNotification,
    showSuccess,
    showWarning,
    showError,
    showInfo
  }
}

/**
 * Element Plus Loading utilities
 */
export function useLoading() {
  const loading = ref(false)

  const showLoading = (options: LoadingOptions = {}) => {
    loading.value = true
    return ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
      ...options
    })
  }

  const hideLoading = (loadingInstance?: any) => {
    loading.value = false
    if (loadingInstance) {
      loadingInstance.close()
    }
  }

  return {
    loading: computed(() => loading.value),
    showLoading,
    hideLoading
  }
}

/**
 * Element Plus Table utilities
 */
export function useTable() {
  const tableData = ref<any[]>([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const multipleSelection = ref<any[]>([])

  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper'
  })

  const handleSelectionChange = (selection: any[]) => {
    multipleSelection.value = selection
  }

  const handlePageChange = (page: number) => {
    currentPage.value = page
    pagination.currentPage = page
  }

  const handleSizeChange = (size: number) => {
    pageSize.value = size
    pagination.pageSize = size
    currentPage.value = 1
    pagination.currentPage = 1
  }

  const resetPagination = () => {
    currentPage.value = 1
    pageSize.value = 10
    pagination.currentPage = 1
    pagination.pageSize = 10
  }

  return {
    tableData,
    loading,
    total,
    currentPage,
    pageSize,
    multipleSelection,
    pagination,
    handleSelectionChange,
    handlePageChange,
    handleSizeChange,
    resetPagination
  }
}

/**
 * Element Plus Form utilities
 */
export function useForm<T extends Record<string, any>>(initialForm: T = {} as T) {
  const form = reactive<T>({ ...initialForm })
  const formRef = ref<FormInstance>()
  const loading = ref(false)

  const validateForm = async (): Promise<boolean> => {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    Object.assign(form, initialForm)
  }

  const clearValidation = () => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }

  const validateField = (field: string | string[]) => {
    if (formRef.value) {
      formRef.value.validateField(field)
    }
  }

  return {
    form,
    formRef,
    loading,
    validateForm,
    resetForm,
    clearValidation,
    validateField
  }
}

/**
 * Element Plus Dialog utilities
 */
export function useDialog() {
  const visible = ref(false)
  const loading = ref(false)

  const openDialog = () => {
    visible.value = true
  }

  const closeDialog = () => {
    visible.value = false
    loading.value = false
  }

  const handleConfirm = async (callback?: () => Promise<void> | void) => {
    if (typeof callback === 'function') {
      loading.value = true
      try {
        await callback()
        closeDialog()
      } catch (error) {
        console.error('Dialog confirm error:', error)
      } finally {
        loading.value = false
      }
    } else {
      closeDialog()
    }
  }

  return {
    visible,
    loading,
    openDialog,
    closeDialog,
    handleConfirm
  }
}

/**
 * Element Plus Theme utilities
 */
export function useTheme() {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  const setDarkTheme = (dark: boolean) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  return {
    isDark,
    toggleTheme,
    setDarkTheme
  }
}

/**
 * Element Plus Drawer utilities
 */
export function useDrawer() {
  const visible = ref(false)
  const loading = ref(false)

  const openDrawer = () => {
    visible.value = true
  }

  const closeDrawer = () => {
    visible.value = false
    loading.value = false
  }

  return {
    visible,
    loading,
    openDrawer,
    closeDrawer
  }
}
