# PanelHeader 组件

通用的面板头部组件，抽象自 Grafana 设计，适配 Element Plus 生态系统。提供完整的面板头部功能，包括标题显示、菜单操作、状态指示、通知系统等。

## 特性

- 🎨 **主题兼容**：完全支持明亮/深色主题切换
- 🧩 **组件化设计**：模块化的子组件，便于维护和扩展
- 🎯 **TypeScript 支持**：完整的类型定义和智能提示
- 📱 **响应式设计**：适配移动端和桌面端
- ♿ **无障碍友好**：支持键盘导航和屏幕阅读器
- 🔧 **高度可定制**：丰富的 CSS3 变量和插槽支持
- 🔄 **向后兼容**：保持与现有系统的兼容性

## 组件结构

```
PanelHeader/
├── index.vue                    # 主组件
├── index.scss                   # 样式文件
├── types.ts                     # 类型定义
├── PanelHeaderMenu.vue          # 菜单组件
├── PanelHeaderMenuProvider.vue  # 菜单数据提供者
├── PanelHeaderTitleItems.vue    # 标题项组件
├── PanelHeaderNotices.vue       # 通知列表组件
├── PanelHeaderNotice.vue        # 单个通知组件
├── example.vue                  # 使用示例
└── README.md                    # 文档
```

## 基础使用

```vue
<template>
  <PanelHeader panel-id="my-panel" title="我的面板" :draggable="true" />
</template>

<script setup>
import PanelHeader from '@/components/business/DashboardGrid/PanelComponent/PanelHeader/index.vue'
</script>
```

## 高级用法

### 带状态和通知

```vue
<template>
  <PanelHeader
    panel-id="status-panel"
    title="状态面板"
    alert-state="warning"
    time-info="5分钟前"
    :notices="notices"
    @menu-action="handleMenuAction"
    @inspect-click="handleInspectClick"
  />
</template>

<script setup>
const notices = [
  {
    severity: 'warning',
    text: '数据延迟警告',
    inspect: 'data'
  },
  {
    severity: 'info',
    text: '查看详细信息',
    link: 'https://example.com'
  }
]

const handleMenuAction = (action, panelId, data) => {
  console.log('菜单操作:', action, panelId, data)
}

const handleInspectClick = (panelId, inspectTab, notice, event) => {
  console.log('检查点击:', panelId, inspectTab, notice)
}
</script>
```

### 自定义菜单

```vue
<template>
  <PanelHeader
    panel-id="custom-panel"
    title="自定义面板"
    :initial-menu-items="customMenuItems"
    :menu-config="menuConfig"
    @menu-click="handleMenuClick"
  />
</template>

<script setup>
const customMenuItems = [
  {
    type: 'item',
    text: '刷新数据',
    iconClassName: 'refresh',
    shortcut: 'Ctrl+R',
    onClick: () => refreshData()
  },
  {
    type: 'divider',
    text: 'divider-1'
  },
  {
    type: 'group',
    text: '导出选项',
    subMenu: [
      {
        type: 'item',
        text: '导出为PNG',
        iconClassName: 'image',
        onClick: () => exportPNG()
      }
    ]
  }
]

const menuConfig = {
  showEdit: true,
  showDuplicate: false,
  showDelete: true,
  showExport: false,
  showFullscreen: true
}
</script>
```

### 自定义内容

```vue
<template>
  <PanelHeader panel-id="custom-content-panel">
    <template #title>
      <div class="custom-title">
        <zx-icon name="chart-line" />
        <span>图表面板</span>
        <el-tag size="small" type="success">实时</el-tag>
      </div>
    </template>

    <template #actions>
      <el-button size="small" type="primary" :icon="RefreshIcon" circle />
      <el-button size="small" type="info" :icon="SettingIcon" circle />
    </template>
  </PanelHeader>
</template>
```

## API 参考

### PanelHeader Props

| 属性                | 类型                | 默认值      | 说明             |
| ------------------- | ------------------- | ----------- | ---------------- |
| panelId             | `string \| number`  | `''`        | 面板唯一标识     |
| title               | `string`            | `''`        | 面板标题         |
| draggable           | `boolean`           | `true`      | 是否可拖拽       |
| showMenu            | `boolean`           | `true`      | 是否显示菜单     |
| showTitleItems      | `boolean`           | `true`      | 是否显示标题项   |
| showNotices         | `boolean`           | `true`      | 是否显示通知     |
| showActionBar       | `boolean`           | `true`      | 是否显示操作栏   |
| forceShowActionBar  | `boolean`           | `false`     | 强制显示操作栏   |
| initialMenuItems    | `PanelMenuItem[]`   | `[]`        | 初始菜单项       |
| autoLoadDefaultMenu | `boolean`           | `true`      | 自动加载默认菜单 |
| menuConfig          | `MenuConfig`        | `{}`        | 菜单配置         |
| titleItems          | `PanelTitleItem[]`  | `[]`        | 标题项列表       |
| panelLinks          | `PanelLink[]`       | `[]`        | 面板链接         |
| alertState          | `PanelMenuSeverity` | `undefined` | 状态信息         |
| timeInfo            | `string`            | `''`        | 时间信息         |
| notices             | `PanelNotice[]`     | `[]`        | 通知列表         |
| dataFrames          | `DataFrame[]`       | `[]`        | 数据帧           |
| canInspect          | `boolean`           | `true`      | 是否可检查       |
| deduplicateNotices  | `boolean`           | `true`      | 是否去重通知     |

### 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| menu-items-change | `(items: PanelMenuItem[])` | 菜单项变化 |
| menu-action | `(action: string, panelId: string \| number, data?: any)` | 菜单操作 |
| menu-click | `(item: PanelMenuItem, event: Event)` | 菜单点击 |
| title-item-click | `(item: PanelTitleItem, event: Event)` | 标题项点击 |
| link-click | `(link: PanelLink, event: Event)` | 链接点击 |
| inspect-click | `(panelId: string \| number, inspectTab: string, notice: PanelNotice, event: Event)` | 检查点击 |
| notice-click | `(panelId: string \| number, notice: PanelNotice, event: Event)` | 通知点击 |

### 插槽

| 插槽名        | 说明             |
| ------------- | ---------------- |
| title         | 自定义标题内容   |
| title-content | 标题区域额外内容 |
| actions       | 自定义操作项     |

## 类型定义

### PanelMenuItem

```typescript
interface PanelMenuItem {
  type?: 'item' | 'divider' | 'group'
  text: string
  iconClassName?: string
  onClick?: (event: Event) => void
  href?: string
  shortcut?: string
  subMenu?: PanelMenuItem[]
  disabled?: boolean
  visible?: boolean
}
```

### PanelNotice

```typescript
interface PanelNotice {
  severity: 'info' | 'warning' | 'error' | 'success'
  text: string
  inspect?: string
  link?: string
}
```

### PanelTitleItem

```typescript
interface PanelTitleItem {
  type: 'status' | 'timeshift' | 'links' | 'custom'
  content?: string
  icon?: string
  status?: PanelMenuSeverity
  tooltip?: string
  onClick?: (event: Event) => void
}
```

## CSS 变量

组件支持丰富的 CSS3 变量定制，主要变量包括：

### 基础变量

```css
:root {
  /* 面板头部基础样式 */
  --panel-header-height: 46px;
  --panel-header-bg: var(--app-background-color-card-default);
  --panel-header-hover-bg: var(--app-panel-header-hover-bg);
  --panel-header-border-radius: 3px 3px 0 0;
  --panel-header-z-index: 10;

  /* 标题样式 */
  --panel-header-title-size: 14px;
  --panel-header-title-weight: 500;
  --panel-header-title-color: var(--el-text-color-primary);
  --panel-header-title-hover-color: var(--el-color-primary);

  /* 操作栏样式 */
  --panel-header-action-bar-gap: 6px;
  --panel-header-action-bar-padding: 0 8px;
  --panel-header-action-bar-opacity: 0;
  --panel-header-action-bar-visibility: hidden;

  /* 菜单样式 */
  --panel-header-menu-trigger-size: 24px;
  --panel-header-menu-trigger-color: var(--el-text-color-secondary);
  --panel-header-menu-item-height: 32px;
  --panel-header-menu-icon-size: 14px;

  /* 通知样式 */
  --panel-header-notice-size: 24px;
  --panel-header-notice-icon-size: 14px;
  --panel-header-notices-gap: 4px;

  /* 标题项样式 */
  --panel-header-title-items-gap: 8px;
  --panel-header-title-item-height: 24px;
  --panel-header-title-item-icon-size: 14px;
}
```

### 主题变量

组件会自动适配深色主题，也可以通过变量进行定制：

```css
html.dark {
  --panel-header-bg: var(--app-background-color-card-default, #062846);
  --panel-header-hover-bg: var(--app-background-color-card-hover, #07395f);
  --panel-header-title-color: var(--el-text-color-primary, #ffffff);
  --panel-header-title-hover-color: var(--el-color-primary, #9cfff9);
}
```

## 最佳实践

### 1. 菜单设计

- 使用分组来组织相关功能
- 为常用操作提供快捷键
- 使用语义化的图标
- 考虑菜单项的层级不要过深

### 2. 状态指示

- 合理使用不同的状态级别
- 提供清晰的状态说明文本
- 考虑状态的视觉层次

### 3. 通知系统

- 避免过多的通知干扰用户
- 使用适当的通知级别
- 提供操作入口（检查、链接）

### 4. 性能优化

- 大量菜单项时考虑懒加载
- 合理使用 `v-if` 和 `v-show`
- 避免在模板中进行复杂计算

### 5. 无障碍性

- 确保所有交互元素都有合适的 `aria-label`
- 支持键盘导航
- 提供足够的颜色对比度

## 迁移指南

### 从旧版本迁移

如果您正在从旧的 `m-panel-header` 组件迁移，新组件保持了向后兼容：

```vue
<!-- 旧版本 -->
<div class="m-panel-header">
  <h1 class="title">{{ title }}</h1>
  <div class="bar-group">
    <!-- 操作项 -->
  </div>
</div>

<!-- 新版本（兼容） -->
<PanelHeader :title="title" />
```

### 插件系统兼容

新组件保持了对旧插件系统的支持：

```javascript
// 旧的插件添加方式仍然有效
const headerRef = ref()
headerRef.value.addAction({
  render: MyCustomComponent
})
```

## 故障排除

### 常见问题

1. **菜单不显示**

   - 检查 `showMenu` 属性是否为 `true`
   - 确认菜单项数据格式正确
   - 查看浏览器控制台是否有错误

2. **样式不正确**

   - 确认已正确导入样式文件
   - 检查 CSS 变量是否被覆盖
   - 验证主题切换是否正常

3. **事件不响应**
   - 检查事件名称是否正确
   - 确认事件处理函数已正确绑定
   - 查看是否有阻止事件冒泡的代码

### 调试技巧

- 使用浏览器开发工具检查组件结构
- 通过 Vue DevTools 查看组件状态
- 在事件处理函数中添加 `console.log` 进行调试

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件。在贡献代码前，请确保：

1. 代码符合项目的编码规范
2. 添加了适当的类型定义
3. 更新了相关文档
4. 通过了所有测试

## 许可证

MIT License
