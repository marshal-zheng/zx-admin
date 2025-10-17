/**
 * 评估数据处理工具
 * 用于将评估接口返回的数据转换为各种图表和表格组件所需的格式
 */

// TypeScript 接口定义
interface EvaluationData {
  zhpgObjectResultList: (string | number)[][]
  detailNames: string[]
  titleList: string[]
}

interface BaseEChartsOptions {
  xAxis?: any
  yAxis?: any
  series?: any[]
  legend?: any
  tooltip?: any
  radar?: any
  parallel?: any
  title?: any
  mode?: string
  donutMode?: string
  ringWidthPercent?: number
  ringGapPercent?: number
  startInnerPercent?: number
  center?: [string, string]
  scatterMode?: string
  [key: string]: any
}

interface TableColumn {
  prop: string
  label: string
  fixed?: string
  minWidth?: number
  align?: string
}

interface TableData {
  columns: TableColumn[]
  data: Record<string, any>[]
}

/**
 * 将字符串数组转换为数字数组
 * @param arr - 字符串数组
 * @returns 数字数组
 */
function parseNumberArray(arr: (string | number)[]): number[] {
  return arr.map((str) => parseFloat(String(str)) || 0)
}

const DEFAULT_DECIMAL_PLACES = 2

/**
 * 将任意输入安全转换为有限数字
 */
function toFiniteNumber(value: unknown, fallback = 0): number {
  const num = typeof value === 'number' ? value : parseFloat(String(value))
  return Number.isFinite(num) ? num : fallback
}

/**
 * 将数值格式化为最多保留指定位小数的字符串，移除末尾无意义的 0
 */
function formatWithMaxDecimals(value: unknown, decimals = DEFAULT_DECIMAL_PLACES): string {
  if (Array.isArray(value)) {
    return value.map((item) => formatWithMaxDecimals(item, decimals)).join(', ')
  }
  const num = toFiniteNumber(value)
  const rounded = Number(num.toFixed(decimals))
  return rounded.toString()
}

/**
 * 修正浮点精度问题，避免出现 110.000000000001 这样的值
 */
function normalizePrecision(value: number, precision = 12): number {
  if (!Number.isFinite(value)) return 0
  return Number(value.toPrecision(precision))
}

/**
 * 处理评估数据为柱状图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns ECharts柱状图配置
 */
export function transformToBarChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return baseOptions
  }

  const parsedData = zhpgObjectResultList.map((dataArray) => parseNumberArray(dataArray))

  // 动态计算 Y 轴的最大值和最小值
  const allValues = parsedData.flat()
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues, 0)
  const adjustedMax = normalizePrecision(maxValue * 1.1)

  // 转换数据为ECharts series格式
  const series = parsedData.map((dataArray, index) => ({
    name: titleList[index] || `系列${index + 1}`,
    type: 'bar',
    data: dataArray,
    ...baseOptions.series?.[index] // 合并基础配置中的series配置
  }))

  return {
    ...baseOptions,
    xAxis: {
      type: 'category',
      data: detailNames,
      axisLabel: {
        rotate: 45, // 旋转标签防止重叠
        interval: 0
      },
      ...baseOptions.xAxis
    },
    yAxis: {
      type: 'value',
      name: '评估值',
      min: normalizePrecision(minValue),
      max: adjustedMax,
      ...baseOptions.yAxis,
      axisLabel: {
        ...(baseOptions.yAxis?.axisLabel || {}),
        formatter: (value: number) => {
          // 保留最多两位小数，去掉末尾无意义的0
          return formatWithMaxDecimals(value)
        }
      }
    },
    series,
    legend: {
      data: titleList,
      ...baseOptions.legend
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((param) => {
          result += `${param.marker}${param.seriesName}: ${formatWithMaxDecimals(param.value)}<br/>`
        })
        return result
      },
      ...baseOptions.tooltip
    }
  }
}

/**
 * 处理评估数据为雷达图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns ECharts雷达图配置
 */
export function transformToRadarChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {},
  isArea: boolean = false
): BaseEChartsOptions {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return baseOptions
  }

  // 动态计算每个指标的最大值和最小值
  const parsedData = zhpgObjectResultList.map((dataArray) => parseNumberArray(dataArray))
  const indicator = detailNames.map((name, index) => {
    // 获取该指标在所有评估对象中的值
    const values = parsedData.map((data) => data[index])
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)

    // 为了让雷达图更美观，给最大值增加 20% 的余量
    const adjustedMax = normalizePrecision(maxValue * 1.2)
    const minBound = Math.min(0, minValue)

    return {
      name,
      max: adjustedMax > 0 ? adjustedMax : 1, // 避免 max 为 0
      min: normalizePrecision(minBound) // 最小值至少为 0
    }
  })

  console.log('Radar chart indicators:', indicator)
  console.log('isArea', isArea)

  // 转换数据为雷达图series格式
  const series = [
    {
      type: 'radar',
      data: parsedData.map((dataArray, index) => ({
        value: dataArray,
        name: titleList[index] || `系列${index + 1}`,
        areaStyle: isArea ? { opacity: 0.2 } : null
      })),
      ...baseOptions.series?.[0]
    }
  ]

  return {
    ...baseOptions,
    radar: {
      indicator,
      // 让雷达图更加清晰
      splitNumber: 5,
      name: {
        textStyle: {
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      ...baseOptions.radar
    },
    series,
    legend: {
      data: titleList,
      ...baseOptions.legend
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const { name, value } = params.data
        let result = `<strong>${name}</strong><br/>`
        value.forEach((val, index) => {
          result += `${detailNames[index]}: <strong>${formatWithMaxDecimals(val)}</strong><br/>`
        })
        return result
      },
      ...baseOptions.tooltip
    }
  }
}

/**
 * 处理评估数据为折线图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns ECharts折线图配置
 */
export function transformToLineChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return baseOptions
  }

  const parsedData = zhpgObjectResultList.map((dataArray) => parseNumberArray(dataArray))

  // 动态计算 Y 轴的最大值和最小值
  const allValues = parsedData.flat()
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues, 0)

  // 给最大值增加 10% 的余量，让图表更美观
  const adjustedMax = normalizePrecision(maxValue * 1.1)

  const series = parsedData.map((dataArray, index) => ({
    name: titleList[index] || `系列${index + 1}`,
    type: 'line',
    data: dataArray,
    smooth: false, // 折线图不使用平滑
    ...baseOptions.series?.[index]
  }))

  return {
    ...baseOptions,
    xAxis: {
      type: 'category',
      data: detailNames,
      axisLabel: {
        rotate: 45,
        interval: 0
      },
      ...baseOptions.xAxis
    },
    yAxis: {
      type: 'value',
      name: '评估值',
      min: normalizePrecision(minValue),
      max: adjustedMax,
      ...baseOptions.yAxis,
      axisLabel: {
        ...(baseOptions.yAxis?.axisLabel || {}),
        formatter: (value: number) => {
          // 保留最多两位小数，去掉末尾无意义的0
          return formatWithMaxDecimals(value)
        }
      }
    },
    series,
    legend: {
      data: titleList,
      ...baseOptions.legend
    },
    tooltip: {
      trigger: 'axis',
      ...baseOptions.tooltip
    }
  }
}

/**
 * 处理评估数据为曲线图格式（平滑折线图）
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns ECharts曲线图配置
 */
export function transformToCurveChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return baseOptions
  }

  const parsedData = zhpgObjectResultList.map((dataArray) => parseNumberArray(dataArray))

  // 动态计算 Y 轴的最大值和最小值
  const allValues = parsedData.flat()
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues, 0)
  const adjustedMax = normalizePrecision(maxValue * 1.1)

  const series = parsedData.map((dataArray, index) => ({
    name: titleList[index] || `系列${index + 1}`,
    type: 'line',
    data: dataArray,
    smooth: true, // 曲线图使用贝塞尔平滑曲线
    symbolSize: 6,
    lineStyle: {
      width: 3
    },
    ...baseOptions.series?.[index]
  }))

  return {
    ...baseOptions,
    xAxis: {
      type: 'category',
      data: detailNames,
      axisLabel: {
        rotate: 45,
        interval: 0
      },
      ...baseOptions.xAxis
    },
    yAxis: {
      type: 'value',
      name: '评估值',
      min: normalizePrecision(minValue),
      max: adjustedMax,
      ...baseOptions.yAxis,
      axisLabel: {
        ...(baseOptions.yAxis?.axisLabel || {}),
        formatter: (value: number) => {
          // 保留最多两位小数，去掉末尾无意义的0
          return formatWithMaxDecimals(value)
        }
      }
    },
    series,
    legend: {
      data: titleList,
      ...baseOptions.legend
    },
    tooltip: {
      trigger: 'axis',
      ...baseOptions.tooltip
    }
  }
}

/**
 * 处理评估数据为面积图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns ECharts面积图配置
 */
export function transformToAreaChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return baseOptions
  }

  const parsedData = zhpgObjectResultList.map((dataArray) => parseNumberArray(dataArray))

  // 动态计算 Y 轴的最大值和最小值
  const allValues = parsedData.flat()
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues, 0)
  const adjustedMax = normalizePrecision(maxValue * 1.1)

  const series = parsedData.map((dataArray, index) => ({
    name: titleList[index] || `系列${index + 1}`,
    type: 'line',
    data: dataArray,
    smooth: true,
    areaStyle: {
      opacity: 0.3
    },
    ...baseOptions.series?.[index]
  }))

  return {
    ...baseOptions,
    xAxis: {
      type: 'category',
      data: detailNames,
      axisLabel: {
        rotate: 45,
        interval: 0
      },
      ...baseOptions.xAxis
    },
    yAxis: {
      type: 'value',
      name: '评估值',
      min: normalizePrecision(minValue),
      max: adjustedMax,
      ...baseOptions.yAxis,
      axisLabel: {
        ...(baseOptions.yAxis?.axisLabel || {}),
        formatter: (value: number) => {
          // 保留最多两位小数，去掉末尾无意义的0
          return formatWithMaxDecimals(value)
        }
      }
    },
    series,
    legend: {
      data: titleList,
      ...baseOptions.legend
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      ...baseOptions.tooltip
    }
  }
}

/**
 * 处理评估数据为饼图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns 每个系列对应一个饼图配置的数组
 */
export function transformToPieChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions[] {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return [baseOptions]
  }

  // 为每个系列生成一个饼图配置
  return zhpgObjectResultList.map((dataArray, seriesIndex) => {
    if (!dataArray) return baseOptions

    const numericData = parseNumberArray(dataArray)
    const pieData = detailNames.map((name, index) => ({
      name,
      value: numericData[index] || 0
    }))

    const series = [
      {
        name: titleList[seriesIndex] || `系列${seriesIndex + 1}`,
        type: 'pie',
        // radius: ['40%', '70%'],
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        ...baseOptions.series?.[0]
      }
    ]

    return {
      ...baseOptions,
      title: {
        text: `${titleList[seriesIndex] || `系列${seriesIndex + 1}`}`,
        left: 'center',
        ...baseOptions.title
      },
      series,
      legend: {
        orient: 'vertical',
        left: 'left',
        data: detailNames,
        ...baseOptions.legend
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        ...baseOptions.tooltip
      }
    }
  })
}

/**
 * 处理评估数据为环形图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns 每个系列对应一个环形图配置的数组
 */
export function transformToDonutChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions | BaseEChartsOptions[] {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return [baseOptions]
  }

  const numericSeries = zhpgObjectResultList.map((arr) => parseNumberArray(arr || []))
  const mode = baseOptions.mode || baseOptions.donutMode || 'multiRings' // multiRings | single

  if (mode === 'multiRings') {
    // 在同一个图中绘制多个同心环，每个系列一环
    const rings: any[] = []
    const ringWidth = baseOptions.ringWidthPercent ?? 12
    const ringGap = baseOptions.ringGapPercent ?? 4
    const startInner = baseOptions.startInnerPercent ?? 20
    const center = baseOptions.center || ['50%', '50%']

    numericSeries.forEach((numericData, sIdx) => {
      const donutData = detailNames.map((name, i) => ({ name, value: numericData[i] || 0 }))
      const inner = startInner + sIdx * (ringWidth + ringGap)
      const outer = inner + ringWidth
      rings.push({
        name: titleList[sIdx] || `系列${sIdx + 1}`,
        type: 'pie',
        radius: [`${inner}%`, `${outer}%`],
        center,
        data: donutData,
        // 多环场景：减少标签拥挤，默认外侧显示，仅最外圈显示标签
        label: {
          show: sIdx === numericSeries.length - 1,
          position: 'outside',
          formatter: '{b}: {c} ({d}%)',
          fontSize: 12
        },
        labelLine: {
          show: sIdx === numericSeries.length - 1,
          length: 15,
          length2: 10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        ...(baseOptions.series?.[sIdx] || {})
      })
    })

    return {
      ...baseOptions,
      series: rings,
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        data: detailNames,
        textStyle: { fontSize: 12 },
        ...baseOptions.legend
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}: {c} ({d}%)',
        ...baseOptions.tooltip
      }
    }
  }

  // 默认退化为：每个系列一个图（用于选择器切换）
  return numericSeries.map((numericData, seriesIndex) => {
    const donutData = detailNames.map((name, index) => ({ name, value: numericData[index] || 0 }))
    const totalValue = numericData.reduce((sum, val) => sum + (val || 0), 0)
    return {
      ...baseOptions,
      title: {
        text: `${titleList[seriesIndex] || `系列${seriesIndex + 1}`}`,
        subtext: `总计: ${totalValue.toFixed(3)}`,
        left: 'center',
        top: 'center',
        ...baseOptions.title
      },
      series: [
        {
          name: titleList[seriesIndex] || `系列${seriesIndex + 1}`,
          type: 'pie',
          radius: ['50%', '80%'],
          center: ['50%', '50%'],
          data: donutData,
          ...(baseOptions.series?.[0] || {})
        }
      ],
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        data: detailNames,
        textStyle: { fontSize: 12 },
        ...baseOptions.legend
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}: {c} ({d}%)',
        ...baseOptions.tooltip
      }
    }
  })
}

/**
 * 处理评估数据为散点图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns ECharts散点图配置
 */
export function transformToScatterChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return baseOptions
  }

  // 自动判定第一列是否为表头
  const firstSeriesLen = Array.isArray(zhpgObjectResultList?.[0])
    ? zhpgObjectResultList[0].length
    : 0
  const hasHeaderInDetailNames = detailNames.length === firstSeriesLen + 1
  const rowIndicators = hasHeaderInDetailNames ? detailNames.slice(1) : detailNames

  // 模式：pair（相关散点）或 multi（按系列分类散点）
  // - 默认 multi，便于展示多个分类/颜色
  const mode = baseOptions.scatterMode || 'multi'

  if (mode === 'pair' && zhpgObjectResultList.length >= 2) {
    // 两个系列配对为一个散点序列：X=系列0，Y=系列1
    const toNumberOrNaN = (v) => {
      const n = typeof v === 'number' ? v : parseFloat(v)
      return Number.isFinite(n) ? n : NaN
    }
    const xRaw = zhpgObjectResultList[0] || []
    const yRaw = zhpgObjectResultList[1] || []
    const len = Math.min(xRaw.length, yRaw.length)
    const scatterData: number[][] = []
    for (let i = 0; i < len; i++) {
      const x = toNumberOrNaN(xRaw[i])
      const y = toNumberOrNaN(yRaw[i])
      if (Number.isFinite(x) && Number.isFinite(y)) scatterData.push([x, y])
    }

    const series = [
      {
        type: 'scatter',
        name: `${titleList[0]} vs ${titleList[1]}`,
        data: scatterData,
        symbolSize: 8,
        ...baseOptions.series?.[0]
      }
    ]

    const xs = scatterData.map((p) => p[0])
    const ys = scatterData.map((p) => p[1])
    const xMin = xs.length ? Math.min(...xs) : 0
    const xMax = xs.length ? Math.max(...xs) : 1
    const yMin = ys.length ? Math.min(...ys) : 0
    const yMax = ys.length ? Math.max(...ys) : 1
    const pad = (max, min) => (max - min) * 0.05 || 0.05
    const xPad = pad(xMax, xMin)
    const yPad = pad(yMax, yMin)

    return {
      ...baseOptions,
      xAxis: {
        type: 'value',
        name: titleList[0] || 'X轴',
        min: baseOptions.xAxis?.min ?? normalizePrecision(xMin - xPad),
        max: baseOptions.xAxis?.max ?? normalizePrecision(xMax + xPad),
        ...baseOptions.xAxis,
        axisLabel: {
          ...(baseOptions.xAxis?.axisLabel || {}),
          formatter: (value: number) => {
            // 保留最多两位小数，去掉末尾无意义的0
            return formatWithMaxDecimals(value)
          }
        }
      },
      yAxis: {
        type: 'value',
        name: titleList[1] || 'Y轴',
        min: baseOptions.yAxis?.min ?? normalizePrecision(yMin - yPad),
        max: baseOptions.yAxis?.max ?? normalizePrecision(yMax + yPad),
        ...baseOptions.yAxis,
        axisLabel: {
          ...(baseOptions.yAxis?.axisLabel || {}),
          formatter: (value: number) => {
            // 保留最多两位小数，去掉末尾无意义的0
            return formatWithMaxDecimals(value)
          }
        }
      },
      series,
      legend: {
        data: [series[0].name],
        ...baseOptions.legend
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          const [x, y] = Array.isArray(params.value) ? params.value : [params.value, null]
          return `${titleList[0] || 'X'}: ${formatWithMaxDecimals(x)}<br/>${titleList[1] || 'Y'}: ${formatWithMaxDecimals(y)}`
        },
        ...baseOptions.tooltip
      }
    }
  }

  // multi 模式：每个系列一组散点，X 为类别（detailNames）索引
  const buildSeries = (seriesIndex) => {
    const yRaw = zhpgObjectResultList[seriesIndex] || []
    const data: number[][] = []
    for (let i = 0; i < rowIndicators.length; i++) {
      const v = parseFloat(String(yRaw[i]))
      if (Number.isFinite(v)) data.push([i, v])
    }
    return {
      type: 'scatter',
      name: titleList[seriesIndex] || `系列${seriesIndex + 1}`,
      data,
      symbolSize: 8,
      ...((baseOptions.series && baseOptions.series[seriesIndex]) || {})
    }
  }

  const series = titleList.map((_, idx) => buildSeries(idx))

  // 动态计算 Y 轴的最大值和最小值
  const allYValues = series.flatMap((s) => s.data.map((point) => point[1]))
  const maxValue = allYValues.length ? Math.max(...allYValues) : 1
  const minValue = allYValues.length ? Math.min(...allYValues, 0) : 0
  const adjustedMax = normalizePrecision(maxValue * 1.1)

  return {
    ...baseOptions,
    xAxis: {
      type: 'category',
      data: rowIndicators,
      axisLabel: { interval: 0, rotate: 30 },
      ...baseOptions.xAxis
    },
    yAxis: {
      type: 'value',
      name: '值',
      min: normalizePrecision(minValue),
      max: adjustedMax,
      ...baseOptions.yAxis,
      axisLabel: {
        ...(baseOptions.yAxis?.axisLabel || {}),
        formatter: (value: number) => {
          // 保留最多两位小数，去掉末尾无意义的0
          return formatWithMaxDecimals(value)
        }
      }
    },
    series,
    legend: {
      data: titleList,
      ...baseOptions.legend
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const [xIdx, y] = Array.isArray(params.value) ? params.value : [params.value, null]
        const cat = rowIndicators[xIdx] ?? xIdx
        return `${params.seriesName}<br/>${cat}: ${formatWithMaxDecimals(y)}`
      },
      ...baseOptions.tooltip
    }
  }
}

/**
 * 处理评估数据为平行坐标图格式
 * @param evaluationData - 评估接口返回的数据
 * @param baseOptions - 基础ECharts配置
 * @returns ECharts平行坐标图配置
 */
export function transformToParallelChart(
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {}
): BaseEChartsOptions {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList) {
    return baseOptions
  }

  const parsedData = zhpgObjectResultList.map((dataArray) => parseNumberArray(dataArray))

  // 动态计算每个维度的最大值和最小值
  const parallelAxis = detailNames.map((name, index) => {
    // 获取该维度在所有数据中的值
    const values = parsedData.map((data) => data[index])
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const minBound = Math.min(0, minValue)

    // 给最大值增加 20% 的余量
    const adjustedMax = normalizePrecision(maxValue * 1.2)

    return {
      dim: index,
      name,
      min: normalizePrecision(minBound),
      max: adjustedMax > 0 ? adjustedMax : 1,
      nameLocation: 'end',
      nameGap: 20,
      nameTextStyle: {
        fontSize: 12
      },
      axisLabel: {
        formatter: (value: number) => formatWithMaxDecimals(value)
      }
    }
  })

  // 转换数据为平行坐标格式
  // 每个系列对应一条平行坐标线
  const parallelData = zhpgObjectResultList.map((dataArray, seriesIndex) => {
    const numericData = parseNumberArray(dataArray)
    return {
      name: titleList[seriesIndex] || `系列${seriesIndex + 1}`,
      value: numericData,
      lineStyle: {
        width: 2,
        opacity: 0.8
      }
    }
  })

  const series = [
    {
      type: 'parallel',
      data: parallelData,
      smooth: true,
      lineStyle: {
        width: 2,
        opacity: 0.8
      },
      emphasis: {
        lineStyle: {
          width: 4,
          opacity: 1
        }
      },
      ...baseOptions.series?.[0]
    }
  ]

  return {
    ...baseOptions,
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
          fontSize: 12
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
          formatter: (value: number) => formatWithMaxDecimals(value)
        }
      },
      ...baseOptions.parallel
    },
    parallelAxis,
    series,
    legend: {
      data: titleList,
      top: '5%',
      ...baseOptions.legend
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const { name, value } = params.data
        let result = `${name}<br/>`
        value.forEach((val, index) => {
          result += `${detailNames[index]}: ${formatWithMaxDecimals(val)}<br/>`
        })
        return result
      },
      ...baseOptions.tooltip
    }
  }
}

/**
 * 处理评估数据为表格格式
 * @param evaluationData - 评估接口返回的数据
 * @returns 包含columns和data的表格配置
 */
export function transformToTableData(evaluationData: EvaluationData): TableData {
  const { zhpgObjectResultList, detailNames, titleList } = evaluationData

  if (!zhpgObjectResultList || !detailNames || !titleList || detailNames.length === 0) {
    return { columns: [], data: [] }
  }

  // 兼容两种数据形态：
  // A) detailNames 包含第一列表头，后续为行名（length = rows + 1）
  // B) detailNames 直接就是行名列表（length = rows）
  const seriesLen = Array.isArray(zhpgObjectResultList?.[0]) ? zhpgObjectResultList[0].length : 0

  const hasHeaderInDetailNames = detailNames.length === seriesLen + 1
  const firstColumnTitle = hasHeaderInDetailNames ? detailNames[0] || '指标' : '指标'
  const rowIndicators = hasHeaderInDetailNames ? detailNames.slice(1) : detailNames

  // 构建动态列配置 - 适配 el-table 格式
  const columns = [
    {
      prop: 'indicator',
      label: firstColumnTitle,
      fixed: 'left'
    },
    ...titleList.map((title, index) => ({
      prop: `series_${index}`,
      label: title,
      minWidth: 100,
      align: 'center'
    }))
  ]

  // 构建表格数据
  const data = rowIndicators.map((indicator, rowIndex) => {
    const row = {
      id: `row_${rowIndex}`,
      indicator
    }

    // 添加各系列的数据：第二列及以后的数据来自 zhpgObjectResultList
    titleList.forEach((_, seriesIndex) => {
      const value = zhpgObjectResultList[seriesIndex]?.[rowIndex]
      // el-table 直接渲染原始值，保持为 number/string 都可
      const num = parseFloat(String(value))
      row[`series_${seriesIndex}`] = Number.isNaN(num) ? (value ?? '') : num
    })

    return row
  })

  // 调试日志
  console.log('TableWidget - 原始数据:', evaluationData)
  console.log('TableWidget - 第一列标题:', firstColumnTitle)
  console.log('TableWidget - 第一列数据(行名):', rowIndicators)
  console.log('TableWidget - 列配置:', columns)
  console.log('TableWidget - 行数据:', data)
  console.log('TableWidget - 数据示例:', data[0])

  return { columns, data }
}

/**
 * 根据图表类型转换数据
 * @param chartType - 图表类型
 * @param evaluationData - 评估数据
 * @param baseOptions - 基础配置
 * @param extraParams - 额外参数
 * @returns 转换后的配置
 */
export function transformByChartType(
  chartType: string,
  evaluationData: EvaluationData,
  baseOptions: BaseEChartsOptions = {},
  extraParams: Record<string, any> = {}
): BaseEChartsOptions | BaseEChartsOptions[] | TableData {
  console.log('chartType', chartType)
  switch (chartType) {
    case 'bar':
    case 'barchart':
      return transformToBarChart(evaluationData, baseOptions)

    case 'line':
    case 'linechart':
      return transformToLineChart(evaluationData, baseOptions)

    case 'curve':
    case 'curvechart':
      return transformToCurveChart(evaluationData, baseOptions)

    case 'area':
    case 'areachart':
      return transformToAreaChart(evaluationData, baseOptions)

    case 'radar':
    case 'radarchart':
      return transformToRadarChart(evaluationData, baseOptions)
    case 'areaRadar':
    case 'arearadarchart':
      return transformToRadarChart(evaluationData, baseOptions, true)

    case 'pie':
    case 'piechart':
      return transformToPieChart(evaluationData, baseOptions)

    case 'donut':
    case 'doughnut':
    case 'donutchart':
    case 'doughnutchart':
    case 'donutpie':
      return transformToDonutChart(evaluationData, baseOptions)

    case 'scatter':
    case 'scatterchart':
      return transformToScatterChart(evaluationData, baseOptions)

    case 'parallel':
    case 'parallelchart':
      return transformToParallelChart(evaluationData, baseOptions)

    case 'table':
      return transformToTableData(evaluationData)

    default:
      console.warn(`Unsupported chart type: ${chartType}`)
      return baseOptions
  }
}

/**
 * 批量转换评估数据为多种图表格式
 * @param evaluationData - 评估数据
 * @param chartConfigs - 图表配置数组
 * @returns 各图表类型的转换结果
 */
export function batchTransformEvaluationData(
  evaluationData: EvaluationData,
  chartConfigs: Array<{
    type: string
    baseOptions?: BaseEChartsOptions
    extraParams?: Record<string, any>
    key?: string
  }>
): Record<string, BaseEChartsOptions | BaseEChartsOptions[] | TableData> {
  const results = {}

  chartConfigs.forEach((config) => {
    const { type, baseOptions = {}, extraParams = {}, key } = config
    const resultKey = key || type

    try {
      results[resultKey] = transformByChartType(type, evaluationData, baseOptions, extraParams)
    } catch (error) {
      console.error(`Failed to transform data for chart type ${type}:`, error)
      results[resultKey] = baseOptions
    }
  })

  return results
}
