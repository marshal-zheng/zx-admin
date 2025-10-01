# ZxInput 增强输入框组件

基于 Element Plus 的增强输入框组件，提供了丰富的功能和更好的用户体验。

## 特性

- 🎯 **多种类型支持** - 支持文本、密码、搜索、数字、文本域等多种输入类型
- 💡 **工具提示** - 内置工具提示功能，提供更好的用户指导
- ⚡ **防抖功能** - 可配置的输入防抖，优化性能
- 🔒 **防自动填充** - 可选的防止浏览器自动填充功能
- 🎨 **主题定制** - 基于 CSS 变量的主题定制系统
- 📱 **响应式设计** - 支持多端适配
- ♿ **无障碍支持** - 遵循无障碍设计规范

## 基础用法

```vue
<template>
  <ZxInput v-model="value" placeholder="请输入内容" clearable @change="handleChange" />
</template>

<script setup>
import { ref } from 'vue'
import ZxInput from '@/components/pure/ZxInput'

const value = ref('')

const handleChange = (val) => {
  console.log('值改变:', val)
}
</script>
```

## 不同类型

### 密码输入

```vue
<ZxInput
  v-model="password"
  type="password"
  placeholder="请输入密码"
  show-password
  prevent-auto-fill
/>
```

### 搜索输入

```vue
<ZxInput
  v-model="searchValue"
  type="search"
  placeholder="请输入搜索关键词"
  @search="handleSearch"
/>
```

### 数字输入

```vue
<ZxInput v-model="numberValue" type="number" :min="0" :max="100" :step="1" controls />
```

### 文本域

```vue
<ZxInput
  v-model="textareaValue"
  type="textarea"
  :rows="4"
  :maxlength="200"
  show-word-limit
  resize="vertical"
/>
```

## 工具提示和气泡确认框

### 简单工具提示

```vue
<ZxInput
  v-model="value"
  placeholder="鼠标聚焦查看提示"
  tooltip="这是一个带有工具提示的输入框"
  tooltip-placement="top"
/>
```

### 气泡确认框

```vue
<template>
  <!-- 气泡确认框（点击触发） -->
  <ZxInput
    v-model="value1"
    placeholder="请输入内容"
    :tooltip="{
      title: '输入提示',
      content: '这是一个带标题的气泡确认框，可以显示更多详细信息。',
      trigger: 'click'
    }"
    tooltip-placement="right"
  />

  <!-- 气泡确认框（悬停触发） -->
  <ZxInput
    v-model="value2"
    placeholder="请输入内容"
    :tooltip="{
      title: '悬停提示',
      content: '这是悬停触发的气泡框，包含标题和内容。',
      trigger: 'hover'
    }"
    tooltip-placement="bottom"
  />
</template>
```

## 防抖功能

```vue
<ZxInput v-model="value" placeholder="防抖输入" :debounce="500" @input="handleInput" />
```

## 高级用法

### 自适应文本域

```vue
<ZxInput v-model="value" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" />
```

### 带图标

```vue
<ZxInput v-model="value" prefix-icon="User" suffix-icon="Calendar" />
```

## Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | string / number | — | — |
| type | 输入框类型 | string | text / textarea / password / search / number | text |
| placeholder | 输入框占位文本 | string | — | — |
| disabled | 是否禁用 | boolean | — | false |
| readonly | 是否只读 | boolean | — | false |
| clearable | 是否显示清除按钮 | boolean | — | false |
| show-password | 是否显示密码切换按钮 | boolean | — | false |
| size | 输入框尺寸 | string | large / default / small | default |
| maxlength | 最大输入长度 | string / number | — | — |
| minlength | 最小输入长度 | string / number | — | — |
| show-word-limit | 是否显示字数统计 | boolean | — | false |
| prefix-icon | 输入框头部图标 | string / Component | — | — |
| suffix-icon | 输入框尾部图标 | string / Component | — | — |
| rows | 文本域行数 | number | — | 2 |
| autosize | 自适应内容高度 | boolean / object | — | false |
| resize | 控制是否能被用户缩放 | string | none / both / horizontal / vertical | vertical |
| tooltip | 工具提示内容，字符串时显示为tooltip，对象时可配置title显示为popover | string / object | — | — |
| tooltip-placement | 工具提示位置 | string | top / bottom / left / right | right |
| tooltip-trigger | 工具提示触发方式 | string | hover / click / focus / manual | hover |
| prevent-auto-fill | 是否防止自动填充 | boolean | — | true |

### tooltip 对象配置

当 `tooltip` 为对象时，支持以下属性：

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| title | 气泡框标题（有标题时显示为popover） | string | — | — |
| content | 提示内容 | string | — | — |
| trigger | 触发方式（优先级高于tooltipTrigger） | string | hover / click / focus / manual | — |
| debounce | 防抖延迟（毫秒） | number | — | 0 |
| min | 最小值（数字输入） | number | — | — |
| max | 最大值（数字输入） | number | — | — |
| step | 步长（数字输入） | number | — | 1 |
| precision | 精度（数字输入） | number | — | — |
| controls | 是否显示控制按钮（数字输入） | boolean | — | true |
| controls-position | 控制按钮位置（数字输入） | string | right | — |

## Events

| 事件名 | 说明                                       | 回调参数                  |
| ------ | ------------------------------------------ | ------------------------- |
| input  | 输入时触发                                 | (value: string \| number) |
| change | 值改变时触发                               | (value: string \| number) |
| focus  | 获得焦点时触发                             | (event: Event)            |
| blur   | 失去焦点时触发                             | (event: Event)            |
| clear  | 点击清除按钮时触发                         | —                         |
| search | 点击搜索按钮或按下回车键时触发（搜索类型） | (value: string)           |

## Slots

| 插槽名  | 说明                                  |
| ------- | ------------------------------------- |
| prepend | 输入框前置内容，只对 type="text" 有效 |
| append  | 输入框后置内容，只对 type="text" 有效 |
| prefix  | 输入框头部内容                        |
| suffix  | 输入框尾部内容                        |

## 样式定制

组件使用 CSS 变量进行样式定制，你可以通过覆盖这些变量来自定义样式：

```css
:root {
  /* 边框颜色 */
  --zx-input-border-color: #dcdfe6;
  --zx-input-border-color-hover: #c0c4cc;
  --zx-input-border-color-focus: #409eff;

  /* 背景颜色 */
  --zx-input-background-color: #ffffff;
  --zx-input-background-color-disabled: #f5f7fa;

  /* 文字颜色 */
  --zx-input-text-color: #606266;
  --zx-input-text-color-disabled: #c0c4cc;
  --zx-input-text-color-placeholder: #a8abb2;

  /* 字体大小 */
  --zx-input-font-size: 14px;
  --zx-input-font-size-large: 16px;
  --zx-input-font-size-small: 12px;

  /* 高度 */
  --zx-input-height: 32px;
  --zx-input-height-large: 40px;
  --zx-input-height-small: 24px;

  /* 内边距 */
  --zx-input-padding-horizontal: 12px;
  --zx-input-padding-vertical: 8px;

  /* 阴影 */
  --zx-input-box-shadow-focus: 0 0 0 2px rgba(64, 158, 255, 0.2);

  /* 过渡效果 */
  --zx-input-transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
```

## 注意事项

1. **防抖功能**：当设置 `debounce` 属性时，`input` 事件会被防抖处理，但 `change` 事件不受影响
2. **防自动填充**：默认启用防自动填充功能，可通过 `prevent-auto-fill` 属性控制
3. **数字输入**：使用 `type="number"` 时，组件会自动使用 `el-input-number` 组件
4. **工具提示**：工具提示在输入框获得焦点时显示，失去焦点时隐藏
5. **响应式**：组件在移动端会自动调整样式以适应小屏幕

## 兼容性

- Vue 3.0+
- Element Plus 2.0+
- 现代浏览器（Chrome 60+, Firefox 60+, Safari 12+, Edge 79+）

## 更新日志

### v1.0.0

- 初始版本发布
- 支持多种输入类型
- 集成工具提示功能
- 支持防抖和防自动填充
- 完整的样式定制系统
