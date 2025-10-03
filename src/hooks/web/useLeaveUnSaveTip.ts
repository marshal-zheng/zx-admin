import { type NavigationGuardNext, onBeforeRouteLeave } from 'vue-router'
import { ref } from 'vue'

import { useI18n } from '@/hooks/web/useI18n'
import type { ModalType } from '@/hooks/web/useModal'
import useModal from '@/hooks/web/useModal'

export interface LeaveProps {
  leaveTitle: string
  leaveContent: string
  tipType: ModalType
}

const leaveProps: LeaveProps = {
  leaveTitle: 'common.unSaveLeaveTitle',
  leaveContent: 'common.unSaveLeaveContent',
  tipType: 'warning'
}

// 离开页面确认提示
export default function useLeaveUnSaveTip(leaveProp = leaveProps) {
  const { openModal } = useModal()
  const { t } = useI18n()
  const { leaveTitle, leaveContent, tipType } = leaveProp

  const isSave = ref(true)

  const setIsSave = (flag: boolean) => {
    isSave.value = flag
  }

  function openUnsavedTip(next: NavigationGuardNext | (() => void)) {
    openModal({
      type: tipType,
      title: t(leaveTitle),
      message: t(leaveContent),
      confirmButtonText: t('common.leave'),
      cancelButtonText: t('common.stay'),
      onBeforeOk: async () => {
        isSave.value = true
        next()
      }
    })
  }

  onBeforeRouteLeave((to, from, next) => {
    if (to.path === from.path) {
      next()
      return
    }

    if (!isSave.value) {
      openUnsavedTip(next)
    } else {
      next()
    }
  })

  // 页面有变更时，关闭或刷新页面弹出浏览器的保存提示
  window.onbeforeunload = () => {
    if (!isSave.value) {
      return ''
    }
  }
  return {
    setIsSave,
    openUnsavedTip,
    isSave
  }
}
