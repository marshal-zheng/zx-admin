import { computed } from 'vue'

/**
 * 处理用户传入的简单数据格式，转换为完整的算子数据
 * @param {Array} userOperators - 用户数据 [{name: string, value: string}]
 * @param {String} layout - 布局方向 'vertical' | 'horizontal'
 */
export function useUserOperators(userOperators, layout) {
  // 生成唯一ID
  const generateId = (() => {
    let counter = 0
    return (prefix = 'op') => `${prefix}-${Date.now()}-${++counter}`
  })()

  // 连接桩现在在拖拽时动态生成，这里不需要预先生成

  // 简单分类 - 统一归为一个分组
  const categorizeOperator = () => {
    return 'default'
  }

  // 获取分类标题
  const getCategoryTitle = () => {
    return '组件列表'
  }

  // 转换用户数据为完整算子数据
  const processedOperators = computed(() => {
    // 修复响应式数据访问问题
    let operators = []
    if (userOperators && typeof userOperators.value !== 'undefined') {
      // 如果是 ref 或 computed
      operators = userOperators.value
    } else if (Array.isArray(userOperators)) {
      // 如果是普通数组
      operators = userOperators
    }

    const currentLayout = layout?.value || layout || 'vertical'

    if (!Array.isArray(operators) || operators.length === 0) {
      return []
    }

    return operators
      .map((item, index) => {
        if (!item || typeof item !== 'object') {
          return null
        }

        const { name, value } = item
        if (!name) {
          return null // 跳过没有name的项
        }

        const category = categorizeOperator()

        return {
          key: generateId('operator'),
          title: name,
          shortDesc: value || `${name}组件`,
          category,
          // 保留原始用户数据
          originalData: { name, value }
        }
      })
      .filter(Boolean) // 过滤掉null值
  })

  // 按分类分组 - 简化为单一分组
  const categoryGroups = computed(() => {
    if (processedOperators.value.length === 0) {
      return {}
    }

    return {
      default: {
        title: getCategoryTitle(),
        items: processedOperators.value
      }
    }
  })

  // 统计信息
  const stats = computed(() => ({
    total: processedOperators.value.length,
    categories: Object.keys(categoryGroups.value).length,
    layout: layout?.value || layout || 'vertical'
  }))

  return {
    processedOperators,
    categoryGroups,
    stats,
    generateId,
    categorizeOperator,
    getCategoryTitle
  }
}

/**
 * 默认示例数据生成器 - 通用组件示例
 */
export function generateSampleOperators() {
  const samples = [
    { name: '组件A', value: '这是组件A的描述' },
    { name: '组件B', value: '这是组件B的描述' },
    { name: '组件C', value: '这是组件C的描述' },
    { name: '组件D', value: '这是组件D的描述' },
    { name: '组件E', value: '这是组件E的描述' }
  ]

  return samples
}
