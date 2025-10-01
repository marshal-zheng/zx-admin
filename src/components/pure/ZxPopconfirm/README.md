# ZxPopconfirm 气泡确认框

基于 Element Plus 的气泡确认框组件，支持自定义内容、表单验证等功能。

## 特性

- 🎨 基于 Element Plus Popconfirm 组件
- 📝 支持输入框和文本域
- ✅ 内置表单验证
- 🎯 多种触发方式
- 🌈 自定义图标和样式
- 📱 响应式设计
- 🌙 暗色主题支持

## 基础用法

```vue
<template>
  <ZxPopconfirm title="确定删除吗？" @confirm="handleConfirm" @cancel="handleCancel">
    <el-button type="danger">删除</el-button>
  </ZxPopconfirm>
</template>

<script setup>
const handleConfirm = () => {
  console.log('确认操作')
}

const handleCancel = () => {
  console.log('取消操作')
}
</script>
```

## 带输入框的确认

```vue
<template>
  <ZxPopconfirm
    title="请输入名称"
    subtitle="名称不能为空且不能重复"
    show-input
    input-placeholder="请输入名称"
    :input-validator="validateName"
    @confirm="handleInputConfirm"
  >
    <el-button type="primary">添加项目</el-button>
  </ZxPopconfirm>
</template>

<script setup>
const validateName = (value) => {
  if (!value || value.trim() === '') {
    return '名称不能为空'
  }
  if (value.length > 20) {
    return '名称长度不能超过20个字符'
  }
  return true
}

const handleInputConfirm = (value) => {
  console.log('输入的名称：', value)
}
</script>
```

## 带文本域的确认

```vue
<template>
  <ZxPopconfirm
    title="请输入备注"
    show-textarea
    textarea-placeholder="请输入备注信息（可选）"
    @confirm="handleTextareaConfirm"
  >
    <el-button>添加备注</el-button>
  </ZxPopconfirm>
</template>

<script setup>
const handleTextareaConfirm = (value) => {
  console.log('输入的备注：', value || '无')
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| title | 标题 | string | — | — |
| subtitle | 副标题 | string | — | — |
| icon | 图标名称 | string | Element Plus 图标名 | 'QuestionFilled' |
| iconColor | 图标颜色 | string | — | — |
| showInput | 是否显示输入框 | boolean | — | false |
| inputPlaceholder | 输入框占位符 | string | — | '请输入' |
| inputValidator | 输入框验证函数 | function | — | — |
| showTextarea | 是否显示文本域 | boolean | — | false |
| textareaPlaceholder | 文本域占位符 | string | — | '请输入' |
| textareaValidator | 文本域验证函数 | function | — | — |
| confirmButtonText | 确认按钮文本 | string | — | '确定' |
| cancelButtonText | 取消按钮文本 | string | — | '取消' |
| confirmButtonType | 确认按钮类型 | string | primary/success/warning/danger/info | 'primary' |
| cancelButtonType | 取消按钮类型 | string | primary/success/warning/danger/info | — |
| width | 弹出框宽度 | string/number | — | 'auto' |
| placement | 弹出位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | 'bottom' |
| trigger | 触发方式 | string | click/hover/focus/manual | 'click' |
| disabled | 是否禁用 | boolean | — | false |
| hideAfter | 自动隐藏延时 | number | — | 200 |
| autoClose | 确认后是否自动关闭 | boolean | — | true |
| persistent | 是否持久化显示 | boolean | — | false |

### Events

| 事件名       | 说明                   | 回调参数                                          |
| ------------ | ---------------------- | ------------------------------------------------- |
| confirm      | 点击确认按钮时触发     | (value?: string) 输入的值（如果有输入框或文本域） |
| cancel       | 点击取消按钮时触发     | —                                                 |
| show         | 显示时触发             | —                                                 |
| hide         | 隐藏时触发             | —                                                 |
| before-enter | 显示动画播放前触发     | —                                                 |
| after-enter  | 显示动画播放完毕后触发 | —                                                 |
| before-leave | 隐藏动画播放前触发     | —                                                 |
| after-leave  | 隐藏动画播放完毕后触发 | —                                                 |

### Slots

| 插槽名    | 说明       |
| --------- | ---------- |
| default   | 触发元素   |
| reference | 同 default |

### 验证函数

验证函数接收输入值作为参数，返回值规则：

- 返回 `true` 表示验证通过
- 返回字符串表示验证失败，字符串内容为错误信息
- 返回 `false` 表示验证失败，使用默认错误信息

```javascript
const validator = (value) => {
  if (!value) {
    return '不能为空'
  }
  if (value.length > 10) {
    return '长度不能超过10个字符'
  }
  return true
}
```

## 样式定制

组件使用 CSS 变量进行样式定制，可以通过覆盖以下变量来自定义样式：

```css
:root {
  /* 基础样式 */
  --zx-popconfirm-bg-color: #ffffff;
  --zx-popconfirm-border-color: #e4e7ed;
  --zx-popconfirm-border-radius: 4px;
  --zx-popconfirm-padding: 16px;
  --zx-popconfirm-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  /* 标题样式 */
  --zx-popconfirm-title-color: var(--el-text-color-primary);
  --zx-popconfirm-title-font-size: 14px;
  --zx-popconfirm-title-font-weight: 500;

  /* 图标样式 */
  --zx-popconfirm-icon-size: 18px;
  --zx-popconfirm-icon-color: var(--el-color-warning);
  --zx-popconfirm-icon-margin-right: 8px;

  /* 副标题样式 */
  --zx-popconfirm-subtitle-color: var(--el-text-color-regular);
  --zx-popconfirm-subtitle-font-size: 12px;

  /* 表单样式 */
  --zx-popconfirm-form-margin-top: 12px;
  --zx-popconfirm-input-width: 245px;
}
```

## 国际化

组件支持国际化，默认提供中文和英文语言包：

```javascript
// zh-CN.ts
export default {
  nameRequired: '名称不能为空',
  nameExists: '名称已存在'
}

// en-US.ts
export default {
  nameRequired: 'Name is required',
  nameExists: 'Name already exists'
}
```

## 注意事项

1. 组件基于 Element Plus Popconfirm，继承了其所有基础功能
2. 输入框和文本域不能同时显示，`show-textarea` 优先级更高
3. 验证函数为异步时，请确保返回 Promise
4. 在移动端使用时，建议调整 `width` 和 `placement` 属性
5. 暗色主题下会自动调整颜色变量

## 更新日志

### v1.0.0

- 初始版本
- 支持基础确认功能
- 支持输入框和文本域
- 支持表单验证
- 支持自定义图标和样式
- 支持响应式设计
- 支持暗色主题
