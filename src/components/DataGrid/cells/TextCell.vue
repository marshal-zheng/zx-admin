<template>
  <div class="text-cell">
    <span>{{ displayValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DataGridColumn } from '../types'

const props = defineProps<{
  modelValue: any
  row: any
  column: DataGridColumn
  index: number
}>()

const displayValue = computed(() => {
  if (props.column.formatter) {
    return props.column.formatter(props.modelValue, props.row)
  }
  return props.modelValue || ''
})
</script>

<style scoped>
.text-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.text-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
