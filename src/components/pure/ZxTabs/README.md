# ZxTabs 标签页组件

基于 Element Plus 的 Tabs 组件封装，提供更丰富的功能和更好的用户体验。

## 功能特性

- ✅ 支持多种标签页类型（line、card、border-card）
- ✅ 支持可编辑标签页（添加/删除）
- ✅ 支持拖拽排序
- ✅ 支持垂直布局
- ✅ 支持延迟加载
- ✅ 支持 URL 参数同步
- ✅ 支持自定义标签页内容
- ✅ 支持加载状态显示
- ✅ 支持标签页拉伸
- ✅ 响应式设计
- ✅ 暗色主题适配

## 基础用法

```vue
<template>
  <ZxTabs v-model="activeTab" :tabs="tabs" />
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('tab1')
const tabs = ref([
  { name: 'tab1', label: '标签页1', content: '内容1' },
  { name: 'tab2', label: '标签页2', content: '内容2' }
])
</script>
```

## API

### Props

| 参数        | 说明             | 类型    | 可选值                | 默认值 |
| ----------- | ---------------- | ------- | --------------------- | ------ |
| modelValue  | 当前激活的标签页 | String  | -                     | -      |
| tabs        | 标签页数据       | Array   | -                     | []     |
| type        | 标签页类型       | String  | line/card/border-card | line   |
| tabPosition | 标签页位置       | String  | top/right/bottom/left | top    |
| editable    | 是否可编辑       | Boolean | -                     | false  |
| addable     | 是否可添加       | Boolean | -                     | false  |
| closable    | 是否可关闭       | Boolean | -                     | false  |
| stretch     | 是否拉伸         | Boolean | -                     | false  |
| lazy        | 是否延迟加载     | Boolean | -                     | false  |
| loading     | 是否显示加载状态 | Boolean | -                     | false  |
| syncUrl     | 是否同步URL参数  | Boolean | -                     | false  |
| urlParam    | URL参数名        | String  | -                     | 'tab'  |
| draggable   | 是否可拖拽       | Boolean | -                     | false  |

### Tabs 数据结构

```javascript
{
  name: 'tab1',        // 标签页标识
  label: '标签页1',     // 标签页标题
  content: '内容1',     // 标签页内容
  disabled: false,     // 是否禁用
  closable: true,      // 是否可关闭
  lazy: false,         // 是否延迟加载
  icon: 'Edit'         // 图标名称
}
```

### Events

| 事件名            | 说明             | 回调参数                                      |
| ----------------- | ---------------- | --------------------------------------------- |
| update:modelValue | 标签页切换时触发 | (name: string)                                |
| tab-click         | 标签页点击时触发 | (tab: object, event: Event)                   |
| tab-remove        | 标签页删除时触发 | (name: string)                                |
| tab-add           | 添加标签页时触发 | ()                                            |
| edit              | 编辑标签页时触发 | (targetName: string, action: 'add'\|'remove') |
| tab-change        | 标签页改变时触发 | (name: string)                                |

### Slots

| 插槽名     | 说明                 | 参数           |
| ---------- | -------------------- | -------------- |
| default    | 默认插槽，标签页内容 | { tab, index } |
| label      | 标签页标题插槽       | { tab, index } |
| tab-{name} | 特定标签页内容插槽   | { tab, index } |

## 使用示例

### 卡片类型

```vue
<ZxTabs v-model="activeTab" :tabs="tabs" type="card" />
```

### 可编辑标签页

```vue
<ZxTabs
  v-model="activeTab"
  :tabs="tabs"
  editable
  @tab-remove="handleTabRemove"
  @tab-add="handleTabAdd"
/>
```

### 垂直布局

```vue
<ZxTabs v-model="activeTab" :tabs="tabs" tab-position="left" />
```

### 拖拽排序

```vue
<ZxTabs v-model="activeTab" :tabs="tabs" draggable />
```

### URL 同步

```vue
<ZxTabs v-model="activeTab" :tabs="tabs" sync-url url-param="activeTab" />
```

## 样式定制

组件支持通过 CSS 变量进行样式定制：

```css
.zx-tabs {
  --zx-tabs-header-bg: #ffffff;
  --zx-tabs-border-color: #e4e7ed;
  --zx-tabs-active-color: #409eff;
  --zx-tabs-hover-color: #66b1ff;
  --zx-tabs-text-color: #303133;
  --zx-tabs-disabled-color: #c0c4cc;
}
```

## 注意事项

1. 使用可编辑功能时，需要监听相关事件并更新 tabs 数据
2. 拖拽功能需要确保标签页数据的 name 字段唯一
3. URL 同步功能会自动处理浏览器前进后退
4. 延迟加载的标签页内容只有在首次激活时才会渲染

## 版本信息

- 版本：1.0.0
- 基于：Element Plus Tabs
- 兼容：Vue 3.x
