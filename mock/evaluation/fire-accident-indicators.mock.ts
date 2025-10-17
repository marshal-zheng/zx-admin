import { SUCCESS_CODE } from '@/constants'

// 油料库火灾事故评估指标体系数据
export const fireAccidentIndicators = {
  // 泄漏与扩散指标 (权重: 0.16)
  leakageAndDiffusion: {
    weight: 0.16,
    indicators: [
      {
        id: 'leak_rate',
        name: '泄漏速率',
        description: '由油料事故泄漏机理模型计算',
        unit: 'L/min',
        weight: 0.04,
        calculationMethod: '泄漏机理模型计算',
        sampleValues: [45.6, 32.4, 38.9, 42.3, 28.7]
      },
      {
        id: 'total_leakage',
        name: '总泄漏量',
        description: '事故过程中总的泄漏量，总泄漏量=点1泄漏量+点2泄漏量+┈+点n泄漏量；单点泄漏量=泄漏速率×泄漏时间',
        unit: 'm³',
        weight: 0.04,
        calculationMethod: '累计计算',
        sampleValues: [125.8, 89.6, 102.7, 118.9, 76.4]
      },
      {
        id: 'leakage_coverage_area',
        name: '泄漏覆盖面积',
        description: '由油料事故泄漏机理模型计算',
        unit: 'm²',
        weight: 0.04,
        calculationMethod: '泄漏机理模型计算',
        sampleValues: [2850, 1850, 2150, 2650, 1650]
      },
      {
        id: 'burning_area',
        name: '燃烧面积',
        description: '由油料事故燃烧机理模型计算',
        unit: 'm²',
        weight: 0.04,
        calculationMethod: '燃烧机理模型计算',
        sampleValues: [1200, 0, 0, 1450, 850]
      }
    ]
  },

  // 危害影响指标 (权重: 0.34)
  hazardImpact: {
    weight: 0.34,
    indicators: [
      {
        id: 'deaths',
        name: '人员死亡数量',
        description: '平台统计实际死亡人员数据',
        unit: '人',
        weight: 0.11,
        calculationMethod: '实际统计',
        sampleValues: [0, 0, 0, 0, 1]
      },
      {
        id: 'severe_injuries',
        name: '人员重伤数量',
        description: '平台统计实际重伤人员数据',
        unit: '人',
        weight: 0.07,
        calculationMethod: '实际统计',
        sampleValues: [2, 0, 1, 2, 3]
      },
      {
        id: 'minor_injuries',
        name: '人员轻伤数量',
        description: '平台统计实际轻伤人员数据',
        unit: '人',
        weight: 0.06,
        calculationMethod: '实际统计',
        sampleValues: [5, 1, 3, 6, 8]
      },
      {
        id: 'poisoning_rate',
        name: '中毒发生率',
        description: 'CO/NO₂超标暴露人数，中毒发生率=（暴露人数/总人数）×100%',
        unit: '%',
        weight: 0.05,
        calculationMethod: '比例计算',
        sampleValues: [8.5, 3.2, 6.8, 9.7, 12.3]
      },
      {
        id: 'vehicle_damage',
        name: '车辆损毁数量',
        description: '平台统计实际车辆损毁数据',
        unit: '台',
        weight: 0.05,
        calculationMethod: '实际统计',
        sampleValues: [3, 0, 1, 4, 5]
      }
    ]
  },

  // 应急响应效能指标 (权重: 0.3)
  emergencyResponse: {
    weight: 0.3,
    indicators: [
      {
        id: 'alarm_delay',
        name: '报警延迟时间',
        description: '从起火到首次报警的时间，报警延迟=首次报警时间-起火时间',
        unit: 'min',
        weight: 0.06,
        calculationMethod: '时间差计算',
        sampleValues: [3.2, 2.1, 2.8, 3.8, 4.5]
      },
      {
        id: 'evacuation_time',
        name: '疏散时间',
        description: '从报警到全员撤离的时间，疏散时间通过仿真平台计时',
        unit: 'min',
        weight: 0.06,
        calculationMethod: '仿真计时',
        sampleValues: [12.5, 8.7, 10.3, 14.2, 15.8]
      },
      {
        id: 'internal_rescue_time',
        name: '内部救援到位时间',
        description: '微型消防站抵达时间，救援抵达时间=到达现场时间-接警时间',
        unit: 'min',
        weight: 0.05,
        calculationMethod: '时间差计算',
        sampleValues: [8.3, 5.2, 6.9, 8.9, 9.7]
      },
      {
        id: 'fire_rescue_time',
        name: '消防力量到位时间',
        description: '消防支队抵达时间，救援抵达时间=到达现场时间-接警时间',
        unit: 'min',
        weight: 0.05,
        calculationMethod: '时间差计算',
        sampleValues: [18.7, 15.3, 16.7, 20.5, 22.1]
      },
      {
        id: 'fire_trucks',
        name: '消防车出动数量',
        description: '平台统计实际出动消防车数量数据',
        unit: '台',
        weight: 0.04,
        calculationMethod: '实际统计',
        sampleValues: [6, 4, 5, 8, 7]
      },
      {
        id: 'firefighters',
        name: '消防员出动数量',
        description: '平台统计实际出动消防员数量数据',
        unit: '人',
        weight: 0.04,
        calculationMethod: '实际统计',
        sampleValues: [36, 24, 30, 48, 42]
      }
    ]
  },

  // 处置效果与损失指标 (权重: 0.2)
  disposalAndLoss: {
    weight: 0.2,
    indicators: [
      {
        id: 'fire_extinguish_time',
        name: '火灾扑灭时间',
        description: '从火灾开始到火灾扑灭的时间，平台统计火灾时间数据',
        unit: 'min',
        weight: 0.05,
        calculationMethod: '时间统计',
        sampleValues: [45.2, 0, 0, 48.7, 52.3]
      },
      {
        id: 'leakage_control_time',
        name: '泄漏控制时间',
        description: '从泄漏开始到停止泄漏的时间，平台统计泄漏时间数据',
        unit: 'min',
        weight: 0.05,
        calculationMethod: '时间统计',
        sampleValues: [32.1, 28.5, 25.4, 35.6, 38.9]
      },
      {
        id: 'evacuated_personnel',
        name: '疏散人员数量',
        description: '平台统计疏散人员数量',
        unit: '人',
        weight: 0.05,
        calculationMethod: '实际统计',
        sampleValues: [156, 89, 127, 189, 203]
      },
      {
        id: 'economic_loss',
        name: '直接经济损失',
        description: '烧毁设备、建筑、物资价值，人员伤亡救治、赔偿等',
        unit: '万元',
        weight: 0.05,
        calculationMethod: '损失评估',
        sampleValues: [285.6, 156.3, 198.5, 356.9, 425.8]
      }
    ]
  }
}

// 评估方案选项
export const evaluationSchemes = [
  { value: 'ahp', label: 'AHP层次分析法', description: '通过构建层次结构模型进行权重分析' },
  { value: 'fuzzy', label: '模糊综合评判法', description: '运用模糊数学理论进行综合评价' },
  { value: 'grey', label: '灰色关联分析法', description: '基于灰色系统理论的关联度分析' },
  { value: 'comprehensive', label: '综合评判法', description: '多种方法结合的综合评价' }
]

// 评估算法选项
export const evaluationAlgorithms = [
  { value: 'weighted_sum', label: '加权求和法', description: '基于权重的线性加权计算' },
  { value: 'topsis', label: 'TOPSIS法', description: '逼近理想解排序法' },
  { value: 'entropy_weight', label: '熵权法', description: '基于信息熵的权重确定方法' },
  { value: 'neural_network', label: '神经网络法', description: '基于人工神经网络的评估方法' }
]

export default [
  // 获取评估指标体系
  {
    url: '/api/fire-accident/indicators',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: fireAccidentIndicators
      }
    }
  },

  // 获取评估方案选项
  {
    url: '/api/fire-accident/schemes',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: evaluationSchemes
      }
    }
  },

  // 获取评估算法选项
  {
    url: '/api/fire-accident/algorithms',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: evaluationAlgorithms
      }
    }
  },

  // 获取指标权重配置
  {
    url: '/api/fire-accident/weights',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          leakageAndDiffusion: 0.16,
          hazardImpact: 0.34,
          emergencyResponse: 0.3,
          disposalAndLoss: 0.2
        }
      }
    }
  },

  // 计算综合评估分数
  {
    url: '/api/fire-accident/calculate-score',
    method: 'post',
    response: ({ body }) => {
      // 模拟评估分数计算
      const { indicators, weights } = body
      let totalScore = 0
      
      // 简化的评分计算逻辑
      Object.keys(indicators).forEach(category => {
        const categoryWeight = weights[category] || 0.25
        const categoryScore = Math.random() * 40 + 60 // 60-100分
        totalScore += categoryScore * categoryWeight
      })

      return {
        code: SUCCESS_CODE,
        data: {
          totalScore: Math.round(totalScore * 10) / 10,
          categoryScores: {
            leakageAndDiffusion: Math.round((Math.random() * 40 + 60) * 10) / 10,
            hazardImpact: Math.round((Math.random() * 40 + 60) * 10) / 10,
            emergencyResponse: Math.round((Math.random() * 40 + 60) * 10) / 10,
            disposalAndLoss: Math.round((Math.random() * 40 + 60) * 10) / 10
          },
          evaluationLevel: totalScore >= 90 ? '优秀' : totalScore >= 80 ? '良好' : totalScore >= 70 ? '中等' : totalScore >= 60 ? '及格' : '不及格'
        }
      }
    }
  }
]