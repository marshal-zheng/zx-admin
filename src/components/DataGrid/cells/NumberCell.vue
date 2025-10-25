<template>
  <div class="number-cell">
    <ElInputNumber
      :model-value="modelValue"
      :placeholder="column.placeholder || '请输入数字'"
      :disabled="disabled"
      :min="column.cellProps?.min ?? 0"
      :max="column.cellProps?.max"
      :step="column.cellProps?.step ?? 1"
      :precision="column.cellProps?.precision"
      controls-position="right"
      v-bind="column.cellProps"
      @update:model-value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ElInputNumber } from 'element-plus'
import type { DataGridColumn } from '../types'

interface Props {
  modelValue: any
  row: any
  column: DataGridColumn
  index: number
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const handleUpdate = (value: any) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.number-cell {
  width: 100%;

  :deep(.el-input-number) {
    width: 100%;
  }
}
</style>
