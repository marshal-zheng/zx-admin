<template>
  <ContentWrap>
    <ZxGridList
      :load-data="loadEvaluationData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="evaluation-grid"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleCreate">新建评估</ZxButton>
          </div>
          <div class="zx-grid-form-bar__filters">
            <SelectStatus
              v-model="query.status"
              placeholder="选择状态"
              style="width: 150px"
              @change="(v) => onFilterChange(v, { refresh, updateState })"
            />
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索评估名称/ID"
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
        <el-table :data="grid.list || []" style="width: 100%" max-height="calc(100vh - 230px)">
          <!-- <el-table-column prop="id" label="ID" width="80" /> -->
          <el-table-column prop="name" label="评估名称" min-width="200" />
          <el-table-column prop="type" label="评估类型" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="progress" label="进度" width="120">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :stroke-width="8" />
            </template>
          </el-table-column>
          <el-table-column prop="score" label="评分" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column
            label="操作"
            width="180"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="viewDetail(row)">查看</ZxButton>
                <!-- 另存为模版 -->
                <ZxButton link type="primary" @click="handleSaveAsTemplate(row)"
                  >另存为模版</ZxButton
                >
                <ZxButton link type="danger" @click="handleDelete(row, refresh)">删除</ZxButton>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>
  </ContentWrap>

  <!-- 任务创建向导 -->
  <TaskWizard v-model="showTaskWizard" @success="handleWizardSuccess" />
</template>

<script setup>
// Vue 3 API 和 Element Plus 组件现在通过 unplugin-auto-import 自动导入
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { evaluationApi } from '@/api/modules/evaluation'
import SelectStatus from './components/selector/SelectStatus.vue'
import TaskWizard from './components/TaskWizard.vue'

const { t } = useI18n()

// 控制任务向导显示
const showTaskWizard = ref(false)

// 数据加载函数 - 适配 ZxGridList
const loadEvaluationData = async (params) => {
  try {
    const data = await evaluationApi.getEvaluationList(params)
    console.log('=== API 返回数据 ===', data)
    return data
  } catch (error) {
    console.error('=== loadEvaluationData 错误 ===', error)
    throw error
  }
}

// 状态类型映射
const getStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    running: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return typeMap[status] || 'info'
}

// 状态文本映射
const getStatusText = (status) => {
  const textMap = {
    pending: '待执行',
    running: '执行中',
    completed: '已完成',
    failed: '失败'
  }
  return textMap[status] || '未知'
}

// 查看详情
const viewDetail = (row) => {
  console.log('查看评估详情:', row.name)
}

// 另存为模版
const handleSaveAsTemplate = (row) => {
  console.log('另存为模版:', row.name)
}

// actions in toolbar
const handleCreate = () => {
  console.log('新建评估')
  showTaskWizard.value = true
}

// 向导完成后的回调
const handleWizardSuccess = () => {
  console.log('任务创建成功，刷新列表')
  // 这里可以刷新列表
}

const onFilterChange = (value, { refresh, updateState }) => {
  console.log('=== onFilterChange 触发 ===')
  console.log('选择的状态值:', value)
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

// 获取 ZxConfirmInput 服务
const { proxy } = getCurrentInstance()

// 删除评估任务
const handleDelete = async (row, refresh) => {
  await proxy.$confirmInput.danger({
    targetName: row.name,
    targetType: '评估任务',
    keyword: row.name,
    dangerMessage: `您即将删除评估任务"${row.name}"`,
    description: '此操作不可恢复，请输入评估任务名称以确认删除。',
    confirmAction: async () => {
      // 调用删除API
      return evaluationApi.deleteEvaluation(row.id).then(() => {
        refresh()
      })
    }
  })
}
</script>

<style scoped></style>
