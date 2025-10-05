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
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getDashboardTypeTag(row.type)">
                {{ getDashboardTypeName(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
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
import { dashboardApi } from '@/api/modules/evaluation/dashboard'
import { confirmInputDanger } from 'zxui'
import { ElMessage } from 'element-plus'
import { Delete, View } from '@element-plus/icons-vue'

const router = useRouter()

// 组件引用
const gridListRef = ref(null)

// 数据加载函数 - 适配 ZxGridList
const loadDashboardData = async (params) => {
  try {
    const data = await dashboardApi.getDashboardList(params)
    console.log('=== Dashboard API 返回数据 ===', data)
    return data
  } catch (error) {
    console.error('=== loadDashboardData 错误 ===', error)
    throw error
  }
}

const onSearch = ({ handleRefresh, updateState }) => {
  updateState('pager.page', 1)
  handleRefresh()
}

// 新建仪表盘
const handleAdd = () => {
  ElMessage.info('新建仪表盘功能开发中...')
}

// 编辑仪表盘
const handleEdit = (row) => {
  ElMessage.info('编辑仪表盘功能开发中...')
}

// 查看详情
const handleView = (row) => {
  ElMessage.info('查看仪表盘详情功能开发中...')
}

// 获取仪表盘类型名称
const getDashboardTypeName = (type) => {
  const typeMap = {
    1: '基础面板',
    2: '高级面板',
    3: '自定义面板'
  }
  return typeMap[type] || '未知类型'
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
      label: '查看',
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

// 删除仪表盘
const handleDelete = async (dashboardId, handleRefresh) => {
  try {
    await confirmInputDanger({
      targetName: '仪表盘',
      targetType: '仪表盘',
      keyword: '确认删除',
      dangerMessage: '您即将删除该仪表盘',
      description: '此操作不可恢复,请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await dashboardApi.deleteDashboard(dashboardId)
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