# ZxUpload 文件上传组件

基于 Element Plus 的文件上传组件，提供了丰富的功能和灵活的配置选项。

## 特性

- 🚀 **多种上传方式**：支持点击选择、拖拽上传
- 📁 **多文件支持**：支持单文件和多文件上传
- 🎨 **多种布局**：文本、图片、图片卡片等布局模式
- 📏 **尺寸变体**：提供大、中、小三种尺寸
- 🔒 **文件验证**：支持文件类型、大小、数量限制
- 🎯 **自定义样式**：可自定义文件列表样式
- 📱 **响应式设计**：适配移动端和桌面端
- 🌙 **主题支持**：支持亮色和暗色主题
- ♿ **无障碍访问**：支持键盘导航和屏幕阅读器

## 基础用法

```vue
<template>
  <ZxUpload v-model="fileList" action="/api/upload" @change="handleChange" />
</template>

<script setup>
import { ref } from 'vue'
import ZxUpload from '@/components/pure/ZxUpload'

const fileList = ref([])

const handleChange = (files) => {
  console.log('文件列表变化:', files)
}
</script>
```

## 拖拽上传

```vue
<template>
  <ZxUpload
    v-model="fileList"
    action="/api/upload"
    :drag="true"
    main-text="拖拽文件到此处上传"
    sub-text="支持单个或批量上传"
  />
</template>
```

## 多文件上传

```vue
<template>
  <ZxUpload
    v-model="fileList"
    action="/api/upload"
    :multiple="true"
    :limit="5"
    accept=".jpg,.jpeg,.png,.pdf"
    :max-size="10 * 1024 * 1024"
  />
</template>
```

## 图片上传

```vue
<template>
  <ZxUpload
    v-model="fileList"
    action="/api/upload"
    list-type="picture-card"
    accept="image/*"
    :multiple="true"
    :limit="3"
  />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| modelValue / v-model | 文件列表 | Array | — | [] |
| action | 上传的地址 | String | — | '' |
| headers | 设置上传的请求头部 | Object | — | {} |
| data | 上传时附带的额外参数 | Object | — | {} |
| name | 上传的文件字段名 | String | — | 'file' |
| withCredentials | 支持发送 cookie 凭证信息 | Boolean | — | false |
| multiple | 是否支持多选文件 | Boolean | — | false |
| accept | 接受上传的文件类型 | String | — | '\*' |
| limit | 最大允许上传个数 | Number | — | — |
| maxSize | 文件大小限制，单位字节 | Number | — | 10485760 |
| listType | 文件列表的类型 | String | text/picture/picture-card | 'text' |
| drag | 是否启用拖拽上传 | Boolean | — | false |
| showFileList | 是否显示已上传文件列表 | Boolean | — | true |
| customFileList | 是否使用自定义文件列表 | Boolean | — | false |
| mainText | 主要提示文案 | String | — | '' |
| subText | 次要提示文案 | String | — | '' |
| buttonText | 按钮文案 | String | — | '' |
| tipText | 提示文案 | String | — | '' |
| showSubText | 是否显示次要文案 | Boolean | — | true |
| showTip | 是否显示提示文案 | Boolean | — | true |
| autoUpload | 是否在选取文件后立即进行上传 | Boolean | — | true |
| disabled | 是否禁用 | Boolean | — | false |
| allowPreview | 是否允许预览 | Boolean | — | true |
| allowDownload | 是否允许下载 | Boolean | — | true |
| allowRemove | 是否允许删除 | Boolean | — | true |
| beforeUpload | 上传文件之前的钩子 | Function | — | — |
| beforeRemove | 删除文件之前的钩子 | Function | — | — |
| size | 组件尺寸 | String | large/default/small | 'default' |

### Events

| 事件名            | 说明                             | 回调参数                   |
| ----------------- | -------------------------------- | -------------------------- |
| update:modelValue | 文件列表变化时触发               | (fileList)                 |
| change            | 文件状态改变时触发               | (fileList)                 |
| preview           | 点击文件列表中已上传的文件时触发 | (file)                     |
| remove            | 文件列表移除文件时触发           | (file)                     |
| success           | 文件上传成功时触发               | (response, file, fileList) |
| error             | 文件上传失败时触发               | (error, file, fileList)    |
| progress          | 文件上传时触发                   | (event, file, fileList)    |
| exceed            | 文件超出个数限制时触发           | (files, fileList)          |
| download          | 点击下载按钮时触发               | (file)                     |

### Methods

| 方法名     | 说明                 | 参数   |
| ---------- | -------------------- | ------ |
| submit     | 手动上传文件列表     | —      |
| clearFiles | 清空已上传的文件列表 | —      |
| abort      | 取消上传请求         | (file) |

### Slots

| 插槽名  | 说明                     |
| ------- | ------------------------ |
| default | 自定义上传按钮或区域内容 |
| tip     | 自定义提示文案内容       |

## 高级用法

### 手动上传

```vue
<template>
  <ZxUpload ref="uploadRef" v-model="fileList" action="/api/upload" :auto-upload="false" />
  <el-button @click="submitUpload">开始上传</el-button>
  <el-button @click="clearFiles">清空文件</el-button>
</template>

<script setup>
import { ref } from 'vue'

const uploadRef = ref()
const fileList = ref([])

const submitUpload = () => {
  uploadRef.value.submit()
}

const clearFiles = () => {
  uploadRef.value.clearFiles()
}
</script>
```

### 自定义验证

```vue
<template>
  <ZxUpload
    v-model="fileList"
    action="/api/upload"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
  />
</template>

<script setup>
import { ElMessageBox } from 'element-plus'

const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

const beforeRemove = (file) => {
  return ElMessageBox.confirm(`确定移除 ${file.name}？`).then(
    () => true,
    () => false
  )
}
</script>
```

### 自定义文件列表

```vue
<template>
  <ZxUpload
    v-model="fileList"
    action="/api/upload"
    :custom-file-list="true"
    :allow-preview="true"
    :allow-download="true"
    @preview="handlePreview"
    @download="handleDownload"
  />
</template>

<script setup>
const handlePreview = (file) => {
  console.log('预览文件:', file)
}

const handleDownload = (file) => {
  console.log('下载文件:', file)
}
</script>
```

## 样式定制

组件使用 CSS 变量进行样式定制，你可以通过覆盖这些变量来自定义样式：

```scss
.zx-upload {
  // 自定义拖拽区域颜色
  --el-color-primary: #409eff;
  --el-color-primary-light-9: #ecf5ff;

  // 自定义边框颜色
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;

  // 自定义文本颜色
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-placeholder: #a8abb2;
}
```

## 国际化

组件内置了中文提示文案，如需自定义或支持其他语言，可以通过 props 传入自定义文案：

```vue
<template>
  <ZxUpload
    v-model="fileList"
    action="/api/upload"
    main-text="Drop files here or click to upload"
    sub-text="Support for a single or bulk upload"
    button-text="Select Files"
    tip-text="Only jpg/png files with a size less than 500kb"
  />
</template>
```

## 无障碍访问

组件支持键盘导航和屏幕阅读器：

- 使用 `Tab` 键可以聚焦到上传区域
- 使用 `Enter` 或 `Space` 键可以触发文件选择
- 支持 ARIA 标签，便于屏幕阅读器识别

## 注意事项

1. **文件大小限制**：默认限制单个文件大小为 10MB，可通过 `maxSize` 属性调整
2. **文件类型验证**：建议同时在前端和后端进行文件类型验证
3. **跨域上传**：如需跨域上传，请设置 `withCredentials` 为 `true`
4. **移动端适配**：组件已适配移动端，在小屏幕设备上会自动调整布局
5. **性能优化**：大量文件上传时建议分批处理，避免浏览器卡顿

## 更新日志

### v1.0.0

- 🎉 初始版本发布
- ✨ 支持基础文件上传功能
- ✨ 支持拖拽上传
- ✨ 支持多文件上传
- ✨ 支持图片预览
- ✨ 支持自定义文件列表
- ✨ 支持响应式设计
- ✨ 支持主题切换
- ✨ 支持无障碍访问

## 许可证

MIT License
