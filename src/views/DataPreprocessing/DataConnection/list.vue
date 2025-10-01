<template>
  <ContentWrap>
    <ZxGridList
      :load-data="loadDataSourceData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="data-connection-grid"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleAdd">新增数据源</ZxButton>
          </div>
          <div class="zx-grid-form-bar__filters">
            <SelectDataSourceType
              v-model="query.baseType"
              placeholder="数据源类型"
              style="width: 150px"
              @change="(v) => onFilterChange('baseType', v, { refresh, updateState })"
            />
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索数据源名称"
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
        <el-table :data="grid.list" style="width: 100%" max-height="calc(100vh - 230px)">
          <el-table-column prop="baseName" label="数据源名称" min-width="150" />
          <el-table-column prop="baseIp" label="IP地址" width="120" />
          <el-table-column prop="basePort" label="端口" width="80" />
          <el-table-column prop="baseDataName" label="数据库名称" min-width="120" />
          <el-table-column prop="baseUser" label="用户名" width="100" />
          <el-table-column prop="baseType" label="数据源类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.baseType)">{{ getTypeLabel(row.baseType) }}</el-tag>
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
                  >表查询</ZxButton
                >
                <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                <ZxButton link type="danger" @click="handleDelete(row.baseId, refresh)"
                  >删除</ZxButton
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 数据源表单弹窗 -->
    <DataSourceFormDialog
      v-model="formDialogVisible"
      :mode="dialogMode"
      :data-source="currentDataSource"
      @success="handleFormSuccess"
    />

    <!-- 表数据查看弹窗 -->
    <TableDataDialog
      v-model="tableDataDialogVisible"
      :data-source-id="currentDataSourceId"
      :table-name="currentTableName"
    />
  </ContentWrap>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { ZxButton, ZxSearch } from '@/components/pure'
import ZxGridList from '@/components/pure/ZxGridList/index.vue'
import DataSourceFormDialog from './components/DataSourceFormDialog.vue'
import TableDataDialog from './components/TableDataDialog.vue'
import SelectDataSourceType from './components/selector/SelectDataSourceType.vue'
import { danger as confirmInputDanger } from '@/components/pure/ZxConfirmInput/service'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 路由
const router = useRouter()

// 响应式数据
const formDialogVisible = ref(false)
const tableDataDialogVisible = ref(false)
const currentDataSource = ref(null)
const currentDataSourceId = ref(null)
const currentTableName = ref('')
const dialogMode = ref('create') // 对话框模式：'create' 或 'edit'

// 数据加载函数 - 适配 ZxGridList
const loadDataSourceData = async (params) => {
  const response = await dataConnectionApi.getDataSourceList(params)
  console.log('response22', response)
  return response
}

// 表格配置
const columns = []
const searchConfig = {}
const toolbarConfig = {}

// 获取类型标签样式
const getTypeTagType = (type) => {
  return type === 1 ? 'success' : 'primary'
}

// 获取类型标签文本
const getTypeLabel = (type) => {
  return type === 1 ? 'MySql数据库' : '达梦数据库'
}

// 筛选和搜索处理
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

const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 事件处理
const handleAdd = () => {
  dialogMode.value = 'create'
  currentDataSource.value = null
  formDialogVisible.value = true
}

const handleEdit = (row) => {
  dialogMode.value = 'edit'
  currentDataSource.value = row
  formDialogVisible.value = true
}

const handleFormSuccess = () => {
  formDialogVisible.value = false
  // 刷新列表会通过 ZxGridList 的 refresh 方法处理
}

const handleTableQuery = (dataSourceId) => {
  router.push(`/data-preprocessing/data-connection/table-query/${dataSourceId}`)
}

const handleDelete = async (baseId, refresh) => {
  try {
    await confirmInputDanger({
      targetName: '数据源',
      targetType: '数据源',
      keyword: '确认删除',
      dangerMessage: '您即将删除该数据源',
      description: '此操作不可恢复，请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await dataConnectionApi.deleteDataSource(baseId)
        if (result.code === '200' || result.success) {
          ElMessage.success('删除成功')
          refresh()
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
