<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadTaskData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="task-grid zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 右-搜索 -->
      <template #form="{ query, loading, refresh: handleRefresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleAdd">新建评估任务</ZxButton>
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索评估任务"
              :loading="loading"
              search-mode="click"
              @search="() => onSearch({ handleRefresh, updateState })"
              @clear="() => onSearch({ handleRefresh, updateState })"
            />
          </div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #table="{ grid, refresh: handleRefresh }">
        <el-table :data="grid.list" style="width: 100%" max-height="calc(100vh - 230px)">
          <el-table-column prop="object" label="评估对象" min-width="150" />
          <el-table-column prop="purpose" label="评估目的" min-width="150" />
          <el-table-column prop="scheme" label="评估方案" min-width="150" />
          <el-table-column prop="process" label="评估流程" min-width="120" />
          <el-table-column prop="taskType" label="任务类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTaskTypeTag(row.taskType)">
                {{ getTaskTypeName(row.taskType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="taskDescribe"
            label="任务描述"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column
            label="操作"
            width="200"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                <ZxMoreAction
                  :list="getMoreActionList(row)"
                  @select="handleMoreActionSelect($event, row, handleRefresh)"
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
import { ContentWrap } from '@/components/ContentWrap'
import { evaluationResultApi } from '@/api/modules/evaluationResult/task'
import { confirmInputDanger } from 'zxui'
import { ElMessage } from 'element-plus'
import { Delete, View } from '@element-plus/icons-vue'

const router = useRouter()

// 组件引用
const gridListRef = ref(null)

// 数据加载函数 - 适配 ZxGridList
const loadTaskData = async (params) => {
  try {
    const data = await evaluationResultApi.getTaskList(params)
    console.log('=== Task API 返回数据 ===', data)
    return data
  } catch (error) {
    console.error('=== loadTaskData 错误 ===', error)
    throw error
  }
}

const onSearch = ({ handleRefresh, updateState }) => {
  updateState('pager.page', 1)
  handleRefresh()
}

// 新建评估任务
const handleAdd = () => {
  ElMessage.info('新建评估任务功能开发中...')
}

// 编辑评估任务
const handleEdit = (row) => {
  ElMessage.info('编辑评估任务功能开发中...')
}

// 查看详情
const handleView = (row) => {
  ElMessage.info('查看评估任务详情功能开发中...')
}

// 获取任务类型名称
const getTaskTypeName = (type) => {
  const typeMap = {
    0: '基础任务',
    1: '高级任务',
    2: '专家任务'
  }
  return typeMap[type] || '未知类型'
}

// 获取任务类型标签样式
const getTaskTypeTag = (type) => {
  const tagMap = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return tagMap[type] || 'info'
}

// 获取更多操作列表
const getMoreActionList = (row) => {
  return [
    {
      label: '查看详情',
      eventTag: 'view',
      icon: View,
      danger: false
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
const handleMoreActionSelect = async (item, row, handleRefresh) => {
  switch (item.eventTag) {
    case 'view':
      handleView(row)
      break
    case 'delete':
      handleDelete(row.id, handleRefresh)
      break
    default:
      break
  }
}

// 删除评估任务
const handleDelete = async (taskId, handleRefresh) => {
  try {
    await confirmInputDanger({
      targetName: '评估任务',
      targetType: '评估任务',
      keyword: '确认删除',
      dangerMessage: '您即将删除该评估任务',
      description: '此操作不可恢复,请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await evaluationResultApi.deleteTask(taskId)
        handleRefresh()
        ElMessage.success('删除成功')
      }
    })
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}
</script>

<style lang="scss" scoped></style>
