import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStoreWithOut()
  const appStore = useAppStoreWithOut()

  // 免登录：访问登录页时直接重定向到首页
  if (to.path === '/login') {
    next({ path: '/' })
    return
  }

  // 放开权限校验：始终按静态或配置的动态路由生成并放行
  if (!permissionStore.getIsAddRouters) {
    const roleRouters = [] as unknown as AppCustomRouteRecordRaw[] | string[]
    if (appStore.getDynamicRouter) {
      appStore.serverDynamicRouter
        ? await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])
        : await permissionStore.generateRoutes('frontEnd', roleRouters as string[])
    } else {
      await permissionStore.generateRoutes('static')
    }

    permissionStore.getAddRouters.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })
    permissionStore.setIsAddRouters(true)
    next({ ...to, replace: true })
    return
  }

  next()
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
