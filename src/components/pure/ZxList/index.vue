<template>
  <div class="zx-list" :class="listClasses">
    <!-- 列表容器 -->
    <div
      ref="listContainer"
      class="zx-list__container"
      :style="containerStyle"
      @scroll="handleScroll"
    >
      <!-- 列表项 -->
      <div
        v-for="(item, index) in data"
        :key="getItemKey(item, index)"
        :class="getItemClasses(item, index)"
        @click="handleItemClick(item, index)"
      >
        <slot name="item" :item="item" :index="index">
          <!-- 默认列表项内容 -->
          <div class="zx-list-item__content">
            <div class="zx-list-item__main">
              <slot name="title" :item="item" :index="index">
                <span class="zx-list-item__title">{{ item.title || item.name || item.label }}</span>
              </slot>
              <slot name="description" :item="item" :index="index">
                <span v-if="item.description" class="zx-list-item__description">{{
                  item.description
                }}</span>
              </slot>
            </div>

            <!-- 右侧操作区域 -->
            <div class="zx-list-item__actions">
              <!-- 自定义操作按钮 -->
              <slot name="itemAction" :item="item" :index="index"></slot>

              <!-- 更多操作下拉菜单 -->
              <el-dropdown
                v-if="itemActions && itemActions.length > 0"
                trigger="click"
                @command="(command) => handleActionSelect(command, item, index)"
              >
                <el-button type="text" size="small" class="zx-list-item__more-btn">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="action in itemActions"
                      :key="action.value"
                      :command="action"
                      :disabled="action.disabled"
                    >
                      <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
                      {{ action.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </slot>
      </div>

      <!-- 加载更多指示器 -->
      <div v-if="loading && data.length > 0" class="zx-list__loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>{{ loadingText || '加载中...' }}</span>
      </div>

      <!-- 没有更多数据 -->
      <div v-if="noMoreData && data.length > 0" class="zx-list__no-more">
        {{ noMoreText || '没有更多数据了' }}
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="data.length === 0 && !loading" class="zx-list__empty">
      <slot name="empty">
        <el-empty :description="emptyText || '暂无数据'" />
      </slot>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading && data.length === 0" class="zx-list__loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>{{ loadingText || '加载中...' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { MoreFilled, Loading } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // 列表数据
  data: {
    type: Array,
    default: () => []
  },
  // 最大高度
  maxHeight: {
    type: [String, Number],
    default: ''
  },
  // 固定高度
  height: {
    type: [String, Number],
    default: ''
  },
  // 列表项的唯一标识字段
  itemKey: {
    type: String,
    default: 'id'
  },
  // 当前聚焦的项目key
  focusItemKey: {
    type: [String, Number],
    default: ''
  },
  // 列表项操作菜单
  itemActions: {
    type: Array,
    default: () => []
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 是否没有更多数据
  noMoreData: {
    type: Boolean,
    default: false
  },
  // 加载中文本
  loadingText: {
    type: String,
    default: '加载中...'
  },
  // 没有更多数据文本
  noMoreText: {
    type: String,
    default: '没有更多数据了'
  },
  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无数据'
  }
})

// 事件定义
const emit = defineEmits([
  'update:data',
  'update:focusItemKey',
  'itemClick',
  'actionSelect',
  'loadMore',
  'scroll'
])

// 响应式数据
const listContainer = ref(null)
const innerFocusItemKey = ref(props.focusItemKey)

// 计算属性
const listClasses = computed(() => {
  return ['zx-list']
})

const containerStyle = computed(() => {
  const style = {}
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  return style
})

// 获取列表项的 key
const getItemKey = (item, index) => {
  return item[props.itemKey] || index
}

// 获取列表项的类名
const getItemClasses = (item, index) => {
  const itemKey = getItemKey(item, index)
  return [
    'zx-list-item',
    {
      'zx-list-item--focus': innerFocusItemKey.value === itemKey
    }
  ]
}

// 事件处理函数
const handleItemClick = (item, index) => {
  emit('itemClick', item, index)
}

const handleActionSelect = (action, item, index) => {
  emit('actionSelect', action, item, index)
}

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target

  // 检查是否滚动到底部
  if (scrollTop + clientHeight >= scrollHeight - 10 && !props.noMoreData && !props.loading) {
    emit('loadMore')
  }

  emit('scroll', event)
}

// 监听器
watch(
  () => props.focusItemKey,
  (newVal) => {
    innerFocusItemKey.value = newVal
  }
)

watch(
  () => innerFocusItemKey.value,
  (val) => {
    emit('update:focusItemKey', val)
  }
)

// 生命周期
onMounted(() => {
  // 组件挂载完成
})
</script>

<style lang="scss">
@import './index.scss';
</style>
