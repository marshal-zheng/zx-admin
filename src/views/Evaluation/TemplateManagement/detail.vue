<template>
  <ContentWrap title="仪表盘设计器">
    <template #header>
      <div class="header-actions">
        <ZxButton
          @click="applyMockData"
          type="primary"
          :tooltip="{
            type: 'popover',
            title: '提示',
            content: 'Mock数据仅作为展示用途，用于预览图表效果',
            placement: 'left'
          }"
        >
          应用Mock数据
        </ZxButton>

        <ZxButton
          @click="handleSaveData"
          type="success"
          :tooltip="{
            type: 'popover',
            title: '保存说明',
            content: '保存当前仪表盘的所有面板配置和布局信息',
            placement: 'left'
          }"
        >
          <el-icon><DataAnalysis /></el-icon>
          保存数据
        </ZxButton>
      </div>
    </template>

    <!-- 图表库面板 - 悬浮组件 -->
    <LibraryPanels @chart-select="handleChartSelect" @chart-drag="handleChartDrag" />

    <!-- 画布区域 -->
    <div class="canvas-wrapper">
      <div class="canvas-shell">
        <DashboardGrid
          :panels="panels"
          :isEditable="true"
          @panel-added="handlePanelAdded"
          @panel-removed="handlePanelRemoved"
          @layout-changed="handleLayoutChanged"
          @edit-panel="openEditPane"
        />
        <div v-if="panels.length === 0" class="empty-state">
          <div class="empty-inner">
            <el-icon class="empty-icon"><i class="el-icon-box"></i></el-icon>
            <h3>开始构建你的仪表盘</h3>
            <p>从组件调色板拖拽组件到此区域</p>
          </div>
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

    <!-- 编辑模版弹窗 -->
    <TemplateFormDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :template-data="templateDetail"
      mode="edit"
      @success="handleEditSuccess"
    />
  </ContentWrap>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DataAnalysis } from '@element-plus/icons-vue'
import { templateApi } from '@/api/modules/evaluation/template'
import mockData from './mock'

import DashboardGrid from '@/components/business/DashboardGrid/index.vue'
import LibraryPanels from '@/components/business/DashboardGrid/LibraryPanels/index.vue'
import EditPane from '@/components/business/DashboardGrid/EditPane/index.vue'
import TemplateFormDialog from './components/TemplateFormDialog.vue'
import ZxButton from '@/components/pure/ZxButton/index.vue'
import { ContentWrap } from '@/components/ContentWrap'

export default {
  name: 'DashboardGridWithDetailActions',
  props: {
    templateId: {
      type: [String, Number],
      default: null
    },
    showBack: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DashboardGrid,
    LibraryPanels,
    EditPane,
    TemplateFormDialog,
    ZxButton,
    ContentWrap,
    DataAnalysis
  },
  setup(props) {
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

    // 评估结果数据状态（用于拖拽数据传递）
    const evaluationData = ref(null)

    // ========= 模版相关（来自原 detail.vue） =========
    const route = useRoute()
    const router = useRouter()
    const templateDetail = ref(null)
    const dialogVisible = ref(false)
    const statusMap = {
      active: { text: '启用', type: 'success' },
      inactive: { text: '禁用', type: 'info' },
      draft: { text: '草稿', type: 'warning' }
    }
    const getStatusText = (status) => statusMap[status]?.text || '未知'
    const getStatusType = (status) => statusMap[status]?.type || 'info'
    const currentTemplateId = computed(
      () => props.templateId || route.params.id || route.query.id || '1'
    )

    const loadTemplateDetail = async () => {
      if (!currentTemplateId.value) {
        console.warn('No template ID found, skipping API call')
        return
      }

      // try {
      //   const res = await templateApi.getTemplateById(currentTemplateId.value)
      //   templateDetail.value = res.data
      // } catch (error) {
      //   ElMessage.error('加载模板详情失败')
      // }
    }

    // 应用Mock数据
    const applyMockData = () => {
      evaluationData.value = mockData

      // 同时更新所有现有面板的数据
      updateAllPanelsData()

      ElMessage.success(`Mock数据已应用，已为 ${panels.value.length} 个面板更新数据`)
      console.log('Applied mock data:', mockData)
    }

    // 更新所有面板的数据
    const updateAllPanelsData = () => {
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
    }

    // 保存最终数据
    const handleSaveData = async () => {
      // 参考 example 中的导出布局逻辑，收集完整的面板数据
      const dashboardData = {
        // templateId: currentTemplateId.value,
        // templateInfo: templateDetail.value,
        panels: panels.value.map((panel) => ({
          id: panel.id,
          type: panel.type,
          widget: panel.widget, // 保存 widget 信息
          title: panel.title || '',
          description: panel.description || '',
          color: panel.color, // 保存颜色信息
          gridPos: panel.gridPos || {},
          transparentBackground: panel.transparentBackground || false,
          metadata: panel.metadata || {},
          // 如果面板有数据，也一并保存
          data: panel.data || null
        })),
        layout: {
          // 保存布局相关信息
          totalPanels: panels.value.length,
          lastModified: new Date().toISOString()
        }
        // evaluationData: evaluationData.value
      }

      console.log('保存的仪表盘数据:', dashboardData)
      ElMessage.success(`已保存 ${panels.value.length} 个面板的完整布局数据`)
    }

    const handleEditSuccess = () => {
      dialogVisible.value = false
      loadTemplateDetail()
    }

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
      // 可保存布局变化
    }

    // 打开编辑抽屉
    const openEditPane = (panel) => {
      editMode.value = 'edit'
      editingPanelData.title = panel?.title || ''
      editingPanelData.description = panel?.description || ''
      editingPanelData.transparentBackground = !!panel?.transparentBackground
      editingPanelData.width = panel?.gridPos?.w ? panel.gridPos.w * 50 : 400
      editingPanelData.height = panel?.gridPos?.h ? panel.gridPos.h * 50 : 300
      showEditPane.value = true
    }

    const handleEditConfirm = (formData) => {
      if (panels.value.length > 0) {
        const p = panels.value[0]
        p.title = formData.title
        p.description = formData.description
        p.transparentBackground = formData.transparentBackground
      }
      showEditPane.value = false
    }

    const handleEditCancel = () => {
      showEditPane.value = false
    }

    const handleEditReset = () => {}

    // 处理图表选择
    const handleChartSelect = (chart) => {
      // 预留：可打开图表详情抽屉
    }

    // 处理图表拖拽
    const handleChartDrag = ({ event, chart }) => {
      // 预留：可记录使用统计
    }

    // 初始化
    loadTemplateDetail()

    return {
      // 面板相关
      panels,
      handlePanelAdded,
      handlePanelRemoved,
      handleLayoutChanged,
      showEditPane,
      editMode,
      editingPanelData,
      openEditPane,
      handleEditConfirm,
      handleEditCancel,
      handleEditReset,
      handleChartSelect,
      handleChartDrag,
      // 模版操作相关
      templateDetail,
      dialogVisible,
      applyMockData,

      updateAllPanelsData,
      handleSaveData,
      handleEditSuccess,
      getStatusText,
      getStatusType,
      currentTemplateId
    }
  }
}
</script>

<style scoped>
/* 头部操作按钮区域样式 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.back-btn {
  margin-right: 8px;
}

.canvas-wrapper {
  position: relative;
  margin-top: 16px;
}

.canvas-shell {
  position: relative;
  min-height: 520px;
  padding: 8px;
  overflow: hidden;
  background: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: 8px;
  box-sizing: border-box;
}

.empty-state {
  position: absolute;
  display: flex;
  pointer-events: none;
  background: repeating-linear-gradient(
    45deg,
    var(--el-fill-color-lighter) 0,
    var(--el-fill-color-lighter) 6px,
    transparent 6px,
    transparent 12px
  );
  border-radius: 8px;
  opacity: 0.8;
  inset: 0;
  align-items: center;
  justify-content: center;
}

.empty-inner {
  max-width: 260px;
  text-align: center;
}

.empty-inner h3 {
  margin: 12px 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.empty-inner p {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.empty-icon {
  font-size: 34px;
  color: var(--el-text-color-secondary);
}
</style>
