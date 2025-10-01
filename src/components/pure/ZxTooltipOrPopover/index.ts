import ZxTooltipOrPopover from './index.vue'

// 为组件提供 install 方法，用于全局注册
ZxTooltipOrPopover.install = function (app) {
  app.component(ZxTooltipOrPopover.name || 'ZxTooltipOrPopover', ZxTooltipOrPopover)
}

export default ZxTooltipOrPopover
export { ZxTooltipOrPopover }
