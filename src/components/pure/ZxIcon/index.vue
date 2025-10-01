<template>
  <!-- 懒加载的 tooltip/popover 包装器 -->
  <ZxTooltipOrPopover
    v-if="(tooltip || popoverTitle) && !disabled"
    :content="tooltip"
    :title="popoverTitle"
    :trigger="tooltipTrigger"
    :placement="tooltipPlacement"
    :offset="tooltipOffset"
    :hide-after="popoverTitle ? 1000 : 500"
    :show-after="150"
    :width="popoverWidth"
    :enterable="true"
    :persistent="popoverTitle && popoverPersistent"
    :disabled="disabled || (!tooltip && !popoverTitle)"
    @hide="handleTooltipHide"
  >
    <!-- 图标内容 -->
    <component
      :is="iconWrapperComponent"
      v-bind="iconWrapperProps"
      :class="iconClasses"
      :size="iconSize"
      :style="iconStyles"
      @mouseenter="handleMouseEnterWithTooltip"
      @mouseleave="handleMouseLeaveWithTooltip"
      @click="handleClickWithTooltip"
    >
      <svg v-if="isLocalSvg" aria-hidden="true">
        <use :xlink:href="symbolId" />
      </svg>
      <component v-else-if="type === 'element'" :is="iconComponent" />
    </component>

    <!-- Popover 内容插槽 -->
    <template v-if="popoverTitle && $slots.popoverContent" #content>
      <slot name="popoverContent"></slot>
    </template>
  </ZxTooltipOrPopover>

  <!-- 无 tooltip/popover 或未激活时的普通图标 -->
  <component
    v-else
    :is="iconWrapperComponent"
    v-bind="iconWrapperProps"
    :class="iconClasses"
    :size="iconSize"
    :style="iconStyles"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <svg v-if="isLocalSvg" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>
    <component v-else-if="type === 'element'" :is="iconComponent" />
  </component>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ZxTooltipOrPopover from '../ZxTooltipOrPopover/index.vue'
import './index.scss'

// 组件名称
defineOptions({
  name: 'ZxIcon'
})

// Props 定义
const props = defineProps({
  // 图标类型：element | iconfont (svg 通过 icon 前缀 svg-icon: 自动识别)
  type: {
    type: String,
    default: 'element',
    validator: (value) => ['element', 'iconfont'].includes(value)
  },
  // 图标名称 (SVG 图标使用 svg-icon:图标名 格式)
  icon: {
    type: String,
    required: true
  },
  // 图标颜色 (不设置默认值，跟随系统主题)
  color: {
    type: String,
    default: ''
  },
  // 图标大小
  size: {
    type: [Number, String],
    default: 16
  },
  // 悬停颜色
  hoverColor: {
    type: String,
    default: ''
  },
  // 自定义类名
  className: {
    type: String,
    default: ''
  },
  // Tooltip 文本
  tooltip: {
    type: String,
    default: ''
  },
  // Popover 标题 (有标题时显示为 popover，否则为 tooltip)
  popoverTitle: {
    type: String,
    default: ''
  },
  // Tooltip/Popover 触发方式
  tooltipTrigger: {
    type: String,
    default: 'hover',
    validator: (value) => ['hover', 'click', 'focus', 'manual'].includes(value)
  },
  // Tooltip/Popover 位置
  tooltipPlacement: {
    type: String,
    default: 'top'
  },
  tooltipOffset: {
    type: Number,
    default: 6
  },
  // Popover 是否持久化显示（需要点击外部区域才关闭，便于复制内容）
  popoverPersistent: {
    type: Boolean,
    default: false
  },
  // Popover 宽度（只在有 popoverTitle 时生效）
  popoverWidth: {
    type: [Number, String],
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// 事件定义
const emit = defineEmits(['click'])

const isHover = ref(false)
const shouldShowTooltip = ref(false)
const tooltipHideTimer = ref(null)
const tooltipShowTimer = ref(null)

// 计算属性
// 判断是否为本地 SVG 图标
const isLocalSvg = computed(() => props.icon.startsWith('svg-icon:'))

// SVG 图标的 symbol ID
const symbolId = computed(() => {
  return isLocalSvg.value ? `#icon-${props.icon.split('svg-icon:')[1]}` : ''
})

const iconComponent = computed(() => {
  return ElementPlusIconsVue[props.icon] || null
})

const iconClasses = computed(() => {
  const classes = ['zx-icon']

  if (props.disabled) {
    classes.push('is-disabled')
  }

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})

const iconfontClasses = computed(() => {
  const classes = ['iconfont', 'zx-icon']

  // 添加图标类名
  if (props.icon) {
    // 如果图标名称不以 icon- 开头，则添加前缀
    const iconClass = props.icon.startsWith('icon-') ? props.icon : `icon-${props.icon}`
    classes.push(iconClass)
  }

  if (props.disabled) {
    classes.push('is-disabled')
  }

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})

const iconfontStyles = computed(() => {
  const styles = {}

  // 设置字体大小
  if (props.size) {
    styles.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size
  }

  // 设置颜色
  const color = isHover.value && props.hoverColor ? props.hoverColor : props.color
  if (color) {
    styles.color = color
  }

  return styles
})

// 图标包装组件（根据类型选择 el-icon 或 i 标签）
const iconWrapperComponent = computed(() => {
  return props.type === 'iconfont' ? 'i' : 'el-icon'
})

// 图标包装组件的 props
const iconWrapperProps = computed(() => {
  if (props.type === 'iconfont') {
    return {
      class: iconfontClasses.value
    }
  }
  return {}
})

// 图标尺寸（iconfont 类型不使用 size 属性）
const iconSize = computed(() => {
  return props.type === 'iconfont' ? undefined : props.size
})

// 图标样式（用于所有类型的图标）
const iconStyles = computed(() => {
  if (props.type === 'iconfont') {
    return iconfontStyles.value
  }

  // Element Plus 图标样式
  const styles = {}

  // 设置颜色
  const color = isHover.value && props.hoverColor ? props.hoverColor : props.color
  if (color) {
    styles.color = color
  }

  return styles
})

// 是否有 tooltip 或 popover
const hasTooltipOrPopover = computed(() => {
  return !props.disabled && (props.tooltip || props.popoverTitle)
})

// 清除所有定时器
const clearAllTimers = () => {
  if (tooltipHideTimer.value) {
    clearTimeout(tooltipHideTimer.value)
    tooltipHideTimer.value = null
  }
  if (tooltipShowTimer.value) {
    clearTimeout(tooltipShowTimer.value)
    tooltipShowTimer.value = null
  }
}

// 清除隐藏定时器（保持向后兼容）
const clearHideTimer = clearAllTimers

// 延迟显示 tooltip/popover
const delayShowTooltip = () => {
  clearAllTimers()
  tooltipShowTimer.value = setTimeout(() => {
    shouldShowTooltip.value = true
  }, 150) // 150ms 延迟显示，避免快速划过时显示
}

// 延迟隐藏 tooltip/popover
const delayHideTooltip = () => {
  clearAllTimers()
  tooltipHideTimer.value = setTimeout(() => {
    shouldShowTooltip.value = false
  }, 500) // 增加到500ms延迟，给用户足够时间移动到tooltip/popover
}

// 事件处理 - 无 tooltip/popover 时
const handleMouseEnter = () => {
  if (props.hoverColor && !props.disabled) {
    isHover.value = true
  }

  // 如果有 tooltip/popover 且触发方式是 hover，则延迟激活懒加载
  if (hasTooltipOrPopover.value && props.tooltipTrigger === 'hover') {
    delayShowTooltip()
  }
}

const handleMouseLeave = () => {
  if (!props.disabled) {
    isHover.value = false
  }

  // 如果有 tooltip/popover 且触发方式是 hover，则延迟隐藏
  if (hasTooltipOrPopover.value && props.tooltipTrigger === 'hover') {
    delayHideTooltip()
  }
}

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)

    // 如果有 tooltip/popover 且触发方式是 click，则切换显示状态
    if (hasTooltipOrPopover.value && props.tooltipTrigger === 'click') {
      shouldShowTooltip.value = !shouldShowTooltip.value
    }
  }
}

// 事件处理 - 有 tooltip/popover 时
const handleMouseEnterWithTooltip = () => {
  if (props.hoverColor && !props.disabled) {
    isHover.value = true
  }
}

const handleMouseLeaveWithTooltip = () => {
  if (!props.disabled) {
    isHover.value = false
  }
}

const handleClickWithTooltip = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

// tooltip/popover 隐藏时的回调
const handleTooltipHide = () => {
  // 确保在隐藏后完全移除组件
  setTimeout(() => {
    if (!shouldShowTooltip.value) {
      // 这里可以添加额外的清理逻辑
    }
  }, 50)
}

// 组件卸载时清理所有定时器
onUnmounted(() => {
  clearAllTimers()
})
</script>
