import ZxSearch from './index.vue'

// 为组件提供 install 方法，用于全局注册
ZxSearch.install = function (app) {
  app.component(ZxSearch.name, ZxSearch)
}

export default ZxSearch
export { ZxSearch }
