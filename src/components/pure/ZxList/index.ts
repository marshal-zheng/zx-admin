// ZxList 组件导出文件
// 基于 Element Plus 的列表组件

import ZxList from './index.vue'

// 导出组件
export default ZxList

// 组件安装函数（用于全局注册）
ZxList.install = function (app) {
  app.component('ZxList', ZxList)
}
