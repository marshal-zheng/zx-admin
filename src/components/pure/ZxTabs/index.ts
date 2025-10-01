// ZxTabs 标签页组件导出文件
// 基于 Element Plus 的增强标签页组件

import ZxTabs from './index.vue'

// 导出组件
export default ZxTabs

// 组件安装函数（用于全局注册）
ZxTabs.install = function (app) {
  app.component('ZxTabs', ZxTabs)
}

// 组件信息
export const componentInfo = {
  name: 'ZxTabs',
  version: '1.0.0',
  description: '基于 Element Plus 的增强标签页组件，支持拖拽排序、URL同步、懒加载等功能',
  author: 'ZXHL',
  dependencies: {
    vue: '^3.3.0',
    'element-plus': '^2.3.0',
    'vue-router': '^4.2.0'
  },
  features: [
    '支持拖拽排序',
    'URL参数同步',
    '标签页状态记录',
    '组件懒加载',
    '自定义标签内容',
    '响应式设计',
    '丰富的事件回调'
  ]
}
