# Widget 异步加载组件（零映射维护）

## 概述

Widget 是一个基于 Vue 3 + Vite 的异步组件加载器。新版实现使用 Vite 的 import.meta.glob 自动发现组件，构建期即可收集依赖，彻底避免“开发可用、打包 404”的动态导入路径问题，无需再手动维护映射表。

核心特性：

- ✅ 零配置自动发现：默认扫描本目录 `components/**/*.vue`
- ✅ Dev/Prod 一致：开发与构建模式行为一致，打包后可正常按需加载
- ✅ 代码分割：每个 Widget 独立 chunk，天然懒加载
- ✅ 体验友好：内置 Suspense、加载态、错误态、超时控制
- ✅ 友好调用：支持 `name`（业务别名）或 `path`，无需记具体路径
- ✅ 路径兼容：支持多种 `path` 写法（见下文）

## 目录结构

```
Widget/
├── index.js               # 导出入口
├── AsyncLoadComp.vue      # 核心组件（基于 import.meta.glob）
├── components/            # 放置可异步加载的 Widget 组件（默认扫描目录）
│   └── EChartsWidget.vue
└── README.md
```

## 快速使用

```js
import { AsyncLoadComp } from '@/components/business/Widget'
```

```vue
<template>
  <AsyncLoadComp name="echarts" :props="widgetProps" :data="widgetData" />
</template>

<script setup>
import { ref } from 'vue'
import { AsyncLoadComp } from '@/components/business/Widget'

// 也可使用 path：'echarts' / 'components/EChartsWidget.vue'
const widgetProps = ref({ title: '图表组件' })
const widgetData = ref({ type: 'line' })
</script>
```

## Name/Path 优先级与解析规则

解析优先级：`name` > `path`

1. Name（业务别名，大小写不敏感）

   - 在同目录下创建可选文件 `widget.aliases.ts|js`，默认导出一个映射：
     ```ts
     export default {
       echarts: 'components/EChartsWidget.vue'
     }
     ```
   - 使用：`<AsyncLoadComp name="echarts" />`

2. Path（多种写法均可）

3. 完整相对路径：`'./components/Foo.vue'`
4. 省略 `./` 前缀：`'components/Foo.vue'`
5. 仅基名（含/不含后缀）：`'Foo'` 或 `'Foo.vue'`
6. kebab/camel 自动转 PascalCase：`'foo'`、`'foo-bar'` → `Foo.vue`、`FooBar.vue`

注意：默认仅扫描 `./components/**/*.vue`，请将可加载的 Widget 放到该目录；若你需要跨目录加载，见下节“扩展扫描范围”。

## 扩展扫描范围（可选）

当前实现：

```js
// AsyncLoadComp.vue 内部（已实现）
const modules = import.meta.glob('./components/**/*.vue')
```

如需同时扫描其它目录（例如页面下的 widgets），可以按需扩展为多模式：

```js
// 示例：扩展扫描多个目录
const modules = import.meta.glob([
  './components/**/*.vue',
  '../../pages/dashboard/widgets/**/*.vue'
])
```

工程最佳实践建议：

- 建立“专用 Widget 仓位”（即本目录 `components/`），将可动态加载的 UI 按此收纳，降低构建不确定性
- 若确有跨域需求，也建议限定到特定 widgets 子树，避免全局通配导致包体不可控

## API 参考

Props：

| 参数  | 类型   | 必填 | 默认值 | 说明                                                       |
| ----- | ------ | ---- | ------ | ---------------------------------------------------------- |
| name  | String | ❌   | -      | 业务友好名（在 widget.aliases.ts/js 中配置），大小写不敏感 |
| path  | String | ✅   | -      | 要加载的组件标识或路径（遵循上面的解析规则）               |
| props | Object | ❌   | {}     | 透传给目标组件的 props 对象                                |
| data  | Object | ❌   | {}     | 透传给目标组件的 data 对象                                 |

行为配置：

- 延迟显示加载：200ms（避免闪烁）
- 超时：30s（考虑首包与慢网，较宽松）
- 错误组件：内置错误提示（不影响页面其它区域）

## 常见用法示例

条件加载：

```vue
<template>
  <AsyncLoadComp v-if="show" name="echarts" :props="{ size: 'small' }" />
  <el-button @click="show = !show">Toggle</el-button>
</template>
<script setup>
import { ref } from 'vue'
import { AsyncLoadComp } from '@/components/business/Widget'
const show = ref(false)
</script>
```

列表渲染：

```vue
<template>
  <div class="grid">
    <AsyncLoadComp
      v-for="w in widgets"
      :key="w.id"
      :name="w.name"
      :props="w.props"
      :data="w.data"
    />
  </div>
</template>
<script setup>
import { AsyncLoadComp } from '@/components/business/Widget'
const widgets = [
  { id: 'a', name: 'echarts', props: { title: 'Chart A', type: 'line' }, data: {} },
  { id: 'b', name: 'echarts', props: { title: 'Chart B', type: 'bar' }, data: {} }
]
</script>
```

## 样式定制

```scss
.async-load-comp {
  .loading { color: var(--el-color-primary); }
  .error   { color: var(--el-color-danger); font-size: 14px; }
}
``;

## 工程最佳实践（对齐一线大厂）

- 目录约定优于配置：统一把可动态加载的组件放在 `Widget/components`，保证可维护性与可预估的包体
- 统一命名规范：文件名用 PascalCase（如 `UserCard.vue`），避免同名不同目录导致歧义；内部已在歧义时 `console.warn`
- 可演进的扫描范围：如确需跨目录，明确且最小化匹配（使用精确子树通配），避免 `**/*.vue` 全局扫描
- 组件保持原子化：Widget 尽量只依赖必要子模块，减少首屏等待；避免在 Widget 中引入重量级依赖
- 构建可观测：打包后 chunk 名来自文件路径，便于排查；如需进一步控制，可通过 Vite/Rollup 的 `manualChunks` 策略

## 故障排查

组件未找到：
- 确认组件已放在默认扫描目录 `Widget/components`
- 检查 `path` 是否与命名规则匹配（尝试 `Foo`、`foo`、`foo-bar` 与 `Foo.vue`）
- 控制台会给出“未找到/歧义”提示

加载慢：
- 首次懒加载需要网络请求，建议合理拆分组件、避免大依赖
- 需要更长时间可自行上调超时（当前 30s）

Props 问题：
- 组件内使用 `v-bind="{ ...props, data }"` 透传，请确认目标组件已定义对应 props

## 版本信息

- Vue: 3.3.x+
- Element Plus: 2.x
- Vite: 4.x/5.x（均支持 import.meta.glob）

## 实现方案（总结）

为解决“开发可用、打包后 404”的根因——构建后无法在运行时解析任意相对路径，本组件采用如下方案：

1. 构建期收集依赖：使用 `import.meta.glob('./components/**/*.vue')` 让 Vite 在打包时静态收集并为每个文件生成懒加载入口（独立 chunk）。
2. 运行时解析路径：对传入的 `path` 做容错解析（完整路径/省略前缀/基名/kebab→PascalCase），并在出现歧义时发出告警。
3. 按需加载：结合 `defineAsyncComponent` 与 `Suspense`，提供加载态、错误态与超时控制，确保用户体验与可维护性。

该方案在开发和生产模式均具备确定性，是目前 Vite 生态下的工程最佳实践。
```
