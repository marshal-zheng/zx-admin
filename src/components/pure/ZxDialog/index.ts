// ZxDialog 组件导出文件
// 基于 Element Plus 的对话框组件

import ZxDialog from './index.vue'

// 导出组件
export default ZxDialog

// 导出类型定义（用于 TypeScript）
export * from './index.vue'

// 组件安装函数（用于全局注册）
ZxDialog.install = function (app) {
  app.component('ZxDialog', ZxDialog)
}
