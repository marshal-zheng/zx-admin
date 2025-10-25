<template>
  <ZxDialog
    v-bind="dialogProps"
    v-on="dialogEvents"
    :loading="loading"
    class="dashboard-preview-dialog"
  >
    <div class="h-full">
      <!-- Mock 数据提示 -->
      <el-alert
        v-if="panels.length > 0"
        type="info"
        :closable="false"
        show-icon
        class="mock-data-alert"
      >
        <template #title>
          <span class="alert-title">
            <el-icon class="mr-1"><InfoFilled /></el-icon>
            当前展示的是 Mock 数据，仅用于预览仪表盘布局和图表效果
          </span>
        </template>
      </el-alert>

      <DashboardDesigner
        v-if="panels.length > 0"
        ref="designerRef"
        :title="dashboardName"
        v-model:panels="panels"
        :isEditable="false"
        :use-content-wrap="false"
      />
      <ElEmpty v-else description="暂无面板数据" :image-size="200" />
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import DashboardDesigner from '@/components/business/DashboardGrid/DashboardDesigner.vue'
import { dashboardApi } from '@/api/modules/evaluation/dashboard'
import { ElMessage } from 'element-plus'
import { useDialog } from '@zxio/zxui'
import mockData from '@/views/Evaluation/Dashboard/mock'

defineOptions({ name: 'DashboardPreviewDialog' })

const loading = ref(false)
const designerRef = ref(null)
const panels = ref([])
const dashboardName = ref('')
const evaluationData = ref(null)

// 使用 useDialog hook
const {
  dialogProps,
  dialogEvents,
  open: openDialog,
  close: closeDialog
} = useDialog({
  title: (data) => data?.name || '仪表盘预览',
  width: '80%',
  fullscreen: true,
  showFooter: false,
  closeOnClickModal: false,
  defaultData: () => ({ dashboardId: '', config: null, name: '' })
})

// 更新所有面板的数据（应用 Mock 数据）
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

  console.log(`已为 ${panels.value.length} 个面板应用 Mock 数据`)
}

// 应用 Mock 数据
const applyMockData = () => {
  evaluationData.value = mockData
  updateAllPanelsData()
  console.log('Mock 数据已应用于预览', mockData)
}

// 直接使用传入的 config
const loadConfigDirectly = (config) => {
  try {
    let parsedConfig = config

    // 如果 config 是字符串，需要解析
    if (typeof config === 'string') {
      parsedConfig = JSON.parse(config)
    }

    // 加载面板数据
    if (parsedConfig && parsedConfig.panels && Array.isArray(parsedConfig.panels)) {
      panels.value = parsedConfig.panels
    } else {
      panels.value = []
    }

    // 加载完面板后，自动应用 Mock 数据
    nextTick(() => {
      applyMockData()
    })
  } catch (error) {
    console.error('解析仪表盘配置失败:', error)
    ElMessage.error('解析仪表盘配置失败')
    panels.value = []
  }
}

// 通过 dashboardId 加载仪表盘配置
const loadDashboardConfig = async (dashboardId) => {
  if (!dashboardId) return

  try {
    loading.value = true
    const dashboardData = await dashboardApi.getDashboardDetail(dashboardId)

    // 解析 config 字段
    if (dashboardData && dashboardData.config) {
      try {
        const config = JSON.parse(dashboardData.config)
        dashboardName.value = dashboardData.schemeName || '仪表盘预览'
        // 加载面板数据
        if (config.panels && Array.isArray(config.panels)) {
          panels.value = config.panels
        } else {
          panels.value = []
        }

        // 加载完面板后，自动应用 Mock 数据
        await nextTick()
        applyMockData()
      } catch (error) {
        console.error('解析仪表盘配置失败:', error)
        ElMessage.error('加载仪表盘配置失败')
        panels.value = []
      }
    }
  } catch (error) {
    console.error('加载仪表盘失败:', error)
    ElMessage.error('加载仪表盘失败')
    panels.value = []
  } finally {
    loading.value = false
  }
}

// 打开弹窗 - 支持通过 dashboardId 或 config 预览
const open = async ({ dashboardId, config, name }) => {
  dashboardName.value = name || '仪表盘预览'
  panels.value = []

  openDialog({ dashboardId, config, name })

  await nextTick()

  try {
    // 如果传入了 config，直接使用 config
    if (config) {
      loadConfigDirectly(config)
    } else if (dashboardId) {
      // 否则通过 dashboardId 加载
      await loadDashboardConfig(dashboardId)
    }
  } catch (error) {
    console.error('加载仪表盘失败:', error)
    closeDialog()
  }
}

// 暴露方法
defineExpose({
  open
})
</script>

<style lang="less" scoped>
.dashboard-preview-dialog {
  :deep(.zx-dialog__body) {
    height: calc(100vh - 120px);
    overflow: hidden;
    padding: 0;
  }
}

.mock-data-alert {
  margin: 12px 12px 0;
  border-radius: 4px;

  .alert-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
  }

  .mr-1 {
    margin-right: 4px;
  }
}
</style>
