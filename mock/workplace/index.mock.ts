import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

export default [
  // 获取工作台统计
  {
    url: '/mock/workplace/total',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          evaluations: 89, // 评估项目数
          alerts: 12, // 待处理预警
          reports: 25 // 待审核报告
        }
      }
    }
  },
  // 获取评估项目
  {
    url: '/mock/workplace/project',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          {
            name: '华北石化油料库火灾评估',
            icon: 'mdi:fire-alert',
            message: '泄漏面积2500㎡，火灾持续45分钟',
            personal: '张安全',
            time: new Date('2024-01-15'),
            status: '进行中',
            priority: 'high'
          },
          {
            name: '华东储备库应急响应评估',
            icon: 'mdi:shield-alert',
            message: '应急响应时间15分钟，疏散效率良好',
            personal: '李应急',
            time: new Date('2024-01-14'),
            status: '已完成',
            priority: 'medium'
          },
          {
            name: '华南油库泄漏扩散评估',
            icon: 'mdi:chemical-weapon',
            message: '泄漏速率0.8kg/s，扩散范围500m',
            personal: '王评估',
            time: new Date('2024-01-13'),
            status: '待审核',
            priority: 'high'
          },
          {
            name: '西北储油基地风险评估',
            icon: 'mdi:alert-circle',
            message: '综合风险等级中等，需加强监控',
            personal: '赵风险',
            time: new Date('2024-01-12'),
            status: '进行中',
            priority: 'medium'
          },
          {
            name: '华中油料库消防评估',
            icon: 'mdi:fire-truck',
            message: '消防设施完备，响应时间8分钟',
            personal: '陈消防',
            time: new Date('2024-01-11'),
            status: '已完成',
            priority: 'low'
          },
          {
            name: '东北储备库环境影响评估',
            icon: 'mdi:earth',
            message: '环境污染风险较低，防护措施到位',
            personal: '刘环保',
            time: new Date('2024-01-10'),
            status: '待审核',
            priority: 'medium'
          }
        ]
      }
    }
  },
  // 获取系统动态
  {
    url: '/mock/workplace/dynamic',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          {
            keys: ['系统提醒', '华北石化油料库火灾评估报告已生成'],
            time: new Date('2024-01-15 14:30:00'),
            type: 'success'
          },
          {
            keys: ['预警通知', '华东储备库温度异常，建议立即检查'],
            time: new Date('2024-01-15 13:45:00'),
            type: 'warning'
          },
          {
            keys: ['评估完成', '华南油库泄漏扩散评估已完成审核'],
            time: new Date('2024-01-15 12:20:00'),
            type: 'info'
          },
          {
            keys: ['系统更新', '评估算法模型已更新至v2.1版本'],
            time: new Date('2024-01-15 10:15:00'),
            type: 'info'
          },
          {
            keys: ['紧急通知', '西北储油基地发生轻微泄漏，已启动应急预案'],
            time: new Date('2024-01-15 09:30:00'),
            type: 'error'
          },
          {
            keys: ['数据同步', '全国油料库基础数据同步完成'],
            time: new Date('2024-01-15 08:00:00'),
            type: 'success'
          }
        ]
      }
    }
  },
  // 获取评估团队信息
  {
    url: '/mock/workplace/team',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          {
            name: '安全评估组',
            icon: 'mdi:shield-check',
            members: 8,
            description: '负责油料库安全风险评估'
          },
          {
            name: '应急响应组',
            icon: 'mdi:ambulance',
            members: 12,
            description: '负责应急响应效能评估'
          },
          {
            name: '环境影响组',
            icon: 'mdi:leaf',
            members: 6,
            description: '负责环境影响评估分析'
          },
          {
            name: '技术支持组',
            icon: 'mdi:tools',
            members: 10,
            description: '负责系统技术支持维护'
          },
          {
            name: '数据分析组',
            icon: 'mdi:chart-line',
            members: 7,
            description: '负责评估数据分析处理'
          },
          {
            name: '质量控制组',
            icon: 'mdi:quality-high',
            members: 5,
            description: '负责评估质量控制审核'
          }
        ]
      }
    }
  },
  // 获取评估能力指数
  {
    url: '/mock/workplace/radar',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { name: '评估准确性', max: 100, personal: 85, team: 88 },
          { name: '响应速度', max: 100, personal: 78, team: 82 },
          { name: '数据完整性', max: 100, personal: 92, team: 90 },
          { name: '风险识别', max: 100, personal: 88, team: 85 },
          { name: '报告质量', max: 100, personal: 90, team: 87 }
        ]
      }
    }
  }
]
