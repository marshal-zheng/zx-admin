<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadOperatorData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="operator-grid zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 右-搜索 -->
      <template #form="{ query, loading, refresh: handleRefresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleAdd">新增算子</ZxButton>
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索算子名称"
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
          <el-table-column prop="operatorName" label="名称" min-width="200" />
          <el-table-column prop="operatorType" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getOperatorTypeTag(row.operatorType)">
                {{ getOperatorTypeName(row.operatorType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="operatorDesc"
            label="描述"
            min-width="300"
            show-overflow-tooltip
          />
          <el-table-column prop="algorithmType" label="算法类型" width="120" />
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
import { operatorApi } from '@/api/modules/indicator/operator'
import { confirmInputDanger } from '@zxio/zxui'
import { ElMessage } from 'element-plus'
import { Delete, View } from '@element-plus/icons-vue'

const router = useRouter()

// 组件引用
const gridListRef = ref(null)

// 数据加载函数 - 适配 ZxGridList
const loadOperatorData = async (params) => {
  try {
    const data = await operatorApi.getOperatorList(params)
    console.log('=== Operator API 返回数据 ===', data)
    return data
  } catch (error) {
    console.error('=== loadOperatorData 错误 ===', error)
    throw error
  }
}

const onSearch = ({ handleRefresh, updateState }) => {
  updateState('pager.page', 1)
  handleRefresh()
}

// 新建算子
const handleAdd = () => {
  // TODO: 实现新建算子功能
  ElMessage.info('新建算子功能开发中...')
}

// 编辑算子
const handleEdit = (row) => {
  // TODO: 实现编辑算子功能
  ElMessage.info('编辑算子功能开发中...')
}

// 查看详情
const handleView = (row) => {
  // TODO: 实现查看算子详情功能
  ElMessage.info('查看算子详情功能开发中...')
}

// 获取算子类型名称
const getOperatorTypeName = (type) => {
  const typeMap = {
    1: '数据处理',
    2: '计算分析',
    3: '模型训练',
    4: '结果输出'
  }
  return typeMap[type] || '未知类型'
}

// 获取算子类型标签样式
const getOperatorTypeTag = (type) => {
  const tagMap = {
    1: 'primary',
    2: 'success',
    3: 'warning',
    4: 'info'
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

// 删除算子
const handleDelete = async (operatorId, handleRefresh) => {
  try {
    await confirmInputDanger({
      targetName: '算子',
      targetType: '算子',
      keyword: '确认删除',
      dangerMessage: '您即将删除该算子',
      description: '此操作不可恢复,请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await operatorApi.deleteOperator(operatorId)
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