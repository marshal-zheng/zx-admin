# Pure 组件库统一全局注册

本目录包含了项目中的 Pure 组件库，现已支持统一的全局注册功能。

## 🚀 快速开始

### 全局注册所有组件

```javascript
// main.js
import { createApp } from 'vue'
import PureComponents from '@/components/pure'
import App from './App.vue'

const app = createApp(App)

// 方式1: 直接使用组件库的 install 方法
app.use(PureComponents)

// 方式2: 使用封装的插件（推荐）
import { setupPureComponents } from '@/plugins/pure-components.js'
setupPureComponents(app)

app.mount('#app')
```

### 按需注册组件

```javascript
// 单独注册某个组件
import { ZxIcon, ZxSearch } from '@/components/pure'

app.use(ZxIcon)
app.use(ZxSearch)

// 或使用按需注册插件
import { setupPureComponentsSelective } from '@/plugins/pure-components.js'
setupPureComponentsSelective(app, ['ZxIcon', 'ZxSearch'])
```

## 📦 包含的组件

| 组件名             | 描述            | 全局注册名             |
| ------------------ | --------------- | ---------------------- |
| ZxIcon             | 图标组件        | `<ZxIcon>`             |
| ZxSearch           | 搜索组件        | `<ZxSearch>`           |
| ZxSelect           | 选择器组件      | `<ZxSelect>`           |
| ZxTooltipOrPopover | 提示/弹出框组件 | `<ZxTooltipOrPopover>` |
| ZxPureRouterView   | 路由视图组件    | `<ZxPureRouterView>`   |

## 🔧 组件特性

- ✅ **Vue 3 兼容**: 基于 Composition API 开发
- ✅ **Element Plus 集成**: 完美兼容 Element Plus 技术栈
- ✅ **TypeScript 支持**: 提供完整的类型定义
- ✅ **统一注册**: 支持一键注册所有组件
- ✅ **按需加载**: 支持单独注册特定组件
- ✅ **自动导入**: 配合 unplugin-vue-components 实现自动导入

## 📖 使用示例

### ZxIcon 图标组件

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <ZxIcon icon="Edit" />

    <!-- 自定义大小和颜色 -->
    <ZxIcon icon="Delete" size="24" color="#F56C6C" />

    <!-- 悬停效果 -->
    <ZxIcon icon="Search" hover-color="#409EFF" />
  </div>
</template>
```

### ZxSearch 搜索组件

```vue
<template>
  <ZxSearch v-model="searchValue" placeholder="请输入搜索内容" @search="handleSearch" />
</template>

<script setup>
import { ref } from 'vue'

const searchValue = ref('')

const handleSearch = (value) => {
  console.log('搜索:', value)
}
</script>
```

### ZxSelect 选择器组件

```vue
<template>
  <ZxSelect v-model="selectValue" :options="options" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'

const selectValue = ref('')
const options = ref([
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' }
])
</script>
```

## 🛠️ 开发指南

### 添加新组件

1. 在对应目录下创建组件文件 `index.vue`
2. 添加 `defineOptions({ name: 'ComponentName' })`
3. 创建 `index.js` 文件提供 install 方法：

```javascript
import ComponentName from './index.vue'

ComponentName.install = function (app) {
  app.component(ComponentName.name, ComponentName)
}

export default ComponentName
export { ComponentName }
```

4. 在 `pure/index.js` 中添加导入和导出

### 组件规范

- 使用 `<script setup>` 语法
- 通过 `defineOptions` 定义组件名称
- 提供完整的 Props 类型定义
- 使用 SCSS 进行样式开发
- 遵循 Element Plus 设计规范

## 🔍 演示页面

访问以下路由查看组件演示：

- `/icon-demo` - ZxIcon 组件演示
- `/pure-components-demo` - 所有 Pure 组件演示

## 📝 更新日志

### v1.0.0

- ✨ 新增统一全局注册功能
- ✨ 为所有组件添加 install 方法
- ✨ 创建统一的注册插件
- ✨ 添加演示页面和文档
- 🔧 优化组件导入路径
- 🔧 统一组件命名规范

## 🤝 贡献指南

1. 遵循现有的代码规范
2. 确保组件具有良好的可复用性
3. 提供完整的类型定义
4. 添加必要的测试用例
5. 更新相关文档
