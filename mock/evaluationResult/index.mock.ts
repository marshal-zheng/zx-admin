// 评估结果相关 mock 接口
// 导出为数组，便于在 index.js 中统一聚合
import { SUCCESS_CODE } from '@/constants'

export default [
  // ========== 评估任务管理接口 ==========
  // 获取评估任务列表
  {
    url: '/api/zhpgxt/zhpgEvaluaTask',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟评估任务数据
      const allTasks = [
        {
          id: '1',
          object: '软件系统A',
          process: '标准流程',
          purpose: '性能评估',
          scheme: '综合评估方案',
          taskDescribe: '对软件系统A进行全面的性能评估，包括响应时间、吞吐量等关键指标',
          taskTemplate: 0,
          taskType: 1,
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          object: '移动应用B',
          process: '快速流程',
          purpose: '安全评估',
          scheme: '安全专项评估方案',
          taskDescribe: '针对移动应用B的安全性进行专项评估，识别潜在的安全风险',
          taskTemplate: 1,
          taskType: 0,
          createTime: '2024-01-16 14:20:00'
        },
        {
          id: '3',
          object: '数据平台C',
          process: '专家流程',
          purpose: '功能评估',
          scheme: '功能完整性评估方案',
          taskDescribe: '评估数据平台C的功能完整性和可用性，确保满足业务需求',
          taskTemplate: 0,
          taskType: 2,
          createTime: '2024-01-17 09:15:00'
        },
        {
          id: '4',
          object: '云服务D',
          process: '标准流程',
          purpose: '可靠性评估',
          scheme: '可靠性专项评估方案',
          taskDescribe: '对云服务D的可靠性进行评估，包括可用性、故障恢复等指标',
          taskTemplate: 1,
          taskType: 1,
          createTime: '2024-01-18 16:45:00'
        },
        {
          id: '5',
          object: '企业门户E',
          process: '简化流程',
          purpose: '用户体验评估',
          scheme: '用户体验评估方案',
          taskDescribe: '评估企业门户E的用户体验，包括界面友好性、操作便捷性等',
          taskTemplate: 0,
          taskType: 0,
          createTime: '2024-01-19 11:30:00'
        }
      ]

      // 根据关键词过滤
      let filteredTasks = allTasks
      if (keyword) {
        filteredTasks = allTasks.filter(
          (item) => item.object.includes(keyword) || 
                   item.purpose.includes(keyword) || 
                   item.taskDescribe.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredTasks.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredTasks.slice(start, end)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages: Math.ceil(total / pageSize)
        }
      }
    }
  },

  // 创建评估任务
  {
    url: '/api/zhpgxt/zhpgEvaluaTask',
    method: 'post',
    response: ({ body }) => {
      return {
        code: SUCCESS_CODE,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 更新评估任务
  {
    url: '/api/zhpgxt/zhpgEvaluaTask/:id',
    method: 'put',
    response: ({ params, body }) => {
      return {
        code: SUCCESS_CODE,
        message: '更新成功',
        data: {
          id: params.id,
          ...body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除评估任务
  {
    url: '/api/zhpgxt/zhpgEvaluaTask/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取评估任务详情
  {
    url: '/api/zhpgxt/zhpgEvaluaTask/:id',
    method: 'get',
    response: ({ params }) => {
      const mockTask = {
        id: params.id,
        object: '软件系统A',
        process: '标准流程',
        purpose: '性能评估',
        scheme: '综合评估方案',
        taskDescribe: '对软件系统A进行全面的性能评估，包括响应时间、吞吐量等关键指标',
        taskTemplate: 0,
        taskType: 1,
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 14:20:00'
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: mockTask
      }
    }
  },

  // ========== 报告模板管理接口 ==========
  // 获取报告模板列表
  {
    url: '/api/zhpgxt/zhpgTemplateResult',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟报告模板数据
      const allTemplates = [
        {
          id: '1',
          templateName: '标准评估报告模板',
          templateType: 1,
          templateContent: '包含评估目标、方法、结果和建议的标准格式报告模板，适用于大多数评估场景',
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          templateName: '详细技术评估模板',
          templateType: 2,
          templateContent: '详细的技术评估报告模板，包含技术架构分析、性能测试结果、代码质量评估等详细内容',
          createTime: '2024-01-16 14:20:00'
        },
        {
          id: '3',
          templateName: '高管汇报模板',
          templateType: 3,
          templateContent: '面向高管的简洁汇报模板，突出关键指标和决策建议，适合管理层快速了解评估结果',
          createTime: '2024-01-17 09:15:00'
        },
        {
          id: '4',
          templateName: '安全评估专项模板',
          templateType: 2,
          templateContent: '专门用于安全评估的报告模板，包含漏洞分析、风险评级、安全建议等专业内容',
          createTime: '2024-01-18 16:45:00'
        },
        {
          id: '5',
          templateName: '用户体验评估模板',
          templateType: 1,
          templateContent: '用户体验评估专用模板，包含用户满意度调查、界面分析、交互优化建议等',
          createTime: '2024-01-19 11:30:00'
        },
        {
          id: '6',
          templateName: '性能测试报告模板',
          templateType: 2,
          templateContent: '性能测试结果报告模板，包含负载测试、压力测试、性能瓶颈分析等详细数据',
          createTime: '2024-01-20 08:45:00'
        }
      ]

      // 根据关键词过滤
      let filteredTemplates = allTemplates
      if (keyword) {
        filteredTemplates = allTemplates.filter(
          (item) => item.templateName.includes(keyword) || item.templateContent.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredTemplates.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredTemplates.slice(start, end)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages: Math.ceil(total / pageSize)
        }
      }
    }
  },

  // 创建报告模板
  {
    url: '/api/zhpgxt/zhpgTemplateResult',
    method: 'post',
    response: ({ body }) => {
      return {
        code: SUCCESS_CODE,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 更新报告模板
  {
    url: '/api/zhpgxt/zhpgTemplateResult/:id',
    method: 'put',
    response: ({ params, body }) => {
      return {
        code: SUCCESS_CODE,
        message: '更新成功',
        data: {
          id: params.id,
          ...body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除报告模板
  {
    url: '/api/zhpgxt/zhpgTemplateResult/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取报告模板详情
  {
    url: '/api/zhpgxt/zhpgTemplateResult/:id',
    method: 'get',
    response: ({ params }) => {
      const mockTemplate = {
        id: params.id,
        templateName: '标准评估报告模板',
        templateType: 1,
        templateContent: '包含评估目标、方法、结果和建议的标准格式报告模板，适用于大多数评估场景',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 14:20:00'
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: mockTemplate
      }
    }
  }
]