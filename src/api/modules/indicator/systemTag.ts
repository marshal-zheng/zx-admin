import ZXR from '../../http'

export interface SystemTag {
  id: string
  tagName: string
  createTime?: string
}

export interface SystemTagListResponse {
  records: SystemTag[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 获取指标体系标签列表
 */
export function getSystemTagList(params?: { current?: number; size?: number }) {
  return ZXR.get({
    url: '/zhpgxt/zhpgEvaluaSystemTag',
    params: {
      current: params?.current || 1,
      size: params?.size || 999
    }
  })
}

/**
 * 创建指标体系标签
 */
export function createSystemTag(data: { tagName: string }) {
  return ZXR.post({
    url: '/zhpgxt/zhpgEvaluaSystemTag',
    data
  })
}

/**
 * 删除指标体系标签
 */
export function deleteSystemTag(id: string) {
  return ZXR.delete({
    url: `/zhpgxt/zhpgEvaluaSystemTag/${id}`
  })
}

export const systemTagApi = {
  getSystemTagList,
  createSystemTag,
  deleteSystemTag
}
