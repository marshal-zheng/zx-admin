/**
 * Tour 引导系统路由集成示例
 * 
 * 这个文件展示了如何在路由守卫中集成 Tour 引导系统
 * 实际使用时，请将相关代码添加到 src/router/index.ts 中
 */

import type { Router } from 'vue-router'
import { startTour } from '@/tour'

/**
 * 配置路由引导映射
 * key: 路由名称
 * value: 引导流程 key
 */
const routeTourMap: Record<string, string> = {
  // 示例：首页引导
  // 'Dashboard': 'onboarding.dashboard',
  
  // 示例：用户管理引导
  // 'UserManagement': 'onboarding.user-management',
  
  // 示例：数据预处理引导
  // 'DataPreprocessing': 'onboarding.data-preprocessing',
}

/**
 * 设置 Tour 引导的路由守卫
 * 
 * 使用方法：
 * ```typescript
 * import { setupTourGuard } from '@/tour/router-integration'
 * 
 * const router = createRouter({ ... })
 * setupTourGuard(router)
 * ```
 */
export function setupTourGuard(router: Router): void {
  router.afterEach((to) => {
    // 检查该路由是否有对应的引导流程
    const tourKey = routeTourMap[to.name as string]
    
    if (tourKey) {
      // 延迟启动，确保页面完全渲染
      setTimeout(() => {
        startTour(tourKey)
      }, 500)
    }
  })
}

/**
 * 动态注册路由引导映射
 * 
 * 使用场景：在业务模块中动态注册引导
 * 
 * 使用方法：
 * ```typescript
 * import { registerRouteTour } from '@/tour/router-integration'
 * 
 * registerRouteTour('Dashboard', 'onboarding.dashboard')
 * ```
 */
export function registerRouteTour(routeName: string, tourKey: string): void {
  routeTourMap[routeName] = tourKey
}

/**
 * 批量注册路由引导映射
 */
export function registerRouteTours(map: Record<string, string>): void {
  Object.assign(routeTourMap, map)
}

/**
 * 移除路由引导映射
 */
export function unregisterRouteTour(routeName: string): void {
  delete routeTourMap[routeName]
}

/**
 * 获取当前路由引导映射
 */
export function getRouteTourMap(): Readonly<Record<string, string>> {
  return { ...routeTourMap }
}

// ==================== 使用示例 ====================

/**
 * 示例1：在 router/index.ts 中直接集成
 * 
 * ```typescript
 * // src/router/index.ts
 * import { createRouter } from 'vue-router'
 * import { startTour } from '@/tour'
 * 
 * const router = createRouter({ ... })
 * 
 * router.afterEach((to) => {
 *   if (to.name === 'Dashboard') {
 *     setTimeout(() => startTour('onboarding.dashboard'), 500)
 *   }
 * })
 * 
 * export default router
 * ```
 */

/**
 * 示例2：在组件中手动触发
 * 
 * ```vue
 * <script setup lang="ts">
 * import { onMounted } from 'vue'
 * import { startTour } from '@/tour'
 * 
 * onMounted(() => {
 *   // 可以根据条件判断是否启动
 *   const isFirstVisit = !localStorage.getItem('visited_dashboard')
 *   
 *   if (isFirstVisit) {
 *     startTour('onboarding.dashboard')
 *     localStorage.setItem('visited_dashboard', 'true')
 *   }
 * })
 * </script>
 * ```
 */

/**
 * 示例3：根据用户状态触发
 * 
 * ```typescript
 * import { startTour } from '@/tour'
 * import { useUserStore } from '@/store/modules/user'
 * 
 * const userStore = useUserStore()
 * 
 * // 新用户首次登录
 * if (userStore.isNewUser) {
 *   startTour('onboarding.welcome')
 * }
 * 
 * // 高级用户查看高级功能
 * if (userStore.isPremium && !userStore.hasSeen('premium-features')) {
 *   startTour('onboarding.premium-features')
 * }
 * ```
 */


