import ZXR from '../../http'

// 报告模板管理API
export const reportTemplateApi = {
  // 获取报告模板列表
  getTemplateList: (params: any) => {
    return ZXR.get({
      url: '/zhpgxt/zhpgTemplateResult',
      params
    })
  },

  // 创建报告模板
  createTemplate: (data: any) => {
    return ZXR.post({
      url: '/zhpgxt/zhpgTemplateResult',
      data
    })
  },

  // 更新报告模板
  updateTemplate: (data: any) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgTemplateResult/${data.id}`,
      data
    })
  },

  // 删除报告模板
  deleteTemplate: (id: string | number) => {
    return ZXR.delete({
      url: `/zhpgxt/zhpgTemplateResult/${id}`
    })
  },

  // 获取报告模板详情
  getTemplateDetail: (id: string | number) => {
    return ZXR.get({
      url: `/zhpgxt/zhpgTemplateResult/${id}`
    })
  }
}