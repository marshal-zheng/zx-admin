# Tour 引导系统使用文档

## 📋 概述

这是一个基于 Vue 3 和 Element Plus 的集中式新手引导系统，经过改进和增强，具有以下特点：

### ✨ 核心优势

1. **完整的 TypeScript 类型支持** - 所有接口都有完整的类型定义
2. **错误处理和降级策略** - 元素等待超时不会导致系统崩溃
3. **多流程管理** - 支持注册多个引导流程，支持优先级机制
4. **细粒度的生命周期钩子** - 支持流程级和步骤级的钩子函数
5. **条件渲染** - 步骤可根据权限、状态动态显示/隐藏
6. **调试模式** - 开发环境下可以方便地重置和调试
7. **SSR 兼容** - 安全的 localStorage 操作
8. **国际化支持** - 可与项目的 i18n 系统集成

### 🔄 相比原方案的改进

- ❌ 原方案使用 `any` 类型 → ✅ 现在完整的 TypeScript 类型定义
- ❌ 原方案超时直接报错 → ✅ 现在有错误处理和降级策略
- ❌ 原方案只支持单流程 → ✅ 现在支持多流程管理和优先级
- ❌ 原方案缺少"跳过"与"完成"区分 → ✅ 现在有完整的生命周期管理
- ❌ 原方案文案写死 → ✅ 现在可以集成国际化
- ❌ 原方案事件钩子单一 → ✅ 现在有流程级和步骤级钩子
- ❌ 原方案无法调试 → ✅ 现在有调试模式和重置功能
- ❌ 原方案 SSR 不兼容 → ✅ 现在使用安全的存储操作
- ❌ 原方案无条件渲染 → ✅ 现在支持动态显示/隐藏步骤
- ❌ 原方案扩展性差 → ✅ 现在配置灵活，易于自定义

## 📁 目录结构

```
src/tour/
├── types.ts          # 类型定义
├── utils.ts          # 工具函数（元素等待、存储等）
├── storage.ts        # 本地存储管理
├── registry.ts       # 流程注册表
├── service.ts        # 核心服务类
├── index.ts          # 导出入口
└── README.md         # 本文档

src/components/AppTourHost/
├── src/
│   └── AppTourHost.vue  # 全局宿主组件
└── index.ts          # 组件导出
```

## 🚀 快速开始

### 1. 定义引导流程

在业务模块中创建引导流程配置（例如 `src/views/Dashboard/tour.config.ts`）：

```typescript
import type { TourFlow, TourStep } from '@/tour'

// 定义步骤
export const dashboardSteps: TourStep[] = [
  {
    id: 'dashboard.welcome',
    target: '#dashboard-header',
    title: '欢迎来到控制台',
    description: '这里是系统的数据概览中心',
    placement: 'bottom'
  },
  {
    id: 'dashboard.stats',
    target: () => document.querySelector('.stats-card') as HTMLElement,
    title: '数据统计卡片',
    description: '实时查看关键业务指标',
    placement: 'right',
    // 条件显示
    visible: () => hasPermission('view:stats'),
    // 步骤钩子
    onEnter: async () => {
      console.log('进入统计卡片步骤')
    }
  },
  {
    id: 'dashboard.chart',
    target: '#main-chart',
    title: '数据图表',
    description: '通过图表直观了解数据趋势',
    placement: 'top'
  }
]

// 定义流程
export const dashboardFlow: TourFlow = {
  key: 'onboarding.dashboard',
  name: '控制台引导',
  steps: dashboardSteps,
  priority: 10,
  once: true, // 只触发一次
  // 流程钩子
  onStart: async () => {
    console.log('控制台引导开始')
    // 可以在这里做准备工作，比如滚动到顶部
    window.scrollTo(0, 0)
  },
  onFinish: async () => {
    console.log('控制台引导完成')
    // 可以在这里做埋点统计
  },
  onClose: async () => {
    console.log('用户关闭了引导')
  }
}
```

### 2. 注册流程

在应用启动时或路由守卫中注册流程：

```typescript
// main.ts 或 router/index.ts
import { tourRegistry } from '@/tour'
import { dashboardFlow } from '@/views/Dashboard/tour.config'

// 注册流程
tourRegistry.register(dashboardFlow)

// 或批量注册
tourRegistry.registerAll([dashboardFlow, otherFlow])
```

### 3. 触发引导

在路由守卫或组件中触发引导：

```typescript
// 在路由守卫中
import { startTour } from '@/tour'

router.afterEach((to) => {
  if (to.name === 'Dashboard') {
    // 延迟启动，确保页面渲染完成
    setTimeout(() => {
      startTour('onboarding.dashboard')
    }, 500)
  }
})

// 或在组件中
import { onMounted } from 'vue'
import { startTour } from '@/tour'

onMounted(() => {
  startTour('onboarding.dashboard', {
    force: false, // 不强制（遵循 once 限制）
    startFrom: 0  // 从第一步开始
  })
})
```

### 4. 业务组件添加锚点

业务组件只需要暴露稳定的 DOM 锚点：

```vue
<template>
  <div class="dashboard">
    <div id="dashboard-header" class="header">
      <h1>控制台</h1>
    </div>
    
    <div class="stats-card" data-tour="dashboard-stats">
      <!-- 统计卡片内容 -->
    </div>
    
    <div id="main-chart">
      <!-- 图表内容 -->
    </div>
  </div>
</template>
```

## 📖 API 文档

### TourService

核心服务实例，提供引导流程的控制方法。

```typescript
import { tourService } from '@/tour'

// 配置服务
tourService.configure({
  debug: true,
  defaultTimeout: 10000,
  storagePrefix: 'myapp'
})

// 启动引导
await tourService.start('onboarding.dashboard', {
  force: true,        // 强制启动（忽略 once 限制）
  startFrom: 2,       // 从第3步开始
  customSteps: [...]  // 使用自定义步骤
})

// 停止引导
tourService.stop()

// 跳转到指定步骤
tourService.goToStep(3)

// 获取当前流程
const flow = tourService.getCurrentFlow()

// 重置流程
tourService.reset('onboarding.dashboard')

// 重置所有流程
tourService.resetAll()
```

### TourRegistry

流程注册表，管理所有引导流程。

```typescript
import { tourRegistry } from '@/tour'

// 注册流程
tourRegistry.register(flow)

// 批量注册
tourRegistry.registerAll([flow1, flow2])

// 获取流程
const flow = tourRegistry.get('onboarding.dashboard')

// 检查流程是否存在
if (tourRegistry.has('onboarding.dashboard')) {
  // ...
}

// 获取所有流程（按优先级排序）
const flows = tourRegistry.getAllSorted()

// 注销流程
tourRegistry.unregister('onboarding.dashboard')
```

### TourStorage

存储管理，处理流程完成状态。

```typescript
import { tourStorage } from '@/tour'

// 检查是否应该运行
if (tourStorage.shouldRun('onboarding.dashboard')) {
  // 启动引导
}

// 标记为已完成
tourStorage.markCompleted('onboarding.dashboard', 5)

// 标记为未完成（重置）
tourStorage.markIncomplete('onboarding.dashboard')

// 获取完成信息
const info = tourStorage.getCompletionInfo('onboarding.dashboard')
// { completed: true, timestamp: 1234567890, stepsCompleted: 5 }

// 清除所有标记
tourStorage.clearAll()
```

### 工具函数

```typescript
import { waitForElement, scrollToElement, sleep } from '@/tour'

// 等待元素出现
const el = await waitForElement('#my-element', {
  timeout: 5000,
  interval: 100,
  throwOnTimeout: false
})

// 滚动到元素
scrollToElement(el, {
  behavior: 'smooth',
  block: 'center'
})

// 延迟
await sleep(1000)
```

## 🎯 高级用法

### 动态步骤内容

```typescript
{
  id: 'dynamic.step',
  target: '#element',
  get title() {
    return useI18n().t('tour.title')
  },
  get description() {
    const user = useUserStore()
    return `欢迎 ${user.name}，这是您的第 ${user.loginCount} 次登录`
  }
}
```

### 异步加载场景

```typescript
{
  id: 'async.step',
  target: () => {
    // 等待异步组件渲染
    return document.querySelector('.async-component .target-el') as HTMLElement
  },
  title: '异步内容',
  onEnter: async () => {
    // 确保数据已加载
    await loadData()
  }
}
```

### 条件渲染

```typescript
{
  id: 'conditional.step',
  target: '#premium-feature',
  title: '高级功能',
  // 根据权限决定是否显示
  visible: () => {
    const user = useUserStore()
    return user.isPremium
  }
}
```

### 与国际化集成

```typescript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export const createLocalizedSteps = (): TourStep[] => [
  {
    id: 'i18n.step',
    target: '#element',
    title: t('tour.dashboard.step1.title'),
    description: t('tour.dashboard.step1.desc')
  }
]
```

## 🐛 调试技巧

### 开发模式下重置所有引导

在浏览器控制台执行：

```javascript
// 重置所有引导
localStorage.removeItem('app_tour_flags')

// 或使用 API
tourService.resetAll()
```

### 强制启动引导

```typescript
startTour('onboarding.dashboard', { force: true })
```

### 从指定步骤开始

```typescript
startTour('onboarding.dashboard', { startFrom: 2 })
```

## ⚠️ 注意事项

1. **锚点稳定性**：确保目标元素的 ID 或选择器在版本迭代中保持稳定
2. **异步渲染**：对于异步加载的元素，使用函数形式的 `target` 并配合 `waitForElement`
3. **性能考虑**：避免在 `visible` 函数中执行耗时操作
4. **国际化**：如果应用支持多语言，建议将引导文案也纳入 i18n 系统
5. **移动端适配**：注意 `placement` 在小屏幕上的表现

## 📝 完整示例

查看 `src/tour/registry.ts` 中的 `exampleHomeFlow` 获取完整示例。

## 🔗 相关资源

- [Element Plus Tour 组件文档](https://element-plus.org/zh-CN/component/tour.html)
- [项目类型定义](./types.ts)
- [工具函数](./utils.ts)

---

**最后更新**: 2025-10-17


