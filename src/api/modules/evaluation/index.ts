// 评估任务管理模块API
import ZXR from '../../http/index.js'

// 获取评估列表数据（评估任务/评估结果通用接口，通过 taskTemplate 参数区分）
// taskTemplate=0: 获取评估结果
// taskTemplate=1: 获取评估任务模板
export function getEvaluationList(params = {}) {
  console.log('params22', params)
  return ZXR.get({
    url: '/zhpgxt/zhpgEvaluaTask',
    params
  })
}

// 获取评估任务详情
export function getEvaluationDetail(idOrParams) {
  // 支持两种调用方式：
  // 1. getEvaluationDetail('task-id')
  // 2. getEvaluationDetail({ id: 'task-id', page: 1, size: 10, keyword: '' })
  const params = typeof idOrParams === 'string' ? { id: idOrParams } : idOrParams
  return ZXR.get({
    url: '/zhpgxt/zhpgEvaluaTask/getById',
    params
  })
}

// 获取状态选项数据
export function getStatusOptions() {
  return ZXR.get({
    url: '/evaluation/status/options'
  })
}

// 删除评估任务
export function deleteEvaluation(id) {
  return ZXR.delete({
    url: `/zhpgxt/zhpgEvaluaTask/${id}`
  })
}

// 设为模版
export function setAsTemplate(id) {
  return ZXR.post({
    url: `/zhpgxt/zhpgEvaluaTask/${id}`,
    data: {
      taskTemplate: 1
    }
  })
}

// 创建评估任务
export function createEvaluation(data) {
  return ZXR.post({
    url: '/zhpgxt/zhpgEvaluaTask',
    data
  })
}

// 更新评估任务
export function updateEvaluation(data) {
  return ZXR.put({
    url: `/zhpgxt/zhpgEvaluaTask/${data.id}`,
    data
  })
}

// 获取评估基础指标列表
export function getEvaluaBaseList(params = {}) {
  return ZXR.get({
    url: '/zhpgxt/zhpgEvaluaBase',
    params
  })
}

// 创建评估任务作业
export function createEvaluationTaskJob(data) {
  return ZXR.post({
    url: '/zhpgxt/zhpgEvaluaTaskJob',
    data
  })
}

// 获取任务作业SQL数据
export function getJobSqlData(jobId) {
  return ZXR.get({
    url: `/zhpgxt/zhpgDatabase/listBySql/${jobId}`
  })
}

// 执行转换任务
export function executeTrans(jobId, data) {
  return ZXR.post({
    url: `/zhpgxt/zhpgTrans/executeTrans/${jobId}`,
    data
  })
}

// 获取评估报告模板列表
export function getReportTemplateList(params = {}) {
  return ZXR.get({
    url: '/zhpgxt/zhpgTemplateResult',
    params
  })
}

// 获取评估方案结果（仪表盘配置）
export function getSchemeResult(id) {
  return ZXR.get({
    url: `/zhpgxt/zhpgSchemeResult/${id}`
  })
}

// 获取评估对象折线图数据
export function getLineData(schemeResultId) {
  return ZXR.get({
    url: '/zhpgxt/zhpgObject/lineData',
    params: {
      schemeResultId
    }
  })
}

// 导出评估报告
export function exportEvaluationReport(params) {
  const { templateId, taskId, fileType, resultId, jobId } = params
  return ZXR.get({
    url: `/zhpgxt/zhpgTemplateResult/${templateId}/${taskId}/${fileType}/${resultId}/${jobId}`,
    responseType: 'blob' // 告诉axios这是二进制数据
  })
}

export const evaluationApi = {
  getEvaluationList,
  getEvaluationDetail,
  getStatusOptions,
  deleteEvaluation,
  setAsTemplate,
  createEvaluation,
  updateEvaluation,
  getEvaluaBaseList,
  createEvaluationTaskJob,
  getJobSqlData,
  executeTrans,
  getReportTemplateList,
  getSchemeResult,
  getLineData,
  exportEvaluationReport
}
