<template>
  <div class="virtualized-data-grid" :class="{ 'disable-row-hover': disableRowHover }">
    <!-- Header Slot -->
    <div v-if="$slots.header" class="grid-header">
      <slot name="header"></slot>
    </div>

    <!-- Main Table -->
    <ElAutoResizer>
      <template #default="{ height, width }">
        <ElTableV2
          ref="tableRef"
          :columns="mergedColumns"
          :data="tableData"
          :width="width"
          :height="height"
          :row-height="rowHeight"
          :header-height="headerHeight"
          :fixed="fixed"
          :row-class="getRowClass"
          :header-class="headerClass"
          :empty-renderer="emptyRenderer"
          @row-click="handleRowClick"
          v-bind="$attrs"
        >
          <template
            v-for="col in dynamicColumns"
            :key="col.key"
            #[`cell-${col.key}`]="{ rowData, rowIndex }"
          >
            <slot :name="`cell-${col.key}`" :row="rowData" :index="rowIndex" :column="col">
              <component
                :is="getCellComponent(col)"
                v-model="rowData[col.dataKey]"
                :row="rowData"
                :column="col"
                :index="rowIndex"
                :disabled="disabled || col.disabled"
                @update:model-value="handleCellChange(rowData, col.dataKey, $event, rowIndex)"
              />
            </slot>
          </template>

          <!-- Action Column -->
          <template v-if="showActionColumn" #cell-actions="{ rowData, rowIndex }">
            <slot name="actions" :row="rowData" :index="rowIndex">
              <div class="action-buttons">
                <ElButton
                  v-if="!customActions"
                  link
                  type="danger"
                  :icon="Delete"
                  :disabled="disabled || isDeleteDisabled(rowData, rowIndex)"
                  @click.stop="handleDelete(rowIndex)"
                >
                  {{ deleteText }}
                </ElButton>
              </div>
            </slot>
          </template>
        </ElTableV2>
      </template>
    </ElAutoResizer>

    <!-- Footer Slot -->
    <div v-if="$slots.footer || showAddButton" class="grid-footer">
      <slot name="footer">
        <ElButton v-if="showAddButton && !disabled" type="primary" :icon="Plus" @click="handleAdd">
          {{ addText }}
        </ElButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import type { Component } from 'vue'
import { ElTableV2, ElAutoResizer, ElButton, ElEmpty } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { Column } from 'element-plus'
import type { DataGridColumn } from './types'
import InputCell from './cells/InputCell.vue'
import SelectCell from './cells/SelectCell.vue'
import NumberCell from './cells/NumberCell.vue'
import TextareaCell from './cells/TextareaCell.vue'
import DatePickerCell from './cells/DatePickerCell.vue'
import SwitchCell from './cells/SwitchCell.vue'

// Re-export types
export type { DataGridColumn, DataGridEmits, DataGridExpose } from './types'

/**
 * Cell component map
 */
const cellComponentMap: Record<string, Component> = {
  input: InputCell,
  select: SelectCell,
  number: NumberCell,
  textarea: TextareaCell,
  datePicker: DatePickerCell,
  switch: SwitchCell
}

/**
 * Get cell component by column type
 */
const getCellComponent = (column: DataGridColumn): Component => {
  if (column.cellRenderer) {
    return column.cellRenderer
  }
  const type = column.type || 'input'
  return cellComponentMap[type] || InputCell
}

/**
 * Deep clone helper
 */
function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map((item) => cloneDeep(item)) as any
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = cloneDeep(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * Check if value is a function
 */
function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

/**
 * Props interface
 */
export interface DataGridProps {
  /** Table data */
  modelValue: any[]
  /** Column configurations */
  columns: DataGridColumn[]
  /** Whether table is disabled */
  disabled?: boolean
  /** Row height */
  rowHeight?: number
  /** Header height */
  headerHeight?: number
  /** Total table height */
  height?: number
  /** Whether to disable row hover effect */
  disableRowHover?: boolean
  /** Action column width */
  actionColumnWidth?: number
  /** Whether to show action column */
  showActions?: boolean
  /** Whether to always show actions even when disabled */
  alwaysShowActions?: boolean
  /** Custom actions (if true, only show slot content) */
  customActions?: boolean
  /** Function to determine if delete button is disabled */
  disableDelete?: (row: any, index: number) => boolean
  /** Whether to show add button */
  showAddButton?: boolean
  /** Add button text */
  addText?: string
  /** Delete button text */
  deleteText?: string
  /** Fixed columns */
  fixed?: boolean
  /** Empty text */
  emptyText?: string
  /** Header class */
  headerClass?: string
  /** Row class function */
  rowClass?: string | ((row: any, index: number) => string)
  /** Enable form validation */
  enableValidation?: boolean
}

const props = withDefaults(defineProps<DataGridProps>(), {
  modelValue: () => [],
  columns: () => [],
  disabled: false,
  rowHeight: 54,
  headerHeight: 50,
  height: 400,
  disableRowHover: false,
  actionColumnWidth: 120,
  showActions: true,
  alwaysShowActions: false,
  customActions: false,
  disableDelete: () => false,
  showAddButton: true,
  addText: '添加行',
  deleteText: '删除',
  fixed: false,
  emptyText: '暂无数据',
  headerClass: '',
  enableValidation: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  add: [row: any]
  delete: [index: number, row: any]
  change: [data: any[]]
  'cell-change': [row: any, key: string, value: any, index: number]
  'row-click': [row: any, index: number]
}>()

const tableRef = ref()
const tableData = ref<any[]>([])

// Computed
const dynamicColumns = computed(() => props.columns)

const showActionColumn = computed(() => {
  return (props.showActions && !props.disabled) || (props.showActions && props.alwaysShowActions)
})

const mergedColumns = computed((): Column<any>[] => {
  const cols: Column<any>[] = props.columns.map((col) => {
    const column: any = {
      key: col.key,
      dataKey: col.dataKey,
      title: col.title,
      width: col.width || 150,
      align: col.align || 'left',
      cellRenderer: ({ rowData, rowIndex }) => {
        if (props.disabled && col.formatter) {
          return col.formatter(rowData[col.dataKey], rowData)
        }
        if (props.disabled) {
          return h('span', { class: 'cell-text' }, rowData[col.dataKey])
        }
        return h('div', { class: 'cell-wrapper' })
      }
    }

    if (col.minWidth) column.minWidth = col.minWidth
    if (col.maxWidth) column.maxWidth = col.maxWidth
    if (col.fixed) column.fixed = col.fixed
    if (col.sortable) column.sortable = col.sortable
    if (col.headerRenderer) column.headerRenderer = col.headerRenderer
    if (col.cellRenderer) column.cellRenderer = col.cellRenderer

    return column
  })

  // Add action column
  if (showActionColumn.value) {
    cols.push({
      key: 'actions',
      dataKey: 'actions',
      title: '操作',
      width: props.actionColumnWidth,
      align: 'center',
      fixed: true,
      cellRenderer: () => h('div', { class: 'cell-wrapper' })
    } as any)
  }

  return cols
})

const emptyRenderer = () => {
  return h(ElEmpty, {
    description: props.emptyText,
    imageSize: 100
  })
}

// Methods
const getRowClass = ({ rowIndex }: { rowIndex: number }) => {
  if (isFunction(props.rowClass)) {
    return props.rowClass(tableData.value[rowIndex], rowIndex)
  }
  return props.rowClass || ''
}

const isDeleteDisabled = (row: any, index: number) => {
  return props.disableDelete(row, index)
}

const handleAdd = () => {
  const newRow = props.columns.reduce((acc, col) => {
    acc[col.dataKey] = col.defaultValue ?? ''
    return acc
  }, {} as any)

  tableData.value.push(newRow)
  emit('update:modelValue', tableData.value)
  emit('add', newRow)
  emit('change', tableData.value)
}

const handleDelete = (index: number) => {
  const deletedRow = tableData.value[index]
  tableData.value.splice(index, 1)
  emit('update:modelValue', tableData.value)
  emit('delete', index, deletedRow)
  emit('change', tableData.value)
}

const handleCellChange = (row: any, key: string, value: any, index: number) => {
  emit('cell-change', row, key, value, index)
  emit('update:modelValue', tableData.value)
  emit('change', tableData.value)
}

const handleRowClick = ({ rowData, rowIndex }: { rowData: any; rowIndex: number }) => {
  emit('row-click', rowData, rowIndex)
}

// Watch
watch(
  () => props.modelValue,
  (newVal) => {
    tableData.value = cloneDeep(newVal)
  },
  { immediate: true, deep: true }
)

// Expose
defineExpose({
  tableRef,
  tableData,
  addRow: handleAdd,
  deleteRow: handleDelete
})
</script>

<style lang="less" scoped>
.virtualized-data-grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .grid-header {
    margin-bottom: 16px;
  }

  :deep(.el-table-v2__root) {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
  }

  :deep(.el-table-v2__header-row) {
    background-color: var(--el-fill-color-light);
    font-weight: 500;
  }

  :deep(.el-table-v2__row) {
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--el-fill-color-lighter);
    }
  }

  &.disable-row-hover {
    :deep(.el-table-v2__row) {
      &:hover {
        background-color: transparent;
      }
    }
  }

  :deep(.el-table-v2__cell) {
    padding: 8px 12px;
  }

  .cell-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
  }

  .grid-footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-start;
  }
}
</style>
