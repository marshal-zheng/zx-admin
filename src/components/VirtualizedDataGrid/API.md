# VirtualizedDataGrid API 参考

## 组件 Props

### VirtualizedDataGrid Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| modelValue | `any[]` | ✅ | `[]` | 表格数据，支持 v-model |
| columns | `DataGridColumn[]` | ✅ | `[]` | 列配置数组 |
| disabled | `boolean` | ❌ | `false` | 是否禁用整个表格的编辑功能 |
| rowHeight | `number` | ❌ | `54` | 每行的高度（像素） |
| headerHeight | `number` | ❌ | `50` | 表头高度（像素） |
| height | `number` | ❌ | `400` | 表格总高度（像素） |
| disableRowHover | `boolean` | ❌ | `false` | 是否禁用行悬停效果 |
| actionColumnWidth | `number` | ❌ | `120` | 操作列宽度（像素） |
| showActions | `boolean` | ❌ | `true` | 是否显示操作列 |
| alwaysShowActions | `boolean` | ❌ | `false` | 禁用时是否仍显示操作列 |
| customActions | `boolean` | ❌ | `false` | 是否使用自定义操作列（仅显示插槽内容） |
| disableDelete | `(row: any, index: number) => boolean` | ❌ | `() => false` | 判断删除按钮是否禁用的函数 |
| showAddButton | `boolean` | ❌ | `true` | 是否显示添加行按钮 |
| addText | `string` | ❌ | `'添加行'` | 添加按钮文本 |
| deleteText | `string` | ❌ | `'删除'` | 删除按钮文本 |
| fixed | `boolean` | ❌ | `false` | 是否固定列 |
| emptyText | `string` | ❌ | `'暂无数据'` | 空数据时的提示文本 |
| headerClass | `string` | ❌ | `''` | 表头自定义类名 |
| rowClass | `string \| ((row: any, index: number) => string)` | ❌ | `''` | 行自定义类名或类名函数 |
| enableValidation | `boolean` | ❌ | `false` | 是否启用表单验证 |

## DataGridColumn 配置

### 基础属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | ✅ | 列的唯一标识符，用于插槽等 |
| dataKey | `string` | ✅ | 数据对象中的字段名 |
| title | `string` | ✅ | 列标题显示文本 |
| width | `number` | ❌ | 列宽度（像素），默认 150 |
| minWidth | `number` | ❌ | 最小宽度 |
| maxWidth | `number` | ❌ | 最大宽度 |

### 单元格类型

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'input' \| 'select' \| 'number' \| 'textarea' \| 'datePicker' \| 'switch' \| 'custom'` | `'input'` | 单元格输入类型 |

### 类型特定属性

| 属性 | 类型 | 适用类型 | 说明 |
|------|------|----------|------|
| options | `SelectOption[]` | `select` | 下拉选项数组 |
| placeholder | `string` | 所有输入类型 | 占位符文本 |
| rules | `ValidationRule[]` | 所有 | 验证规则数组 |
| defaultValue | `any` | 所有 | 添加新行时的默认值 |
| cellProps | `Record<string, any>` | 所有 | 传递给单元格组件的额外属性 |

### 样式和布局

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| align | `'left' \| 'center' \| 'right'` | `'left'` | 列内容对齐方式 |
| fixed | `boolean \| 'left' \| 'right'` | `false` | 是否固定列 |

### 自定义渲染

| 属性 | 类型 | 说明 |
|------|------|------|
| cellRenderer | `Component` | 自定义单元格渲染组件 |
| headerRenderer | `Component` | 自定义表头渲染组件 |
| formatter | `(value: any, row: any) => string` | 格式化函数（禁用时显示） |

### 其他

| 属性 | 类型 | 说明 |
|------|------|------|
| disabled | `boolean` | 是否禁用该列 |
| sortable | `boolean` | 是否可排序 |

## SelectOption 接口

```typescript
interface SelectOption {
  label: string      // 显示文本
  value: any         // 选项值
  disabled?: boolean // 是否禁用
  [key: string]: any // 其他自定义属性
}
```

## ValidationRule 接口

```typescript
interface ValidationRule {
  required?: boolean                    // 是否必填
  message?: string                      // 错误提示信息
  trigger?: 'blur' | 'change' | 'blur,change' // 触发方式
  type?: 'string' | 'number' | 'boolean' | 'email' | ... // 数据类型
  min?: number                          // 最小长度/值
  max?: number                          // 最大长度/值
  len?: number                          // 固定长度
  pattern?: RegExp                      // 正则表达式
  validator?: (rule, value, callback) => void // 自定义验证函数
  [key: string]: any                    // 其他属性
}
```

## 组件 Events

### 事件列表

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: any[])` | 数据更新时触发（v-model） |
| add | `(row: any)` | 添加新行时触发 |
| delete | `(index: number, row: any)` | 删除行时触发 |
| change | `(data: any[])` | 任何数据变化时触发 |
| cell-change | `(row: any, key: string, value: any, index: number)` | 单元格值变化时触发 |
| row-click | `(row: any, index: number)` | 点击行时触发 |

### 事件使用示例

```vue
<template>
  <VirtualizedDataGrid
    v-model="data"
    :columns="columns"
    @add="onAdd"
    @delete="onDelete"
    @change="onChange"
    @cell-change="onCellChange"
    @row-click="onRowClick"
  />
</template>

<script setup lang="ts">
const onAdd = (row: any) => {
  console.log('新增行:', row)
}

const onDelete = (index: number, row: any) => {
  console.log('删除行:', index, row)
}

const onChange = (data: any[]) => {
  console.log('数据变化:', data)
  // 可以在这里保存数据到后端
}

const onCellChange = (row: any, key: string, value: any, index: number) => {
  console.log('单元格变化:', { row, key, value, index })
  // 可以在这里进行实时校验或联动更新
}

const onRowClick = (row: any, index: number) => {
  console.log('点击行:', row, index)
}
</script>
```

## 组件 Slots

### 插槽列表

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| header | - | 表格头部自定义内容 |
| footer | - | 表格底部自定义内容 |
| cell-{key} | `{ row: any, index: number, column: DataGridColumn }` | 自定义特定列的单元格渲染 |
| actions | `{ row: any, index: number }` | 自定义操作列内容 |

### 插槽使用示例

#### header 插槽
```vue
<template>
  <VirtualizedDataGrid v-model="data" :columns="columns">
    <template #header>
      <div class="custom-header">
        <h3>用户列表</h3>
        <ElButton type="primary" @click="addUsers">批量添加</ElButton>
      </div>
    </template>
  </VirtualizedDataGrid>
</template>
```

#### footer 插槽
```vue
<template>
  <VirtualizedDataGrid v-model="data" :columns="columns">
    <template #footer>
      <div class="custom-footer">
        <ElButton @click="save">保存</ElButton>
        <ElButton @click="cancel">取消</ElButton>
      </div>
    </template>
  </VirtualizedDataGrid>
</template>
```

#### cell-{key} 插槽
```vue
<template>
  <VirtualizedDataGrid v-model="data" :columns="columns">
    <!-- 自定义状态列 -->
    <template #cell-status="{ row, index }">
      <ElTag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </ElTag>
    </template>

    <!-- 自定义头像列 -->
    <template #cell-avatar="{ row }">
      <ElAvatar :src="row.avatar" :size="40" />
    </template>

    <!-- 自定义操作进度列 -->
    <template #cell-progress="{ row }">
      <ElProgress :percentage="row.progress" />
    </template>
  </VirtualizedDataGrid>
</template>
```

#### actions 插槽
```vue
<template>
  <VirtualizedDataGrid v-model="data" :columns="columns">
    <template #actions="{ row, index }">
      <ElButton link type="primary" :icon="Edit" @click="handleEdit(row)">
        编辑
      </ElButton>
      <ElButton link type="warning" :icon="View" @click="handleView(row)">
        查看
      </ElButton>
      <ElButton 
        link 
        type="danger" 
        :icon="Delete"
        :disabled="row.protected"
        @click="handleDelete(index)"
      >
        删除
      </ElButton>
    </template>
  </VirtualizedDataGrid>
</template>
```

## 组件 Expose

### 暴露的方法和属性

| 名称 | 类型 | 说明 |
|------|------|------|
| tableRef | `Ref` | 表格组件实例引用 |
| tableData | `Ref<any[]>` | 表格数据引用 |
| addRow | `() => void` | 添加新行的方法 |
| deleteRow | `(index: number) => void` | 删除指定行的方法 |

### 使用示例

```vue
<template>
  <div>
    <ElButton @click="addRowProgrammatically">添加行</ElButton>
    <ElButton @click="deleteFirstRow">删除第一行</ElButton>
    
    <VirtualizedDataGrid
      ref="gridRef"
      v-model="data"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DataGridExpose } from '@/components/ConfigTable'

const gridRef = ref<DataGridExpose>()

const addRowProgrammatically = () => {
  gridRef.value?.addRow()
}

const deleteFirstRow = () => {
  if (gridRef.value?.tableData.length > 0) {
    gridRef.value?.deleteRow(0)
  }
}
</script>
```

## cellProps 配置

### Input 类型

```typescript
{
  type: 'input',
  cellProps: {
    clearable: boolean        // 是否显示清空按钮
    showPassword: boolean     // 是否显示密码
    maxlength: number         // 最大长度
    // ... Element Plus Input 的其他 props
  }
}
```

### Select 类型

```typescript
{
  type: 'select',
  options: [...],
  cellProps: {
    clearable: boolean        // 是否可清空
    multiple: boolean         // 是否多选
    filterable: boolean       // 是否可搜索
    // ... Element Plus Select 的其他 props
  }
}
```

### Number 类型

```typescript
{
  type: 'number',
  cellProps: {
    min: number              // 最小值
    max: number              // 最大值
    step: number             // 步长
    precision: number        // 精度
    controls: boolean        // 是否显示控制按钮
    controlsPosition: 'right' | '' // 控制按钮位置
  }
}
```

### Textarea 类型

```typescript
{
  type: 'textarea',
  cellProps: {
    rows: number             // 行数
    autosize: boolean | { minRows: number, maxRows: number }
    maxlength: number        // 最大长度
    showWordLimit: boolean   // 是否显示字数统计
  }
}
```

### DatePicker 类型

```typescript
{
  type: 'datePicker',
  cellProps: {
    type: 'date' | 'datetime' | 'daterange' | ...
    format: string           // 显示格式，如 'YYYY-MM-DD'
    valueFormat: string      // 值格式
    disabledDate: (date: Date) => boolean
    // ... Element Plus DatePicker 的其他 props
  }
}
```

### Switch 类型

```typescript
{
  type: 'switch',
  cellProps: {
    activeText: string       // 打开时的文字
    inactiveText: string     // 关闭时的文字
    activeValue: any         // 打开时的值，默认 true
    inactiveValue: any       // 关闭时的值，默认 false
    // ... Element Plus Switch 的其他 props
  }
}
```

## 完整配置示例

```typescript
import type { DataGridColumn } from '@/components/ConfigTable'

const columns: DataGridColumn[] = [
  // 基础 Input
  {
    key: 'name',
    dataKey: 'name',
    title: '姓名',
    width: 150,
    type: 'input',
    placeholder: '请输入姓名',
    rules: [
      { required: true, message: '姓名不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    defaultValue: ''
  },
  
  // Select
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
    cellProps: {
      clearable: true,
      filterable: true
    },
    defaultValue: 1
  },
  
  // Number
  {
    key: 'age',
    dataKey: 'age',
    title: '年龄',
    width: 120,
    type: 'number',
    cellProps: {
      min: 0,
      max: 120,
      step: 1,
      controlsPosition: 'right'
    },
    rules: [
      { required: true, message: '年龄不能为空', trigger: 'blur' },
      { type: 'number', min: 18, max: 65, message: '年龄必须在 18-65 之间', trigger: 'blur' }
    ],
    defaultValue: 18
  },
  
  // DatePicker
  {
    key: 'joinDate',
    dataKey: 'joinDate',
    title: '入职日期',
    width: 180,
    type: 'datePicker',
    cellProps: {
      type: 'date',
      format: 'YYYY年MM月DD日',
      valueFormat: 'YYYY-MM-DD',
      disabledDate: (time: Date) => {
        return time.getTime() > Date.now()
      }
    },
    defaultValue: new Date().toISOString().split('T')[0]
  },
  
  // Switch
  {
    key: 'enabled',
    dataKey: 'enabled',
    title: '启用',
    width: 100,
    type: 'switch',
    align: 'center',
    cellProps: {
      activeText: '是',
      inactiveText: '否',
      activeValue: true,
      inactiveValue: false
    },
    defaultValue: true
  },
  
  // 自定义格式化
  {
    key: 'salary',
    dataKey: 'salary',
    title: '薪资',
    width: 150,
    type: 'number',
    cellProps: {
      min: 0,
      precision: 2
    },
    formatter: (value) => `¥${value?.toLocaleString()}`,
    defaultValue: 0
  },
  
  // 自定义渲染器
  {
    key: 'tags',
    dataKey: 'tags',
    title: '标签',
    width: 200,
    cellRenderer: CustomTagsCell, // 自定义组件
    defaultValue: []
  }
]
```

## 类型定义导出

```typescript
// 从组件导出的类型
export type {
  DataGridColumn,         // 列配置接口
  DataGridEmits,          // 事件接口
  DataGridExpose,         // 暴露方法接口
  SelectOption,           // 选项接口
  ValidationRule,         // 验证规则接口
  CellRendererProps,      // 单元格渲染器 props
  HeaderRendererProps,    // 表头渲染器 props
  RowClassFunction,       // 行类名函数类型
  DeleteDisableFunction   // 删除禁用函数类型
} from '@/components/ConfigTable'
```

## 常见问题

### Q: 如何动态更新列配置？
A: 直接更新 columns 数组即可，组件会自动响应变化。

### Q: 如何获取表格数据？
A: 使用 v-model 绑定的变量即可获取最新数据。

### Q: 如何实现单元格联动？
A: 在 `@cell-change` 事件中根据变化的单元格更新其他单元格的值。

### Q: 如何自定义单元格验证？
A: 使用 rules 的 validator 属性编写自定义验证函数。

### Q: 如何导出表格数据？
A: 可以直接使用 v-model 绑定的数据，配合第三方库如 xlsx 导出。
