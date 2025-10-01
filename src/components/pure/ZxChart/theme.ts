/**
 * ECharts 主题配置工具
 * 基于 CSS3 变量动态生成 ECharts 主题配置
 * 支持跟随系统主题切换
 */

/**
 * 获取 CSS 变量值
 * @param {string} variable - CSS 变量名
 * @param {Element} element - 目标元素，默认为 document.documentElement
 * @returns {string} CSS 变量值
 */
function getCSSVariable(variable, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(variable).trim()
}

/**
 * 获取当前主题信息
 * 通过检测CSS变量值动态判断主题，支持任意主题扩展
 * @param {Element} element - 目标元素，默认为 document.documentElement
 * @returns {Object} 主题信息对象 { name: string, type: string, isDark: boolean }
 */
function getCurrentTheme(element = document.documentElement) {
  // 1. 优先从 data-theme 属性获取主题名称
  const explicitTheme = element.getAttribute('data-theme')
  if (explicitTheme) {
    return {
      name: explicitTheme,
      type: explicitTheme,
      isDark: detectIsDarkTheme(element)
    }
  }

  // 2. 从 CSS 类名中检测主题
  const classList = Array.from(element.classList)
  const themeClass = classList.find(
    (cls) =>
      cls.includes('theme-') ||
      cls.includes('dark') ||
      cls.includes('light') ||
      cls.match(/^(dark|light|blue|green|red|purple|orange)(-\w+)?$/)
  )

  if (themeClass) {
    return {
      name: themeClass,
      type: themeClass,
      isDark: detectIsDarkTheme(element)
    }
  }

  // 3. 通过CSS变量值智能检测主题类型
  const detectedTheme = detectThemeFromVariables(element)
  return detectedTheme
}

/**
 * 通过CSS变量值检测是否为深色主题
 * @param {Element} element - 目标元素
 * @returns {boolean} 是否为深色主题
 */
function detectIsDarkTheme(element = document.documentElement) {
  // 检测背景色亮度
  const backgroundColor = getCSSVariable('--el-bg-color', element) || '#ffffff'
  const bgBrightness = getColorBrightness(backgroundColor)

  // 检测文字色亮度
  const textColor = getCSSVariable('--el-text-color-primary', element) || '#000000'
  const textBrightness = getColorBrightness(textColor)

  // 深色主题特征：背景色较暗，文字色较亮
  return bgBrightness < 128 || textBrightness > 128
}

/**
 * 通过CSS变量值智能检测主题信息
 * @param {Element} element - 目标元素
 * @returns {Object} 主题信息
 */
function detectThemeFromVariables(element = document.documentElement) {
  const isDark = detectIsDarkTheme(element)
  const themeType = isDark ? 'dark' : 'light'

  // 生成基于CSS变量值的唯一主题标识
  const primaryColor = getCSSVariable('--el-color-primary', element) || '#409eff'
  const backgroundColor = getCSSVariable('--el-bg-color', element) || '#ffffff'

  // 使用颜色值的哈希作为主题名称的一部分，确保唯一性
  const themeHash = generateColorHash(primaryColor, backgroundColor)
  const themeName = `${themeType}-${themeHash}`

  return {
    name: themeName,
    type: themeType,
    isDark,
    // 提供原始颜色信息供调试使用
    colors: {
      primary: primaryColor,
      background: backgroundColor
    }
  }
}

/**
 * 生成基于颜色的简短哈希标识
 * @param {string} primaryColor - 主色
 * @param {string} backgroundColor - 背景色
 * @returns {string} 6位哈希字符串
 */
function generateColorHash(primaryColor, backgroundColor) {
  // 简单的颜色哈希算法，生成6位字符标识
  const colorString = `${primaryColor}${backgroundColor}`.replace(/[#\s]/g, '')
  let hash = 0

  for (let i = 0; i < colorString.length; i++) {
    const char = colorString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 转换为32位整数
  }

  // 转换为6位字母数字字符串
  return Math.abs(hash).toString(36).substring(0, 6).padEnd(6, '0')
}

/**
 * 计算颜色亮度 (0-255)
 * @param {string} color - 颜色值 (hex, rgb, rgba等)
 * @returns {number} 亮度值
 */
function getColorBrightness(color) {
  // 创建临时元素来获取计算后的RGB值
  const tempElement = document.createElement('div')
  tempElement.style.color = color
  document.body.appendChild(tempElement)

  const computedColor = getComputedStyle(tempElement).color
  document.body.removeChild(tempElement)

  // 解析RGB值
  const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!rgbMatch) return 128 // 默认中等亮度

  const [, r, g, b] = rgbMatch.map(Number)

  // 使用标准亮度计算公式
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b)
}

/**
 * 生成基于 CSS3 变量的 ECharts 主题配置
 * @param {Element} container - 图表容器元素
 * @returns {Object} ECharts 主题配置对象
 */
export function generateEChartsTheme(container = document.documentElement) {
  const themeInfo = getCurrentTheme(container)

  // 基础颜色配置
  const colors = {
    // 主色调
    primary: getCSSVariable('--el-color-primary', container),
    success: getCSSVariable('--el-color-success', container),
    warning: getCSSVariable('--el-color-warning', container),
    danger: getCSSVariable('--el-color-danger', container),
    info: getCSSVariable('--el-color-info', container),

    // 文字颜色
    textPrimary: getCSSVariable('--el-text-color-primary', container),
    textRegular: getCSSVariable('--el-text-color-regular', container),
    textSecondary: getCSSVariable('--el-text-color-secondary', container),
    textPlaceholder: getCSSVariable('--el-text-color-placeholder', container),

    // 背景颜色
    background: getCSSVariable('--el-bg-color', container),
    backgroundOverlay: getCSSVariable('--el-bg-color-overlay', container),

    // 边框颜色
    border: getCSSVariable('--el-border-color', container),
    borderLight: getCSSVariable('--el-border-color-light', container),
    borderLighter: getCSSVariable('--el-border-color-lighter', container),

    // 填充颜色
    fill: getCSSVariable('--el-fill-color', container),
    fillLight: getCSSVariable('--el-fill-color-light', container)
  }

  // 图表专用颜色配置
  const chartColors = {
    // 从 ZxChart 变量中获取图表专用颜色
    chartBackground: getCSSVariable('--cmp-chart-background', container) || colors.background,
    chartTextPrimary:
      getCSSVariable('--cmp-chart-text-color-primary', container) || colors.textPrimary,
    chartTextRegular:
      getCSSVariable('--cmp-chart-text-color-regular', container) || colors.textRegular,
    chartGridLine: getCSSVariable('--cmp-chart-grid-line-color', container) || colors.borderLighter,
    chartAxisLine: getCSSVariable('--cmp-chart-axis-line-color', container) || colors.borderLight,
    chartAxisLabel: getCSSVariable('--cmp-chart-axis-label-color', container) || colors.textRegular,
    chartTooltipBg:
      getCSSVariable('--cmp-chart-tooltip-background', container) || colors.backgroundOverlay,
    chartTooltipBorder:
      getCSSVariable('--cmp-chart-tooltip-border-color', container) || colors.border,
    chartTooltipText:
      getCSSVariable('--cmp-chart-tooltip-text-color', container) || colors.textPrimary,
    chartLegendText:
      getCSSVariable('--cmp-chart-legend-text-color', container) || colors.textRegular,
    chartLegendInactive:
      getCSSVariable('--cmp-chart-legend-inactive-color', container) || colors.textPlaceholder
  }

  // 生成调色板
  const colorPalette = [
    colors.primary,
    colors.success,
    colors.warning,
    colors.danger,
    colors.info,
    getCSSVariable('--el-color-primary-light-3', container),
    getCSSVariable('--el-color-success-light-3', container),
    getCSSVariable('--el-color-warning-light-3', container),
    getCSSVariable('--el-color-danger-light-3', container),
    getCSSVariable('--el-color-info-light-3', container)
  ].filter((color) => color && color !== '')

  return {
    // 调色板
    color: colorPalette,

    // 背景色
    backgroundColor: chartColors.chartBackground,

    // 文字样式
    textStyle: {
      color: chartColors.chartTextPrimary,
      fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif'
    },

    // 标题
    title: {
      textStyle: {
        color: chartColors.chartTextPrimary,
        fontSize: 16,
        fontWeight: 'bold'
      },
      subtextStyle: {
        color: chartColors.chartTextRegular,
        fontSize: 12
      }
    },

    // 图例
    legend: {
      textStyle: {
        color: chartColors.chartLegendText,
        fontSize: 12
      },
      inactiveColor: chartColors.chartLegendInactive
    },

    // 坐标轴
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: chartColors.chartAxisLine
        }
      },
      axisTick: {
        lineStyle: {
          color: chartColors.chartAxisLine
        }
      },
      axisLabel: {
        color: chartColors.chartAxisLabel,
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: chartColors.chartGridLine,
          type: 'dashed'
        }
      }
    },

    valueAxis: {
      axisLine: {
        lineStyle: {
          color: chartColors.chartAxisLine
        }
      },
      axisTick: {
        lineStyle: {
          color: chartColors.chartAxisLine
        }
      },
      axisLabel: {
        color: chartColors.chartAxisLabel,
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: chartColors.chartGridLine,
          type: 'dashed'
        }
      }
    },

    // 工具提示
    tooltip: {
      backgroundColor: chartColors.chartTooltipBg,
      borderColor: chartColors.chartTooltipBorder,
      borderWidth: 1,
      textStyle: {
        color: chartColors.chartTooltipText,
        fontSize: 12
      },
      extraCssText: `
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        backdrop-filter: blur(10px);
      `
    },

    // 数据缩放
    dataZoom: {
      backgroundColor: getCSSVariable('--cmp-chart-datazoom-background', container) || colors.fill,
      borderColor: getCSSVariable('--cmp-chart-datazoom-border-color', container) || colors.border,
      handleColor: getCSSVariable('--cmp-chart-datazoom-handle-color', container) || colors.primary,
      textStyle: {
        color: chartColors.chartTextRegular
      }
    },

    // 时间轴
    timeline: {
      lineStyle: {
        color: chartColors.chartAxisLine
      },
      itemStyle: {
        color: colors.primary
      },
      controlStyle: {
        color: colors.primary
      },
      checkpointStyle: {
        color: colors.primary
      },
      label: {
        color: chartColors.chartTextRegular
      }
    },

    // 视觉映射
    visualMap: {
      textStyle: {
        color: chartColors.chartTextRegular
      }
    },

    // 工具箱
    toolbox: {
      iconStyle: {
        borderColor: chartColors.chartTextRegular
      },
      emphasis: {
        iconStyle: {
          borderColor: colors.primary
        }
      }
    },

    // 地理坐标系
    geo: {
      itemStyle: {
        areaColor: colors.fill,
        borderColor: colors.border
      },
      emphasis: {
        itemStyle: {
          areaColor: colors.fillLight
        }
      }
    }
  }
}

/**
 * 创建主题监听器
 * @param {Function} callback - 主题变化回调函数，接收主题信息对象
 * @returns {Function} 取消监听的函数
 */
export function createThemeWatcher(callback) {
  let lastThemeInfo = getCurrentTheme()

  // CSS变量变化监听器
  const variableObserver = new MutationObserver(() => {
    // 延迟检测，确保CSS变量已更新
    setTimeout(() => {
      const currentThemeInfo = getCurrentTheme()
      // 比较主题信息是否发生变化
      if (JSON.stringify(currentThemeInfo) !== JSON.stringify(lastThemeInfo)) {
        lastThemeInfo = currentThemeInfo
        callback(currentThemeInfo)
      }
    }, 10)
  })

  // 属性变化监听器
  const attributeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        (mutation.attributeName === 'class' ||
          mutation.attributeName === 'data-theme' ||
          mutation.attributeName === 'style')
      ) {
        const currentThemeInfo = getCurrentTheme()
        if (JSON.stringify(currentThemeInfo) !== JSON.stringify(lastThemeInfo)) {
          lastThemeInfo = currentThemeInfo
          callback(currentThemeInfo)
        }
      }
    })
  })

  // 监听 html 元素的属性变化
  attributeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'style']
  })

  // 监听 style 标签的变化（检测动态CSS变更）
  variableObserver.observe(document.head, {
    childList: true,
    subtree: true
  })

  // 返回取消监听的函数
  return () => {
    attributeObserver.disconnect()
    variableObserver.disconnect()
  }
}

/**
 * 获取响应式字体大小
 * @param {number} baseSize - 基础字体大小
 * @param {Element} container - 容器元素
 * @returns {number} 响应式字体大小
 */
export function getResponsiveFontSize(baseSize = 12, container = document.documentElement) {
  const containerWidth = container.clientWidth || window.innerWidth

  if (containerWidth < 768) {
    // 移动端
    return Math.max(10, baseSize - 2)
  } else if (containerWidth < 1200) {
    // 平板端
    return Math.max(11, baseSize - 1)
  }

  // 桌面端
  return baseSize
}

/**
 * 应用主题到 ECharts 配置
 * @param {Object} option - ECharts 配置对象
 * @param {Element} container - 图表容器元素
 * @returns {Object} 应用主题后的配置对象
 */
export function applyThemeToOption(option, container = document.documentElement) {
  const theme = generateEChartsTheme(container)

  // 深度合并主题配置
  const mergedOption = JSON.parse(JSON.stringify(option))

  // 应用全局文字样式
  if (!mergedOption.textStyle) {
    mergedOption.textStyle = theme.textStyle
  }

  // 应用背景色
  if (!mergedOption.backgroundColor) {
    mergedOption.backgroundColor = theme.backgroundColor
  }

  // 应用调色板
  if (!mergedOption.color) {
    mergedOption.color = theme.color
  }

  // 应用标题样式
  if (mergedOption.title && typeof mergedOption.title === 'object') {
    mergedOption.title = {
      ...theme.title,
      ...mergedOption.title,
      textStyle: {
        ...theme.title.textStyle,
        ...mergedOption.title.textStyle
      }
    }
  }

  // 应用图例样式
  if (mergedOption.legend && typeof mergedOption.legend === 'object') {
    mergedOption.legend = {
      ...theme.legend,
      ...mergedOption.legend,
      textStyle: {
        ...theme.legend.textStyle,
        ...mergedOption.legend.textStyle
      }
    }
  }

  // 应用工具提示样式
  if (mergedOption.tooltip && typeof mergedOption.tooltip === 'object') {
    mergedOption.tooltip = {
      ...theme.tooltip,
      ...mergedOption.tooltip,
      textStyle: {
        ...theme.tooltip.textStyle,
        ...mergedOption.tooltip.textStyle
      }
    }
  }

  // 应用坐标轴样式
  if (mergedOption.xAxis) {
    const xAxes = Array.isArray(mergedOption.xAxis) ? mergedOption.xAxis : [mergedOption.xAxis]
    xAxes.forEach((axis, index) => {
      if (axis && typeof axis === 'object') {
        mergedOption.xAxis = Array.isArray(mergedOption.xAxis)
          ? mergedOption.xAxis
          : mergedOption.xAxis
        const targetAxis = Array.isArray(mergedOption.xAxis)
          ? mergedOption.xAxis[index]
          : mergedOption.xAxis
        Object.assign(targetAxis, {
          axisLine: { ...theme.categoryAxis.axisLine, ...targetAxis.axisLine },
          axisTick: { ...theme.categoryAxis.axisTick, ...targetAxis.axisTick },
          axisLabel: { ...theme.categoryAxis.axisLabel, ...targetAxis.axisLabel },
          splitLine: { ...theme.categoryAxis.splitLine, ...targetAxis.splitLine }
        })
      }
    })
  }

  if (mergedOption.yAxis) {
    const yAxes = Array.isArray(mergedOption.yAxis) ? mergedOption.yAxis : [mergedOption.yAxis]
    yAxes.forEach((axis, index) => {
      if (axis && typeof axis === 'object') {
        mergedOption.yAxis = Array.isArray(mergedOption.yAxis)
          ? mergedOption.yAxis
          : mergedOption.yAxis
        const targetAxis = Array.isArray(mergedOption.yAxis)
          ? mergedOption.yAxis[index]
          : mergedOption.yAxis
        Object.assign(targetAxis, {
          axisLine: { ...theme.valueAxis.axisLine, ...targetAxis.axisLine },
          axisTick: { ...theme.valueAxis.axisTick, ...targetAxis.axisTick },
          axisLabel: { ...theme.valueAxis.axisLabel, ...targetAxis.axisLabel },
          splitLine: { ...theme.valueAxis.splitLine, ...targetAxis.splitLine }
        })
      }
    })
  }

  return mergedOption
}

export default {
  generateEChartsTheme,
  createThemeWatcher,
  getResponsiveFontSize,
  applyThemeToOption,
  getCurrentTheme,
  detectIsDarkTheme,
  detectThemeFromVariables,
  generateColorHash
}
