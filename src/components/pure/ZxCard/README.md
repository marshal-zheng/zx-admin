# ZxCard 卡片组件

基于 Element Plus 的高度可定制化卡片组件，适用于各种业务场景的内容展示和表单操作。

## 功能特性

- 🎨 **多种模式**: 支持普通模式和简单模式
- 🔄 **加载状态**: 内置 loading 状态支持
- 📱 **全屏功能**: 支持全屏显示切换
- 🎯 **灵活插槽**: 提供多个插槽位置自定义内容
- ⚙️ **高度定制**: 丰富的配置选项满足不同需求
- 🎭 **编辑模式**: 支持创建和编辑两种模式
- 📐 **响应式**: 自适应高度和宽度
- 🎪 **主题适配**: 完美适配 Element Plus 主题系统

## 基础用法

```vue
<template>
  <ZxCard title="基础卡片" sub-title="这是一个基础的卡片示例">
    <div>卡片内容</div>
  </ZxCard>
</template>

<script setup>
import ZxCard from '@/components/pure/ZxCard'
</script>
```

## 简单模式

```vue
<template>
  <ZxCard simple>
    <div>简单模式的卡片，没有标题栏和底部操作栏</div>
  </ZxCard>
</template>
```

## 编辑模式

```vue
<template>
  <ZxCard title="编辑用户" :is-edit="true" @save="handleSave">
    <el-form :model="form">
      <!-- 表单内容 -->
    </el-form>
  </ZxCard>
</template>

<script setup>
const handleSave = () => {
  // 保存逻辑
}
</script>
```

## 创建模式

```vue
<template>
  <ZxCard
    title="创建用户"
    :is-edit="false"
    @save="handleCreate"
    @save-and-continue="handleSaveAndContinue"
  >
    <el-form :model="form">
      <!-- 表单内容 -->
    </el-form>
  </ZxCard>
</template>

<script setup>
const handleCreate = () => {
  // 创建逻辑
}

const handleSaveAndContinue = () => {
  // 保存并继续创建逻辑
}
</script>
```

## 全屏功能

```vue
<template>
  <ZxCard title="支持全屏" :show-full-screen="true" @toggle-full-screen="handleToggleFullScreen">
    <div>内容区域</div>
  </ZxCard>
</template>

<script setup>
const handleToggleFullScreen = (isFullScreen) => {
  console.log('全屏状态:', isFullScreen)
}
</script>
```

## 自定义插槽

```vue
<template>
  <ZxCard title="自定义插槽">
    <!-- 头部右侧插槽 -->
    <template #headerRight>
      <el-button type="primary">自定义按钮</el-button>
    </template>

    <!-- 子标题插槽 -->
    <template #subHeader>
      <el-alert title="提示信息" type="info" />
    </template>

    <!-- 默认插槽 -->
    <div>主要内容</div>

    <!-- 底部左侧插槽 -->
    <template #footerLeft>
      <el-tag type="success">状态标签</el-tag>
    </template>

    <!-- 底部右侧插槽 -->
    <template #footerRight>
      <el-button>自定义操作</el-button>
    </template>
  </ZxCard>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| simple | 简单模式，没有标题和底部栏 | `boolean` | `false` |
| title | 卡片标题 | `string` | `''` |
| subTitle | 卡片副标题 | `string` | `''` |
| loading | 卡片 loading 状态 | `boolean` | `false` |
| isEdit | 是否编辑状态 | `boolean` | `false` |
| hideContinue | 隐藏保存并继续创建按钮 | `boolean` | `false` |
| hideFooter | 隐藏底部栏 | `boolean` | `false` |
| hideBack | 隐藏返回按钮 | `boolean` | `false` |
| hideDivider | 隐藏分割线 | `boolean` | `false` |
| showFullScreen | 是否显示全屏按钮 | `boolean` | `false` |
| isFullscreen | 是否全屏状态 | `boolean` | `false` |
| autoHeight | 内容区域高度是否自适应 | `boolean` | `false` |
| autoWidth | 内容区域宽度是否自适应 | `boolean` | `false` |
| noContentPadding | 内容区域是否有padding | `boolean` | `false` |
| noBottomRadius | 底部是否有圆角 | `boolean` | `false` |
| dividerHasPX | 分割线是否有左右padding | `boolean` | `false` |
| specialHeight | 特殊高度，例如某些页面有面包屑 | `number` | `0` |
| otherWidth | 卡片外部同级容器的宽度 | `number` | `0` |
| headerMinWidth | 卡片头部最小宽度 | `number` | `0` |
| minWidth | 卡片内容最小宽度 | `number` | `1000` |
| hasBreadcrumb | 是否有面包屑 | `boolean` | `false` |
| handleBack | 自定义返回按钮触发事件 | `Function` | `null` |
| saveText | 保存按钮文案 | `string` | `''` |
| saveAndContinueText | 保存并继续按钮文案 | `string` | `''` |
| cancelText | 取消按钮文案 | `string` | `''` |
| shadow | 卡片阴影 | `'always' \| 'hover' \| 'never'` | `'hover'` |

### Events

| 事件名           | 说明                     | 参数                      |
| ---------------- | ------------------------ | ------------------------- |
| save             | 点击保存按钮时触发       | -                         |
| saveAndContinue  | 点击保存并继续按钮时触发 | -                         |
| toggleFullScreen | 切换全屏状态时触发       | `(isFullScreen: boolean)` |

### Slots

| 插槽名      | 说明                               |
| ----------- | ---------------------------------- |
| default     | 卡片主要内容                       |
| headerLeft  | 头部左侧内容，默认显示标题和副标题 |
| headerRight | 头部右侧内容                       |
| subHeader   | 子标题区域，位于头部下方           |
| footerLeft  | 底部左侧内容                       |
| footerRight | 底部右侧内容，默认显示操作按钮     |

## 样式定制

组件使用 SCSS 编写样式，支持通过 CSS 变量进行主题定制：

```scss
.zx-card {
  --zx-card-border-radius: 8px;
  --zx-card-header-padding: 20px;
  --zx-card-content-padding: 20px;
  --zx-card-footer-padding: 20px;
  --zx-card-divider-margin: 0 20px;
  --zx-card-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
```

## 注意事项

1. **全屏功能**: 使用全屏功能时，确保页面布局能够正确处理全屏状态
2. **高度计算**: 组件会自动计算内容区域高度，如有特殊需求可使用 `autoHeight` 属性
3. **最小宽度**: 默认最小宽度为 1000px，可根据实际需求调整 `minWidth` 属性
4. **插槽使用**: 合理使用插槽可以实现更灵活的布局定制
5. **事件处理**: 保存相关事件需要在父组件中正确处理业务逻辑

## 最佳实践

### 表单场景

```vue
<template>
  <ZxCard
    title="用户管理"
    :is-edit="isEdit"
    :loading="loading"
    @save="handleSave"
    @save-and-continue="handleSaveAndContinue"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <!-- 表单项 -->
    </el-form>
  </ZxCard>
</template>
```

### 数据展示场景

```vue
<template>
  <ZxCard title="数据统计" :hide-footer="true" :no-content-padding="true">
    <el-table :data="tableData">
      <!-- 表格列 -->
    </el-table>
  </ZxCard>
</template>
```

### 图表展示场景

```vue
<template>
  <ZxCard title="销售趋势" :show-full-screen="true" @toggle-full-screen="handleFullScreen">
    <div ref="chartRef" style="height: 400px;"></div>
  </ZxCard>
</template>
```

## 更新日志

### v1.0.0

- 🎉 初始版本发布
- ✨ 基于 Element Plus 重构
- 🔧 完善的 TypeScript 支持
- 📚 完整的文档和示例
