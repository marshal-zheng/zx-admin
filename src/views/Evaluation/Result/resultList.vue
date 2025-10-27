<template>
  <ContentWrap>
    <!-- 导出报告对话框 -->
    <ExportReportDialog ref="exportDialogRef" @success="handleExportSuccess" />

    <ZxGridList
      ref="gridListRef"
      :load-data="loadResultData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="result-grid"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <!-- <ZxButton type="primary" @click="handleExportBatch">批量导出</ZxButton> -->
          </div>
          <div class="zx-grid-form-bar__filters">
            <el-date-picker
              v-model="query.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="(v) => onFilterChange('dateRange', v, { refresh, updateState })"
            />
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索任务名称/方案名称/评估对象"
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
        <el-table
          :data="grid.list || []"
          style="width: 100%"
          max-height="calc(100vh - 230px)"
          empty-text="暂无数据"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="taskName" label="任务名称" min-width="180" show-overflow-tooltip />
          <el-table-column prop="scheme" label="方案名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="object" label="评估对象" min-width="150" show-overflow-tooltip />
          <el-table-column prop="process" label="评估方法" min-width="150" show-overflow-tooltip />
          <el-table-column prop="createTime" label="评估时间" width="180" />
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="viewDetail(row)">查看仪表盘</ZxButton>
                <ZxButton link type="primary" @click="handleExport(row)">导出报告</ZxButton>
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
  </ContentWrap>
</template>

<script setup>
// Vue 3 API 和 Element Plus 组件现在通过 unplugin-auto-import 自动导入
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { evaluationApi } from '@/api/modules/evaluation'
import { Download, Delete, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ExportReportDialog } from '../components'

const { t } = useI18n()

// 获取路由
const router = useRouter()

// 组件引用
const gridListRef = ref(null)

// 数据加载函数 - 适配 ZxGridList
const loadResultData = async (params) => {
  // 处理日期范围参数
  if (params.dateRange && params.dateRange.length === 2) {
    params.startDate = params.dateRange[0]
    params.endDate = params.dateRange[1]
    delete params.dateRange
  }

  // 设置 taskTemplate 参数为 0（获取评估结果，非模板）
  params.taskTemplate = 0

  // 调用评估列表接口
  const response = await evaluationApi.getEvaluationList(params)
  console.log('评估结果列表响应:', response)
  response.records = response.records.filter(item => item.taskName !== '评估任务')
  return response
}

// 筛选变化
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

// 搜索
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 查看详情 - 跳转到仪表盘页面
const viewDetail = (row) => {
  console.log('查看评估结果仪表盘:', row.id)
  // 跳转到仪表盘页面
  router.push({
    name: 'EvaluationResultDashboard',
    params: {
      id: row.id
    }
  })
}

// 导出对话框引用
const exportDialogRef = ref(null)

// 导出单个报告
const handleExport = async (row) => {
  console.log('准备导出报告，评估结果数据:', row)

  // 打开导出对话框，传递所有必需的参数
  exportDialogRef.value?.open({
    taskId: row.id, // 评估任务编号（评估结果的ID就是任务ID）
    taskName: row.taskName || row.object || '评估结果', // 任务名称
    resultId: row.id, // 评估结果编号（与任务ID相同）
    jobId: row.id // 方案编号（暂时使用任务ID）
  })
}

// 批量导出
const handleExportBatch = () => {
  ElMessage.info('批量导出功能开发中...')
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
    case 'viewReport':
      handleViewReport(row)
      break
    case 'downloadData':
      handleDownloadData(row)
      break
    case 'delete':
      handleDelete(row, refresh)
      break
    default:
      break
  }
}

// 查看报告
const handleViewReport = (row) => {
  router.push({
    name: 'EvaluationReport',
    params: {
      id: row.id
    }
  })
}

// 下载原始数据
const handleDownloadData = async (row) => {
  try {
    ElMessage.info('正在准备下载...')
    // 调用下载API
    // await evaluationApi.downloadResultData(row.id)
    setTimeout(() => {
      ElMessage.success('下载成功')
    }, 1000)
  } catch (error) {
    ElMessage.error('下载失败')
    console.error('下载失败:', error)
  }
}

// 删除评估结果
const handleDelete = async (row, refresh) => {
  try {
    const targetName = row.taskName || row.object || row.id
    await ElMessageBox.confirm(
      `您即将删除评估结果"${targetName}"，此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 调用删除评估任务API（评估结果使用同一个接口）
    await evaluationApi.deleteEvaluation(row.id)
    refresh()
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 导出成功回调
const handleExportSuccess = (data) => {
  console.log('导出成功:', data)
}
</script>

<style scoped lang="scss">
.op-col__wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
