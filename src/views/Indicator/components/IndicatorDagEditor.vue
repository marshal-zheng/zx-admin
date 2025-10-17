<template>
  <div class="indicator-dag-editor">
    <div class="dag-content">
      <DAGPage
        ref="dagPageRef"
        :operators="processedOperators"
        :operators-loading="operatorsLoading"
        :dnd-config="dndConfig"
        :layout="layoutMode"
        :custom-menu-handler="customMenuHandler"
        :initial-graph-data="processedGraphData"
        :graph-loading="computedGraphLoading"
        :auto-layout="true"
        :show-sidebar="computedShowSidebar"
        :readonly="computedReadonly"
        :show-toolbar="isShowToolbar"
        :export-xmind-handler="exportXmindHandler"
        @edit-node="handleEditNode"
        @save="handleSave"
        @node-dblclick="handleNodeDblclick"
        @export-xmind="handleExportXmind"
      >
        <template #right>
          <slot name="toolbar-right"></slot>
        </template>
      </DAGPage>
    </div>

    <!-- 指标详情表单抽屉 -->
    <IndicatorDetailFormDrawer
      v-model="showIndicatorDrawer"
      :indicator-data="currentIndicatorData"
      :parent-indicator-name="currentIndicatorMeta.parentIndicator"
      :is-leaf-node="currentIndicatorMeta.isLeafNode"
      :disabled-menu="[]"
      :is-read-only="computedReadonly"
      :algo-type="algoType"
      @confirm="handleIndicatorConfirm"
      @cancel="handleIndicatorCancel"
      @close="handleIndicatorClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import DAGPage from '@/components/business/Dag/index.vue'
import IndicatorDetailFormDrawer from '../components/IndicatorDetailFormDrawer.vue'
import { useMessageBox } from '@/hooks/comp/useElementPlus'
import { useGraphStore } from '@/components/business/ZxFlow/composables/useGraphStore'
// import { indicatorApi } from '@/api/modules/indicator'
// import { ElMessage } from 'element-plus'
import {
  cloneNodeForForm,
  createEmptyNodeData,
  prepareNodeSubmitData
} from '../utils/indicatorMapper'

// Props 定义
const props = defineProps({
  // 基础指标数据（左侧树列表），支持静态数据、Promise或函数
  listData: {
    type: [Array, Promise, Function],
    default: () => []
  },
  // 图数据，支持静态对象、Promise或函数
  graphData: {
    type: [Object, Promise, Function],
    default: () => ({ nodes: [], edges: [] })
  },
  // 是否显示左侧导航树
  isShowSideNav: {
    type: Boolean,
    default: true
  },
  isShowToolbar: {
    type: Boolean,
    default: true
  },
  // 是否可编辑
  isEditable: {
    type: Boolean,
    default: true
  },
  // 算法类型：2-模糊综合法，3-TOPSIS算法
  algoType: {
    type: Number,
    default: null
  },
  // 导出 Xmind 处理函数
  exportXmindHandler: {
    type: Function,
    default: null
  }
})

// Emits 定义
const emit = defineEmits(['save', 'edit-node', 'delete-node', 'export-xmind'])

// 初始化工具函数
const { showConfirm } = useMessageBox()
const graphStore = useGraphStore()

const SCROLL_ANIMATION_DURATION = 420
const SCROLL_PADDING = 48

const formatWeightDisplay = (value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return '--'
  const fixed = num.toFixed(2)
  return fixed.endsWith('.00') ? String(num.toFixed(0)) : fixed
}

const focusGraphOnCells = (graph, cells, options = {}) => {
  if (!graph || !cells.length) return

  const {
    animationDuration = SCROLL_ANIMATION_DURATION,
    padding = SCROLL_PADDING,
    highlight = true,
    bringToFront = true
  } = options

  if (typeof graph.cleanSelection === 'function') {
    graph.cleanSelection()
  }

  graph.select(cells)

  const [primaryCell] = cells
  if (!primaryCell) return

  if (bringToFront && typeof primaryCell.toFront === 'function') {
    primaryCell.toFront()
  }

  if (typeof graph.scrollToCell === 'function') {
    graph.scrollToCell(primaryCell, {
      animation: { duration: animationDuration },
      padding
    })
  } else if (typeof graph.centerCell === 'function') {
    graph.centerCell(primaryCell)
  } else if (typeof graph.centerPoint === 'function') {
    const bbox = primaryCell.getBBox()
    graph.centerPoint(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
  }

  if (!highlight) return

  const highlightDuration = Math.max(animationDuration + 400, 1600)
  cells.forEach((cell) => {
    if (typeof cell.addTools === 'function') {
      try {
        cell.addTools([{ name: 'boundary', args: { padding: 2 } }])
        setTimeout(() => {
          try {
            cell.removeTools()
          } catch (err) {
            console.warn('removeTools failed', err)
          }
        }, highlightDuration)
      } catch (error) {
        console.warn('highlight cell failed', error)
      }
    }
  })
}

// DAGPage 组件引用
const dagPageRef = ref(null)

// 响应式数据
const operatorsLoading = ref(false)
const layoutMode = ref('vertical')
const internalGraphLoading = ref(false) // 内部图数据加载状态

// 控制状态
const showSidebar = ref(props.isShowSideNav)
const readonly = ref(!props.isEditable)
const showToolbar = ref(true)

// 指标详情抽屉相关
const showIndicatorDrawer = ref(false)
const currentIndicatorData = ref(createEmptyNodeData())
const currentIndicatorMeta = reactive({
  parentIndicator: '',
  isLeafNode: true
})
const editingNodeId = ref('')

// 计算属性
const computedShowSidebar = computed(() => showSidebar.value)
const computedReadonly = computed(() => readonly.value)
// 合并外部和内部的图数据加载状态
const computedGraphLoading = computed(() => props.graphLoading || internalGraphLoading.value)

// 处理后的算子数据
const processedOperators = ref([])

// 加载 listData 数据的函数
const loadListData = async (dataSource) => {
  try {
    operatorsLoading.value = true
    let data

    // 如果是函数，调用函数获取数据
    if (typeof dataSource === 'function') {
      data = await dataSource()
    }
    // 如果是Promise，等待解析
    else if (dataSource && typeof dataSource.then === 'function') {
      data = await dataSource
    }
    // 如果是数组，直接使用
    else if (Array.isArray(dataSource)) {
      data = dataSource
    } else {
      data = []
    }

    processedOperators.value = data || []
  } catch (error) {
    console.error('加载 listData 数据失败:', error)
    processedOperators.value = []
  } finally {
    operatorsLoading.value = false
  }
}

// 监听 listData 变化
watch(
  () => props.listData,
  (newData) => {
    if (newData) {
      loadListData(newData)
    }
  },
  { immediate: true }
)

// 处理图数据 - 使用 ref 而不是 computed，确保能触发响应式更新
const processedGraphData = ref(null)

// 加载图数据的函数
const loadGraphData = async (dataSource) => {
  try {
    internalGraphLoading.value = true
    let data

    // 如果是函数，调用函数获取数据
    if (typeof dataSource === 'function') {
      data = await dataSource()
    }
    // 如果是Promise，等待解析
    else if (dataSource && typeof dataSource.then === 'function') {
      data = await dataSource
    }
    // 如果是对象，直接使用
    else if (dataSource && typeof dataSource === 'object') {
      data = dataSource
    } else {
      data = { nodes: [], edges: [] }
    }

    // 将处理后的数据包装成返回 Promise 的函数
    processedGraphData.value = () => Promise.resolve(data || { nodes: [], edges: [] })
  } catch (error) {
    console.error('加载图数据失败:', error)
    processedGraphData.value = () => Promise.resolve({ nodes: [], edges: [] })
  } finally {
    internalGraphLoading.value = false
  }
}

// 监听 graphData 变化并更新 processedGraphData
watch(
  () => props.graphData,
  (newData) => {
    console.log('IndicatorDagEditor - 图数据变化:', newData)
    if (newData) {
      loadGraphData(newData)
    }
  },
  { immediate: true }
)

// DnD 配置
const dndConfig = {
  title: '智能指标体系',
  searchPlaceholder: '搜索指标体系...',
  textConfig: {
    loadingText: '正在加载组件...',
    emptySearchText: '没有找到匹配的组件',
    emptySearchDesc: '请尝试使用其他关键词搜索',
    emptyDataText: '暂无可用指标体系',
    emptyDataDesc: ''
  }
}

// 监听 props 变化
watch(
  () => props.isShowSideNav,
  (newVal) => {
    showSidebar.value = newVal
  }
)

watch(
  () => props.isEditable,
  (newVal) => {
    readonly.value = !newVal
  }
)

// 自定义菜单处理器
const customMenuHandler = (standardItems, type, target) => {
  const customItems = []

  if (type === 'node') {
    // 自定义菜单项（放在上面）
    customItems.push(
      {
        id: 'edit-indicator',
        label: '编辑指标',
        icon: 'Edit',
        action: () => handleEditNode(target)
      },
      {
        id: 'delete-indicator',
        label: '删除指标',
        icon: 'Delete',
        action: () => handleDeleteNode(target),
        danger: true
      }
    )

    // 添加分隔线
    customItems.push({ type: 'divider' })

    // 然后添加通用菜单项（过滤掉不需要的）
    const filteredStandardItems = standardItems.filter(
      (item) => item.type === 'divider' || !['delete'].includes(item.id)
    )
    customItems.push(...filteredStandardItems)
  } else if (type === 'blank') {
    // 空白区域只使用标准菜单项
    customItems.push(...standardItems)
  } else {
    // 其他类型（如边）使用标准菜单
    return standardItems
  }

  return customItems
}

// 编辑节点处理函数
const handleEditNode = (node) => {
  console.log('编辑指标节点:', node)

  // 记录当前编辑的节点ID
  editingNodeId.value = node?.id || ''

  // 从节点数据中提取指标信息
  const nodeData = node?.getData?.() || {}
  // 解析上级指标名称（而非ID）
  let parentIndicatorName = ''
  const propsData = nodeData.properties || {}
  const parentId = propsData.parentNodeId || ''
  try {
    if (parentId && typeof graphStore?.getNodeById === 'function') {
      const parentNode = graphStore.getNodeById(parentId)
      const parentData = parentNode?.data || {}
      const parentProps = parentData.properties || {}
      const parentContent = parentProps.content || {}
      parentIndicatorName = parentContent.label || parentData.label || ''
    }
  } catch (e) {
    // 忽略获取父名称的异常
  }

  const nodeClone = cloneNodeForForm({ ...nodeData, id: node?.id || nodeData.id })
  currentIndicatorData.value = nodeClone
  currentIndicatorMeta.parentIndicator = parentIndicatorName
  currentIndicatorMeta.isLeafNode = nodeData.type === 'leaf-node'

  showIndicatorDrawer.value = true

  // 触发外部事件
  emit('edit-node', node)
}

// 删除节点处理函数
const handleDeleteNode = async (node) => {
  console.log('删除指标节点:', node)

  try {
    // 获取节点信息
    const nodeData = node?.getData?.() || {}
    const nodeName = nodeData.label || '未命名指标'

    // 显示删除确认对话框
    await showConfirm('删除指标确认', `确定要删除指标 "${nodeName}" 吗？删除后无法恢复。`, {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })

    // 用户确认删除，执行删除操作
    if (node?.id) {
      graphStore.removeNodes([node.id])
      console.log(`指标节点 "${nodeName}" 已删除`)
    }

    // 触发外部事件
    emit('delete-node', node)
  } catch (error) {
    // 用户取消删除或发生错误
    if (error !== 'cancel') {
      console.error('删除指标节点时发生错误:', error)
    }
  }
}

// 指标表单确认处理
const handleIndicatorConfirm = (formNodeData) => {
  console.log('指标表单确认:', formNodeData)

  try {
    const nodeId = editingNodeId.value
    if (!nodeId) return

    const submitNode = prepareNodeSubmitData(
      { ...formNodeData, id: nodeId },
      { isLeafNode: currentIndicatorMeta.isLeafNode }
    )
    const updateData = {
      data: submitNode,
      label: submitNode.label
    }

    console.log('更新节点数据:', nodeId, updateData)
    console.log('[数据更新] 提交的权重值:', {
      formWeight: formNodeData.properties?.weight,
      submitWeight: submitNode.properties?.weight,
      updateWeight: updateData.data?.properties?.weight
    })

    // 将表单数据写回到节点（Pinia store -> XFlow 同步渲染）
    graphStore.updateNode(nodeId, updateData)

    // 强制触发节点重新渲染，确保数据同步后再进行权重校验
    setTimeout(() => {
      const updatedNode = graphStore.getNodeById?.(nodeId)
      console.log('IndicatorDagEditor - 节点更新后的数据:', updatedNode)
      console.log(
        'IndicatorDagEditor - graphStore 中的所有节点:',
        graphStore.nodes?.map((n) => ({ id: n.id, label: n.data?.label }))
      )

      // 尝试直接通过X6 API更新节点数据，确保触发Vue组件重新渲染
      if (dagPageRef.value?.getGraph) {
        const graph = dagPageRef.value.getGraph()
        const x6Node = graph?.getCellById?.(nodeId)
        if (x6Node) {
          console.log('IndicatorDagEditor - 找到 X6 节点，当前数据:', x6Node.getData())
          const nextNodeData = updateData.data || updateData
          console.log('IndicatorDagEditor - 即将更新为:', nextNodeData)
          x6Node.setData(nextNodeData)
          console.log('IndicatorDagEditor - X6 节点更新完成，新数据:', x6Node.getData())
        } else {
          console.error('IndicatorDagEditor - 在 X6 图中找不到节点:', nodeId)
          console.log(
            'IndicatorDagEditor - X6 图中的所有节点:',
            graph?.getNodes()?.map((n) => ({ id: n.id, data: n.getData() }))
          )
        }
      } else {
        console.error('IndicatorDagEditor - 无法获取图实例')
      }

      // 如果有DAG页面引用，尝试强制刷新
      if (dagPageRef.value && typeof dagPageRef.value.forceUpdate === 'function') {
        dagPageRef.value.forceUpdate()
      }

      // 数据更新完成
      console.log('IndicatorDagEditor - 节点数据更新完成')
    }, 100)
  } catch (e) {
    console.error('更新节点数据失败:', e)
  } finally {
    showIndicatorDrawer.value = false
  }
}

// 指标表单取消处理
const handleIndicatorCancel = () => {
  console.log('指标表单取消')
  showIndicatorDrawer.value = false
}

const handleNodeDblclick = (payload) => {
  console.log('handleNodeDblclick', payload)
  const targetNode = payload?.node || payload
  if (targetNode) {
    handleEditNode(targetNode)
  }
}

// 指标表单关闭处理
const handleIndicatorClose = () => {
  console.log('指标表单关闭')
  showIndicatorDrawer.value = false
  currentIndicatorData.value = createEmptyNodeData()
  currentIndicatorMeta.parentIndicator = ''
  currentIndicatorMeta.isLeafNode = true
}

// 保存图数据处理（来自工具栏的保存事件）
const handleSave = (graphData) => {
  console.log('接收到保存的图数据:', graphData)

  // 触发外部事件
  emit('save', graphData)
}

// 导出 Xmind 事件处理
const handleExportXmind = (graphData) => {
  console.log('接收到导出 Xmind 的图数据:', graphData)

  // 触发外部事件
  emit('export-xmind', graphData)
}

// 图实例引用
const graphInstance = ref(null)

// 处理来自 DAGPage 的节点单击事件（由 XFlowGraph 转发）
const handleNodeClick = ({ node, event }) => {
  console.log('node', node)
  if (node) {
    handleEditNode(node)
  }
}

// 暴露方法给外部使用
const getSaveData = () => {
  if (!dagPageRef.value) {
    console.warn('DAGPage 组件引用不存在')
    return
  }

  try {
    const graphData = dagPageRef.value.getSaveData()
    if (graphData) {
      console.log('获取到的完整图数据（与data.json格式一致）:', graphData)

      // 处理数据，移除指定字段中的 '-' 字符
      const processedGraphData = {
        ...graphData,
        nodes:
          graphData.nodes?.map((node) => ({
            ...node,
            id: node.id?.replace(/-/g, '') || node.id,
            properties: {
              ...node.properties,
              content: {
                ...node.properties?.content,
                id: node.properties?.content?.id
              },
              parentNodeId:
                node.properties?.parentNodeId?.replace(/-/g, '') || node.properties?.parentNodeId
            }
          })) || [],
        edges:
          graphData.edges?.map((edge) => ({
            ...edge,
            id: edge.id?.replace(/-/g, '') || edge.id,
            sourceNodeId: edge.sourceNodeId?.replace(/-/g, '') || edge.sourceNodeId,
            targetNodeId: edge.targetNodeId?.replace(/-/g, '') || edge.targetNodeId
          })) || []
      }

      // 验证数据格式
      const { nodes = [], edges = [] } = processedGraphData
      console.log('节点数据格式验证:', nodes[0])
      console.log('边数据格式验证:', edges[0])

      return processedGraphData
    }
  } catch (error) {
    console.error('获取图数据时出错:', error)
  }
}

const getGraph = () => {
  return dagPageRef.value?.getGraph?.()
}

// 获取 PNG 图片数据 (Base64 DataURL)
const getPNGImageData = async (options = {}) => {
  if (!dagPageRef.value) {
    console.warn('DAGPage 组件引用不存在')
    return null
  }

  try {
    const graph = dagPageRef.value.getGraph()
    if (!graph) {
      console.warn('图实例不存在')
      return null
    }

    // 使用 X6 的导出插件获取 PNG 数据
    const exportPlugin = graph.getPlugin('export')
    if (!exportPlugin) {
      console.warn('导出插件未找到')
      return null
    }

    const defaultOptions = {
      backgroundColor: '#ffffff',
      padding: 20,
      quality: 1,
      scale: 2,
      ...options
    }

    return new Promise((resolve, reject) => {
      try {
        graph.toPNG((dataUri) => {
          resolve(dataUri)
        }, defaultOptions)
      } catch (error) {
        console.error('获取 PNG 图片数据失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('获取 PNG 图片数据时出错:', error)
    return null
  }
}

// 获取 PDF 图片数据 (Blob)
const getPDFImageData = async (options = {}) => {
  if (!dagPageRef.value) {
    console.warn('DAGPage 组件引用不存在')
    return null
  }

  try {
    const graph = dagPageRef.value.getGraph()
    if (!graph) {
      console.warn('图实例不存在')
      return null
    }

    const defaultOptions = {
      backgroundColor: '#ffffff',
      padding: 20,
      quality: 1,
      scale: 2,
      format: 'a4',
      orientation: null, // 自动检测
      margin: 24,
      ...options
    }

    // 首先获取 PNG 数据
    const pngDataUrl = await getPNGImageData(defaultOptions)
    if (!pngDataUrl) {
      return null
    }

    // 动态导入 jsPDF
    const { default: jsPDF } = await import('jspdf')

    // 创建图片对象以获取尺寸
    const img = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = pngDataUrl
    })

    const { format = 'a4', orientation, margin = 24, pdfOptions = {} } = defaultOptions

    const orientationHint = orientation || (img.width >= img.height ? 'l' : 'p')
    const pdf = new jsPDF({
      orientation: orientationHint,
      unit: 'pt',
      format,
      ...pdfOptions
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const horizMargin = typeof margin === 'number' ? margin : (margin?.horizontal ?? 24)
    const vertMargin = typeof margin === 'number' ? margin : (margin?.vertical ?? 24)
    const maxWidth = pageWidth - horizMargin * 2
    const maxHeight = pageHeight - vertMargin * 2
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
    const drawWidth = img.width * scale
    const drawHeight = img.height * scale
    const offsetX = (pageWidth - drawWidth) / 2
    const offsetY = (pageHeight - drawHeight) / 2

    pdf.addImage(pngDataUrl, 'PNG', offsetX, offsetY, drawWidth, drawHeight)

    // 返回 PDF 的 Blob 数据
    const pdfBlob = pdf.output('blob')
    return pdfBlob
  } catch (error) {
    console.error('获取 PDF 图片数据时出错:', error)
    return null
  }
}

// 将 DataURL 转换为 Blob
const dataURLToBlob = (dataURL) => {
  try {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  } catch (error) {
    console.error('DataURL 转 Blob 失败:', error)
    return null
  }
}

// 获取 PNG 图片 Blob
const getPNGImageBlob = async (options = {}) => {
  try {
    const dataUrl = await getPNGImageData(options)
    if (!dataUrl) return null
    return dataURLToBlob(dataUrl)
  } catch (error) {
    console.error('获取 PNG Blob 失败:', error)
    return null
  }
}

// 暴露方法
defineExpose({
  getSaveData,
  getGraph,
  dagPageRef,
  // 图片导出方法
  getPNGImageData,
  getPNGImageBlob,
  getPDFImageData,
  dataURLToBlob
})

// 初始化
onMounted(async () => {
  console.log('IndicatorDagEditor 初始化完成')
})
</script>

<style scoped>
.indicator-dag-editor {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow: hidden;
  flex-direction: column;
}

.dag-content {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

/* 确保容器自适应 */
:deep(.page) {
  width: 100%;
  height: 100%;
}

:deep(.container) {
  height: 100%;
}

:deep(.center) {
  height: 100%;
}

:deep(.graph) {
  height: calc(100% - 42px);
}

.xflow-context-menu .menu-item {
  color: #000 !important;
}
</style>
