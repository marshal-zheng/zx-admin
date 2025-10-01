import ZxIcon from './index.vue'

// 为组件提供 install 方法，用于全局注册
ZxIcon.install = function (app) {
  app.component(ZxIcon.name, ZxIcon)
}

export default ZxIcon
export { ZxIcon }
