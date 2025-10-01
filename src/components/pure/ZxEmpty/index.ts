import ZxEmpty from './index.vue'

// 为组件提供 install 方法，支持 Vue.use() 方式注册
ZxEmpty.install = function (app) {
  app.component(ZxEmpty.name || 'ZxEmpty', ZxEmpty)
}

export default ZxEmpty
