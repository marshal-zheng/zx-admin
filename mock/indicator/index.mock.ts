// 指标体系相关 mock 接口
// 导出为数组，便于在 index.js 中统一聚合
import { SUCCESS_CODE } from '@/constants'

export default [
  // ========== 分类管理接口 ==========
  // 获取分类列表
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟分类数据
      const allCategories = [
        {
          id: '1',
          clazzName: '综合评估分类',
          clazzDescr: '用于综合性评估的指标分类，涵盖多个维度的评估指标',
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          clazzName: '性能评估分类',
          clazzDescr: '专注于系统性能评估的指标分类，包括响应时间、吞吐量等',
          createTime: '2024-01-16 14:20:00'
        },
        {
          id: '3',
          clazzName: '安全评估分类',
          clazzDescr: '安全相关的评估指标分类，涵盖安全漏洞、威胁检测等',
          createTime: '2024-01-17 09:15:00'
        },
        {
          id: '4',
          clazzName: '质量评估分类',
          clazzDescr: '软件质量评估相关的指标分类，包括代码质量、测试覆盖率等',
          createTime: '2024-01-18 16:45:00'
        },
        {
          id: '5',
          clazzName: '用户体验分类',
          clazzDescr: '用户体验相关的评估指标分类，关注用户满意度和操作便捷性',
          createTime: '2024-01-19 11:30:00'
        }
      ]

      // 根据关键词过滤
      let filteredCategories = allCategories
      if (keyword) {
        filteredCategories = allCategories.filter(
          (item) => item.clazzName.includes(keyword) || item.clazzDescr.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredCategories.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredCategories.slice(start, end)

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

  // 创建分类
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz',
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

  // 更新分类
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz/:id',
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

  // 删除分类
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功'
      }
    }
  },

  // 获取单个分类详情
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz/:id',
    method: 'get',
    response: ({ params }) => {
      const mockCategory = {
        id: params.id,
        clazzName: '综合评估分类',
        clazzDescr: '用于综合性评估的指标分类，涵盖多个维度的评估指标',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 14:20:00'
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: mockCategory
      }
    }
  },

  // ========== 模版管理接口 ==========
  // 获取模版列表
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟模版数据
      const allTemplates = [
        {
          evaluaId: '1',
          evaluaName: '综合评估模版',
          evaluaExpplain: '用于综合性评估的指标体系模版，涵盖多个维度的评估指标',
          clazzId: '1',
          clazzName: '综合评估分类',
          createTime: '2024-01-15 10:30:00'
        },
        {
          evaluaId: '2',
          evaluaName: '性能评估模版',
          evaluaExpplain: '专注于系统性能评估的指标体系模版，包括响应时间、吞吐量等',
          clazzId: '2',
          clazzName: '性能评估分类',
          createTime: '2024-01-16 14:20:00'
        },
        {
          evaluaId: '3',
          evaluaName: '安全评估模版',
          evaluaExpplain: '安全相关的评估指标体系模版，涵盖安全漏洞、威胁检测等',
          clazzId: '3',
          clazzName: '安全评估分类',
          createTime: '2024-01-17 09:15:00'
        },
        {
          evaluaId: '4',
          evaluaName: '质量评估模版',
          evaluaExpplain: '软件质量评估相关的指标体系模版，包括代码质量、测试覆盖率等',
          clazzId: '4',
          clazzName: '质量评估分类',
          createTime: '2024-01-18 16:45:00'
        },
        {
          evaluaId: '5',
          evaluaName: '用户体验模版',
          evaluaExpplain: '用户体验相关的评估指标体系模版，关注用户满意度和操作便捷性',
          clazzId: '5',
          clazzName: '用户体验分类',
          createTime: '2024-01-19 11:30:00'
        }
      ]

      // 根据关键词过滤
      let filteredTemplates = allTemplates
      if (keyword) {
        filteredTemplates = allTemplates.filter(
          (item) => item.evaluaName.includes(keyword) || item.evaluaExpplain.includes(keyword)
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

  // 创建模版
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate',
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

  // 更新模版
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate/:id',
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

  // 删除模版
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取模版详情
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate/:id',
    method: 'get',
    response: ({ params }) => {
      const { id } = params

      // 模拟模版详情数据
      const templateDetail = {
        evaluaId: id,
        evaluaName: '综合评估模版',
        evaluaExpplain: '用于综合性评估的指标体系模版，涵盖多个维度的评估指标',
        clazzId: '1',
        clazzName: '综合评估分类',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-20 14:20:00'
      }

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: templateDetail
      }
    }
  },

  // ========== 体系管理接口 ==========
  // 获取体系列表
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '', categoryId = '' } = query

      // 模拟体系数据
      const allSystems = [
        {
          id: '1',
          categoryId: '1',
          categoryName: '综合评估分类',
          name: '综合效能评估体系',
          description: '涵盖系统性能、可靠性、安全性等多维度的综合评估体系',
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          categoryId: '2',
          categoryName: '性能评估分类',
          name: '系统性能评估体系',
          description: '专注于系统响应时间、吞吐量、资源利用率等性能指标的评估体系',
          createTime: '2024-01-16 14:20:00'
        },
        {
          id: '3',
          categoryId: '3',
          categoryName: '安全评估分类',
          name: '安全风险评估体系',
          description: '针对安全漏洞、威胁检测、防护能力等安全相关指标的评估体系',
          createTime: '2024-01-17 09:15:00'
        },
        {
          id: '4',
          categoryId: '4',
          categoryName: '质量评估分类',
          name: '软件质量评估体系',
          description: '评估软件质量、代码质量、测试覆盖率等质量相关指标的体系',
          createTime: '2024-01-18 16:45:00'
        },
        {
          id: '5',
          categoryId: '5',
          categoryName: '用户体验分类',
          name: '用户体验评估体系',
          description: '关注用户满意度、界面友好性、操作便捷性等用户体验指标的评估体系',
          createTime: '2024-01-19 11:30:00'
        }
      ]

      // 根据分类过滤
      let filteredSystems = allSystems
      if (categoryId) {
        filteredSystems = filteredSystems.filter((item) => item.categoryId === categoryId)
      }

      // 根据关键词过滤
      if (keyword) {
        filteredSystems = filteredSystems.filter(
          (item) => item.name.includes(keyword) || item.description.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredSystems.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredSystems.slice(start, end)

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

  // 创建体系
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem',
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

  // 更新体系
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem/:id',
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

  // 删除体系
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取指标体系设计选项
  {
    url: '/api/indicator/system/options',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            label: '综合效能评估指标体系',
            value: 'comprehensive_performance_indicators',
            description: '涵盖系统性能、可靠性、安全性等多维度指标',
            indicatorCount: 25
          },
          {
            label: '安全风险评估指标体系',
            value: 'security_risk_indicators',
            description: '专注于安全漏洞、威胁检测、防护能力评估',
            indicatorCount: 18
          },
          {
            label: '性能效率评估指标体系',
            value: 'performance_efficiency_indicators',
            description: '重点评估系统响应时间、吞吐量、资源利用率',
            indicatorCount: 15
          },
          {
            label: '质量保证评估指标体系',
            value: 'quality_assurance_indicators',
            description: '评估软件质量、代码质量、测试覆盖率等',
            indicatorCount: 22
          },
          {
            label: '用户体验评估指标体系',
            value: 'user_experience_indicators',
            description: '关注用户满意度、界面友好性、操作便捷性',
            indicatorCount: 12
          },
          {
            label: '成本效益评估指标体系',
            value: 'cost_benefit_indicators',
            description: '分析投入产出比、运维成本、ROI等经济指标',
            indicatorCount: 10
          },
          {
            label: '可维护性评估指标体系',
            value: 'maintainability_indicators',
            description: '评估代码可读性、模块化程度、文档完整性',
            indicatorCount: 16
          },
          {
            label: '可扩展性评估指标体系',
            value: 'scalability_indicators',
            description: '评估系统扩展能力、负载承受能力、架构弹性',
            indicatorCount: 14
          }
        ]
      }
    }
  },

  // 根据ID获取指标体系详情
  {
    url: '/api/indicator/system/:id',
    method: 'get',
    response: ({ params }) => {
      const id = params?.id
      const systemDetails = {
        comprehensive_performance_indicators: {
          id: 'comprehensive_performance_indicators',
          name: '综合效能评估指标体系',
          description: '涵盖系统性能、可靠性、安全性等多维度指标',
          version: '2.1.0',
          createTime: '2024-01-10 09:30:00',
          updateTime: '2024-01-15 14:20:00',
          status: 'active',
          categories: [
            {
              name: '性能指标',
              indicators: ['响应时间', '吞吐量', 'CPU利用率', '内存使用率', '磁盘I/O']
            },
            {
              name: '可靠性指标',
              indicators: ['可用性', '故障恢复时间', '平均故障间隔时间', '数据完整性']
            },
            {
              name: '安全性指标',
              indicators: ['访问控制', '数据加密', '审计日志', '漏洞扫描结果']
            }
          ]
        },
        security_risk_indicators: {
          id: 'security_risk_indicators',
          name: '安全风险评估指标体系',
          description: '专注于安全漏洞、威胁检测、防护能力评估',
          version: '1.8.0',
          createTime: '2024-01-08 11:15:00',
          updateTime: '2024-01-12 16:45:00',
          status: 'active',
          categories: [
            {
              name: '威胁检测',
              indicators: ['恶意代码检测率', '异常行为识别', '入侵检测准确率']
            },
            {
              name: '防护能力',
              indicators: ['防火墙有效性', '访问控制强度', '数据加密级别']
            }
          ]
        }
      }

      const systemDetail =
        systemDetails[id] || systemDetails['comprehensive_performance_indicators']

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: systemDetail
      }
    }
  },

  // 获取指标体系列表
  {
    url: '/api/indicator/system/list',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page || query.pageNumber || query.current) || 1
      const size = parseInt(query.size || query.pageSize || query.limit) || 10

      const mockData = [
        {
          id: 'comprehensive_performance_indicators',
          name: '综合效能评估指标体系',
          description: '涵盖系统性能、可靠性、安全性等多维度指标',
          version: '2.1.0',
          status: 'active',
          indicatorCount: 25,
          createTime: '2024-01-10 09:30:00',
          updateTime: '2024-01-15 14:20:00'
        },
        {
          id: 'security_risk_indicators',
          name: '安全风险评估指标体系',
          description: '专注于安全漏洞、威胁检测、防护能力评估',
          version: '1.8.0',
          status: 'active',
          indicatorCount: 18,
          createTime: '2024-01-08 11:15:00',
          updateTime: '2024-01-12 16:45:00'
        },
        {
          id: 'performance_efficiency_indicators',
          name: '性能效率评估指标体系',
          description: '重点评估系统响应时间、吞吐量、资源利用率',
          version: '1.5.2',
          status: 'active',
          indicatorCount: 15,
          createTime: '2024-01-05 14:20:00',
          updateTime: '2024-01-10 10:30:00'
        },
        {
          id: 'quality_assurance_indicators',
          name: '质量保证评估指标体系',
          description: '评估软件质量、代码质量、测试覆盖率等',
          version: '2.0.1',
          status: 'draft',
          indicatorCount: 22,
          createTime: '2024-01-03 16:45:00',
          updateTime: '2024-01-08 09:15:00'
        },
        {
          id: 'user_experience_indicators',
          name: '用户体验评估指标体系',
          description: '关注用户满意度、界面友好性、操作便捷性',
          version: '1.3.0',
          status: 'active',
          indicatorCount: 12,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-05 15:30:00'
        }
      ]

      const total = mockData.length
      const start = (page - 1) * size
      const end = start + size
      const records = mockData.slice(start, end)
      const pages = Math.ceil(total / size)

      return {
        success: true,
        code: '200',
        msg: 'SUCCESS',
        data: {
          current: page,
          pages,
          records,
          size,
          total
        }
      }
    }
  },

  // 获取计算模型列表
  {
    url: '/api/indicator/calculation-model/list',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page || query.pageNumber || query.current) || 1
      const size = parseInt(query.size || query.pageSize || query.limit) || 10

      const mockData = [
        {
          id: 'weighted_sum_model',
          name: '加权求和模型',
          description: '基于权重的线性加权计算模型',
          type: 'linear',
          complexity: 'low',
          accuracy: 85,
          createTime: '2024-01-10 09:30:00'
        },
        {
          id: 'fuzzy_comprehensive_model',
          name: '模糊综合评价模型',
          description: '处理不确定性和模糊信息的评价模型',
          type: 'fuzzy',
          complexity: 'medium',
          accuracy: 92,
          createTime: '2024-01-08 14:20:00'
        },
        {
          id: 'neural_network_model',
          name: '神经网络评价模型',
          description: '基于机器学习的智能评价模型',
          type: 'ml',
          complexity: 'high',
          accuracy: 96,
          createTime: '2024-01-05 11:15:00'
        }
      ]

      const total = mockData.length
      const start = (page - 1) * size
      const end = start + size
      const records = mockData.slice(start, end)
      const pages = Math.ceil(total / size)

      return {
        success: true,
        code: '200',
        msg: 'SUCCESS',
        data: {
          current: page,
          pages,
          records,
          size,
          total
        }
      }
    }
  },

  // 获取指标体系结构数据（用于DAG画布）
  {
    url: '/api/indicator/system/:id/structure',
    method: 'get',
    response: ({ params }) => {
      const id = params?.id

      // 模拟DAG结构数据
      const structureData = {
        nodes: [
          {
            id: 'root',
            label: '综合评估',
            type: 'root',
            level: 0,
            weight: 1.0,
            position: { x: 400, y: 50 }
          },
          {
            id: 'performance',
            label: '性能指标',
            type: 'category',
            level: 1,
            weight: 0.4,
            position: { x: 200, y: 150 }
          },
          {
            id: 'reliability',
            label: '可靠性指标',
            type: 'category',
            level: 1,
            weight: 0.3,
            position: { x: 400, y: 150 }
          },
          {
            id: 'security',
            label: '安全性指标',
            type: 'category',
            level: 1,
            weight: 0.3,
            position: { x: 600, y: 150 }
          },
          {
            id: 'response_time',
            label: '响应时间',
            type: 'indicator',
            level: 2,
            weight: 0.5,
            unit: 'ms',
            position: { x: 100, y: 250 }
          },
          {
            id: 'throughput',
            label: '吞吐量',
            type: 'indicator',
            level: 2,
            weight: 0.5,
            unit: 'req/s',
            position: { x: 300, y: 250 }
          }
        ],
        edges: [
          { source: 'root', target: 'performance' },
          { source: 'root', target: 'reliability' },
          { source: 'root', target: 'security' },
          { source: 'performance', target: 'response_time' },
          { source: 'performance', target: 'throughput' }
        ]
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: structureData
      }
    }
  },

  // 获取评估算法列表
  {
    url: '/api/indicator/algorithm/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            id: 'weighted_sum',
            name: '加权求和算法',
            description: '基于权重的线性加权计算,适用于大多数评估场景',
            category: '经典算法',
            complexity: 'low',
            accuracy: 85,
            createTime: '2024-01-10 09:30:00'
          },
          {
            id: 'fuzzy_comprehensive',
            name: '模糊综合评价算法',
            description: '处理不确定性和模糊信息的评价方法',
            category: '模糊算法',
            complexity: 'medium',
            accuracy: 92,
            createTime: '2024-01-08 14:20:00'
          },
          {
            id: 'neural_network',
            name: '神经网络评价算法',
            description: '基于机器学习的智能评价算法,可以自动学习复杂的评价模式',
            category: 'AI算法',
            complexity: 'high',
            accuracy: 96,
            createTime: '2024-01-05 11:15:00'
          },
          {
            id: 'ahp',
            name: '层次分析法(AHP)',
            description: '通过两两比较确定权重的系统化方法,适合专家评估',
            category: '经典算法',
            complexity: 'medium',
            accuracy: 88,
            createTime: '2024-01-03 16:45:00'
          },
          {
            id: 'topsis',
            name: 'TOPSIS法',
            description: '基于理想解的评价方法,适用于多目标决策',
            category: '经典算法',
            complexity: 'low',
            accuracy: 83,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 'grey_relational',
            name: '灰色关联分析',
            description: '处理小样本不确定性的评价方法',
            category: '灰色系统',
            complexity: 'medium',
            accuracy: 87,
            createTime: '2023-12-28 13:20:00'
          }
        ]
      }
    }
  },

  // 获取评估任务模板列表
  {
    url: '/api/indicator/task-template/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            id: 'template1',
            name: '综合评估模板',
            description: '适用于全面的系统评估',
            algorithm: 'weighted_sum',
            metricSystemId: 'comprehensive_performance_indicators',
            createTime: '2024-01-10 09:30:00'
          },
          {
            id: 'template2',
            name: '性能评估模板',
            description: '专注于系统性能指标的评估',
            algorithm: 'fuzzy_comprehensive',
            metricSystemId: 'performance_efficiency_indicators',
            createTime: '2024-01-08 14:20:00'
          },
          {
            id: 'template3',
            name: '安全评估模板',
            description: '针对安全风险的专项评估',
            algorithm: 'ahp',
            metricSystemId: 'security_risk_indicators',
            createTime: '2024-01-05 11:15:00'
          }
        ]
      }
    }
  },

  // 获取仪表板模板列表
  {
    url: '/api/indicator/dashboard-template/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            id: 'dashboard1',
            name: '标准仪表板',
            description: '包含常用的图表和指标展示',
            preview: '',
            createTime: '2024-01-10 09:30:00'
          },
          {
            id: 'dashboard2',
            name: '高级仪表板',
            description: '包含更多高级图表和交互功能',
            preview: '',
            createTime: '2024-01-08 14:20:00'
          },
          {
            id: 'dashboard3',
            name: '简洁仪表板',
            description: '简洁的设计,突出核心指标',
            preview: '',
            createTime: '2024-01-05 11:15:00'
          }
        ]
      }
    }
  }
]
