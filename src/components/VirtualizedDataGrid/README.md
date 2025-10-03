# VirtualizedDataGrid 组件

基于 Element Plus Virtualized Table 的高性能可编辑数据表格组件，使用 Vue 3 Composition API 开发。

## 特性

- 🚀 **高性能虚拟化**: 基于 Element Plus TableV2，支持大数据量渲染
- 📝 **可编辑单元格**: 支持多种输入类型（input、select、number、textarea、datePicker、switch）
- 🎨 **动态列配置**: 灵活的列配置，支持动态渲染
- ✅ **表单验证**: 内置表单验证支持
- 🎯 **自定义渲染**: 支持自定义单元格和头部渲染
- 🛠 **TypeScript**: 完整的 TypeScript 类型定义
- 📱 **响应式**: 自适应容器大小

## 基础用法

```vue
<template>
  <VirtualizedDataGrid
    v-model="tableData"
    :columns="columns"
    :height="500"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VirtualizedDataGrid from '@/components/ConfigTable/VirtualizedDataGrid.vue'
import type { DataGridColumn } from '@/components/ConfigTable/VirtualizedDataGrid.vue'

const tableData = ref([
  { name: 'John', age: 25, email: 'john@example.com' },
  { name: 'Jane', age: 30, email: 'jane@example.com' }
])

const columns: DataGridColumn[] = [
  {
    key: 'name',
    dataKey: 'name',
    title: '姓名',
    width: 150,
    type: 'input',
    placeholder: '请输入姓名'
  },
  {
    key: 'age',
    dataKey: 'age',
    title: '年龄',
    width: 120,
    type: 'number',
    cellProps: { min: 0, max: 120 }
  },
  {
    key: 'email',
    dataKey: 'email',
    title: '邮箱',
    width: 200,
    type: 'input',
    placeholder: '请输入邮箱'
  }
]
</script>
```

## 列配置

### DataGridColumn 接口

```typescript
interface DataGridColumn {
  key: string                    // 唯一列标识
  dataKey: string                // 数据字段名
  title: string                  // 列标题
  width?: number                 // 列宽
  minWidth?: number              // 最小宽度
  maxWidth?: number              // 最大宽度
  type?: 'input' | 'select' | 'number' | 'textarea' | 'datePicker' | 'switch' | 'custom'
  options?: Array<{              // select 类型的选项
    label: string
    value: any
    disabled?: boolean
  }>
  rules?: any[]                  // 验证规则
  placeholder?: string           // 占位符
  defaultValue?: any             // 添加新行时的默认值
  disabled?: boolean             // 是否禁用
  cellRenderer?: Component       // 自定义单元格渲染组件
  formatter?: (value: any, row: any) => string  // 格式化函数
  cellProps?: Record<string, any>  // 传递给单元格组件的额外属性
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  headerRenderer?: Component     // 自定义表头渲染
}
```

## 不同类型示例

### Input 类型

```typescript
{
  key: 'name',
  dataKey: 'name',
  title: '姓名',
  type: 'input',
  placeholder: '请输入姓名',
  defaultValue: ''
}
```

### Select 类型

```typescript
{
  key: 'status',
  dataKey: 'status',
  title: '状态',
  type: 'select',
  options: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ],
  defaultValue: 1
}
```

### Number 类型

```typescript
{
  key: 'price',
  dataKey: 'price',
  title: '价格',
  type: 'number',
  cellProps: {
    min: 0,
    max: 99999,
    step: 0.01,
    precision: 2
  },
  defaultValue: 0
}
```

### Textarea 类型

```typescript
{
  key: 'description',
  dataKey: 'description',
  title: '描述',
  type: 'textarea',
  width: 300,
  cellProps: {
    rows: 3,
    autosize: { minRows: 2, maxRows: 6 }
  }
}
```

### DatePicker 类型

```typescript
{
  key: 'date',
  dataKey: 'date',
  title: '日期',
  type: 'datePicker',
  cellProps: {
    type: 'date',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  }
}
```

### Switch 类型

```typescript
{
  key: 'enabled',
  dataKey: 'enabled',
  title: '启用',
  type: 'switch',
  cellProps: {
    activeText: '是',
    inactiveText: '否',
    activeValue: true,
    inactiveValue: false
  },
  defaultValue: false
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | Array | [] | 表格数据 (v-model) |
| columns | DataGridColumn[] | [] | 列配置 |
| disabled | boolean | false | 是否禁用整个表格 |
| rowHeight | number | 54 | 行高 |
| headerHeight | number | 50 | 表头高度 |
| height | number | 400 | 表格总高度 |
| disableRowHover | boolean | false | 禁用行悬停效果 |
| actionColumnWidth | number | 120 | 操作列宽度 |
| showActions | boolean | true | 是否显示操作列 |
| alwaysShowActions | boolean | false | 禁用时仍显示操作列 |
| customActions | boolean | false | 自定义操作列（仅显示插槽内容） |
| disableDelete | (row, index) => boolean | () => false | 判断删除按钮是否禁用 |
| showAddButton | boolean | true | 是否显示添加按钮 |
| addText | string | '添加行' | 添加按钮文本 |
| deleteText | string | '删除' | 删除按钮文本 |
| fixed | boolean | false | 固定列 |
| emptyText | string | '暂无数据' | 空数据提示 |
| headerClass | string | '' | 表头类名 |
| rowClass | string \| Function | '' | 行类名 |
| enableValidation | boolean | false | 启用表单验证 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | (data: any[]) | 数据更新 |
| add | (row: any) | 添加行 |
| delete | (index: number, row: any) | 删除行 |
| change | (data: any[]) | 数据变化 |
| cell-change | (row: any, key: string, value: any, index: number) | 单元格变化 |
| row-click | (row: any, index: number) | 行点击 |

## Slots

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| header | - | 表格头部自定义内容 |
| footer | - | 表格底部自定义内容 |
| cell-{key} | { row, index, column } | 自定义单元格渲染 |
| actions | { row, index } | 自定义操作列 |

## 自定义单元格示例

```vue
<template>
  <VirtualizedDataGrid
    v-model="tableData"
    :columns="columns"
  >
    <!-- 自定义单元格渲染 -->
    <template #cell-status="{ row, index }">
      <ElTag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </ElTag>
    </template>

    <!-- 自定义操作列 -->
    <template #actions="{ row, index }">
      <ElButton link type="primary" @click="handleEdit(row, index)">
        编辑
      </ElButton>
      <ElButton link type="danger" @click="handleDelete(index)">
        删除
      </ElButton>
    </template>
  </VirtualizedDataGrid>
</template>
```

## 自定义渲染器

```vue
<script setup lang="ts">
import { h } from 'vue'
import { ElTag } from 'element-plus'

const columns: DataGridColumn[] = [
  {
    key: 'status',
    dataKey: 'status',
    title: '状态',
    width: 100,
    cellRenderer: ({ rowData }) => {
      return h(ElTag, {
        type: rowData.status === 1 ? 'success' : 'danger'
      }, () => rowData.status === 1 ? '启用' : '禁用')
    }
  }
]
</script>
```

## 表单验证

```typescript
const columns: DataGridColumn[] = [
  {
    key: 'email',
    dataKey: 'email',
    title: '邮箱',
    type: 'input',
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ]
  }
]
```

## 完整示例

```vue
<template>
  <div class="data-grid-demo">
    <VirtualizedDataGrid
      v-model="tableData"
      :columns="columns"
      :height="600"
      :disabled="isDisabled"
      :show-add-button="true"
      :disable-delete="disableDeleteRow"
      @add="handleAdd"
      @delete="handleDelete"
      @change="handleChange"
      @cell-change="handleCellChange"
    >
      <template #header>
        <div class="custom-header">
          <h3>用户列表</h3>
          <ElButton @click="isDisabled = !isDisabled">
            {{ isDisabled ? '启用编辑' : '禁用编辑' }}
          </ElButton>
        </div>
      </template>

      <template #cell-avatar="{ row }">
        <ElAvatar :src="row.avatar" />
      </template>

      <template #actions="{ row, index }">
        <ElButton link type="primary" @click="handleEdit(row)">
          编辑
        </ElButton>
        <ElButton link type="danger" @click="handleRemove(index)">
          删除
        </ElButton>
      </template>
    </VirtualizedDataGrid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VirtualizedDataGrid from '@/components/ConfigTable/VirtualizedDataGrid.vue'
import type { DataGridColumn } from '@/components/ConfigTable/VirtualizedDataGrid.vue'

const isDisabled = ref(false)

const tableData = ref([
  {
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    status: 1,
    role: 'admin',
    createDate: '2024-01-01'
  }
])

const columns: DataGridColumn[] = [
  {
    key: 'name',
    dataKey: 'name',
    title: '姓名',
    width: 150,
    type: 'input',
    placeholder: '请输入姓名',
    rules: [{ required: true, message: '姓名不能为空' }]
  },
  {
    key: 'age',
    dataKey: 'age',
    title: '年龄',
    width: 120,
    type: 'number',
    cellProps: { min: 0, max: 120 },
    defaultValue: 18
  },
  {
    key: 'email',
    dataKey: 'email',
    title: '邮箱',
    width: 200,
    type: 'input',
    rules: [
      { required: true, message: '邮箱不能为空' },
      { type: 'email', message: '邮箱格式不正确' }
    ]
  },
  {
    key: 'status',
    dataKey: 'status',
    title: '状态',
    width: 120,
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    defaultValue: 1
  },
  {
    key: 'role',
    dataKey: 'role',
    title: '角色',
    width: 150,
    type: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' }
    ],
    defaultValue: 'user'
  },
  {
    key: 'createDate',
    dataKey: 'createDate',
    title: '创建日期',
    width: 180,
    type: 'datePicker'
  }
]

const disableDeleteRow = (row: any, index: number) => {
  return row.role === 'admin' // 管理员不可删除
}

const handleAdd = (row: any) => {
  console.log('Added row:', row)
}

const handleDelete = (index: number, row: any) => {
  console.log('Deleted row:', index, row)
}

const handleChange = (data: any[]) => {
  console.log('Data changed:', data)
}

const handleCellChange = (row: any, key: string, value: any, index: number) => {
  console.log('Cell changed:', { row, key, value, index })
}

const handleEdit = (row: any) => {
  console.log('Edit row:', row)
}

const handleRemove = (index: number) => {
  tableData.value.splice(index, 1)
}
</script>

<style scoped>
.data-grid-demo {
  padding: 20px;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
```

## 最佳实践

1. **大数据量**: 虚拟化表格适合处理大量数据（1000+ 行），但仍需注意每行数据的复杂度
2. **列数控制**: 建议列数不超过 15 列，过多列会影响性能和用户体验
3. **行高设置**: 根据单元格内容类型合理设置行高，textarea 等多行内容需要更大的行高
4. **验证规则**: 使用 Element Plus 的验证规则格式
5. **默认值**: 为每列设置合理的 defaultValue，确保添加新行时数据完整性
6. **性能优化**: 避免在 cellRenderer 中使用复杂计算，可以在数据处理阶段预计算

## 与原组件对比

| 特性 | 原 ConfigTable | VirtualizedDataGrid |
|------|----------------|---------------------|
| 技术栈 | Vue 2 + Class API | Vue 3 + Composition API |
| 表格组件 | Element UI Table | Element Plus TableV2 |
| 虚拟化 | ❌ | ✅ |
| TypeScript | 部分支持 | 完整支持 |
| 性能 | 一般 | 优秀 |
| 大数据量 | ❌ | ✅ |
| 代码维护性 | 一般 | 优秀 |
| 扩展性 | 一般 | 优秀 |
