# ZxFormCreate 表单创建组件

基于 Element Plus 的动态表单生成组件，通过简单的配置即可快速生成各种类型的表单。

## 特性

- 🚀 **简单易用** - 通过配置数组快速生成表单
- 🎨 **丰富的控件** - 支持 15+ 种表单控件类型
- 🔧 **高度可定制** - 支持自定义样式、验证规则和插槽
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🎯 **TypeScript 友好** - 虽然组件使用 JavaScript，但提供完整的类型提示
- 🌈 **主题支持** - 基于 CSS 变量的主题系统，支持深色模式

## 安装

```bash
# 组件已内置在项目中，无需单独安装
```

## 基础用法

```vue
<template>
  <ZxFormCreate v-model="formData" :items="formItems" @submit="handleSubmit" />
</template>

<script setup>
import { reactive } from 'vue'
import ZxFormCreate from '@/components/pure/ZxFormCreate'

const formData = reactive({
  name: '',
  email: '',
  age: 0
})

const formItems = [
  {
    type: 'input',
    field: 'name',
    label: '姓名',
    required: true,
    props: {
      placeholder: '请输入姓名'
    }
  },
  {
    type: 'input',
    field: 'email',
    label: '邮箱',
    required: true,
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ]
  },
  {
    type: 'number',
    field: 'age',
    label: '年龄',
    props: {
      min: 0,
      max: 120
    }
  }
]

const handleSubmit = (data) => {
  console.log('表单数据:', data)
}
</script>
```

## 支持的表单控件

| 类型       | 说明       | 对应组件                   |
| ---------- | ---------- | -------------------------- |
| `input`    | 输入框     | `el-input`                 |
| `textarea` | 文本域     | `el-input type="textarea"` |
| `number`   | 数字输入框 | `el-input-number`          |
| `select`   | 选择器     | `el-select`                |
| `radio`    | 单选框组   | `el-radio-group`           |
| `checkbox` | 复选框组   | `el-checkbox-group`        |
| `date`     | 日期选择器 | `el-date-picker`           |
| `time`     | 时间选择器 | `el-time-picker`           |
| `cascader` | 级联选择器 | `el-cascader`              |
| `switch`   | 开关       | `el-switch`                |
| `slider`   | 滑块       | `el-slider`                |
| `rate`     | 评分       | `el-rate`                  |
| `color`    | 颜色选择器 | `el-color-picker`          |
| `upload`   | 上传组件   | `el-upload`                |
| `slot`     | 自定义插槽 | 自定义内容                 |

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 表单数据对象 | `Object` | `{}` |
| `items` | 表单项配置数组 | `Array` | `[]` |
| `formProps` | 传递给 el-form 的属性 | `Object` | `{ labelWidth: '100px', labelPosition: 'right' }` |
| `showActions` | 是否显示操作按钮 | `Boolean` | `true` |
| `resetText` | 重置按钮文本 | `String` | `'重置'` |
| `submitText` | 提交按钮文本 | `String` | `'提交'` |
| `submitLoading` | 提交按钮加载状态 | `Boolean` | `false` |
| `disabled` | 是否禁用表单 | `Boolean` | `false` |

### FormItem 配置

每个表单项支持以下配置：

| 参数       | 说明                                          | 类型      | 是否必填 |
| ---------- | --------------------------------------------- | --------- | -------- |
| `type`     | 表单控件类型                                  | `String`  | 是       |
| `field`    | 字段名，对应 formData 中的 key                | `String`  | 是       |
| `label`    | 标签文本                                      | `String`  | 是       |
| `required` | 是否必填                                      | `Boolean` | 否       |
| `value`    | 默认值                                        | `Any`     | 否       |
| `props`    | 传递给具体控件的属性                          | `Object`  | 否       |
| `options`  | 选项数据（适用于 select、radio、checkbox 等） | `Array`   | 否       |
| `rules`    | 自定义验证规则                                | `Array`   | 否       |
| `disabled` | 是否禁用该项                                  | `Boolean` | 否       |

### Events

| 事件名              | 说明                       | 参数                       |
| ------------------- | -------------------------- | -------------------------- |
| `update:modelValue` | 表单数据更新               | `(formData)`               |
| `submit`            | 表单提交（验证通过后触发） | `(formData)`               |
| `reset`             | 表单重置                   | `(formData)`               |
| `change`            | 表单项值变化               | `(field, value, formData)` |
| `validate`          | 表单验证                   | `(prop, isValid, message)` |

### Methods

通过 ref 可以调用以下方法：

| 方法名                        | 说明         | 参数                        |
| ----------------------------- | ------------ | --------------------------- |
| `validate()`                  | 验证整个表单 | -                           |
| `validateField(field)`        | 验证指定字段 | `field: string`             |
| `clearValidate(fields)`       | 清除验证信息 | `fields?: string[]`         |
| `resetFields()`               | 重置表单     | -                           |
| `getFieldValue(field)`        | 获取字段值   | `field: string`             |
| `setFieldValue(field, value)` | 设置字段值   | `field: string, value: any` |
| `getFormData()`               | 获取表单数据 | -                           |
| `setFormData(data)`           | 设置表单数据 | `data: object`              |

### Slots

| 插槽名           | 说明                                     | 参数                 |
| ---------------- | ---------------------------------------- | -------------------- |
| `actions`        | 自定义操作按钮区域                       | `{ formRef, model }` |
| `upload-{field}` | 自定义上传组件内容                       | -                    |
| `{field}`        | 自定义表单项内容（当 type 为 'slot' 时） | `{ item, model }`    |

## 高级用法

### 自定义验证规则

```vue
<script setup>
const formItems = [
  {
    type: 'input',
    field: 'password',
    label: '密码',
    required: true,
    rules: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度为 6-20 位', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(value)) {
            callback(new Error('密码必须包含大小写字母和数字'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
]
</script>
```

### 动态表单项

```vue
<template>
  <ZxFormCreate v-model="formData" :items="dynamicItems" />

  <el-button @click="addItem">添加字段</el-button>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = reactive({})
const baseItems = [
  {
    type: 'input',
    field: 'name',
    label: '姓名',
    required: true
  }
]

const dynamicItems = ref([...baseItems])

const addItem = () => {
  const newField = `field_${Date.now()}`
  dynamicItems.value.push({
    type: 'input',
    field: newField,
    label: `动态字段 ${dynamicItems.value.length}`,
    props: {
      placeholder: '请输入内容'
    }
  })
  formData[newField] = ''
}
</script>
```

### 自定义插槽

```vue
<template>
  <ZxFormCreate v-model="formData" :items="formItems">
    <!-- 自定义表单项 -->
    <template #customField="{ item, model }">
      <div class="custom-input">
        <el-input v-model="model.customField">
          <template #prepend>自定义</template>
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
    </template>

    <!-- 自定义操作按钮 -->
    <template #actions="{ formRef, model }">
      <el-button @click="customAction(formRef, model)"> 自定义操作 </el-button>
    </template>
  </ZxFormCreate>
</template>
```

## 样式定制

组件使用 CSS 变量系统，支持主题定制：

```scss
.zx-form-create {
  // 自定义主色调
  --zx-form-create-hover-color: #67c23a;

  // 自定义容器样式
  --zx-form-create-container-bg: #f8f9fa;
  --zx-form-create-container-border: #e9ecef;
  --zx-form-create-container-padding: 24px;

  // 自定义表单项间距
  --zx-form-create-item-margin-bottom: 24px;

  // 自定义标签样式
  --zx-form-create-item-label-color: #495057;
  --zx-form-create-item-label-font-weight: 600;
}
```

## 注意事项

1. **字段名唯一性**：确保每个表单项的 `field` 属性在同一个表单中是唯一的
2. **数据响应性**：使用 `reactive` 或 `ref` 来定义 `formData`，确保数据响应性
3. **验证规则**：自定义验证规则遵循 Element Plus 的验证规则格式
4. **选项数据格式**：对于 select、radio、checkbox 等控件，选项数据格式为 `{ label, value, disabled? }`
5. **插槽命名**：自定义插槽的名称必须与表单项的 `field` 属性一致

## 兼容性

- Vue 3.0+
- Element Plus 2.0+
- 现代浏览器（IE 不支持）

## 更新日志

### v1.0.0

- 初始版本发布
- 支持 15+ 种表单控件类型
- 完整的 API 和插槽系统
- 响应式设计和主题支持
