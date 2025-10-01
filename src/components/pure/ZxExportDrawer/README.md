# ZXExportDrawer 导出字段选择抽屉

一个用于选择导出字段的抽屉组件，支持系统字段、自定义字段和其他字段的分类选择。

## 功能特性

- 🎯 **字段分类**: 支持系统字段、自定义字段、其他字段的分类管理
- 🔄 **拖拽排序**: 已选字段支持拖拽重新排序
- ✅ **全选/半选**: 支持分类全选、半选状态
- 🎨 **自定义标题**: 支持自定义抽屉标题和字段分类标题
- 📊 **数组列模式**: 支持数组形式的列数据
- 🚫 **禁用字段**: 支持设置不可取消的必选字段
- 💾 **导出状态**: 内置导出加载状态管理

## 基础用法

```vue
<template>
  <ZXExportDrawer
    v-model:visible="visible"
    :all-data="allData"
    :export-loading="exportLoading"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import ZXExportDrawer from '@/components/pure/ZXExportDrawer/index.vue'

const visible = ref(false)
const exportLoading = ref(false)

const allData = ref({
  systemColumns: {
    name: '名称',
    id: 'ID',
    status: '状态'
  },
  customColumns: {
    customField1: '自定义字段1'
  },
  otherColumns: {
    otherField1: '其他字段1'
  }
})

const handleConfirm = (selectedFields) => {
  console.log('选中的字段:', selectedFields)
  // 处理导出逻辑
}
</script>
```

## 自定义标题

```vue
<template>
  <ZXExportDrawer
    v-model:visible="visible"
    :all-data="allData"
    :title-props="titleProps"
    :drawer-title-props="drawerTitleProps"
    @confirm="handleConfirm"
  />
</template>

<script setup>
const titleProps = ref({
  selectableTitle: '可选择的字段',
  systemTitle: '系统内置字段',
  selectedTitle: '已选择的字段'
})

const drawerTitleProps = ref({
  title: '导出用户数据',
  count: 150
})
</script>
```

## 数组列模式

```vue
<template>
  <ZXExportDrawer
    v-model:visible="visible"
    :is-array-column="true"
    :array-column="arrayColumnData"
    @confirm="handleConfirm"
  />
</template>

<script setup>
const arrayColumnData = ref([
  { id: 'col1', name: '列1' },
  { id: 'col2', name: '列2' },
  { id: 'col3', name: '列3' }
])
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 抽屉显示状态 | `boolean` | `false` |
| allData | 所有字段数据 | `Object` | `{}` |
| defaultSelectedKeys | 默认选中的字段keys | `Array` | `['name', 'id', 'title', 'status', 'handle_user', 'content']` |
| isArrayColumn | 是否为数组列模式 | `boolean` | `false` |
| arrayColumn | 数组列数据 | `Array` | `[]` |
| exportLoading | 导出加载状态 | `boolean` | `false` |
| titleProps | 标题配置 | `Object` | `{}` |
| drawerTitleProps | 抽屉标题配置 | `Object` | `{}` |
| disabledCancelKeys | 禁止取消的字段keys | `Array` | `[]` |

### titleProps

| 参数            | 说明         | 类型     | 默认值 |
| --------------- | ------------ | -------- | ------ |
| selectableTitle | 可选字段标题 | `string` | `''`   |
| systemTitle     | 系统字段标题 | `string` | `''`   |
| selectedTitle   | 已选字段标题 | `string` | `''`   |

### drawerTitleProps

| 参数  | 说明     | 类型     | 默认值 |
| ----- | -------- | -------- | ------ |
| title | 抽屉标题 | `string` | `''`   |
| count | 数量显示 | `number` | `0`    |

### allData 结构

```javascript
{
  systemColumns: {
    key1: 'display_name1',
    key2: 'display_name2'
  },
  customColumns: {
    key3: 'display_name3',
    key4: 'display_name4'
  },
  otherColumns: {
    key5: 'display_name5',
    key6: 'display_name6'
  }
}
```

### Events

| 事件名               | 说明             | 回调参数                  |
| -------------------- | ---------------- | ------------------------- |
| update:visible       | 抽屉显示状态变化 | `(visible: boolean)`      |
| update:exportLoading | 导出加载状态变化 | `(loading: boolean)`      |
| confirm              | 确认选择         | `(selectedFields: Array)` |

### Slots

| 插槽名      | 说明               |
| ----------- | ------------------ |
| title       | 自定义抽屉标题     |
| footerLeft  | 自定义底部左侧内容 |
| footerRight | 自定义底部右侧内容 |

## 样式定制

组件使用 SCSS 编写样式，支持以下 CSS 变量定制：

```scss
:root {
  --color-text-1: #1d2129;
  --color-text-3: #4e5969;
  --color-text-4: #86909c;
  --color-text-n8: #f2f3f5;
  --color-text-n9: #f7f8fa;
  --primary-5: #165dff;
  --primary-1: #e8f3ff;
}
```

## 注意事项

1. 组件依赖 `vue-draggable-plus` 实现拖拽功能
2. 使用了 Element Plus 的 `el-drawer`、`el-checkbox` 等组件
3. 需要配合项目的 ZxDrawer、ZxButton、ZxIcon 组件使用
4. 支持国际化，需要配置相应的语言包
