// 评估相关模块API
import ZXR from '../../http/index.js'

// 获取评估方案选项
export function getEvaluationSchemeOptions() {
  return ZXR.get({
    url: '/evaluate/scheme/options'
  })
}

// 获取评估算法选项
export function getEvaluationAlgorithmOptions() {
  return ZXR.get({
    url: '/evaluate/algorithm/options'
  })
}

// 获取评估方案详情
export function getEvaluationSchemeById(id) {
  return ZXR.get({
    url: `/evaluate/scheme/${id}`
  })
}

// 获取评估算法详情
export function getEvaluationAlgorithmById(id) {
  return ZXR.get({
    url: `/evaluate/algorithm/${id}`
  })
}

// 获取评估方案列表
export function getEvaluationSchemeList(params = {}) {
  return ZXR.get({
    url: '/evaluate/scheme/list',
    params
  })
}

// 获取评估算法列表
export function getEvaluationAlgorithmList(params = {}) {
  return ZXR.get({
    url: '/evaluate/algorithm/list',
    params
  })
}

export const evaluateApi = {
  getEvaluationSchemeOptions,
  getEvaluationAlgorithmOptions,
  getEvaluationSchemeById,
  getEvaluationAlgorithmById,
  getEvaluationSchemeList,
  getEvaluationAlgorithmList
}
