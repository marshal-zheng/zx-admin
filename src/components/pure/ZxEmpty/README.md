# ZxEmpty 空状态组件

基于 Element Plus 的空状态组件，用于页面数据为空时的占位提示。

## 特性

- 🎨 基于 Element Plus el-empty 组件封装
- 📝 支持自定义描述文本
- 🖼️ 支持自定义图片和图片尺寸
- 🔧 支持插槽自定义内容
- 💡 支持简洁模式
- 🎯 完全兼容项目现有技术栈

## 基本用法

```vue
<template>
  <ZxEmpty />
</template>
```

## API

### Props

| 参数        | 说明                   | 类型             | 默认值     |
| ----------- | ---------------------- | ---------------- | ---------- |
| description | 描述文字               | string           | '暂无数据' |
| image       | 图片地址或内置图片类型 | string           | ''         |
| imageSize   | 图片尺寸               | string \| number | -          |
| simple      | 是否显示简洁模式       | boolean          | false      |

### 插槽

| 插槽名      | 说明           |
| ----------- | -------------- |
| default     | 自定义底部内容 |
| image       | 自定义图片内容 |
| description | 自定义描述内容 |

## 示例

### 基础用法

```vue
<ZxEmpty />
```

### 自定义描述

```vue
<ZxEmpty description="没有找到相关数据" />
```

### 自定义图片

```vue
<ZxEmpty description="暂无内容" image="https://example.com/empty.png" :image-size="100" />
```

### 自定义操作按钮

```vue
<ZxEmpty description="暂无数据">
  <el-button type="primary" @click="refresh">刷新数据</el-button>
</ZxEmpty>
```

### 自定义图片插槽

```vue
<ZxEmpty description="网络连接失败">
  <template #image>
    <el-icon :size="80" color="#909399">
      <Connection />
    </el-icon>
  </template>
  <el-button type="primary" @click="retry">重试</el-button>
</ZxEmpty>
```

### 简洁模式

```vue
<ZxEmpty simple description="暂无数据" />
```

## 样式定制

组件支持通过 CSS 变量进行样式定制：

```scss
.zx-empty {
  // 自定义最小高度
  min-height: 300px;

  // 深度选择器修改内部样式
  :deep(.el-empty) {
    padding: 60px 0;
  }
}
```

## 更新日志

### v1.0.0

- 基于 Element Plus 重新实现
- 移除对 Ant Design 的依赖
- 增加简洁模式支持
- 完善插槽支持
- 优化样式和交互体验
