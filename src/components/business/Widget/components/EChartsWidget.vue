<template>
  <div class="m-echarts-widget">
    <!-- 空状态显示 -->
    <ZxEmpty
      v-if="isEmpty"
      :text="emptyConfig.noDataText"
      :image-size="emptyConfig.emptyImageSize"
      class="chart-empty-state"
    />

    <!-- 图表组件 -->
    <component
      v-else
      :is="chartComponent"
      ref="chartRef"
      :options="styledOptions"
      class="chart-plugin-wrapper zx-chart-rounded"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { transformByChartType } from '../util'
import { applyGrafanaStyleToOption } from '../config/echarts'

// 动态导入图表插件组件
const chartPlugins = {
  line: defineAsyncComponent(() => import('../plugins/LineChart.vue')),
  bar: defineAsyncComponent(() => import('../plugins/BarChart.vue')),
  pie: defineAsyncComponent(() => import('../plugins/PieChart.vue')),
  donut: defineAsyncComponent(() => import('../plugins/PieChart.vue')),
  area: defineAsyncComponent(() => import('../plugins/AreaChart.vue')),
  scatter: defineAsyncComponent(() => import('../plugins/ScatterChart.vue')),
  radar: defineAsyncComponent(() => import('../plugins/RadarChart.vue')),
  areaRadar: defineAsyncComponent(() => import('../plugins/AreaRadarChart.vue')),
  curve: defineAsyncComponent(() => import('../plugins/CurveChart.vue'))
}

const props = defineProps({
  // 面板对象：从 DashboardGrid 传递过来的完整面板信息
  panel: {
    type: Object,
    default: null
  }
})

// 响应式引用
const chartRef = ref(null)

// 空状态配置（组件内部定义）
const emptyConfig = {
  noDataText: '暂无数据',
  emptyImageSize: 120
}

// 计算属性：从 panel 解析 evaluationData
const evaluationData = computed(() => {
  try {
    return JSON.parse(props.panel?.metadata?.data || '{}')
  } catch (error) {
    console.warn('EChartsWidget: 无法解析 panel.metadata.data:', error)
    return {}
  }
})

// 计算属性：处理后的 options（数据转换）
const processedOptions = computed(() => {
  // 如果有 evaluationData，使用数据处理器处理
  if (evaluationData.value && Object.keys(evaluationData.value).length > 0) {
    // 如果解析后的数据有 option 属性，直接使用
    if (evaluationData.value.option) {
      return evaluationData.value.option
    }

    // 否则使用数据处理器处理，传入面板类型和标题信息
    const chartType = props.panel?.type || 'line'
    // const chartTitle = props.panel?.title

    // 创建一个包含面板信息的选项对象
    const baseOption = {
      // title: chartTitle ? { text: chartTitle } : undefined
    }

    const transformResult = transformByChartType(chartType, evaluationData.value, baseOption)

    // 如果是饼图，transformToPieChart 返回数组，我们取第一个
    // if (chartType === 'pie' && Array.isArray(transformResult)) {
    //   return transformResult[0] || baseOption
    // }

    console.log('transformResult', transformResult)

    return transformResult
  }

  // 否则使用演示数据，但加上面板标题
  const result = generateDemoOption()
  if (props.panel?.title && (!result.title || !result.title.text)) {
    return {
      ...result,
      title: {
        ...(result.title || {}),
        text: props.panel.title
      }
    }
  }

  return result
})

// 计算属性：应用 Grafana 风格样式（不改变调色板）
const styledOptions = computed(() => {
  const chartType = props.panel?.type
  return applyGrafanaStyleToOption(processedOptions.value, { type: chartType })
})

// 计算属性：动态选择图表组件
const chartComponent = computed(() => {
  // 优先使用 panel.type，如果没有则默认为 line
  const chartType = props.panel?.type || 'line'
  return chartPlugins[chartType] || chartPlugins.line
})

// 计算属性：判断是否为空数据
const isEmpty = computed(() => {
  const hasEvaluationData = evaluationData.value && Object.keys(evaluationData.value).length > 0
  const hasPanelData = props.panel?.metadata?.data

  return !hasEvaluationData && !hasPanelData
})

// 监听面板数据变化并打印调试信息
watch(
  () => props.panel,
  (newPanel) => {
    console.log('🎯 EChartsWidget panel changed:', newPanel)
    // 可以从 panel 对象中获取数据：newPanel?.getData() 或 newPanel?.metadata?.data
  },
  { immediate: true, deep: true }
)

// 生成演示数据的辅助函数（仅在没有真实数据时使用）
const generateDemoOption = () => {
  const categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 100)

  return {
    title: { text: '演示图表' },
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: [
      {
        name: '演示数据',
        type: 'line',
        data: values,
        smooth: true
      }
    ]
  }
}

// 对外暴露方法，便于父组件直接操作
const getInstance = () => chartRef.value?.getChart()
const resize = () => chartRef.value?.resize()
const refresh = () => chartRef.value?.resize() // ZxChart 没有 refresh 方法，用 resize 代替
const clear = () => chartRef.value?.clear()

defineExpose({
  getInstance,
  resize,
  refresh,
  clear,
  chartRef
})
</script>

<style lang="scss">
.m-echarts-widget {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .chart-plugin-wrapper {
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
  }

  .chart-empty-state {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
