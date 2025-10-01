import ZXR from '@/api/http'

export const getRoleListApi = () => {
  return ZXR.get({ url: '/mock/role/list' })
}
