import { Layout, getParentLayout } from '@/utils/routerHelper'
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
        component: getParentLayout(),
        name: 'DataConnection',
        redirect: '/data-preprocessing/data-connection/list',
        meta: {
          title: '数据引接',
          icon: 'vi-ep:connection'
        },
        children: [
          {
            path: 'list',
            component: () => import('@/views/DataPreprocessing/DataConnection/list.vue'),
            name: 'DataConnectionList',
            meta: {
              title: '数据引接',
              hidden: true,
              canTo: true,
              noTagsView: true,
              activeMenu: '/data-preprocessing/data-connection'
            }
          },
          {
            path: 'table-query/:id',
            component: () => import('@/views/DataPreprocessing/DataConnection/TableQuery.vue'),
            name: 'DataConnectionTableQuery',
            meta: {
              title: '表查询',
              icon: 'vi-ep:search',
              hidden: true,
              canTo: true,
              noTagsView: false,
              activeMenu: '/data-preprocessing/data-connection'
            }
          }
        ]
      },
      {
        path: 'data-entry',
        component: () => import('@/views/DataPreprocessing/DataEntry/list.vue'),
        name: 'DataEntry',
        meta: {
          title: '数据集',
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
