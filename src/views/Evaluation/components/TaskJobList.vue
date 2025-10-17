<template>
  <div class="task-job-list">
    <!-- <div class="section-title mb-20px">评估方案</div> -->
    <ZxGridList
      :load-data="loadTaskJobData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="task-job-grid"
    >
      <!-- 工具栏：左-操作 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState, grid }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="onCreatePlan">添加方案</ZxButton>
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索方案名称/方法ID"
              :loading="loading"
              search-mode="click"
              @search="() => onSearch({ refresh, updateState })"
              @clear="() => onSearch({ refresh, updateState })"
            />
          </div>
        </div>
      </template>
      <!-- 表格内容 -->
      <template #table="{ grid }">
        <el-table :data="grid.list || []" style="width: 100%" stripe>
          <el-table-column
            prop="taskJobName"
            label="方案名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="methodId" label="方法ID" width="120" />
          <el-table-column prop="evaluateTime" label="评估时间" width="180" />
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleViewPlan(row)">查看方案</ZxButton>
                <template v-if="props.templateId">
                  <ZxButton link type="danger" @click="handleDelete(row, grid.refresh)"
                    >删除</ZxButton
                  >
                </template>
                <template v-else>
                  <ZxButton link type="primary" @click="handleRunJob(row)">运行</ZxButton>
                  <ZxMoreAction
                    :list="getMoreActionList(row)"
                    @select="handleMoreActionSelect($event, row, grid.refresh)"
                  />
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { evaluationApi } from '@/api/modules/evaluation'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  },
  templateId: {
    type: String,
    default: ''
  }
})

// 数据加载函数 - 适配 ZxGridList
const loadTaskJobData = async (params) => {
  try {
    // 调用接口获取任务详情，传入分页参数和搜索关键词
    const requestParams = {
      id: props.taskId,
      page: params.page || 1,
      size: params.size || 10,
      keyword: params.keyword || ''
    }

    const response = await evaluationApi.getEvaluationDetail(requestParams)
    console.log('获取评估方案数据:', response)

    // 从响应中提取 zhpgEvaluaTaskJobs 数据
    // zhpgEvaluaTaskJobs 是一个数组，第一个元素包含分页数据
    const jobsData = response?.zhpgEvaluaTaskJobs?.[0] || {}

    // 返回符合 ZxGridList 格式的数据
    return {
      list: jobsData.records || [],
      total: jobsData.total || 0,
      page: jobsData.current || params.page || 1,
      size: jobsData.size || params.size || 10
    }
  } catch (error) {
    console.error('加载评估方案数据失败:', error)
    return {
      list: [],
      total: 0,
      page: params.page || 1,
      size: params.size || 10
    }
  }
}

// 搜索处理函数
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 查看方案
const handleViewPlan = (row) => {
  console.log('查看方案:', row)
  ElMessage.info('查看方案功能开发中...')
  // TODO: 实现查看方案功能
}

// 运行作业
const handleRunJob = async (row) => {
  let loadingMessage
  // 显示加载提示
  loadingMessage = ElMessage({
    message: '正在执行运行方案...',
    type: 'info',
    duration: 0
  })

  // 第一步：获取SQL数据
  const sqlData = await evaluationApi.getJobSqlData(row.id)

  // 从响应中提取 data 字段（根据图片显示的数据结构）
  const parametersData = sqlData.data || []

  return evaluationApi
    .executeTrans(row.id, {
      parameters: parametersData
    })
    .then(async () => {
      // 关闭加载提示
      loadingMessage.close()
      await nextTick()

      ElMessage({
        message: '运行成功，即将跳转到"评估结果管理"列表页面',
        type: 'success',
        duration: 2000
      })

      // 延迟跳转，让用户看到成功消息
      console.log('准备跳转页面')
      setTimeout(() => {
        router.push({
          name: 'EvaluationResultManagement'
        })
      }, 2000)
    })
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

// 删除方案
const handleDelete = (row, handleRefresh) => {
  console.log('删除方案:', row)
  ElMessage.info('删除功能开发中...')
  // TODO: 实现删除方案功能
}

// 处理更多操作选择
const handleMoreActionSelect = async (action, row, handleRefresh) => {
  switch (action.eventTag) {
    case 'delete':
      handleDelete(row, handleRefresh)
      break
    default:
      break
  }
}

// 获取路由
const router = useRouter()

// 添加方案按钮点击 - 跳转到向导页面
const onCreatePlan = () => {
  router.push({
    name: 'TaskWizard',
    query: { taskId: props.taskId }
  })
}
</script>

<style scoped lang="less">
.task-job-list {
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .mb-20px {
    margin-bottom: 20px;
  }
}

.op-col__wrap {
  display: flex;
  gap: 8px;
}
</style>
