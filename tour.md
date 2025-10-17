好的，这是根据你提供的代码和说明整理的 README 文件。

---

# Vue 3 + Element Plus 集中式新手引导 (Tour) 实现

本项目提供了一套基于 Vue 3 和 Element Plus `el-tour` 组件的集中式新手引导（Tour）功能实现方案。该方案旨在将引导逻辑与业务组件解耦，通过统一的编排层来管理所有引导步骤，使得维护和迭代更加便捷、稳定。

##核心设计思想

*   **集中式编排**：所有引导步骤的定义、顺序、触发逻辑均在独立的 `tour/` 模块中维护，业务组件对引导逻辑无感知。
*   **稳定锚点**：业务组件仅需暴露稳定的 DOM 锚点（如 `id` 或 `data-tour` 属性），无需引入任何引导相关的代码。
*   **全局唯一宿主**：通过一个全局单例 `<AppTourHost>` 组件来承载所有 `el-tour` 的渲染和状态管理，简化 DOM 结构。
*   **数据驱动**：引导步骤完全由 `tour.registry.ts` 中的数据结构定义，易于增删改查。
*   **异步/跨组件支持**：内置 `waitForEl` 工具，确保在目标元素（包括异步加载的）渲染完成后再执行引导，有效解决找不到目标元素的问题。

## 目录结构

```
src/
├── main.ts                     # 应用主入口
├── App.vue                     # 根组件，挂载 Tour 宿主
├── router/
│   └── index.ts                # 路由配置，用于触发引导
├── components/
│   └── AppTourHost.vue         # 全局唯一 Tour 宿主
└── tour/
    ├── tour.service.ts         # 核心服务：启停、跳步、事件处理
    ├── tour.registry.ts        # 步骤清单（数据驱动）
    ├── utils.ts                # waitForEl / sleep 等工具函数
    └── storage.ts              # 本地存储，实现一次性触发```

## 实现步骤

### 1) 全局宿主：`AppTourHost.vue`

全局唯一的 `<el-tour>` 实例，负责渲染所有引导步骤并统一处理通用属性和事件。

```vue
<!-- src/components/AppTourHost.vue -->
<template>
  <el-tour
    v-model="open"
    :current="current"
    :mask="{ color: 'rgba(0,0,0,.45)' }"
    :append-to="appendTo"
    :z-index="2100"
    :scroll-into-view-options="{ block: 'center', inline: 'center' }"
    @change="onChange"
    @finish="onFinish"
    @close="onClose"
  >
    <el-tour-step
      v-for="s in steps"
      :key="s.id"
      :title="s.title"
      :description="s.description"
      :placement="s.placement ?? 'bottom'"
      :target="resolveTarget(s.target)"
      :next-button-props="{ type: 'primary' }"
      :prev-button-props="{ text: '上一步' }"
    />
    <template #indicators="{ current, total }">
      <span class="text-xs opacity-80">{{ current + 1 }} / {{ total }}</span>
    </template>
  </el-tour>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TourService } from '@/tour/tour.service'

const open = ref(false)
const current = ref(0)
const steps = ref<any[]>([])
const appendTo = 'body'

onMounted(() => {
  TourService.mount({ open, current, steps })
})

function resolveTarget(target: any) {
  return typeof target === 'function' ? target() : target
}

function onChange(i: number) { TourService.onChange(i) }
function onFinish() { TourService.onFinish() }
function onClose() { TourService.onClose() }
</script>
```

### 2) 编排服务：`tour.service.ts`

Tour 的核心控制器，负责挂载宿主、启动/停止引导流程、处理生命周期事件，并在启动前预等待所有目标元素加载完成。

```typescript
// src/tour/tour.service.ts
import { nextTick } from 'vue'
import { waitForEl, sleep } from './utils'
import { markDone, shouldRun } from './storage'
import { OnboardingHomeSteps } from './tour.registry'

type HostRefs = { open: any; current: any; steps: any } | null
let host: HostRefs = null

export const TourService = {
  mount(refs: HostRefs) { host = refs },

  async start(key: 'onboarding.home' = 'onboarding.home') {
    if (!host || !shouldRun(key)) return
    const steps = [...OnboardingHomeSteps]

    // 预等待：确保所有目标可定位（含异步渲染/折叠容器）
    for (const s of steps) {
      const sel = s.target
      if (typeof sel === 'string') {
        await waitForEl(sel, { timeout: 8000 })
      } else if (typeof sel === 'function') {
        // 轮询直到函数返回 HTMLElement
        let el = sel()
        let t = 0
        while (!el && t < 8000) { await sleep(100); el = sel(); t += 100 }
      }
    }

    host.steps.value = steps
    await nextTick()
    host.current.value = 0
    host.open.value = true
  },

  stop() { if (host) host.open.value = false },

  onChange(i: number) {
    // 可在此写埋点：console.log('tour_step', i)
  },
  onFinish() {
    markDone('onboarding.home')
    // console.log('tour_finish')
  },
  onClose() {
    // console.log('tour_close')
  },
}
```

### 3) 步骤清单（数据驱动）：`tour.registry.ts`

集中定义所有引导流程的步骤数据。每个步骤包含目标锚点、标题、描述等信息。

```typescript
// src/tour/tour.registry.ts
export type TourStep = {
  id: string
  target: string | (() => HTMLElement | null)
  title: string
  description?: string
  placement?: 'top'|'right'|'bottom'|'left'|'center'
}

export const OnboardingHomeSteps: TourStep[] = [
  {
    id: 'home.create',
    target: '#btn-create',                 // 业务组件上加 id="btn-create"
    title: '创建资源',
    description: '从这里发起新建流程',
    placement: 'right',
  },
  {
    id: 'home.filter',
    target: () => document.querySelector('[data-tour="home-filter"]') as HTMLElement,
    title: '筛选与搜索',
    description: '支持关键字与高级过滤',
    placement: 'bottom',
  },
  {
    id: 'home.table',
    target: () => document.querySelector('.main-table .ant-table, .el-table') as HTMLElement,
    title: '结果列表',
    description: '在这里查看和批量操作结果',
    placement: 'top',
  },
]
```

### 4) 工具函数：`utils.ts`

提供通用的辅助函数，如 `waitForEl` 用于等待 DOM 元素出现。

```typescript
// src/tour/utils.ts
export function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export function waitForEl(selector: string, opts?: { timeout?: number; interval?: number }) {
  const timeout = opts?.timeout ?? 5000
  const interval = opts?.interval ?? 100
  return new Promise<HTMLElement>((resolve, reject) => {
    const start = Date.now()
    const timer = setInterval(() => {
      const el = document.querySelector(selector) as HTMLElement | null
      if (el) { clearInterval(timer); resolve(el) }
      else if (Date.now() - start > timeout) { clearInterval(timer); reject(new Error(`waitForEl timeout: ${selector}`)) }
    }, interval)
  })
}
```

### 5) 本地一次性开关：`storage.ts`

使用 `localStorage` 记录已完成的引导，确保每个用户只触发一次。

```typescript
// src/tour/storage.ts
const KEY = 'tour_done_flags'

function read(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function write(obj: Record<string, boolean>) { localStorage.setItem(KEY, JSON.stringify(obj)) }

export function shouldRun(flag: string) {
  const obj = read()
  return !obj[flag]  // 未完成才运行
}

export function markDone(flag: string) {
  const obj = read()
  obj[flag] = true
  write(obj)
}
```

### 6) 路由接入：`router/index.ts`

通过 Vue Router 的 `afterEach` 导航守卫，在进入特定页面时自动触发对应的引导流程。

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue' // 假设 Home 视图存在
import { TourService } from '@/tour/tour.service'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'home', component: Home }],
})

router.afterEach((to) => {
  if (to.name === 'home') {
    // 首次进入 Home 触发新手引导
    setTimeout(() => TourService.start('onboarding.home'), 0)
  }
})

export default router
```

### 7) 主入口与挂载

在 `main.ts` 中引入依赖，并在根组件 `App.vue` 中挂载全局宿主 `<AppTourHost>`。

**`main.ts`**
```typescript
// src/main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
```

**`App.vue`**```vue
<!-- src/App.vue -->
<template>
  <RouterView />
  <AppTourHost />   <!-- 全局唯一宿主 -->
</template>

<script setup lang="ts">
import AppTourHost from '@/components/AppTourHost.vue'
</script>
```

### 8) 业务组件只暴露锚点

业务组件（如 `Home.vue`）内部无需任何与 Tour 相关的逻辑，只需在指定元素上添加 `id` 或 `data-tour` 属性作为引导的目标锚点即可。

**`Home.vue` (示例)**
```vue
<!-- src/views/Home.vue -->
<template>
  <div class="toolbar">
    <el-button id="btn-create" type="primary">新建</el-button>
    <el-input data-tour="home-filter" placeholder="搜索关键字..." style="width: 220px" />
  </div>

  <el-table class="main-table" :data="rows">
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="owner" label="负责人" />
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const rows = ref([{ name: '任务 A', owner: '张三' }])
</script>
```

## 关键特性说明

*   **集中式管理**：所有步骤的修改、顺序调整、样式统一等都在 `tour/` 目录下完成，业务组件保持纯净，只需确保锚点稳定。
*   **支持异步和复杂场景**：通过将 `target` 属性设置为函数并结合 `waitForEl()` 轮询，可以完美支持动态渲染、延时加载或深层嵌套的组件，避免因元素未及时渲染而导致引导失败。
*   **自动滚动对齐**：`scroll-into-view-options` 属性确保目标元素能自动滚动到视窗中央，提升用户体验和稳定性。
*   **事件统一处理**：`change`, `finish`, `close` 等事件在宿主组件中统一监听，便于未来接入埋点系统或 A/B 测试框架。
*   **一次性触发**：利用 `localStorage` 标记已完成的引导，避免对用户造成重复干扰。

---