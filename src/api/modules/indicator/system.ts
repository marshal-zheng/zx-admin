import ZXR from '../../http'

// 体系管理API
export const systemApi = {
  // 获取体系列表
  getSystemList: (params: any) => {
    return ZXR.get({
      url: '/zhpgxt/zhpgEvaluaSystem',
      params
    })
  },

  // 创建体系
  createSystem: (data: any) => {
    return ZXR.post({
      url: '/zhpgxt/zhpgEvaluaSystem',
      data
    })
  },

  // 更新体系
  updateSystem: (data: any) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgEvaluaSystem/${data.evaluaId}`,
      data
    })
  },

  // 删除体系
  deleteSystem: (id: string | number) => {
    return ZXR.delete({
      url: `/zhpgxt/zhpgEvaluaSystem/${id}`
    })
  },

  // 获取体系详情
  getSystemDetail: (id: string | number) => {
    return ZXR.get({
      url: `/zhpgxt/zhpgEvaluaSystem/${id}`
    })
  },

  // 设为模版
  setAsTemplate: (evaluaId: string | number) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgEvaluaSystem/${evaluaId}`,
      data: {
        evaluaTemplate: 1
      }
    })
  }
}
