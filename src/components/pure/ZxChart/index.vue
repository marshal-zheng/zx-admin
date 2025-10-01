<template>
  <div v-if="chartId" ref="chartContainer" class="zx-chart-wrapper" :style="{ width, height }">
    <VCharts
      ref="chartRef"
      :option="themedOptions"
      :autoresize="autoResize"
      :style="{ width: '100%', height: '100%' }"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { getGenerateId } from '../../../utils'
import { applyThemeToOption, createThemeWatcher } from './theme'

import {
  BarChart,
  CustomChart,
  LineChart,
  PieChart,
  RadarChart,
  ParallelChart,
  ScatterChart
} from 'echarts/charts'
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  ParallelComponent
} from 'echarts/components'
import { use } from 'echarts/core'
import { DatasetComponent, TransformComponent } from 'echarts/components'
import { BoxplotChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import VCharts from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  CustomChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  BoxplotChart,
  ParallelChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  GraphicComponent,
  TitleComponent,
  ParallelComponent
])

// 提示：如果需要使用 dataset.transform: 'boxplot'，
// 请手工在业务侧做五数概括数据预处理，
// 或引入额外的数据统计扩展库（如 ecStat），
// 这里不从 'echarts/transform' 引入以避免构建错误。

// 定义属性
const props = defineProps({
  options: {
    type: Object,
    default() {
      return {}
    }
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  // 是否启用主题自动适配
  enableThemeAdaptation: {
    type: Boolean,
    default: true
  }
})

// 定义事件
const emit = defineEmits(['ready', 'click', 'dblclick', 'mouseover', 'mouseout', 'theme-change'])

// 响应式数据
const chartRef = ref()
const chartContainer = ref()
const chartId = ref('')
const currentTheme = ref({ name: 'light', type: 'light', isDark: false })
const themeWatcherDispose = ref(null)

// 计算属性：应用主题的配置
const themedOptions = computed(() => {
  if (!props.enableThemeAdaptation) return props.options
  return applyThemeToOption(props.options, chartContainer.value)
})

// 移除主动 setOption，交给 <VCharts :option="themedOptions"> 自行更新，
// 避免 “setOption should not be called during main process” 报错。
watch(
  () => props.options,
  () => {},
  { deep: true }
)

// 主题变化处理函数
const handleThemeChange = (themeInfo) => {
  currentTheme.value = themeInfo
  emit('theme-change', themeInfo)

  // 触发 VCharts 依赖的 computed 重新计算：
  // themedOptions 内部会基于 DOM 样式重新生成配置。
  // 由于 themedOptions 依赖 props.options 与容器，
  // 这里通过强制刷新尺寸让 VCharts 重算布局与样式。
  nextTick(() => {
    if (chartRef.value) chartRef.value.resize()
  })
}

// 生命周期
onMounted(() => {
  chartId.value = getGenerateId()

  // 启用主题监听
  if (props.enableThemeAdaptation) {
    themeWatcherDispose.value = createThemeWatcher(handleThemeChange)
  }

  // 监听图表事件
  nextTick(() => {
    if (chartRef.value) {
      const chart = chartRef.value

      // chart.on('ready', () => {
      //   emit('ready', chart)
      // })

      // chart.on('click', (params) => {
      //   emit('click', params)
      // })

      // chart.on('dblclick', (params) => {
      //   emit('dblclick', params)
      // })

      // chart.on('mouseover', (params) => {
      //   emit('mouseover', params)
      // })

      // chart.on('mouseout', (params) => {
      //   emit('mouseout', params)
      // })
    }
  })
})

onUnmounted(() => {
  // 清理主题监听器
  if (themeWatcherDispose.value) {
    themeWatcherDispose.value()
    themeWatcherDispose.value = null
  }

  chartId.value = ''
})

// 暴露方法
defineExpose({
  chartRef,
  chartContainer,
  currentTheme,
  getChart: () => chartRef.value,
  resize: () => {
    if (chartRef.value) {
      chartRef.value.resize()
    }
  },
  clear: () => {
    if (chartRef.value) {
      chartRef.value.clear()
    }
  },
  // 手动刷新主题
  refreshTheme: () => {
    if (chartRef.value) chartRef.value.resize()
  },
  // 获取当前应用的主题配置
  getThemedOptions: () => themedOptions.value
})
</script>

<style lang="scss">
@import './index.scss';
</style>
