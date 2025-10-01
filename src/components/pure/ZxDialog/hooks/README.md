# ZxDialog Hooks

ZxDialog 组件配套的 Hooks 集合，提供了更简洁和声明式的方式来管理对话框状态和逻辑。

## 📦 Hook 列表

### 1. useDialogState - 基础状态管理

管理对话框的基础状态：显示/隐藏、加载状态、禁用状态等。

```javascript
import { useDialogState } from './hooks'

const dialog = useDialogState({
  title: '基础对话框',
  width: '500px',
  dialogSize: 'small'
})

// 控制对话框
dialog.open() // 打开对话框
dialog.close() // 关闭对话框
dialog.toggle() // 切换显示状态
dialog.setLoading(true) // 设置加载状态
dialog.setDisabled(true) // 设置禁用状态
```

### 2. useDialogConfirm - 确认对话框

专门处理需要用户确认的对话框，支持异步操作、多按钮等。

```javascript
import { useDialogConfirm } from './hooks'

const confirmDialog = useDialogConfirm({
  title: '确认删除',
  okText: '删除',
  cancelText: '取消',
  onConfirm: async () => {
    await deleteItem()
    ElMessage.success('删除成功')
  },
  onCancel: () => {
    ElMessage.info('已取消删除')
  }
})

confirmDialog.open()
```

### 3. useDialogForm - 表单对话框

专门处理包含表单的对话框，自动处理表单验证、提交、重置等。

```javascript
import { useDialogForm } from './hooks'

const formDialog = useDialogForm({
  title: '用户信息',
  initialData: { name: '', email: '' },
  onSubmit: async (formData) => {
    await saveUser(formData)
    ElMessage.success('保存成功')
  },
  onReset: () => {
    ElMessage.info('表单已重置')
  }
})

// 表单操作
formDialog.setFieldValue('name', 'John') // 设置字段值
formDialog.setFormData({ name: 'John', email: 'john@example.com' }) // 设置整个表单
formDialog.validateForm() // 验证表单
formDialog.resetForm() // 重置表单
```

### 4. useDialogData - 数据展示对话框

专门处理数据展示类对话框，支持描述列表、骨架屏、异步数据加载等。

```javascript
import { useDialogData } from './hooks'

const dataDialog = useDialogData({
  title: '用户详情',
  autoLoad: true,
  dataSource: async () => {
    return await fetchUserDetail()
  },
  onDataLoad: (data) => {
    console.log('数据加载完成:', data)
  }
})

// 数据操作
dataDialog.loadData()      // 加载数据
dataDialog.refreshData()   // 刷新数据
dataDialog.setDescriptions([...])  // 设置描述列表
dataDialog.addDescription({ label: '新字段', value: '新值' })  // 添加描述项
```

## 🚀 在模板中使用

```vue
<template>
  <div>
    <el-button @click="dialog.open()">打开对话框</el-button>

    <!-- 使用 Hook 的属性和事件 -->
    <ZxDialog v-bind="dialog.baseProps.value" v-on="dialog.baseEvents.value">
      <p>对话框内容</p>
    </ZxDialog>
  </div>
</template>

<script setup>
import { useDialogState } from './hooks'
import ZxDialog from './index.vue'

const dialog = useDialogState({
  title: '示例对话框'
})
</script>
```

## 🎯 Hook 选择指南

- **useDialogState**: 简单的提示对话框、信息展示
- **useDialogConfirm**: 删除确认、操作确认、设置确认等
- **useDialogForm**: 新增/编辑表单、设置表单、注册表单等
- **useDialogData**: 详情查看、数据展示、统计信息等

## 📖 完整示例

查看 `example.vue` 文件中的完整使用示例，包含了所有 Hooks 的详细用法和最佳实践。

## 🔧 自定义扩展

所有 Hooks 都基于 `useDialogState` 构建，你可以根据需要创建自己的组合 Hook：

```javascript
import { useDialogState } from './useDialogState.js'

export function useCustomDialog(options = {}) {
  const baseDialog = useDialogState(options)

  // 添加自定义逻辑
  const customMethod = () => {
    // 自定义逻辑
  }

  return {
    ...baseDialog,
    customMethod
  }
}
```
