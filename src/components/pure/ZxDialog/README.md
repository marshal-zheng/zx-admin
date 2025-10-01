# ZxDialog 对话框组件

基于 Element Plus 的对话框组件，支持开关控制、自定义按钮、描述列表等功能。

## 功能特性

- ✅ 基于 Element Plus el-dialog 组件
- ✅ 支持开关控制功能
- ✅ 支持自定义操作按钮
- ✅ 支持描述列表展示
- ✅ 支持多种尺寸（small/medium/large）
- ✅ 响应式设计，适配移动端
- ✅ 支持暗色主题
- ✅ JavaScript 类型支持
- ✅ 可选：自动表单重置（关闭时清除校验+恢复初始值）
- ✅ 可选：确认前自动表单校验
- ✅ 可选：校验失败时自动滚动到第一个错误项

## 基础用法

```vue
<template>
  <div>
    <el-button @click="dialog = true">打开对话框</el-button>

    <ZxDialog v-model="dialog" title="基础对话框" width="600px">
      <p>这是对话框内容</p>
    </ZxDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ZxDialog from '@/components/pure/ZxDialog'

const dialog = ref(false)
</script>
```

## 高级用法

### 表单增强：自动重置 + 自动滚动错误

当对话框内容里包含 `el-form` 时，可通过传入 `formRef` 与 `formModel` 获得增强体验：

```vue
<template>
  <ZxDialog
    v-model="visible"
    title="创建用户"
    :confirm="handleSubmit"
    :form-ref="formRef"      <!-- 传入 el-form 的 ref -->
    :form-model="formData"   <!-- 传入响应式表单对象 -->
    :auto-reset-form="true"  <!-- 关闭时自动重置 (默认 true) -->
    :pre-validate="true"     <!-- 点击确定前自动 validate (默认 true) -->
    :auto-scroll-to-error="true" <!-- 校验失败自动滚动 (默认 true) -->
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="name" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" required>
        <el-input v-model="formData.email" />
      </el-form-item>
      <!-- 其它很多字段... 当第一个错误项不在可视区域会自动滚动定位 -->
    </el-form>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)
const formRef = ref()
const formData = reactive({ name: '', email: '' })
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  // 如果 preValidate=true，这里能确保已经通过校验
  // 返回 false 可阻止自动关闭
  // 正常返回即自动关闭；或手动 visible.value = false
  // 这里模拟提交
  await new Promise(r => setTimeout(r, 300))
}
</script>
```

#### 行为说明

1. 打开对话框时自动快照表单初始值（深拷贝）
2. 关闭（包括取消、确认成功、点击遮罩等）后：
   - 若 `auto-reset-form = true`，执行 `formRef.resetFields()`；若无该方法，则根据初始快照逐项恢复
   - 自动调用 `clearValidate()` 清除所有校验提示
3. 点击“确定”时：
   - 若 `pre-validate = true` 且校验失败，则阻止后续 `confirm`，并自动滚动到第一个错误项
4. 滚动定位：自动向上预留 `scrollErrorOffset`（默认 24px）避免被标题遮挡

### 自定义滚动偏移

```vue
<ZxDialog
  v-model="visible"
  :confirm="handleSubmit"
  :form-ref="formRef"
  :form-model="formData"
  :scroll-error-offset="80"  <!-- 需要更大可视安全区时调整 -->
>
  <!-- form -->
</ZxDialog>
```

### 带开关的对话框

```vue
<template>
  <ZxDialog
    v-model="dialog"
    title="带开关的对话框"
    :switch-props="{
      showSwitch: true,
      switchName: '启用功能',
      switchTooltip: '开启后将启用此功能',
      enable: switchValue
    }"
    @confirm="handleConfirm"
  >
    <p>这是一个带开关控制的对话框</p>
  </ZxDialog>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const switchValue = ref(false)

const handleConfirm = (enable) => {
  console.log('开关状态:', enable)
  dialog.value = false
}
</script>
```

### 描述列表对话框

```vue
<template>
  <ZxDialog v-model="dialog" title="详情信息" :descriptions="descriptions" :show-skeleton="loading">
    <template #descValue="{ item }">
      <span v-if="item.label === '状态'" :class="getStatusClass(item.value)">
        {{ item.value }}
      </span>
      <span v-else>{{ item.value }}</span>
    </template>
  </ZxDialog>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const loading = ref(false)
const descriptions = ref([
  { label: '用户名', value: 'admin' },
  { label: '邮箱', value: 'admin@example.com' },
  { label: '状态', value: '正常' },
  { label: '创建时间', value: '2023-12-01 10:00:00' }
])

const getStatusClass = (status) => {
  return status === '正常' ? 'text-green-500' : 'text-red-500'
}
</script>
```

### 自定义操作按钮

```vue
<template>
  <ZxDialog
    v-model="dialog"
    title="自定义操作"
    :show-continue="true"
    save-continue-text="保存并新建"
    @confirm="handleSave"
    @continue="handleSaveAndNew"
  >
    <template #self-button>
      <el-button @click="handleExport">导出</el-button>
    </template>

    <template #footerLeft>
      <el-button type="info" @click="handleHelp">帮助</el-button>
    </template>

    <p>自定义操作按钮的对话框</p>
  </ZxDialog>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)

const handleSave = () => {
  console.log('保存')
  dialog.value = false
}

const handleSaveAndNew = () => {
  console.log('保存并新建')
  // 不关闭对话框，继续新建
}

const handleExport = () => {
  console.log('导出')
}

const handleHelp = () => {
  console.log('显示帮助')
}
</script>
```

### 不同尺寸

```vue
<template>
  <div>
    <el-button @click="showSmall">小尺寸</el-button>
    <el-button @click="showMedium">中等尺寸</el-button>
    <el-button @click="showLarge">大尺寸</el-button>

    <ZxDialog v-model="dialog" title="不同尺寸对话框" :dialog-size="currentSize">
      <p>当前尺寸: {{ currentSize }}</p>
    </ZxDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const currentSize = ref('medium')

const showSmall = () => {
  currentSize.value = 'small'
  dialog.value = true
}

const showMedium = () => {
  currentSize.value = 'medium'
  dialog.value = true
}

const showLarge = () => {
  currentSize.value = 'large'
  dialog.value = true
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| modelValue / v-model | 是否显示对话框 | boolean | — | false |
| title | 对话框标题 | string | — | — |
| titleTag | 标题标签文本 | string | — | — |
| titleTagColor | 标题标签颜色 | string | — | — |
| descriptions | 描述列表数据 | array | — | [] |
| footer | 是否显示底部操作栏 | boolean | — | true |
| showCancel | 是否显示取消按钮 | boolean | — | true |
| mask | 是否显示遮罩层 | boolean | — | true |
| showSkeleton | 是否显示骨架屏 | boolean | — | false |
| okLoading | 确定按钮加载状态 | boolean | — | false |
| okDisabled | 确定按钮禁用状态 | boolean | — | false |
| okText | 确定按钮文本 | string | — | 确定 |
| cancelText | 取消按钮文本 | string | — | 取消 |
| saveContinueText | 保存并继续按钮文本 | string | — | 保存并继续 |
| showContinue | 是否显示保存并继续按钮 | boolean | — | false |
| width | 对话框宽度 | string \| number | — | 50% |
| dialogSize | 对话框尺寸 | string | small / medium / large | medium |
| noContentPadding | 是否移除内容区域内边距 | boolean | — | false |
| closable | 是否显示关闭按钮 | boolean | — | true |
| noTitle | 是否隐藏标题栏 | boolean | — | false |
| dialogStyle | 对话框自定义样式 | object | — | {} |
| maskClosable | 是否可以通过点击遮罩关闭 | boolean | — | false |
| unmountOnClose | 关闭时销毁子元素 | boolean | — | false |
| switchProps | 开关配置对象 | object | — | {} |
| handleBeforeCancel | 取消前的回调函数 | function | — | null |
| confirm | 确认回调函数 | function | — | null |
| formRef | el-form 的 ref（用于增强：校验、重置、滚动） | object | — | — |
| formModel | 表单的响应式数据对象（用于快照恢复） | object | — | — |
| autoResetForm | 关闭时自动重置表单+清除校验 | boolean | — | true |
| preValidate | 点击确定前自动执行 validate | boolean | — | true |
| autoScrollToError | 校验失败时自动滚动到第一个错误项 | boolean | — | true |
| scrollErrorOffset | 滚动定位时的向上偏移量(px) | number | — | 24 |

### switchProps 配置

| 参数          | 说明         | 类型    | 默认值 |
| ------------- | ------------ | ------- | ------ |
| showSwitch    | 是否显示开关 | boolean | false  |
| switchName    | 开关标签文本 | string  | —      |
| switchTooltip | 开关提示信息 | string  | —      |
| enable        | 开关初始状态 | boolean | false  |

### Events

| 事件名            | 说明                     | 回调参数               |
| ----------------- | ------------------------ | ---------------------- |
| update:modelValue | 对话框显示状态改变时触发 | (value: boolean)       |
| confirm           | 点击确定按钮时触发       | (switchValue: boolean) |
| cancel            | 点击取消按钮时触发       | —                      |
| continue          | 点击保存并继续按钮时触发 | —                      |
| open              | 对话框打开时触发         | —                      |
| close             | 对话框关闭时触发         | —                      |

### Slots

| 插槽名      | 说明                 |
| ----------- | -------------------- |
| default     | 对话框内容           |
| title       | 自定义标题内容       |
| headerLeft  | 标题左侧内容         |
| tbutton     | 标题右侧按钮         |
| descValue   | 自定义描述列表值内容 |
| footer      | 自定义底部内容       |
| footerLeft  | 底部左侧内容         |
| self-button | 自定义操作按钮       |

## 样式定制

组件使用 SCSS 变量，可以通过覆盖以下变量来定制样式：

```scss
// 对话框圆角
--zx-dialog-border-radius: 8px;

// 对话框阴影
--zx-dialog-box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

// 头部背景色
--zx-dialog-header-bg: #ffffff;

// 内容背景色
--zx-dialog-body-bg: #ffffff;

// 底部背景色
--zx-dialog-footer-bg: #ffffff;

// 边框颜色
--zx-dialog-border-color: #e4e7ed;
```

## 注意事项

1. 组件基于 Element Plus，请确保项目中已正确安装和配置 Element Plus
2. 开关功能需要配置 `switchProps` 对象
3. 描述列表功能需要传入 `descriptions` 数组
4. 自定义按钮可以通过插槽实现
5. 建议在使用前先了解 Element Plus Dialog 组件的基础用法

## 兼容性

- Vue 3.3+
- Element Plus 2.3+
- 现代浏览器（Chrome 50+, Firefox 50+, Edge 50+）
