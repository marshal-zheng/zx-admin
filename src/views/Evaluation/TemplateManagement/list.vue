<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadTemplateData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="template-grid"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left"></div>
          <div class="zx-grid-form-bar__filters"> </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索模版名称/ID"
              :loading="loading"
              search-mode="click"
              @search="() => onSearch({ refresh, updateState })"
              @clear="() => onSearch({ refresh, updateState })"
            />
          </div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #table="{ grid, refresh }">
        <el-table :data="grid.list" style="width: 100%" max-height="calc(100vh - 230px)">
          <el-table-column prop="taskName" label="模版名称" min-width="200" />
          <el-table-column prop="type" label="模版类型" width="120">
            <template #default="{ row }">
              {{ getTypeText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="scenario" label="适用场景" width="120">
            <template #default="{ row }">
              {{ getScenarioText(row.scenario) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column
            label="操作"
            width="200"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="viewDetail(row)">查看详情</ZxButton>
                <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                <ZxMoreAction
                  :list="getMoreActionList(row)"
                  @select="handleMoreActionSelect($event, row, refresh)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 模版表单弹窗 -->
    <TemplateFormDialog
      v-model="dialogVisible"
      :template-data="currentTemplate"
      :mode="dialogMode"
      @success="handleFormSuccess"
    />
  </ContentWrap>
</template>

<script setup>
// Vue 3 API 和 Element Plus 组件现在通过 unplugin-auto-import 自动导入
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { evaluationApi } from '@/api/modules/evaluation'
import TemplateFormDialog from './components/TemplateFormDialog.vue'
import EvaluationSchemeSelector from '@/components/business/Selector/EvaluationSchemeSelector.vue'
import EvaluationAlgorithmSelector from '@/components/business/Selector/EvaluationAlgorithmSelector.vue'
import IndicatorSystemSelector from '@/components/business/Selector/IndicatorSystemSelector.vue'
import SelectStatus from './components/selector/SelectStatus.vue'
import { Delete } from '@element-plus/icons-vue'
import { confirmInputDanger } from '@zxio/zxui'

const { t } = useI18n()
const router = useRouter()

// 组件引用
const gridListRef = ref(null)

// 响应式数据
const dialogVisible = ref(false)
const currentTemplate = ref(null)
const dialogMode = ref('create') // create | edit | view

// 状态映射
const statusMap = {
  draft: { text: '草稿', type: 'info' },
  active: { text: '启用', type: 'success' },
  inactive: { text: '停用', type: 'warning' },
  archived: { text: '归档', type: 'danger' }
}

// 类型映射
const typeMap = {
  comprehensive: '综合评估',
  performance: '绩效评估',
  risk: '风险评估',
  quality: '质量评估'
}

// 场景映射
const scenarioMap = {
  project: '项目评估',
  personnel: '人员评估',
  system: '系统评估',
  process: '流程评估'
}

// 数据加载函数 - 适配 ZxGridList
const loadTemplateData = async (params) => {
  const data = await evaluationApi.getEvaluationList({
    ...params,
    taskTemplate: 1
  })
  return data
}

// 工具函数
const getStatusText = (status) => statusMap[status]?.text || '未知'
const getStatusType = (status) => statusMap[status]?.type || 'info'
const getTypeText = (type) => typeMap[type] || '未知'
const getScenarioText = (scenario) => scenarioMap[scenario] || '未知'

const onFilterChange = (field, value, { refresh, updateState }) => {
  console.log('=== onFilterChange 触发 ===')
  console.log(`筛选字段: ${field}, 选择的值:`, value)
  // 页码重置到第一页
  updateState('pager.page', 1)

  // 使用 nextTick 确保状态更新后再刷新
  nextTick(() => {
    refresh()
  })
}

const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 查看详情
const viewDetail = (row) => {
  router.push({
    name: 'TemplateDetail',
    params: { id: row.id }
  })
}

// 新建
const handleCreate = () => {
  currentTemplate.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  currentTemplate.value = row
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

// 获取更多操作列表
const getMoreActionList = (row) => {
  return [
    {
      label: '删除',
      eventTag: 'delete',
      icon: Delete,
      danger: true
    }
  ]
}

// 处理更多操作选择
const handleMoreActionSelect = async (item, row, refresh) => {
  switch (item.eventTag) {
    case 'delete':
      handleDelete(row, refresh)
      break
    default:
      break
  }
}

// 获取 ZxConfirmInput 服务
const instance = getCurrentInstance()
const { proxy } = instance || {}

// 添加调试信息
onMounted(() => {})

// 删除模版
const handleDelete = async (row, refresh) => {
  try {
    // 方案1: 尝试使用全局服务
    if (proxy?.$confirmInput) {
      await proxy.$confirmInput.danger({
        targetName: row.taskName,
        targetType: '模版',
        keyword: row.taskName,
        dangerMessage: `您即将删除模版"${row.taskName}"`,
        description: '此操作不可恢复，请输入模版名称以确认删除。',
        confirmAction: async () => {
          return evaluationApi.deleteEvaluation(row.id).then(() => {
            refresh()
          })
        }
      })
    } else {
      // 方案2: 使用直接导入的服务
      console.warn('⚠️ 使用备用方案：直接导入服务')
      await confirmInputDanger({
        targetName: row.taskName,
        targetType: '模版',
        keyword: row.taskName,
        dangerMessage: `您即将删除模版"${row.taskName}"`,
        description: '此操作不可恢复，请输入模版名称以确认删除。',
        confirmAction: async () => {
          return evaluationApi.deleteEvaluation(row.id).then(() => {
            refresh()
          })
        }
      })
    }
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}

// 表单成功回调
const handleFormSuccess = () => {
  dialogVisible.value = false
  // 刷新列表
  gridListRef.value?.refresh()
}
</script>
