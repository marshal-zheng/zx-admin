import ZXR from '../../http'

// 仪表盘管理API
export const dashboardApi = {
  // 获取仪表盘列表
  getDashboardList: (params: any) => {
    return ZXR.get({
      url: '/zhpgxt/zhpgSchemeResult',
      params
    })
  },

  // 创建仪表盘
  createDashboard: (data: any) => {
    return ZXR.post({
      url: '/zhpgxt/zhpgSchemeResult',
      data
    })
  },

  // 更新仪表盘
  updateDashboard: (data: any) => {
    return ZXR.put({
      url: `/zhpgxt/zhpgSchemeResult/${data.id}`,
      data
    })
  },

  // 删除仪表盘
  deleteDashboard: (id: string | number) => {
    return ZXR.delete({
      url: `/zhpgxt/zhpgSchemeResult/${id}`
    })
  },

  // 获取仪表盘详情
  getDashboardDetail: (id: string | number) => {
    return ZXR.get({
      url: `/zhpgxt/zhpgSchemeResult/${id}`
    })
  }
}