<template>
  <div class="donut-chart-container">
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

const props = defineProps({
  // 图表配置选项
  options: {
    type: Object,
    default: () => ({})
  },
  // 环形图特有配置
  innerRadius: {
    type: String,
    default: '50%'
  },
  outerRadius: {
    type: String,
    default: '80%'
  },
  // 是否显示中心标题
  showCenterTitle: {
    type: Boolean,
    default: true
  },
  // 是否显示总计
  showTotal: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['ready', 'click', 'dblclick', 'mouseover', 'mouseout'])

const chartRef = ref(null)
const attrs = useAttrs()

// 计算当前显示的option，并应用环形图特有配置
const currentOption = computed(() => {
  const baseOption = props.options || {}

  // 深拷贝并应用环形图特有配置
  const option = JSON.parse(JSON.stringify(baseOption))

  if (option.series && Array.isArray(option.series)) {
    option.series.forEach((series) => {
      if (series.type === 'pie') {
        // 设置环形图的内外半径
        series.radius = [props.innerRadius, props.outerRadius]

        // 优化环形图的标签显示
        if (!series.label) series.label = {}
        series.label.show = true
        series.label.position = 'outside'
        series.label.formatter = '{b}: {c} ({d}%)'
        series.label.fontSize = 12

        // 优化标签线
        if (!series.labelLine) series.labelLine = {}
        series.labelLine.show = true
        series.labelLine.length = 15
        series.labelLine.length2 = 10

        // 增强悬停效果
        if (!series.emphasis) series.emphasis = {}
        if (!series.emphasis.itemStyle) series.emphasis.itemStyle = {}
        series.emphasis.itemStyle.shadowBlur = 10
        series.emphasis.itemStyle.shadowOffsetX = 0
        series.emphasis.itemStyle.shadowColor = 'rgba(0, 0, 0, 0.5)'
      }
    })
  }

  // 优化标题位置（环形图中心）
  if (props.showCenterTitle && option.title) {
    option.title.left = 'center'
    option.title.top = 'center'
    option.title.textAlign = 'center'
    if (!option.title.textStyle) option.title.textStyle = {}
    option.title.textStyle.fontSize = 16
    option.title.textStyle.fontWeight = 'bold'

    if (props.showTotal && option.title.subtext) {
      if (!option.title.subtextStyle) option.title.subtextStyle = {}
      option.title.subtextStyle.fontSize = 14
      option.title.subtextStyle.color = '#666'
    }
  }

  // 优化图例位置
  if (option.legend) {
    option.legend.orient = 'vertical'
    option.legend.left = 'left'
    option.legend.top = 'middle'
    if (!option.legend.textStyle) option.legend.textStyle = {}
    option.legend.textStyle.fontSize = 12
  }

  // 优化提示框
  if (option.tooltip) {
    option.tooltip.trigger = 'item'
    option.tooltip.backgroundColor = 'rgba(50, 50, 50, 0.9)'
    option.tooltip.borderColor = '#777'
    option.tooltip.borderWidth = 1
    if (!option.tooltip.textStyle) option.tooltip.textStyle = {}
    option.tooltip.textStyle.color = '#fff'
    option.tooltip.textStyle.fontSize = 12
  }

  return option
})

// 过滤掉 option(s) 相关的 attrs，避免传递给 ZxChart 覆盖内部计算
const chartAttrs = computed(() => {
  const { option, options, innerRadius, outerRadius, showCenterTitle, showTotal, ...restAttrs } =
    attrs
  return restAttrs
})

// 暴露的方法
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

<style scoped>
.donut-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 环形图特有样式 */
.donut-chart-container :deep(.echarts-for-react) {
  position: relative;
}

/* 中心文本区域样式优化 */
.donut-chart-container :deep(.echarts-for-react canvas) {
  border-radius: 8px;
}
</style>
