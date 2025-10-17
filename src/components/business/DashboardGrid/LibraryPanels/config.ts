/**
 * LibraryPanels 组件数据配置
 * 存储组件库中的各种组件类型定义
 */

/**
 * 图表组件类型配置
 * @typedef {Object} ChartComponentType
 * @property {string} id - 组件唯一标识
 * @property {string} name - 组件显示名称
 * @property {string} description - 组件描述
 * @property {string} type - 图表类型（用于ECharts）
 * @property {string} icon - 图标名称
 * @property {string} [widget] - 组件分类
 * @property {Object} [defaultConfig] - 默认配置
 */

/**
 * ECharts 图表组件类型
 */
export const chartComponentTypes = [
  {
    id: 'line',
    name: '折线图',
    description: '显示数据随时间变化的趋势',
    type: 'line',
    icon: 'line',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'bar',
    name: '柱状图',
    description: '比较不同类别的数据大小',
    type: 'bar',
    icon: 'barchart',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'pie',
    name: '饼状图',
    description: '显示各部分占整体的比例',
    type: 'pie',
    icon: 'pie',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'donut',
    name: '环形图',
    description: '带中心空洞的饼状图，突出显示数据比例关系',
    type: 'donut',
    icon: 'donut-pie',
    size: 32,
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'radar',
    name: '雷达图',
    description: '多维度数据对比分析',
    type: 'radar',
    icon: 'radar-area',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'areaRadar',
    name: '雷达面积图',
    description: '带填充区域的多维度数据对比分析',
    type: 'areaRadar',
    icon: 'radar',
    size: 32,
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'curve',
    name: '曲线图',
    description: '平滑的数据趋势展示',
    type: 'curve',
    icon: 'smooth-line',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'scatter',
    name: '散点图',
    description: '显示两个变量之间的关系',
    type: 'scatter',
    icon: 'scatter',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'area',
    name: '面积图',
    description: '强调数据量的累积效果',
    type: 'area',
    icon: 'area',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'parallel',
    name: '平行坐标图',
    description: '多维数据的可视化分析，适合展示高维数据间的关系',
    type: 'parallel',
    icon: 'parallel',
    widget: 'echarts',
    defaultConfig: {
      w: 12,
      h: 8
    }
  },
  {
    id: 'table',
    name: '表格',
    description: '以表格形式展示数据，支持自定义列配置',
    type: 'table',
    icon: 'table-panel',
    widget: 'table',
    defaultConfig: {
      w: 12,
      h: 8
    }
  }
]

/**
 * 其他组件类型（预留扩展）
 */
export const otherComponentTypes = [
  // 可以在这里添加其他类型的组件
  // 例如：表格、卡片、文本等
]

/**
 * 所有组件类型的合集
 */
export const allComponentTypes = [...chartComponentTypes, ...otherComponentTypes]

/**
 * 根据分类获取组件类型
 * @param {string} widget - 分类名称
 * @returns {Array} 对应分类的组件类型数组
 */
export function getComponentsByWidget(widget) {
  return allComponentTypes.filter((component) => component.widget === widget)
}

/**
 * 根据ID获取组件类型
 * @param {string} id - 组件ID
 * @returns {Object|null} 对应的组件类型对象
 */
export function getComponentById(id) {
  return allComponentTypes.find((component) => component.id === id) || null
}

/**
 * 获取组件的默认配置
 * @param {string} id - 组件ID
 * @returns {Object} 默认配置对象
 */
export function getDefaultConfig(id) {
  const component = getComponentById(id)
  return component?.defaultConfig || { w: 8, h: 6 }
}

/**
 * 组件分类定义
 */
export const componentWidgets = [
  {
    id: 'vizLib',
    name: '图表组件',
    description: '各种数据可视化图表'
  }
  // 可以添加更多分类
]
