import ZXR from '../../http'

// 指标体系模版管理API
export const indicatorTemplateApi = {
  // 获取模版列表
  getTemplateList: (params: any) => {
    return ZXR.get({
      url: '/zhpgxt/zhpgEvaluaSystemTemplate',
      params
    })
  },

  // 创建模版
  createTemplate: (data: any) => {
    return ZXR.post({
      url: '/zhpgxt/zhpgEvaluaSystemTemplate',
      data
    })
  },

  // 更新模版
  updateTemplate: (data: any) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgEvaluaSystemTemplate/${data.id}`,
      data
    })
  },

  // 删除模版
  deleteTemplate: (id: string | number) => {
    return ZXR.delete({
      url: `/zhpgxt/zhpgEvaluaSystemTemplate/${id}`
    })
  },

  // 获取模版详情
  getTemplateDetail: (id: string | number) => {
    return ZXR.get({
      url: `/zhpgxt/zhpgEvaluaSystemTemplate/${id}`
    })
  }
}
