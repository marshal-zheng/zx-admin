import ZXR from '@/api/http'
import type { WorkplaceTotal, Project, Dynamic, Team, RadarData } from './types'

export const getCountApi = (): Promise<IResponse<WorkplaceTotal>> => {
  return ZXR.get({ url: '/mock/workplace/total' })
}

export const getProjectApi = (): Promise<IResponse<Project>> => {
  return ZXR.get({ url: '/mock/workplace/project' })
}

export const getDynamicApi = (): Promise<IResponse<Dynamic[]>> => {
  return ZXR.get({ url: '/mock/workplace/dynamic' })
}

export const getTeamApi = (): Promise<IResponse<Team[]>> => {
  return ZXR.get({ url: '/mock/workplace/team' })
}

export const getRadarApi = (): Promise<IResponse<RadarData[]>> => {
  return ZXR.get({ url: '/mock/workplace/radar' })
}
