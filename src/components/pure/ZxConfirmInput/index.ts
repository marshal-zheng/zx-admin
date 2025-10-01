import Component from './index.vue'
import './service.js' // 导入服务文件以执行全局变量设置
import type { App } from 'vue'

// 扩展全局 Window 接口
declare global {
  interface Window {
    __ZxConfirmInputService: any
  }
}

// 从全局变量获取服务（Vue SFC 不支持命名导出）
const getService = () => (window as any).__ZxConfirmInputService

Component.install = (app: App) => {
  app.component('ZxConfirmInput', Component)

  // 等待组件加载完成后获取服务
  setTimeout(() => {
    const serviceExports = getService()
    if (serviceExports) {
      // 设置宿主应用上下文，供服务式调用使用
      serviceExports.setHostAppContext((app as any)._context)

      // 注册全局属性
      app.config.globalProperties.$confirmInput = serviceExports.service

      // 提供注入
      app.provide('$confirmInput', serviceExports.service)

      // 将服务添加到组件上，便于外部访问
      ;(Component as any).service = serviceExports.service
      ;(Component as any).createConfirmInput = serviceExports.createConfirmInput
      ;(Component as any).danger = serviceExports.danger
      ;(Component as any).warning = serviceExports.warning
      ;(Component as any).info = serviceExports.info

      console.log('✅ ZxConfirmInput 组件和服务已注册，可使用 $confirmInput')
    }
  }, 0)
}

export default Component
