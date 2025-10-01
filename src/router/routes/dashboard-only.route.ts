import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const dashboardOnlyRoutes: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: t('router.analysis'),
      icon: 'vi-ant-design:dashboard-filled',
      noCache: true,
      affix: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: t('router.analysis'),
          icon: 'vi-ant-design:line-chart-outlined',
          noCache: true,
          affix: true
        }
      }
    ]
  }
]
