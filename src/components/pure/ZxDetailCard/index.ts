import Component from './index.vue'

// 为组件提供 install 安装方法，供按需引入
Component.install = function (app) {
  app.component('ZxDetailCard', Component)
}

export default Component
