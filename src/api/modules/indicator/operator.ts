import ZXR from '../../http'

// 算子管理API
export const operatorApi = {
  // 获取算子列表
  getOperatorList: (params: any) => {
    return ZXR.get({
      url: '/zhpgxt/zhpgOperator',
      params
    })
  },

  // 创建算子
  createOperator: (data: any) => {
    return ZXR.post({
      url: '/zhpgxt/zhpgOperator',
      data
    })
  },

  // 更新算子
  updateOperator: (data: any) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgOperator/${data.id}`,
      data
    })
  },

  // 删除算子
  deleteOperator: (id: string | number) => {
    return ZXR.delete({
      url: `/zhpgxt/zhpgOperator/${id}`
    })
  },

  // 获取算子详情
  getOperatorDetail: (id: string | number) => {
    return ZXR.get({
      url: `/zhpgxt/zhpgOperator/${id}`
    })
  }
}