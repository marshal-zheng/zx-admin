import PureRouterView from '@/components/pure/ZxPureRouterView/index.vue'

// 系统管理一级菜单，指标体系管理作为二级菜单项
export const systemManagementRoutes = [
  {
    path: '',
    name: 'SystemManagement',
    meta: {
      title: '指标体系设计',
      icon: 'Setting'
    },
    redirect: '/system/indicator-system/list',
    component: PureRouterView,
    children: [
      {
        path: 'indicator-system/list',
        name: 'IndicatorSystemList',
        meta: { title: '指标体系管理' },
        component: () => import('@/components/pages/indicatorSystem/designManagement/list.vue')
      },
      {
        path: 'indicator-system/detail/:id',
        name: 'IndicatorSystemDetail',
        meta: {
          routeKey: 'indicatorSystemDetail',
          title: '指标体系设计',
          showInMenu: false
        },
        component: () => import('@/components/pages/indicatorSystem/designManagement/test.vue')
      }
    ]
  }
]

export default systemManagementRoutes
