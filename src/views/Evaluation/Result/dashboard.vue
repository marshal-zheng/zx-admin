<template>
  <ContentWrap>
    <!-- 加载状态 -->
    <el-skeleton v-if="loading" animated :rows="8" />

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-result icon="error" title="加载失败" :sub-title="error">
        <template #extra>
          <ZxButton type="primary" @click="loadDashboardData">重新加载</ZxButton>
        </template>
      </el-result>
    </div>

    <!-- 仪表盘设计器 -->
    <DashboardDesigner
      v-else
      ref="designerRef"
      :title="dashboardTitle"
      :is-editable="false"
      :panels="dashboardPanels"
      :use-content-wrap="false"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import DashboardDesigner from '@/components/business/DashboardGrid/DashboardDesigner.vue'
import { evaluationApi } from '@/api/modules/evaluation'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 数据状态
const loading = ref(false)
const error = ref('')
const dashboardData = ref<any>(null)
const designerRef = ref<InstanceType<typeof DashboardDesigner> | null>(null)
const evaluationChartData = ref<any>(null)

// 计算属性
const dashboardTitle = computed(() => {
  if (dashboardData.value) {
    return dashboardData.value.schemeName || '评估结果仪表盘'
  }
  return '评估结果仪表盘'
})

const dashboardPanels = ref<any[]>([])

// 更新所有面板的数据
const updateAllPanelsData = () => {
  if (!evaluationChartData.value) {
    console.warn('没有可用的图表数据')
    return
  }

  dashboardPanels.value.forEach((panel) => {
    if (typeof panel.setData === 'function') {
      // 如果是 PanelModel 实例，使用 setData 方法
      panel.setData(evaluationChartData.value)
    } else {
      // 如果是普通对象，直接设置 metadata
      if (!panel.metadata) {
        panel.metadata = {}
      }
      panel.metadata.data = JSON.stringify(evaluationChartData.value)
    }
  })

  console.log(`✅ 已为 ${dashboardPanels.value.length} 个面板更新图表数据`)
}

// 加载图表数据
const loadChartData = async (schemeResultId: string) => {
  try {
    console.log('=== 开始加载图表数据 ===')
    console.log('评估结果ID:', schemeResultId)

    // 调用接口获取图表数据
    const response = await evaluationApi.getLineData(schemeResultId)
    console.log('图表数据接口返回:', response)

    if (response) {
      evaluationChartData.value = response
      console.log('✅ 图表数据加载成功')

      // 等待面板渲染完成后更新数据
      await nextTick()
      updateAllPanelsData()
    } else {
      console.warn('❌ 图表数据为空')
    }
  } catch (err: any) {
    console.error('❌ 加载图表数据失败:', err)
    ElMessage.warning('加载图表数据失败: ' + (err.message || '未知错误'))
  }
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = '缺少必要的参数ID'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('=== 开始加载仪表盘数据 ===')
    console.log('评估结果ID:', id)

    const response = await evaluationApi.getSchemeResult(id)
    console.log('接口返回数据:', response)

    if (response) {
      dashboardData.value = response
      console.log('仪表盘ID:', response.id)
      console.log('仪表盘名称:', response.schemeName)

      // 解析 config 配置数据
      if (response.config) {
        console.log('Config类型:', typeof response.config)
        console.log('Config原始数据:', response.config)

        try {
          // 如果 config 是字符串，需要解析为 JSON
          const config =
            typeof response.config === 'string' ? JSON.parse(response.config) : response.config

          console.log('解析后的config:', config)
          console.log('config.panels数量:', config.panels?.length || 0)

          // 设置面板数据
          if (config.panels && Array.isArray(config.panels)) {
            dashboardPanels.value = config.panels
            console.log('✅ 成功设置面板数据，共', config.panels.length, '个')
          } else if (Array.isArray(config)) {
            dashboardPanels.value = config
            console.log('✅ 成功设置面板数据（数组格式），共', config.length, '个')
          } else {
            console.warn('❌ 配置数据格式不正确:', config)
            dashboardPanels.value = []
          }
        } catch (parseError) {
          console.error('❌ 解析配置数据失败:', parseError)
          error.value = '仪表盘配置数据格式错误'
        }
      } else {
        console.warn('❌ response.config为空')
        dashboardPanels.value = []
      }

      // 加载完面板配置后，加载图表数据并更新面板
      if (dashboardPanels.value.length > 0) {
        await loadChartData(id)
      }
    } else {
      console.error('❌ 接口返回数据为空')
      error.value = '未获取到仪表盘数据'
    }
  } catch (err: any) {
    console.error('❌ 加载仪表盘数据失败:', err)
    error.value = err.message || '加载仪表盘数据失败，请稍后重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
    console.log('=== 仪表盘数据加载完成 ===')
    console.log('最终panels数量:', dashboardPanels.value.length)
  }
}

// 返回列表
const handleBack = () => {
  router.push({
    name: 'EvaluationResultManagement'
  })
}

// 组件挂载时加载数据
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped lang="scss">
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.error-container {
  padding: 40px 0;
}
</style>
