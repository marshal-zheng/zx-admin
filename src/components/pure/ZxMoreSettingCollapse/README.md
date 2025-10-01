# ZxMoreSettingCollapse 更多设置折叠组件

一个基于 Element Plus 的可折叠更多设置组件，提供简洁的展开/收起交互，适用于表单中的高级设置或可选配置项。

## 特性

- 🎯 **简洁易用** - 基于 Element Plus Collapse 组件封装，API 简单直观
- 🎨 **高度可定制** - 支持自定义标题、样式主题和 CSS 变量
- 📱 **响应式设计** - 适配移动端和桌面端，提供良好的用户体验
- 🔧 **灵活配置** - 支持 v-model 双向绑定、禁用状态和事件监听
- 🎪 **插槽支持** - 通过具名插槽自定义内容区域
- 🌙 **主题适配** - 支持浅色/深色主题自动切换

## 基础用法

```vue
<template>
  <ZxMoreSettingCollapse v-model="expanded">
    <template #content>
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="启用通知">
          <el-switch v-model="form.notification" />
        </el-form-item>
      </el-form>
    </template>
  </ZxMoreSettingCollapse>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ZxMoreSettingCollapse from '@/components/pure/ZxMoreSettingCollapse'

const expanded = ref(false)
const form = reactive({
  username: '',
  notification: true
})
</script>
```

## 高级用法

### 自定义标题

```vue
<template>
  <ZxMoreSettingCollapse v-model="expanded" title="高级配置选项">
    <template #content>
      <!-- 自定义内容 -->
    </template>
  </ZxMoreSettingCollapse>
</template>
```

### 禁用状态

```vue
<template>
  <ZxMoreSettingCollapse v-model="expanded" :disabled="true">
    <template #content>
      <el-alert title="功能暂时不可用" type="warning" />
    </template>
  </ZxMoreSettingCollapse>
</template>
```

### 事件监听

```vue
<template>
  <ZxMoreSettingCollapse
    v-model="expanded"
    @open="handleOpen"
    @close="handleClose"
    @change="handleChange"
  >
    <template #content>
      <!-- 内容 -->
    </template>
  </ZxMoreSettingCollapse>
</template>

<script setup>
const handleOpen = () => {
  console.log('折叠面板已展开')
}

const handleClose = () => {
  console.log('折叠面板已收起')
}

const handleChange = (expanded) => {
  console.log('状态变更:', expanded)
}
</script>
```

## API

### Props

| 参数                 | 说明         | 类型      | 默认值       |
| -------------------- | ------------ | --------- | ------------ |
| modelValue / v-model | 是否展开     | `boolean` | `false`      |
| title                | 折叠面板标题 | `string`  | `'更多设置'` |
| disabled             | 是否禁用     | `boolean` | `false`      |

### Events

| 事件名            | 说明               | 回调参数              |
| ----------------- | ------------------ | --------------------- |
| update:modelValue | 展开状态改变时触发 | `(expanded: boolean)` |
| change            | 展开状态改变时触发 | `(expanded: boolean)` |
| open              | 展开时触发         | `()`                  |
| close             | 收起时触发         | `()`                  |

### Slots

| 插槽名  | 说明             |
| ------- | ---------------- |
| content | 折叠面板内容区域 |

### Methods

通过 ref 可以调用以下方法：

| 方法名                 | 说明              | 参数 |
| ---------------------- | ----------------- | ---- |
| clearMoreSettingActive | 收起折叠面板      | `()` |
| toggleCollapse         | 切换展开/收起状态 | `()` |

```vue
<template>
  <ZxMoreSettingCollapse ref="collapseRef" v-model="expanded">
    <!-- 内容 -->
  </ZxMoreSettingCollapse>
  <el-button @click="handleClear">收起面板</el-button>
</template>

<script setup>
import { ref } from 'vue'

const collapseRef = ref()
const expanded = ref(false)

const handleClear = () => {
  collapseRef.value.clearMoreSettingActive()
}
</script>
```

## 样式定制

组件提供了丰富的 CSS 变量，可以轻松定制样式：

```css
:root {
  /* 基础样式变量 */
  --zx-more-setting-collapse-bg-color: #ffffff;
  --zx-more-setting-collapse-border-color: #e4e7ed;
  --zx-more-setting-collapse-border-radius: 4px;
  --zx-more-setting-collapse-padding: 16px;
  --zx-more-setting-collapse-margin-top: 24px;

  /* 触发器样式变量 */
  --zx-more-setting-collapse-trigger-color: var(--el-color-primary);
  --zx-more-setting-collapse-trigger-hover-color: var(--el-color-primary-light-3);
  --zx-more-setting-collapse-trigger-font-size: 14px;
  --zx-more-setting-collapse-trigger-font-weight: 400;

  /* 图标样式变量 */
  --zx-more-setting-collapse-icon-size: 14px;
  --zx-more-setting-collapse-icon-margin-left: 4px;
  --zx-more-setting-collapse-icon-color: var(--el-color-primary);

  /* 内容区域变量 */
  --zx-more-setting-collapse-content-padding: 16px 0;
  --zx-more-setting-collapse-content-bg: transparent;
}
```

### 自定义主题示例

```css
/* 自定义蓝色主题 */
.custom-theme {
  --zx-more-setting-collapse-trigger-color: #1890ff;
  --zx-more-setting-collapse-trigger-hover-color: #40a9ff;
  --zx-more-setting-collapse-icon-color: #1890ff;
}

/* 紧凑模式 */
.compact-mode {
  --zx-more-setting-collapse-margin-top: 12px;
  --zx-more-setting-collapse-content-padding: 8px 0;
  --zx-more-setting-collapse-trigger-font-size: 13px;
}
```

## 注意事项

1. **依赖要求**：组件基于 Element Plus，确保项目中已正确安装和配置 Element Plus
2. **图标依赖**：使用了 `@element-plus/icons-vue` 中的 `ArrowDown` 和 `ArrowRight` 图标
3. **样式作用域**：组件样式使用了 `:deep()` 来覆盖 Element Plus 的默认样式
4. **响应式支持**：在移动端会自动调整字体大小和间距
5. **主题兼容**：支持 Element Plus 的浅色/深色主题切换

## 兼容性

- Vue 3.0+
- Element Plus 2.0+
- 现代浏览器（Chrome 60+, Firefox 60+, Safari 12+, Edge 79+）

## 更新日志

### v1.0.0

- 🎉 初始版本发布
- ✨ 支持基础的展开/收起功能
- ✨ 支持自定义标题和禁用状态
- ✨ 提供完整的事件监听和方法调用
- ✨ 支持 CSS 变量定制和响应式设计
