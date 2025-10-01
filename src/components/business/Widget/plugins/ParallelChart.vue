<template>
  <div
    ref="chartContainer"
    class="parallel-chart-container"
    :style="{ width: '100%', height: '100%' }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { transformToParallelChart } from '@/components/utils/evaluationDataProcessor'

const props = defineProps({
  /**
   * 评估数据
   */
  evaluationData: {
    type: Object,
    default: () => ({})
  },
  /**
   * 图表配置选项
   */
  options: {
    type: Object,
    default: () => ({})
  },
  /**
   * 图表主题
   */
  theme: {
    type: String,
    default: 'default'
  },
  /**
   * 是否自动调整大小
   */
  autoResize: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['chartReady', 'chartClick', 'chartHover'])

const chartContainer = ref(null)
let chartInstance = null
let resizeObserver = null

// 默认配置
const defaultOptions = {
  backgroundColor: 'transparent',
  parallel: {
    left: '5%',
    right: '13%',
    bottom: '10%',
    top: '20%',
    parallelAxisDefault: {
      type: 'value',
      nameLocation: 'end',
      nameGap: 20,
      splitNumber: 3,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#777'
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        color: '#999',
        fontSize: 11
      }
    }
  },
  legend: {
    top: '5%',
    textStyle: {
      color: '#666'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderColor: '#777',
    borderWidth: 1,
    textStyle: {
      color: '#fff',
      fontSize: 12
    }
  },
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut'
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return

  try {
    chartInstance = echarts.init(chartContainer.value, props.theme)

    // 绑定事件
    chartInstance.on('click', (params) => {
      emit('chartClick', params)
    })

    chartInstance.on('mouseover', (params) => {
      emit('chartHover', params)
    })

    emit('chartReady', chartInstance)

    // 更新图表
    updateChart()
  } catch (error) {
    console.error('Failed to initialize parallel chart:', error)
  }
}

// 更新图表
const updateChart = () => {
  if (!chartInstance || !props.evaluationData) return

  try {
    // 转换数据
    const chartOptions = transformToParallelChart(props.evaluationData, {
      ...defaultOptions,
      ...props.options
    })

    // 设置图表配置
    chartInstance.setOption(chartOptions, true)
  } catch (error) {
    console.error('Failed to update parallel chart:', error)
  }
}

// 调整图表大小
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 销毁图表
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

// 设置自动调整大小
const setupAutoResize = () => {
  if (!props.autoResize || !chartContainer.value) return

  // 使用 ResizeObserver 监听容器大小变化
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      nextTick(() => {
        resizeChart()
      })
    })
    resizeObserver.observe(chartContainer.value)
  } else {
    // 降级方案：监听窗口大小变化
    window.addEventListener('resize', resizeChart)
  }
}

// 监听数据变化
watch(
  () => props.evaluationData,
  () => {
    nextTick(() => {
      updateChart()
    })
  },
  { deep: true }
)

// 监听配置变化
watch(
  () => props.options,
  () => {
    nextTick(() => {
      updateChart()
    })
  },
  { deep: true }
)

// 监听主题变化
watch(
  () => props.theme,
  () => {
    destroyChart()
    nextTick(() => {
      initChart()
      setupAutoResize()
    })
  }
)

onMounted(() => {
  nextTick(() => {
    initChart()
    setupAutoResize()
  })
})

onUnmounted(() => {
  destroyChart()
  if (!window.ResizeObserver) {
    window.removeEventListener('resize', resizeChart)
  }
})

// 暴露方法给父组件
defineExpose({
  chartInstance,
  resizeChart,
  updateChart
})
</script>

<style scoped>
.parallel-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.parallel-chart-container canvas {
  display: block;
}
</style>
