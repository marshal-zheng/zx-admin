<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadDashboardData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="dashboard-grid zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 右-搜索 -->
      <template #form="{ query, loading, refresh: handleRefresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleAdd">新建仪表盘</ZxButton>
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索仪表盘名称"
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
          <el-table-column prop="schemeName" label="配置名称" min-width="200" />
          <el-table-column
            prop="schemeDescribe"
            label="配置描述"
            min-width="300"
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
                <ZxButton link type="primary" @click="handleView(row)">查看</ZxButton>
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
import { dashboardApi } from '@/api/modules/evaluation/dashboard'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const router = useRouter()

// 组件引用
const gridListRef = ref(null)

// 数据加载函数 - 适配 ZxGridList
const loadDashboardData = async (params) => {
  const response = await dashboardApi.getDashboardList(params)
  console.log('response', response)
  return response
}

const onSearch = ({ handleRefresh, updateState }) => {
  updateState('pager.page', 1)
  handleRefresh()
}

// 新建仪表盘
const handleAdd = () => {
  // 清除可能存在的旧数据
  sessionStorage.removeItem('dashboard-design-data')
  router.push('/evaluation-result/dashboard-create')
}

// 编辑仪表盘
const handleEdit = (row) => {
  // 将当前行数据存入 sessionStorage
  sessionStorage.setItem('dashboard-design-data', JSON.stringify(row))
  router.push(`/evaluation-result/dashboard-edit/${row.id}`)
}

// 查看详情
const handleView = (row) => {
  // 将当前行数据存入 sessionStorage
  sessionStorage.setItem('dashboard-design-data', JSON.stringify(row))
  router.push(`/evaluation-result/dashboard-view/${row.id}`)
}

// 获取仪表盘类型标签样式
const getDashboardTypeTag = (type) => {
  const tagMap = {
    1: 'primary',
    2: 'success',
    3: 'warning'
  }
  return tagMap[type] || 'info'
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
const handleMoreActionSelect = async (item, row, handleRefresh) => {
  switch (item.eventTag) {
    case 'delete':
      handleDelete(row.id, handleRefresh)
      break
    default:
      break
  }
}

// 删除仪表盘
const handleDelete = async (dashboardId, handleRefresh) => {
  try {
    await ElMessageBox.confirm(
      '您即将删除该仪表盘，此操作不可恢复！',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    const result = await dashboardApi.deleteDashboard(dashboardId)
    handleRefresh()
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}
</script>

<style lang="scss" scoped></style>
