<template>
  <ZxChart
    ref="chartRef"
    v-bind="$attrs"
    @ready="$emit('ready', $event)"
    @click="$emit('click', $event)"
    @dblclick="$emit('dblclick', $event)"
    @mouseover="$emit('mouseover', $event)"
    @mouseout="$emit('mouseout', $event)"
  />
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['ready', 'click', 'dblclick', 'mouseover', 'mouseout'])

const chartRef = ref(null)

const getInstance = () => chartRef.value?.getChart()
const resize = () => chartRef.value?.resize()
const refresh = () => chartRef.value?.resize()
const clear = () => chartRef.value?.clear()

defineExpose({
  getInstance,
  resize,
  refresh,
  clear,
  chartRef
})
</script>
