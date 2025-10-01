<template>
  <div class="example-container">
    <h2>DashboardGrid 示例 - 拖拽画布</h2>
    <p>从下面的组件调色板拖拽组件到画布中</p>

    <!-- 图表库面板 -->
    <LibraryPanels @chart-select="handleChartSelect" @chart-drag="handleChartDrag" />

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button v-if="panels.length > 0" @click="clearAll" type="warning">清空全部</el-button>
      <el-button @click="exportLayout" type="primary">导出布局</el-button>

      <!-- 评估结果API测试按钮 -->
      <div class="api-test-buttons">
        <el-button @click="fetchEvaluationResult('1')" type="success" :loading="loading">
          获取基础评估结果
        </el-button>
        <el-button
          @click="fetchDynamicEvaluationResult('combat', '2')"
          type="info"
          :loading="loading"
        >
          获取作战场景结果
        </el-button>
        <el-button
          @click="fetchDynamicEvaluationResult('defense', '3')"
          type="warning"
          :loading="loading"
        >
          获取防御场景结果
        </el-button>
        <el-button
          v-if="panels.length > 0 && evaluationData"
          @click="updatePanelsData"
          type="primary"
        >
          更新面板数据
        </el-button>
      </div>
    </div>
    <!-- 空白画布 -->
    <div class="canvas-area">
      <DashboardGrid
        :panels="panels"
        :isEditable="true"
        @panel-added="handlePanelAdded"
        @panel-removed="handlePanelRemoved"
        @layout-changed="handleLayoutChanged"
        @edit-panel="openEditPane"
      />

      <!-- 空状态提示 -->
      <div v-if="panels.length === 0" class="empty-state">
        <div class="empty-content">
          <i class="el-icon-box"></i>
          <h3>空白画布</h3>
          <p>从上方组件调色板拖拽组件到此处开始布局</p>
        </div>
      </div>
    </div>

    <!-- 页面级 EditPane 抽屉 -->
    <EditPane
      v-model="showEditPane"
      :panel-data="editingPanelData"
      :mode="editMode"
      @confirm="handleEditConfirm"
      @cancel="handleEditCancel"
      @reset="handleEditReset"
    />

    <!-- 布局导出区域 -->
    <div v-if="exportedLayout" class="export-area">
      <h3>导出的布局配置：</h3>
      <textarea v-model="exportedLayout" readonly @click="selectAll"></textarea>
      <p v-if="copyHint" class="copy-hint">已复制到剪贴板</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { getEvaluationResultById } from '@/api/modules/evaluation'
import DashboardGrid from '../index.vue'
import LibraryPanels from '../LibraryPanels/index.vue'
import EditPane from '../EditPane/index.vue'
import {
  transformToLineChart,
  transformToPieChart
} from '../../../../utils/evaluationDataProcessor'

export default {
  name: 'DashboardGridExample',
  components: {
    DashboardGrid,
    LibraryPanels,
    EditPane
  },
  setup() {
    const panels = ref([])
    const showEditPane = ref(false)
    const editMode = ref('edit')
    const editingPanelData = reactive({
      title: '',
      description: '',
      transparentBackground: false,
      width: 400,
      height: 300
    })
    const exportedLayout = ref('')
    const copyHint = ref(false)

    // 评估结果数据状态
    const evaluationData = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const activeCollapse = ref(['1'])

    // 处理面板添加（拖拽添加）
    const handlePanelAdded = (newPanel) => {
      console.log('Panel added:', newPanel)

      // 如果有评估数据，自动将数据传递给新添加的面板
      if (evaluationData.value && newPanel) {
        // 为新面板设置数据
        if (typeof newPanel.setData === 'function') {
          // 如果是 PanelModel 实例，使用 setData 方法
          newPanel.setData(evaluationData.value)
        } else {
          // 如果是普通对象，直接设置 metadata
          if (!newPanel.metadata) {
            newPanel.metadata = {}
          }
          newPanel.metadata.data = JSON.stringify(evaluationData.value)
        }
        console.log('数据已传递给面板:', newPanel.id)
      }

      panels.value.push(newPanel)
    }

    // 处理面板移除
    const handlePanelRemoved = (panelId) => {
      const index = panels.value.findIndex((p) => p.id === panelId)
      if (index !== -1) {
        panels.value.splice(index, 1)
      }
    }

    // 处理布局变化
    const handleLayoutChanged = (layout) => {
      console.log('Layout changed:', layout)
      // 可以在这里保存布局到本地存储或发送到服务器
    }

    // 打开编辑抽屉（来自 DashboardGrid 的 edit-panel 事件）
    const openEditPane = (panel) => {
      editMode.value = 'edit'
      editingPanelData.title = panel?.title || ''
      editingPanelData.description = panel?.description || ''
      editingPanelData.transparentBackground = !!panel?.transparentBackground
      // 可选：把当前 panel 的宽高传入（若有统一定义）
      editingPanelData.width = panel?.gridPos?.w ? panel.gridPos.w * 50 : 400
      editingPanelData.height = panel?.gridPos?.h ? panel.gridPos.h * 50 : 300
      showEditPane.value = true
    }

    const handleEditConfirm = (formData) => {
      // 这里仅作演示：找到一个面板并更新其标题等；实际项目应根据 panelId 定位
      if (panels.value.length > 0) {
        const p = panels.value[0]
        p.title = formData.title
        p.description = formData.description
        p.transparentBackground = formData.transparentBackground
        // 也可以更新宽高信息（如果需要的话）
        // p.width = formData.width
        // p.height = formData.height
      }
      showEditPane.value = false
    }

    const handleEditCancel = () => {
      showEditPane.value = false
    }

    const handleEditReset = () => {}

    // 清空所有面板
    const clearAll = () => {
      panels.value = []
      exportedLayout.value = ''
    }

    // 导出布局配置
    const exportLayout = async () => {
      const layoutConfig = {
        panels: panels.value.map((panel) => ({
          id: panel.id,
          type: panel.type,
          widget: panel.widget,
          title: panel.title,
          description: panel.description,
          color: panel.color,
          gridPos: panel.gridPos
        }))
      }
      const text = JSON.stringify(layoutConfig, null, 2)
      exportedLayout.value = text

      try {
        await navigator.clipboard.writeText(text)
        copyHint.value = true
        setTimeout(() => (copyHint.value = false), 1500)
      } catch (err) {
        console.warn('Failed to copy to clipboard:', err)
        copyHint.value = false
      }
    }

    // 选中所有文本
    const selectAll = (event) => {
      event.target.select()
    }

    // 处理图表选择
    const handleChartSelect = (chart) => {
      console.log('Chart selected:', chart)
      // 可以在这里处理图表选择逻辑，比如显示图表详情等
    }

    // 处理图表拖拽
    const handleChartDrag = ({ event, chart }) => {
      console.log('Chart drag started:', chart)
      // 拖拽逻辑已在LibraryPanels组件中处理
    }

    // 获取评估结果数据
    const fetchEvaluationResult = async (id = '1', scenario = 'default') => {
      const data = await getEvaluationResultById(id, { scenario })
      evaluationData.value = data
    }

    // 获取动态评估结果数据
    const fetchDynamicEvaluationResult = async (scenario = 'default', id = '1') => {
      const data = await getEvaluationResultById(id, { scenario })
      evaluationData.value = data
    }

    // 更新所有面板的数据
    const updatePanelsData = () => {
      if (!evaluationData.value) {
        console.warn('没有可用的评估数据')
        return
      }

      panels.value.forEach((panel) => {
        if (typeof panel.setData === 'function') {
          // 如果是 PanelModel 实例，使用 setData 方法
          panel.setData(evaluationData.value)
        } else {
          // 如果是普通对象，直接设置 metadata
          if (!panel.metadata) {
            panel.metadata = {}
          }
          panel.metadata.data = JSON.stringify(evaluationData.value)
        }
      })

      console.log(`已为 ${panels.value.length} 个面板更新数据`)
      // 可以显示一个成功提示
      ElMessage.success(`已为 ${panels.value.length} 个面板更新数据`)
    }

    // 组件挂载时加载数据
    onMounted(() => {
      fetchEvaluationResult('1')
    })

    return {
      panels,
      exportedLayout,
      copyHint,
      evaluationData,
      loading,
      error,
      activeCollapse,
      handlePanelAdded,
      handlePanelRemoved,
      handleLayoutChanged,
      clearAll,
      exportLayout,
      selectAll,
      showEditPane,
      editMode,
      editingPanelData,
      openEditPane,
      handleEditConfirm,
      handleEditCancel,
      handleEditReset,
      handleChartSelect,
      handleChartDrag,
      fetchEvaluationResult,
      fetchDynamicEvaluationResult,
      updatePanelsData
    }
  }
}
</script>

<style scoped>
/* import index.scss */
.example-container {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.action-buttons {
  display: flex;
  margin: 20px 0;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.api-test-buttons {
  display: flex;
  gap: 10px;
  margin-left: 20px;
  flex-wrap: wrap;
}

.evaluation-result-section {
  padding: 20px;
  margin-top: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.evaluation-result-section h3 {
  margin: 0 0 15px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.result-display {
  margin-top: 15px;
}

.result-collapse {
  margin-top: 15px;
}

.json-display {
  max-height: 400px;
  padding: 15px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.4;
  word-break: break-all;
  white-space: pre-wrap;
  background: #f5f5f5;
  border-radius: 4px;
}

.canvas-area {
  position: relative;
  min-height: 500px;
  background: #fafbfc;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
}

.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
  align-items: center;
  justify-content: center;
}

/* .empty-content {
  text-align: center;
  color: #909399;
} */

.empty-content i {
  display: block;
  margin-bottom: 16px;
  font-size: 48px;
}

.empty-content h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 500;
}

.empty-content p {
  margin: 0;
  font-size: 14px;
}

.export-area {
  padding: 16px;
  margin-top: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.export-area h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #303133;
}

.export-area textarea {
  width: 100%;
  height: 200px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  resize: vertical;
}

.copy-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #67c23a;
}

h2 {
  margin-bottom: 10px;
  color: #303133;
}

p {
  margin-bottom: 20px;
  color: #606266;
}
</style>
