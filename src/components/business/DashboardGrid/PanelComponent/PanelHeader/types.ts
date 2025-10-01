/**
 * PanelHeader 组件通用类型定义
 * 抽象自 Grafana，适配 Element Plus 生态
 */

export type PanelMenuItemType = 'item' | 'divider' | 'group'

export type PanelMenuSeverity = 'info' | 'warning' | 'error' | 'success'

export interface PanelMenuItem {
  /** 菜单项类型 */
  type?: PanelMenuItemType
  /** 显示文本 */
  text: string
  /** 图标类名或图标名称 */
  iconClassName?: string
  /** 点击事件处理 */
  onClick?: (event: Event) => void
  /** 链接地址 */
  href?: string
  /** 快捷键显示 */
  shortcut?: string
  /** 子菜单 */
  subMenu?: PanelMenuItem[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示 */
  visible?: boolean
}

export interface PanelNotice {
  /** 通知级别 */
  severity: PanelMenuSeverity
  /** 通知文本 */
  text: string
  /** 检查链接 */
  inspect?: string
  /** 外部链接 */
  link?: string
}

export interface PanelTitleItem {
  /** 项目类型 */
  type: 'status' | 'timeshift' | 'links' | 'custom'
  /** 显示内容 */
  content?: string
  /** 图标名称 */
  icon?: string
  /** 状态类型 */
  status?: PanelMenuSeverity
  /** 工具提示 */
  tooltip?: string
  /** 点击事件 */
  onClick?: (event: Event) => void
}

export interface PanelHeaderConfig {
  /** 面板标题 */
  title?: string
  /** 是否显示菜单 */
  showMenu?: boolean
  /** 是否可拖拽 */
  draggable?: boolean
  /** 菜单项列表 */
  menuItems?: PanelMenuItem[]
  /** 标题栏项目 */
  titleItems?: PanelTitleItem[]
  /** 通知列表 */
  notices?: PanelNotice[]
}
