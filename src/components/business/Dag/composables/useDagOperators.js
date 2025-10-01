import { computed, ref, watch } from 'vue'

/**
 * 算子数据管理 composable
 * 支持静态数据和异步数据加载
 */
export function useDagOperators(operatorsProps = []) {
  // 默认算子数据（作为 fallback）
  const defaultOperators = [
    // 数据源与输入
    {
      key: 'ds-1',
      title: 'CSV数据源',
      shortDesc: '读取CSV文件',
      category: 'dataSource',
      ports: [{ id: 'ds-1-1', group: 'bottom' }]
    },
    {
      key: 'ds-2',
      title: '数据库连接',
      shortDesc: '关系型数据库',
      category: 'dataSource',
      ports: [{ id: 'ds-2-1', group: 'bottom' }]
    },
    {
      key: 'ds-3',
      title: 'API数据源',
      shortDesc: '接口数据获取',
      category: 'dataSource',
      ports: [{ id: 'ds-3-1', group: 'bottom' }]
    },

    // 数据处理与转换
    {
      key: 'dp-1',
      title: '数据清洗',
      shortDesc: '数据质量处理',
      category: 'dataProcess',
      ports: [
        { id: 'dp-1-1', group: 'top' },
        { id: 'dp-1-2', group: 'bottom' }
      ]
    },
    {
      key: 'dp-2',
      title: '特征工程',
      shortDesc: '特征处理',
      category: 'dataProcess',
      ports: [
        { id: 'dp-2-1', group: 'top' },
        { id: 'dp-2-2', group: 'bottom' }
      ]
    },
    {
      key: 'dp-3',
      title: '数据排序',
      shortDesc: '排序处理',
      category: 'dataProcess',
      ports: [
        { id: 'dp-3-1', group: 'top' },
        { id: 'dp-3-2', group: 'bottom' }
      ]
    },

    // 机器学习算法
    {
      key: 'ml-1',
      title: '逻辑回归',
      shortDesc: '线性分类算法',
      category: 'machineLearning',
      ports: [
        { id: 'ml-1-1', group: 'top' },
        { id: 'ml-1-2', group: 'bottom' }
      ]
    },
    {
      key: 'ml-2',
      title: '随机森林',
      shortDesc: '集成学习算法',
      category: 'machineLearning',
      ports: [
        { id: 'ml-2-1', group: 'top' },
        { id: 'ml-2-2', group: 'bottom' }
      ]
    },
    {
      key: 'ml-3',
      title: '模型预测',
      shortDesc: '预测推理',
      category: 'machineLearning',
      ports: [
        { id: 'ml-3-1', group: 'top' },
        { id: 'ml-3-2', group: 'bottom' }
      ]
    },

    // 模型评估与验证
    {
      key: 'me-1',
      title: '分类评估',
      shortDesc: '分类指标计算',
      category: 'modelEval',
      ports: [
        { id: 'me-1-1', group: 'top' },
        { id: 'me-1-2', group: 'bottom' }
      ]
    },
    {
      key: 'me-2',
      title: '回归评估',
      shortDesc: '回归指标计算',
      category: 'modelEval',
      ports: [
        { id: 'me-2-1', group: 'top' },
        { id: 'me-2-2', group: 'bottom' }
      ]
    },

    // 数据输出与部署
    {
      key: 'do-1',
      title: '文件输出',
      shortDesc: '结果保存',
      category: 'dataOutput',
      ports: [{ id: 'do-1-1', group: 'top' }]
    },
    {
      key: 'do-2',
      title: '模型部署',
      shortDesc: '云端部署',
      category: 'dataOutput',
      ports: [{ id: 'do-2-1', group: 'top' }]
    },
    {
      key: 'do-3',
      title: '数据分享',
      shortDesc: '结果分享',
      category: 'dataOutput',
      ports: [{ id: 'do-3-1', group: 'top' }]
    }
  ]

  // 合并的算子数据
  const allOperators = computed(() => {
    if (Array.isArray(operatorsProps) && operatorsProps.length > 0) {
      return operatorsProps
    }
    return defaultOperators
  })

  // 分类组数据
  const categoryGroups = computed(() => {
    const categories = {}

    allOperators.value.forEach((item) => {
      const category = item.category || 'other'
      if (!categories[category]) {
        categories[category] = {
          title: getCategoryTitle(category),
          items: []
        }
      }
      categories[category].items.push(item)
    })

    return categories
  })

  // 获取分类标题
  function getCategoryTitle(category) {
    const categoryTitles = {
      dataSource: '数据源与输入',
      dataProcess: '数据处理与转换',
      machineLearning: '机器学习算法',
      modelEval: '模型评估与验证',
      dataOutput: '数据输出与部署',
      other: '其他'
    }
    return categoryTitles[category] || '其他'
  }

  // 验证算子数据格式
  function validateOperator(operator) {
    if (!operator || typeof operator !== 'object') {
      return false
    }

    const requiredFields = ['key', 'title']
    for (const field of requiredFields) {
      if (!operator[field]) {
        console.warn(`算子缺少必需字段: ${field}`, operator)
        return false
      }
    }

    return true
  }

  // 过滤有效的算子数据
  const validOperators = computed(() => {
    return allOperators.value.filter(validateOperator)
  })

  return {
    allOperators: validOperators,
    categoryGroups,
    validateOperator,
    getCategoryTitle
  }
}

/**
 * 异步加载算子数据的 composable
 * @param {Function|Promise} loader - 数据加载函数或 Promise
 * @param {Object} options - 配置选项
 */
export function useAsyncDagOperators(loader, options = {}) {
  const {
    immediate = true,
    onError = (error) => console.error('加载算子数据失败:', error),
    onSuccess = () => {}
  } = options

  const operators = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadOperators() {
    if (!loader) {
      return
    }

    loading.value = true
    error.value = null

    try {
      let data
      if (typeof loader === 'function') {
        data = await loader()
      } else if (loader && typeof loader.then === 'function') {
        data = await loader
      } else {
        throw new Error('loader 必须是函数或 Promise')
      }

      if (Array.isArray(data)) {
        operators.value = data
        onSuccess(data)
      } else {
        throw new Error('加载的数据必须是数组格式')
      }
    } catch (err) {
      error.value = err
      onError(err)
    } finally {
      loading.value = false
    }
  }

  // 重新加载数据
  const reload = () => loadOperators()

  if (immediate) {
    loadOperators()
  }

  const { allOperators, categoryGroups } = useDagOperators(operators.value)

  return {
    operators,
    loading,
    error,
    allOperators,
    categoryGroups,
    reload,
    loadOperators
  }
}
