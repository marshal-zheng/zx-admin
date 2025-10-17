import type { App } from 'vue'
import { Icon } from './Icon'
import { Permission } from './Permission'
import { BaseButton } from './Button'
// import PureComponents from './pure'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('Permission', Permission)
  app.component('BaseButton', BaseButton)

  // 注册 Pure 组件库
  // app.use(PureComponents)
}
