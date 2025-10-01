<template>
  <div class="pie-chart-container" :data-selector-position="selectorPosition">
    <!-- 数据选择器 -->
    <div v-if="showSelector && selectOptions.length > 1" class="chart-selector">
      <ZxSelect
        v-model="selectedIndex"
        class="chart-select"
        size="small"
        :options="selectOptions"
        :allow-search="false"
        :allow-clear="false"
        placeholder="选择图表"
        @change="handleSelectionChange"
      />
    </div>

    <!-- 图表组件 -->
    <ZxChart
      ref="chartRef"
      :options="currentOption"
      v-bind="chartAttrs"
      @ready="emit('ready', $event)"
      @click="emit('click', $event)"
      @dblclick="emit('dblclick', $event)"
      @mouseover="emit('mouseover', $event)"
      @mouseout="emit('mouseout', $event)"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, readonly, useAttrs } from 'vue'
import ZxChart from '@/components/pure/ZxChart/index.vue'

const props = defineProps({
  // 支持单个option对象或options数组
  options: {
    type: [Object, Array],
    default: () => ({})
  },
  // 是否显示选择器（当有多个数据时）
  showSelector: {
    type: Boolean,
    default: true
  },
  // 选择器位置
  selectorPosition: {
    type: String,
    default: 'top-right', // top-right, top-left, top-center
    validator: (value) => ['top-right', 'top-left', 'top-center'].includes(value)
  }
})

const emit = defineEmits([
  'ready',
  'click',
  'dblclick',
  'mouseover',
  'mouseout',
  'selection-change'
])

const chartRef = ref(null)
const selectedIndex = ref(0)
const attrs = useAttrs()

// 计算选择器选项
const selectOptions = computed(() => {
  console.log('options', props.options)
  if (Array.isArray(props.options)) {
    return props.options.map((opt, index) => ({
      label: opt.title?.text || `图表 ${index + 1}`,
      value: index
    }))
  }
  return []
})

// 计算当前显示的option
const currentOption = computed(() => {
  console.log('props.options', props.options)

  if (Array.isArray(props.options)) {
    console.log('selectedIndex.value', props.options[selectedIndex.value])
    return props.options[selectedIndex.value] || props.options[0] || {}
  }
  return props.options || {}
})

// 过滤掉 option(s) 相关的 attrs，避免传递给 ZxChart 覆盖内部计算
const chartAttrs = computed(() => {
  const { option, options, showSelector, selectorPosition, ...restAttrs } = attrs
  return restAttrs
})

// 处理选择变化
const handleSelectionChange = (index) => {
  selectedIndex.value = index
  emit('selection-change', {
    index,
    option: props.options[index],
    title: selectOptions.value[index]?.label
  })
}

// 监听option变化，重置选择
watch(
  () => props.options,
  (newOption) => {
    if (Array.isArray(newOption) && newOption.length > 0) {
      // 如果当前选择的索引超出范围，重置为0
      if (selectedIndex.value >= newOption.length) {
        selectedIndex.value = 0
      }
    }
  },
  { immediate: true }
)

// 暴露的方法
const getInstance = () => chartRef.value?.getChart()
const resize = () => chartRef.value?.resize()
const refresh = () => chartRef.value?.resize()
const clear = () => chartRef.value?.clear()

// 获取当前选中的数据信息
const getCurrentSelection = () => ({
  index: selectedIndex.value,
  option: currentOption.value,
  title: selectOptions.value[selectedIndex.value]?.label
})

// 设置选中项
const setSelection = (index) => {
  if (Array.isArray(props.options) && index >= 0 && index < props.options.length) {
    selectedIndex.value = index
  }
}

defineExpose({
  getInstance,
  resize,
  refresh,
  clear,
  chartRef,
  getCurrentSelection,
  setSelection,
  selectedIndex: readonly(selectedIndex)
})
</script>

<style scoped>
.pie-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-selector {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;

  /* background: rgba(255, 255, 255, 0.9); */
  border-radius: 4px;

  /* padding: 4px; */

  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  backdrop-filter: blur(4px);
}

.chart-select {
  min-width: 120px;
}

.chart-select :deep(.el-input__inner) {
  background: rgb(255 255 255 / 95%);
  border: 1px solid #e4e7ed;
}

.chart-select :deep(.el-input__inner):hover {
  border-color: #c0c4cc;
}

.chart-select :deep(.el-input__inner):focus {
  border-color: #409eff;
}

/* 选择器位置变体 */
.pie-chart-container[data-selector-position='top-left'] .chart-selector {
  right: auto;
  left: 8px;
}

.pie-chart-container[data-selector-position='top-center'] .chart-selector {
  right: auto;
  left: 50%;
  transform: translateX(-50%);
}
</style>
