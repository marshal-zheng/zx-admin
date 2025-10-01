import ZXR from '@/api/http'
import { RequestResponse } from './types'

export const request1 = () => {
  return ZXR.get<IResponse<RequestResponse>>({
    url: '/mock/request/1'
  })
}

export const request2 = () => {
  return ZXR.get<IResponse<RequestResponse>>({
    url: '/mock/request/2'
  })
}

export const request3 = () => {
  return ZXR.get<IResponse<RequestResponse>>({
    url: '/mock/request/3'
  })
}

export const request4 = () => {
  return ZXR.get<IResponse<RequestResponse>>({
    url: '/mock/request/4'
  })
}

export const request5 = () => {
  return ZXR.get<IResponse<RequestResponse>>({
    url: '/mock/request/5'
  })
}

export const expired = () => {
  return ZXR.get<IResponse<RequestResponse>>({
    url: '/mock/request/expired'
  })
}
