<template>
  <div
    ref="floatingPanelRef"
    :class="[
      'zx-floating-panel',
      { collapsed: isCollapsed, dragging: isDragging },
      customClass,
      responsiveClass
    ]"
    :style="panelStyle"
  >
    <!-- 头部区域 -->
    <div class="panel-header" @click="handleHeaderClick" @mousedown="handleMouseDown">
      <!-- 展开状态的标题内容 -->
      <div v-if="!isCollapsed" class="header-content">
        <slot name="header">
          <h3 v-if="title">{{ title }}</h3>
        </slot>
      </div>

      <!-- 收起状态或默认的操作按钮 -->
      <div class="header-actions">
        <!-- 状态指示器 -->
        <div v-if="showStatus && !isCollapsed" class="status-indicator">
          <slot name="status">
            <div v-if="loading" class="loading-indicator">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              <span>{{ loadingText }}</span>
            </div>
            <div v-else-if="completed" class="completed-indicator">
              <el-icon>
                <SuccessFilled />
              </el-icon>
              <span>{{ completedText }}</span>
            </div>
          </slot>
        </div>

        <!-- 自定义操作按钮 -->
        <slot name="actions" :isCollapsed="isCollapsed" :toggle="toggleCollapse">
          <!-- 默认的展开/收起按钮 -->
          <button
            class="collapse-btn"
            @click.stop="onCollapseBtnClick"
            :title="isCollapsed ? expandTooltip : collapseTooltip"
          >
            <el-icon>
              <component :is="collapseIcon" />
            </el-icon>
          </button>
        </slot>
      </div>
    </div>

    <!-- 内容区域 -->
    <Transition name="content" mode="out-in">
      <div v-if="!isCollapsed" class="panel-content">
        <div class="content-scrollbar" :style="contentScrollStyle">
          <slot :isCollapsed="isCollapsed" :toggleCollapse="toggleCollapse">
            <div class="default-content">
              <p>请在此处添加内容</p>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Loading, SuccessFilled, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'

// 定义组件名称
defineOptions({
  name: 'ZxFloatingPanel'
})

// Props 定义
interface Props {
  // 标题
  title?: string
  // 默认是否收起
  defaultCollapsed?: boolean
  // 是否可以通过点击头部切换
  headerClickable?: boolean
  // 自定义样式类
  customClass?: string
  // 面板位置样式
  position?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  // 面板尺寸配置
  size?: {
    width?: string
    maxWidth?: string
    minWidth?: string
    height?: string
    maxHeight?: string
    minHeight?: string
  }
  // 收起状态尺寸配置
  collapsedSize?: {
    width?: string
    height?: string
  }
  // 自定义展开/收起图标
  expandIcon?: string | object
  collapseIconProp?: string | object
  // 提示文本
  expandTooltip?: string
  collapseTooltip?: string
  // 是否显示状态指示器
  showStatus?: boolean
  // 加载状态
  loading?: boolean
  completed?: boolean
  loadingText?: string
  completedText?: string
  // 自动展开
  autoExpand?: boolean
  completedDuration?: number
  // 动画持续时间(ms)
  transitionDuration?: number
  // 响应式断点配置
  responsive?: {
    [key: string]: {
      size?: any
      collapsedSize?: any
    }
  }
  // 根据位置自动调整图标方向
  autoDirection?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  defaultCollapsed: true,
  headerClickable: false,
  customClass: '',
  expandIcon: () => DArrowLeft,
  collapseIconProp: () => DArrowRight,
  expandTooltip: '展开',
  collapseTooltip: '收起',
  showStatus: true,
  loading: false,
  completed: false,
  loadingText: '处理中...',
  completedText: '完成',
  autoExpand: false,
  completedDuration: 3000,
  transitionDuration: 300,
  autoDirection: true
})

// Emits 定义（仅对外通知状态变化，不暴露 v-model）
const emit = defineEmits(['toggle', 'expand', 'collapse'])

// 响应式数据
const isCollapsed = ref(props.defaultCollapsed)
const hasTriggeredExpansion = ref(false)
const completedTimer = ref<NodeJS.Timeout | null>(null)
const resizeHandler = ref<(() => void) | null>(null)
const floatingPanelRef = ref<HTMLElement | null>(null)
// 位置侧边判断（true 表示在屏幕右侧）
const isOnRightSide = ref(true)

// 拖拽相关状态
const isDragging = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })
const dragStartOffset = ref({ x: 0, y: 0 })
const currentPosition = ref({ x: 0, y: 0 })
// 抑制拖拽结束后的点击
const suppressClickAfterDrag = ref(false)
// 拖拽阈值与移动标记
const dragThreshold = 3
const hasMoved = ref(false)

// 计算属性 / 视口高度
const viewportHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 800)

// 根据视口高度给出默认的展开最大高度（响应式）
const expandedMaxHeight = computed(() => {
  const h = viewportHeight.value
  if (h >= 1000) return '80vh'
  if (h >= 768) return '70vh'
  return '60vh'
})

// 计算属性
const collapseIcon = computed(() => {
  if (props.autoDirection) {
    // 收起时：箭头指向面板展开方向（指向中间）
    // 展开时：箭头指向收起方向（指向外侧）
    if (isCollapsed.value) {
      return isOnRightSide.value ? DArrowLeft : DArrowRight
    } else {
      return isOnRightSide.value ? DArrowRight : DArrowLeft
    }
  }
  // 兼容非自动模式（保留原有自定义图标）
  return isCollapsed.value ? props.expandIcon : props.collapseIconProp
})

const contentScrollStyle = computed(() => {
  const styles: Record<string, any> = {}
  const headerApprox = 80
  const baseMax = props.size?.maxHeight || expandedMaxHeight.value
  // 展开时为内容区设置最大高度，超出滚动
  if (!isCollapsed.value && baseMax) {
    styles.maxHeight = `calc(${baseMax} - ${headerApprox}px)`
  }

  return styles
})

const panelStyle = computed(() => {
  const styles: Record<string, any> = {}

  // 基础定位
  if (props.position) {
    Object.assign(styles, props.position)
  }

  // 拖拽位置覆盖初始位置
  if (currentPosition.value.x !== 0 || currentPosition.value.y !== 0) {
    styles.left = `${currentPosition.value.x}px`
    styles.top = `${currentPosition.value.y}px`
    styles.right = 'auto'
    styles.bottom = 'auto'
  }

  // 动画持续时间 - 拖拽时禁用过渡
  if (!isDragging.value) {
    styles.transitionDuration = `${props.transitionDuration}ms`
  } else {
    styles.transition = 'none'
  }

  // 尺寸配置
  if (isCollapsed.value && props.collapsedSize) {
    Object.assign(styles, props.collapsedSize)
  } else if (!isCollapsed.value) {
    // 展开状态应用外部 size
    if (props.size) Object.assign(styles, props.size)
    // 若未提供 maxHeight，则按视口高度给出默认最大高度（响应式）
    if (!styles.maxHeight) {
      styles.maxHeight = expandedMaxHeight.value
    }
  }

  return styles
})

const responsiveClass = computed(() => {
  if (!props.responsive) return ''

  // 根据当前窗口大小返回对应的响应式类名
  const width = window.innerWidth
  let matchedBreakpoint = ''

  for (const breakpoint of Object.keys(props.responsive)) {
    const minWidth = parseInt(breakpoint.replace('px', ''))
    if (width >= minWidth) {
      matchedBreakpoint = `responsive-${minWidth}`
    }
  }

  return matchedBreakpoint
})

// 切换收缩状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value

  // 发出事件
  emit('toggle', isCollapsed.value)

  if (isCollapsed.value) {
    emit('collapse')
    // 如果用户手动收起，重置触发状态
    hasTriggeredExpansion.value = false
  } else {
    emit('expand')
  }

  // 触发重新计算布局相关逻辑
  nextTick(() => {
    handleAfterToggle()
  })
}

// 处理头部点击
const handleHeaderClick = (event: MouseEvent) => {
  // 如果是拖拽后的点击，不触发展开/收起
  if (isDragging.value || suppressClickAfterDrag.value) {
    return
  }

  // 收起状态下，整个头部区域都可以点击展开
  if (isCollapsed.value) {
    toggleCollapse()
  } else if (props.headerClickable) {
    toggleCollapse()
  }
}

// 拖拽开始
const handleMouseDown = (event: MouseEvent) => {
  event.preventDefault()

  // 点击折叠/展开按钮不触发拖拽（仅在展开状态下）
  const target = event.target as HTMLElement
  if (target && target.closest('.collapse-btn') && !isCollapsed.value) {
    return
  }

  const panelElement = floatingPanelRef.value
  if (!panelElement) return

  // 获取面板当前位置
  const rect = panelElement.getBoundingClientRect()
  const parentRect = panelElement.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 }

  dragStartPos.value = {
    x: event.clientX,
    y: event.clientY
  }

  dragStartOffset.value = {
    x: rect.left - parentRect.left,
    y: rect.top - parentRect.top
  }

  isDragging.value = false
  hasMoved.value = false

  // 添加全局事件监听
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  // 防止选中文本
  document.body.style.userSelect = 'none'
}

// 拖拽移动
const handleMouseMove = (event: MouseEvent) => {
  const deltaX = event.clientX - dragStartPos.value.x
  const deltaY = event.clientY - dragStartPos.value.y
  const moved = Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold

  if (!isDragging.value && moved) {
    isDragging.value = true
    hasMoved.value = true
  }

  if (!isDragging.value) return

  currentPosition.value = {
    x: dragStartOffset.value.x + deltaX,
    y: dragStartOffset.value.y + deltaY
  }
}

// 拖拽结束
const handleMouseUp = () => {
  const endedDragging = isDragging.value
  isDragging.value = false

  // 移除全局事件监听
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  // 恢复文本选择
  document.body.style.userSelect = ''

  // 拖拽后短暂抑制点击，避免误触发展开/收起
  if (endedDragging || hasMoved.value) {
    suppressClickAfterDrag.value = true
    setTimeout(() => {
      suppressClickAfterDrag.value = false
    }, 120)
  }
  hasMoved.value = false
  // 拖拽结束后更新位置侧边判断
  updatePanelSide()
}

// 折叠按钮点击：拖拽后或拖拽中忽略点击
const onCollapseBtnClick = (event: MouseEvent) => {
  if (isDragging.value || hasMoved.value || suppressClickAfterDrag.value) {
    event.preventDefault()
    return
  }
  toggleCollapse()
}

// 切换后的处理逻辑
const handleAfterToggle = () => {
  // 可以在这里处理一些切换后需要执行的逻辑
  // 比如重新计算某些组件的位置等
}

// 监听响应式变化
const setupResponsive = () => {
  resizeHandler.value = () => {
    // 跟踪视口高度变化，用于计算默认最大高度
    viewportHeight.value = window.innerHeight

    // 额外的断点逻辑（若提供 responsive 配置）
    if (props.responsive) {
      const width = window.innerWidth
      let matchedBreakpoint: any = null
      for (const [breakpoint, config] of Object.entries(props.responsive)) {
        const minWidth = parseInt(String(breakpoint).replace('px', ''))
        if (width >= minWidth) matchedBreakpoint = config
      }
      if (matchedBreakpoint) {
        // 可在此应用断点配置（如动态 size/collapsedSize）
      }
    }

    // 同步更新图标方向判断
    updatePanelSide()
  }

  window.addEventListener('resize', resizeHandler.value)
}

// 根据面板相对视口位置判断位于左/右侧
const updatePanelSide = () => {
  const el = floatingPanelRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const panelCenterX = rect.left + rect.width / 2
  isOnRightSide.value = panelCenterX > viewportWidth / 2
}

// 暴露方法给父组件
const expand = () => {
  if (isCollapsed.value) {
    toggleCollapse()
  }
}

const collapse = () => {
  if (!isCollapsed.value) {
    toggleCollapse()
  }
}

// 监听loading状态变化，自动展开
watch(
  () => props.loading,
  (newVal, oldVal) => {
    // 当开始加载时，如果还没有触发过展开且启用自动展开，则展开组件
    if (newVal === true && !hasTriggeredExpansion.value && props.autoExpand) {
      hasTriggeredExpansion.value = true
      isCollapsed.value = false
      emit('expand')
    }

    // 当加载完成时，显示完成状态
    if (oldVal === true && newVal === false && props.completed) {
      // 清理之前的定时器
      if (completedTimer.value) {
        clearTimeout(completedTimer.value)
      }
      // 设置新的定时器
      completedTimer.value = setTimeout(() => {
        // 这里可以添加完成状态消失的逻辑
      }, props.completedDuration)
    }
  }
)

// 不再监听外部对折叠状态的更改；只在初始化时读取 defaultCollapsed

// 生命周期
onMounted(() => {
  // 初始化状态：仅使用 defaultCollapsed
  isCollapsed.value = props.defaultCollapsed
  setupResponsive()
  // 初次计算图标方向
  nextTick(() => updatePanelSide())
})

onBeforeUnmount(() => {
  // 清理定时器
  if (completedTimer.value) {
    clearTimeout(completedTimer.value)
  }
  // 清理事件监听器
  if (resizeHandler.value) {
    window.removeEventListener('resize', resizeHandler.value)
    resizeHandler.value = null
  }
  // 清理拖拽事件监听器
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.userSelect = ''
})

// 暴露方法给父组件
defineExpose({
  isCollapsed,
  toggleCollapse,
  expand,
  collapse
})
</script>

<style lang="scss">
@import './index.scss';
</style>
