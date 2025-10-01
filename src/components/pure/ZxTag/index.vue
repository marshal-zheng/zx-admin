Í
<template>
  <el-tag
    :type="tagType"
    :size="props.size"
    :closable="props.closable"
    :disable-transitions="false"
    :hit="false"
    :color="customColor"
    :effect="tagEffect"
    :round="props.round"
    :class="['zx-tag', `zx-tag-${props.theme}`, props.noMargin ? 'zx-tag-no-margin' : '']"
    :style="{
      'margin-right': noMargin ? 0 : tagMargin,
      'min-width': props.width && `${props.width}ch`,
      'max-width': props.maxWidth || '144px',
      ...props.selfStyle
    }"
    @close="handleClose"
    @click="handleClick"
  >
    <el-tooltip
      :disabled="props.tooltipDisabled"
      :content="tooltipContent"
      placement="top"
      :show-after="300"
    >
      <div class="zx-tag-content">
        <span v-if="$slots.icon" class="zx-tag-icon">
          <slot name="icon"></slot>
        </span>
        <span class="zx-tag-text">
          <slot></slot>
        </span>
      </div>
    </el-tooltip>
  </el-tag>
</template>

<script setup>
import { computed, useSlots } from 'vue'

// 定义属性
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['dark', 'light', 'plain'].includes(value)
  },
  selfStyle: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: Number,
    default: null
  },
  maxWidth: {
    type: String,
    default: '144px'
  },
  noMargin: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  tooltipDisabled: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['close', 'click'])

// 获取插槽
const slots = useSlots()

// 计算标签间距
const tagMargin = computed(() => {
  switch (props.size) {
    case 'large':
      return '4px'
    case 'small':
      return '2px'
    default:
      return '3px'
  }
})

// 计算标签类型
const tagType = computed(() => {
  if (props.theme === 'plain') {
    return ''
  }
  return props.type
})

// 计算标签效果
const tagEffect = computed(() => {
  switch (props.theme) {
    case 'dark':
      return 'dark'
    case 'plain':
      return 'plain'
    default:
      return 'light'
  }
})

// 计算自定义颜色
const customColor = computed(() => {
  return props.color || ''
})

// 计算提示内容
const tooltipContent = computed(() => {
  // 如果有自定义 tooltip 插槽，使用插槽内容
  if (slots.tooltipContent) {
    const tooltipSlot = slots.tooltipContent()
    return tooltipSlot?.[0]?.children || tooltipSlot?.[0]?.props?.content || ''
  }

  // 否则使用默认插槽的文本内容作为 tooltip
  const defaultSlot = slots.default?.()
  if (defaultSlot && defaultSlot.length > 0) {
    // 递归获取文本内容
    const getTextContent = (vnode) => {
      if (typeof vnode === 'string') return vnode
      if (typeof vnode === 'number') return String(vnode)
      if (vnode?.children) {
        if (typeof vnode.children === 'string') return vnode.children
        if (Array.isArray(vnode.children)) {
          return vnode.children.map(getTextContent).join('')
        }
      }
      return ''
    }

    return defaultSlot.map(getTextContent).join('').trim()
  }

  return ''
})

// 事件处理
const handleClose = () => {
  emit('close')
}

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
