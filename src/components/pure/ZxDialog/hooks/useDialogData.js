import { ref, computed } from 'vue'
import useDialogState from './useDialogState.js'

/**
 * 数据展示对话框 Hook
 * 专门处理数据展示类对话框，支持描述列表、骨架屏、数据懒加载等
 *
 * @param {Object} options - 配置选项
 * @param {Array} [options.descriptions] - 描述列表数据
 * @param {boolean} [options.showSkeleton] - 是否显示骨架屏
 * @param {number} [options.skeletonRows] - 骨架屏行数
 * @param {Function} [options.dataSource] - 数据源函数
 * @param {Function} [options.onDataLoad] - 数据加载成功回调
 * @param {Function} [options.onDataError] - 数据加载失败回调
 * @param {boolean} [options.autoLoad] - 是否自动加载数据
 */
export default function useDialogData(options = {}) {
  // 继承基础状态
  const dialogState = useDialogState(options)

  // 数据相关状态
  const data = ref(null)
  const descriptions = ref(options.descriptions || [])
  const showSkeleton = ref(options.showSkeleton || false)
  const dataLoading = ref(false)
  const dataError = ref(null)

  // 数据对话框属性
  const dataProps = computed(() => ({
    ...dialogState.baseProps.value,
    descriptions: descriptions.value,
    showSkeleton: showSkeleton.value || dataLoading.value,
    skeletonRows: options.skeletonRows || 5
  }))

  // 数据事件
  const dataEvents = computed(() => ({
    ...dialogState.baseEvents.value,
    open: async () => {
      if (options.autoLoad !== false) {
        await loadData()
      }
    }
  }))

  // 加载数据
  const loadData = async () => {
    if (!options.dataSource) return

    dataLoading.value = true
    dataError.value = null

    try {
      const result = await Promise.resolve(options.dataSource())
      data.value = result

      if (options.onDataLoad) {
        options.onDataLoad(result)
      }

      // 如果没有预设描述列表，尝试从数据生成
      if (!options.descriptions && result && typeof result === 'object') {
        generateDescriptions(result)
      }
    } catch (error) {
      dataError.value = error
      console.error('Data load error:', error)

      if (options.onDataError) {
        options.onDataError(error)
      }
    } finally {
      dataLoading.value = false
    }
  }

  // 从数据对象生成描述列表
  const generateDescriptions = (dataObj) => {
    const generated = []

    Object.entries(dataObj).forEach(([key, value]) => {
      // 跳过函数和复杂对象
      if (
        typeof value === 'function' ||
        (typeof value === 'object' && value !== null && !Array.isArray(value))
      ) {
        return
      }

      generated.push({
        key,
        label: formatLabel(key),
        value: value
      })
    })

    descriptions.value = generated
  }

  // 格式化标签名
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // 驼峰转空格
      .replace(/^./, (str) => str.toUpperCase()) // 首字母大写
      .trim()
  }

  // 刷新数据
  const refreshData = async () => {
    await loadData()
  }

  // 设置描述列表
  const setDescriptions = (newDescriptions) => {
    descriptions.value = newDescriptions
  }

  // 添加描述项
  const addDescription = (item) => {
    descriptions.value.push(item)
  }

  // 更新描述项
  const updateDescription = (key, updates) => {
    const index = descriptions.value.findIndex((item) => item.key === key)
    if (index !== -1) {
      descriptions.value[index] = { ...descriptions.value[index], ...updates }
    }
  }

  // 清除数据
  const clearData = () => {
    data.value = null
    descriptions.value = []
    dataError.value = null
  }

  return {
    // 继承基础状态和方法
    ...dialogState,

    // 数据状态
    data,
    descriptions,
    showSkeleton,
    dataLoading,
    dataError,

    // 计算属性
    dataProps,
    dataEvents,

    // 方法
    loadData,
    refreshData,
    setDescriptions,
    addDescription,
    updateDescription,
    clearData,
    generateDescriptions
  }
}
