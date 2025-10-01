# ZxExpandToggle 展开收起组件

一个基于 Element Plus 的通用展开收起组件，提供简洁的展开/收起交互，适用于表单中的高级设置、可选配置项或任何需要隐藏/显示内容的场景。

## 特性

- 🎯 **简洁易用** - 基于 Element Plus 按钮组件封装，API 简单直观
- 🎨 **高度可定制** - 支持自定义文本、图标、位置对齐和样式主题
- 📱 **响应式设计** - 适配移动端和桌面端，提供良好的用户体验
- 🔧 **灵活配置** - 支持 v-model 双向绑定、禁用状态和事件监听
- 🎪 **插槽支持** - 通过具名插槽自定义展开内容区域
- 🌙 **主题适配** - 支持浅色/深色主题自动切换
- 🎬 **平滑动画** - 内置 CSS 过渡动画，提供流畅的展开收起效果

## 基础用法

```vue
<template>
  <ZxExpandToggle v-model="expanded">
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
  </ZxExpandToggle>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ZxExpandToggle from '@/components/pure/ZxExpandToggle'

const expanded = ref(false)
const form = reactive({
  username: '',
  notification: true
})
</script>
```

## 高级用法

### 自定义文本和图标

```vue
<template>
  <ZxExpandToggle
    v-model="expanded"
    expanded-text="隐藏"
    collapsed-text="显示"
    text-suffix="高级选项"
    :expanded-icon="EyeSlash"
    :collapsed-icon="View"
  >
    <template #content>
      <div>自定义的展开内容</div>
    </template>
  </ZxExpandToggle>
</template>

<script setup>
import { View, EyeSlash } from '@element-plus/icons-vue'
</script>
```

### 触发器位置对齐

```vue
<template>
  <!-- 左对齐 -->
  <ZxExpandToggle v-model="leftExpanded" trigger-position="left">
    <template #content>
      <div>左对齐的内容</div>
    </template>
  </ZxExpandToggle>

  <!-- 居中对齐（默认） -->
  <ZxExpandToggle v-model="centerExpanded">
    <template #content>
      <div>居中对齐的内容</div>
    </template>
  </ZxExpandToggle>

  <!-- 右对齐 -->
  <ZxExpandToggle v-model="rightExpanded" trigger-position="right">
    <template #content>
      <div>右对齐的内容</div>
    </template>
  </ZxExpandToggle>
</template>
```

### 禁用状态

```vue
<template>
  <ZxExpandToggle v-model="expanded" :disabled="true" text-suffix="设置">
    <template #content>
      <el-alert
        title="系统维护中"
        description="当前系统正在维护，暂时无法修改设置。"
        type="warning"
        :closable="false"
      />
    </template>
  </ZxExpandToggle>
</template>
```

### 事件监听

```vue
<template>
  <ZxExpandToggle
    v-model="expanded"
    @toggle="handleToggle"
    @expand="handleExpand"
    @collapse="handleCollapse"
  >
    <template #content>
      <div>监听事件的内容</div>
    </template>
  </ZxExpandToggle>
</template>

<script setup>
const handleToggle = (expanded) => {
  console.log('切换状态:', expanded)
}

const handleExpand = () => {
  console.log('展开事件触发')
}

const handleCollapse = () => {
  console.log('收起事件触发')
}
</script>
```

### 方法调用

```vue
<template>
  <ZxExpandToggle ref="toggleRef" v-model="expanded">
    <template #content>
      <div>通过方法控制的内容</div>
    </template>
  </ZxExpandToggle>

  <el-button @click="expand">展开</el-button>
  <el-button @click="collapse">收起</el-button>
  <el-button @click="toggle">切换</el-button>
</template>

<script setup>
import { ref } from 'vue'

const toggleRef = ref()
const expanded = ref(false)

const expand = () => {
  toggleRef.value.expand()
}

const collapse = () => {
  toggleRef.value.collapse()
}

const toggle = () => {
  toggleRef.value.toggle()
}
</script>
```

## API 参考

### Props

| 参数            | 说明                     | 类型                | 默认值    | 必填 |
| --------------- | ------------------------ | ------------------- | --------- | ---- |
| modelValue      | 是否展开（支持 v-model） | Boolean             | false     | 否   |
| expandedText    | 展开时的文本             | String              | '收起'    | 否   |
| collapsedText   | 收起时的文本             | String              | '展开'    | 否   |
| expandedIcon    | 展开时的图标             | String/Object       | ArrowUp   | 否   |
| collapsedIcon   | 收起时的图标             | String/Object       | ArrowDown | 否   |
| disabled        | 是否禁用                 | Boolean             | false     | 否   |
| triggerPosition | 触发器位置               | String              | 'center'  | 否   |
| triggerClass    | 自定义触发器类名         | String/Array/Object | ''        | 否   |
| textSuffix      | 文本后缀                 | String              | ''        | 否   |

#### triggerPosition 可选值

- `center` - 居中对齐（默认）
- `left` - 左对齐
- `right` - 右对齐

### Events

| 事件名            | 说明                                 | 参数                |
| ----------------- | ------------------------------------ | ------------------- |
| update:modelValue | 更新 modelValue 状态（用于 v-model） | (expanded: boolean) |
| toggle            | 切换展开/收起状态时触发              | (expanded: boolean) |
| expand            | 展开时触发                           | ()                  |
| collapse          | 收起时触发                           | ()                  |

### Slots

| 插槽名  | 说明                 |
| ------- | -------------------- |
| content | 展开时显示的内容区域 |

### Methods

通过 ref 可以调用以下方法：

| 方法名     | 说明              | 参数          |
| ---------- | ----------------- | ------------- |
| toggle     | 切换展开/收起状态 | ()            |
| expand     | 展开内容          | ()            |
| collapse   | 收起内容          | ()            |
| isExpanded | 获取当前展开状态  | () => boolean |

## 样式定制

组件提供了丰富的 CSS 变量，可以轻松定制样式：

```css
:root {
  /* 基础样式变量 */
  --zx-expand-toggle-bg: transparent;
  --zx-expand-toggle-border-color: #e4e7ed;
  --zx-expand-toggle-border-style: dashed;

  /* 内容区域变量 */
  --zx-expand-toggle-content-padding: 16px 0;
  --zx-expand-toggle-content-margin: 0 0 16px 0;
  --zx-expand-toggle-content-bg: transparent;

  /* 触发器样式变量 */
  --zx-expand-toggle-trigger-padding: 16px 0;
  --zx-expand-toggle-trigger-margin: 0;
  --zx-expand-toggle-trigger-bg: transparent;

  /* 按钮样式变量 */
  --zx-expand-toggle-button-color: #409eff;
  --zx-expand-toggle-button-hover-color: #337ecc;
  --zx-expand-toggle-button-font-size: 13px;

  /* 图标样式变量 */
  --zx-expand-toggle-icon-size: 12px;
  --zx-expand-toggle-icon-margin: 0 4px 0 0;

  /* 动画变量 */
  --zx-expand-toggle-transition-duration: 0.3s;
  --zx-expand-toggle-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 样式变体类

组件还提供了一些预设的样式变体类：

```vue
<!-- 无边框样式 -->
<ZxExpandToggle class="zx-expand-toggle--no-border">
  <!-- 内容 -->
</ZxExpandToggle>

<!-- 紧凑样式 -->
<ZxExpandToggle class="zx-expand-toggle--compact">
  <!-- 内容 -->
</ZxExpandToggle>

<!-- 卡片样式 -->
<ZxExpandToggle class="zx-expand-toggle--card">
  <!-- 内容 -->
</ZxExpandToggle>
```

## 注意事项

1. **性能优化** - 组件使用 `v-if` 来控制内容的渲染，只有在展开状态下才会渲染内容，有助于提升性能
2. **动画效果** - 组件内置了平滑的 CSS 过渡动画，可以通过 CSS 变量自定义动画时长和缓动函数
3. **响应式设计** - 组件在移动端会自动调整字体大小和间距，确保良好的用户体验
4. **主题兼容** - 组件完全兼容 Element Plus 的主题系统，支持浅色/深色主题自动切换

## 兼容性

- Vue 3.3+
- Element Plus 2.3+
- 现代浏览器（Chrome 60+, Firefox 60+, Safari 12+, Edge 79+）
