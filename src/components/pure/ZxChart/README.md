# ZxChart 图表组件

基于 ECharts 和 Vue 3 的图表组件，提供了丰富的图表类型和自定义配置选项。

## 特性

- 🎨 **多种图表类型** - 支持柱状图、折线图、饼图、雷达图等多种图表类型
- 🎯 **响应式设计** - 自动适配不同屏幕尺寸，支持移动端
- 🎪 **主题支持** - 内置多种主题，支持暗色模式
- 🔧 **高度可定制** - 丰富的 CSS 变量，支持样式定制
- 📱 **事件支持** - 完整的图表交互事件支持
- ⚡ **性能优化** - 自动调整大小，按需加载图表组件
- 🛠️ **TypeScript 友好** - 完整的类型定义支持

## 基础用法

```vue
<template>
  <ZxChart :options="chartOptions" height="300px" @click="handleChartClick" />
</template>

<script setup>
import { reactive } from 'vue'

const chartOptions = reactive({
  title: {
    text: '示例图表'
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
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
})

const handleChartClick = (params) => {
  console.log('图表点击事件:', params)
}
</script>
```

## 高级用法

### 动态数据更新

```vue
<template>
  <div>
    <el-button @click="updateData">更新数据</el-button>
    <ZxChart ref="chartRef" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const chartRef = ref()
const chartOptions = reactive({
  // 图表配置
})

const updateData = () => {
  // 更新图表数据
  chartOptions.series[0].data = generateNewData()
}

const resizeChart = () => {
  chartRef.value?.resize()
}
</script>
```

### 自定义样式

```vue
<template>
  <ZxChart :options="chartOptions" class="custom-chart" height="400px" />
</template>

<style>
.custom-chart {
  --zx-chart-background-color: #f5f7fa;
  --zx-chart-border-radius: 12px;
  --zx-chart-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
```

## Props

| 参数       | 说明             | 类型      | 默认值      |
| ---------- | ---------------- | --------- | ----------- |
| options    | ECharts 配置选项 | `Object`  | `{}`        |
| autoResize | 是否自动调整大小 | `Boolean` | `true`      |
| width      | 图表宽度         | `String`  | `'100%'`    |
| height     | 图表高度         | `String`  | `'100%'`    |
| theme      | 图表主题         | `String`  | `'default'` |

## Events

| 事件名    | 说明           | 回调参数   |
| --------- | -------------- | ---------- |
| ready     | 图表初始化完成 | `(chart)`  |
| click     | 图表点击事件   | `(params)` |
| dblclick  | 图表双击事件   | `(params)` |
| mouseover | 鼠标悬停事件   | `(params)` |
| mouseout  | 鼠标离开事件   | `(params)` |

## Methods

通过 `ref` 可以访问以下方法：

| 方法名   | 说明              | 参数 |
| -------- | ----------------- | ---- |
| getChart | 获取 ECharts 实例 | -    |
| resize   | 重新调整图表大小  | -    |
| clear    | 清空图表          | -    |

## 样式定制

组件提供了丰富的 CSS 变量用于样式定制：

```css
:root {
  /* 基础样式 */
  --zx-chart-background-color: #ffffff;
  --zx-chart-border-color: #e4e7ed;
  --zx-chart-border-radius: 4px;
  --zx-chart-border-width: 1px;
  --zx-chart-padding: 16px;
  --zx-chart-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);

  /* 尺寸 */
  --zx-chart-min-height: 200px;
  --zx-chart-min-width: 200px;

  /* 加载状态 */
  --zx-chart-loading-color: #409eff;
  --zx-chart-loading-background: rgba(255, 255, 255, 0.9);

  /* 暗色主题 */
  --zx-chart-dark-background-color: #1d1e1f;
  --zx-chart-dark-border-color: #4c4d4f;
}
```

## 样式类

组件支持以下样式类：

- `.zx-chart-borderless` - 无边框样式
- `.zx-chart-no-padding` - 无内边距样式
- `.zx-chart-rounded` - 圆角样式
- `.zx-chart-rounded-lg` - 大圆角样式
- `.zx-chart-shadow-sm` - 小阴影样式
- `.zx-chart-shadow-lg` - 大阴影样式

## 图表类型支持

组件内置支持以下 ECharts 图表类型：

- **柱状图** (Bar Chart)
- **折线图** (Line Chart)
- **饼图** (Pie Chart)
- **雷达图** (Radar Chart)
- **自定义图表** (Custom Chart)

## 响应式支持

组件在不同屏幕尺寸下会自动调整样式：

- **桌面端** (>768px): 完整样式和功能
- **平板端** (≤768px): 调整内边距和字体大小
- **移动端** (≤480px): 进一步优化布局和交互

## 注意事项

1. **依赖要求**: 需要安装 `echarts` 和 `vue-echarts` 依赖
2. **性能考虑**: 大数据量时建议使用数据采样或分页
3. **主题切换**: 切换主题时图表会重新渲染
4. **事件处理**: 图表事件在组件销毁时会自动清理

## 兼容性

- Vue 3.0+
- ECharts 5.0+
- 现代浏览器 (Chrome 60+, Firefox 60+, Safari 12+)

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础图表类型
- 响应式设计
- 主题支持
- 事件系统
