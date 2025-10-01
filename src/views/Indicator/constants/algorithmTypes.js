/**
 * 算法类型枚举定义
 * 用于指标体系设计中的不同算法类型
 */

// 算法类型枚举
export const ALGORITHM_TYPES = {
  /** 模糊综合法 */
  FUZZY_COMPREHENSIVE: 2,
  /** TOPSIS算法 */
  TOPSIS: 3
}

// 算法类型名称映射
export const ALGORITHM_TYPE_NAMES = {
  [ALGORITHM_TYPES.FUZZY_COMPREHENSIVE]: '模糊综合法',
  [ALGORITHM_TYPES.TOPSIS]: 'TOPSIS算法'
}

// 算法类型描述映射
export const ALGORITHM_TYPE_DESCRIPTIONS = {
  [ALGORITHM_TYPES.FUZZY_COMPREHENSIVE]: '基于模糊数学理论的综合评价方法',
  [ALGORITHM_TYPES.TOPSIS]: '基于理想解的逼近排序法'
}

/**
 * 获取算法类型名称
 * @param {number} type - 算法类型值
 * @returns {string} 算法类型名称
 */
export function getAlgorithmTypeName(type) {
  return ALGORITHM_TYPE_NAMES[type] || '未知算法类型'
}

/**
 * 获取算法类型描述
 * @param {number} type - 算法类型值
 * @returns {string} 算法类型描述
 */
export function getAlgorithmTypeDescription(type) {
  return ALGORITHM_TYPE_DESCRIPTIONS[type] || ''
}

/**
 * 验证算法类型是否有效
 * @param {number} type - 算法类型值
 * @returns {boolean} 是否为有效的算法类型
 */
export function isValidAlgorithmType(type) {
  return Object.values(ALGORITHM_TYPES).includes(type)
}

/**
 * 获取所有支持的算法类型
 * @returns {Array} 算法类型选项数组
 */
export function getAllAlgorithmTypes() {
  return Object.entries(ALGORITHM_TYPE_NAMES).map(([value, label]) => ({
    value: parseInt(value),
    label,
    description: ALGORITHM_TYPE_DESCRIPTIONS[value]
  }))
}
