import ZxUpload from './index.vue'

// 为组件提供 install 安装方法，供按需引入
ZxUpload.install = function (Vue) {
  Vue.component(ZxUpload.name, ZxUpload)
}

export default ZxUpload
