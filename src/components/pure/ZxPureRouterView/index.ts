import ZxPureRouterView from './index.vue'

// 为组件提供 install 方法，用于全局注册
ZxPureRouterView.install = function (app) {
  app.component(ZxPureRouterView.name || 'ZxPureRouterView', ZxPureRouterView)
}

export default ZxPureRouterView
export { ZxPureRouterView }
