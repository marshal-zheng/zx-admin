# ZxConfirmInput 输入确认对话框

企业级的"输入校验后再确认"对话框组件，适用于删除项目、重置数据等高危操作。采用 GitLab 风格设计，简洁美观，符合现代企业级应用标准。支持关键字、正则、自定义函数三种校验方式。

## 特性

- Vue 3 + Element Plus，纯 JS，无 TS 依赖
- GitLab 风格设计，简洁美观
- 支持 v-model 控制显隐
- 多种校验方式：精确关键字、正则表达式、自定义 validator
- **支持 confirmAction 异步操作，内置 loading 状态管理**
- **插件式调用，支持 $confirmInput.danger()、$confirmInput.warning()、$confirmInput.info() 等方法**
- 单按钮设计，简化交互流程
- 可配置按钮圆角样式
- 插槽扩展：message、extra、footer-left
- 完善的事件：open/close/confirm/error

## 基础用法

```vue
<ZxConfirmInput
  v-model="visible"
  title="删除项目"
  message="您即将删除项目"
  description="此操作将永久删除项目 'mcp-echarts' 及其所有数据，无法恢复。"
  keyword="mcp-echarts"
  ok-text="确认删除"
  @confirm="({ value }) => doDelete(value)"
/>
```

## 圆角按钮样式

```vue
<ZxConfirmInput
  v-model="visible"
  title="删除项目"
  keyword="project-name"
  :rounded="true"
  @confirm="handleConfirm"
/>
```

## 正则/自定义校验

```vue
<!-- 正则 -->
<ZxConfirmInput
  v-model="visible"
  :pattern="/^delete-.*/"
  message="确认执行危险操作"
  description="请输入以 'delete-' 开头的指令以确认继续。"
/>

<!-- 自定义校验：返回 true/false 或错误字符串 -->
<ZxConfirmInput
  v-model="visible"
  :validator="(val) => val?.length >= 5 || '长度至少 5'"
  message="确认重置数据"
  description="此操作将清空所有数据，请输入至少5个字符的确认文本。"
/>
```

## 异步操作 (NEW)

```vue
<template>
  <ZxConfirmInput
    v-model="visible"
    title="删除数据"
    target-name="重要数据"
    keyword="DELETE"
    :confirm-action="handleAsyncDelete"
    @confirm="onSuccess"
    @error="onError"
  />
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

// 异步删除函数
const handleAsyncDelete = async (payload) => {
  // 调用删除 API
  const response = await fetch('/api/delete', {
    method: 'DELETE',
    body: JSON.stringify({ name: payload.value })
  })

  if (!response.ok) {
    throw new Error('删除失败')
  }

  return response.json()
}

const onSuccess = (payload) => {
  console.log('删除成功')
}

const onError = ({ error, payload }) => {
  console.error('删除失败：', error.message)
}
</script>
```

## 插件式调用 (NEW)

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

// 危险操作确认
const deleteSomething = async () => {
  try {
    const result = await proxy.$confirmInput.danger({
      targetName: 'my-project',
      keyword: 'my-project'
    })
    console.log('确认删除：', result.value)
  } catch (error) {
    console.log('用户取消操作')
  }
}

// 插件式调用示例 - 基础方法
const dangerAction = async () => {
  try {
    await proxy.$confirmInput.danger({
      targetName: '重要数据',
      targetType: '数据',
      keyword: '重要数据',
      dangerMessage: '您即将删除重要数据，此操作不可恢复！',
      description: '请输入数据名称以确认删除操作'
    })
    console.log('操作确认成功')
  } catch (error) {
    console.log('用户取消操作')
  }
}

// 业务层帮助函数示例
import { deleteProject, resetSystem } from '@/utils/confirmHelpers'

const deleteProjectAction = async () => {
  try {
    await deleteProject('my-awesome-project')
    console.log('项目删除成功')
  } catch (error) {
    console.log('用户取消删除')
  }
}

const resetSystemAction = async () => {
  try {
    await resetSystem()
    console.log('系统重置成功')
  } catch (error) {
    console.log('用户取消重置')
  }
}
</script>
```

### 插件 API 方法

#### 基础方法

##### `$confirmInput.danger(options)`

显示危险操作确认对话框（红色主题）

##### `$confirmInput.warning(options)`

显示警告操作确认对话框（橙色主题）

##### `$confirmInput.info(options)`

显示信息确认对话框（蓝色主题）

#### 业务层帮助函数

为了保持组件的通用性，业务相关的快捷方法已移至业务层。请使用以下方式：

```javascript
// 导入业务层帮助函数
import { deleteProject, deleteUser, resetSystem } from '@/utils/confirmHelpers'

// 删除项目
await deleteProject('项目名称')

// 删除用户
await deleteUser('用户名')

// 重置系统
await resetSystem()
```

更多业务层帮助函数请参考 `@/utils/confirmHelpers.js`

## Props

- modelValue: Boolean = false - 控制对话框显隐
- title: String - 对话框标题
- message: String - 警告区域主标题
- description: String - 警告区域描述文本
- keyword: String - 需要精确匹配的关键字（与 pattern 二选一）
- pattern: RegExp | String - 正则校验（优先级高于 keyword）
- validator: Function(val) => boolean|string|Promise - 同步/异步校验（最高优先级）
- **confirmAction: Function - 确认操作的异步函数，返回 Promise**
- requireKeyword: Boolean = true - 是否必须输入
- width: String|Number = 520 - 对话框宽度
- closable: Boolean = true - 是否显示关闭按钮
- maskClosable: Boolean = false - 点击遮罩是否关闭
- unmountOnClose: Boolean = false - 关闭时是否销毁
- inputLabel: String - 输入项标签
- placeholder: String - 输入框占位符
- okText: String - 确认按钮文案，默认"确认删除"
- okLoading: Boolean = false - 确认按钮 loading 状态
- disabledWhenMismatch: Boolean = true - 失配时禁用确认
- caseSensitive: Boolean = true - 是否大小写敏感
- autofocus: Boolean = true - 打开时自动聚焦输入框
- maxlength: Number = 0 - 最大长度；0 表示不限制
- inputProps: Object - 透传给输入框的属性
- rounded: Boolean = false - 按钮是否使用圆角样式
- showErrorMessage: Boolean = true - confirmAction 失败时是否自动用 ElMessage 弹出错误；设为 false 时只触发 error 事件，交由外部自定义提示

## 事件

- update:modelValue(visible) - 显隐状态变化
- open() - 对话框打开时触发
- close() - 对话框关闭时触发
- confirm({ value }) - 确认操作时触发
- **error({ error, payload }) - confirmAction 执行失败时触发**

## 插槽

- message - 自定义警告区域内容
- extra - 表单额外内容（如二次确认复选框）
- footer-left - 底部左侧扩展区域

## 样式定制

根类：`.zx-confirm-input`

主要 CSS 变量：

- --zx-confirm-input-bg - 背景色
- --zx-confirm-input-danger - 危险色（按钮）
- --zx-confirm-input-warning - 警告色（提示区域）
- --zx-confirm-input-text - 主文本色
- --zx-confirm-input-text-secondary - 次要文本色
- --zx-confirm-input-border - 边框色
- --zx-confirm-input-radius - 圆角大小
- --zx-confirm-input-padding - 内边距
- --zx-confirm-input-shadow - 阴影效果

可通过覆盖上述变量实现主题定制。

## 设计特点

- 采用 GitLab 风格设计，简洁美观
- 单按钮交互，减少用户选择负担
- 警告区域使用图标和分层文字，信息层次清晰
- 支持响应式设计，移动端友好
- 按钮支持悬停和点击动效，提升用户体验

## 注意事项

- 若同时提供 pattern 与 keyword，pattern 优先生效
- validator 存在时优先于其它校验方式
- 将 disabledWhenMismatch 设为 false 可允许不通过校验也能点击确认
- 默认关闭点击遮罩关闭功能，避免误操作
- 建议在危险操作场景使用，提升操作安全性
- 如果需要统一由外部捕获并展示错误（例如全局通知系统），将 `showErrorMessage` 设为 `false`，并监听 `error` 事件或 `service` 调用返回的 Promise 进行自定义处理。

### 仅自定义错误处理示例

```vue
<ZxConfirmInput
  v-model="visible"
  keyword="DELETE"
  :confirm-action="delApi"
  :show-error-message="false"
  @error="({ error }) => addCustomLog(error.message)"
/>
```
