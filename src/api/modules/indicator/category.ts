import ZXR from '../../http'

// 分类管理API
export const categoryApi = {
  // 获取分类列表
  getCategoryList: (params: any) => {
    return ZXR.get({
      url: '/zhpgxt/zhpgEvaluaSystemClazz',
      params
    })
  },

  // 创建分类
  createCategory: (data: any) => {
    return ZXR.post({
      url: '/zhpgxt/zhpgEvaluaSystemClazz',
      data
    })
  },

  // 更新分类
  updateCategory: (data: any) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgEvaluaSystemClazz/${data.id}`,
      data
    })
  },

  // 删除分类
  deleteCategory: (id: string | number) => {
    return ZXR.delete({
      url: `/zhpgxt/zhpgEvaluaSystemClazz/${id}`
    })
  },

  // 获取分类详情
  getCategoryDetail: (id: string | number) => {
    return ZXR.get({
      url: `/zhpgxt/zhpgEvaluaSystemClazz/${id}`
    })
  }
}
