# ZxDetailCard 详情卡片组件

## 简介

ZxDetailCard 是一个用于展示详细信息的卡片组件，基于 Vue 3 和 Element Plus 构建。它支持标题展示、描述列表、标签展示、展开收起功能以及自定义插槽等特性。

## 特性

- 🎯 **灵活的数据展示** - 支持文本、标签等多种数据类型展示
- 🔧 **自定义插槽** - 支持通过插槽自定义特定字段的展示内容
- 📱 **响应式设计** - 在不同屏幕尺寸下自动调整布局
- 🎨 **主题定制** - 支持 CSS 变量自定义样式
- ⚡ **展开收起** - 支持设置简单展示数量，超出部分可展开查看
- 🌙 **暗色主题** - 自动适配暗色主题
- 💡 **提示功能** - 长文本自动显示 tooltip 提示

## 基础用法

```vue
<template>
  <ZxDetailCard title="基础详情卡片" :description="description" />
</template>

<script setup>
import ZxDetailCard from '@/components/pure/ZxDetailCard/index.vue'

const description = [
  {
    key: 'name',
    locale: '名称',
    value: '示例项目'
  },
  {
    key: 'type',
    locale: '类型',
    value: 'Web应用'
  }
]
</script>
```

## 高级用法

### 带标签展示

```vue
<template>
  <ZxDetailCard title="项目详情" :description="tagDescription" />
</template>

<script setup>
const tagDescription = [
  {
    key: 'technologies',
    locale: '技术栈',
    value: ['Vue3', 'Element Plus', 'Vite']
  }
]
</script>
```

### 展开收起功能

```vue
<template>
  <ZxDetailCard
    title="完整信息展示"
    :description="fullDescription"
    :simple-show-count="4"
    @expand="handleExpand"
    @collapse="handleCollapse"
  />
</template>
```

### 自定义插槽

```vue
<template>
  <ZxDetailCard title="自定义展示" :description="customDescription">
    <template #status="{ value }">
      <el-tag :type="getStatusType(value)" size="small">
        {{ value }}
      </el-tag>
    </template>
  </ZxDetailCard>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题 | `string` | `''` |
| description | 描述信息列表 | `Description[]` | `[]` |
| simpleShowCount | 简单展示的数量，超过的内容隐藏并显示更多按钮 | `number` | `undefined` |
| padding | 卡片内边距 | `string` | `'20px'` |
| enableBorderRadius | 是否启用圆角 | `boolean` | `false` |

### Description 数据结构

| 参数            | 说明                                     | 类型                 | 默认值  |
| --------------- | ---------------------------------------- | -------------------- | ------- |
| key             | 唯一标识，用于插槽名称                   | `string`             | -       |
| locale          | 显示的标签文本                           | `string`             | -       |
| value           | 显示的值，支持字符串或字符串数组（标签） | `string \| string[]` | -       |
| width           | 自定义宽度                               | `string`             | -       |
| tooltipPosition | tooltip 显示位置                         | `string`             | `'top'` |

### Events

| 事件名   | 说明       | 回调参数 |
| -------- | ---------- | -------- |
| expand   | 展开时触发 | -        |
| collapse | 收起时触发 | -        |

### Slots

| 插槽名      | 说明                                               | 参数        |
| ----------- | -------------------------------------------------- | ----------- |
| titlePrefix | 标题前缀内容                                       | -           |
| titleAppend | 标题后缀内容                                       | -           |
| titleRight  | 标题右侧内容                                       | -           |
| [key]       | 自定义字段展示内容，key 为 description 中的 key 值 | `{ value }` |

## 样式定制

组件使用 CSS 变量进行样式定制，你可以通过覆盖这些变量来自定义样式：

```css
:root {
  --zx-detail-card-bg: #ffffff; /* 背景色 */
  --zx-detail-card-border: 1px solid #e4e7ed; /* 边框 */
  --zx-detail-card-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 阴影 */
  --zx-detail-card-title-color: #303133; /* 标题颜色 */
  --zx-detail-card-label-color: #909399; /* 标签颜色 */
  --zx-detail-card-value-color: #606266; /* 值颜色 */
  --zx-detail-card-padding: 20px; /* 内边距 */
  --zx-detail-card-gap: 16px; /* 间距 */
  --zx-detail-card-border-radius: 8px; /* 圆角大小 */
}
```

## 响应式设计

组件支持响应式布局：

- **桌面端（>1200px）**：每行显示 3 个字段
- **平板端（769px-1200px）**：每行显示 2 个字段
- **移动端（<768px）**：每行显示 1 个字段

## 注意事项

1. **数据格式**：description 数组中的每个对象必须包含 `key`、`locale` 和 `value` 字段
2. **标签展示**：当 `value` 为数组时，会自动使用 ZxTagGroup 组件展示标签
3. **插槽命名**：自定义插槽的名称对应 description 中的 `key` 值
4. **长文本处理**：超长文本会自动截断并显示 tooltip
5. **展开收起**：只有设置了 `simpleShowCount` 且实际数据量超过该值时才会显示更多按钮

## 兼容性

- Vue 3.3+
- Element Plus 2.3+
- 现代浏览器（Chrome 50+, Firefox 50+, Safari 10+）

## 依赖组件

- ZxButton - 更多按钮
- ZxTagGroup - 标签展示
- ZxTooltipOrPopover - 提示功能
- ZxIcon - 图标展示
