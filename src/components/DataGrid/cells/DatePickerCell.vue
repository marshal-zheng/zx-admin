<template>
  <div class="date-picker-cell">
    <ElDatePicker
      :model-value="modelValue"
      :placeholder="column.placeholder || '请选择日期'"
      :disabled="disabled"
      :type="column.cellProps?.type ?? 'date'"
      :format="column.cellProps?.format ?? 'YYYY-MM-DD'"
      :value-format="column.cellProps?.valueFormat ?? 'YYYY-MM-DD'"
      v-bind="column.cellProps"
      @update:model-value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
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
.date-picker-cell {
  width: 100%;

  :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>
