import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const evaluationResultRoutes: AppRouteRecordRaw[] = [
  {
    path: '/evaluation-result',
    component: Layout,
    name: 'EvaluationResultGeneration',
    meta: {
      title: t('router.evaluationResultGeneration'),
      icon: 'vi-ep:document-checked',
      alwaysShow: true
    },
    redirect: '/evaluation-result/result-list',
    children: [
      {
        path: 'result-list',
        component: () => import('@/views/Evaluation/Result/resultList.vue'),
        name: 'EvaluationResultManagement',
        meta: {
          title: t('router.evaluationResultManagement'),
          icon: 'vi-ep:data-line'
        }
      },
      {
        path: 'report-list',
        component: () => import('@/views/Evaluation/Result/reportList.vue'),
        name: 'EvaluationReportManagement',
        meta: {
          title: t('router.evaluationReportManagement'),
          icon: 'vi-ep:document-copy'
        }
      },
      {
        path: 'dashboard',
        component: () => import('@/views/Evaluation/Dashboard/list.vue'),
        name: 'EvaluationDashboard',
        meta: {
          title: '仪表盘设计',
          icon: 'vi-ep:data-board'
        }
      },
      {
        path: 'dashboard-create',
        component: () => import('@/views/Evaluation/Dashboard/design.vue'),
        name: 'DashboardCreate',
        meta: {
          title: '新建仪表盘',
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation-result/dashboard'
        }
      },
      {
        path: 'dashboard-edit/:id',
        component: () => import('@/views/Evaluation/Dashboard/design.vue'),
        name: 'DashboardEdit',
        meta: {
          title: '编辑仪表盘',
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation-result/dashboard'
        }
      },
      {
        path: 'dashboard-view/:id',
        component: () => import('@/views/Evaluation/Dashboard/design.vue'),
        name: 'DashboardView',
        meta: {
          title: '查看仪表盘',
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation-result/dashboard'
        }
      },
      {
        path: 'result-detail/:id',
        component: () => import('@/views/Evaluation/TaskManagement/detail.vue'),
        name: 'EvaluationResultDetail',
        meta: {
          title: t('router.evaluationResultDetail'),
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation-result/result-list'
        }
      },
      {
        path: 'result-dashboard/:id',
        component: () => import('@/views/Evaluation/Result/dashboard.vue'),
        name: 'EvaluationResultDashboard',
        meta: {
          title: '评估结果仪表盘',
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation-result/result-list'
        }
      },
      {
        path: 'report/:id',
        component: () => import('@/views/Evaluation/TaskManagement/detail.vue'),
        name: 'EvaluationReport',
        meta: {
          title: t('router.evaluationReport'),
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation-result/report-list'
        }
      }
    ]
  }
]
