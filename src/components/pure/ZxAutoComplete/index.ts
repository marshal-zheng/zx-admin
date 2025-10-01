import Component from './index.vue'

// 为组件提供 install 方法，用于全局注册
Component.install = function (app) {
  app.component('ZxAutoComplete', Component)
}

export default Component
