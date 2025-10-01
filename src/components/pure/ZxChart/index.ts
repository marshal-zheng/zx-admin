import Component from './index.vue'

Component.install = function (app) {
  app.component('ZxChart', Component)
}

export default Component
