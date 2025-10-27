<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadReportData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="report-grid"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleCreate">新建模板</ZxButton>
          </div>
          <div class="zx-grid-form-bar__filters">
            <SelectTemplateType
              v-model="query.templateType"
              placeholder="模板类型"
              style="width: 150px"
              @change="(v) => onFilterChange('templateType', v, { refresh, updateState })"
            />
            <el-date-picker
              v-model="query.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px; margin-left: 12px"
              @change="(v) => onFilterChange('dateRange', v, { refresh, updateState })"
            />
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索报告名称/评估任务"
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
          <el-table-column type="selection" width="55" />
          <el-table-column
            prop="templateName"
            label="模板名称"
            min-width="300"
            show-overflow-tooltip
          />
          <el-table-column prop="templateType" label="模板类型" width="150" align="center">
            <template #default="{ row }">
              {{ TemplateTypeText[row.templateType] || '未知' }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column
            label="操作"
            width="220"
            fixed="right"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleView(row)">查看</ZxButton>
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
  </ContentWrap>
</template>

<script setup>
// Vue 3 API 和 Element Plus 组件现在通过 unplugin-auto-import 自动导入
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { evaluationApi } from '@/api/modules/evaluation'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { TemplateTypeText } from '@/views/Evaluation/components/model'
import { SelectTemplateType } from '@/views/Evaluation/TemplateManagement/components/selector'

const { t } = useI18n()

// 获取路由
const router = useRouter()

// 组件引用
const gridListRef = ref(null)

// 数据加载函数 - 适配 ZxGridList
const loadReportData = async (params) => {
  // 处理日期范围参数
  if (params.dateRange && params.dateRange.length === 2) {
    params.startDate = params.dateRange[0]
    params.endDate = params.dateRange[1]
    delete params.dateRange
  }

  // 调用API获取数据
  const response = await evaluationApi.getReportTemplateList(params)

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

// 新建模板
const handleCreate = () => {
  ElMessage.info('新建模板功能开发中...')
}

// 查看模板
const handleView = (row) => {
  ElMessage.info(`查看模板: ${row.templateName}`)
}

// 编辑模板
const handleEdit = (row) => {
  ElMessage.info(`编辑模板: ${row.templateName}`)
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
  if (item.eventTag === 'delete') {
    handleDelete(row, refresh)
  }
}

// 删除报告
const handleDelete = async (row, refresh) => {
  try {
    await ElMessageBox.confirm(
      `您即将删除评估报告模板"${row.templateName}"，此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 调用删除API
    // await evaluationApi.deleteReportTemplate(row.id)
    // refresh()
    // ElMessage.success('删除成功')

    // 模拟删除
    await new Promise((resolve) => {
      setTimeout(() => {
        ElMessage.success('删除成功')
        refresh()
        resolve()
      }, 500)
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}
</script>

<style scoped lang="scss">
.op-col__wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
