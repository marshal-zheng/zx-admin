<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
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
            <ZxButton type="primary" @click="handleCreate">新建评估任务</ZxButton>
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
        <el-table
          :data="grid.list || []"
          style="width: 100%"
          max-height="calc(100vh - 230px)"
          empty-text="暂无数据"
        >
          <el-table-column
            prop="taskName"
            label="评估任务名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="taskDescribe"
            label="评估任务描述"
            min-width="250"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
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
  </ContentWrap>

  <!-- 评估任务表单弹窗 -->
  <TaskFormDialog ref="taskFormDialogRef" @success="handleFormSuccess" />
</template>

<script setup>
// Vue 3 API 和 Element Plus 组件现在通过 unplugin-auto-import 自动导入
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { evaluationApi } from '@/api/modules/evaluation'
import SelectStatus from './components/selector/SelectStatus.vue'
import TaskFormDialog from '../components/TaskFormDialog.vue'
import { Setting, Delete } from '@element-plus/icons-vue'
import { confirmInputDanger } from '@zxio/zxui'

const { t } = useI18n()

// 获取路由
const router = useRouter()

// 组件引用
const gridListRef = ref(null)
const taskFormDialogRef = ref()

// 数据加载函数 - 适配 ZxGridList
const loadEvaluationData = async (params) => {
  const response = await evaluationApi.getEvaluationList(params)
  return response
}

// 查看详情
const viewDetail = (row) => {
  console.log('查看评估详情:', row.taskDescribe || row.id)
  // 跳转到详情页面
  router.push({
    name: 'EvaluationDetail',
    params: {
      id: row.id
    }
  })
}

// 编辑任务 - 弹出编辑弹窗
const handleEdit = (row) => {
  taskFormDialogRef.value?.open(row)
}

// 另存为模版
const handleSaveAsTemplate = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要将评估任务"${row.taskDescribe || row.id}"设为模版吗？`,
      '设为模版',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    // 调用设为模版API
    await evaluationApi.setAsTemplate(row.id)
    ElMessage.success('设为模版成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('设为模版失败')
      console.error('设为模版失败:', error)
    }
  }
}

// actions in toolbar
const handleCreate = () => {
  taskFormDialogRef.value?.open('create')
}

// 表单提交成功后的回调：刷新列表
const handleFormSuccess = () => {
  gridListRef.value?.refresh()
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

// 获取更多操作列表
const getMoreActionList = (row) => {
  return [
    {
      label: '设为模版',
      eventTag: 'setTemplate',
      icon: Setting
    },
    {
      isDivider: true
    },
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
    case 'setTemplate':
      handleSaveAsTemplate(row)
      break
    case 'delete':
      handleDelete(row, refresh)
      break
    default:
      break
  }
}

// 删除评估任务
const handleDelete = async (row, refresh) => {
  try {
    await confirmInputDanger({
      targetName: row.taskName,
      targetType: '评估任务',
      keyword: row.taskName,
      dangerMessage: `您即将删除评估任务"${row.taskName}"`,
      description: '此操作不可恢复，请输入评估任务名称以确认删除。',
      confirmAction: async () => {
        // 调用删除API
        return evaluationApi.deleteEvaluation(row.id).then(() => {
          refresh()
        })
      }
    })
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}
</script>
