/**
 * Tour 引导流程示例
 * 
 * 这个文件展示了如何定义完整的业务引导流程
 * 实际使用时，建议在各个业务模块中独立定义，然后统一注册
 */

import type { TourFlow, TourStep } from './types'

// ==================== 示例1：首页/Dashboard 引导 ====================

export const dashboardSteps: TourStep[] = [
  {
    id: 'dashboard.welcome',
    target: '#app-logo',
    title: '欢迎使用系统',
    description: '让我们花一分钟时间了解系统的主要功能',
    placement: 'bottom'
  },
  {
    id: 'dashboard.menu',
    target: () => document.querySelector('.layout-menu') as HTMLElement,
    title: '导航菜单',
    description: '通过左侧菜单可以访问各个功能模块',
    placement: 'right',
    onEnter: async () => {
      // 确保菜单展开
      const menu = document.querySelector('.layout-menu')
      if (menu?.classList.contains('collapsed')) {
        // 触发展开事件
        console.log('展开菜单')
      }
    }
  },
  {
    id: 'dashboard.stats',
    target: '.dashboard-stats',
    title: '数据统计',
    description: '这里显示系统的关键业务指标和实时数据',
    placement: 'top'
  }
]

export const dashboardFlow: TourFlow = {
  key: 'onboarding.dashboard',
  name: '首页引导',
  steps: dashboardSteps,
  priority: 100,
  once: true,
  onStart: async () => {
    console.log('[Tour] Dashboard 引导开始')
  },
  onFinish: async () => {
    console.log('[Tour] Dashboard 引导完成')
    // 可以在这里发送埋点事件
    // analytics.track('tour_completed', { tour: 'dashboard' })
  }
}

// ==================== 示例2：数据处理模块引导 ====================

export const dataProcessingSteps: TourStep[] = [
  {
    id: 'data.upload',
    target: '#btn-upload',
    title: '上传数据',
    description: '点击这里可以上传您的数据文件，支持 CSV、Excel 等格式',
    placement: 'bottom'
  },
  {
    id: 'data.list',
    target: '.data-table',
    title: '数据列表',
    description: '已上传的数据会显示在这里，您可以查看、编辑或删除',
    placement: 'top',
    // 仅当表格有数据时显示
    visible: () => {
      const table = document.querySelector('.data-table tbody')
      return (table?.children.length || 0) > 0
    }
  },
  {
    id: 'data.process',
    target: '#btn-process',
    title: '数据处理',
    description: '选择数据后，点击这里开始处理流程',
    placement: 'left'
  },
  {
    id: 'data.result',
    target: '.result-panel',
    title: '处理结果',
    description: '处理完成后，结果会显示在这个面板中',
    placement: 'right',
    onEnter: async () => {
      // 滚动到结果面板
      const panel = document.querySelector('.result-panel') as HTMLElement
      panel?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
]

export const dataProcessingFlow: TourFlow = {
  key: 'onboarding.data-processing',
  name: '数据处理引导',
  steps: dataProcessingSteps,
  priority: 80,
  once: true
}

// ==================== 示例3：用户管理模块引导 ====================

export const userManagementSteps: TourStep[] = [
  {
    id: 'user.create',
    target: '#btn-create-user',
    title: '创建用户',
    description: '点击这里可以添加新用户',
    placement: 'bottom'
  },
  {
    id: 'user.filter',
    target: '[data-tour="user-filter"]',
    title: '筛选用户',
    description: '使用筛选器快速找到目标用户',
    placement: 'bottom'
  },
  {
    id: 'user.actions',
    target: () => {
      // 动态获取第一行的操作按钮
      return document.querySelector('.user-table tbody tr:first-child .action-buttons') as HTMLElement
    },
    title: '用户操作',
    description: '每个用户都有编辑、删除等操作选项',
    placement: 'left',
    // 仅当有用户数据时显示
    visible: () => {
      const tbody = document.querySelector('.user-table tbody')
      return (tbody?.children.length || 0) > 0
    }
  }
]

export const userManagementFlow: TourFlow = {
  key: 'onboarding.user-management',
  name: '用户管理引导',
  steps: userManagementSteps,
  priority: 60,
  once: true,
  onStart: async () => {
    // 确保在用户列表页
    if (!window.location.pathname.includes('/user')) {
      console.warn('[Tour] 不在用户管理页面，取消引导')
      return
    }
  }
}

// ==================== 示例4：高级功能引导（按权限） ====================

export const createAdvancedFeatureSteps = (userPermissions: string[]): TourStep[] => {
  const steps: TourStep[] = [
    {
      id: 'advanced.analytics',
      target: '#advanced-analytics',
      title: '高级分析',
      description: '使用高级分析功能深入了解数据',
      placement: 'right',
      visible: userPermissions.includes('analytics:advanced')
    },
    {
      id: 'advanced.export',
      target: '#batch-export',
      title: '批量导出',
      description: '批量导出数据报表',
      placement: 'bottom',
      visible: userPermissions.includes('export:batch')
    },
    {
      id: 'advanced.api',
      target: '#api-settings',
      title: 'API 配置',
      description: '配置 API 接口和密钥',
      placement: 'left',
      visible: userPermissions.includes('settings:api')
    }
  ]

  return steps.filter(step => step.visible !== false)
}

export const createAdvancedFeatureFlow = (userPermissions: string[]): TourFlow => ({
  key: 'onboarding.advanced-features',
  name: '高级功能引导',
  steps: createAdvancedFeatureSteps(userPermissions),
  priority: 40,
  once: true
})

// ==================== 示例5：异步数据加载场景 ====================

export const asyncDataSteps: TourStep[] = [
  {
    id: 'async.loading',
    target: '.data-container',
    title: '数据加载',
    description: '系统正在加载数据，请稍候...',
    placement: 'top',
    onEnter: async () => {
      // 等待数据加载完成
      await new Promise(resolve => {
        const checkData = setInterval(() => {
          const hasData = document.querySelector('.data-loaded')
          if (hasData) {
            clearInterval(checkData)
            resolve(true)
          }
        }, 500)
      })
    }
  },
  {
    id: 'async.chart',
    target: () => {
      // 等待图表组件渲染
      return document.querySelector('.echarts-container canvas') as HTMLElement
    },
    title: '数据图表',
    description: '数据已加载完成，这里是可视化图表',
    placement: 'bottom'
  }
]

// ==================== 注册所有流程的辅助函数 ====================

/**
 * 注册所有示例流程
 * 
 * 使用方法：
 * ```typescript
 * import { tourRegistry } from '@/tour'
 * import { registerAllExampleFlows } from '@/tour/flows.example'
 * 
 * // 在 main.ts 或 router/index.ts 中调用
 * registerAllExampleFlows()
 * ```
 */
export function registerAllExampleFlows(): void {
  const { tourRegistry } = require('./registry')
  
  tourRegistry.registerAll([
    dashboardFlow,
    dataProcessingFlow,
    userManagementFlow
  ])
  
  console.log('[Tour] 已注册所有示例流程')
}

// ==================== 实际业务使用建议 ====================

/**
 * 建议的文件组织结构：
 * 
 * src/views/
 * ├── Dashboard/
 * │   ├── index.vue
 * │   └── tour.config.ts          # Dashboard 的引导配置
 * ├── DataProcessing/
 * │   ├── index.vue
 * │   └── tour.config.ts          # 数据处理的引导配置
 * └── UserManagement/
 *     ├── index.vue
 *     └── tour.config.ts          # 用户管理的引导配置
 * 
 * 然后在各个 tour.config.ts 中定义该模块的引导流程，
 * 并在 main.ts 或路由文件中统一注册。
 */

/**
 * 示例：在业务模块中定义引导
 * 
 * // src/views/Dashboard/tour.config.ts
 * import type { TourFlow } from '@/tour'
 * 
 * export const dashboardTourFlow: TourFlow = {
 *   key: 'onboarding.dashboard',
 *   name: 'Dashboard 引导',
 *   steps: [...],
 *   once: true
 * }
 * 
 * // src/main.ts
 * import { tourRegistry } from '@/tour'
 * import { dashboardTourFlow } from '@/views/Dashboard/tour.config'
 * 
 * tourRegistry.register(dashboardTourFlow)
 */


