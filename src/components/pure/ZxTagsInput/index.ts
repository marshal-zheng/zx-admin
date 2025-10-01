import Component from './index.vue'

// 组件安装函数
Component.install = function (app) {
  app.component('ZxTagsInput', Component)
}

// 默认导出组件
export default Component
