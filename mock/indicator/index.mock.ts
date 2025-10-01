// 指标体系相关 mock 接口
// 导出为数组，便于在 index.js 中统一聚合

export default [
  // 获取指标体系设计选项
  {
    url: '/api/indicator/system/options',
    method: 'get',
    response: () => {
      return {
        code: 200,
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
        code: 200,
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
        code: 200,
        message: '获取成功',
        data: structureData
      }
    }
  }
]
