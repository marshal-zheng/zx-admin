<template>
  <DashboardDesigner
    ref="designerRef"
    :title="pageTitle"
    v-model:panels="panels"
    :isEditable="!isViewMode"
    @panel-added="handlePanelAdded"
    @panel-removed="handlePanelRemoved"
    @layout-changed="handleLayoutChanged"
    @edit-open="handleEditOpen"
    @edit-confirm="handleEditConfirm"
    @edit-cancel="handleEditCancel"
    @save="handleDashboardSave"
  >
    <template #header-actions>
      <ZxButton
        v-if="!isViewMode"
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
        v-if="!isViewMode"
        @click="handleSaveData"
        type="success"
        :tooltip="{
          type: 'popover',
          title: '保存说明',
          content: '保存当前仪表盘的所有面板配置和布局信息',
          placement: 'left'
        }"
      >
        保存数据
      </ZxButton>
    </template>
  </DashboardDesigner>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { ElMessage } from 'element-plus'
import DashboardDesigner from '@/components/business/DashboardGrid/DashboardDesigner.vue'
import { dashboardApi } from '@/api/modules/evaluation/dashboard'
import mockData from './mock'

const STORAGE_KEY = 'dashboard-design-data'

const router = useRouter()
const route = useRoute()
const designerRef = ref(null)
const panels = ref([])

// 评估结果数据状态（用于拖拽数据传递）
const evaluationData = ref(null)

// 当前模式和ID
const dashboardId = computed(() => route.params.id)
const isEditMode = computed(() => route.name === 'DashboardEdit')
const isViewMode = computed(() => route.name === 'DashboardView')
const pageTitle = computed(() => {
  if (isViewMode.value) return '查看仪表盘'
  if (isEditMode.value) return '编辑仪表盘'
  return '新建仪表盘'
})

// 路由守卫：离开页面前清除 sessionStorage
// 注意：刷新页面时这个守卫不会触发，所以数据会保留
onBeforeRouteLeave((to, from, next) => {
  console.log('离开仪表盘设计页，清除 sessionStorage')
  sessionStorage.removeItem(STORAGE_KEY)
  next()
})

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

// 加载仪表盘配置
const loadDashboardConfig = async () => {
  if (!dashboardId.value) return

  try {
    // 优先从 sessionStorage 读取数据
    const cachedData = sessionStorage.getItem(STORAGE_KEY)
    let dashboardData = null

    if (cachedData) {
      try {
        dashboardData = JSON.parse(cachedData)
        console.log('从 sessionStorage 加载仪表盘数据:', dashboardData)
      } catch (error) {
        console.error('解析 sessionStorage 数据失败:', error)
      }
    }

    // 如果 sessionStorage 中没有数据，则从 API 获取
    if (!dashboardData) {
      dashboardData = await dashboardApi.getDashboardDetail(dashboardId.value)
      console.log('从 API 加载仪表盘数据:', dashboardData)
    }

    // 解析 config 字段
    if (dashboardData && dashboardData.config) {
      try {
        const config = JSON.parse(dashboardData.config)
        // 加载面板数据
        if (config.panels && Array.isArray(config.panels)) {
          panels.value = config.panels
        }
      } catch (error) {
        console.error('解析仪表盘配置失败:', error)
        ElMessage.error('加载仪表盘配置失败')
      }
    }
  } catch (error) {
    console.error('加载仪表盘失败:', error)
    ElMessage.error('加载仪表盘失败')
  }
}

// 保存最终数据
const handleSaveData = async () => {
  try {
    const snapshot = designerRef.value?.save?.()
    if (!snapshot) {
      ElMessage.warning('未能获取仪表盘数据，请稍后重试')
      return
    }

    console.log('保存的仪表盘数据:', snapshot)

    // 构造保存数据
    const saveData = {
      schemeName: `仪表盘_${new Date().toLocaleDateString()}`,
      schemeDescribe: `包含 ${snapshot.panels.length} 个面板的仪表盘配置`,
      type: 1, // 默认类型：基础面板
      config: JSON.stringify(snapshot) // 将仪表盘配置转为 JSON 字符串
    }

    // 调用API保存或更新
    if (isEditMode.value && dashboardId.value) {
      saveData.id = dashboardId.value
      await dashboardApi.updateDashboard(saveData)
      ElMessage.success('更新成功')
    } else {
      await dashboardApi.createDashboard(saveData)
      ElMessage.success(`已保存 ${snapshot.panels.length} 个面板的完整布局数据`)
    }

    // 保存成功后返回列表页
    setTimeout(() => {
      router.push('/evaluation-result/dashboard')
    }, 1000)
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('保存仪表盘失败:', error)
  }
}

// 初始化
onMounted(() => {
  loadDashboardConfig()
})

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
}

// 处理面板移除
const handlePanelRemoved = (panelId) => {
  console.log('Panel removed:', panelId)
}

// 处理布局变化
const handleLayoutChanged = (layout) => {
  console.log('Layout changed:', layout)
  // 可保存布局变化
}

const handleEditOpen = (panel) => {
  console.log('Edit open for panel:', panel?.id)
}

const handleEditConfirm = ({ panel, formData }) => {
  console.log('Edit confirm:', panel?.id, formData)
}

const handleEditCancel = () => {
  console.log('Edit cancelled')
}

const handleDashboardSave = (snapshot) => {
  console.log('Dashboard save emit:', snapshot)
}
</script>
