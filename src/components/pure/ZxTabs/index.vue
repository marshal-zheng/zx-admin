<template>
  <el-tabs
    v-model="activeKey"
    :type="type"
    :closable="closable"
    :addable="addable"
    :editable="editable"
    :tab-position="tabPosition"
    :stretch="stretch"
    :before-leave="beforeLeave"
    :class="[
      'zx-tabs',
      draggable ? 'zx-tabs-draggable' : '',
      useUrlParams ? 'zx-tabs-url-sync' : ''
    ]"
    @tab-click="handleTabClick"
    @tab-remove="handleTabRemove"
    @tab-add="handleTabAdd"
    @edit="handleEdit"
  >
    <el-tab-pane
      v-for="(item, index) in sortedItems"
      :key="item.key"
      :label="item.label"
      :name="item.key"
      :disabled="item.disabled"
      :closable="item.closable"
      :lazy="lazy"
    >
      <template #label v-if="item.labelSlot">
        <component :is="item.labelSlot" v-bind="item.labelProps || {}" />
      </template>

      <div class="zx-tabs-content">
        <div v-if="item.component && (!lazy || item.key === activeKey)">
          <Suspense>
            <template #default>
              <component
                :is="item.component"
                v-bind="item.props || {}"
                @mounted="handleComponentMounted"
              />
            </template>
            <template #fallback>
              <div class="zx-tabs-loading">
                <el-icon class="is-loading">
                  <Loading />
                </el-icon>
                <span>加载中...</span>
              </div>
            </template>
          </Suspense>
        </div>

        <div v-else-if="item.content">
          {{ item.content }}
        </div>

        <slot v-else :name="item.key" :item="item" :index="index"></slot>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, Suspense } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import './index.scss'

// 定义组件名称
defineOptions({
  name: 'ZxTabs'
})

// Props 定义
const props = defineProps({
  // 绑定值
  modelValue: {
    type: String,
    default: ''
  },
  // 标签页数据
  items: {
    type: Array,
    default: () => [],
    required: true
  },
  // 标签页类型
  type: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'card', 'border-card'].includes(value)
  },
  // 标签页位置
  tabPosition: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  },
  // 是否可关闭
  closable: {
    type: Boolean,
    default: false
  },
  // 是否可增加
  addable: {
    type: Boolean,
    default: false
  },
  // 是否可编辑（增加和关闭）
  editable: {
    type: Boolean,
    default: false
  },
  // 标签是否拉伸
  stretch: {
    type: Boolean,
    default: false
  },
  // 是否懒加载
  lazy: {
    type: Boolean,
    default: true
  },
  // 是否可拖拽排序
  draggable: {
    type: Boolean,
    default: false
  },
  // 是否记录标签页状态
  trackTabRecord: {
    type: Boolean,
    default: true
  },
  // 是否使用URL参数同步
  useUrlParams: {
    type: Boolean,
    default: false
  },
  // URL参数名称
  paramName: {
    type: String,
    default: 'tab'
  },
  // 切换前的钩子函数
  beforeLeave: {
    type: Function,
    default: null
  }
})

// 事件定义
const emit = defineEmits([
  'update:modelValue',
  'tab-click',
  'tab-remove',
  'tab-add',
  'edit',
  'drag-ended',
  'component-mounted'
])

// 路由相关
const router = useRouter()
const route = useRoute()

// 响应式数据
const activeKey = ref('')
const tabsItems = ref([])

// 计算属性
const sortedItems = computed(() => {
  return tabsItems.value
})

// 获取初始 activeKey
const getInitialActiveKey = () => {
  // 1. 优先使用 URL 参数（如果启用了URL同步）
  if (props.useUrlParams) {
    const urlTab = route.query[props.paramName]
    if (urlTab && props.items.find((item) => item.key === urlTab)) {
      return urlTab
    }
  }

  // 2. 使用 modelValue
  if (props.modelValue) {
    return props.modelValue
  }

  // 3. 使用 sessionStorage
  if (props.trackTabRecord) {
    const storedTab = sessionStorage.getItem(route.path)
    if (storedTab && props.items.find((item) => item.key === storedTab)) {
      return storedTab
    }
  }

  // 4. 使用第一个标签页
  return props.items[0]?.key || ''
}

// 初始化activeKey
const initializeActiveKey = () => {
  const initialKey = getInitialActiveKey()
  activeKey.value = initialKey

  // 同步到父组件
  if (initialKey !== props.modelValue) {
    emit('update:modelValue', initialKey)
  }

  // 如果启用了URL同步且URL中没有参数，则设置URL参数
  if (props.useUrlParams && !route.query[props.paramName] && initialKey) {
    const query = { ...route.query }
    query[props.paramName] = initialKey
    router.replace({ query })
  }
}

// 处理标签页点击
const handleTabClick = (tab, event) => {
  const key = tab.props.name
  handleTabChange(key)
  emit('tab-click', { key, tab, event })
}

// 处理标签页切换
const handleTabChange = (key) => {
  activeKey.value = key
  emit('update:modelValue', key)

  // URL参数同步
  if (props.useUrlParams) {
    const query = { ...route.query }
    query[props.paramName] = key
    router.push({ query })
  }

  // sessionStorage记录
  if (props.trackTabRecord) {
    sessionStorage.setItem(route.path, key)
  }
}

// 处理标签页移除
const handleTabRemove = (key) => {
  emit('tab-remove', key)
}

// 处理标签页添加
const handleTabAdd = () => {
  emit('tab-add')
}

// 处理编辑事件
const handleEdit = (targetName, action) => {
  emit('edit', { targetName, action })
}

// 处理组件挂载
const handleComponentMounted = (componentInstance) => {
  emit('component-mounted', componentInstance)
}

// 监听props变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== activeKey.value) {
      activeKey.value = newValue
    }
  }
)

watch(
  () => props.items,
  (newItems) => {
    tabsItems.value = newItems.map((item) => ({
      ...item,
      component: item.component ? markRaw(item.component) : null
    }))

    // 如果当前activeKey不在新的items中，重置为第一个
    if (!newItems.find((item) => item.key === activeKey.value)) {
      const firstKey = newItems[0]?.key
      if (firstKey) {
        handleTabChange(firstKey)
      }
    }
  },
  { immediate: true, deep: true }
)

// 监听URL参数变化
watch(
  () => route.query[props.paramName],
  (newTab) => {
    if (props.useUrlParams && newTab && newTab !== activeKey.value) {
      const item = props.items.find((item) => item.key === newTab)
      if (item) {
        activeKey.value = newTab
        emit('update:modelValue', newTab)
      }
    }
  }
)

// 组件挂载
onMounted(() => {
  initializeActiveKey()

  // 初始化sessionStorage
  if (props.trackTabRecord && !sessionStorage.getItem(route.path)) {
    sessionStorage.setItem(route.path, activeKey.value)
  }
})

// 组件卸载
onBeforeUnmount(() => {
  if (props.trackTabRecord) {
    sessionStorage.removeItem(route.path)
  }
})

// 导入markRaw
import { markRaw } from 'vue'
</script>

<style lang="scss">
@import './index.scss';
</style>
