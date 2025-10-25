import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'
import { toAnyString } from '@/utils'
import fs from 'fs'
import path from 'path'

const timeout = 1000
const count = 50

// 评估类型选项 - 油料库火灾事故评估类型
const evaluationTypes = [
  '泄漏与扩散评估',
  '危害影响评估',
  '应急响应效能评估',
  '处置效果与损失评估',
  '综合评估分析',
  '火灾风险评估',
  '应急预案评估',
  '人员疏散评估',
  '消防救援评估',
  '经济损失评估',
  '环境影响评估'
]

// 状态选项
const statusOptions = ['pending', 'running', 'completed', 'failed']

// 状态文本映射
const statusTextMap = {
  pending: '待执行',
  running: '执行中',
  completed: '已完成',
  failed: '失败'
}

interface EvaluationItem {
  id: number | string
  name: string
  type: string
  status: string
  progress: number
  score: number | null
  createTime: string
  updateTime?: string
  description?: string
  creator?: string
  duration?: number
}

// 评估任务接口
interface EvaluationTask {
  id: string
  taskName: string
  taskDescribe: string
  object: string
  process: string
  purpose: string
  scheme: string
  taskTemplate: number
  taskType: number
  createTime: string
  status?: string
}

// 评估作业记录接口
interface TaskJobRecord {
  id: string
  taskId: string
  taskJobName: string
  methodId: string
  evaluateTime: string
}

// 评估作业接口
interface TaskJob {
  records: TaskJobRecord[]
  total: number
  size: number
  current: number
  pages: number
}

// 评估任务详情接口
interface EvaluationTaskDetail extends EvaluationTask {
  zhpgEvaluaTaskJobs: TaskJob[]
}

// 使用data.js中的具体数据作为基础数据
const baseData = [
  {
    id: 1,
    name: '某军用油料库火灾事故综合评估',
    type: '综合评估分析',
    status: 'completed',
    progress: 100,
    score: 85.2,
    createTime: '2025-10-16 10:25:00',
    description: '某军用油料库发生火灾事故的全面评估分析',
    leakageRate: 45.6, // L/min
    totalLeakage: 125.8, // m3
    leakageCoverageArea: 2850, // m2
    burningArea: 1200, // m2
    casualties: { deaths: 0, severeInjuries: 2, minorInjuries: 5 },
    poisoningRate: 8.5, // %
    vehicleDamage: 3,
    alarmDelay: 3.2, // min
    evacuationTime: 12.5, // min
    internalRescueTime: 8.3, // min
    fireRescueTime: 18.7, // min
    fireExtinguishTime: 45.2, // min
    leakageControlTime: 32.1, // min
    evacuatedPersonnel: 156,
    economicLoss: 285.6 // 万元
  },
  {
    id: 2,
    name: '华北地区油料储备库泄漏事故评估',
    type: '泄漏与扩散评估',
    status: 'running',
    progress: 75,
    score: null,
    createTime: '2025-10-16 10:25:00',
    description: '华北地区某油料储备库发生泄漏事故的专项评估',
    leakageRate: 32.4,
    totalLeakage: 89.6,
    leakageCoverageArea: 1850,
    burningArea: 0,
    casualties: { deaths: 0, severeInjuries: 0, minorInjuries: 1 },
    poisoningRate: 3.2,
    vehicleDamage: 0,
    alarmDelay: 2.1,
    evacuationTime: 8.7,
    internalRescueTime: 5.2,
    fireRescueTime: 15.3,
    leakageControlTime: 28.5,
    evacuatedPersonnel: 89,
    economicLoss: 156.3
  },
  {
    id: 3,
    name: '东南沿海油料基地火灾风险评估',
    type: '火灾风险评估',
    status: 'pending',
    progress: 0,
    score: null,
    createTime: '2025-10-16 10:25:00',
    description: '东南沿海某油料基地火灾风险预评估',
    leakageRate: 0,
    totalLeakage: 0,
    leakageCoverageArea: 0,
    burningArea: 0,
    casualties: { deaths: 0, severeInjuries: 0, minorInjuries: 0 },
    poisoningRate: 0,
    vehicleDamage: 0,
    alarmDelay: 0,
    evacuationTime: 0,
    internalRescueTime: 0,
    fireRescueTime: 0,
    leakageControlTime: 0,
    evacuatedPersonnel: 0,
    economicLoss: 0
  },
  {
    id: 4,
    name: '西部战区油料库应急响应效能评估',
    type: '应急响应效能评估',
    status: 'failed',
    progress: 30,
    score: null,
    createTime: '2025-10-16 10:25:00',
    description: '西部战区某油料库应急响应效能专项评估',
    leakageRate: 0,
    totalLeakage: 0,
    leakageCoverageArea: 0,
    burningArea: 0,
    casualties: { deaths: 0, severeInjuries: 0, minorInjuries: 0 },
    poisoningRate: 0,
    vehicleDamage: 0,
    alarmDelay: 5.8,
    evacuationTime: 18.2,
    internalRescueTime: 12.5,
    fireRescueTime: 25.3,
    leakageControlTime: 0,
    evacuatedPersonnel: 0,
    economicLoss: 0
  },
  {
    id: 5,
    name: '中部地区油料中转站火灾事故评估',
    type: '危害影响评估',
    status: 'completed',
    progress: 100,
    score: 78.9,
    createTime: '2025-10-16 10:25:00',
    description: '中部地区某油料中转站火灾事故危害影响评估',
    leakageRate: 28.7,
    totalLeakage: 76.4,
    leakageCoverageArea: 1650,
    burningArea: 850,
    casualties: { deaths: 1, severeInjuries: 3, minorInjuries: 8 },
    poisoningRate: 12.3,
    vehicleDamage: 5,
    alarmDelay: 4.5,
    evacuationTime: 15.8,
    internalRescueTime: 9.7,
    fireRescueTime: 22.1,
    fireExtinguishTime: 52.3,
    leakageControlTime: 38.9,
    evacuatedPersonnel: 203,
    economicLoss: 425.8
  },
  {
    id: 6,
    name: '北方油料储备基地消防救援评估',
    type: '消防救援评估',
    status: 'completed',
    progress: 100,
    score: 92.3,
    createTime: '2025-10-16 10:25:00',
    description: '北方某油料储备基地消防救援能力评估',
    leakageRate: 0,
    totalLeakage: 0,
    leakageCoverageArea: 0,
    burningArea: 0,
    casualties: { deaths: 0, severeInjuries: 0, minorInjuries: 0 },
    poisoningRate: 0,
    vehicleDamage: 0,
    alarmDelay: 1.8,
    evacuationTime: 6.5,
    internalRescueTime: 4.2,
    fireRescueTime: 12.8,
    fireExtinguishTime: 0,
    leakageControlTime: 0,
    evacuatedPersonnel: 0,
    economicLoss: 0
  },
  {
    id: 7,
    name: '南方油料补给站泄漏扩散评估',
    type: '泄漏与扩散评估',
    status: 'running',
    progress: 68,
    score: null,
    createTime: '2025-10-16 10:25:00',
    description: '南方某油料补给站泄漏扩散情况评估',
    leakageRate: 38.9,
    totalLeakage: 102.7,
    leakageCoverageArea: 2150,
    burningArea: 0,
    casualties: { deaths: 0, severeInjuries: 1, minorInjuries: 3 },
    poisoningRate: 6.8,
    vehicleDamage: 1,
    alarmDelay: 2.8,
    evacuationTime: 10.3,
    internalRescueTime: 6.9,
    fireRescueTime: 16.7,
    leakageControlTime: 25.4,
    evacuatedPersonnel: 127,
    economicLoss: 198.5
  },
  {
    id: 8,
    name: '东北油料仓库人员疏散评估',
    type: '人员疏散评估',
    status: 'completed',
    progress: 100,
    score: 88.7,
    createTime: '2025-10-16 10:25:00',
    description: '东北某油料仓库人员疏散效果评估',
    leakageRate: 0,
    totalLeakage: 0,
    leakageCoverageArea: 0,
    burningArea: 0,
    casualties: { deaths: 0, severeInjuries: 0, minorInjuries: 2 },
    poisoningRate: 2.1,
    vehicleDamage: 0,
    alarmDelay: 2.3,
    evacuationTime: 9.8,
    internalRescueTime: 5.6,
    fireRescueTime: 14.2,
    evacuatedPersonnel: 178,
    economicLoss: 0
  },
  {
    id: 9,
    name: '西南油料库环境影响评估',
    type: '环境影响评估',
    status: 'pending',
    progress: 0,
    score: null,
    createTime: '2025-10-16 10:25:00',
    description: '西南某油料库事故环境影响评估',
    leakageRate: 0,
    totalLeakage: 0,
    leakageCoverageArea: 0,
    burningArea: 0,
    casualties: { deaths: 0, severeInjuries: 0, minorInjuries: 0 },
    poisoningRate: 0,
    vehicleDamage: 0,
    alarmDelay: 0,
    evacuationTime: 0,
    internalRescueTime: 0,
    fireRescueTime: 0,
    leakageControlTime: 0,
    evacuatedPersonnel: 0,
    economicLoss: 0
  },
  {
    id: 10,
    name: '华东油料基地处置效果评估',
    type: '处置效果与损失评估',
    status: 'running',
    progress: 55,
    score: null,
    createTime: '2025-10-16 10:25:00',
    description: '华东某油料基地事故处置效果与损失评估',
    leakageRate: 42.3,
    totalLeakage: 118.9,
    leakageCoverageArea: 2650,
    burningArea: 1450,
    casualties: { deaths: 0, severeInjuries: 2, minorInjuries: 6 },
    poisoningRate: 9.7,
    vehicleDamage: 4,
    alarmDelay: 3.8,
    evacuationTime: 14.2,
    internalRescueTime: 8.9,
    fireRescueTime: 20.5,
    fireExtinguishTime: 48.7,
    leakageControlTime: 35.6,
    evacuatedPersonnel: 189,
    economicLoss: 356.9
  }
]

// 使用基础数据作为评估列表
let evaluationList: EvaluationItem[] = [...baseData]

// 模版相关数据
interface TemplateItem {
  id: number | string
  name: string
  type: string
  scenario: string
  status: string
  description: string
  createTime: string
  updateTime?: string
  creator?: string
}

// 模版状态选项
const templateStatusOptions = ['draft', 'active', 'inactive', 'archived']

// 模版状态文本映射
const templateStatusTextMap = {
  draft: '草稿',
  active: '启用',
  inactive: '停用',
  archived: '归档'
}

// 模版基础数据
const templateBaseData = [
  {
    id: 1,
    name: '油料库火灾事故综合评估模版',
    type: 'comprehensive',
    scenario: 'fire_accident',
    status: 'active',
    description:
      '油料库火灾事故全面评估标准模版，包含泄漏扩散、危害影响、应急响应、处置效果四大维度',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 2,
    name: '泄漏与扩散评估模版',
    type: 'leakage_diffusion',
    scenario: 'fire_accident',
    status: 'active',
    description: '专门用于评估油料泄漏速率、总泄漏量、覆盖面积和燃烧面积的模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 3,
    name: '危害影响评估模版',
    type: 'hazard_impact',
    scenario: 'fire_accident',
    status: 'active',
    description: '评估人员伤亡、中毒发生率、车辆损毁等危害影响的专用模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 4,
    name: '应急响应效能评估模版',
    type: 'emergency_response',
    scenario: 'fire_accident',
    status: 'active',
    description: '评估报警延迟、疏散时间、救援到位时间等应急响应效能的模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 5,
    name: '处置效果与损失评估模版',
    type: 'disposal_loss',
    scenario: 'fire_accident',
    status: 'active',
    description: '评估火灾扑灭时间、泄漏控制时间、经济损失等处置效果的模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 6,
    name: '油料库风险预评估模版',
    type: 'risk_assessment',
    scenario: 'fire_prevention',
    status: 'active',
    description: '用于油料库火灾风险预评估的标准模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 7,
    name: '消防救援能力评估模版',
    type: 'fire_rescue',
    scenario: 'fire_accident',
    status: 'active',
    description: '专门评估消防救援队伍能力和效果的模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 8,
    name: '人员疏散效果评估模版',
    type: 'evacuation',
    scenario: 'fire_accident',
    status: 'active',
    description: '评估人员疏散效果和疏散时间的专用模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 9,
    name: '环境影响评估模版',
    type: 'environmental_impact',
    scenario: 'fire_accident',
    status: 'draft',
    description: '评估火灾事故对周边环境影响的模版',
    createTime: '2025-10-16 10:25:00'
  },
  {
    id: 10,
    name: '应急预案有效性评估模版',
    type: 'emergency_plan',
    scenario: 'fire_prevention',
    status: 'active',
    description: '评估油料库应急预案有效性和可操作性的模版',
    createTime: '2025-10-16 10:25:00'
  }
]

let templateList: TemplateItem[] = [...templateBaseData]

// 评估任务列表（用于存储创建的评估任务）
let evaluationTaskList: EvaluationTask[] = []

// 评估任务作业列表（用于存储每个任务的方案列表）
// key: taskId, value: TaskJobRecord[]
const taskJobsMap: Record<string, TaskJobRecord[]> = {}

// 仪表盘配置列表
let dashboardList = [
  {
    id: 'DASHBOARD-001',
    schemeName: '油料库火灾损毁',
    schemeDescribe:
      '基于评估指标体系的油料库火灾事故综合评估仪表盘，通过表格、饼状图、雷达图、柱状图、环形图、散点图、面积图、平行坐标图等多维度展示火灾事故评估结果',
    type: 2,
    config: JSON.stringify({
      panels: [
        {
          id: 'panel-1',
          type: 'table',
          widget: 'table',
          title: '评估指标体系',
          description: '油料库火灾事故评估指标体系及权重分布',
          color: '#409EFF',
          gridPos: { x: 0, y: 0, w: 24, h: 10 },
          transparentBackground: false,
          metadata: {},
          data: null
        },
        {
          id: 'panel-2',
          type: 'pie',
          widget: 'echarts',
          title: '评估类别权重分布',
          description: '四大评估类别的权重占比',
          color: '#67C23A',
          gridPos: { x: 0, y: 12, w: 8, h: 10 },
          transparentBackground: false,
          metadata: {},
          data: null
        },
        {
          id: 'panel-3',
          type: 'area',
          widget: 'echarts',
          title: '综合评估面积图',
          description: '四大类别的综合评估得分',
          color: '#E6A23C',
          gridPos: { x: 8, y: 12, w: 8, h: 10 },
          transparentBackground: false,
          metadata: {},
          data: null
        },
        {
          id: 'panel-4',
          type: 'bar',
          widget: 'echarts',
          title: '各指标得分分析',
          description: '各评估指标的详细得分情况',
          color: '#409EFF',
          gridPos: { x: 16, y: 12, w: 8, h: 10 },
          transparentBackground: false,
          metadata: {},
          data: null
        },
        {
          id: 'panel-5',
          type: 'doughnut',
          widget: 'echarts',
          title: '危害影响分布',
          description: '人员伤亡、财产损失等危害影响环形图',
          color: '#F56C6C',
          gridPos: { x: 0, y: 22, w: 8, h: 10 },
          transparentBackground: false,
          metadata: {},
          data: null
        },
        {
          id: 'panel-6',
          type: 'scatter',
          widget: 'echarts',
          title: '泄漏扩散态势',
          description: '泄漏速率与覆盖面积的散点分布',
          color: '#909399',
          gridPos: { x: 8, y: 22, w: 8, h: 10 },
          transparentBackground: false,
          metadata: {},
          data: null
        },
        {
          id: 'panel-7',
          type: 'area',
          widget: 'echarts',
          title: '应急响应时间序列',
          description: '报警、疏散、救援等关键时间节点面积图',
          color: '#67C23A',
          gridPos: { x: 16, y: 22, w: 8, h: 10 },
          transparentBackground: false,
          metadata: {},
          data: null
        },
        {
          id: 'panel-8',
          type: 'parallel',
          widget: 'echarts',
          title: '多维度指标平行坐标',
          description: '泄漏速率、人员伤亡、经济损失等多维度指标对比',
          color: '#E6A23C',
          gridPos: { x: 0, y: 32, w: 24, h: 12 },
          transparentBackground: false,
          metadata: {},
          data: null
        }
      ],
      layout: { width: 1200 }
    }),
    createTime: '2025-10-16 10:25:00'
  }
]

export default [
  // 获取评估列表
  {
    url: '/api/evaluation/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      console.log('Mock API - /evaluation/list 接收到的查询参数:', query)
      const page = parseInt(query.page || query.pageNumber || query.current) || 1
      const size = parseInt(query.size || query.pageSize || query.limit) || 10
      const { status, keyword } = query
      console.log('Mock API - 解析后的分页参数:', { page, size })

      // 暂时返回空数据
      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: {
          countId: null,
          current: page,
          maxLimit: null,
          optimizeCountSql: true,
          orders: [{ column: 'create_time', asc: false }],
          pages: 0,
          records: [],
          searchCount: true,
          size,
          total: 0
        }
      }
    }
  },

  // 获取评估详情
  {
    url: '/api/evaluation/detail',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { id } = query
      const item = evaluationList.find((item) => item.id === parseInt(id))

      if (!item) {
        return {
          code: 404,
          message: '评估任务不存在'
        }
      }

      return {
        code: SUCCESS_CODE,
        data: item
      }
    }
  },

  // 删除评估任务
  {
    url: '/api/evaluation/delete',
    method: 'delete',
    timeout,
    response: ({ query }) => {
      const { id } = query
      const index = evaluationList.findIndex((item) => item.id == id)

      if (index === -1) {
        return {
          code: 404,
          message: '评估任务不存在'
        }
      }

      evaluationList.splice(index, 1)

      return {
        code: SUCCESS_CODE,
        message: '删除成功'
      }
    }
  },

  // 获取状态选项
  {
    url: '/api/evaluation/status/options',
    method: 'get',
    timeout,
    response: () => {
      const options = statusOptions.map((status) => ({
        label: statusTextMap[status],
        value: status
      }))

      return {
        code: SUCCESS_CODE,
        data: options
      }
    }
  },

  // 创建评估任务
  {
    url: '/api/evaluation/create',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const newItem: EvaluationItem = {
        id: toAnyString(),
        name: body.name || '新建评估任务',
        type: body.type || '性能评估',
        status: 'pending',
        progress: 0,
        score: null,
        createTime: '2025-10-16 10:25:00',
        updateTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
        description: body.description || '',
        creator: body.creator || '系统用户',
        duration: 0
      }

      evaluationList.unshift(newItem)

      return {
        code: SUCCESS_CODE,
        data: newItem,
        message: '创建成功'
      }
    }
  },

  // ========== 模版管理相关接口 ==========

  // 获取模版列表
  {
    url: '/api/template/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      console.log('Mock API - /template/list 接收到的查询参数:', query)
      const page = parseInt(query.page || query.pageNumber || query.current) || 1
      const size = parseInt(query.size || query.pageSize || query.limit) || 10
      const { status, keyword } = query
      console.log('Mock API - 解析后的分页参数:', { page, size })

      let filteredList = [...templateList]

      // 状态筛选
      if (status && status !== '') {
        filteredList = filteredList.filter((item) => item.status === status)
      }

      // 关键词搜索（搜索名称和ID）
      if (keyword && keyword.trim() !== '') {
        const searchKeyword = keyword.trim().toLowerCase()
        filteredList = filteredList.filter(
          (item) =>
            item.name.toLowerCase().includes(searchKeyword) ||
            item.id.toString().includes(searchKeyword)
        )
      }

      // 分页处理
      const total = filteredList.length
      const start = (page - 1) * size
      const end = start + size
      const records = filteredList.slice(start, end)
      const pages = Math.ceil(total / size)

      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: {
          countId: null,
          current: page,
          maxLimit: null,
          optimizeCountSql: true,
          orders: [{ column: 'create_time', asc: false }],
          pages,
          records,
          searchCount: true,
          size,
          total
        }
      }
    }
  },

  // 获取模版详情
  {
    url: '/api/template/:id',
    method: 'get',
    timeout,
    response: ({ params }) => {
      const { id } = params
      const item = templateList.find((item) => item.id === parseInt(id))

      if (!item) {
        return {
          code: 404,
          message: '模版不存在'
        }
      }

      return {
        code: SUCCESS_CODE,
        data: item
      }
    }
  },

  // 创建模版
  {
    url: '/api/template/create',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const newItem: TemplateItem = {
        id: toAnyString(),
        name: body.name || '新建模版',
        type: body.type || 'comprehensive',
        scenario: body.scenario || 'system',
        status: 'draft',
        description: body.description || '',
        createTime: '2025-10-16 10:25:00',
        updateTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
        creator: body.creator || '系统用户'
      }

      templateList.unshift(newItem)

      return {
        code: SUCCESS_CODE,
        data: newItem,
        message: '创建成功'
      }
    }
  },

  // 更新模版
  {
    url: '/api/template/:id',
    method: 'put',
    timeout,
    response: ({ params, body }) => {
      const { id } = params
      const index = templateList.findIndex((item) => item.id === parseInt(id))

      if (index === -1) {
        return {
          code: 404,
          message: '模版不存在'
        }
      }

      templateList[index] = {
        ...templateList[index],
        ...body,
        updateTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
      }

      return {
        code: SUCCESS_CODE,
        data: templateList[index],
        message: '更新成功'
      }
    }
  },

  // 删除模版
  {
    url: '/api/template/delete',
    method: 'delete',
    timeout,
    response: ({ query }) => {
      const { id } = query
      const index = templateList.findIndex((item) => item.id == id)

      if (index === -1) {
        return {
          code: 404,
          message: '模版不存在'
        }
      }

      templateList.splice(index, 1)

      return {
        code: SUCCESS_CODE,
        message: '删除成功'
      }
    }
  },

  // 获取模版状态选项
  {
    url: '/api/template/status/options',
    method: 'get',
    timeout,
    response: () => {
      const options = templateStatusOptions.map((status) => ({
        label: templateStatusTextMap[status],
        value: status
      }))

      return {
        code: SUCCESS_CODE,
        data: options
      }
    }
  },

  // 获取评估方案选项
  {
    url: '/api/evaluate/scheme/options',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          { label: '性能评估方案', value: 'performance_scheme' },
          { label: '安全评估方案', value: 'security_scheme' },
          { label: '可用性评估方案', value: 'availability_scheme' },
          { label: '综合评估方案', value: 'comprehensive_scheme' },
          { label: '效率评估方案', value: 'efficiency_scheme' },
          { label: '质量评估方案', value: 'quality_scheme' },
          { label: '成本效益评估方案', value: 'cost_benefit_scheme' }
        ]
      }
    }
  },

  // 获取评估算法选项
  {
    url: '/api/evaluate/algorithm/options',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            label: '加权平均算法',
            value: 'weighted_average',
            description: '基于权重的线性加权计算'
          },
          { label: '模糊逻辑算法', value: 'fuzzy_logic', description: '处理不确定性和模糊信息' },
          { label: '神经网络算法', value: 'neural_network', description: '基于机器学习的智能评估' },
          { label: '层次分析法', value: 'ahp_method', description: '多层次多准则决策分析' },
          {
            label: '数据包络分析',
            value: 'data_envelopment',
            description: '效率评估的数学规划方法'
          },
          {
            label: '灰色关联分析',
            value: 'grey_correlation',
            description: '处理少数据不确定性问题'
          },
          { label: '主成分分析', value: 'principal_component', description: '降维和特征提取方法' },
          {
            label: '支持向量机',
            value: 'support_vector_machine',
            description: '分类和回归的监督学习算法'
          }
        ]
      }
    }
  },

  // ========== 仪表盘管理接口 ==========
  // 获取仪表盘列表
  {
    url: '/api/zhpgxt/zhpgSchemeResult',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword } = query
      console.log('获取仪表盘列表，参数:', query)

      // 过滤数据
      let filteredList = [...dashboardList]

      // 关键词搜索
      if (keyword && keyword.trim() !== '') {
        const searchKeyword = keyword.trim().toLowerCase()
        filteredList = filteredList.filter(
          (item) =>
            item.schemeName.toLowerCase().includes(searchKeyword) ||
            item.id.toLowerCase().includes(searchKeyword) ||
            (item.schemeDescribe && item.schemeDescribe.toLowerCase().includes(searchKeyword))
        )
      }

      // 分页处理
      const total = filteredList.length
      const start = (parseInt(page) - 1) * parseInt(pageSize)
      const end = start + parseInt(pageSize)
      const records = filteredList.slice(start, end)
      const pages = Math.ceil(total / parseInt(pageSize))

      console.log('返回仪表盘列表，共', total, '条，当前页', records.length, '条')

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages
        }
      }
    }
  },

  // 创建仪表盘
  {
    url: '/api/zhpgxt/zhpgSchemeResult',
    method: 'post',
    response: ({ body }) => {
      console.log('创建仪表盘，接收数据:', body)

      const newDashboard = {
        id: `DASHBOARD-${Mock.mock('@id')}`,
        schemeName: body.schemeName || '新建仪表盘',
        schemeDescribe: body.schemeDescribe || '',
        type: body.type || 2,
        config: body.config || '{}',
        createTime: '2025-10-16 10:25:00'
      }

      // 添加到列表开头
      dashboardList.unshift(newDashboard)

      console.log('创建成功，当前列表长度:', dashboardList.length)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '创建成功',
        data: newDashboard
      }
    }
  },

  // 更新仪表盘
  {
    url: '/api/zhpgxt/zhpgSchemeResult/:id',
    method: 'put',
    response: ({ params, body }) => {
      console.log('更新仪表盘，ID:', params?.id, '接收数据:', body)

      const dashboardId = params?.id
      const index = dashboardList.findIndex((item) => item.id === dashboardId)

      if (index === -1) {
        return {
          success: false,
          code: 404,
          msg: '仪表盘不存在',
          data: null
        }
      }

      // 更新数据
      const updatedDashboard = {
        ...dashboardList[index],
        schemeName: body.schemeName || dashboardList[index].schemeName,
        schemeDescribe: body.schemeDescribe || dashboardList[index].schemeDescribe,
        type: body.type !== undefined ? body.type : dashboardList[index].type,
        config: body.config || dashboardList[index].config,
        updateTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
      }

      dashboardList[index] = updatedDashboard

      console.log('更新成功，仪表盘ID:', dashboardId)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '更新成功',
        data: updatedDashboard
      }
    }
  },

  // 删除仪表盘
  {
    url: '/api/zhpgxt/zhpgSchemeResult/:id',
    method: 'delete',
    response: ({ params }) => {
      const dashboardId = params?.id
      const index = dashboardList.findIndex((item) => item.id === dashboardId)

      if (index === -1) {
        return {
          success: false,
          code: 404,
          msg: '仪表盘不存在',
          data: null
        }
      }

      // 从列表中删除
      dashboardList.splice(index, 1)

      console.log('删除成功，仪表盘ID:', dashboardId, '当前列表长度:', dashboardList.length)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '删除成功',
        data: null
      }
    }
  },

  // 获取仪表盘详情
  {
    url: '/api/zhpgxt/zhpgSchemeResult/:id',
    method: 'get',
    response: ({ params }) => {
      const id = params?.id
      console.log('获取仪表盘详情，ID:', id)

      let dashboardId = id

      // 从 dashboardList 中查找
      const dashboard = dashboardList.find((item) => item.id === dashboardId)

      if (dashboard) {
        console.log('找到仪表盘:', dashboard.schemeName)
        return {
          success: true,
          code: SUCCESS_CODE,
          msg: '获取成功',
          data: dashboard
        }
      }

      // 如果找不到，使用默认的旧数据（向后兼容）
      const dashboards = {
        '1': {
          id: '1',
          schemeName: '油料库火灾损毁',
          schemeDescribe:
            '基于评估指标体系的油料库火灾事故综合评估仪表盘，通过表格、饼状图、雷达图、柱状图、环形图、散点图、面积图、平行坐标图等多维度展示火灾事故评估结果',
          type: 2,
          config: JSON.stringify({
            panels: [
              {
                id: 'panel-1',
                type: 'table',
                widget: 'table',
                title: '评估指标体系',
                description: '油料库火灾事故评估指标体系及权重分布',
                color: '#409EFF',
                gridPos: { x: 0, y: 0, w: 24, h: 9 },
                transparentBackground: false,
                metadata: {},
                data: null
              },
              {
                id: 'panel-2',
                type: 'pie',
                widget: 'echarts',
                title: '评估类别权重分布',
                description: '四大评估类别的权重占比',
                color: '#67C23A',
                gridPos: { x: 0, y: 12, w: 8, h: 10 },
                transparentBackground: false,
                metadata: {},
                data: null
              },
              {
                id: 'panel-3',
                type: 'areaRadar',
                widget: 'echarts',
                title: '综合评估雷达图',
                description: '四大类别的综合评估得分',
                color: '#E6A23C',
                gridPos: { x: 8, y: 12, w: 8, h: 10 },
                transparentBackground: false,
                metadata: {},
                data: null
              },
              {
                id: 'panel-4',
                type: 'bar',
                widget: 'echarts',
                title: '各指标得分分析',
                description: '各评估指标的详细得分情况',
                color: '#409EFF',
                gridPos: { x: 16, y: 12, w: 8, h: 10 },
                transparentBackground: false,
                metadata: {},
                data: null
              },
              {
                id: 'panel-5',
                type: 'doughnut',
                widget: 'echarts',
                title: '危害影响分布',
                description: '人员伤亡、财产损失等危害影响环形图',
                color: '#F56C6C',
                gridPos: { x: 0, y: 22, w: 8, h: 10 },
                transparentBackground: false,
                metadata: {},
                data: null
              },
              {
                id: 'panel-6',
                type: 'scatter',
                widget: 'echarts',
                title: '泄漏扩散态势',
                description: '泄漏速率与覆盖面积的散点分布',
                color: '#909399',
                gridPos: { x: 8, y: 22, w: 8, h: 10 },
                transparentBackground: false,
                metadata: {},
                data: null
              },
              {
                id: 'panel-7',
                type: 'area',
                widget: 'echarts',
                title: '应急响应时间序列',
                description: '报警、疏散、救援等关键时间节点面积图',
                color: '#67C23A',
                gridPos: { x: 16, y: 22, w: 8, h: 10 },
                transparentBackground: false,
                metadata: {},
                data: null
              },
              {
                id: 'panel-8',
                type: 'parallel',
                widget: 'echarts',
                title: '多维度指标平行坐标',
                description: '泄漏速率、人员伤亡、经济损失等多维度指标对比',
                color: '#E6A23C',
                gridPos: { x: 0, y: 32, w: 24, h: 12 },
                transparentBackground: false,
                metadata: {},
                data: null
              }
            ],
            layout: { width: 1200 }
          }),
          createTime: '2025-10-16 10:25:00',
          updateTime: '2025-10-16 10:25:00'
        }
      }

      const mockDashboard = dashboards[params?.id] || dashboards['1']

      console.log('返回备用仪表盘数据:', mockDashboard.schemeName)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '获取成功',
        data: mockDashboard
      }
    }
  },

  // 获取评估任务列表
  {
    url: '/api/zhpgxt/zhpgEvaluaTask',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { page = 1, size = 10, keyword, status, taskTemplate } = query
      console.log('=== 获取评估任务列表 ===')
      console.log('查询参数:', query)
      console.log(
        '当前所有任务:',
        evaluationTaskList.map((t) => ({ id: t.id, name: t.taskName, template: t.taskTemplate }))
      )

      // 过滤数据
      let filteredList = [...evaluationTaskList]

      // 根据 taskTemplate 过滤（0=评估结果，1=评估任务模板）
      if (taskTemplate !== undefined && taskTemplate !== null && taskTemplate !== '') {
        const templateValue = parseInt(taskTemplate)
        console.log('按 taskTemplate 过滤:', templateValue)
        filteredList = filteredList.filter((item) => item.taskTemplate === templateValue)
        console.log('过滤后数量:', filteredList.length)
      }

      // 关键词搜索
      if (keyword && keyword.trim() !== '') {
        const searchKeyword = keyword.trim().toLowerCase()
        filteredList = filteredList.filter(
          (item) =>
            item.taskName.toLowerCase().includes(searchKeyword) ||
            item.id.toString().toLowerCase().includes(searchKeyword) ||
            (item.taskDescribe && item.taskDescribe.toLowerCase().includes(searchKeyword))
        )
        console.log('关键词搜索后数量:', filteredList.length)
      }

      // 状态筛选（如果有状态字段）
      if (status && status !== '') {
        filteredList = filteredList.filter((item) => item.status === status)
        console.log('状态筛选后数量:', filteredList.length)
      }

      // 分页处理
      const total = filteredList.length
      const start = (parseInt(page) - 1) * parseInt(size)
      const end = start + parseInt(size)
      const records = filteredList.slice(start, end)
      const pages = Math.ceil(total / parseInt(size))

      console.log(
        '✅ 返回评估任务列表，总计',
        total,
        '条，当前页',
        records.length,
        '条，页码:',
        page
      )

      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(size),
          current: parseInt(page),
          pages
        }
      }
    }
  },

  // 创建评估任务
  {
    url: '/api/zhpgxt/zhpgEvaluaTask',
    method: 'post',
    timeout,
    response: ({ body }) => {
      console.log('=== 创建评估任务 ===')
      console.log('接收数据:', body)

      const newTask: EvaluationTask = {
        id: `TASK-${Mock.mock('@id')}`,
        taskName: body.taskName || '',
        taskDescribe: body.taskDescribe || '',
        object: body.object || '',
        process: body.process || '',
        purpose: body.purpose || '',
        scheme: body.scheme || '',
        taskTemplate: body.taskTemplate || 0,
        taskType: body.taskType || 1,
        createTime: '2025-10-16 10:25:00'
      }

      // 将新任务添加到列表开头
      evaluationTaskList.unshift(newTask)

      console.log(
        '✅ 创建成功，任务ID:',
        newTask.id,
        '任务名称:',
        newTask.taskName,
        '模版标识:',
        newTask.taskTemplate
      )
      console.log('当前列表长度:', evaluationTaskList.length)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '创建成功',
        data: newTask
      }
    }
  },

  // 更新评估任务
  {
    url: '/api/zhpgxt/zhpgEvaluaTask/:id',
    method: 'put',
    timeout,
    response: (request) => {
      const { params, query, url, body } = request
      const taskId = params?.id || query?.id || url?.split('/').pop() || ''
      console.log('=== 更新评估任务 ===')
      console.log('任务ID:', taskId, '接收数据:', body)

      const index = evaluationTaskList.findIndex((task) => task.id === taskId)

      if (index === -1) {
        console.log('❌ 任务不存在')
        return {
          success: false,
          code: 404,
          msg: '任务不存在',
          data: null
        }
      }

      // 更新任务数据，保留原有的 id 和 createTime
      const updatedTask: EvaluationTask = {
        ...evaluationTaskList[index],
        taskName: body.taskName || evaluationTaskList[index].taskName,
        taskDescribe: body.taskDescribe || evaluationTaskList[index].taskDescribe,
        object: body.object || evaluationTaskList[index].object,
        process: body.process || evaluationTaskList[index].process,
        purpose: body.purpose || evaluationTaskList[index].purpose,
        scheme: body.scheme || evaluationTaskList[index].scheme,
        taskTemplate:
          body.taskTemplate !== undefined
            ? body.taskTemplate
            : evaluationTaskList[index].taskTemplate,
        taskType: body.taskType || evaluationTaskList[index].taskType
      }

      evaluationTaskList[index] = updatedTask

      console.log('✅ 更新成功，任务ID:', taskId)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '更新成功',
        data: updatedTask
      }
    }
  },

  // 删除评估任务
  {
    url: '/api/zhpgxt/zhpgEvaluaTask/:id',
    method: 'delete',
    timeout,
    response: (request) => {
      // 尝试多种方式获取ID
      const taskId =
        request.params?.id || request.query?.id || request.url?.split('/').pop() || ''

      console.log('=== 删除任务请求 ===')
      console.log('完整请求对象 keys:', Object.keys(request))
      console.log('request.params:', request.params)
      console.log('request.query:', request.query)
      console.log('request.url:', request.url)
      console.log('请求删除的任务ID:', taskId)
      console.log('当前任务列表长度:', evaluationTaskList.length)
      console.log('当前任务列表的所有ID:', evaluationTaskList.map((t) => t.id))

      const index = evaluationTaskList.findIndex((task) => task.id === taskId)

      if (index === -1) {
        console.log('❌ 任务不存在！未找到匹配的任务')
        return {
          success: false,
          code: 404,
          msg: '任务不存在',
          data: null
        }
      }

      // 从列表中删除
      evaluationTaskList.splice(index, 1)

      console.log('✅ 删除成功，任务ID:', taskId, '当前列表长度:', evaluationTaskList.length)

      return {
        success: true,
        code: 200,
        msg: '删除成功',
        data: null
      }
    }
  },

  // 设为模版
  {
    url: '/api/zhpgxt/zhpgEvaluaTask/:id',
    method: 'post',
    timeout,
    response: (request) => {
      const { params, query, url, body } = request
      const taskId = params?.id || query?.id || url?.split('/').pop() || ''
      const { taskTemplate } = body

      console.log('=== 设为模版请求 ===')
      console.log('任务ID:', taskId, '参数:', body)
      console.log('当前任务列表长度:', evaluationTaskList.length)
      console.log('当前任务列表的所有ID:', evaluationTaskList.map((t) => t.id))

      if (taskTemplate !== 1) {
        console.log('❌ 参数错误，taskTemplate:', taskTemplate)
        return {
          success: false,
          code: 400,
          msg: '参数错误',
          data: null
        }
      }

      const index = evaluationTaskList.findIndex((task) => task.id === taskId)

      if (index === -1) {
        console.log('❌ 任务不存在！未找到匹配的任务')
        return {
          success: false,
          code: 404,
          msg: '任务不存在',
          data: null
        }
      }

      // 更新任务的模版标识
      evaluationTaskList[index].taskTemplate = 1

      console.log(
        '✅ 设为模版成功，任务ID:',
        taskId,
        '任务名称:',
        evaluationTaskList[index].taskName,
        '模版标识:',
        evaluationTaskList[index].taskTemplate
      )

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '设为模版成功',
        data: evaluationTaskList[index]
      }
    }
  },

  // 获取评估基础指标列表
  {
    url: '/api/zhpgxt/zhpgEvaluaBase',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { current = 1, size = 10, keyword } = query
      // 生成基础指标数据 - 油料库火灾损毁评估指标体系
      const baseIndicators = [
        // 泄漏与扩散 (权重 0.16)
        {
          id: '1',
          name: '泄漏速率',
          isInner: 1,
          unit: 'L/min',
          weight: 0.04,
          category: '泄漏与扩散',
          description: '由油料事故泄漏机理模型计算'
        },
        {
          id: '2',
          name: '总泄漏量',
          isInner: 1,
          unit: 'm³',
          weight: 0.04,
          category: '泄漏与扩散',
          description:
            '事故过程中总的泄漏量，总泄漏量=点1泄漏量+点2泄漏量+┈+点n泄漏量；单点泄漏量=泄漏速率×泄漏时间'
        },
        {
          id: '3',
          name: '泄漏覆盖面积',
          isInner: 1,
          unit: 'm²',
          weight: 0.04,
          category: '泄漏与扩散',
          description: '由油料事故泄漏机理模型计算'
        },
        {
          id: '4',
          name: '燃烧面积',
          isInner: 1,
          unit: 'm²',
          weight: 0.04,
          category: '泄漏与扩散',
          description: '由油料事故燃烧机理模型计算'
        },

        // 危害影响 (权重 0.34)
        {
          id: '5',
          name: '人员死亡数量',
          isInner: 1,
          unit: '人',
          weight: 0.11,
          category: '危害影响',
          description: '平台统计实际死亡人员数据'
        },
        {
          id: '6',
          name: '人员重伤数量',
          isInner: 1,
          unit: '人',
          weight: 0.07,
          category: '危害影响',
          description: '平台统计实际重伤人员数据'
        },
        {
          id: '7',
          name: '人员轻伤数量',
          isInner: 1,
          unit: '个',
          weight: 0.06,
          category: '危害影响',
          description: '平台统计实际轻伤人员数据'
        },
        {
          id: '8',
          name: '中毒发生率',
          isInner: 1,
          unit: '%',
          weight: 0.05,
          category: '危害影响',
          description: 'CO/NO₂超标暴露人数，中毒发生率=（暴露人数/总人数）×100%'
        },
        {
          id: '9',
          name: '车辆损毁数量',
          isInner: 1,
          unit: '台',
          weight: 0.05,
          category: '危害影响',
          description: '平台统计实际车辆损毁数据'
        },

        // 应急响应效能 (权重 0.3)
        {
          id: '10',
          name: '报警延迟时间',
          isInner: 1,
          unit: 'min',
          weight: 0.06,
          category: '应急响应效能',
          description: '从起火到首次报警的时间，报警延迟=首次报警时间-起火时间'
        },
        {
          id: '11',
          name: '疏散时间',
          isInner: 1,
          unit: 'min',
          weight: 0.06,
          category: '应急响应效能',
          description: '从报警到全员撤离的时间，疏散时间通过仿真平台计时'
        },
        {
          id: '12',
          name: '内部救援到位时间',
          isInner: 1,
          unit: 'min',
          weight: 0.05,
          category: '应急响应效能',
          description: '微型消防站抵达时间，救援抵达时间=到达现场时间-接警时间'
        },
        {
          id: '13',
          name: '消防力量到位时间',
          isInner: 1,
          unit: 'min',
          weight: 0.05,
          category: '应急响应效能',
          description: '消防支队抵达时间，救援抵达时间=到达现场时间-接警时间'
        },
        {
          id: '14',
          name: '消防车出动数量',
          isInner: 1,
          unit: '台',
          weight: 0.04,
          category: '应急响应效能',
          description: '平台统计实际出动消防车数量数据'
        },
        {
          id: '15',
          name: '消防员出动数量',
          isInner: 1,
          unit: '人',
          weight: 0.04,
          category: '应急响应效能',
          description: '平台统计实际出动消防员数量数据'
        },

        // 处置效果与损失 (权重 0.2)
        {
          id: '16',
          name: '火灾扑灭时间',
          isInner: 1,
          unit: 'min',
          weight: 0.05,
          category: '处置效果与损失',
          description: '从火灾开始到火灾扑灭的时间，平台统计火灾时间数据'
        },
        {
          id: '17',
          name: '泄漏控制时间',
          isInner: 1,
          unit: 'min',
          weight: 0.05,
          category: '处置效果与损失',
          description: '从泄漏开始到停止泄漏的时间，平台统计泄漏时间数据'
        },
        {
          id: '18',
          name: '疏散人员数量',
          isInner: 1,
          unit: '人',
          weight: 0.05,
          category: '处置效果与损失',
          description: '平台统计疏散人员数量'
        },
        {
          id: '19',
          name: '直接经济损失',
          isInner: 1,
          unit: '万元',
          weight: 0.05,
          category: '处置效果与损失',
          description: '烧毁设备、建筑、物资价值，人员伤亡救治、赔偿等'
        }
      ]

      // 关键词搜索
      let filteredIndicators = baseIndicators
      if (keyword) {
        filteredIndicators = baseIndicators.filter(
          (item) => item.name.includes(keyword) || item.id.includes(keyword)
        )
      }

      // 分页
      const start = (current - 1) * size
      const end = start + parseInt(size)
      const records = filteredIndicators.slice(start, end)

      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: {
          records,
          total: filteredIndicators.length,
          size: parseInt(size),
          current: parseInt(current),
          pages: Math.ceil(filteredIndicators.length / parseInt(size))
        }
      }
    }
  },

  // 获取评估任务详情
  {
    url: '/api/zhpgxt/zhpgEvaluaTask/getById',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { id, page = 1, size = 10, keyword } = query
      console.log('=== 获取评估任务详情 ===')
      console.log('查询ID:', id, '分页:', { page, size, keyword })
      console.log('当前任务列表长度:', evaluationTaskList.length)
      console.log(
        '当前所有任务:',
        evaluationTaskList.map((t) => ({ id: t.id, name: t.taskName, template: t.taskTemplate }))
      )

      // 先查找任务是否存在
      const task = evaluationTaskList.find((t) => t.id === id)

      if (!task) {
        console.log('❌ 任务不存在！未找到ID为', id, '的任务')
        return {
          success: false,
          code: 404,
          msg: '任务不存在',
          data: null
        }
      }

      console.log('✅ 找到任务:', task.taskName, '模版标识:', task.taskTemplate)

      // 获取该任务的方案列表
      let taskJobs = taskJobsMap[id] || []

      // 如果有搜索关键词，进行过滤
      if (keyword && keyword.trim() !== '') {
        const searchKeyword = keyword.trim().toLowerCase()
        taskJobs = taskJobs.filter(
          (job) =>
            job.taskJobName.toLowerCase().includes(searchKeyword) ||
            job.id.toLowerCase().includes(searchKeyword) ||
            job.methodId.toLowerCase().includes(searchKeyword)
        )
      }

      // 分页处理
      const total = taskJobs.length
      const start = (parseInt(page) - 1) * parseInt(size)
      const end = start + parseInt(size)
      const records = taskJobs.slice(start, end)
      const pages = Math.ceil(total / parseInt(size))

      console.log('返回方案列表，共', total, '条，当前页', records.length, '条')

      // 构建详情数据
      const mockDetail: EvaluationTaskDetail = {
        ...task,
        zhpgEvaluaTaskJobs: [
          {
            records,
            total,
            size: parseInt(size),
            current: parseInt(page),
            pages
          }
        ]
      }

      console.log('✅ 返回详情数据成功')

      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: mockDetail
      }
    }
  },

  // 创建评估任务作业
  {
    url: '/api/zhpgxt/zhpgEvaluaTaskJob',
    method: 'post',
    timeout,
    response: ({ body }) => {
      console.log('创建评估任务作业，接收数据:', body)

      // 支持多种可能的字段名
      const taskId = body.taskId || body.evaluaTask || body.evaluaTaskId

      if (!taskId) {
        console.error('创建方案失败：缺少任务ID，body:', body)
        return {
          success: false,
          code: 400,
          msg: '缺少任务ID',
          data: null
        }
      }

      console.log('解析出的任务ID:', taskId)

      // 检查任务是否存在
      const taskExists = evaluationTaskList.find((t) => t.id === taskId)
      if (!taskExists) {
        return {
          success: false,
          code: 404,
          msg: '任务不存在',
          data: null
        }
      }

      const newJob: any = {
        id: `JOB-${Mock.mock('@id')}`,
        taskId: taskId,
        taskJobName: body.taskJobName || body.schemeName || '新建评估方案',
        methodId: body.methodId || Mock.mock('@integer(1, 5)').toString(),
        evaluateTime: '2025-10-16 10:25:00',
        // 保存仪表盘ID，用于后续运行方案时关联
        dashboardId: body.dashboardId || body.schemeResult || null
      }

      // 初始化或添加到该任务的方案列表
      if (!taskJobsMap[taskId]) {
        taskJobsMap[taskId] = []
      }
      taskJobsMap[taskId].unshift(newJob)

      console.log('创建方案成功，任务ID:', taskId, '当前方案数:', taskJobsMap[taskId].length)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '创建评估任务作业成功',
        data: newJob
      }
    }
  },

  // ========== 运行方案相关接口 ==========
  // 获取任务作业SQL数据
  {
    url: '/api/zhpgxt/zhpgDatabase/listBySql/:jobId',
    method: 'get',
    timeout,
    response: ({ params }) => {
      const { jobId } = params || { jobId: '123' }

      // 模拟返回根据图片显示的数据结构
      const mockData = [
        {
          id: 'id',
          containChild: null,
          parameters: [
            {
              id: '1851511115213733889',
              room_name: '第一个房间',
              map_path: '/Game/AIS/Map/Map_EditorUMG'
            },
            {
              id: '1851511115247228321',
              room_name: '987987',
              map_path: '/Game/AIS/Map/Map_EditorUMG'
            },
            {
              id: '1851511115276648449',
              room_name: '45654',
              map_path: '/Game/AIS/Map/Map_EditorUMG'
            },
            {
              id: '1851511115306008578',
              room_name: 'qqqqq',
              map_path: '/Game/AIS/Map/Map_EditorUMG'
            },
            {
              id: '1851511115331174402',
              room_name: 'www',
              map_path: '/Game/AIS/Map/Map_EditorUMG'
            },
            {
              id: '1851511115360534529',
              room_name: 'eee',
              map_path: '/Game/AIS/Map/Map_EditorUMG'
            }
          ],
          parametersDesc: 'room_name',
          parametersName: 'room_name',
          tags: null
        },
        {
          id: 'id',
          containChild: null,
          parameters: [
            {
              id: 1,
              name: '无电磁',
              a1: 0.85,
              a2: 15,
              a3: 0.86,
              a4: 5,
              a5: 0.85,
              a6: 0.9,
              a7: 0.74,
              a8: 0.83
            },
            {
              id: 2,
              name: '有电磁',
              a1: 0.92,
              a2: 22,
              a3: 0.89,
              a4: 4,
              a5: 0.95,
              a6: 0.98,
              a7: 0.79,
              a8: 0.9
            }
          ],
          parametersDesc: 'name',
          parametersName: 'name',
          tags: null
        }
      ]

      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: mockData
      }
    }
  },

  // 执行转换任务
  {
    url: '/api/zhpgxt/zhpgTrans/executeTrans/:jobId',
    method: 'post',
    timeout: 2000, // 模拟运行需要一些时间
    response: ({ params, body }) => {
      const { jobId } = params || { jobId: '123' }
      console.log('执行转换任务，jobId:', jobId, '接收参数:', body)

      // 查找对应的任务作业，获取任务信息和原始任务信息
      let dashboardId: string | null = null
      let originalTaskId: string | null = null
      let taskJobName: string = '评估方案'
      let methodId: string = '综合评估方法'
      let originalTask: EvaluationTask | undefined = undefined
      let taskJob: any = null

      for (const [tId, jobs] of Object.entries(taskJobsMap)) {
        const job = jobs.find((j) => j.id === jobId)
        if (job) {
          originalTaskId = tId
          taskJob = job
          taskJobName = (job as any).taskJobName || '评估方案'
          methodId = (job as any).methodId || '综合评估方法'
          // 获取仪表盘ID
          dashboardId = (job as any).dashboardId || 'DASHBOARD-001' // 默认使用油料库火灾损毁仪表盘
          // 查找原始任务信息
          originalTask = evaluationTaskList.find((t) => t.id === tId)
          break
        }
      }

      // 生成新的评估结果ID（每次运行都创建新的评估结果）
      const resultId = `RESULT-${Mock.mock('@id')}`

      // 获取任务名称和评估对象
      const taskName = originalTask?.taskName || '评估任务'
      const evaluationObject = originalTask?.object || Mock.mock('@ctitle(5, 15)')
      const currentTime = '2025-10-16 10:25:00'

      // 创建新的评估结果记录（每次运行方案都创建新记录）
      const newResult: EvaluationTask = {
        id: resultId,
        taskName: taskName,
        taskDescribe: `${evaluationObject}的评估结果`,
        object: evaluationObject,
        process: methodId, // 使用方案中的评估方法
        purpose: originalTask?.purpose || '安全评估与风险分析',
        scheme: taskJobName, // 使用方案名称
        taskTemplate: 0, // 评估结果，非模板
        taskType: 1,
        createTime: currentTime,
        status: 'completed'
      }

      // 添加到评估任务列表开头
      evaluationTaskList.unshift(newResult)
      console.log(
        '创建评估结果记录:',
        newResult.id,
        '任务名称:',
        newResult.taskName,
        '方案名称:',
        newResult.scheme,
        '评估方法:',
        newResult.process
      )

      console.log('执行成功，结果ID:', resultId, '关联仪表盘:', dashboardId)
      console.log('当前评估任务列表长度:', evaluationTaskList.length)

      // 模拟成功响应
      return {
        success: true,
        code: 200,
        msg: '执行成功',
        data: {
          jobId: jobId,
          executionTime: currentTime,
          status: 'completed',
          resultId: resultId // 返回新的结果ID
        }
      }
    }
  },

  // ========== 评估报告模板接口 ==========
  // 获取评估报告模板列表
  {
    url: '/api/zhpgxt/zhpgTemplateResult',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { page = 1, size = 10, keyword = '', templateType, startDate, endDate } = query

      // 模拟评估报告模板数据 (templateType: 1=系统内置, 2=自定义模板)
      const allTemplates = [
        {
          id: '1',
          templateName: '油料库火灾损毁模版',
          templateType: 1,
          createTime: '2025-10-16 10:25:00',
          templateContent:
            '油料库火灾损毁评估报告模板，包含泄漏与扩散、危害影响、应急响应效能、处置效果与损失四大评估维度，提供全面的火灾事故评估指标体系和评价标准。'
        }
      ]

      // 根据关键词过滤
      let filteredTemplates = allTemplates
      if (keyword) {
        filteredTemplates = allTemplates.filter(
          (item) =>
            item.templateName.includes(keyword) ||
            item.id.includes(keyword) ||
            item.templateContent.includes(keyword)
        )
      }

      // 根据模板类型过滤 (templateType: 1=系统内置, 2=自定义模板)
      if (templateType) {
        const typeValue = parseInt(templateType)
        if (typeValue === 1 || typeValue === 2) {
          filteredTemplates = filteredTemplates.filter((item) => item.templateType === typeValue)
        }
      }

      // 分页处理
      const total = filteredTemplates.length
      const start = (page - 1) * size
      const end = start + parseInt(size)
      const records = filteredTemplates.slice(start, end)

      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(size),
          current: parseInt(page),
          pages: Math.ceil(total / size)
        }
      }
    }
  },
  {
    url: '/api/zhpgxt/zhpgObject/lineData',
    method: 'get',
    timeout,
    response: () => {
      // 根据 final.md 中的评估结果列表生成数据
      // 为了让雷达图正常显示，将数据标准化到合理范围（基于权重和相对比例）
      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: {
          // 指标名称列表
          detailNames: [
            '泄漏速率',
            '总泄漏量',
            '泄漏覆盖面积',
            '燃烧面积',
            '人员死亡数量',
            '人员重伤数量',
            '人员轻伤数量',
            '中毒发生率',
            '车辆损毁数量',
            '报警延迟时间',
            '疏散时间',
            '内部救援到位时间',
            '消防力量到位时间',
            '消防车出动数量',
            '消防员出动数量',
            '火灾扑灭时间',
            '泄漏控制时间',
            '疏散人员数量',
            '直接经济损失'
          ],
          // 评估对象列表
          titleList: ['A事件', 'B事件'],
          // 类型：1-折线图
          type: 1,
          // 每个评估对象的数据（来自 final.md 的原始数据）
          zhpgObjectResultList: [
            // 学校A事件的数据
            [0.8, 2.6, 0.5, 0.5, 1, 3, 5, 5, 18, 1, 3, 3, 5, 2, 8, 30, 10, 18, 100],
            // 学校B事件的数据
            [0.7, 2.2, 0.4, 0.3, 1, 2, 6, 4, 13, 2, 5, 5, 6, 2, 8, 25, 8, 15, 60]
          ]
        }
      }
    }
  },

  // ========== 导出报告接口 ==========
  // 导出评估报告
  {
    url: '/api/zhpgxt/zhpgTemplateResult/:templateId/:taskId/:fileType/:resultId/:jobId',
    method: 'get',
    timeout: 2000,
    rawResponse: async (req, res) => {
      try {
        // 读取report.docx文件（与当前文件同级）
        const filePath = path.join(__dirname, 'reports.docx')

        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
          console.error('文件不存在:', filePath)
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, code: 404, msg: '文件不存在' }))
          return
        }

        const fileBuffer = fs.readFileSync(filePath)

        // 设置响应头，触发文件下载
        res.statusCode = 200
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="evaluation_reports.docx"; filename*=UTF-8\'\'%E8%AF%84%E4%BC%B0%E6%8A%A5%E5%91%8A.docx'
        )
        res.setHeader('Content-Length', fileBuffer.length.toString())
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

        // 发送文件
        res.end(fileBuffer)
      } catch (error) {
        console.error('读取文件失败:', error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: false, code: 500, msg: '文件读取失败' }))
      }
    }
  }
]
