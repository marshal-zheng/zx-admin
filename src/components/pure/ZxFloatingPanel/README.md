# ZxFloatingPanel 浮动面板组件

一个现代化的可折叠容器组件，采用毛玻璃效果和流畅动画，提供丰富的功能特性和优秀的用户体验。

## 功能特性

- ✅ **现代化设计**: 毛玻璃效果、渐变背景、流畅动画
- ✅ **TypeScript 支持**: 完整的类型定义和类型安全
- ✅ **可折叠展开**: 支持点击标题栏或按钮进行折叠/展开操作
- ✅ **拖拽移动**: 支持拖拽头部区域来移动面板位置，展开和收起状态均可拖拽
- ✅ **智能交互**: 收起状态下整个圆形区域都可点击展开，带有丰富的hover效果
- ✅ **自定义标题**: 支持文本标题和自定义标题插槽
- ✅ **操作按钮**: 支持自定义操作按钮插槽
- ✅ **加载状态**: 内置加载状态显示和管理
- ✅ **响应式设计**: 完美适配不同屏幕尺寸
- ✅ **主题跟随**: 自动跟随系统主题，基于 Element Plus 品牌色变量
- ✅ **事件回调**: 提供完整的事件回调机制
- ✅ **外部控制**: 支持通过 ref 调用方法进行外部控制
- ✅ **灵活布局**: 支持自定义样式类和内联样式
- ✅ **无障碍访问**: 支持键盘导航和屏幕阅读器

## 基础用法

```vue
<template>
  <ZxFloatingPanel title="基础容器">
    <p>这里是容器内容</p>
  </ZxFloatingPanel>
</template>
```

## 高级用法

### 自定义标题和操作按钮

```vue
<template>
  <ZxFloatingPanel>
    <template #title>
      <div class="custom-title">
        <el-icon><Document /></el-icon>
        <span>自定义标题</span>
      </div>
    </template>

    <template #actions>
      <el-button size="small" type="primary">保存</el-button>
      <el-button size="small">取消</el-button>
    </template>

    <div class="content">
      <p>自定义内容区域</p>
    </div>
  </ZxFloatingPanel>
</template>
```

### 加载状态和响应式

```vue
<template>
  <ZxFloatingPanel
    title="数据加载中"
    :loading="isLoading"
    :header-clickable="true"
    custom-class="my-container"
    @toggle="handleToggle"
    @header-click="handleHeaderClick"
  >
    <div v-if="!isLoading">
      <p>数据加载完成</p>
    </div>
  </ZxFloatingPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(true)

const handleToggle = (collapsed: boolean) => {
  console.log('容器状态:', collapsed ? '已折叠' : '已展开')
}

const handleHeaderClick = () => {
  console.log('标题栏被点击')
}

// 模拟数据加载
setTimeout(() => {
  isLoading.value = false
}, 2000)
</script>
```

### 外部控制和自定义样式

```vue
<template>
  <div>
    <el-button @click="toggleContainer">切换容器状态</el-button>
    <el-button @click="expandContainer">展开容器</el-button>
    <el-button @click="collapseContainer">折叠容器</el-button>

    <ZxFloatingPanel
      ref="containerRef"
      title="外部控制容器"
      :default-collapsed="false"
      :auto-expand="autoExpand"
      :collapse-icon="customIcon"
      :style="containerStyle"
      @after-toggle="handleAfterToggle"
    >
      <p>可以通过外部按钮控制的容器</p>
    </ZxFloatingPanel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const containerRef = ref()
const autoExpand = ref(false)
const customIcon = ArrowDown

const containerStyle = computed(() => ({
  width: '600px',
  height: '400px'
}))

const toggleContainer = () => {
  containerRef.value?.toggle()
}

const expandContainer = () => {
  containerRef.value?.expand()
}

const collapseContainer = () => {
  containerRef.value?.collapse()
}

const handleAfterToggle = (collapsed: boolean) => {
  console.log('切换动画完成:', collapsed)
}
</script>
```

## API 文档

### Props

| 参数             | 说明             | 类型        | 默认值       |
| ---------------- | ---------------- | ----------- | ------------ |
| title            | 容器标题         | `string`    | `''`         |
| defaultCollapsed | 默认是否折叠     | `boolean`   | `false`      |
| loading          | 是否显示加载状态 | `boolean`   | `false`      |
| autoExpand       | 是否自动展开     | `boolean`   | `false`      |
| headerClickable  | 标题栏是否可点击 | `boolean`   | `false`      |
| collapseIcon     | 折叠图标组件     | `Component` | `ArrowRight` |
| customClass      | 自定义样式类     | `string`    | `''`         |

### Events

| 事件名       | 说明               | 参数                   |
| ------------ | ------------------ | ---------------------- |
| toggle       | 折叠状态改变时触发 | `(collapsed: boolean)` |
| header-click | 标题栏点击时触发   | `()`                   |
| after-toggle | 折叠动画完成后触发 | `(collapsed: boolean)` |

### Methods

| 方法名   | 说明         | 参数 |
| -------- | ------------ | ---- |
| toggle   | 切换折叠状态 | `()` |
| expand   | 展开容器     | `()` |
| collapse | 折叠容器     | `()` |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 容器内容       |
| title   | 自定义标题内容 |
| actions | 自定义操作按钮 |

### CSS 变量

组件支持通过 CSS 变量进行主题定制：

```css
:root {
  /* 基础尺寸 */
  --cmp-container-min-width: 320px;
  --cmp-container-header-height: 56px;
  --cmp-container-border-radius: 16px;

  /* 颜色系统 */
  --cmp-container-background: rgba(255, 255, 255, 0.95);
  --cmp-container-border-color: rgba(255, 255, 255, 0.2);
  --cmp-container-header-background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );

  /* 动画系统 */
  --cmp-transition-duration: 0.3s;
  --cmp-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 注意事项

1. **TypeScript 支持**: 组件完全支持 TypeScript，建议在 TypeScript 项目中使用
2. **响应式设计**: 组件会根据屏幕尺寸自动调整布局和样式
3. **性能优化**: 使用了 `nextTick` 确保 DOM 更新后再执行相关操作
4. **无障碍访问**: 支持键盘导航，建议为重要操作添加适当的 ARIA 标签
5. **浏览器兼容**: 支持现代浏览器，使用了 CSS Grid 和 Flexbox 布局

## API 参考

### Props

| 参数       | 说明                     | 类型    | 默认值 | 必填 |
| ---------- | ------------------------ | ------- | ------ | ---- |
| width      | 容器宽度（展开状态）     | Number  | 300    | 否   |
| title      | 容器标题                 | String  | '容器' | 否   |
| collapsed  | 是否折叠（支持 v-model） | Boolean | false  | 否   |
| loading    | 是否显示加载状态         | Boolean | false  | 否   |
| autoExpand | 是否自动展开             | Boolean | false  | 否   |

### Events

| 事件名           | 说明                                | 参数                 |
| ---------------- | ----------------------------------- | -------------------- |
| toggle           | 切换展开/收起状态时触发             | (collapsed: boolean) |
| update:collapsed | 更新 collapsed 状态（用于 v-model） | (collapsed: boolean) |

### Methods

通过 ref 可以调用以下方法：

| 方法名     | 说明              | 参数 |
| ---------- | ----------------- | ---- |
| toggle()   | 切换展开/收起状态 | -    |
| expand()   | 展开容器          | -    |
| collapse() | 收起容器          | -    |

### Slots

| 插槽名  | 说明         |
| ------- | ------------ |
| default | 容器内容区域 |

## 样式定制

组件使用 SCSS 编写样式，支持以下 CSS 变量定制：

```scss
.zx-collapsible-container {
  // 自定义背景色
  background: var(--container-bg-color, #fff);

  // 自定义边框圆角
  border-radius: var(--container-border-radius, 8px);

  // 自定义阴影
  box-shadow: var(--container-box-shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.1));

  // 自定义过渡时间
  transition: width var(--container-transition-duration, 0.3s) ease;
}
```

## 注意事项

1. **定位要求**: 组件使用绝对定位，父容器需要设置 `position: relative`
2. **高度设置**: 父容器需要设置明确的高度，组件会占满父容器高度
3. **响应式**: 在移动端会自动切换为全屏模式
4. **性能优化**: 大量内容时建议使用虚拟滚动或分页加载
5. **浏览器兼容**: 支持现代浏览器，IE11+ 需要 polyfill

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础的展开收起功能
- 支持加载状态和自动展开
- 支持外部方法调用
- 支持响应式设计
