<template>
  <div class="zx-upload">
    <el-upload
      ref="uploadRef"
      v-model:file-list="innerFileList"
      :class="uploadClass"
      :action="action"
      :headers="headers"
      :data="data"
      :name="name"
      :with-credentials="withCredentials"
      :multiple="multiple"
      :accept="accept"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :before-remove="handleBeforeRemove"
      :list-type="listType"
      :auto-upload="autoUpload"
      :file-list="innerFileList"
      :disabled="disabled"
      :limit="limit"
      :on-exceed="handleExceed"
      :drag="drag"
      :show-file-list="showFileList"
    >
      <template v-if="drag">
        <div class="zx-upload-dragger">
          <div class="zx-upload-icon">
            <el-icon class="zx-upload-icon-inner">
              <UploadFilled />
            </el-icon>
          </div>
          <div class="zx-upload-text">
            <div class="zx-upload-main-text">
              {{ mainText || '将文件拖到此处，或点击上传' }}
            </div>
            <div v-if="showSubText" class="zx-upload-sub-text">
              <slot name="tip">
                {{ subText || `支持 ${accept || '*'} 格式，单个文件不超过 ${formatSize(maxSize)}` }}
              </slot>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="listType === 'picture-card'">
        <el-icon><Plus /></el-icon>
      </template>

      <template v-else>
        <el-button type="primary" :disabled="disabled">
          <el-icon><Upload /></el-icon>
          {{ buttonText || '选择文件' }}
        </el-button>
      </template>

      <template #tip v-if="!drag && showTip">
        <div class="el-upload__tip">
          <slot name="tip">
            {{ tipText || `支持 ${accept || '*'} 格式，单个文件不超过 ${formatSize(maxSize)}` }}
          </slot>
        </div>
      </template>
    </el-upload>

    <!-- 自定义文件列表 -->
    <div v-if="customFileList && showFileList" class="zx-upload-file-list">
      <div
        v-for="(file, index) in innerFileList"
        :key="file.uid || index"
        class="zx-upload-file-item"
        :class="{
          'is-success': file.status === 'success',
          'is-error': file.status === 'error',
          'is-uploading': file.status === 'uploading'
        }"
      >
        <div class="zx-upload-file-info">
          <el-icon class="zx-upload-file-icon">
            <Document />
          </el-icon>
          <span class="zx-upload-file-name" :title="file.name">{{ file.name }}</span>
          <span class="zx-upload-file-size">{{ formatFileSize(file.size) }}</span>
        </div>

        <div class="zx-upload-file-actions">
          <el-progress
            v-if="file.status === 'uploading'"
            :percentage="file.percentage || 0"
            :show-text="false"
            class="zx-upload-progress"
          />

          <div class="zx-upload-file-buttons">
            <el-button
              v-if="file.status === 'success' && allowPreview"
              type="text"
              size="small"
              @click="handlePreview(file)"
            >
              <el-icon><View /></el-icon>
            </el-button>

            <el-button
              v-if="file.status === 'success' && allowDownload"
              type="text"
              size="small"
              @click="handleDownload(file)"
            >
              <el-icon><Download /></el-icon>
            </el-button>

            <el-button type="text" size="small" :disabled="disabled" @click="handleRemove(file)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  UploadFilled,
  Plus,
  Document,
  View,
  Download,
  Delete
} from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // v-model
  modelValue: {
    type: Array,
    default: () => []
  },

  // 上传配置
  action: {
    type: String,
    default: ''
  },
  headers: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: String,
    default: 'file'
  },
  withCredentials: {
    type: Boolean,
    default: false
  },

  // 文件限制
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '*'
  },
  limit: {
    type: Number,
    default: undefined
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },

  // 显示配置
  listType: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'picture', 'picture-card'].includes(value)
  },
  drag: {
    type: Boolean,
    default: false
  },
  showFileList: {
    type: Boolean,
    default: true
  },
  customFileList: {
    type: Boolean,
    default: false
  },

  // 文案配置
  mainText: {
    type: String,
    default: ''
  },
  subText: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: ''
  },
  tipText: {
    type: String,
    default: ''
  },
  showSubText: {
    type: Boolean,
    default: true
  },
  showTip: {
    type: Boolean,
    default: true
  },

  // 功能配置
  autoUpload: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  allowPreview: {
    type: Boolean,
    default: true
  },
  allowDownload: {
    type: Boolean,
    default: true
  },
  allowRemove: {
    type: Boolean,
    default: true
  },

  // 验证配置
  beforeUpload: {
    type: Function,
    default: null
  },
  beforeRemove: {
    type: Function,
    default: null
  },

  // 样式配置
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  }
})

// Events 定义
const emit = defineEmits([
  'update:modelValue',
  'change',
  'preview',
  'remove',
  'success',
  'error',
  'progress',
  'exceed',
  'download'
])

// 响应式数据
const uploadRef = ref()
const innerFileList = ref([...props.modelValue])

// 计算属性
const uploadClass = computed(() => {
  return [
    'zx-upload-wrapper',
    `zx-upload--${props.size}`,
    {
      'zx-upload--drag': props.drag,
      'zx-upload--disabled': props.disabled,
      'zx-upload--custom-list': props.customFileList
    }
  ]
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    innerFileList.value = [...newVal]
  },
  { deep: true }
)

// 监听内部文件列表变化
watch(
  innerFileList,
  (newVal) => {
    emit('update:modelValue', newVal)
    emit('change', newVal)
  },
  { deep: true }
)

// 工具函数
const formatSize = (size) => {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return Math.round(size / 1024) + 'KB'
  } else {
    return Math.round(size / (1024 * 1024)) + 'MB'
  }
}

const formatFileSize = (size) => {
  if (!size) return ''
  return formatSize(size)
}

// 事件处理函数
const handlePreview = (file) => {
  emit('preview', file)
}

const handleRemove = (file) => {
  if (!props.allowRemove) return

  const doRemove = () => {
    const index = innerFileList.value.findIndex((item) => item.uid === file.uid)
    if (index > -1) {
      innerFileList.value.splice(index, 1)
    }
    emit('remove', file)
  }

  if (props.beforeRemove) {
    const result = props.beforeRemove(file)
    if (result && typeof result.then === 'function') {
      result.then(doRemove)
    } else if (result !== false) {
      doRemove()
    }
  } else {
    doRemove()
  }
}

const handleSuccess = (response, file, fileList) => {
  emit('success', response, file, fileList)
}

const handleError = (error, file, fileList) => {
  ElMessage.error('文件上传失败')
  emit('error', error, file, fileList)
}

const handleProgress = (event, file, fileList) => {
  emit('progress', event, file, fileList)
}

const handleChange = (file, fileList) => {
  innerFileList.value = fileList
}

const handleBeforeUpload = (file) => {
  // 文件大小验证
  if (file.size > props.maxSize) {
    ElMessage.error(`文件大小不能超过 ${formatSize(props.maxSize)}`)
    return false
  }

  // 文件类型验证
  if (props.accept && props.accept !== '*') {
    const acceptTypes = props.accept.split(',')
    const fileType = file.type
    const fileName = file.name
    const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()

    const isValidType = acceptTypes.some((type) => {
      type = type.trim()
      if (type.startsWith('.')) {
        return type.substring(1).toLowerCase() === fileExt
      }
      return fileType.includes(type)
    })

    if (!isValidType) {
      ElMessage.error(`不支持的文件类型，请上传 ${props.accept} 格式的文件`)
      return false
    }
  }

  // 自定义验证
  if (props.beforeUpload) {
    return props.beforeUpload(file)
  }

  return true
}

const handleBeforeRemove = (file) => {
  if (props.beforeRemove) {
    return props.beforeRemove(file)
  }
  return true
}

const handleExceed = (files, fileList) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
  emit('exceed', files, fileList)
}

const handleDownload = (file) => {
  if (file.url) {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  }
  emit('download', file)
}

// 暴露方法
const submit = () => {
  uploadRef.value?.submit()
}

const clearFiles = () => {
  uploadRef.value?.clearFiles()
  innerFileList.value = []
}

const abort = (file) => {
  uploadRef.value?.abort(file)
}

defineExpose({
  submit,
  clearFiles,
  abort
})
</script>

<style lang="scss">
@import './index.scss';
</style>
