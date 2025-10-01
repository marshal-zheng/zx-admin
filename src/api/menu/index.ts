import ZXR from '@/api/http'

export const getMenuListApi = () => {
  return ZXR.get({ url: '/mock/menu/list' })
}
