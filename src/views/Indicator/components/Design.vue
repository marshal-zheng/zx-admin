<template>
  <ZxFlexView v-if="useFlexView" column class="indicator-system-design" :height="contentHeight">
    <IndicatorDagEditor
      :algo-type="algoType"
      ref="editorRef"
      :key="refreshKey"
      :list-data="fetchBaseIndicatorList"
      :graph-data="testGraphData"
      :is-show-side-nav="isShowSideNav"
      :is-show-toolbar="isShowToolbar"
      :show-save-btn="showSaveBtn"
      :is-editable="isEditable"
      :exportXmindHandler="exportXmindHandler"
      @save="handleSave"
      @click-save="handleSaveClick"
      @edit-node="handleEditNode"
      @delete-node="handleDeleteNode"
    >
      <!-- 仍保留插槽，避免破坏外部自定义，但内置按钮已可用 -->
      <template #toolbar-right></template>
    </IndicatorDagEditor>
  </ZxFlexView>
  <div v-else class="indicator-system-design h-full">
    <IndicatorDagEditor
      :exportXmindHandler="exportXmindHandler"
      :algo-type="algoType"
      ref="editorRef"
      :key="refreshKey"
      :list-data="fetchBaseIndicatorList"
      :graph-data="testGraphData"
      :is-show-side-nav="isShowSideNav"
      :is-show-toolbar="isShowToolbar"
      :show-save-btn="showSaveBtn"
      :is-editable="isEditable"
      @save="handleSave"
      @click-save="handleSaveClick"
      @edit-node="handleEditNode"
      @delete-node="handleDeleteNode"
    >
      <template #toolbar-right></template>
    </IndicatorDagEditor>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import IndicatorDagEditor from './IndicatorDagEditor.vue'
import graphDataJson from '../data.json'
import { useAppStore } from '@/store/modules/app'
import { getEvaluaBaseList } from '@/api/modules/evaluation'
import { systemApi } from '@/api/modules/indicator/system'

defineOptions({ name: 'IndicatorDesign' })

const props = defineProps({
  // 体系ID，如果有ID则从接口获取数据
  id: {
    type: [String, Number],
    default: null
  },
  showSaveBtn: {
    type: Boolean,
    default: true
  },
  graphData: {
    type: [Object, Function],
    default: () => graphDataJson
  },
  isShowSideNav: {
    type: Boolean,
    default: true
  },
  isShowToolbar: {
    type: Boolean,
    default: true
  },
  isEditable: {
    type: Boolean,
    default: true
  },
  algoType: {
    type: Number,
    default: null
  },
  // 是否使用 ZxFlexView 包裹
  useFlexView: {
    type: Boolean,
    default: true
  },
  // 创建模式时需要的数据
  formData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'edit-node', 'delete-node'])

// 编辑器引用
const editorRef = ref(null)
const refreshKey = ref(0)

// 从接口获取的基础指标数据
const baseIndicatorList = ref([])

// 体系详情数据
const systemDetailData = ref(null)

const exportXmindHandler = () => {
  // 导出xmaind
  console.log('导出xmaind')
}

// 获取体系详情
const fetchSystemDetail = async (evaluaId) => {
  const res = await systemApi.getSystemDetail(evaluaId)
  return res
}

// 测试用的图数据 - 根据 id 动态获取或使用默认数据
const testGraphData = computed(() => {
  // 如果有 id，返回异步函数从接口获取数据
  if (props.id) {
    return async () => {
      const detail = await fetchSystemDetail(props.id)
      if (detail?.detailContent) {
        try {
          // detailContent 是 JSON 字符串，需要解析
          const graphData = JSON.parse(detail.detailContent)
          return graphData
        } catch (error) {
          return { nodes: [], edges: [] }
        }
      }
      return { nodes: [], edges: [] }
    }
  }

  // 没有 id，返回空数据或使用传入的 graphData
  if (props.graphData && props.graphData !== graphDataJson) {
    return props.graphData
  }

  // 默认返回空数据
  return { nodes: [], edges: [] }
})

const appStore = useAppStore()

const showTagsView = computed(() => appStore.getTagsView)
const showFooter = computed(() => appStore.getFooter)

const contentHeight = computed(() => {
  const segments = ['100dvh', '- var(--top-tool-height)']

  if (showTagsView.value) {
    segments.push('- var(--tags-view-height)')
  }

  if (showFooter.value) {
    segments.push('- var(--app-footer-height)')
  }

  segments.push('- var(--app-content-padding)')

  if (!showFooter.value) {
    segments.push('- var(--app-content-padding)')
  }

  return `calc(${segments.join(' ')})`
})

// 获取基础指标列表
const fetchBaseIndicatorList = async () => {
  const res = await getEvaluaBaseList({
    pageNumber: 1,
    pageSize: 999
  })
  return res?.records
  console.log('res', res?.records || [])
  // baseIndicatorList.value = res?.records || []
}

// 事件处理函数
const handleSave = (graphData) => {
  emit('save', graphData)
}

const handleEditNode = (node) => {
  emit('edit-node', node)
}

const handleDeleteNode = (node) => {
  emit('delete-node', node)
}

// 保存按钮点击处理
const handleSaveClick = async () => {
  if (!editorRef.value?.getSaveData) {
    return
  }

  const graphData = editorRef.value.getSaveData()
  if (!graphData) {
    ElMessage.warning('请先编辑图表内容')
    return
  }

  try {
    // 将图数据转换为 JSON 字符串
    const detailContent = JSON.stringify(graphData)

    if (props.id) {
      // 编辑模式：获取详情数据，更新 detailContent
      const detail = await fetchSystemDetail(props.id)
      if (!detail) {
        ElMessage.error('获取体系详情失败')
        return
      }

      // 合并数据
      const updateData = {
        ...detail,
        detailContent,
        id: props.id
      }

      await systemApi.updateSystem(updateData)
      ElMessage.success('保存成功')
      // 编辑模式下保存成功后，不再 emit save 事件，避免重复调用
    } else {
      // 创建模式：调用创建接口
      // 检查必填字段
      if (!props.formData.evaluaName) {
        ElMessage.warning('请填写体系名称')
        return
      }
      if (!props.formData.clazzId) {
        ElMessage.warning('请选择指标分类')
        return
      }

      const createData = {
        clazzId: props.formData.clazzId,
        evaluaName: props.formData.evaluaName,
        evaluaExpplain: props.formData.evaluaExpplain || '',
        evaluaTemplate: props.formData.evaluaTemplate || 0,
        tagId: props.formData.tagId || [],
        detailContent
      }

      const result = await systemApi.createSystem(createData)
      // 创建成功后触发 save 事件，传递结果数据
      emit('save', result)
    }
  } catch (error) {
    console.error('保存失败：', error)
    ElMessage.error(error?.message || '保存失败')
  }
}
</script>

<style scoped>
.indicator-system-design {
  overflow: hidden;
}

.test-editor {
  display: flex;
  min-height: 0;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  flex: 1;
  flex-direction: column;
}

.indicator-system-design :deep(.indicator-dag-editor) {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.indicator-system-design :deep(.zx-dag-page) {
  height: 100%;
}

.indicator-system-design :deep(.zx-dag-page .dag-container) {
  height: 100%;
}
</style>
