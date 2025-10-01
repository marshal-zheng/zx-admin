# ZxDrawer 抽屉组件

基于 Element Plus 的抽屉组件，支持宽度拖拽、全屏切换等功能。

## 功能特性

- ✅ 基于 Element Plus el-drawer 组件
- ✅ 支持宽度拖拽调整
- ✅ 支持全屏切换
- ✅ 支持自定义标题和操作按钮
- ✅ 响应式设计，适配移动端
- ✅ 支持暗色主题
- ✅ TypeScript 类型支持

## 基础用法

```vue
<template>
  <div>
    <el-button @click="drawer = true">打开抽屉</el-button>

    <ZxDrawer v-model="drawer" title="基础抽屉" :width="600">
      <p>这是抽屉内容</p>
    </ZxDrawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ZxDrawer from '@/components/pure/ZxDrawer'

const drawer = ref(false)
</script>
```

## 高级用法

### 可拖拽宽度

```vue
<template>
  <ZxDrawer
    v-model="drawer"
    title="可拖拽抽屉"
    :width="800"
    :resizable="true"
    :min-width="400"
    :max-width="1200"
  >
    <p>拖拽右边框可以调整宽度</p>
  </ZxDrawer>
</template>
```

### 全屏功能

```vue
<template>
  <ZxDrawer v-model="drawer" title="支持全屏" :width="600" :show-fullscreen="true">
    <p>点击全屏按钮可以全屏显示</p>
  </ZxDrawer>
</template>
```

### 自定义操作按钮

```vue
<template>
  <ZxDrawer v-model="drawer" title="自定义操作" :width="600">
    <template #header-actions>
      <el-button size="small" @click="handleSave">保存</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </template>

    <p>自定义头部操作按钮</p>
  </ZxDrawer>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| modelValue / v-model | 是否显示抽屉 | boolean | — | false |
| title | 抽屉标题 | string | — | — |
| width | 抽屉宽度 | number \| string | — | 30% |
| direction | 抽屉打开方向 | string | rtl / ltr / ttb / btt | rtl |
| modal | 是否显示遮罩层 | boolean | — | true |
| appendToBody | 是否插入到 body 元素上 | boolean | — | false |
| lockScroll | 是否在抽屉出现时将 body 滚动锁定 | boolean | — | true |
| closeOnClickModal | 是否可以通过点击遮罩关闭抽屉 | boolean | — | true |
| closeOnPressEscape | 是否可以通过按下 ESC 关闭抽屉 | boolean | — | true |
| showClose | 是否显示关闭按钮 | boolean | — | true |
| beforeClose | 关闭前的回调 | function | — | — |
| destroyOnClose | 关闭时销毁子元素 | boolean | — | false |
| resizable | 是否可拖拽调整宽度 | boolean | — | false |
| minWidth | 最小宽度（仅在 resizable 为 true 时有效） | number | — | 300 |
| maxWidth | 最大宽度（仅在 resizable 为 true 时有效） | number | — | window.innerWidth \* 0.8 |
| showFullscreen | 是否显示全屏按钮 | boolean | — | false |

### Events

| 事件名            | 说明                   | 回调参数                |
| ----------------- | ---------------------- | ----------------------- |
| update:modelValue | 抽屉显示状态改变时触发 | (value: boolean)        |
| open              | 抽屉打开时触发         | —                       |
| opened            | 抽屉打开动画结束时触发 | —                       |
| close             | 抽屉关闭时触发         | —                       |
| closed            | 抽屉关闭动画结束时触发 | —                       |
| resize            | 拖拽调整宽度时触发     | (width: number)         |
| fullscreen-change | 全屏状态改变时触发     | (isFullscreen: boolean) |

### Slots

| 插槽名         | 说明               |
| -------------- | ------------------ |
| default        | 抽屉内容           |
| header         | 自定义头部内容     |
| header-actions | 自定义头部操作按钮 |
| footer         | 自定义底部内容     |

## 样式定制

组件使用 SCSS 变量，可以通过覆盖以下变量来定制样式：

```scss
// 抽屉背景色
--zx-drawer-bg-color: var(--el-bg-color);

// 头部背景色
--zx-drawer-header-bg: var(--el-bg-color-page);

// 边框颜色
--zx-drawer-border-color: var(--el-border-color-light);

// 拖拽手柄颜色
--zx-drawer-resize-handle-color: var(--el-border-color);

// 阴影
--zx-drawer-box-shadow: var(--el-box-shadow);
```

## 注意事项

1. 组件基于 Element Plus，请确保项目中已正确安装和配置 Element Plus
2. 拖拽功能仅在桌面端有效，移动端会自动禁用
3. 全屏功能会覆盖原有的宽度设置
4. 建议在使用前先了解 Element Plus Drawer 组件的基础用法

## 兼容性

- Vue 3.3+
- Element Plus 2.3+
- 现代浏览器（Chrome 50+, Firefox 50+, Edge 50+）
