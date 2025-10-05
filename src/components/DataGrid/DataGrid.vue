<template>
  <div class="virtualized-data-grid" :class="{ 'disable-row-hover': disableRowHover }">
    <!-- Header Slot -->
    <div v-if="$slots.header" class="grid-header">
      <slot name="header"></slot>
    </div>

    <!-- Main Table -->
    <el-table
      ref="tableRef"
      :data="tableData"
      :height="height"
      :max-height="height"
      :row-class-name="getRowClassName"
      :header-cell-class-name="headerClass"
      :empty-text="emptyText"
      @row-click="handleRowClickWrapper"
      v-bind="$attrs"
    >
      <el-table-column
        v-for="col in dynamicColumns"
        :key="col.key"
        :prop="col.dataKey"
        :label="col.title"
        :width="col.width"
        :min-width="col.minWidth"
        :align="col.align || 'left'"
        :fixed="col.fixed"
      >
        <template #default="{ row, $index }">
          <slot :name="`cell-${col.key}`" :row="row" :index="$index" :column="col">
            <div v-if="disabled && col.formatter" class="cell-text">
              {{ col.formatter(row[col.dataKey], row) }}
            </div>
            <div v-else-if="disabled" class="cell-text">
              {{ row[col.dataKey] }}
            </div>
            <component
              v-else
              :is="resolveCellComponent(col, row, $index)"
              v-model="row[col.dataKey]"
              :row="row"
              :column="col"
              :index="$index"
              :disabled="disabled || col.disabled"
              v-bind="resolveComponentProps(col, row, $index)"
              @update:modelValue="handleCellChange(row, col.dataKey, $event, $index)"
              @update:model-value="handleCellChange(row, col.dataKey, $event, $index)"
              @change="handleCellChange(row, col.dataKey, $event, $index)"
            />
          </slot>
        </template>
      </el-table-column>

      <!-- Action Column -->
      <el-table-column
        v-if="showActionColumn"
        label="操作"
        :width="actionColumnWidth"
        align="center"
        fixed="right"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <div class="action-buttons">
              <ElButton
                v-if="!customActions"
                link
                type="danger"
                :icon="Delete"
                :disabled="disabled || isDeleteDisabled(row, $index)"
                @click.stop="handleDelete($index)"
              >
                {{ deleteText }}
              </ElButton>
            </div>
          </slot>
        </template>
      </el-table-column>
    </el-table>

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
import { ref, computed, watch } from 'vue'
import type { Component } from 'vue'
import { ElButton } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
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
const resolveCellComponent = (column: DataGridColumn, row: any, index: number): Component => {
  if (column.componentResolver) {
    return column.componentResolver(row, index)
  }
  if (column.component) {
    return column.component
  }
  if (column.type === 'custom' && column.cellRenderer) {
    return column.cellRenderer as Component
  }

  const type = column.type || 'input'
  return cellComponentMap[type] || InputCell
}

const resolveComponentProps = (column: DataGridColumn, row: any, index: number) => {
  if (!column.componentProps) return {}
  const props = isFunction(column.componentProps)
    ? column.componentProps(row, index)
    : column.componentProps
  return props || {}
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
  height: undefined,
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

// Methods
const getRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (isFunction(props.rowClass)) {
    return props.rowClass(row, rowIndex)
  }
  return props.rowClass || ''
}

const handleRowClickWrapper = (row: any, column: any, event: Event) => {
  const rowIndex = tableData.value.indexOf(row)
  emit('row-click', row, rowIndex)
}

const isDeleteDisabled = (row: any, index: number) => {
  return props.disableDelete(row, index)
}

const handleAdd = () => {
  const newRow = props.columns.reduce((acc, col) => {
    acc[col.dataKey] = col.defaultValue ?? ''
    return acc
  }, {} as any)

  const newData = [...tableData.value, newRow]
  tableData.value = newData
  emit('update:modelValue', newData)
  emit('add', newRow)
  emit('change', newData)
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

// Watch
watch(
  () => props.modelValue,
  (newVal) => {
    tableData.value = cloneDeep(newVal)
  },
  { immediate: true, deep: true }
)

// Public methods
const scrollToRow = (index: number) => {
  if (tableRef.value && tableRef.value.scrollToRow) {
    tableRef.value.scrollToRow(index)
  }
}

// Expose
defineExpose({
  tableRef,
  tableData,
  addRow: handleAdd,
  deleteRow: handleDelete,
  scrollToRow
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

  :deep(.el-table) {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
  }

  :deep(.el-table__header-wrapper) {
    background-color: var(--el-fill-color-light);
    font-weight: 500;
  }

  :deep(.el-table__row) {
    transition: background-color 0.2s;
  }

  &.disable-row-hover {
    :deep(.el-table__row:hover > td) {
      background-color: transparent !important;
    }
  }

  :deep(.el-table td),
  :deep(.el-table th) {
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
