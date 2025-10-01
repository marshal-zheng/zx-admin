import { BusEventBase, eventFactory } from '@/utils/envent'

// 显示确认模态框的配置选项
export const createShowConfirmModalPayload = (options = {}) => {
  return {
    title: '',
    text: '',
    text2: '',
    text2htmlBind: false,
    confirmText: '确定',
    altActionText: '',
    yesText: '是',
    noText: '否',
    icon: '',
    onConfirm: null,
    onAltAction: null,
    ...options
  }
}

/**
 * 事件工厂函数
 */

export const removePanel = eventFactory('remove-panel')

export const requestAddComponentEvent = eventFactory('add-component')

export const insertComponentEvent = eventFactory('insert-component')

/**
 * 由 DashboardModel 内部使用，与 DashboardGrid 通信需要重新渲染
 */
export class DashboardPanelsChangedEvent extends BusEventBase {
  static type = 'dashboard-panels-changed'
}

export class RenderEvent extends BusEventBase {
  static type = 'render'
}
