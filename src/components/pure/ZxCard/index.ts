// ZxCard 组件导出文件
// 基于 Element Plus 的卡片组件

import ZxCard from './index.vue'

// 导出组件
export default ZxCard

// 组件安装函数（用于全局注册）
ZxCard.install = function (app) {
  app.component('ZxCard', ZxCard)
}
