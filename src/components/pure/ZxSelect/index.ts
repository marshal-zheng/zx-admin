import ZxSelect from './index.vue'

// 为组件提供 install 方法，用于全局注册
ZxSelect.install = function (app) {
  app.component(ZxSelect.name, ZxSelect)
}

export default ZxSelect
export { ZxSelect }
