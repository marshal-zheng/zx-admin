/**
 * 评估算法枚举
 */
export enum EvaluationAlgorithm {
  /** AHP法（层次分析法） */
  AHP = 1,
  /** 模糊综合评判法 */
  FUZZY_COMPREHENSIVE = 2,
  /** 优劣解距离法（TOPSIS） */
  TOPSIS = 3,
  /** 熵权法 */
  ENTROPY_WEIGHT = 9,
  /** 指数法 */
  EXPONENTIAL = 11,
  /** 环比系数法 */
  CHAIN_RATIO = 12,
  /** 专家打分法 */
  EXPERT_SCORING = 13,
  /** 离差最大化法 */
  DEVIATION_MAXIMIZATION = 14
}

/**
 * 评估算法选项配置
 */
export const EVALUATION_ALGORITHM_OPTIONS = [
  {
    label: '层次分析法（AHP）',
    value: EvaluationAlgorithm.AHP,
    description: '通过构建层次结构模型，进行定性和定量相结合的决策分析方法'
  },
  {
    label: '模糊综合评判法',
    value: EvaluationAlgorithm.FUZZY_COMPREHENSIVE,
    description: '运用模糊数学理论处理评价中的不确定性和模糊性问题'
  },
  {
    label: '优劣解距离法（TOPSIS）',
    value: EvaluationAlgorithm.TOPSIS,
    description: '基于理想解和负理想解的距离来进行方案排序的多属性决策方法'
  },
  {
    label: '熵权法',
    value: EvaluationAlgorithm.ENTROPY_WEIGHT,
    description: '根据各指标的变异程度，利用信息熵计算各指标权重的客观赋权方法'
  },
  {
    label: '指数法',
    value: EvaluationAlgorithm.EXPONENTIAL,
    description: '采用指数函数形式进行评价计算的方法'
  },
  {
    label: '环比系数法',
    value: EvaluationAlgorithm.CHAIN_RATIO,
    description: '通过计算相邻时期数据的比值来分析变化趋势的方法'
  },
  {
    label: '专家打分法',
    value: EvaluationAlgorithm.EXPERT_SCORING,
    description: '依靠专家的知识和经验对评价对象进行打分的主观评价方法'
  },
  {
    label: '离差最大化法',
    value: EvaluationAlgorithm.DEVIATION_MAXIMIZATION,
    description: '通过最大化各方案间的离差来确定指标权重的客观赋权方法'
  }
]

/**
 * 根据算法值获取算法标签
 */
export function getEvaluationAlgorithmLabel(value: number): string {
  const option = EVALUATION_ALGORITHM_OPTIONS.find(opt => opt.value === value)
  return option?.label || '未知算法'
}

/**
 * 根据算法值获取算法描述
 */
export function getEvaluationAlgorithmDescription(value: number): string {
  const option = EVALUATION_ALGORITHM_OPTIONS.find(opt => opt.value === value)
  return option?.description || ''
}