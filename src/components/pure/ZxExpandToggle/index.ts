import Component from './index.vue'

// 为组件提供 install 方法，支持全局注册
Component.install = function (app) {
  app.component('ZxExpandToggle', Component)
}

export default Component
