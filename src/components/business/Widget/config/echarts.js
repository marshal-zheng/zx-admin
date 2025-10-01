/**
 * 企业级图表样式系统 - 基于Grafana设计语言
 *
 * Grafana设计原则分析:
 * 1. 视觉层次: 清晰的信息架构，突出数据本身
 * 2. 专业美学: 简洁、现代、高对比度
 * 3. 功能性: 每个视觉元素都服务于数据理解
 * 4. 一致性: 统一的间距、字体、色彩系统
 * 5. 可读性: 优化的文字大小、行距、对比度
 */

// Grafana核心设计Token
const GRAFANA_DESIGN_TOKENS = {
  // 字体系统 - Grafana使用Inter字体，注重可读性
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    sizes: {
      xs: 10,
      sm: 11,
      base: 12,
      md: 13,
      lg: 14,
      xl: 16,
      xxl: 18
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  // 间距系统 - 8px基础网格
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },

  // 圆角系统
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8
  },

  // 阴影系统 - 使用CSS变量动态颜色
  shadows: {
    // 阴影将通过CSS变量动态设置，避免硬编码颜色
    sm: '0 1px 2px var(--el-box-shadow-light, rgba(0, 0, 0, 0.12))',
    md: '0 2px 4px var(--el-box-shadow, rgba(0, 0, 0, 0.12))',
    lg: '0 4px 8px var(--el-box-shadow-dark, rgba(0, 0, 0, 0.12))',
    xl: '0 8px 16px var(--el-box-shadow-dark, rgba(0, 0, 0, 0.12))'
  },

  // 透明度系统
  opacity: {
    disabled: 0.4,
    inactive: 0.6,
    hover: 0.8,
    active: 1.0
  }
}

/**
 * 应用企业级Grafana风格到ECharts配置
 * @param {Object|Array<Object>} optionOrOptions - ECharts配置
 * @param {{ type?: string, theme?: 'light'|'dark' }} ctx - 上下文信息
 * @returns {Object|Array<Object>} 企业级样式配置
 */
export function applyGrafanaStyleToOption(optionOrOptions, ctx = {}) {
  if (!optionOrOptions) return optionOrOptions
  const applyOne = (opt) => applyEnterpriseTheme(opt, ctx)
  return Array.isArray(optionOrOptions) ? optionOrOptions.map(applyOne) : applyOne(optionOrOptions)
} /**
 * 核心企业级主题应用函数
 */
function applyEnterpriseTheme(option, ctx = {}) {
  const o = option && typeof option === 'object' ? deepClone(option) : option
  if (!o || typeof o !== 'object') return o

  const chartType = ctx.type || inferTypeFromOption(o)
  // 获取容器元素，用于读取CSS变量
  const container = ctx.container || document.documentElement

  // 1. 全局配置 - Grafana级别的专业设置
  applyGlobalSettings(o, container)

  // 2. 网格系统 - 精确的间距控制
  if (needsCartesianGrid(o)) {
    applyEnterpriseGrid(o, chartType, container)
  }

  // 3. 图例系统 - 现代化图例设计
  if (o.legend !== false) {
    o.legend = Array.isArray(o.legend)
      ? o.legend.map((l) => createEnterpriseLegend(l, container))
      : createEnterpriseLegend(o.legend || {}, container)
  }

  // 4. 工具提示 - 专业级交互反馈
  applyEnterpriseTooltip(o, chartType, container)

  // 5. 坐标轴 - 清晰的数据展示
  if (o.xAxis) o.xAxis = applyEnterpriseAxis(o.xAxis, 'x', container)
  if (o.yAxis) o.yAxis = applyEnterpriseAxis(o.yAxis, 'y', container)

  // 6. 系列样式 - 针对不同图表类型的优化
  if (o.series) {
    const series = Array.isArray(o.series) ? o.series : [o.series]
    const styled = series.map((s, index) => applyEnterpriseSeries(s, chartType, index, container))
    o.series = Array.isArray(o.series) ? styled : styled[0]
  }

  // 7. 动画系统 - 流畅的视觉体验
  applyEnterpriseAnimation(o, chartType)

  // 移除数据缩放功能

  return o
}

/**
 * 全局设置 - 建立专业的视觉基础，让ZxChart处理颜色
 */
function applyGlobalSettings(option, container) {
  const { typography } = GRAFANA_DESIGN_TOKENS

  // 文字系统 - 只设置字体，颜色由ZxChart主题处理
  if (!option.textStyle) {
    option.textStyle = {
      fontFamily: typography.fontFamily,
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.normal
      // 移除color设置，让ZxChart主题处理
    }
  }

  // 标题系统 - 只设置字体和布局
  if (option.title && typeof option.title === 'object') {
    option.title = {
      left: 'left',
      top: 'top',
      padding: [GRAFANA_DESIGN_TOKENS.spacing.md, GRAFANA_DESIGN_TOKENS.spacing.lg],
      textStyle: {
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        // 移除color设置，让ZxChart主题处理
        ...option.title.textStyle
      },
      subtextStyle: {
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.normal,
        // 移除color设置，让ZxChart主题处理
        ...option.title.subtextStyle
      },
      ...option.title
    }
  }
}

/**
 * 企业级网格系统 - 精确的空间管理
 */
function applyEnterpriseGrid(option, chartType, isDark) {
  const { spacing } = GRAFANA_DESIGN_TOKENS

  // 根据图表类型调整间距
  const gridConfig = {
    top: spacing.xxxl, // 32px - 为标题和工具栏留足空间
    right: spacing.xl, // 20px - 右侧适中留白
    bottom: spacing.xxxl, // 32px - 为x轴标签和图例留空间
    left: spacing.xl, // 20px - 左侧基础留白
    containLabel: true // 确保标签不被截断
  }

  // 特殊图表类型的网格调整
  if (chartType === 'bar') {
    gridConfig.left = spacing.xxl // 柱状图需要更多左侧空间
  } else if (chartType === 'line' || chartType === 'area') {
    gridConfig.right = spacing.xxl // 折线图右侧需要更多空间显示最后的值
  }

  option.grid = {
    ...gridConfig,
    ...option.grid
  }
}

/**
 * 现代化图例设计 - 让ZxChart处理颜色
 */
function createEnterpriseLegend(legend, container) {
  const { typography, spacing } = GRAFANA_DESIGN_TOKENS

  return {
    type: 'scroll', // 支持大量数据项
    orient: 'horizontal',
    left: 'center',
    top: 'bottom',
    bottom: 0,
    padding: [spacing.sm, spacing.lg],
    itemGap: spacing.md, // 图例项间距
    itemWidth: 14, // 图例标识宽度
    itemHeight: 14, // 图例标识高度
    icon: 'roundRect', // 现代圆角矩形
    textStyle: {
      fontFamily: typography.fontFamily,
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.normal,
      // 移除color设置，让ZxChart主题处理
      padding: [0, 0, 0, spacing.xs] // 文字与图标间距
    },
    // 移除颜色设置，让ZxChart主题处理
    animation: true,
    animationDuration: 300,
    ...legend
  }
}

/**
 * 专业级工具提示 - 让ZxChart处理颜色
 */
function applyEnterpriseTooltip(option, chartType, container) {
  const { typography, spacing, borderRadius } = GRAFANA_DESIGN_TOKENS

  const trigger = getOptimalTooltipTrigger(chartType)

  option.tooltip = {
    trigger,
    // 移除颜色设置，让ZxChart主题处理
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: [spacing.sm, spacing.md],
    textStyle: {
      fontFamily: typography.fontFamily,
      fontSize: typography.sizes.sm,
      // 移除color设置，让ZxChart主题处理
      lineHeight: 1.5
    },
    extraCssText: `
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: var(--el-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.12));
    `,
    // 轴指示器设置
    axisPointer:
      trigger === 'axis'
        ? {
            type: 'line',
            lineStyle: {
              // 移除color设置，让ZxChart主题处理
              width: 1,
              type: 'solid'
            },
            label: {
              show: true,
              // 移除颜色设置，让ZxChart主题处理
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.xs,
              padding: [spacing.xs / 2, spacing.xs]
            }
          }
        : undefined,
    confine: true,
    transitionDuration: 0.2,
    hideDelay: 100,
    ...option.tooltip
  }
}

/**
 * 企业级坐标轴设计 - 让ZxChart处理颜色
 */
function applyEnterpriseAxis(axis, direction, container) {
  const { typography, spacing } = GRAFANA_DESIGN_TOKENS

  const applyToSingleAxis = (ax) => ({
    // 轴线设置
    axisLine: {
      show: true,
      lineStyle: {
        // 移除color设置，让ZxChart主题处理
        width: 1,
        type: 'solid'
      },
      ...ax?.axisLine
    },

    // 刻度设置
    axisTick: {
      show: false, // Grafana风格通常不显示刻度
      ...ax?.axisTick
    },

    // 标签设置
    axisLabel: {
      show: true,
      fontFamily: typography.fontFamily,
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.normal,
      // 移除color设置，让ZxChart主题处理
      margin: spacing.sm,
      rotate: direction === 'x' ? 0 : 0,
      interval: direction === 'x' ? 'auto' : 'auto',
      overflow: 'truncate',
      width: direction === 'x' ? 60 : undefined,
      ...ax?.axisLabel
    },

    // 轴名称设置
    nameTextStyle: {
      fontFamily: typography.fontFamily,
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      // 移除color设置，让ZxChart主题处理
      padding: direction === 'x' ? [spacing.sm, 0, 0, 0] : [0, 0, 0, spacing.sm],
      ...ax?.nameTextStyle
    },

    // 分割线设置
    splitLine: {
      show: true,
      lineStyle: {
        // 移除color设置，让ZxChart主题处理
        width: 1,
        type: 'solid' // Grafana使用实线而非虚线
      },
      ...ax?.splitLine
    },

    // 分割区域
    splitArea: {
      show: false, // 保持简洁
      ...ax?.splitArea
    },

    // 边界间隙
    boundaryGap: direction === 'x' ? true : false,

    ...ax
  })

  return Array.isArray(axis) ? axis.map(applyToSingleAxis) : applyToSingleAxis(axis || {})
}

/**
 * 企业级系列样式配置
 */
function applyEnterpriseSeries(series, chartType, index, container) {
  if (!series || typeof series !== 'object') return series

  const type = (series.type || chartType || '').toLowerCase()
  const { borderRadius, spacing, opacity } = GRAFANA_DESIGN_TOKENS

  // ZxChart会处理主题相关的颜色，这里不需要检测主题

  // 通用系列设置
  const commonConfig = {
    animation: true,
    animationDuration: 750,
    animationEasing: 'cubicOut',
    emphasis: {
      focus: 'series',
      scale: type === 'scatter' ? 1.2 : undefined,
      ...series.emphasis
    },
    select: {
      disabled: false,
      itemStyle: {
        borderWidth: 2,
        // 移除颜色设置，让ZxChart主题处理
        shadowBlur: 8
      }
    },
    blur: {
      itemStyle: {
        opacity: opacity.inactive
      },
      lineStyle: {
        opacity: opacity.inactive
      },
      areaStyle: {
        opacity: opacity.inactive * 0.5
      }
    }
  }

  // 按图表类型应用特定样式
  switch (type) {
    case 'line':
    case 'curve':
      return {
        ...series,
        ...commonConfig,
        // 不覆盖 smooth 属性，让数据处理器的配置生效
        showSymbol: false,
        hoverAnimation: true,
        symbol: 'circle',
        symbolSize: series.symbolSize || 6,
        lineStyle: {
          width: series.lineStyle?.width || 2.5,
          cap: 'round',
          join: 'round',
          ...series.lineStyle
        },
        emphasis: {
          ...commonConfig.emphasis,
          lineStyle: {
            width: 3.5,
            shadowBlur: 10,
            // 移除shadowColor，让ZxChart主题处理
            ...series.emphasis?.lineStyle
          }
        }
      }

    case 'bar':
      return {
        ...series,
        ...commonConfig,
        barMaxWidth: 36,
        barMinHeight: 1,
        barGap: '20%',
        barCategoryGap: '40%',
        itemStyle: {
          borderRadius: [borderRadius.md, borderRadius.md, 0, 0],
          shadowBlur: 0,
          ...series.itemStyle
        },
        emphasis: {
          ...commonConfig.emphasis,
          itemStyle: {
            shadowBlur: 12,
            // 移除shadowColor，让ZxChart主题处理
            borderRadius: [borderRadius.lg, borderRadius.lg, 0, 0],
            ...series.emphasis?.itemStyle
          }
        }
      }

    case 'scatter':
      return {
        ...series,
        ...commonConfig,
        symbolSize: 10,
        itemStyle: {
          opacity: 0.85,
          shadowBlur: 3,
          // 移除shadowColor，让ZxChart主题处理
          ...series.itemStyle
        },
        emphasis: {
          ...commonConfig.emphasis,
          itemStyle: {
            opacity: 1,
            shadowBlur: 12,
            // 移除shadowColor，让ZxChart主题处理
            ...series.emphasis?.itemStyle
          }
        }
      }

    case 'pie':
      // 保持原有的半径配置，不强制修改环形图的半径
      return {
        ...series,
        ...commonConfig,
        center: series.center || ['50%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 1,
        itemStyle: {
          borderWidth: 2,
          // 移除borderColor设置，让ZxChart主题处理
          shadowBlur: 4,
          // 移除shadowColor，让ZxChart主题处理
          ...series.itemStyle
        },
        label: {
          show: false,
          ...series.label
        },
        labelLine: {
          show: false,
          ...series.labelLine
        },
        emphasis: {
          ...commonConfig.emphasis,
          scale: false,
          itemStyle: {
            shadowBlur: 15,
            // 移除shadowColor，让ZxChart主题处理
            ...series.emphasis?.itemStyle
          }
        }
      }

    case 'radar':
      return {
        ...series,
        ...commonConfig,
        symbolSize: 5,
        lineStyle: {
          width: 2.5,
          cap: 'round',
          join: 'round',
          ...series.lineStyle
        },
        areaStyle: series.areaStyle
          ? {
              opacity: 0.12,
              ...series.areaStyle
            }
          : undefined
      }

    case 'area':
      return {
        ...series,
        ...commonConfig,
        smooth: 0.25,
        showSymbol: false,
        areaStyle: {
          opacity: 0.18,
          ...series.areaStyle
        },
        lineStyle: {
          width: 2.5,
          cap: 'round',
          join: 'round',
          ...series.lineStyle
        }
      }

    default:
      return { ...series, ...commonConfig }
  }
}

/**
 * 企业级动画系统
 */
function applyEnterpriseAnimation(option, chartType) {
  const animationConfig = {
    animation: true,
    animationThreshold: 2000,
    animationDuration: function (idx) {
      return idx * 100 + 300 // 错开动画时间
    },
    animationEasing: 'cubicOut',
    animationDelay: function (idx) {
      return idx * 50 // 错开延迟
    }
  }

  // 针对不同图表类型优化动画
  if (chartType === 'pie') {
    animationConfig.animationEasing = 'elasticOut'
    animationConfig.animationDuration = 1000
  } else if (chartType === 'bar') {
    animationConfig.animationEasing = 'bounceOut'
  }

  Object.assign(option, animationConfig)
}

// 移除数据缩放功能

// 工具函数
function getCSSVariable(variable, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(variable).trim()
}

function getOptimalTooltipTrigger(chartType) {
  const type = String(chartType || '').toLowerCase()
  if (['pie', 'donut', 'radar', 'scatter'].includes(type)) return 'item'
  return 'axis'
}

function needsCartesianGrid(option) {
  if (option?.xAxis || option?.yAxis) return true
  const series = Array.isArray(option?.series)
    ? option.series
    : option?.series
      ? [option.series]
      : []
  return series.some((s) =>
    ['line', 'bar', 'scatter', 'area'].includes(String(s?.type || '').toLowerCase())
  )
}

// 移除数据缩放相关函数

function inferTypeFromOption(option) {
  const series = Array.isArray(option?.series) ? option.series[0] : option?.series
  return series?.type || undefined
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map((item) => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  return obj
}

export default {
  applyGrafanaStyleToOption
}
