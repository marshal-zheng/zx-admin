# ZxAutoComplete 自动完成组件

基于 Element Plus 的增强自动完成组件，提供了更丰富的功能和更好的用户体验。

## 特性

- 🔍 **智能搜索**: 支持模糊匹配和自定义过滤规则
- 🌐 **异步数据**: 支持异步函数作为数据源，适用于远程搜索
- 💡 **提示功能**: 集成 Tooltip/Popover 提示，提升用户体验
- 🎨 **主题定制**: 丰富的 CSS 变量支持，易于主题定制
- 📱 **响应式**: 完美适配移动端和桌面端
- ♿ **无障碍**: 遵循 WCAG 无障碍标准
- 🔧 **高度可配置**: 支持多种配置选项和插槽扩展

## 基础用法

```vue
<template>
  <ZxAutoComplete
    v-model="value"
    :options="options"
    placeholder="请输入搜索内容"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import ZxAutoComplete from '@/components/pure/ZxAutoComplete'

const value = ref('')
const options = ref([
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' }
])

const handleSelect = (item) => {
  console.log('选中项:', item)
}
</script>
```

## 异步数据加载

```vue
<template>
  <ZxAutoComplete v-model="value" :options="loadAsyncOptions" placeholder="异步搜索" />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

// 异步数据加载函数
const loadAsyncOptions = async (query) => {
  const response = await fetch(`/api/search?q=${query}`)
  const data = await response.json()
  return data.map((item) => ({
    label: item.name,
    value: item.id
  }))
}
</script>
```

## 带提示的自动完成

```vue
<template>
  <ZxAutoComplete
    v-model="value"
    :options="options"
    :tooltip="{
      title: '搜索提示',
      content: '输入关键词进行搜索，支持模糊匹配'
    }"
    placeholder="带提示的搜索"
  />
</template>
```

## 自定义过滤

```vue
<template>
  <ZxAutoComplete
    v-model="value"
    :options="options"
    :filter-option="customFilter"
    placeholder="自定义过滤"
  />
</template>

<script setup>
const customFilter = (queryString, item) => {
  // 自定义过滤逻辑
  return item.label.toLowerCase().includes(queryString.toLowerCase())
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | string | '' |
| options | 数据源，可以是数组或返回 Promise 的函数 | Array \| Function | [] |
| labelKey | 选项标签的键名 | string | 'label' |
| valueKey | 选项值的键名 | string | 'value' |
| tooltip | 提示配置对象 | Object | {} |
| allowClear | 是否显示清除按钮 | boolean | true |
| filterOption | 自定义过滤函数 | Function | null |
| placeholder | 输入框占位文本 | string | '' |
| size | 输入框尺寸 | 'large' \| 'default' \| 'small' | 'default' |
| disabled | 是否禁用 | boolean | false |
| clearable | 是否可清空 | boolean | true |

### Events

| 事件名 | 说明                 | 回调参数            |
| ------ | -------------------- | ------------------- |
| select | 选中选项时触发       | (item: Object)      |
| change | 输入框值改变时触发   | (value: string)     |
| focus  | 输入框获得焦点时触发 | (event: FocusEvent) |
| blur   | 输入框失去焦点时触发 | (event: FocusEvent) |

### Slots

| 插槽名  | 说明           | 参数     |
| ------- | -------------- | -------- |
| default | 自定义选项内容 | { item } |
| prefix  | 输入框前缀内容 | -        |
| suffix  | 输入框后缀内容 | -        |

### Tooltip Props

当传入 `tooltip` 属性时，支持以下配置：

| 参数      | 说明                     | 类型   | 默认值  |
| --------- | ------------------------ | ------ | ------- |
| title     | 提示标题（使用 Popover） | string | ''      |
| content   | 提示内容                 | string | ''      |
| placement | 提示位置                 | string | 'right' |
| trigger   | 触发方式                 | string | 'hover' |

## 样式定制

组件提供了丰富的 CSS 变量用于主题定制：

```css
:root {
  /* 基础样式变量 */
  --zx-auto-complete-border-radius: 4px;
  --zx-auto-complete-border-color: var(--el-border-color);
  --zx-auto-complete-border-color-hover: var(--el-border-color-hover);
  --zx-auto-complete-border-color-focus: var(--el-color-primary);
  --zx-auto-complete-background-color: var(--el-bg-color);
  --zx-auto-complete-text-color: var(--el-text-color-regular);

  /* 下拉面板变量 */
  --zx-auto-complete-dropdown-bg: var(--el-bg-color-overlay);
  --zx-auto-complete-dropdown-border: 1px solid var(--el-border-color-light);
  --zx-auto-complete-dropdown-max-height: 200px;

  /* 选项变量 */
  --zx-auto-complete-option-padding: 8px 12px;
  --zx-auto-complete-option-hover-bg: var(--el-fill-color-light);
  --zx-auto-complete-option-selected-bg: var(--el-color-primary-light-9);
}
```

## 高级用法

### 分组选项

```vue
<template>
  <ZxAutoComplete v-model="value" :options="groupedOptions" />
</template>

<script setup>
const groupedOptions = ref([
  {
    label: '前端框架',
    options: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' }
    ]
  },
  {
    label: '后端框架',
    options: [
      { label: 'Express', value: 'express' },
      { label: 'Koa', value: 'koa' }
    ]
  }
])
</script>
```

### 自定义选项渲染

```vue
<template>
  <ZxAutoComplete v-model="value" :options="options">
    <template #default="{ item }">
      <div class="custom-option">
        <span class="option-label">{{ item.label }}</span>
        <span class="option-desc">{{ item.description }}</span>
      </div>
    </template>
  </ZxAutoComplete>
</template>
```

## 注意事项

1. **异步数据加载**: 当使用函数作为 `options` 时，函数应返回 Promise，组件会自动处理加载状态
2. **性能优化**: 对于大量数据，建议使用异步加载和分页
3. **移动端适配**: 组件已针对移动端进行优化，包括触摸友好的交互和合适的字体大小
4. **无障碍支持**: 组件支持键盘导航和屏幕阅读器

## 兼容性

- Vue 3.0+
- Element Plus 2.0+
- 现代浏览器（Chrome 60+, Firefox 60+, Safari 12+, Edge 79+）

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础自动完成功能
- 支持异步数据加载
- 支持提示功能
- 支持自定义过滤
- 支持主题定制
