<template>
  <div
    class="zx-panel-header"
    :class="{
      'panel-header--draggable': draggable,
      'panel-header--has-menu': showMenu && hasMenuItems,
      'panel-header--has-notices': hasNotices
    }"
    :style="headerStyle"
  >
    <!-- 主要内容区域 -->
    <div class="panel-header__main">
      <!-- 标题区域 -->
      <div class="panel-header__title-section">
        <slot name="title">
          <h1 v-if="title" class="panel-header__title">
            {{ title }}
          </h1>
        </slot>

        <!-- 自定义标题内容 -->
        <slot name="title-content"></slot>
      </div>

      <!-- 标题项目（状态、链接等） -->
      <PanelHeaderTitleItems
        v-if="showTitleItems"
        :title-items="titleItems"
        :panel-links="panelLinks"
        :alert-state="alertState"
        :time-info="timeInfo"
        @title-item-click="handleTitleItemClick"
        @link-click="handleLinkClick"
      />
    </div>

    <!-- 操作栏组 -->
    <div
      v-if="showActionBar"
      class="panel-header__action-bar"
      :class="{ 'panel-header__action-bar--visible': forceShowActionBar || isHovered }"
    >
      <!-- 通知区域 -->
      <PanelHeaderNotices
        v-if="showNotices"
        :panel-id="panelId"
        :notices="notices"
        :data-frames="dataFrames"
        :can-inspect="canInspect"
        :deduplicate="deduplicateNotices"
        @inspect-click="handleInspectClick"
        @notice-click="handleNoticeClick"
      />

      <!-- 自定义操作项 -->
      <slot name="actions"></slot>

      <!-- 传统插件系统兼容 -->
      <component v-for="(item, index) in legacyItems" :key="`legacy-${index}`" :is="item.render" />

      <!-- 菜单提供者 -->
      <PanelHeaderMenuProvider
        v-if="showMenu"
        :panel-id="panelId"
        :initial-menu-items="initialMenuItems"
        :auto-load-default="autoLoadDefaultMenu"
        :menu-config="menuConfig"
        @menu-items-change="handleMenuItemsChange"
        @menu-action="handleMenuAction"
      >
        <template #default="{ menuItems }">
          <PanelHeaderMenu
            :menu-items="menuItems"
            :class="menuClassName"
            :style="menuStyle"
            @menu-click="handleMenuClick"
          />
        </template>
      </PanelHeaderMenuProvider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PanelHeaderMenu from './PanelHeaderMenu.vue'
import PanelHeaderMenuProvider from './PanelHeaderMenuProvider.vue'
import PanelHeaderTitleItems from './PanelHeaderTitleItems.vue'
import PanelHeaderNotices from './PanelHeaderNotices.vue'
import type {
  PanelMenuItem,
  PanelTitleItem,
  PanelNotice,
  PanelHeaderConfig,
  PanelMenuSeverity
} from './types'

interface PanelLink {
  title?: string
  url: string
  icon?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

interface Props {
  /** 面板ID */
  panelId?: string | number
  /** 面板标题 */
  title?: string
  /** 是否可拖拽 */
  draggable?: boolean
  /** 是否显示菜单 */
  showMenu?: boolean
  /** 是否显示标题项 */
  showTitleItems?: boolean
  /** 是否显示通知 */
  showNotices?: boolean
  /** 是否显示操作栏 */
  showActionBar?: boolean
  /** 强制显示操作栏 */
  forceShowActionBar?: boolean
  /** 初始菜单项 */
  initialMenuItems?: PanelMenuItem[]
  /** 自动加载默认菜单 */
  autoLoadDefaultMenu?: boolean
  /** 菜单配置 */
  menuConfig?: {
    showEdit?: boolean
    showDuplicate?: boolean
    showDelete?: boolean
    showExport?: boolean
    showFullscreen?: boolean
    customItems?: PanelMenuItem[]
  }
  /** 标题项列表 */
  titleItems?: PanelTitleItem[]
  /** 面板链接 */
  panelLinks?: PanelLink[]
  /** 状态信息 */
  alertState?: PanelMenuSeverity
  /** 时间信息 */
  timeInfo?: string
  /** 通知列表 */
  notices?: PanelNotice[]
  /** 数据帧（用于自动检测通知） */
  dataFrames?: Array<{
    meta?: {
      notices?: Array<{
        severity: string
        text: string
        inspect?: string
        link?: string
      }>
    }
  }>
  /** 是否可以检查 */
  canInspect?: boolean
  /** 是否去重通知 */
  deduplicateNotices?: boolean
  /** 菜单样式类名 */
  menuClassName?: string
  /** 菜单自定义样式 */
  menuStyle?: Record<string, any>
  /** 头部自定义样式 */
  headerStyle?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  panelId: '',
  title: '',
  draggable: true,
  showMenu: true,
  showTitleItems: true,
  showNotices: true,
  showActionBar: true,
  forceShowActionBar: false,
  initialMenuItems: () => [],
  autoLoadDefaultMenu: true,
  menuConfig: () => ({
    showEdit: true,
    showDuplicate: false,
    showDelete: true,
    showExport: false,
    showFullscreen: false,
    customItems: []
  }),
  titleItems: () => [],
  panelLinks: () => [],
  alertState: undefined,
  timeInfo: '',
  notices: () => [],
  dataFrames: () => [],
  canInspect: true,
  deduplicateNotices: true,
  menuClassName: '',
  menuStyle: () => ({}),
  headerStyle: () => ({})
})

const emit = defineEmits<{
  /** 菜单项变化事件 */
  'menu-items-change': [items: PanelMenuItem[]]
  /** 菜单操作事件 */
  'menu-action': [action: string, panelId: string | number, data?: any]
  /** 菜单点击事件 */
  'menu-click': [item: PanelMenuItem, event: Event]
  /** 标题项点击事件 */
  'title-item-click': [item: PanelTitleItem, event: Event]
  /** 链接点击事件 */
  'link-click': [link: PanelLink, event: Event]
  /** 检查点击事件 */
  'inspect-click': [panelId: string | number, inspectTab: string, notice: PanelNotice, event: Event]
  /** 通知点击事件 */
  'notice-click': [panelId: string | number, notice: PanelNotice, event: Event]
}>()

// 响应式数据
const isHovered = ref(false)
const legacyItems = ref<Array<{ render: any }>>([])
const currentMenuItems = ref<PanelMenuItem[]>([])

// 计算属性
const hasMenuItems = computed(() => currentMenuItems.value.length > 0)
const hasNotices = computed(() => {
  return (
    (props.notices && props.notices.length > 0) ||
    (props.dataFrames && props.dataFrames.some((frame) => frame.meta?.notices?.length))
  )
})

// 鼠标悬停处理
let hoverTimer: number | null = null

const handleMouseEnter = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }
  isHovered.value = true
}

const handleMouseLeave = () => {
  hoverTimer = window.setTimeout(() => {
    isHovered.value = false
  }, 100) // 短暂延迟，避免快速移动时闪烁
}

// 事件处理器
const handleMenuItemsChange = (items: PanelMenuItem[]) => {
  currentMenuItems.value = items
  emit('menu-items-change', items)
}

const handleMenuAction = (action: string, panelId: string | number, data?: any) => {
  emit('menu-action', action, panelId, data)
}

const handleMenuClick = (item: PanelMenuItem, event: Event) => {
  emit('menu-click', item, event)
}

const handleTitleItemClick = (item: PanelTitleItem, event: Event) => {
  emit('title-item-click', item, event)
}

const handleLinkClick = (link: PanelLink, event: Event) => {
  emit('link-click', link, event)
}

const handleInspectClick = (
  panelId: string | number,
  inspectTab: string,
  notice: PanelNotice,
  event: Event
) => {
  emit('inspect-click', panelId, inspectTab, notice, event)
}

const handleNoticeClick = (panelId: string | number, notice: PanelNotice, event: Event) => {
  emit('notice-click', panelId, notice, event)
}

// 传统插件系统兼容方法
const addAction = (plugin: { render: any }) => {
  legacyItems.value.push(plugin)
}

// 生命周期
onMounted(() => {
  // 绑定鼠标事件
  const headerEl = document.querySelector('.panel-header')
  if (headerEl) {
    headerEl.addEventListener('mouseenter', handleMouseEnter)
    headerEl.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  // 清理定时器
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }

  // 移除事件监听
  const headerEl = document.querySelector('.panel-header')
  if (headerEl) {
    headerEl.removeEventListener('mouseenter', handleMouseEnter)
    headerEl.removeEventListener('mouseleave', handleMouseLeave)
  }
})

// 暴露方法给父组件（向后兼容）
defineExpose({
  addAction,
  menuItems: currentMenuItems,
  hasMenuItems,
  hasNotices,
  isHovered
})
</script>

<style lang="scss" scoped>
/* PanelHeader 组件样式 */
.zx-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--dg-panel-header-border-color, var(--el-border-color-light));
  min-height: 40px;

  .panel-header__action-bar {
    display: inline-flex;
    align-items: center; /* 垂直居中 */
  }
  /* 注意：此处使用的是额外类名 panel-header--draggable，而非 BEM 扩展（.zx-panel-header--draggable） */
  &.panel-header--draggable {
    cursor: move;
  }

  &--has-menu {
    padding-right: 8px;
  }

  &--has-notices {
    .panel-header__title {
      margin-right: 8px;
    }
  }
}

.panel-header__left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.panel-header__title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-right: 8px;
}

.panel-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 作为兜底：拖拽句柄类名始终显示为 move 光标（与 VueGridLayout 的 draggableHandle 一致） */
.grid-drag-handle {
  cursor: move;
}
</style>
