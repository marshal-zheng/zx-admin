<template>
  <div class="zx-grid-list-wrapper">
    <div class="zx-grid-list" :class="{ 'show-table-border': showTableBorder }">
      <!-- 查询表单区域（始终渲染容器，避免插槽检测异常导致不显示） -->
      <div class="zx-grid-list__toolbar">
        <slot
          name="form"
          :query="gridState.query"
          :data="gridState"
          :loading="isLoading"
          :refresh="handleRefresh"
          :updateState="updateState"
          :updateMultiState="updateMultiState"
        ></slot>
      </div>
      <!-- 表格区域 - 固定高度容器 -->
      <div ref="gridEl" class="zx-grid-list__grid" v-loading="isLoading && !isSilentLoading">
        <!-- 表格内容：始终渲染，确保空数据时也保留表头 -->
        <div v-if="$slots.table" class="zx-grid-list__table">
          <slot
            name="table"
            :grid="gridState"
            :loading="isLoading"
            :refresh="handleRefresh"
            :hasData="hasData"
            :isEmpty="!hasData && !isLoading"
            :emptySlot="$slots.empty"
            :renderEmpty="renderTableEmpty"
          ></slot>
        </div>

        <!-- 空状态（仅当未提供 table 插槽时才显示内置空态） -->
        <div v-else-if="!isLoading && !hasData" class="zx-grid-list__empty">
          <slot name="empty" :refresh="handleRefresh" :error="gridState.error">
            <ZxEmpty
              :description="emptyStateDescription"
              :image="emptyImage"
              :image-size="emptyImageSize"
            >
              <template v-if="emptyImage && $slots.emptyImage" #image>
                <slot name="emptyImage"></slot>
              </template>
              <template v-if="showRefreshButton || gridState.error" #default>
                <el-button
                  v-if="gridState.error"
                  type="primary"
                  :loading="isLoading"
                  @click="handleRefresh"
                >
                  重新加载
                </el-button>
                <el-button
                  v-else-if="showRefreshButton"
                  :loading="isLoading"
                  @click="handleRefresh"
                >
                  刷新数据
                </el-button>
              </template>
            </ZxEmpty>
          </slot>
        </div>
      </div>

      <!-- 分页区域 - Sticky Footer -->
      <div
        v-if="showPagination && (hasData || hasPagination)"
        class="zx-grid-list__pagination"
        :style="paginationStyles"
      >
        <slot name="pagination" :pager="gridState.pager">
          <el-pagination
            :total="gridState.pager.total"
            :layout="paginationLayout"
            :page-size="gridState.pager.size"
            :page-sizes="computedPageSizes"
            :current-page="currentPage"
            :small="small"
            :background="paginationBackground"
            :disabled="!hasPagination || isLoading"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  nextTick,
  getCurrentInstance,
  readonly,
  h
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { merge, cloneDeep, isEqual, omit, isEmpty, get, set } from 'lodash-es'
import qs from 'query-string'
import { Base64 } from 'js-base64'
import ZxEmpty from '../ZxEmpty'
import './index.scss'

// 定义组件选项
defineOptions({
  name: 'ZxGridList'
})

// 手动实现 useDebounceFn 和 useIntervalFn（避免依赖 @vueuse/core）
const useDebounceFn = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const useIntervalFn = (fn, interval) => {
  let intervalId

  const pause = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const resume = () => {
    pause()
    intervalId = setInterval(fn, interval)
  }

  return { pause, resume }
}

// Props 定义
const props = defineProps({
  // 必需的数据加载函数
  loadData: {
    type: Function,
    required: true
  },
  // 初始状态
  initialState: {
    type: Object,
    default: () => ({})
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: true
  },
  // 分页尺寸选项
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  // 分页布局
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  // 小尺寸分页
  small: {
    type: Boolean,
    default: false
  },
  // 分页背景
  paginationBackground: {
    type: Boolean,
    default: true
  },
  // 组件创建时是否自动加载
  loadOnMounted: {
    type: Boolean,
    default: false
  },
  // 查询参数处理函数
  queryTransform: {
    type: Function,
    default: (query) => query
  },
  // 参数预处理函数
  paramsTransform: {
    type: Function,
    default: (params) => params
  },
  // 自动刷新配置
  autoRefresh: {
    type: [Boolean, Object],
    default: false
  },
  // 加载时是否清除表格选择
  clearSelectionOnLoad: {
    type: Boolean,
    default: true
  },
  // 是否同步URL状态
  syncUrlState: {
    type: Boolean,
    default: false
  },
  // URL状态键名
  urlStateKey: {
    type: String,
    default: '_state'
  },
  // 分页是否从0开始
  pageFrom0: {
    type: Boolean,
    default: false
  },
  // 防抖延迟(ms)
  debounceDelay: {
    type: Number,
    default: 300
  },
  // 默认分页大小
  defaultPageSize: {
    type: Number,
    default: 20
  },
  // 自动让表格高度撑满可视区域（针对 Element Plus 的 ElTable）
  autoFitTableHeight: {
    type: Boolean,
    default: true
  },
  // 空状态描述文字
  emptyDescription: {
    type: String,
    default: '暂无数据'
  },
  // 空状态图片
  emptyImage: {
    type: String,
    default: ''
  },
  // 空状态图片尺寸
  emptyImageSize: {
    type: [String, Number],
    default: undefined
  },
  // 是否显示刷新按钮
  showRefreshButton: {
    type: Boolean,
    default: false
  },
  // 是否显示表格内边框
  showTableBorder: {
    type: Boolean,
    default: false
  },
  // 分页组件底部内边距
  paginationPaddingBottom: {
    type: [String, Number],
    default: '0px'
  }
})

// Emits 定义
const emit = defineEmits(['beforeLoad', 'dataLoaded', 'loadError', 'stateChange'])

// 组合式函数
const route = useRoute()
const router = useRouter()
const instance = getCurrentInstance()

// 响应式状态
const gridState = reactive({
  query: {},
  pager: {
    size: props.defaultPageSize,
    page: props.pageFrom0 ? 0 : 1,
    total: 0
  },
  list: [],
  loading: false,
  error: null,
  lastLoadTime: null
})

// 内部状态
const loadingRequestId = ref('')
const autoRefreshTimer = ref(null)
const gridEl = ref(null)
let resizeObserver = null

// 计算属性
const isLoading = computed(() => gridState.loading)
const isSilentLoading = computed(() => gridState.loading && gridState.silent)
const hasData = computed(() => Array.isArray(gridState.list) && gridState.list.length > 0)
const hasPagination = computed(() => gridState.pager && gridState.pager.total > 0)
const shouldShowEmpty = computed(() => !isLoading.value && !hasData.value)
const emptyStateDescription = computed(() => {
  if (gridState.error) {
    return `加载失败: ${gridState.error}`
  }
  return props.emptyDescription
})
const computedPageSizes = computed(() => {
  return props.pageSizes?.length ? props.pageSizes : [10, 20, 50, 100]
})
const currentPage = computed(() => {
  return props.pageFrom0 ? gridState.pager.page + 1 : gridState.pager.page
})
const totalPages = computed(() => {
  return Math.ceil(gridState.pager.total / gridState.pager.size) || 1
})
const paginationStyles = computed(() => {
  const paddingValue =
    typeof props.paginationPaddingBottom === 'number'
      ? `${props.paginationPaddingBottom}px`
      : props.paginationPaddingBottom
  return {
    '--cmp-grid-list-pagination-padding-bottom': paddingValue
  }
})

// 工具函数
const generateRequestId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const sanitizeState = (state) => {
  const { query, pager } = state || {}
  return {
    query: query || {},
    pager: pager
      ? {
          page: pager.page,
          size: pager.size,
          total: pager.total
        }
      : null
  }
}

const getStateSnapshot = () => cloneDeep(sanitizeState(gridState))

// 状态更新函数
const updateState = (key, value) => {
  set(gridState, key, value)
  emit('stateChange', getStateSnapshot())
}

const updateMultiState = (newState) => {
  Object.assign(gridState, newState)
  emit('stateChange', getStateSnapshot())
}

// 数据加载核心函数
const loadDataInternal = async (params = {}, options = {}) => {
  const requestId = generateRequestId()
  loadingRequestId.value = requestId

  try {
    // 合并参数
    const mergedParams = merge({}, getStateSnapshot(), params)

    // 处理分页参数
    if (!props.showPagination) {
      delete mergedParams.pager
    } else {
      mergedParams.pager = {
        size: props.defaultPageSize,
        page: props.pageFrom0 ? 0 : 1,
        ...gridState.pager,
        ...mergedParams.pager
      }
    }

    // 转换查询参数
    if (mergedParams.query) {
      mergedParams.query = props.queryTransform(mergedParams.query)
    }

    // 预处理所有参数
    const processedParams = props.paramsTransform(mergedParams)

    // 更新状态
    updateMultiState({
      ...processedParams,
      loading: !options.silent,
      silent: options.silent,
      error: null
    })

    emit('beforeLoad', processedParams)

    // 调用数据加载函数
    const response = await props.loadData(processedParams)

    // 检查请求是否仍然有效（防止并发请求问题）
    if (loadingRequestId.value !== requestId) {
      console.warn('Request outdated, ignoring response')
      return
    }

    // 处理响应数据
    const responseData = response || {}
    const newPager = responseData.pager || {}

    // 更新分页信息
    if (props.showPagination && processedParams.pager) {
      const updatedPager = {
        page: newPager.page ?? processedParams.pager.page,
        size: newPager.size ?? processedParams.pager.size,
        total: newPager.total ?? 0
      }

      // 处理页码超出范围的情况
      if (updatedPager.total > 0) {
        const maxPage = Math.ceil(updatedPager.total / updatedPager.size)
        const currentPage = props.pageFrom0 ? updatedPager.page : updatedPager.page - 1

        if (currentPage >= maxPage) {
          // 递归调用，跳转到最后一页
          const newPage = props.pageFrom0 ? maxPage - 1 : maxPage
          return loadDataInternal(
            {
              ...processedParams,
              pager: { ...processedParams.pager, page: newPage }
            },
            options
          )
        }
      }

      updateState('pager', updatedPager)
    }

    // 解析列表数据，确保传给表格的一定是数组
    const resolvedList = Array.isArray(responseData.list)
      ? responseData.list
      : Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData?.data?.list)
          ? responseData.data.list
          : Array.isArray(responseData.items)
            ? responseData.items
            : Array.isArray(responseData.records)
              ? responseData.records
              : Array.isArray(responseData.rows)
                ? responseData.rows
                : []

    // 更新列表及其他可用字段（避免把非数组的 data 挂到状态上）
    updateMultiState({
      ...omit(responseData, ['query', 'data']),
      list: resolvedList,
      lastLoadTime: Date.now()
    })
    await nextTick()
    applyAutoTableHeight()

    emit('dataLoaded', responseData)

    // 清除表格选择
    if (props.clearSelectionOnLoad) {
      await nextTick()
      clearTableSelection()
    }
  } catch (error) {
    console.error('Data loading error:', error)
    updateMultiState({
      error: error.message || 'Loading failed',
      list: []
    })
    emit('loadError', error)
  } finally {
    if (loadingRequestId.value === requestId) {
      updateMultiState({
        loading: false,
        silent: false
      })
    }
  }
}

// 防抖加载函数
const debouncedLoad = useDebounceFn(loadDataInternal, props.debounceDelay)

// 公开的加载函数
const loadDataPublic = (params = {}, options = {}) => {
  if (options.immediate) {
    return loadDataInternal(params, options)
  }
  return debouncedLoad(params, options)
}

// 刷新函数
const handleRefresh = (options = {}) => {
  return loadDataPublic({}, { immediate: true, ...options })
}

// 分页处理函数
const handleSizeChange = (size) => {
  updateState('pager.size', size)
  // 重置到第一页
  updateState('pager.page', props.pageFrom0 ? 0 : 1)
  loadDataPublic({}, { immediate: true })
}

const handlePageChange = (page) => {
  const targetPage = props.pageFrom0 ? page - 1 : page
  updateState('pager.page', targetPage)
  loadDataPublic({}, { immediate: true })
}

// 排序处理函数
const handleSortChange = ({ prop, order }) => {
  const sortParams = {
    sortBy: order ? prop : undefined,
    sortOrder: order || undefined
  }
  updateState('query', { ...gridState.query, ...sortParams })
  // 排序时重置到第一页
  updateState('pager.page', props.pageFrom0 ? 0 : 1)
  loadDataPublic({}, { immediate: true })
}

// 获取 ElTable 组件实例
const findTableComponent = (vnode) => {
  if (!vnode) return null
  if (vnode.type?.name === 'ElTable' && vnode.component?.proxy) {
    return vnode.component.proxy
  }
  if (Array.isArray(vnode.children)) {
    for (const child of vnode.children) {
      const found = findTableComponent(child)
      if (found) return found
    }
  } else if (vnode.component?.subTree) {
    const found = findTableComponent(vnode.component.subTree)
    if (found) return found
  }
  return null
}

// 清除表格选择
const clearTableSelection = () => {
  try {
    const tableComponent = findTableComponent(instance?.subTree)
    if (tableComponent?.clearSelection) {
      tableComponent.clearSelection()
    }
  } catch (error) {
    console.warn('Failed to clear table selection:', error)
  }
}

// 自适应表格高度（消除下方大块留白）
const applyAutoTableHeight = () => {
  if (!props.autoFitTableHeight) return
  try {
    const tableComponent = findTableComponent(instance?.subTree)
    const container = gridEl.value
    if (!tableComponent || !container) return
    const h = container.clientHeight
    if (!h || h <= 0) return
    // 直接设置根元素高度并触发布局计算
    const el = tableComponent.$el || tableComponent?.vnode?.el
    if (el) {
      el.style.height = h + 'px'
      tableComponent.doLayout && tableComponent.doLayout()
    }
  } catch (e) {
    // 忽略
  }
}

// URL状态同步
const setupUrlStateSync = () => {
  if (!props.syncUrlState) return

  const deserializeUrlState = (search) => {
    try {
      const params = qs.parse(search)
      const stateStr = params[props.urlStateKey]
      return stateStr ? JSON.parse(Base64.decode(stateStr)) : null
    } catch (error) {
      console.warn('Failed to deserialize URL state:', error)
      return null
    }
  }

  const serializeUrlState = (state) => {
    try {
      return Base64.encode(JSON.stringify(sanitizeState(state)))
    } catch (error) {
      console.warn('Failed to serialize URL state:', error)
      return ''
    }
  }

  // 从URL恢复状态
  const urlState = deserializeUrlState(location.search)
  if (urlState) {
    updateMultiState(urlState)
  }

  let lastUrlState = ''

  // 监听路由变化
  watch(
    () => route.query,
    () => {
      const newUrlState = deserializeUrlState(location.search)
      const newStateStr = serializeUrlState(newUrlState || {})

      if (lastUrlState !== newStateStr && newUrlState) {
        lastUrlState = newStateStr
        loadDataPublic(newUrlState, { immediate: true })
      }
    }
  )

  // 监听状态变化，更新URL
  watch(
    () => getStateSnapshot(),
    (newState) => {
      if (gridState.silent) return

      const newStateStr = serializeUrlState(newState)
      if (lastUrlState !== newStateStr) {
        lastUrlState = newStateStr
        const currentQuery = { ...route.query }
        currentQuery[props.urlStateKey] = newStateStr

        router.replace({ query: currentQuery }).catch(() => {
          // 忽略导航错误
        })
      }
    },
    { deep: true }
  )
}

// 自动刷新功能
const setupAutoRefresh = () => {
  console.log('props.autoRefresh', props.autoRefresh)
  // When an object is passed, default enabled to true unless explicitly set to false
  const refreshConfig =
    typeof props.autoRefresh === 'boolean'
      ? { enabled: props.autoRefresh, interval: 5000 }
      : { enabled: props.autoRefresh?.enabled ?? true, interval: 1000, ...props.autoRefresh }

  if (!refreshConfig.enabled) {
    autoRefreshTimer.value = null
    return
  }

  const { pause, resume } = useIntervalFn(() => {
    if (!gridState.loading && gridState.lastLoadTime) {
      const timeSinceLastLoad = Date.now() - gridState.lastLoadTime
      if (timeSinceLastLoad >= refreshConfig.interval) {
        loadDataPublic({}, { silent: true })
      }
    }
  }, refreshConfig.interval)

  autoRefreshTimer.value = { pause, resume }
  // Start the interval immediately after setup
  resume()
}

// 生命周期
onMounted(async () => {
  // 应用初始状态
  if (props.initialState) {
    updateMultiState(props.initialState)
  }

  // 设置URL状态同步
  setupUrlStateSync()

  // 自动加载数据
  if (props.loadOnMounted) {
    await loadDataPublic({}, { immediate: true })
  }

  // 设置自动刷新
  setupAutoRefresh()

  // 监听容器尺寸变化，自动适配表格高度
  if (props.autoFitTableHeight && window?.ResizeObserver) {
    const ro = new ResizeObserver(
      useDebounceFn(() => {
        applyAutoTableHeight()
      }, 60)
    )
    if (gridEl.value) ro.observe(gridEl.value)
    resizeObserver = ro
    // 初次应用
    await nextTick()
    applyAutoTableHeight()
  } else {
    await nextTick()
    applyAutoTableHeight()
    window.addEventListener('resize', applyAutoTableHeight)
  }
})

onActivated(async () => {
  await loadDataPublic({}, { immediate: true })
  await nextTick()
  applyAutoTableHeight()
  if (autoRefreshTimer.value?.resume) {
    autoRefreshTimer.value.resume()
  }
})

onDeactivated(() => {
  if (autoRefreshTimer.value?.pause) {
    autoRefreshTimer.value.pause()
  }
})

onBeforeUnmount(() => {
  if (autoRefreshTimer.value?.pause) {
    autoRefreshTimer.value.pause()
  }
  if (resizeObserver) {
    try {
      resizeObserver.disconnect()
    } catch (error) {
      // 忽略断开连接时的错误
      console.warn('ResizeObserver disconnect error:', error)
    }
    resizeObserver = null
  }
  window.removeEventListener('resize', applyAutoTableHeight)
})

// 渲染表格内空状态的辅助函数
const renderTableEmpty = () => {
  return h(
    ZxEmpty,
    {
      description: emptyStateDescription.value,
      image: props.emptyImage,
      imageSize: props.emptyImageSize
    },
    {
      image:
        props.emptyImage && instance?.slots.emptyImage
          ? () => instance.slots.emptyImage()
          : undefined,
      default:
        props.showRefreshButton || gridState.error
          ? () =>
              [
                gridState.error
                  ? h(
                      'el-button',
                      {
                        type: 'primary',
                        loading: isLoading.value,
                        onClick: handleRefresh
                      },
                      '重新加载'
                    )
                  : null,
                !gridState.error && props.showRefreshButton
                  ? h(
                      'el-button',
                      {
                        loading: isLoading.value,
                        onClick: handleRefresh
                      },
                      '刷新数据'
                    )
                  : null
              ].filter(Boolean)
          : undefined
    }
  )
}

// 暴露给模板的API
defineExpose({
  loadData: loadDataPublic,
  refresh: handleRefresh,
  state: readonly(gridState),
  updateState,
  updateMultiState,
  clearTableSelection,
  getStateSnapshot,
  renderTableEmpty
})
</script>

<style lang="scss" scoped>
/* 样式已移至 index.scss */
</style>
