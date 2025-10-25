<template>
  <div class="select-cell">
    <ElSelect
      :model-value="modelValue"
      :placeholder="column.placeholder || '请选择'"
      :disabled="disabled"
      clearable
      v-bind="column.cellProps"
      @update:model-value="handleUpdate"
    >
      <ElOption
        v-for="option in column.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </ElSelect>
  </div>
</template>

<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
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
.select-cell {
  width: 100%;

  :deep(.el-select) {
    width: 100%;
  }
}
</style>
