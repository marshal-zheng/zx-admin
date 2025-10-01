<template>
  <div>
    <slot
      :menu-items="menuItems"
      :loading="loading"
      :add-menu-item="addMenuItem"
      :remove-menu-item="removeMenuItem"
      :update-menu-item="updateMenuItem"
      :clear-menu-items="clearMenuItems"
    ></slot>

    <!-- EditPane 已移至页面级统一管理，这里不再内置 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, provide, inject } from 'vue'
import type { PanelMenuItem } from './types'

interface Props {
  /** 面板ID */
  panelId?: string | number
  /** 初始菜单项 */
  initialMenuItems?: PanelMenuItem[]
  /** 是否自动加载默认菜单 */
  autoLoadDefault?: boolean
  /** 菜单配置 */
  menuConfig?: {
    showEdit?: boolean
    showDuplicate?: boolean
    showDelete?: boolean
    showExport?: boolean
    showFullscreen?: boolean
    customItems?: PanelMenuItem[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  panelId: '',
  initialMenuItems: () => [],
  autoLoadDefault: true,
  menuConfig: () => ({
    showEdit: true,
    showDuplicate: false,
    showDelete: true,
    showExport: true,
    showFullscreen: true,
    customItems: []
  })
})

const emit = defineEmits<{
  /** 菜单项变化事件 */
  'menu-items-change': [items: PanelMenuItem[]]
  /** 菜单操作事件 */
  'menu-action': [action: string, panelId: string | number, data?: any]
}>()

// 响应式数据
const loading = ref(false)
const menuItems = ref<PanelMenuItem[]>([])

// 默认菜单项生成器
const createDefaultMenuItems = (): PanelMenuItem[] => {
  const items: PanelMenuItem[] = []
  const config = props.menuConfig

  if (config?.showEdit) {
    items.push({
      type: 'item',
      text: '编辑',
      iconClassName: 'Edit',
      onClick: () => handleEditAction()
    })
  }

  if (config?.showDuplicate) {
    items.push({
      type: 'item',
      text: '复制',
      iconClassName: 'CopyDocument',
      onClick: () => handleMenuAction('duplicate')
    })
  }

  if (config?.showExport) {
    items.push({
      type: 'item',
      text: '导出',
      iconClassName: 'Download',
      onClick: () => handleMenuAction('export')
    })
  }

  // 添加分隔线
  if (items.length > 0 && (config?.showFullscreen || config?.showDelete)) {
    items.push({
      type: 'divider',
      text: 'divider-1'
    })
  }

  if (config?.showFullscreen) {
    items.push({
      type: 'item',
      text: '全屏',
      iconClassName: 'FullScreen',
      onClick: () => handleMenuAction('fullscreen')
    })
  }

  if (config?.showDelete) {
    items.push({
      type: 'item',
      text: '删除',
      iconClassName: 'Delete',
      onClick: () => handleMenuAction('delete')
    })
  }

  // 添加自定义菜单项
  if (config?.customItems && config.customItems.length > 0) {
    if (items.length > 0) {
      items.push({
        type: 'divider',
        text: 'divider-custom'
      })
    }
    items.push(...config.customItems)
  }

  return items
}

// 菜单操作处理
const handleMenuAction = (action: string, data?: any) => {
  emit('menu-action', action, props.panelId, data)
}

// EditPane 相关方法
const handleEditAction = () => {
  // 不在此处弹出抽屉，改为将动作透传，由上层统一处理
  emit('menu-action', 'edit', props.panelId)
}

// 菜单项管理方法
const addMenuItem = (item: PanelMenuItem, index?: number) => {
  if (typeof index === 'number' && index >= 0) {
    menuItems.value.splice(index, 0, item)
  } else {
    menuItems.value.push(item)
  }
  emit('menu-items-change', menuItems.value)
}

const removeMenuItem = (index: number) => {
  if (index >= 0 && index < menuItems.value.length) {
    menuItems.value.splice(index, 1)
    emit('menu-items-change', menuItems.value)
  }
}

const updateMenuItem = (index: number, item: Partial<PanelMenuItem>) => {
  if (index >= 0 && index < menuItems.value.length) {
    menuItems.value[index] = { ...menuItems.value[index], ...item }
    emit('menu-items-change', menuItems.value)
  }
}

const clearMenuItems = () => {
  menuItems.value = []
  emit('menu-items-change', menuItems.value)
}

// 初始化菜单项
const initializeMenuItems = async () => {
  loading.value = true

  try {
    let items: PanelMenuItem[] = []

    // 使用初始菜单项
    if (props.initialMenuItems.length > 0) {
      items = [...props.initialMenuItems]
    }

    // 自动加载默认菜单
    if (props.autoLoadDefault) {
      const defaultItems = createDefaultMenuItems()
      items = items.length > 0 ? [...items, ...defaultItems] : defaultItems
    }

    menuItems.value = items
    emit('menu-items-change', items)
  } catch (error) {
    console.error('Failed to initialize menu items:', error)
  } finally {
    loading.value = false
  }
}

// 监听配置变化
watch(
  () => [props.menuConfig, props.initialMenuItems],
  () => {
    initializeMenuItems()
  },
  { deep: true }
)

// 组件挂载时初始化
onMounted(() => {
  initializeMenuItems()
})

// 提供给子组件的上下文
const panelMenuContext = {
  panelId: computed(() => props.panelId),
  menuItems: computed(() => menuItems.value),
  loading: computed(() => loading.value),
  addMenuItem,
  removeMenuItem,
  updateMenuItem,
  clearMenuItems
}

provide('panelMenuContext', panelMenuContext)

// 暴露方法给父组件
defineExpose({
  menuItems: computed(() => menuItems.value),
  loading: computed(() => loading.value),
  addMenuItem,
  removeMenuItem,
  updateMenuItem,
  clearMenuItems,
  refresh: initializeMenuItems
})
</script>

<script lang="ts">
export default {
  name: 'PanelHeaderMenuProvider'
}
</script>
