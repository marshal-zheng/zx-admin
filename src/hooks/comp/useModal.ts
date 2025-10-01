// import { ref } from 'vue'; // 暂时未使用
import { ElMessageBox } from 'element-plus'
import type { ElMessageBoxOptions, Action } from 'element-plus'

export type ModalType = 'info' | 'success' | 'warning' | 'error'

export type ModalSize = 'small' | 'medium' | 'large' | 'full'

export type ModalMode = 'default' | 'weak'

export interface ModalOptions extends Partial<ElMessageBoxOptions> {
  mode?: ModalMode
  type: ModalType
  size?: ModalSize
  onBeforeOk?: () => Promise<void>
  title?: string
  message?: string
}

export interface DeleteModalOptions extends Partial<ElMessageBoxOptions> {
  title: string
  message: string
  onBeforeOk?: () => Promise<void>
}

export default function useModal() {
  const beforeOkHandler = async (options: ModalOptions) => {
    if (options.onBeforeOk) {
      try {
        await options.onBeforeOk()
        return true
      } catch (error) {
        console.error('Modal confirm error:', error)
        return false
      }
    }
    return true
  }

  return {
    openModal: async (options: ModalOptions) => {
      const {
        type = 'info',
        title = '提示',
        message = '',
        mode = 'default',
        size = 'small',
        onBeforeOk,
        ...restOptions
      } = options

      // 根据尺寸设置宽度
      const sizeWidthMap = {
        small: '400px',
        medium: '600px',
        large: '800px',
        full: '90%'
      }

      const messageBoxOptions: ElMessageBoxOptions = {
        title,
        message,
        type,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: mode === 'weak' ? 'el-button--text' : '',
        cancelButtonClass: mode === 'weak' ? 'el-button--text' : '',
        customClass: `ms-usemodal ms-usemodal-${mode} ms-usemodal-${size} ms-usemodal-${type}`,
        customStyle: {
          width: sizeWidthMap[size]
        },
        beforeClose: async (action: Action, instance: any, done: () => void) => {
          if (action === 'confirm' && typeof options.onBeforeOk === 'function') {
            instance.confirmLoading = true
            const success = await beforeOkHandler(options)
            instance.confirmLoading = false
            if (success) {
              done()
            }
          } else {
            done()
          }
        },
        ...restOptions
      }

      try {
        return await ElMessageBox(messageBoxOptions)
      } catch (error) {
        // 用户取消或其他错误
        return Promise.reject(error)
      }
    },

    openDeleteModal: async (options: DeleteModalOptions) => {
      const {
        title = '删除确认',
        message = '确定要删除吗？此操作不可撤销。',
        onBeforeOk,
        ...restOptions
      } = options

      const messageBoxOptions: ElMessageBoxOptions = {
        title,
        message,
        type: 'error',
        showCancelButton: true,
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger',
        customClass: 'ms-usemodal ms-usemodal-warning ms-usemodal-small',
        beforeClose: async (action: Action, instance: any, done: () => void) => {
          if (action === 'confirm' && onBeforeOk) {
            instance.confirmLoading = true
            try {
              await onBeforeOk()
              instance.confirmLoading = false
              done()
            } catch (error) {
              instance.confirmLoading = false
              console.error('Delete confirm error:', error)
            }
          } else {
            done()
          }
        },
        ...restOptions
      }

      try {
        return await ElMessageBox(messageBoxOptions)
      } catch (error) {
        // 用户取消或其他错误
        return Promise.reject(error)
      }
    }
  }
}
