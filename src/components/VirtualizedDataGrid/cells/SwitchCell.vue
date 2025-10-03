<template>
  <div class="switch-cell">
    <ElSwitch
      :model-value="modelValue"
      :disabled="disabled"
      :active-text="column.cellProps?.activeText"
      :inactive-text="column.cellProps?.inactiveText"
      :active-value="column.cellProps?.activeValue ?? true"
      :inactive-value="column.cellProps?.inactiveValue ?? false"
      v-bind="column.cellProps"
      @update:model-value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
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
.switch-cell {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
