import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { NO_RESET_WHITE_LIST } from '@/constants'

// 导入拆分的路由模块
import { basicRoutes } from './routes/basic.route'
import { dashboardOnlyRoutes } from './routes/dashboard-only.route'
// import { dashboardRoutes } from './routes/dashboard.route'
// import { componentsRoutes } from './routes/components.route'
import { evaluationRoutes } from './routes/evaluation.route'
// import { evaluationResultRoutes } from './routes/evaluationResult.route'
import { dataPreprocessingRoutes } from './routes/dataPreprocessing.route'
import { indicatorRoutes } from './routes/indicator.route'
// import { functionRoutes } from './routes/function.route'
// import { hooksRoutes } from './routes/hooks.route'
// import { levelRoutes } from './routes/level.route'
// import { exampleRoutes } from './routes/example.route'
// import { errorRoutes } from './routes/error.route'
// import { authorizationRoutes } from './routes/authorization.route'

// 常量路由（基础路由）
export const constantRouterMap: AppRouteRecordRaw[] = [...basicRoutes]

// 异步路由（需要权限的路由）
export const asyncRouterMap: AppRouteRecordRaw[] = [
  ...dashboardOnlyRoutes,
  // ...componentsRoutes,
  ...dataPreprocessingRoutes,
  ...indicatorRoutes,
  ...evaluationRoutes,
  // ...evaluationResultRoutes
  // ...functionRoutes,
  // ...hooksRoutes,
  // ...levelRoutes,
  // ...exampleRoutes,
  // ...errorRoutes,
  // ...authorizationRoutes
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
