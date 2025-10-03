<template>
  <ContentWrap>
    <ZxGridList
      :load-data="loadDataSourceData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="data-connection-grid zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh: handleRefresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleAdd">新增数据源</ZxButton>
          </div>
          <div class="zx-grid-form-bar__filters">
            <SelectDataSourceType
              v-model="query.baseType"
              placeholder="数据源类型"
              style="width: 150px"
              @change="(v) => onFilterChange('baseType', v, { handleRefresh, updateState })"
            />
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索数据源名称"
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
        <el-table :data="grid.list" style="width: 100%">
          <el-table-column prop="baseName" label="数据源名称" min-width="150" />
          <el-table-column prop="baseIp" label="IP地址" width="120" />
          <el-table-column prop="basePort" label="端口" width="80" />
          <el-table-column prop="baseDataName" label="数据库名称" min-width="120" />
          <el-table-column prop="baseUser" label="用户名" width="100" />
          <el-table-column prop="baseType" label="数据源类型" width="120">
            <template #default="{ row }">
              <zx-tag type="primary">{{ getDatabaseTypeName(row.baseType) }}</zx-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleTableQuery(row.baseId)"
                  >查看表</ZxButton
                >
                <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                <ZxButton link type="danger" @click="handleDelete(row.baseId, handleRefresh)"
                  >删除</ZxButton
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 数据源表单弹窗 -->
    <DataSourceFormDialog ref="dataSourceFormDialogRef" @success="handleFormSuccess" />
  </ContentWrap>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import DataSourceFormDialog from './components/DataSourceFormDialog.vue'
import { SelectDataSourceType } from '../components/selector'
import { confirmInputDanger } from 'zxui'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'
import { getDatabaseTypeName } from '../components/utils'

// 路由
const router = useRouter()

// 组件引用
const dataSourceFormDialogRef = ref()

// 数据加载函数 - 适配 ZxGridList
const loadDataSourceData = async (params) => {
  const response = await dataConnectionApi.getDataSourceList(params)
  return response
}

// 筛选和搜索处理
const onFilterChange = (field, value, { handleRefresh, updateState }) => {
  updateState('pager.page', 1)

  // 使用 nextTick 确保状态更新后再刷新
  nextTick(() => {
    handleRefresh()
  })
}

const onSearch = ({ handleRefresh, updateState }) => {
  updateState('pager.page', 1)
  handleRefresh()
}

// 事件处理
const handleAdd = () => {
  // 调用子组件的 open 方法，不传数据表示新增
  dataSourceFormDialogRef.value?.open()
}

const handleEdit = (row) => {
  // 调用子组件的 open 方法，传递数据表示编辑
  dataSourceFormDialogRef.value?.open(row)
}

const handleFormSuccess = () => {
  // 刷新列表会通过 ZxGridList 的 refresh 方法处理
}

const handleTableQuery = (dataSourceId) => {
  router.push(`/data-preprocessing/data-connection/table-query/${dataSourceId}`)
}

const handleDelete = async (baseId, handleRefresh) => {
  try {
    await confirmInputDanger({
      targetName: '数据源',
      targetType: '数据源',
      keyword: '确认删除',
      dangerMessage: '您即将删除该数据源',
      description: '此操作不可恢复,请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await dataConnectionApi.deleteDataSource(baseId)
        if (result.code === '200' || result.success) {
          ElMessage.success('删除成功')
          handleRefresh()
        } else {
          throw new Error(result.msg || result.message || '删除失败')
        }
      }
    })
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}
</script>

<style lang="scss" scoped></style>
