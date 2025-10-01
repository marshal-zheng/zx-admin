import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const dataPreprocessingRoutes: AppRouteRecordRaw[] = [
  {
    path: '/data-preprocessing',
    component: Layout,
    name: 'DataPreprocessing',
    meta: {
      title: '数据预处理',
      icon: 'vi-ep:data-analysis',
      alwaysShow: true
    },
    redirect: '/data-preprocessing/data-connection',
    children: [
      {
        path: 'data-connection',
        component: () => import('@/views/DataPreprocessing/DataConnection/list.vue'),
        name: 'DataConnection',
        meta: {
          title: '数据引接',
          icon: 'vi-ep:connection'
        }
      },
      {
        path: 'data-connection/table-query/:id',
        component: () => import('@/views/DataPreprocessing/DataConnection/tableQuery.vue'),
        name: 'DataConnectionTableQuery',
        meta: {
          title: '表查询',
          icon: 'vi-ep:search',
          hidden: true,
          noTagsView: false,
          activeMenu: '/data-preprocessing/data-connection'
        }
      },
      {
        path: 'data-entry',
        component: () => import('@/views/DataPreprocessing/DataEntry/list.vue'),
        name: 'DataEntry',
        meta: {
          title: '数据录入',
          icon: 'vi-ep:edit'
        }
      },
      {
        path: 'data-conversion',
        component: () => import('@/views/DataPreprocessing/DataConversion/list.vue'),
        name: 'DataConversion',
        meta: {
          title: '数据转换',
          icon: 'vi-ep:refresh'
        }
      }
    ]
  }
]
