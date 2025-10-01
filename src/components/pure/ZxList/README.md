# ZxList 列表组件

一个简洁高效的列表组件，基于 Element Plus 构建，符合组件自动生成规范。

## 特性

- 📋 支持基础列表数据展示
- 🎨 支持自定义列表项内容
- 📱 响应式设计，适配移动端
- 🎯 支持列表项点击事件
- 🔍 支持空状态和加载状态
- ⚡ 支持操作菜单
- 🎪 支持加载更多功能
- 🌙 支持主题定制

## 安装

```bash
# 已集成在项目中，无需单独安装
```

## 基础用法

```vue
<template>
  <ZxList :data="listData" @item-click="handleItemClick" />
</template>

<script setup>
import { ref } from 'vue'
import ZxList from '@/components/pure/ZxList'

const listData = ref([
  { id: 1, title: '列表项 1', description: '描述信息' },
  { id: 2, title: '列表项 2', description: '描述信息' }
])

const handleItemClick = (item, index) => {
  console.log('点击了列表项:', item)
}
</script>
```

## 带操作菜单

```vue
<template>
  <ZxList :data="listData" :item-actions="actions" @action-select="handleActionSelect" />
</template>

<script setup>
const actions = ref([
  { label: '编辑', value: 'edit', icon: 'Edit' },
  { label: '删除', value: 'delete', icon: 'Delete' }
])

const handleActionSelect = (action, item, index) => {
  console.log('选择了操作:', action.label)
}
</script>
```

## 自定义内容

```vue
<template>
  <ZxList :data="listData">
    <template #item="{ item, index }">
      <div class="custom-item">
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
      </div>
    </template>

    <template #empty>
      <div class="custom-empty">
        <p>暂无数据</p>
        <el-button @click="loadData">重新加载</el-button>
      </div>
    </template>
  </ZxList>
</template>
```

## API

### Props

| 参数         | 说明                 | 类型          | 可选值 | 默认值           |
| ------------ | -------------------- | ------------- | ------ | ---------------- |
| data         | 列表数据             | Array         | —      | []               |
| maxHeight    | 列表最大高度         | String/Number | —      | —                |
| height       | 列表固定高度         | String/Number | —      | —                |
| itemKey      | 列表项的唯一标识字段 | String        | —      | 'id'             |
| focusItemKey | 当前聚焦的项目key    | String/Number | —      | ''               |
| itemActions  | 列表项操作菜单       | Array         | —      | []               |
| loading      | 是否加载中           | Boolean       | —      | false            |
| noMoreData   | 是否没有更多数据     | Boolean       | —      | false            |
| loadingText  | 加载中文本           | String        | —      | '加载中...'      |
| noMoreText   | 没有更多数据文本     | String        | —      | '没有更多数据了' |
| emptyText    | 空状态文本           | String        | —      | '暂无数据'       |

### Events

| 事件名              | 说明           | 回调参数              |
| ------------------- | -------------- | --------------------- |
| item-click          | 列表项点击事件 | (item, index)         |
| action-select       | 操作选择事件   | (action, item, index) |
| load-more           | 加载更多事件   | —                     |
| scroll              | 滚动事件       | (event)               |
| update:data         | 数据更新事件   | (data)                |
| update:focusItemKey | 聚焦项更新事件 | (key)                 |

### Slots

| 插槽名      | 说明             | 参数            |
| ----------- | ---------------- | --------------- |
| item        | 自定义列表项内容 | { item, index } |
| title       | 自定义标题内容   | { item, index } |
| description | 自定义描述内容   | { item, index } |
| itemAction  | 自定义操作按钮   | { item, index } |
| empty       | 自定义空状态内容 | —               |

## 样式定制

组件支持通过 CSS 变量进行样式定制：

```css
.zx-list {
  /* 背景色 */
  --zx-list-bg-color: #ffffff;

  /* 边框 */
  --zx-list-border-color: #e4e7ed;
  --zx-list-border-radius: 6px;

  /* 文字颜色 */
  --zx-list-text-color: #303133;
  --zx-list-text-color-secondary: #909399;

  /* 空状态 */
  --zx-list-empty-color: #909399;

  /* 加载状态 */
  --zx-list-loading-color: #409eff;

  /* 聚焦状态 */
  --zx-list-focus-bg-color: #f0f9ff;
}

/* 列表项样式 */
.zx-list-item {
  /* 背景色 */
  --zx-list-item-bg-color: #ffffff;
  --zx-list-item-hover-bg-color: #f5f7fa;

  /* 边框 */
  --zx-list-item-border-color: #ebeef5;
  --zx-list-item-border-radius: 4px;

  /* 文字颜色 */
  --zx-list-item-title-color: #303133;
  --zx-list-item-description-color: #606266;
}
```

### 响应式设计

组件在小屏幕设备上会自动调整样式：

- 减小内边距和字体大小
- 优化触摸交互体验
- 适配移动端操作习惯

## 注意事项

1. **数据格式**：确保传入的 `data` 数组中每个对象都包含 `itemKey` 指定的字段作为唯一标识
2. **操作菜单**：`itemActions` 数组中每个操作对象需包含 `key`、`label` 等必要字段
3. **聚焦管理**：使用 `focusItemKey` 时，确保该值在数据中存在对应的项目
4. **样式定制**：建议通过 CSS 变量进行样式定制，避免直接覆盖组件内部类名
5. **事件处理**：合理处理 `action-select` 事件，根据操作类型执行相应的业务逻辑
6. **加载状态**：正确设置 `loading` 和 `noMoreData` 状态，提供良好的用户体验

## 更新日志

### v2.0.0 (2024-01-XX)

- **重大重构**：基于组件自动生成规范重新实现
- **新增功能**：
  - 操作菜单支持（itemActions）
  - 聚焦状态管理（focusItemKey）
  - 更灵活的插槽系统（title、description、itemAction）
  - 改进的加载状态管理
- **样式优化**：
  - 重新设计的CSS变量系统
  - 更好的响应式支持
  - 优化的视觉效果和交互体验
- **API变更**：
  - 移除了部分不常用的Props
  - 简化了事件系统
  - 优化了插槽命名

### v1.0.0

- 初始版本发布
- 支持基础列表渲染
- 支持分页加载
- 支持自定义空状态和加载状态
- 支持响应式设计
- 支持暗色主题
