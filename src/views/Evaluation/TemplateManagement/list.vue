<template>
  <ContentWrap>
    <ZxGridList
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
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleCreate">新建模版</ZxButton>
          </div>
          <div class="zx-grid-form-bar__filters">
            <SelectStatus
              v-model="query.status"
              placeholder="选择状态"
              style="width: 150px"
              @change="(v) => onFilterChange('status', v, { refresh, updateState })"
            />
            <EvaluationSchemeSelector
              v-model="query.evaluationScheme"
              placeholder="评估方案"
              style="width: 150px; margin-left: 12px"
              @change="(v) => onFilterChange('evaluationScheme', v, { refresh, updateState })"
            />
            <EvaluationAlgorithmSelector
              v-model="query.evaluationAlgorithm"
              placeholder="评估算法"
              style="width: 150px; margin-left: 12px"
              @change="(v) => onFilterChange('evaluationAlgorithm', v, { refresh, updateState })"
            />
            <IndicatorSystemSelector
              v-model="query.indicatorSystem"
              placeholder="指标体系"
              style="width: 150px; margin-left: 12px"
              @change="(v) => onFilterChange('indicatorSystem', v, { refresh, updateState })"
            />
          </div>
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
          <el-table-column prop="name" label="模版名称" min-width="200" />
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
                <ZxButton link type="primary" @click="viewDetail(row)">设计</ZxButton>
                <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                <ZxButton link type="primary" @click="handleCopy(row)">复制</ZxButton>
                <ZxButton link type="danger" @click="handleDelete(row, refresh)">删除</ZxButton>
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
import { templateApi } from '@/api/modules/evaluation/template'
import ZxGridList from '@/components/pure/ZxGridList/index.vue'
import TemplateFormDialog from './components/TemplateFormDialog.vue'
import { ZxSearch, ZxButton } from '@/components/pure'
import EvaluationSchemeSelector from '@/components/business/Selector/EvaluationSchemeSelector.vue'
import EvaluationAlgorithmSelector from '@/components/business/Selector/EvaluationAlgorithmSelector.vue'
import IndicatorSystemSelector from '@/components/business/Selector/IndicatorSystemSelector.vue'
import SelectStatus from './components/selector/SelectStatus.vue'

const { t } = useI18n()
const router = useRouter()

// 添加组件初始化调试
onMounted(() => {
  console.log('=== Template Management List 组件已挂载 ===')
  console.log('ZxGridList 组件:', ZxGridList)
  console.log('loadTemplateData 函数:', loadTemplateData)
})

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
  try {
    const data = await templateApi.getTemplateList(params)
    console.log('=== Template API 返回数据 ===', data)
    return data
  } catch (error) {
    console.error('=== loadTemplateData 错误 ===', error)
    throw error
  }
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

// 复制
const handleCopy = (row) => {
  currentTemplate.value = { ...row, id: null, name: `${row.name}_副本` }
  dialogMode.value = 'create'
  dialogVisible.value = true
}

// 获取 ZxConfirmInput 服务
const { proxy } = getCurrentInstance()

// 删除模版
const handleDelete = async (row, refresh) => {
  await proxy.$confirmInput.danger({
    targetName: row.name,
    targetType: '模版',
    keyword: row.name,
    dangerMessage: `您即将删除模版"${row.name}"`,
    description: '此操作不可恢复，请输入模版名称以确认删除。',
    confirmAction: async () => {
      // 调用删除API
      return templateApi.deleteTemplate(row.id).then(() => {
        refresh()
      })
    }
  })
}

// 表单成功回调
const handleFormSuccess = () => {
  dialogVisible.value = false
  // 刷新列表会通过 ZxGridList 的 refresh 方法处理
}
</script>

<style lang="scss" scoped></style>
