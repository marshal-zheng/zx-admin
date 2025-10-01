<template>
  <div
    :class="[
      'zx-split-box',
      `zx-split-box--${direction}`,
      { 'zx-split-box--expanded': isExpanded },
      { 'zx-split-box--animating': isExpandAnimating },
      { 'zx-split-box--disabled': disabled }
    ]"
    :style="containerStyle"
  >
    <!-- 第一个面板 -->
    <div
      v-if="!notShowFirst"
      :class="[
        'zx-split-box__first',
        `zx-split-box__${direction === 'horizontal' ? 'left' : 'top'}`,
        firstContainerClass
      ]"
      :style="firstPanelStyle"
    >
      <!-- 展开/收起按钮 -->
      <div
        v-if="direction === 'horizontal' && expandDirection === 'right' && !disabled"
        class="zx-split-box__expand-trigger zx-split-box__expand-trigger--right"
        @click="changeExpand"
      >
        <el-icon class="zx-split-box__expand-icon">
          <component :is="isExpanded ? 'ArrowLeft' : 'ArrowRight'" />
        </el-icon>
      </div>

      <slot name="first"></slot>
    </div>

    <!-- 分割线 -->
    <div
      v-if="!notShowFirst && isExpanded"
      :class="['zx-split-box__divider', `zx-split-box__divider--${direction}`]"
      @mousedown="startResize"
    >
      <div class="zx-split-box__divider-line"></div>
    </div>

    <!-- 第二个面板 -->
    <div
      :class="[
        'zx-split-box__second',
        `zx-split-box__${direction === 'horizontal' ? 'right' : 'bottom'}`,
        secondContainerClass
      ]"
      :style="secondPanelStyle"
    >
      <!-- 展开/收起按钮 -->
      <div
        v-if="
          !notShowFirst && direction === 'horizontal' && expandDirection === 'left' && !disabled
        "
        class="zx-split-box__expand-trigger zx-split-box__expand-trigger--left"
        @click="changeExpand"
      >
        <el-icon class="zx-split-box__expand-icon">
          <component :is="isExpanded ? 'ArrowLeft' : 'ArrowRight'" />
        </el-icon>
      </div>

      <slot name="second"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// 定义组件选项
defineOptions({
  name: 'ZxSplitBox'
})

// Props 定义
const props = defineProps({
  // 左侧宽度/顶部容器高度
  size: {
    type: [Number, String],
    default: '300px'
  },
  // 最小尺寸
  min: {
    type: [Number, String],
    default: '200px'
  },
  // 最大尺寸
  max: {
    type: [Number, String],
    default: 0.8
  },
  // 分割方向
  direction: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  // 展开方向
  expandDirection: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right', 'top'].includes(value)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 第一个容器类名
  firstContainerClass: {
    type: String,
    default: ''
  },
  // 第二个容器类名
  secondContainerClass: {
    type: String,
    default: ''
  },
  // 是否不显示第一个面板
  notShowFirst: {
    type: Boolean,
    default: false
  }
})

// 事件定义
const emit = defineEmits(['update:size', 'expandChange'])

// 响应式数据
const innerSize = ref(props.size || '300px')
const initialSize = props.size || '300px'
const isExpanded = ref(true)
const isExpandAnimating = ref(false)
const resizing = ref(false)

// 计算属性
const containerStyle = computed(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: props.direction === 'horizontal' ? 'row' : 'column'
}))

const firstPanelStyle = computed(() => {
  if (!isExpanded.value) {
    return {
      [props.direction === 'horizontal' ? 'width' : 'height']: '0px',
      overflow: 'hidden'
    }
  }

  const sizeValue = typeof innerSize.value === 'number' ? `${innerSize.value}px` : innerSize.value

  return {
    [props.direction === 'horizontal' ? 'width' : 'height']: sizeValue,
    flexShrink: 0
  }
})

const secondPanelStyle = computed(() => ({
  flex: 1,
  overflow: 'hidden'
}))

// 监听器
watch(
  () => props.size,
  (val) => {
    if (val !== undefined) {
      innerSize.value = val
    }
  }
)

watch(
  () => innerSize.value,
  (val) => {
    emit('update:size', val)
  }
)

watch(
  () => props.notShowFirst,
  (val) => {
    if (val) {
      collapse()
    } else {
      expand()
    }
  },
  { immediate: true }
)

// 方法
function expand(size) {
  isExpandAnimating.value = true
  isExpanded.value = true
  innerSize.value = size || initialSize || '300px'
  emit('expandChange', true)

  setTimeout(() => {
    isExpandAnimating.value = false
  }, 300)
}

function collapse(size) {
  isExpandAnimating.value = true
  isExpanded.value = false
  innerSize.value = props.expandDirection === 'right' ? '100%' : size || '0px'
  emit('expandChange', false)

  setTimeout(() => {
    isExpandAnimating.value = false
  }, 300)
}

function changeExpand() {
  if (isExpanded.value) {
    collapse()
  } else {
    expand()
  }
}

// 拖拽调整大小功能
function startResize(event) {
  if (props.disabled || !isExpanded.value) return

  event.preventDefault()
  event.stopPropagation()

  resizing.value = true
  const startPos = props.direction === 'horizontal' ? event.clientX : event.clientY
  const initialSizeNum =
    typeof innerSize.value === 'string' ? parseInt(innerSize.value) : innerSize.value

  let animationId = null
  let pendingSize = null

  // 禁用文本选择
  document.body.style.userSelect = 'none'
  document.body.style.cursor = props.direction === 'horizontal' ? 'col-resize' : 'row-resize'

  const updateSize = () => {
    if (pendingSize !== null && resizing.value) {
      innerSize.value = `${pendingSize}px`
      pendingSize = null
    }
    animationId = null
  }

  const handleMouseMove = (moveEvent) => {
    if (resizing.value) {
      moveEvent.preventDefault()
      const currentPos = props.direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      const diff = currentPos - startPos
      const newSize = initialSizeNum + diff

      const minSize = typeof props.min === 'string' ? parseInt(props.min) : props.min
      const maxSize =
        typeof props.max === 'number' && props.max <= 1
          ? (props.direction === 'horizontal' ? window.innerWidth : window.innerHeight) * props.max
          : typeof props.max === 'string'
            ? parseInt(props.max)
            : props.max

      if (newSize >= minSize && newSize <= maxSize) {
        pendingSize = newSize

        if (animationId === null) {
          animationId = requestAnimationFrame(updateSize)
        }
      }
    }
  }

  const handleMouseUp = () => {
    if (resizing.value) {
      resizing.value = false

      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }

      if (pendingSize !== null) {
        innerSize.value = `${pendingSize}px`
        pendingSize = null
      }

      // 恢复样式
      document.body.style.userSelect = ''
      document.body.style.cursor = ''

      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: false })
  window.addEventListener('mouseup', handleMouseUp)
}

// 暴露方法
defineExpose({
  expand,
  collapse
})
</script>

<style lang="scss">
@import './index.scss';
</style>
