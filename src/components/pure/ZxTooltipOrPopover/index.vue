<template>
  <component
    :is="Component"
    v-bind="finalProps"
    :popper-class="popperClass"
    :content-class="contentClass"
  >
    <template v-if="isPopover" #reference>
      <slot></slot>
    </template>
    <template v-if="$slots.content">
      <slot name="content"></slot>
    </template>
    <slot v-if="!isPopover"></slot>
  </component>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { ElPopover, ElTooltip } from 'element-plus'

// 组件名称
defineOptions({
  name: 'ZxTooltipOrPopover'
})

// Props 定义
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  trigger: {
    type: String,
    default: 'hover'
  },
  placement: {
    type: String,
    default: 'top'
  },
  offset: {
    type: Number,
    default: 12
  },
  hideAfter: {
    type: Number,
    default: 300
  },
  showAfter: {
    type: Number,
    default: 150
  },
  // 仅在 Popover 模式下生效：设置弹层宽度（对齐 ElPopover.width）
  width: {
    type: [Number, String],
    default: undefined
  },
  // 是否允许鼠标进入popover内容区域（用于复制内容等操作）
  enterable: {
    type: Boolean,
    default: true
  },
  // 是否持久化显示（点击外部区域才关闭）
  persistent: {
    type: Boolean,
    default: false
  }
})

const attrs = useAttrs()

// 计算属性
const isPopover = computed(() => Boolean(props.title))
const Component = computed(() => (isPopover.value ? ElPopover : ElTooltip))

// CSS 类名计算
const popperClass = computed(() => {
  const baseClass = 'zx-tooltip-or-popover'
  const typeClass = isPopover.value ? 'zx-popover' : 'zx-tooltip'
  const customClass = attrs.popperClass || ''
  return [baseClass, typeClass, customClass].filter(Boolean).join(' ')
})

const contentClass = computed(() => {
  const baseClass = 'zx-tooltip-or-popover-content'
  const customClass = attrs.contentClass || ''
  return [baseClass, customClass].filter(Boolean).join(' ')
})

// 合并最终的 props (移除 effect 默认值，让组件跟随系统主题)
const finalProps = computed(() => {
  const { popperClass: _, contentClass: __, ...restAttrs } = attrs
  return {
    trigger: props.trigger,
    placement: props.placement,
    content: props.content,
    title: props.title,
    offset: props.offset,
    hideAfter: props.hideAfter,
    showAfter: props.showAfter,
    // 只有 Popover 时才把 width 透传给 ElPopover
    width: isPopover.value ? props.width : undefined,
    enterable: props.enterable,
    persistent: props.persistent,
    ...restAttrs
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
