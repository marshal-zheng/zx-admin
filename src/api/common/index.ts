import ZXR from '@/api/http'

// 获取所有字典
export const getDictApi = () => {
  return ZXR.get({ url: '/mock/dict/list' })
}

// 模拟获取某个字典
export const getDictOneApi = async () => {
  return ZXR.get({ url: '/mock/dict/one' })
}
