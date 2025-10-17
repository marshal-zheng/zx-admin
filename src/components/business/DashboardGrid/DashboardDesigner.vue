<template>
  <component :is="useContentWrap ? ContentWrap : 'div'" :title="useContentWrap ? title : undefined">
    <template v-if="useContentWrap" #headerRight>
      <div v-if="hasHeaderSlot" class="header-actions">
        <slot name="header-actions"></slot>
      </div>
    </template>

    <!-- 图表库面板 - 悬浮组件，可由外部选择拖拽到画布 -->
    <LibraryPanels v-if="isEditable" @chart-select="onChartSelect" @chart-drag="onChartDrag" />

    <!-- 画布区域 -->
    <div class="canvas-wrapper">
      <div class="canvas-shell">
        <el-skeleton v-if="panelsLoading" animated :rows="6" class="canvas-skeleton" />

        <div v-else-if="loadError" class="load-error">
          <p>面板数据加载失败，请重试。</p>
          <small>{{ loadError.message }}</small>
        </div>

        <template v-else>
          <DashboardGrid
            :panels="innerPanels"
            :isEditable="isEditable"
            @panel-added="handlePanelAdded"
            @panel-removed="handlePanelRemoved"
            @layout-changed="handleLayoutChanged"
            @edit-panel="openEditPane"
          />
          <div v-if="isEmpty" class="empty-state">
            <div class="empty-inner">
              <el-icon class="empty-icon"><i class="el-icon-box"></i></el-icon>
              <h3>开始构建你的仪表盘</h3>
              <p>从组件调色板拖拽组件到此区域</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 页面级 EditPane 抽屉（内部实现编辑，但对外暴露事件） -->
    <EditPane
      v-model="showEditPane"
      :panel-data="editingPanelData"
      :mode="editMode"
      @confirm="handleEditConfirm"
      @cancel="handleEditCancel"
      @reset="handleEditReset"
    />
  </component>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useSlots, watch } from 'vue'

import DashboardGrid from './index.vue'
import LibraryPanels from './LibraryPanels/index.vue'
import EditPane from './EditPane/index.vue'
import { ContentWrap } from '@/components/ContentWrap'

defineOptions({ name: 'DashboardDesigner' })

type GridPosition = {
  x?: number
  y?: number
  w?: number
  h?: number
}

type PanelMetadata = Record<string, unknown>

interface DashboardPanel {
  id: string | number
  type?: string
  widget?: string
  title?: string
  description?: string
  color?: string
  gridPos?: GridPosition
  transparentBackground?: boolean
  metadata?: PanelMetadata
  data?: unknown
  setData?: (payload: unknown) => void
  updateGridPos?: (position: GridPosition & { i?: string }) => void
  [key: string]: unknown
}

type PanelsSource =
  | DashboardPanel[]
  | Promise<DashboardPanel[]>
  | (() => DashboardPanel[] | Promise<DashboardPanel[]>)
  | null
  | undefined

interface PanelEditForm {
  title: string
  description: string
  transparentBackground: boolean
  width: number
  height: number
}

interface DashboardSnapshot {
  panels: Array<{
    id: DashboardPanel['id']
    type?: DashboardPanel['type']
    widget?: DashboardPanel['widget']
    title: string
    description: string
    color?: DashboardPanel['color']
    gridPos: GridPosition
    transparentBackground: boolean
    metadata: PanelMetadata
    data: unknown
  }>
  layout: {
    totalPanels: number
    lastModified: string
  }
}

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    /** ContentWrap 标题 */
    title?: string
    /** 是否可编辑（拖拽/缩放） */
    isEditable?: boolean
    /** 面板数据源，支持直接传数组或异步函数 */
    panels?: PanelsSource
    /** 是否使用 ContentWrap 包裹 */
    useContentWrap?: boolean
  }>(),
  {
    title: '仪表盘设计器',
    isEditable: true,
    panels: () => [] as DashboardPanel[],
    useContentWrap: true
  }
)

const emit = defineEmits<{
  (e: 'update:panels', value: DashboardPanel[]): void
  (e: 'panel-added', panel: DashboardPanel): void
  (e: 'panel-removed', panelId: DashboardPanel['id']): void
  (e: 'layout-changed', layout: unknown): void
  (e: 'edit-open', panel: DashboardPanel | null): void
  (e: 'edit-confirm', payload: { panel: DashboardPanel | null; formData: PanelEditForm }): void
  (e: 'edit-cancel'): void
  (e: 'save', snapshot: DashboardSnapshot): void
}>()

const panelsLoading = ref(false)
const loadError = ref<Error | null>(null)
const innerPanels = ref<DashboardPanel[]>([])

const hasHeaderSlot = computed(() => Boolean(slots['header-actions']))
const isEmpty = computed(
  () => !panelsLoading.value && !loadError.value && innerPanels.value.length === 0
)

let requestId = 0

const isPromiseLike = <T,>(value: unknown): value is Promise<T> => {
  return Boolean(value) && typeof (value as Promise<T>).then === 'function'
}

const updatePanels = (nextPanels: DashboardPanel[], options: { emitUpdate?: boolean } = {}) => {
  const { emitUpdate = true } = options
  innerPanels.value = Array.isArray(nextPanels) ? [...nextPanels] : []
  if (emitUpdate) {
    emit('update:panels', innerPanels.value)
  }
}

const resolvePanelsSource = async (source: PanelsSource) => {
  requestId += 1
  const currentRequest = requestId
  loadError.value = null

  const applyPanels = (panels: unknown) => {
    if (currentRequest !== requestId) return
    updatePanels(Array.isArray(panels) ? panels : [], { emitUpdate: false })
    panelsLoading.value = false
  }

  if (Array.isArray(source)) {
    panelsLoading.value = false
    applyPanels(source)
    return
  }

  let result: unknown = source

  if (typeof source === 'function') {
    try {
      result = source()
    } catch (error) {
      panelsLoading.value = false
      loadError.value = error instanceof Error ? error : new Error(String(error))
      updatePanels([], { emitUpdate: false })
      return
    }
  }

  if (isPromiseLike<DashboardPanel[]>(result)) {
    panelsLoading.value = true
    try {
      const panels = await result
      applyPanels(panels)
    } catch (error) {
      if (currentRequest !== requestId) return
      loadError.value = error instanceof Error ? error : new Error(String(error))
      updatePanels([], { emitUpdate: false })
      panelsLoading.value = false
    }
    return
  }

  applyPanels(result)
}

watch(
  () => props.panels,
  (source) => {
    resolvePanelsSource(source)
  },
  { immediate: true }
)

const buildDashboardData = (): DashboardSnapshot => {
  return {
    panels: innerPanels.value.map((panel) => ({
      id: panel.id,
      type: panel.type,
      widget: panel.widget,
      title: panel.title || '',
      description: panel.description || '',
      color: panel.color,
      gridPos: panel.gridPos || {},
      transparentBackground: panel.transparentBackground || false,
      metadata: panel.metadata || {},
      data: panel.data ?? null
    })),
    layout: {
      totalPanels: innerPanels.value.length,
      lastModified: new Date().toISOString()
    }
  }
}

const save = () => {
  const snapshot = buildDashboardData()
  emit('save', snapshot)
  return snapshot
}

const showEditPane = ref(false)
const editMode = ref<'edit' | 'create'>('edit')
const editingPanel = ref<DashboardPanel | null>(null)
const editingPanelData = reactive<PanelEditForm>({
  title: '',
  description: '',
  transparentBackground: false,
  width: 400,
  height: 300
})

const handlePanelAdded = (newPanel: DashboardPanel) => {
  const next = [...innerPanels.value, newPanel]
  updatePanels(next)
  emit('panel-added', newPanel)
}

const handlePanelRemoved = (panelId: DashboardPanel['id']) => {
  const next = innerPanels.value.filter((panel) => panel && String(panel.id) !== String(panelId))
  updatePanels(next)
  emit('panel-removed', panelId)
}

const handleLayoutChanged = (layout: unknown) => {
  emit('layout-changed', layout)
}

const openEditPane = (panel: DashboardPanel | null) => {
  editingPanel.value = panel
  editMode.value = 'edit'
  editingPanelData.title = panel?.title ?? ''
  editingPanelData.description = panel?.description ?? ''
  editingPanelData.transparentBackground = Boolean(panel?.transparentBackground)
  editingPanelData.width = panel?.gridPos?.w ? panel.gridPos.w * 50 : 400
  editingPanelData.height = panel?.gridPos?.h ? panel.gridPos.h * 50 : 300
  showEditPane.value = true
  emit('edit-open', panel)
}

const handleEditConfirm = (formData: PanelEditForm) => {
  if (editingPanel.value) {
    editingPanel.value.title = formData.title
    editingPanel.value.description = formData.description
    editingPanel.value.transparentBackground = formData.transparentBackground
  }
  showEditPane.value = false
  emit('edit-confirm', { panel: editingPanel.value, formData })
}

const handleEditCancel = () => {
  showEditPane.value = false
  emit('edit-cancel')
}

const handleEditReset = () => {}

const onChartSelect = () => {}
const onChartDrag = () => {}

defineExpose({
  save,
  exportData: buildDashboardData,
  getPanels: () => [...innerPanels.value],
  setPanels: (panels: DashboardPanel[], emitUpdate = false) => updatePanels(panels, { emitUpdate }),
  openEdit: openEditPane
})
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.canvas-wrapper {
  position: relative;
  margin-top: 16px;
}

.canvas-shell {
  position: relative;
  min-height: 520px;
  padding: 8px;
  overflow: hidden;
  background: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: 8px;
  box-sizing: border-box;
}

.canvas-skeleton {
  padding: 16px;
}

.load-error {
  padding: 32px 16px;
  text-align: center;
  color: var(--el-text-color-secondary);
}

.empty-state {
  position: absolute;
  display: flex;
  pointer-events: none;
  background: repeating-linear-gradient(
    45deg,
    var(--el-fill-color-lighter) 0,
    var(--el-fill-color-lighter) 6px,
    transparent 6px,
    transparent 12px
  );
  border-radius: 8px;
  opacity: 0.8;
  inset: 0;
  align-items: center;
  justify-content: center;
}

.empty-inner {
  max-width: 260px;
  text-align: center;
}

.empty-inner h3 {
  margin: 12px 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.empty-inner p {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.empty-icon {
  font-size: 34px;
  color: var(--el-text-color-secondary);
}
</style>
