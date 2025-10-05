import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const indicatorRoutes: AppRouteRecordRaw[] = [
  {
    path: '/indicator',
    component: Layout,
    name: 'IndicatorSystem',
    meta: {
      title: '评估指标体系',
      icon: 'vi-ep:data-analysis',
      alwaysShow: true
    },
    redirect: '/indicator/operator-list',
    children: [
      {
        path: 'operator-list',
        component: () => import('@/views/Indicator/OperatorManagement/list.vue'),
        name: 'OperatorManagement',
        meta: {
          title: '评估算子管理',
          icon: 'vi-ep:cpu'
        }
      },
      {
        path: 'model-list',
        component: () => import('@/views/Indicator/ModelManagement/list.vue'),
        name: 'ModelManagement',
        meta: {
          title: '计算模型管理',
          icon: 'vi-ep:data-board'
        }
      },
      {
        path: 'category-list',
        component: () => import('@/views/Indicator/CategoryManagement/list.vue'),
        name: 'CategoryManagement',
        meta: {
          title: '指标分类管理',
          icon: 'vi-ep:folder'
        }
      },
      {
        path: 'system-list',
        component: () => import('@/views/Indicator/SystemManagement/list.vue'),
        name: 'SystemManagement',
        meta: {
          title: '指标体系管理',
          icon: 'vi-ep:grid'
        }
      },
      {
        path: 'system-create',
        component: () => import('@/views/Indicator/SystemManagement/design.vue'),
        name: 'SystemCreate',
        meta: {
          title: '指标新建体系',
          hidden: true,
          activeMenu: '/indicator/system-list'
        }
      },
      {
        path: 'system-edit/:id',
        component: () => import('@/views/Indicator/SystemManagement/design.vue'),
        name: 'SystemEdit',
        meta: {
          title: '编辑体系',
          hidden: true,
          activeMenu: '/indicator/system-list'
        }
      },
      {
        path: 'system-design-edit',
        component: () => import('@/views/Indicator/SystemManagement/designEdit.vue'),
        name: 'SystemDesignEdit',
        meta: {
          title: '编辑指标',
          hidden: true,
          activeMenu: '/indicator/system-list'
        }
      },
      {
        path: 'template-list',
        component: () => import('@/views/Indicator/TemplateManagement/list.vue'),
        name: 'IndicatorTemplateManagement',
        meta: {
          title: '指标模版管理',
          icon: 'vi-ep:document-copy'
        }
      },
      {
        path: 'template-create',
        component: () => import('@/views/Indicator/TemplateManagement/design.vue'),
        name: 'TemplateCreate',
        meta: {
          title: '新建模版',
          hidden: true,
          activeMenu: '/indicator/template-list'
        }
      },
      {
        path: 'template-edit/:id',
        component: () => import('@/views/Indicator/TemplateManagement/design.vue'),
        name: 'TemplateEdit',
        meta: {
          title: '编辑模版',
          hidden: true,
          activeMenu: '/indicator/template-list'
        }
      }
    ]
  }
]
