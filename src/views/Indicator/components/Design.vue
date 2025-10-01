<template>
  <FlexView column class="indicator-system-design" :height="contentHeight">
    <IndicatorDagEditor
      :algo-type="2"
      ref="editorRef"
      :key="refreshKey"
      :list-data="testListData"
      :graph-data="testGraphData"
      :is-show-side-nav="testConfig.isShowSideNav"
      :is-editable="testConfig.isEditable"
      @save="handleSave"
      @edit-node="handleEditNode"
      @delete-node="handleDeleteNode"
    />
  </FlexView>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import IndicatorDagEditor from './IndicatorDagEditor.vue'
import FlexView from '@/components/pure/FlexView/index.vue'
import { ElMessage } from 'element-plus'
import graphDataJson from '../data.json'
import { useAppStore } from '@/store/modules/app'

// 编辑器引用
const editorRef = ref(null)
const refreshKey = ref(0)

// 测试配置
const testConfig = reactive({
  isShowSideNav: true,
  isEditable: true
})

// 测试用的基础指标数据
const testListData = [
  { name: '用户满意度', value: '衡量用户对产品或服务的满意程度' },
  { name: '系统响应时间', value: '系统处理请求并返回结果的时间' },
  { name: '错误率', value: '系统运行过程中出现错误的比率' },
  { name: '转化率', value: '访问用户中完成目标行为的比率' },
  { name: '活跃用户数', value: '在特定时间段内使用产品的用户数量' }
]

// 测试用的图数据 - 使用静态数据
const testGraphData = graphDataJson

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

// 事件处理函数
const handleSave = (graphData) => {
  console.log('保存图数据:', graphData)
  ElMessage.success('图数据已保存')
}

const handleEditNode = (node) => {
  console.log('编辑节点:', node)
  ElMessage.info(`正在编辑节点: ${node?.getData?.()?.label || '未知节点'}`)
}

const handleDeleteNode = (node) => {
  console.log('删除节点:', node)
  ElMessage.warning(`已删除节点: ${node?.getData?.()?.label || '未知节点'}`)
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
