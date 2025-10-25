<template>
  <div class="textarea-cell">
    <ElInput
      :model-value="modelValue"
      type="textarea"
      :placeholder="column.placeholder || '请输入'"
      :disabled="disabled"
      :rows="column.cellProps?.rows ?? 2"
      :autosize="column.cellProps?.autosize ?? { minRows: 1, maxRows: 4 }"
      v-bind="column.cellProps"
      @update:model-value="handleUpdate"
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
</script>

<style lang="scss" scoped>
.textarea-cell {
  width: 100%;

  :deep(.el-textarea) {
    width: 100%;
  }
}
</style>
