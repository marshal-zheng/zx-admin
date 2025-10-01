<template>
  <div class="zx-dashboard-grid">
    <VueGridLayout
      :class="{
        'dashbord-grid-layout': true,
        layout: true,
        uneditable: !isEditable
      }"
      v-model="layout"
      :isDraggable="isEditable"
      :isResizable="isEditable"
      :margin="[GRID_CELL_VMARGIN, GRID_CELL_VMARGIN]"
      :rowHeight="GRID_CELL_HEIGHT"
      :cols="GRID_COLUMN_COUNT"
      :draggableHandle="'.grid-drag-handle'"
      :useCSSTransforms="mounted"
      :isDroppable="true"
      @layoutChange="onLayoutChange"
      @drop="onDrop"
      @dropDragOver="onDropDragOver"
    >
      <div
        v-for="(panel, index) in renderPanels"
        :key="String(panel.id)"
        :style="{
          border: `1px solid var(--dg-panel-container-border-color, var(--el-border-color, #ccc))`,
          height: '100%'
        }"
      >
        <PanelComponent
          :panel="panel"
          :dashboard="dashboard"
          hdClass="grid-drag-handle"
          :noPadding="panel.contentNoPadding"
          :isEditable="isEditable"
          @remove-panel="handleRemovePanel"
          @duplicate-panel="handleDuplicatePanel"
          @edit-panel="handleEditPanel"
        >
          <AsyncLoadComp
            :key="String(panel.id)"
            :name="panel.widget"
            :props="getPanelProps(panel)"
          />
        </PanelComponent>
      </div>
    </VueGridLayout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VueGridLayoutProvider, { WidthProvider } from '@marsio/vue-grid-layout'
import { Subscription } from 'rxjs'

import AsyncLoadComp from '../Widget/AsyncLoadComp.vue'
import PanelComponent from './PanelComponent/index.vue'
import { DashboardPanelsChangedEvent } from './model/events.ts'
import { GRID_CELL_HEIGHT, GRID_CELL_VMARGIN, GRID_COLUMN_COUNT } from './constants'
import { getDragPayload } from './dragPayloadStore'

const VueGridLayout = WidthProvider(VueGridLayoutProvider)

// Props
const props = defineProps({
  dashboard: {
    type: Object,
    default: () => ({})
  },
  // 可选地直接传入 panels，当提供时优先使用
  panels: {
    type: Array,
    default: () => []
  },
  isEditable: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['panel-added', 'panel-removed', 'layout-changed', 'edit-panel'])

// 响应式数据
const panelMap = ref({})
const eventSubs = ref(new Subscription())
const mounted = ref(false)

// 统一获取要渲染的面板列表：优先使用 props.panels，否则使用 props.dashboard.panels
const getPanels = () => {
  if (Array.isArray(props.panels) && props.panels.length) return props.panels
  if (props.dashboard && Array.isArray(props.dashboard.panels)) return props.dashboard.panels
  return []
}

// 提供给模板使用的响应式面板列表
const renderPanels = computed(() => {
  const panels = getPanels()
  // 确保每个面板都有稳定的ID，避免key变化导致的重新渲染
  return panels.filter((panel) => panel && typeof panel === 'object')
})

// 响应式布局计算
const layout = computed(() => {
  return buildLayout()
})

// 方法
const triggerForceUpdate = () => {
  // layout 现在是计算属性，会自动更新
  console.log('Force update triggered')
}

const onLayoutChange = (newLayout) => {
  console.log('Layout changed:', newLayout)
  newLayout.forEach((newPos) => {
    const panel = panelMap.value[newPos.i]
    if (!panel) {
      console.warn('Panel not found for layout index:', newPos.i)
      return
    }

    if (typeof panel.updateGridPos === 'function') {
      panel.updateGridPos(newPos)
    } else {
      // 兼容普通对象：只写回 gridPos，不再维护顶层 x/y/w/h 字段
      panel.gridPos = panel.gridPos || {}
      panel.gridPos.x = newPos.x
      panel.gridPos.y = newPos.y
      panel.gridPos.w = newPos.w
      panel.gridPos.h = newPos.h

      // 清理可能存在的根级别位置字段，避免混淆
      delete panel.x
      delete panel.y
      delete panel.w
      delete panel.h
    }
  })

  if (props.dashboard && typeof props.dashboard.sortPanelsByGridPos === 'function') {
    props.dashboard.sortPanelsByGridPos()
  }
}

const buildLayout = () => {
  const layout = []
  const panels = getPanels()

  panels.forEach((panel, index) => {
    // 确保面板有稳定的ID
    const panelId = String(panel.id ?? `panel-${index}`)
    if (!panel.id) panel.id = panelId
    // 使用 panel.id 作为布局项 i，与子元素 key 对齐
    panelMap.value[panelId] = panel
    // 使用 gridPos 对象获取位置信息
    const gp = panel.gridPos && typeof panel.gridPos === 'object' ? panel.gridPos : {}
    const x = gp.x ?? 0
    const y = gp.y ?? 0
    const w = gp.w ?? 4
    const h = gp.h ?? 3
    const panelPos = { i: panelId, x, y, w, h }

    if (panel.type === 'row') {
      panelPos.w = GRID_COLUMN_COUNT
      panelPos.h = 1
      panelPos.isResizable = false
      panelPos.isDraggable = !!panel.collapsed
    }

    layout.push(panelPos)
  })
  return layout
}

// 为异步加载组件提供稳定的 props 引用，避免父级无关更新导致子组件重新渲染
const panelPropsCache = new Map()
const getPanelProps = (panel) => {
  const id = panel?.id ?? 'unknown'
  const cached = panelPropsCache.get(id)

  const next = {
    color: panel.color || '#409EFF', // 使用 panel.color 或默认颜色
    title: panel.title,
    panel,
    dashboard: props.dashboard,
    onPanelSizeChanged,
    onPanelDataReceived,
    onEditPanel,
    onRemovePanel,
    onDuplicatePanel,
    onCopyPanel,
    onSharePanel,
    onInspectPanel,
    onViewPanel,
    onMorePanel
  }
  // 仅当关键字段变化时才更新缓存对象，保持引用稳定
  if (
    cached &&
    cached.color === next.color &&
    cached.title === next.title &&
    cached.panel === next.panel &&
    cached.dashboard === next.dashboard
  ) {
    return cached
  }
  panelPropsCache.set(id, next)
  return next
}

// Panel 事件处理方法
const onPanelSizeChanged = (panelId, size) => {
  // 处理面板大小变化
}

const onPanelDataReceived = (panelId, data) => {
  // 处理面板数据接收
}

const onEditPanel = (panel) => {
  // 处理编辑面板
}

const onRemovePanel = (panel) => {
  // 处理删除面板
}

const onDuplicatePanel = (panel) => {
  // 处理复制面板
}

const onCopyPanel = (panel) => {
  // 处理拷贝面板
}

const onSharePanel = (panel) => {
  // 处理分享面板
}

const onInspectPanel = (panel) => {
  // 处理检查面板
}

const onViewPanel = (panel) => {
  // 处理查看面板
}

const onMorePanel = (panel) => {
  // 处理更多面板操作
}

// 统一处理来自子组件的删除事件
const handleRemovePanel = (panelId) => {
  // 将删除事件向外抛出，由使用者决定如何从数据源中移除
  emit('panel-removed', panelId)
}

// 统一处理来自子组件的复制事件（受控模式用）
const handleDuplicatePanel = (newPanel) => {
  // 将新增事件向外抛出，由使用者决定如何插入到数据源
  emit('panel-added', newPanel)
}

// 统一处理来自子组件的编辑事件（由页面统一弹出编辑抽屉）
const handleEditPanel = (panel) => {
  emit('edit-panel', panel)
}

// 拖拽相关方法
const onDrop = (layout, event, layoutItem) => {
  // 解析拖拽数据
  let payload
  try {
    const text = event?.dataTransfer?.getData('text/plain')
    payload = text ? JSON.parse(text) : null
  } catch (e) {
    console.warn('Failed to parse drag data:', e)
    payload = null
  }

  // 如果 dataTransfer 不可用，退回到共享 store
  if (!payload) {
    payload = getDragPayload()
  }

  if (!payload || !payload.type) {
    console.warn('Invalid drag payload:', payload)
    return
  }

  // 生成新面板ID
  const newId = `${payload.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // 创建新面板
  const newPanel = {
    id: newId,
    type: payload.type,
    widget: payload.widget,
    title: payload.title || `${payload.type} 组件`,
    description: payload.description || '',
    color: payload.color || '#409EFF', // 使用颜色而不是 chartType
    gridPos: {
      x: layoutItem.x,
      y: layoutItem.y,
      w: layoutItem.w,
      h: layoutItem.h
    }
  }

  // 触发面板添加事件
  emit('panel-added', newPanel)
}

const onDropDragOver = (e) => {
  // 解析拖拽数据，优先读取 payload.w/h
  let payload
  try {
    const text = e?.dataTransfer?.getData('text/plain')
    payload = text ? JSON.parse(text) : null
  } catch (error) {
    payload = null
  }
  // 如果在 dragover 阶段拿不到 dataTransfer，回退共享 store
  if (!payload) {
    payload = getDragPayload()
  }

  // palette 可自定义推荐尺寸
  if (payload && typeof payload.w === 'number' && typeof payload.h === 'number') {
    return { w: payload.w, h: payload.h }
  }
  // 默认尺寸（适中大小）
  return { w: 6, h: 5 }
}

// 生命周期
onMounted(() => {
  mounted.value = true
  console.log('DashboardGrid mounted')
  if (
    props.dashboard &&
    props.dashboard.events &&
    typeof props.dashboard.events.subscribe === 'function'
  ) {
    eventSubs.value.add(
      props.dashboard.events.subscribe(DashboardPanelsChangedEvent, triggerForceUpdate)
    )
  }
})

onBeforeUnmount(() => {
  eventSubs.value.unsubscribe()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
