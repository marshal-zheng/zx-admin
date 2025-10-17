import { SUCCESS_CODE } from '@/constants'
import { MockMethod } from 'vite-plugin-mock'

const timeout = 1000

export default [
  // 油料库火灾事故统计总览
  {
    url: '/mock/analysis/total',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          totalAccidents: 156, // 总事故数量
          totalEvaluations: 89, // 总评估数量
          avgEconomicLoss: 285.6, // 平均经济损失(万元)
          avgResponseTime: 15.8 // 平均应急响应时间(分钟)
        }
      }
    }
  },
  // 事故类型分布
  {
    url: '/mock/analysis/accidentTypeDistribution',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 45, name: '泄漏事故' },
          { value: 32, name: '火灾事故' },
          { value: 18, name: '爆炸事故' },
          { value: 12, name: '中毒事故' },
          { value: 8, name: '其他事故' }
        ]
      }
    }
  },
  // 每月事故发生趋势
  {
    url: '/mock/analysis/monthlyAccidentTrend',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 8, name: '1月' },
          { value: 6, name: '2月' },
          { value: 12, name: '3月' },
          { value: 15, name: '4月' },
          { value: 18, name: '5月' },
          { value: 22, name: '6月' },
          { value: 25, name: '7月' },
          { value: 19, name: '8月' },
          { value: 16, name: '9月' },
          { value: 13, name: '10月' },
          { value: 10, name: '11月' },
          { value: 7, name: '12月' }
        ]
      }
    }
  },
  // 评估指标对比分析
  {
    url: '/mock/analysis/indicatorComparison',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { 
            category: '泄漏与扩散', 
            baseline: 75, 
            current: 82, 
            target: 85,
            indicators: ['泄漏速率', '总泄漏量', '泄漏覆盖面积', '燃烧面积']
          },
          { 
            category: '危害影响', 
            baseline: 68, 
            current: 74, 
            target: 80,
            indicators: ['人员死亡数量', '人员重伤数量', '人员轻伤数量', '中毒发生率', '车辆损毁数量']
          },
          { 
            category: '应急响应效能', 
            baseline: 72, 
            current: 85, 
            target: 90,
            indicators: ['报警延迟时间', '疏散时间', '内部救援到位时间', '消防力量到位时间']
          },
          { 
            category: '处置效果与损失', 
            baseline: 70, 
            current: 78, 
            target: 85,
            indicators: ['火灾扑灭时间', '泄漏控制时间', '疏散人员数量', '直接经济损失']
          }
        ]
      }
    }
  },
  // 地区事故分布
  {
    url: '/mock/analysis/regionalDistribution',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { region: '华北地区', accidents: 28, evaluations: 15, avgScore: 82.5 },
          { region: '华东地区', accidents: 35, evaluations: 22, avgScore: 78.9 },
          { region: '华南地区', accidents: 22, evaluations: 12, avgScore: 85.2 },
          { region: '华中地区', accidents: 19, evaluations: 11, avgScore: 79.6 },
          { region: '西北地区', accidents: 16, evaluations: 9, avgScore: 76.3 },
          { region: '西南地区', accidents: 21, evaluations: 13, avgScore: 81.7 },
          { region: '东北地区', accidents: 15, evaluations: 7, avgScore: 83.4 }
        ]
      }
    }
  },
  // 应急响应时间趋势
  {
    url: '/mock/analysis/responseTimeTrend',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { month: '1月', alarmDelay: 4.2, evacuationTime: 16.8, rescueTime: 22.5 },
          { month: '2月', alarmDelay: 3.8, evacuationTime: 15.2, rescueTime: 21.3 },
          { month: '3月', alarmDelay: 3.5, evacuationTime: 14.6, rescueTime: 20.1 },
          { month: '4月', alarmDelay: 3.2, evacuationTime: 13.9, rescueTime: 19.4 },
          { month: '5月', alarmDelay: 2.9, evacuationTime: 13.1, rescueTime: 18.7 },
          { month: '6月', alarmDelay: 2.6, evacuationTime: 12.4, rescueTime: 17.9 },
          { month: '7月', alarmDelay: 2.4, evacuationTime: 11.8, rescueTime: 17.2 },
          { month: '8月', alarmDelay: 2.2, evacuationTime: 11.2, rescueTime: 16.5 },
          { month: '9月', alarmDelay: 2.1, evacuationTime: 10.8, rescueTime: 15.9 },
          { month: '10月', alarmDelay: 2.0, evacuationTime: 10.5, rescueTime: 15.4 },
          { month: '11月', alarmDelay: 1.9, evacuationTime: 10.2, rescueTime: 15.0 },
          { month: '12月', alarmDelay: 1.8, evacuationTime: 9.8, rescueTime: 14.6 }
        ]
      }
    }
  },
  // 经济损失分析
  {
    url: '/mock/analysis/economicLossAnalysis',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          totalLoss: 4567.8, // 总损失(万元)
          avgLossPerAccident: 285.6, // 平均每次事故损失
          lossDistribution: [
            { range: '0-100万', count: 45, percentage: 28.8 },
            { range: '100-300万', count: 52, percentage: 33.3 },
            { range: '300-500万', count: 35, percentage: 22.4 },
            { range: '500-1000万', count: 18, percentage: 11.5 },
            { range: '1000万以上', count: 6, percentage: 3.8 }
          ],
          lossComponents: [
            { type: '设备损失', amount: 1825.4, percentage: 40.0 },
            { type: '建筑损失', amount: 1369.1, percentage: 30.0 },
            { type: '物资损失', amount: 913.6, percentage: 20.0 },
            { type: '人员救治', amount: 273.5, percentage: 6.0 },
            { type: '环境治理', amount: 182.3, percentage: 4.0 }
          ]
        }
      }
    }
  }
] as MockMethod[]
