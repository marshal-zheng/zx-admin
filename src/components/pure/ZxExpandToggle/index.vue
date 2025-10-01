<template>
  <div class="zx-expand-toggle">
    <!-- 可展开的内容区域 -->
    <div
      class="zx-expand-toggle__content"
      :class="{ 'zx-expand-toggle__content--expanded': isExpanded }"
    >
      <slot v-if="isExpanded" name="content"></slot>
    </div>

    <!-- 展开收起按钮 -->
    <div class="zx-expand-toggle__trigger" :class="triggerClass">
      <el-button
        type="text"
        size="small"
        :disabled="disabled"
        @click="handleToggle"
        class="zx-expand-toggle__button"
      >
        <el-icon class="zx-expand-toggle__icon">
          <component :is="currentIcon" />
        </el-icon>
        {{ currentText }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

// 定义组件名称
defineOptions({
  name: 'ZxExpandToggle'
})

// Props 定义
const props = defineProps({
  /** 是否展开（支持 v-model） */
  modelValue: {
    type: Boolean,
    default: false
  },
  /** 展开时的文本 */
  expandedText: {
    type: String,
    default: '收起'
  },
  /** 收起时的文本 */
  collapsedText: {
    type: String,
    default: '展开'
  },
  /** 展开时的图标 */
  expandedIcon: {
    type: [String, Object],
    default: () => ArrowUp
  },
  /** 收起时的图标 */
  collapsedIcon: {
    type: [String, Object],
    default: () => ArrowDown
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false
  },
  /** 触发器位置 */
  triggerPosition: {
    type: String,
    default: 'center', // center, left, right
    validator: (value) => ['center', 'left', 'right'].includes(value)
  },
  /** 自定义触发器类名 */
  triggerClass: {
    type: [String, Array, Object],
    default: ''
  },
  /** 文本后缀 */
  textSuffix: {
    type: String,
    default: ''
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'toggle', 'expand', 'collapse'])

// 响应式数据
const isExpanded = ref(props.modelValue)

// 计算属性
const currentText = computed(() => {
  const baseText = isExpanded.value ? props.expandedText : props.collapsedText
  return props.textSuffix ? `${baseText}${props.textSuffix}` : baseText
})

const currentIcon = computed(() => {
  return isExpanded.value ? props.expandedIcon : props.collapsedIcon
})

// 方法
const handleToggle = () => {
  if (props.disabled) return

  isExpanded.value = !isExpanded.value
  emit('update:modelValue', isExpanded.value)
  emit('toggle', isExpanded.value)

  if (isExpanded.value) {
    emit('expand')
  } else {
    emit('collapse')
  }
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    isExpanded.value = newVal
  }
)

// 暴露方法给父组件
defineExpose({
  toggle: handleToggle,
  expand: () => {
    if (!isExpanded.value) {
      handleToggle()
    }
  },
  collapse: () => {
    if (isExpanded.value) {
      handleToggle()
    }
  },
  isExpanded: () => isExpanded.value
})
</script>

<style lang="scss">
@import './index.scss';
</style>
