<template>
  <el-select
    v-model="innerValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :size="size"
    style="width: 100%"
    @change="onChange"
    @clear="onClear"
  >
    <el-option
      v-for="item in fileTypeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <div class="file-type-option">
        <Icon :icon="item.icon" class="file-type-icon" :style="{ color: item.color }" />
        <span class="file-type-label">{{ item.label }}</span>
        <el-tag size="small" :type="item.tagType">{{ item.desc }}</el-tag>
      </div>
    </el-option>
  </el-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@/components/Icon'

defineOptions({ name: 'SelectFileType' })

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择导出文件类型'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear'])

const innerValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    innerValue.value = v
  }
)

watch(innerValue, (v) => {
  emit('update:modelValue', v)
})

// 文件类型选项
const fileTypeOptions = [
  {
    value: 'pdf',
    label: 'PDF',
    icon: 'mdi:file-pdf-box',
    color: '#e53e3e',
    desc: '便携文档',
    tagType: 'danger'
  },
  {
    value: 'word',
    label: 'Word',
    icon: 'mdi:file-word-box',
    color: '#2b6cb0',
    desc: '文档格式',
    tagType: 'primary'
  },
  {
    value: 'ppt',
    label: 'PPT',
    icon: 'mdi:file-powerpoint-box',
    color: '#dd6b20',
    desc: '演示文稿',
    tagType: 'warning'
  },
  {
    value: 'png',
    label: 'PNG',
    icon: 'mdi:file-image-box',
    color: '#38a169',
    desc: '图片格式',
    tagType: 'success'
  }
]

const onChange = (val) => {
  emit('change', val)
}

const onClear = () => {
  emit('clear')
}
</script>

<style scoped>
.file-type-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-type-icon {
  font-size: 20px;
}

.file-type-label {
  flex: 1;
  font-weight: 500;
  color: var(--el-text-color-primary);
}
</style>

