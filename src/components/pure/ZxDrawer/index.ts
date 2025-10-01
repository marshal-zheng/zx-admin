// ZxDrawer 组件导出文件
// 基于 Element Plus 的抽屉组件

import ZxDrawer from './index.vue'

// 导出组件
export default ZxDrawer

// 导出类型定义（用于 TypeScript）
export * from './index.vue'

// 组件安装函数（用于全局注册）
ZxDrawer.install = function (app) {
  app.component('ZxDrawer', ZxDrawer)
}
