/**
 * ZxSplitBox 分割面板组件
 * 基于 Element Plus 的可调整大小的分割面板组件
 * 支持水平和垂直分割，支持展开/收起功能
 */

import ZxSplitBox from './index.vue'

// 组件安装函数
ZxSplitBox.install = function (app) {
  app.component(ZxSplitBox.name || 'ZxSplitBox', ZxSplitBox)
}

// 导出组件
export default ZxSplitBox

// 具名导出
export { ZxSplitBox }

// 组件信息
export const componentInfo = {
  name: 'ZxSplitBox',
  version: '1.0.0',
  description: '可调整大小的分割面板组件',
  author: 'ZXHL',
  dependencies: {
    vue: '^3.3.0',
    'element-plus': '^2.3.0'
  },
  features: [
    '支持水平和垂直分割',
    '可拖拽调整面板大小',
    '支持展开/收起功能',
    '响应式设计',
    '自定义样式主题',
    '键盘快捷键支持'
  ]
}
