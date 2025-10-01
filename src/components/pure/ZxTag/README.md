# ZxTag 标签组件

用于标记和选择的标签组件，基于 Element Plus 的 Tag 组件进行封装，提供了更丰富的功能和更好的用户体验。

## 特性

- 🎨 **多种主题**: 支持 light、dark、plain 三种主题风格
- 📏 **多种尺寸**: 支持 large、default、small 三种尺寸
- 🎯 **多种类型**: 支持 success、info、warning、danger 四种类型
- 🔧 **高度可定制**: 支持自定义颜色、样式、宽度等
- 📱 **响应式设计**: 支持移动端适配
- 🏷️ **标签组功能**: 提供 ZxTagGroup 组件支持批量标签展示
- 💡 **智能提示**: 支持 tooltip 提示功能
- ✂️ **文本截断**: 超长文本自动截断并显示省略号

## 基础用法

### 单个标签

```vue
<template>
  <ZxTag>默认标签</ZxTag>
  <ZxTag type="success">成功标签</ZxTag>
  <ZxTag type="info">信息标签</ZxTag>
  <ZxTag type="warning">警告标签</ZxTag>
  <ZxTag type="danger">危险标签</ZxTag>
</template>
```

### 不同主题

```vue
<template>
  <!-- 浅色主题 -->
  <ZxTag theme="light" type="success">浅色主题</ZxTag>

  <!-- 深色主题 -->
  <ZxTag theme="dark" type="success">深色主题</ZxTag>

  <!-- 朴素主题 -->
  <ZxTag theme="plain" type="success">朴素主题</ZxTag>
</template>
```

### 不同尺寸

```vue
<template>
  <ZxTag size="large">大尺寸</ZxTag>
  <ZxTag size="default">默认尺寸</ZxTag>
  <ZxTag size="small">小尺寸</ZxTag>
</template>
```

### 可关闭标签

```vue
<template>
  <ZxTag closable @close="handleClose">可关闭标签</ZxTag>
</template>

<script setup>
const handleClose = () => {
  console.log('标签被关闭')
}
</script>
```

### 自定义颜色

```vue
<template>
  <ZxTag color="#f50">自定义红色</ZxTag>
  <ZxTag color="#2db7f5">自定义蓝色</ZxTag>
</template>
```

### 带图标的标签

```vue
<template>
  <ZxTag type="success">
    <template #icon>
      <el-icon><Check /></el-icon>
    </template>
    成功标签
  </ZxTag>
</template>
```

## 标签组用法

### 字符串数组标签组

```vue
<template>
  <ZxTagGroup :tag-list="['Vue.js', 'React', 'Angular']" :show-num="2" is-string-tag />
</template>
```

### 对象数组标签组

```vue
<template>
  <ZxTagGroup :tag-list="tags" :show-num="3" name-key="label" tag-type="success" />
</template>

<script setup>
const tags = [
  { id: 1, label: '前端开发' },
  { id: 2, label: '后端开发' },
  { id: 3, label: '全栈开发' }
]
</script>
```

### 可编辑标签组

```vue
<template>
  <ZxTagGroup :tag-list="tags" allow-edit @click="handleEdit" />
</template>
```

## API

### ZxTag Props

| 参数            | 说明               | 类型    | 可选值                      | 默认值  |
| --------------- | ------------------ | ------- | --------------------------- | ------- |
| type            | 标签类型           | string  | success/info/warning/danger | info    |
| size            | 标签尺寸           | string  | large/default/small         | default |
| theme           | 标签主题           | string  | dark/light/plain            | light   |
| closable        | 是否可关闭         | boolean | —                           | false   |
| round           | 是否为圆角         | boolean | —                           | false   |
| color           | 自定义颜色         | string  | —                           | —       |
| width           | 标签宽度（字符数） | number  | —                           | —       |
| maxWidth        | 最大宽度           | string  | —                           | 144px   |
| noMargin        | 是否移除右边距     | boolean | —                           | false   |
| tooltipDisabled | 是否禁用提示       | boolean | —                           | false   |
| selfStyle       | 自定义样式         | object  | —                           | {}      |

### ZxTag Events

| 事件名 | 说明           | 回调参数 |
| ------ | -------------- | -------- |
| close  | 关闭标签时触发 | —        |
| click  | 点击标签时触发 | —        |

### ZxTag Slots

| 插槽名         | 说明           |
| -------------- | -------------- |
| default        | 标签内容       |
| icon           | 标签图标       |
| tooltipContent | 自定义提示内容 |

### ZxTagGroup Props

| 参数        | 说明               | 类型    | 可选值                      | 默认值  |
| ----------- | ------------------ | ------- | --------------------------- | ------- |
| tagList     | 标签列表           | array   | —                           | []      |
| showNum     | 显示标签数量       | number  | —                           | 2       |
| nameKey     | 对象数组的显示字段 | string  | —                           | name    |
| isStringTag | 是否为字符串数组   | boolean | —                           | false   |
| size        | 标签尺寸           | string  | large/default/small         | default |
| allowEdit   | 是否允许编辑       | boolean | —                           | false   |
| showTable   | 是否为表格模式     | boolean | —                           | false   |
| tagPosition | 提示位置           | string  | top/bottom/left/right等     | top     |
| tagType     | 标签类型           | string  | success/info/warning/danger | info    |
| tagTheme    | 标签主题           | string  | dark/light/plain            | light   |

### ZxTagGroup Events

| 事件名 | 说明             | 回调参数 |
| ------ | ---------------- | -------- |
| click  | 点击标签组时触发 | —        |

## 样式定制

组件使用 CSS 变量进行样式定制，你可以通过覆盖以下变量来自定义样式：

```css
:root {
  --zx-tag-margin-small: 2px;
  --zx-tag-margin-default: 3px;
  --zx-tag-margin-large: 4px;
  --zx-tag-max-width: 144px;
  --zx-tag-mobile-max-width: 120px;
}
```

## 注意事项

1. **响应式设计**: 组件在移动端会自动调整最大宽度，确保在小屏幕上的显示效果
2. **文本截断**: 当标签文本过长时，会自动截断并显示省略号，鼠标悬停可查看完整内容
3. **性能优化**: 标签组在大量数据时会自动限制显示数量，剩余标签通过 "+N" 的形式展示
4. **主题兼容**: 组件样式与 Element Plus 主题系统兼容，支持暗色模式

## 兼容性

- Vue 3.0+
- Element Plus 2.0+
- 现代浏览器（Chrome 60+, Firefox 60+, Safari 12+, Edge 79+）
