// 评估任务通用API
import ZXR from '../http'

// 获取评估模板列表
export function getEvaluationTemplates(params) {
  return ZXR.get({
    url: '/api/evaluation/templates',
    params
  })
}

// 获取评估指标配置
export function getEvaluationMetrics(templateId) {
  return ZXR.get({
    url: `/api/evaluation/metrics/${templateId}`
  })
}

// 获取评估环境列表
export function getEvaluationEnvironments(projectId) {
  return ZXR.get({
    url: '/api/evaluation/environments',
    params: { projectId }
  })
}

// 获取评估数据源
export function getEvaluationDataSources(params) {
  return ZXR.get({
    url: '/api/evaluation/data-sources',
    params
  })
}

// 获取评估算法列表
export function getEvaluationAlgorithms(params) {
  return ZXR.get({
    url: '/indicator/algorithm/list',
    params
  })
}

// 验证评估配置
export function validateEvaluationConfig(data) {
  return ZXR.post({
    url: '/api/evaluation/validate-config',
    data
  })
}

// 获取评估历史记录
export function getEvaluationHistory(taskId, params) {
  return ZXR.get({
    url: `/api/evaluation/history/${taskId}`,
    params
  })
}

// 获取评估日志
export function getEvaluationLogs(taskId, params) {
  return ZXR.get({
    url: `/api/evaluation/logs/${taskId}`,
    params
  })
}

// 下载评估日志
export function downloadEvaluationLogs(taskId) {
  return ZXR.get({
    url: `/api/evaluation/logs/download/${taskId}`,
    responseType: 'blob'
  })
}

export default {
  getEvaluationTemplates,
  getEvaluationMetrics,
  getEvaluationEnvironments,
  getEvaluationDataSources,
  getEvaluationAlgorithms,
  validateEvaluationConfig,
  getEvaluationHistory,
  getEvaluationLogs,
  downloadEvaluationLogs
}
