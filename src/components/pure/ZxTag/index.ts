import ZxTag from './index.vue'
import ZxTagGroup from './ZxTagGroup/index.vue'

// 为组件提供 install 方法，支持全局注册
ZxTag.install = function (app) {
  app.component('ZxTag', ZxTag)
  app.component('ZxTagGroup', ZxTagGroup)
}

// 支持按需引入
export { ZxTagGroup }
export default ZxTag
