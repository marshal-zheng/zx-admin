<template>
  <div class="input-cell">
    <ElInput
      :model-value="modelValue"
      :placeholder="column.placeholder || '请输入'"
      :disabled="disabled"
      clearable
      v-bind="column.cellProps"
      @update:model-value="handleUpdate"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
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

const handleBlur = () => {
  // Can add validation logic here
}
</script>

<style lang="scss" scoped>
.input-cell {
  width: 100%;

  :deep(.el-input) {
    width: 100%;
  }
}
</style>
