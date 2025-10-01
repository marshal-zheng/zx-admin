# ZxSplitBox 分割面板组件

基于 Element Plus 的可调整大小的分割面板组件，支持水平和垂直分割，提供丰富的交互功能。

## 特性

- 🎯 **灵活布局**: 支持水平和垂直分割
- 🖱️ **拖拽调整**: 可通过拖拽分割线调整面板大小
- 📱 **响应式设计**: 支持移动端和桌面端
- 🎨 **主题定制**: 基于 CSS 变量的主题系统
- ⚡ **高性能**: 优化的拖拽性能和动画效果
- 🔧 **易于使用**: 简洁的 API 设计
- 🌙 **暗色主题**: 自动适配系统暗色主题
- ♿ **无障碍**: 支持键盘操作和屏幕阅读器

## 安装

```bash
# 该组件已集成在项目中，无需单独安装
```

## 基础用法

### 水平分割

```vue
<template>
  <ZxSplitBox
    :default-size="300"
    :min-size="200"
    :max-size="500"
    direction="horizontal"
    :allow-collapse="true"
  >
    <template #first>
      <div>左侧面板内容</div>
    </template>
    <template #second>
      <div>右侧面板内容</div>
    </template>
  </ZxSplitBox>
</template>
```

### 垂直分割

```vue
<template>
  <ZxSplitBox :default-size="200" direction="vertical" :allow-collapse="true">
    <template #first>
      <div>顶部面板内容</div>
    </template>
    <template #second>
      <div>底部面板内容</div>
    </template>
  </ZxSplitBox>
</template>
```

### 嵌套使用

```vue
<template>
  <ZxSplitBox direction="horizontal" :default-size="250">
    <template #first>
      <div>侧边栏</div>
    </template>
    <template #second>
      <ZxSplitBox direction="vertical" :default-size="150">
        <template #first>
          <div>工具栏</div>
        </template>
        <template #second>
          <div>主内容区</div>
        </template>
      </ZxSplitBox>
    </template>
  </ZxSplitBox>
</template>
```

## API

### Props

| 参数          | 说明                 | 类型    | 可选值                | 默认值     |
| ------------- | -------------------- | ------- | --------------------- | ---------- |
| direction     | 分割方向             | String  | horizontal / vertical | horizontal |
| defaultSize   | 第一个面板的默认大小 | Number  | —                     | 300        |
| minSize       | 第一个面板的最小大小 | Number  | —                     | 100        |
| maxSize       | 第一个面板的最大大小 | Number  | —                     | Infinity   |
| allowCollapse | 是否允许收起面板     | Boolean | —                     | false      |
| disabled      | 是否禁用调整大小     | Boolean | —                     | false      |
| resizerStyle  | 分割线自定义样式     | Object  | —                     | {}         |
| splitStyle    | 分割容器自定义样式   | Object  | —                     | {}         |

### Events

| 事件名      | 说明               | 回调参数       |
| ----------- | ------------------ | -------------- |
| resize      | 面板大小改变时触发 | (size: number) |
| resizeStart | 开始拖拽时触发     | (size: number) |
| resizeEnd   | 结束拖拽时触发     | (size: number) |
| collapse    | 面板收起时触发     | —              |
| expand      | 面板展开时触发     | —              |

### Slots

| 插槽名 | 说明             |
| ------ | ---------------- |
| first  | 第一个面板的内容 |
| second | 第二个面板的内容 |

### Methods

| 方法名   | 说明                  | 参数           |
| -------- | --------------------- | -------------- |
| setSize  | 设置第一个面板的大小  | (size: number) |
| collapse | 收起第一个面板        | —              |
| expand   | 展开第一个面板        | —              |
| toggle   | 切换面板展开/收起状态 | —              |

## 样式定制

组件使用 CSS 变量进行样式定制，你可以通过覆盖这些变量来自定义外观：

```css
:root {
  /* 容器相关 */
  --zx-split-box-bg: #ffffff;
  --zx-split-box-border: #e4e7ed;
  --zx-split-box-radius: 4px;

  /* 分割线相关 */
  --zx-split-box-divider-bg: #f5f7fa;
  --zx-split-box-divider-hover-bg: #409eff;
  --zx-split-box-divider-active-bg: #337ecc;
  --zx-split-box-divider-width: 6px;

  /* 展开按钮相关 */
  --zx-split-box-expand-bg: #f5f7fa;
  --zx-split-box-expand-hover-bg: #e4e7ed;
  --zx-split-box-expand-icon-color: #409eff;

  /* 动画相关 */
  --zx-split-box-transition: all 0.3s ease;
}
```

## 键盘快捷键

| 快捷键     | 功能                               |
| ---------- | ---------------------------------- |
| Space      | 切换面板展开/收起状态              |
| Enter      | 切换面板展开/收起状态              |
| Arrow Keys | 微调面板大小（需要焦点在分割线上） |

## 无障碍支持

- 支持键盘导航
- 提供 ARIA 标签
- 兼容屏幕阅读器
- 高对比度模式支持

## 浏览器兼容性

- Chrome 50+
- Firefox 50+
- Safari 10+
- Edge 50+
- IE 11+（需要 polyfill）

## 注意事项

1. **容器高度**: 确保父容器有明确的高度，否则组件可能无法正常显示
2. **性能优化**: 在大量数据场景下，建议使用虚拟滚动等技术优化性能
3. **移动端**: 在移动端会自动调整触摸区域大小，提供更好的用户体验
4. **嵌套使用**: 支持无限嵌套，但建议控制嵌套层级以保证性能

## 常见问题

### Q: 为什么组件没有显示？

A: 请检查父容器是否有明确的高度设置。

### Q: 如何禁用拖拽功能？

A: 设置 `disabled` 属性为 `true`。

### Q: 如何自定义分割线样式？

A: 使用 `resizerStyle` 属性或覆盖相关的 CSS 变量。

### Q: 移动端体验如何？

A: 组件针对移动端进行了优化，包括触摸区域增大、手势支持等。

## 更新日志

### v1.0.0

- 初始版本发布
- 支持水平和垂直分割
- 支持拖拽调整大小
- 支持展开/收起功能
- 响应式设计
- 无障碍支持

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个组件。

## 许可证

MIT License
