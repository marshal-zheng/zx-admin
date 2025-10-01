import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'
import { toAnyString } from '@/utils'

const timeout = 1000
const count = 50

// 评估类型选项 - 使用data.js中的类型
const evaluationTypes = [
  '性能评估',
  '安全评估',
  '准确性评估',
  '功能评估',
  '稳定性评估',
  '可用性评估',
  '容量评估',
  '效率评估',
  '可靠性评估',
  '吞吐量评估',
  '资源评估'
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

// 使用data.js中的具体数据作为基础数据
const baseData = [
  {
    id: 1,
    name: '系统A性能评估',
    type: '性能评估',
    status: 'completed',
    progress: 100,
    score: 95.6,
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '系统B安全性评估',
    type: '安全评估',
    status: 'running',
    progress: 65,
    score: null,
    createTime: '2024-01-14 14:20:00'
  },
  {
    id: 3,
    name: '系统C准确性评估',
    type: '准确性评估',
    status: 'pending',
    progress: 0,
    score: null,
    createTime: '2024-01-13 09:15:00'
  },
  {
    id: 4,
    name: '系统D响应时间评估',
    type: '性能评估',
    status: 'failed',
    progress: 30,
    score: null,
    createTime: '2024-01-12 16:45:00'
  },
  {
    id: 5,
    name: '系统E功能评估',
    type: '功能评估',
    status: 'completed',
    progress: 100,
    score: 88.9,
    createTime: '2024-01-11 11:30:00'
  },
  {
    id: 6,
    name: '网络设备F稳定性评估',
    type: '稳定性评估',
    status: 'completed',
    progress: 100,
    score: 92.3,
    createTime: '2024-01-10 08:45:00'
  },
  {
    id: 7,
    name: '数据库G性能评估',
    type: '性能评估',
    status: 'running',
    progress: 78,
    score: null,
    createTime: '2024-01-09 15:20:00'
  },
  {
    id: 8,
    name: '应用服务H可用性评估',
    type: '可用性评估',
    status: 'completed',
    progress: 100,
    score: 97.8,
    createTime: '2024-01-08 12:10:00'
  },
  {
    id: 9,
    name: '存储系统I容量评估',
    type: '容量评估',
    status: 'pending',
    progress: 0,
    score: null,
    createTime: '2024-01-07 09:30:00'
  },
  {
    id: 10,
    name: '负载均衡J效率评估',
    type: '效率评估',
    status: 'running',
    progress: 45,
    score: null,
    createTime: '2024-01-06 14:15:00'
  },
  {
    id: 11,
    name: '防火墙K安全性评估',
    type: '安全评估',
    status: 'completed',
    progress: 100,
    score: 89.5,
    createTime: '2024-01-05 10:20:00'
  },
  {
    id: 12,
    name: '监控系统L准确性评估',
    type: '准确性评估',
    status: 'failed',
    progress: 25,
    score: null,
    createTime: '2024-01-04 16:40:00'
  },
  {
    id: 13,
    name: '备份系统M可靠性评估',
    type: '可靠性评估',
    status: 'completed',
    progress: 100,
    score: 94.2,
    createTime: '2024-01-03 11:55:00'
  },
  {
    id: 14,
    name: '缓存系统N性能评估',
    type: '性能评估',
    status: 'running',
    progress: 82,
    score: null,
    createTime: '2024-01-02 13:25:00'
  },
  {
    id: 15,
    name: '消息队列O吞吐量评估',
    type: '吞吐量评估',
    status: 'pending',
    progress: 0,
    score: null,
    createTime: '2024-01-01 09:00:00'
  },
  {
    id: 16,
    name: '搜索引擎P响应时间评估',
    type: '性能评估',
    status: 'completed',
    progress: 100,
    score: 91.7,
    createTime: '2023-12-31 15:30:00'
  },
  {
    id: 17,
    name: '日志系统Q存储效率评估',
    type: '效率评估',
    status: 'running',
    progress: 60,
    score: null,
    createTime: '2023-12-30 10:45:00'
  },
  {
    id: 18,
    name: '认证系统R安全性评估',
    type: '安全评估',
    status: 'completed',
    progress: 100,
    score: 96.1,
    createTime: '2023-12-29 14:20:00'
  },
  {
    id: 19,
    name: '配置中心S可用性评估',
    type: '可用性评估',
    status: 'failed',
    progress: 15,
    score: null,
    createTime: '2023-12-28 08:30:00'
  },
  {
    id: 20,
    name: '服务网关T性能评估',
    type: '性能评估',
    status: 'running',
    progress: 55,
    score: null,
    createTime: '2023-12-27 12:15:00'
  },
  {
    id: 21,
    name: '容器平台U资源利用率评估',
    type: '资源评估',
    status: 'completed',
    progress: 100,
    score: 93.4,
    createTime: '2023-12-26 16:50:00'
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
    name: '系统性能评估模版',
    type: 'performance',
    scenario: 'system',
    status: 'active',
    description: '用于系统性能评估的标准模版',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '安全评估模版',
    type: 'comprehensive',
    scenario: 'system',
    status: 'active',
    description: '综合安全评估模版',
    createTime: '2024-01-14 14:20:00'
  },
  {
    id: 3,
    name: '项目质量评估模版',
    type: 'quality',
    scenario: 'project',
    status: 'draft',
    description: '项目质量评估专用模版',
    createTime: '2024-01-13 09:15:00'
  },
  {
    id: 4,
    name: '人员绩效评估模版',
    type: 'performance',
    scenario: 'personnel',
    status: 'active',
    description: '员工绩效评估标准模版',
    createTime: '2024-01-12 16:45:00'
  },
  {
    id: 5,
    name: '风险评估模版',
    type: 'risk',
    scenario: 'project',
    status: 'inactive',
    description: '项目风险评估模版',
    createTime: '2024-01-11 11:30:00'
  },
  {
    id: 6,
    name: '流程评估模版',
    type: 'comprehensive',
    scenario: 'process',
    status: 'active',
    description: '业务流程评估模版',
    createTime: '2024-01-10 08:45:00'
  },
  {
    id: 7,
    name: '系统稳定性评估模版',
    type: 'performance',
    scenario: 'system',
    status: 'active',
    description: '系统稳定性专项评估模版',
    createTime: '2024-01-09 15:20:00'
  },
  {
    id: 8,
    name: '数据质量评估模版',
    type: 'quality',
    scenario: 'system',
    status: 'draft',
    description: '数据质量评估标准模版',
    createTime: '2024-01-08 12:10:00'
  },
  {
    id: 9,
    name: '容量规划评估模版',
    type: 'performance',
    scenario: 'system',
    status: 'active',
    description: '系统容量规划评估模版',
    createTime: '2024-01-07 09:30:00'
  },
  {
    id: 10,
    name: '合规性评估模版',
    type: 'comprehensive',
    scenario: 'project',
    status: 'archived',
    description: '合规性检查评估模版',
    createTime: '2024-01-06 14:15:00'
  }
]

let templateList: TemplateItem[] = [...templateBaseData]

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

      let filteredList = [...evaluationList]

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
        code: '200',
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
        createTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
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
        code: '200',
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
    response: ({ query }) => {
      const { id } = query
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
        createTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
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
    response: ({ query, body }) => {
      const { id } = query
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
  }
]
