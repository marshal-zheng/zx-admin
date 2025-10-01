<template>
  <div class="zx-card-wrapper">
    <el-card
      v-loading="loading"
      :class="[
        'zx-card',
        {
          'zx-card--simple': simple,
          'zx-card--no-content-padding': noContentPadding,
          'zx-card--no-bottom-radius': noBottomRadius,
          'zx-card--fullscreen': isFullscreen || isFullScreen
        }
      ]"
      :style="cardStyle"
      :shadow="shadow"
    >
      <!-- 自定义头部 -->
      <template v-if="!simple" #header>
        <div class="zx-card-header">
          <slot name="headerLeft">
            <div class="zx-card-header-left">
              <div v-if="title" class="zx-card-title">{{ title }}</div>
              <div v-if="subTitle" class="zx-card-subtitle">{{ subTitle }}</div>
            </div>
          </slot>
          <div class="zx-card-header-right">
            <slot name="headerRight"></slot>
            <div v-if="showFullScreen" class="zx-card-fullscreen-btn" @click="toggleFullScreen">
              <el-icon><FullScreen v-if="!isFullScreen" /><Aim v-else /></el-icon>
              {{ isFullScreen ? '退出全屏' : '全屏' }}
            </div>
          </div>
          <div v-if="$slots.subHeader" class="zx-card-sub-header">
            <slot name="subHeader"></slot>
          </div>
        </div>
      </template>

      <!-- 分割线 -->
      <el-divider
        v-if="!simple && !hideDivider"
        :class="{ 'zx-card-divider--has-padding': dividerHasPX }"
        class="zx-card-divider"
      />

      <!-- 卡片内容容器 -->
      <div class="zx-card-container">
        <el-scrollbar v-if="!simple" :style="getComputedContentStyle" class="zx-card-body">
          <div :style="{ minWidth: `${minWidth || 1000}px` }">
            <slot></slot>
          </div>
        </el-scrollbar>
        <div v-else class="zx-card-body" :style="{ minWidth: `${minWidth || 1000}px` }">
          <slot></slot>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div
        v-if="!hideFooter && !simple"
        class="zx-card-footer"
        :style="{
          width: isFullscreen || isFullScreen ? '100%' : `calc(100% - ${menuWidth + 16}px)`
        }"
      >
        <div class="zx-card-footer-left">
          <slot name="footerLeft"></slot>
        </div>
        <slot name="footerRight">
          <div class="zx-card-footer-right">
            <el-button :disabled="loading" @click="handleBack">
              {{ cancelText || '取消' }}
            </el-button>
            <el-button
              v-if="!hideContinue && !isEdit"
              :loading="loading"
              @click="emit('saveAndContinue')"
            >
              {{ saveAndContinueText || '保存并继续创建' }}
            </el-button>
            <el-button type="primary" :loading="loading" @click="emit('save')">
              {{ saveText || (isEdit ? '更新' : '创建') }}
            </el-button>
          </div>
        </slot>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FullScreen, Aim } from '@element-plus/icons-vue'

// 定义属性
const props = defineProps({
  // 简单模式，没有标题和底部栏
  simple: {
    type: Boolean,
    default: false
  },
  // 卡片标题
  title: {
    type: String,
    default: ''
  },
  // 卡片副标题
  subTitle: {
    type: String,
    default: ''
  },
  // 隐藏保存并继续创建按钮
  hideContinue: {
    type: Boolean,
    default: false
  },
  // 隐藏底部栏
  hideFooter: {
    type: Boolean,
    default: false
  },
  // 卡片 loading 状态
  loading: {
    type: Boolean,
    default: false
  },
  // 是否编辑状态
  isEdit: {
    type: Boolean,
    default: false
  },
  // 特殊高度，例如某些页面有面包屑，autoHeight 时无效
  specialHeight: {
    type: Number,
    default: 0
  },
  // 隐藏返回按钮
  hideBack: {
    type: Boolean,
    default: false
  },
  // 内容区域高度是否自适应
  autoHeight: {
    type: Boolean,
    default: false
  },
  // 内容区域宽度是否自适应
  autoWidth: {
    type: Boolean,
    default: false
  },
  // 该宽度为卡片外部同级容器的宽度
  otherWidth: {
    type: Number,
    default: 0
  },
  // 卡片头部最小宽度
  headerMinWidth: {
    type: Number,
    default: 0
  },
  // 卡片内容最小宽度
  minWidth: {
    type: Number,
    default: 1000
  },
  // 是否有面包屑，如果有面包屑，高度需要减去面包屑的高度
  hasBreadcrumb: {
    type: Boolean,
    default: false
  },
  // 内容区域是否有padding
  noContentPadding: {
    type: Boolean,
    default: false
  },
  // 底部是否有圆角
  noBottomRadius: {
    type: Boolean,
    default: false
  },
  // 是否全屏
  isFullscreen: {
    type: Boolean,
    default: false
  },
  // 是否隐藏分割线
  hideDivider: {
    type: Boolean,
    default: true
  },
  // 自定义返回按钮触发事件
  handleBack: {
    type: Function,
    default: null
  },
  // 分割线是否有左右padding
  dividerHasPX: {
    type: Boolean,
    default: false
  },
  // 是否显示全屏按钮
  showFullScreen: {
    type: Boolean,
    default: false
  },
  // 保存按钮文案
  saveText: {
    type: String,
    default: ''
  },
  // 保存并继续按钮文案
  saveAndContinueText: {
    type: String,
    default: ''
  },
  // 取消按钮文案
  cancelText: {
    type: String,
    default: ''
  },
  // 卡片阴影
  shadow: {
    type: String,
    default: 'hover',
    validator: (value) => ['always', 'hover', 'never'].includes(value)
  }
})

// 定义事件
const emit = defineEmits(['saveAndContinue', 'save', 'toggleFullScreen'])

// 路由实例
const router = useRouter()

// 响应式数据
const isFullScreen = ref(false)
const menuWidth = ref(240) // 假设菜单宽度，实际应该从store获取

// 计算属性
const cardStyle = computed(() => {
  const style = {}
  if (props.headerMinWidth) {
    style.minWidth = `${props.headerMinWidth}px`
  }
  return style
})

const _specialHeight = computed(() => {
  return props.hasBreadcrumb ? 32 + props.specialHeight : props.specialHeight
})

const cardOverHeight = computed(() => {
  const contentPadding = 32 // 16+16 上下内容边距
  const navbarHeight = 56 // 顶部导航高度
  const layoutContentPaddingBottom = 16 // 卡片到底部距离

  if (isFullScreen.value) {
    return 106
  }
  if (props.simple) {
    // 简单模式没有标题、没有底部
    return props.noContentPadding
      ? navbarHeight + layoutContentPaddingBottom + _specialHeight.value
      : navbarHeight + layoutContentPaddingBottom + contentPadding + _specialHeight.value
  }
  if (props.hideFooter) {
    // 没有底部
    return props.noContentPadding ? 130 + _specialHeight.value : 168 + _specialHeight.value
  }
  return 220 + _specialHeight.value
})

const getComputedContentStyle = computed(() => {
  if (props.isFullscreen || isFullScreen.value || props.noContentPadding) {
    return {
      height: props.autoHeight ? 'auto' : `calc(100vh - ${cardOverHeight.value}px)`,
      overflow: 'auto',
      width: 'auto'
    }
  }

  const width = props.otherWidth
    ? `calc(100vw - ${menuWidth.value}px - ${props.otherWidth}px)`
    : `calc(100vw - ${menuWidth.value}px - 48px)` // 48px 为卡片左右内边距 32+ 页面右侧内边距16

  return {
    height: props.autoHeight ? 'auto' : `calc(100vh - ${cardOverHeight.value}px)`,
    width: props.autoWidth ? 'auto' : width,
    overflow: 'auto'
  }
})

// 方法
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  emit('toggleFullScreen', isFullScreen.value)
}

const handleBack = () => {
  if (typeof props.handleBack === 'function') {
    props.handleBack()
  } else {
    router.back()
  }
}

// 监听全屏状态变化
watch(
  () => isFullScreen.value,
  (val) => {
    emit('toggleFullScreen', val)
  }
)
</script>

<style lang="scss">
@import './index.scss';
</style>
