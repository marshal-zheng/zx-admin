import ZXR from '../../http'

// 计算模型管理API
export const modelApi = {
  // 获取计算模型列表
  getModelList: (params: any) => {
    return ZXR.get({
      url: '/zhpgxt/zhpgOperatorModel',
      params
    })
  },

  // 创建计算模型
  createModel: (data: any) => {
    return ZXR.post({
      url: '/zhpgxt/zhpgOperatorModel',
      data
    })
  },

  // 更新计算模型
  updateModel: (data: any) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgOperatorModel/${data.id}`,
      data
    })
  },

  // 删除计算模型
  deleteModel: (id: string | number) => {
    return ZXR.delete({
      url: `/zhpgxt/zhpgOperatorModel/${id}`
    })
  },

  // 获取计算模型详情
  getModelDetail: (id: string | number) => {
    return ZXR.get({
      url: `/zhpgxt/zhpgOperatorModel/${id}`
    })
  }
}