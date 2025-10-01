// 模版管理模块API
import ZXR from '../../http'

// 获取模版列表
export function getTemplateList(params = {}) {
  return ZXR.get({
    url: '/template/list',
    params
  })
}

// 根据ID获取模版详情
export function getTemplateById(id) {
  return ZXR.get({
    url: `/template/${id}`
  })
}

// 创建模版
export function createTemplate(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        ZXR.post({
          url: '/template/create',
          data
        })
      )
    }, 3000)
  })
}

// 更新模版
export function updateTemplate(id, data) {
  return ZXR.put({
    url: `/template/${id}`,
    data
  })
}

// 删除模版
export function deleteTemplate(id) {
  return ZXR.delete({
    url: '/template/delete',
    params: { id }
  })
}

// 获取状态选项
export function getStatusOptions() {
  return ZXR.get({
    url: '/template/status/options'
  })
}

export const templateApi = {
  getTemplateList,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getStatusOptions
}
