# ZxIcon 组件迁移指南

## 概述

ZxIcon 是基于原 Icon 组件优化而来的 Vue3 + JavaScript 图标组件，支持 Element Plus 并专为现代 Vue3 项目设计。

## 主要特性

- ✅ Vue3 + JavaScript 实现
- ✅ 支持 SCSS 样式（样式文件分离）
- ✅ 支持本地 SVG 图标
- ✅ 支持图标字体（如 iconfont）
- ✅ 支持悬停效果
- ✅ 集成 Element Plus ElIcon 组件
- ✅ 扁平化文件结构（无 src 文件夹）
- ✅ 跟随系统主题（基于 Element Plus CSS 变量）
- ✅ 支持 Tooltip 和 Popover 功能
- ✅ 支持禁用状态
- ✅ CSS3 变量系统（参照 ZxDrawer 规范）
- ❌ 移除了在线图标库支持
- ❌ 移除了 TypeScript 类型定义

## 迁移步骤

### 1. 复制组件文件

将整个 `ZxIcon` 文件夹复制到你的项目中：

```bash
# 复制到你的项目组件目录
cp -r /path/to/ZxIcon /your-project/src/components/
```

### 2. 安装依赖

确保你的项目已安装 Vue3 和 Element Plus：

```bash
yarn add vue@^3.0.0 element-plus
# 或
npm install vue@^3.0.0 element-plus
```

### 3. 全局注册组件（推荐）

在你的 `main.js` 文件中：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ZxIcon from './components/ZxIcon'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 全局注册组件
app.use(ZxIcon)
// 或者
app.component('ZxIcon', ZxIcon)

app.mount('#app')
```

### 4. 局部注册组件

在需要使用的组件中：

```javascript
import ZxIcon from '@/components/ZxIcon'
// 如果需要单独引入 Element Plus 组件
import { ElIcon } from 'element-plus'

export default {
  components: {
    ZxIcon,
    ElIcon // 可选，ZxIcon 内部已经引入
  }
  // ...
}
```

### 5. 使用组件

ZxIcon 支持三种图标使用方式，每种方式都有不同的配置要求：

### 方式一：本地图标字体库（如 iconfont）

#### 基础配置要求

1. **下载图标字体文件**：从 iconfont.cn 或其他图标字体服务下载字体文件
2. **引入字体文件**：在项目中引入 CSS 和字体文件
3. **配置字体样式**：确保图标类名正确

#### 配置步骤

```scss
// 在你的全局样式文件中引入
@font-face {
  font-family: 'iconfont';
  src:
    url('./assets/fonts/iconfont.woff2') format('woff2'),
    url('./assets/fonts/iconfont.woff') format('woff'),
    url('./assets/fonts/iconfont.ttf') format('truetype');
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### 使用方法

```vue
<template>
  <!-- 使用 iconfont 图标 -->
  <ZxIcon icon="iconfont icon-home" :size="20" color="#409eff" />
  <ZxIcon icon="iconfont icon-user" :size="24" />
  <ZxIcon icon="iconfont icon-setting" :size="18" color="#67c23a" />
</template>
```

### 方式二：本地 SVG 图标

#### 基础配置要求

1. **安装 vite-plugin-svg-icons**：用于处理 SVG sprite
2. **配置 Vite**：设置 SVG 图标目录
3. **准备 SVG 文件**：将 SVG 图标文件放入指定目录

#### 配置步骤

```bash
# 安装依赖
yarn add vite-plugin-svg-icons -D
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    })
  ]
})
```

```javascript
// main.js 中引入
import 'virtual:svg-icons-register'
```

#### 使用方法

```vue
<template>
  <!-- 使用本地 SVG 图标 -->
  <ZxIcon icon="svg-icon:user" :size="24" />
  <ZxIcon icon="svg-icon:home" :size="20" color="#409eff" />
  <ZxIcon icon="svg-icon:setting" :size="18" color="#67c23a" />
</template>
```

## SVG 图标

ZxIcon 组件支持本地 SVG 图标，通过 SVG sprite 技术实现高效的图标管理。使用 `svg-icon:` 前缀来识别本地 SVG 图标。

### 基础用法

```vue
<template>
  <!-- 基础 SVG 图标 -->
  <ZxIcon icon="svg-icon:user" :size="24" />

  <!-- 带颜色的 SVG 图标 -->
  <ZxIcon icon="svg-icon:home" :size="24" color="#409EFF" />

  <!-- 悬停效果 -->
  <ZxIcon icon="svg-icon:heart" :size="24" color="#909399" hover-color="#F56C6C" />
</template>
```

### 配置要求

如果你需要使用本地 SVG 图标，需要配置 SVG sprite：

### 1. 安装 vite-plugin-svg-icons（如果使用 Vite）

```bash
yarn add vite-plugin-svg-icons -D
```

### 2. 配置 vite.config.js

```javascript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    // ... 其他插件
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]'
    })
  ]
})
```

### 3. 在 main.js 中导入

```javascript
import 'virtual:svg-icons-register'
```

### 4. 添加 SVG 文件

将 SVG 文件放在 `src/assets/svg/` 目录下，文件名即为图标名称。

### SVG 图标使用方式

SVG 图标通过 `svg-icon:` 前缀自动识别，无需设置 `type` 属性：

| 图标类型          | 使用方式             | 示例                               |
| ----------------- | -------------------- | ---------------------------------- |
| Element Plus 图标 | 直接使用图标名       | `icon="User"`                      |
| iconfont 图标     | 设置 type="iconfont" | `type="iconfont" icon="icon-user"` |
| 本地 SVG 图标     | 使用 svg-icon: 前缀  | `icon="svg-icon:user"`             |

### SVG 图标属性

| 属性名     | 类型          | 默认值 | 说明                                |
| ---------- | ------------- | ------ | ----------------------------------- |
| icon       | String        | -      | SVG 图标名称，格式：svg-icon:图标名 |
| size       | Number/String | 16     | 图标大小                            |
| color      | String        | -      | 图标颜色                            |
| hoverColor | String        | -      | 悬停时的颜色                        |

### 示例

```vue
<template>
  <div>
    <!-- 不同尺寸 -->
    <ZxIcon icon="svg-icon:star" :size="16" />
    <ZxIcon icon="svg-icon:star" :size="24" />
    <ZxIcon icon="svg-icon:star" :size="32" />

    <!-- 不同颜色 -->
    <ZxIcon icon="svg-icon:heart" color="#F56C6C" />
    <ZxIcon icon="svg-icon:heart" color="#67C23A" />

    <!-- 悬停效果 -->
    <ZxIcon icon="svg-icon:user" color="#909399" hover-color="#409EFF" />

    <!-- 带 Tooltip -->
    <ZxIcon icon="svg-icon:setting" tooltip="设置" />
  </div>
</template>
```

### 方式三：Element Plus 图标

#### 基础配置要求

1. **安装 Element Plus**：确保项目已安装 Element Plus
2. **安装图标库**：安装 @element-plus/icons-vue
3. **注册图标**：全局或按需注册图标组件

#### 配置步骤

```bash
# 安装依赖
yarn add element-plus @element-plus/icons-vue
```

```javascript
// main.js - 全局注册方式
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

或者按需引入：

```javascript
// 按需引入方式
import { ElIcon } from 'element-plus'
import { User, Home, Setting } from '@element-plus/icons-vue'

export default {
  components: {
    ElIcon,
    User,
    Home,
    Setting
  }
}
```

#### 使用方法

```vue
<template>
  <!-- 方式1：直接使用 Element Plus 图标组件 -->
  <ElIcon :size="20" color="#409eff">
    <User />
  </ElIcon>

  <!-- 方式2：通过 ZxIcon 使用（需要额外配置） -->
  <ZxIcon icon="el-icon-user" :size="20" color="#409eff" />
  <ZxIcon icon="el-icon-home" :size="24" />
  <ZxIcon icon="el-icon-setting" :size="18" color="#67c23a" />
</template>

<script>
import { User, Home, Setting } from '@element-plus/icons-vue'

export default {
  components: {
    User,
    Home,
    Setting
  }
}
</script>
```

### 综合使用示例

```vue
<template>
  <div class="icon-demo">
    <!-- 图标字体 -->
    <ZxIcon icon="iconfont icon-home" :size="20" color="#409eff" />

    <!-- 本地 SVG -->
    <ZxIcon icon="svg-icon:user" :size="24" />

    <!-- Element Plus 图标（推荐直接使用 ElIcon） -->
    <ElIcon :size="18" color="#67c23a">
      <Setting />
    </ElIcon>

    <!-- 带悬停效果 -->
    <ZxIcon icon="iconfont icon-star" :size="18" color="#909399" hover-color="#f56c6c" />
  </div>
</template>
```

#### 高级用法

```vue
<template>
  <div class="icon-demo">
    <!-- 自定义类名 -->
    <ZxIcon icon="icon-setting" :size="16" class-name="custom-icon" />

    <!-- 动态图标 -->
    <ZxIcon :icon="currentIcon" :size="iconSize" :color="iconColor" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIcon: 'icon-home',
      iconSize: 20,
      iconColor: '#409eff'
    }
  }
}
</script>
```

## 组件 API

### Props

| 参数              | 说明                                   | 类型          | 默认值  | 必填 |
| ----------------- | -------------------------------------- | ------------- | ------- | ---- |
| type              | 图标类型：element \| iconfont          | String        | element | 否   |
| icon              | 图标名称                               | String        | -       | 是   |
| size              | 图标大小                               | Number/String | 16      | 否   |
| color             | 图标颜色（不设置时跟随系统主题）       | String        | -       | 否   |
| hoverColor        | 悬停时的颜色                           | String        | -       | 否   |
| className         | 自定义类名                             | String        | -       | 否   |
| tooltip           | Tooltip 文本内容                       | String        | -       | 否   |
| popoverTitle      | Popover 标题（有标题时显示为 popover） | String        | -       | 否   |
| tooltipTrigger    | Tooltip/Popover 触发方式               | String        | hover   | 否   |
| tooltipPlacement  | Tooltip/Popover 位置                   | String        | top     | 否   |
| popoverPersistent | Popover 是否持久化显示（便于复制内容） | Boolean       | false   | 否   |
| disabled          | 是否禁用                               | Boolean       | false   | 否   |

### 图标类型说明

1. **Element Plus 图标**：使用 Element Plus 内置图标，如 `Edit`、`Delete` 等
2. **图标字体**：使用 iconfont 等字体图标，如 `icon-home`、`icon-user` 等

### 新功能使用示例

#### 1. Tooltip 功能

```vue
<template>
  <!-- 基础 Tooltip -->
  <ZxIcon icon="Edit" tooltip="编辑" />

  <!-- 自定义触发方式和位置 -->
  <ZxIcon icon="Delete" tooltip="删除操作" tooltip-trigger="click" tooltip-placement="bottom" />
</template>
```

#### 2. Popover 功能

```vue
<template>
  <!-- 基础 Popover -->
  <ZxIcon icon="QuestionFilled" popover-title="帮助信息" tooltip="点击查看详细信息" />

  <!-- 带自定义内容的 Popover -->
  <ZxIcon icon="Setting" popover-title="设置选项" tooltip-trigger="click">
    <template #popoverContent>
      <div>
        <p>这里是详细的设置说明</p>
        <el-button size="small">确认</el-button>
      </div>
    </template>
  </ZxIcon>

  <!-- 可复制内容的 Popover -->
  <ZxIcon icon="CopyDocument" popover-title="可复制内容" tooltip="悬停查看可复制的内容">
    <template #popoverContent>
      <div style="padding: 10px;">
        <p><strong>API Key:</strong></p>
        <code style="user-select: all;">sk-1234567890abcdef</code>
        <p style="color: #666; font-size: 12px;">鼠标可以移动到此区域进行复制</p>
      </div>
    </template>
  </ZxIcon>

  <!-- 持久化 Popover -->
  <ZxIcon
    icon="Document"
    popover-title="持久化内容"
    tooltip-trigger="click"
    :popover-persistent="true"
  >
    <template #popoverContent>
      <div>
        <p>这个 popover 需要点击外部区域才会关闭</p>
        <code style="user-select: all;">便于进行复制操作</code>
      </div>
    </template>
  </ZxIcon>
</template>
```

#### 3. 禁用状态

```vue
<template>
  <!-- 禁用的图标 -->
  <ZxIcon icon="Edit" disabled tooltip="当前不可编辑" />

  <!-- 禁用状态下不显示 tooltip -->
  <ZxIcon icon="Delete" disabled />
</template>
```

#### 4. 跟随系统主题

```vue
<template>
  <!-- 不设置 color 时自动跟随系统主题 -->
  <ZxIcon icon="User" />

  <!-- 设置自定义颜色 -->
  <ZxIcon icon="User" color="var(--el-color-primary)" />

  <!-- 悬停效果 -->
  <ZxIcon icon="Heart" hover-color="var(--el-color-danger)" />
</template>
```

#### 5. 事件处理

```vue
<template>
  <ZxIcon icon="Plus" tooltip="添加项目" @click="handleAdd" />
</template>

<script setup>
const handleAdd = () => {
  console.log('添加操作')
}
</script>
```

## 样式定制

### 全局样式

你可以在全局样式文件中覆盖默认样式：

```scss
// 在你的全局 SCSS 文件中
.zx-icon {
  // 自定义默认样式
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  // 自定义 SVG 样式
  svg {
    transition: fill 0.3s ease;
  }
}
```

### 主题定制

```scss
// 定义主题变量
$icon-primary-color: #409eff;
$icon-success-color: #67c23a;
$icon-warning-color: #e6a23c;
$icon-danger-color: #f56c6c;

// 应用主题
.zx-icon {
  &.primary {
    color: $icon-primary-color;
  }
  &.success {
    color: $icon-success-color;
  }
  &.warning {
    color: $icon-warning-color;
  }
  &.danger {
    color: $icon-danger-color;
  }
}
```

## 本地 SVG 图标配置

如果你需要使用本地 SVG 图标，需要配置 SVG sprite：

### 1. 安装 vite-plugin-svg-icons（如果使用 Vite）

```bash
yarn add vite-plugin-svg-icons -D
```

### 2. 配置 vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    })
  ]
})
```

### 3. 在 main.js 中引入

```javascript
import 'virtual:svg-icons-register'
```

### 4. 放置 SVG 文件

将 SVG 文件放在 `src/assets/icons/` 目录下，然后使用：

```vue
<ZxIcon icon="svg-icon:filename" />
```

## 迁移注意事项

### 从原 Icon 组件迁移

1. **保持 Element Plus 支持**：

   ```javascript
   // ZxIcon 内部使用 ElIcon 作为容器
   import ZxIcon from '@/components/ZxIcon'
   ```

2. **更新组件名称**：

   ```vue
   <!-- 原来 -->
   <Icon icon="icon-home" />

   <!-- 现在 -->
   <ZxIcon icon="icon-home" />
   ```

3. **移除在线图标相关配置**：

   - 不再需要 `@iconify/vue`
   - 不再需要 `VITE_USE_ONLINE_ICON` 环境变量

4. **新的文件结构**：
   ```
   ZxIcon/
   ├── index.vue      # 主组件文件
   ├── index.scss     # 样式文件
   ├── index.js       # 入口文件
   ├── example.vue    # 使用示例
   └── README.md      # 文档
   ```

### 兼容性说明

- **Vue 版本**：需要 Vue 3.0+
- **Element Plus**：需要 Element Plus 2.0+
- **浏览器支持**：现代浏览器（IE11+）
- **构建工具**：支持 Vite、Webpack 等
- **样式预处理器**：需要支持 SCSS

## 常见问题

### Q: 图标不显示怎么办？

A: 检查以下几点：

1. 确保图标字体文件已正确引入
2. 检查图标类名是否正确
3. 确保 SVG sprite 已正确配置（如果使用本地 SVG）

### Q: 如何添加新的图标？

A:

- **图标字体**：在 CSS 中添加新的图标类
- **本地 SVG**：将 SVG 文件放入配置的图标目录

### Q: 如何自定义图标样式？

A: 通过 `className` prop 添加自定义类名，然后在 CSS 中定义样式。

## 示例项目

完整的使用示例可以参考项目中的测试文件。

## 更新日志

- v1.0.0: 初始版本，基于原 Icon 组件简化而来

## 许可证

与原项目保持一致。
