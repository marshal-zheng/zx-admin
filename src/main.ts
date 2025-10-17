import 'vue/jsx'

// 引入windi css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

import { createApp } from 'vue'

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import ZXUI from 'zxui'
import '@zxui/theme-chalk/src/index.scss'

import App from './App.vue'

import './permission'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  // 过滤掉 vue-grid-layout 的已知警告
  app.config.warnHandler = (msg, instance, trace) => {
    // 忽略 vue-grid-layout 的 Slot "default" 警告
    if (msg.includes('Slot "default" invoked outside of the render function')) {
      return
    }
    // 其他警告正常输出
    console.warn('[Vue warn]:', msg)
  }

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)

  // app.use(VXETable)

  // 可选全局配置
  app.use(ZXUI, {
    size: 'default',
    namespace: 'zxxss',
    zIndex: 3000
  })

  app.mount('#app')
}

setupAll()
