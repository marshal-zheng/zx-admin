<template>
  <div class="zx-chart-example">
    <div class="example-header">
      <h2>ZxChart 图表组件示例</h2>
      <p>基于 ECharts 的 Vue 3 图表组件，支持多种图表类型和自定义配置。</p>
    </div>

    <div class="example-section">
      <h3>基础柱状图</h3>
      <el-card>
        <ZxChart
          :options="barChartOptions"
          height="300px"
          @click="handleChartClick"
          @ready="handleChartReady"
        />
      </el-card>
    </div>

    <div class="example-section">
      <h3>折线图</h3>
      <el-card>
        <ZxChart :options="lineChartOptions" height="300px" class="zx-chart-rounded" />
      </el-card>
    </div>

    <div class="example-section">
      <h3>饼图</h3>
      <el-card>
        <ZxChart :options="pieChartOptions" height="400px" class="zx-chart-shadow-lg" />
      </el-card>
    </div>

    <div class="example-section">
      <h3>雷达图</h3>
      <el-card>
        <ZxChart :options="radarChartOptions" height="350px" class="zx-chart-borderless" />
      </el-card>
    </div>

    <div class="example-section">
      <h3>动态数据更新</h3>
      <el-card>
        <div class="example-controls">
          <el-button type="primary" @click="updateData">更新数据</el-button>
          <el-button @click="clearChart">清空图表</el-button>
          <el-button @click="resizeChart">重新调整大小</el-button>
        </div>
        <ZxChart ref="dynamicChartRef" :options="dynamicChartOptions" height="300px" />
      </el-card>
    </div>

    <div class="example-section">
      <h3>主题自动适配演示</h3>
      <el-card>
        <div class="example-controls">
          <el-space>
            <el-button type="primary" @click="switchToLight">浅色主题</el-button>
            <el-button type="primary" @click="switchToDark">深色主题</el-button>
            <el-button type="primary" @click="switchToDarkBlue">深蓝主题</el-button>
            <el-button @click="refreshAllCharts">刷新所有图表</el-button>
          </el-space>
          <div class="theme-info">
            <el-tag>当前主题: {{ currentSystemTheme }}</el-tag>
            <el-tag type="info"
              >主题适配: {{ themeAdaptationEnabled ? '已启用' : '已禁用' }}</el-tag
            >
          </div>
        </div>
        <ZxChart
          ref="themeChartRef"
          :options="themeChartOptions"
          :enable-theme-adaptation="themeAdaptationEnabled"
          height="300px"
          @theme-change="handleChartThemeChange"
        />
        <div class="example-controls" style="margin-top: 16px">
          <el-switch
            v-model="themeAdaptationEnabled"
            active-text="启用主题适配"
            inactive-text="禁用主题适配"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import ZxChart from './index.vue'
import { ElMessage } from 'element-plus'
import { setTheme, getCurrentTheme, THEME_TYPES } from '@/utils/theme.js'

// 响应式数据
const dynamicChartRef = ref()
const themeChartRef = ref()
const currentSystemTheme = ref('light')
const themeAdaptationEnabled = ref(true)

// 基础柱状图配置
const barChartOptions = reactive({
  title: {
    text: '月度销售数据',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['销售额', '利润'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110],
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: '利润',
      type: 'bar',
      data: [60, 100, 75, 40, 35, 55],
      itemStyle: {
        color: '#67C23A'
      }
    }
  ]
})

// 折线图配置
const lineChartOptions = reactive({
  title: {
    text: '网站访问量趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['访问量', '用户数'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: '用户数',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
      smooth: true,
      itemStyle: {
        color: '#67C23A'
      }
    }
  ]
})

// 饼图配置
const pieChartOptions = reactive({
  title: {
    text: '产品销售占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: '销售占比',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 335, name: '产品A' },
        { value: 310, name: '产品B' },
        { value: 234, name: '产品C' },
        { value: 135, name: '产品D' },
        { value: 1548, name: '产品E' }
      ]
    }
  ]
})

// 雷达图配置
const radarChartOptions = reactive({
  title: {
    text: '能力评估雷达图',
    left: 'center'
  },
  tooltip: {},
  legend: {
    data: ['预算分配', '实际开销'],
    top: 30
  },
  radar: {
    indicator: [
      { name: '销售', max: 6500 },
      { name: '管理', max: 16000 },
      { name: '信息技术', max: 30000 },
      { name: '客服', max: 38000 },
      { name: '研发', max: 52000 },
      { name: '市场', max: 25000 }
    ]
  },
  series: [
    {
      name: '预算 vs 开销',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: '预算分配'
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: '实际开销'
        }
      ]
    }
  ]
})

// 动态图表配置
const dynamicChartOptions = reactive({
  title: {
    text: '动态数据图表',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '数据',
      type: 'bar',
      data: [10, 20, 30, 40, 50],
      itemStyle: {
        color: '#E6A23C'
      }
    }
  ]
})

// 主题图表配置
const themeChartOptions = reactive({
  title: {
    text: '主题切换示例 - 多条折线',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['销售额', '访问量', '转化率', '用户数', '收入'],
    top: 30
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '销售额',
      type: 'line',
      data: [150, 230, 224, 218, 135, 147, 260],
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      },
      lineStyle: {
        width: 2
      }
    },
    {
      name: '访问量',
      type: 'line',
      data: [320, 280, 310, 290, 350, 380, 420],
      smooth: true,
      itemStyle: {
        color: '#67C23A'
      },
      lineStyle: {
        width: 2
      }
    },
    {
      name: '转化率',
      type: 'line',
      data: [80, 95, 88, 92, 105, 110, 125],
      smooth: true,
      itemStyle: {
        color: '#E6A23C'
      },
      lineStyle: {
        width: 2
      }
    },
    {
      name: '用户数',
      type: 'line',
      data: [200, 180, 220, 240, 190, 210, 280],
      smooth: true,
      itemStyle: {
        color: '#F56C6C'
      },
      lineStyle: {
        width: 2
      }
    },
    {
      name: '收入',
      type: 'line',
      data: [180, 210, 195, 205, 160, 175, 230],
      smooth: true,
      itemStyle: {
        color: '#909399'
      },
      lineStyle: {
        width: 2
      }
    }
  ]
})

// 事件处理
const handleChartClick = (params) => {
  ElMessage.success(`点击了: ${params.name}, 值: ${params.value}`)
}

const handleChartReady = (chart) => {
  console.log('图表已准备就绪:', chart)
  ElMessage.info('图表加载完成')
}

const updateData = () => {
  const newData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))
  dynamicChartOptions.series[0].data = newData
  ElMessage.success('数据已更新')
}

const clearChart = () => {
  if (dynamicChartRef.value) {
    dynamicChartRef.value.clear()
    ElMessage.info('图表已清空')
  }
}

const resizeChart = () => {
  if (dynamicChartRef.value) {
    dynamicChartRef.value.resize()
    ElMessage.info('图表大小已调整')
  }
}

// 主题切换方法
const switchToLight = () => {
  setTheme(THEME_TYPES.LIGHT)
  currentSystemTheme.value = 'light'
  ElMessage.success('已切换到浅色主题')
}

const switchToDark = () => {
  setTheme(THEME_TYPES.DARK)
  currentSystemTheme.value = 'dark'
  ElMessage.success('已切换到深色主题')
}

const switchToDarkBlue = () => {
  setTheme(THEME_TYPES.DARK_BLUE)
  currentSystemTheme.value = 'dark-blue'
  ElMessage.success('已切换到深蓝主题')
}

const refreshAllCharts = () => {
  // 刷新所有图表的主题
  if (themeChartRef.value) {
    themeChartRef.value.refreshTheme()
  }
  if (dynamicChartRef.value) {
    dynamicChartRef.value.refreshTheme()
  }
  ElMessage.info('所有图表主题已刷新')
}

const handleChartThemeChange = (theme) => {
  currentSystemTheme.value = theme
  console.log('图表主题已变更:', theme)
  ElMessage.info(`图表主题已自动切换到: ${theme}`)
}

onMounted(() => {
  console.log('ZxChart 示例页面已加载')
  // 初始化当前主题
  currentSystemTheme.value = getCurrentTheme()
})
</script>

<style lang="scss" scoped>
.zx-chart-example {
  padding: 20px;

  .example-header {
    margin-bottom: 30px;

    h2 {
      color: #303133;
      margin-bottom: 10px;
    }

    p {
      color: #606266;
      font-size: 14px;
    }
  }

  .example-section {
    margin-bottom: 30px;

    h3 {
      color: #409eff;
      margin-bottom: 15px;
      font-size: 16px;
    }

    .el-card {
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .example-controls {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;

    .el-button {
      margin-right: 10px;
    }

    .el-radio-group {
      .el-radio {
        margin-right: 20px;
      }
    }

    .theme-info {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .zx-chart-example {
    padding: 10px;

    .example-section {
      margin-bottom: 20px;
    }

    .example-controls {
      .el-button {
        margin-bottom: 10px;
        width: 100%;
      }

      .el-radio-group {
        .el-radio {
          display: block;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
