<template>
  <ZxDrawer
    v-model="visible"
    :title="title"
    :width="width"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="beforeClose"
    :destroy-on-close="destroyOnClose"
    :modal="modal"
    :modal-class="modalClass"
    :z-index="zIndex"
    :direction="direction"
    :size="size"
    :with-header="withHeader"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :show-full-screen="false"
    class="zx-export-drawer"
  >
    <template #header v-if="$slots.header">
      <slot name="header"></slot>
    </template>

    <div class="export-drawer-content">
      <!-- 配置面板 -->
      <div class="config-panel">
        <div class="panel-header">
          <span class="panel-title">可选字段</span>
        </div>
        <div class="optional-fields">
          <div
            v-for="field in optionalFields"
            :key="field.key"
            class="field-item"
            :class="{ selected: isFieldSelected(field.key) }"
            @click="() => toggleField(field)"
          >
            <el-checkbox
              :model-value="isFieldSelected(field.key)"
              @change="() => toggleField(field)"
            >
              {{ field.label }}
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- 已选字段面板 -->
      <div class="selected-panel">
        <div class="panel-header">
          <span class="panel-title">已选字段 ({{ selectedFields.length }})</span>
          <el-button
            v-if="selectedFields.length > 0"
            type="text"
            size="small"
            @click="clearAllFields"
          >
            清空
          </el-button>
        </div>
        <div class="selected-fields" v-if="selectedFields.length > 0">
          <div
            v-for="(field, index) in selectedFields"
            :key="field.key"
            class="selected-field-item"
          >
            <span class="field-label">{{ field.label }}</span>
            <el-button type="text" size="small" @click="removeField(index)">
              <ZxIcon icon="Close" />
            </el-button>
          </div>
        </div>
        <div v-else class="empty-state">
          <ZxEmpty description="暂无已选字段" />
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <template #footer>
      <div class="drawer-footer">
        <ZxButton @click="handleCancel">取消</ZxButton>
        <ZxButton type="primary" :disabled="selectedFields.length === 0" @click="handleConfirm">
          确定导出
        </ZxButton>
      </div>
    </template>
  </ZxDrawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ZxDrawer from '../ZxDrawer/index.vue'
import ZxButton from '../ZxButton/index.vue'
import ZxIcon from '../ZxIcon/index.vue'
import ZxEmpty from '../ZxEmpty/index.vue'

// 定义组件名称
defineOptions({
  name: 'ZXExportDrawer'
})

// Props 定义
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '导出字段选择'
  },
  width: {
    type: [String, Number],
    default: '600px'
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  beforeClose: {
    type: Function,
    default: null
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  modal: {
    type: Boolean,
    default: true
  },
  modalClass: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: 1000
  },
  direction: {
    type: String,
    default: 'rtl'
  },
  size: {
    type: [String, Number],
    default: '30%'
  },
  withHeader: {
    type: Boolean,
    default: true
  },
  modalAppendToBody: {
    type: Boolean,
    default: true
  },
  appendToBody: {
    type: Boolean,
    default: false
  },
  // 可选字段列表
  fields: {
    type: Array,
    default: () => []
  },
  // 默认选中的字段
  defaultSelected: {
    type: Array,
    default: () => []
  },
  // 是否为数组列模式
  arrayMode: {
    type: Boolean,
    default: false
  }
})

// Events 定义
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedFields = ref([])
const optionalFields = computed(() => {
  if (props.arrayMode) {
    // 数组列模式：fields 是字符串数组
    return props.fields.map((field) => ({
      key: field,
      label: field
    }))
  } else {
    // 对象模式：fields 是对象数组
    return props.fields
  }
})

// 计算属性和方法
const isFieldSelected = (fieldKey) => {
  return selectedFields.value.some((field) => field.key === fieldKey)
}

const toggleField = (field) => {
  const index = selectedFields.value.findIndex((item) => item.key === field.key)
  if (index > -1) {
    selectedFields.value.splice(index, 1)
  } else {
    selectedFields.value.push(field)
  }
}

const removeField = (index) => {
  selectedFields.value.splice(index, 1)
}

const clearAllFields = () => {
  selectedFields.value = []
}

const handleConfirm = () => {
  const result = props.arrayMode
    ? selectedFields.value.map((field) => field.key)
    : selectedFields.value

  emit('confirm', result)
  visible.value = false
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

// 监听器
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // 重置选中字段为默认值
      if (props.arrayMode) {
        selectedFields.value = props.defaultSelected.map((key) => ({
          key,
          label: key
        }))
      } else {
        selectedFields.value = [...props.defaultSelected]
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.defaultSelected,
  (newVal) => {
    if (props.arrayMode) {
      selectedFields.value = newVal.map((key) => ({
        key,
        label: key
      }))
    } else {
      selectedFields.value = [...newVal]
    }
  },
  { deep: true }
)
</script>

<style lang="scss">
@import './index.scss';
</style>
