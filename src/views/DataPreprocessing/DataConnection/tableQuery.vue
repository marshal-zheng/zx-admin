<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadTableData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="20"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="table-query-grid"
    >
      <!-- 工具栏：左-操作 | 中-数据源信息 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState, grid }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__filters"> </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索表名称"
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
          <el-table-column prop="tableName" label="表名称" min-width="200" show-overflow-tooltip />
          <el-table-column
            prop="tableComment"
            label="表注释"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column prop="rowCount" label="数据行数" width="120" align="right">
            <template #default="{ row }">
              <span v-if="row.rowCount !== undefined">{{ formatNumber(row.rowCount) }}</span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" show-overflow-tooltip />
          <el-table-column
            label="操作"
            width="200"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleViewData(row)">查看数据</ZxButton>
                <ZxButton link type="info" @click="handleImportToLocal(row)"
                  >导入本地数据库</ZxButton
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 表数据查看弹窗 -->
    <TableDataDialog
      v-model="tableDataDialogVisible"
      :data-source-id="dataSourceId"
      :table-name="currentTableName"
    />
  </ContentWrap>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { ZxButton, ZxSearch } from '@/components/pure'
import { Icon } from '@/components/Icon'
import ZxGridList from '@/components/pure/ZxGridList/index.vue'
import TableDataDialog from './components/TableDataDialog.vue'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const gridListRef = ref()
const tableDataDialogVisible = ref(false)
const currentTableName = ref('')
const dataSourceInfo = ref(null)

// 从路由参数获取数据源ID
const dataSourceId = computed(() => route.params.id || route.query.dataSourceId)

// 数据加载函数 - 适配 ZxGridList
const loadTableData = async (params) => {
  console.log('=== 查询表列表 ===', { dataSourceId: dataSourceId.value, params })

  // 构建查询参数
  const queryParams = {
    pageNumber: params.current || 1,
    pageSize: params.size || 20
  }

  // 添加搜索关键词
  if (params.keyword) {
    queryParams.tableName = params.keyword
  }

  const response = await dataConnectionApi.getTableNames(dataSourceId.value, queryParams)
  console.log('=== 表列表 API 返回数据 ===', response)

  return response
}

// 搜索处理
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '-'
  return new Intl.NumberFormat('zh-CN').format(num)
}

const handleViewData = (row) => {
  currentTableName.value = row.tableName
  tableDataDialogVisible.value = true
}

const handleImportToLocal = async (row) => {
  try {
    const params = {
      id: dataSourceId.value,
      tableName: row.tableName
    }

    console.log('=== 导入本地数据库 ===', params)

    await dataConnectionApi.migrationToLocalHost(params)

    ElMessage.success(`表 "${row.tableName}" 已成功导入到本地数据库`)
  } catch (error) {
    console.error('导入本地数据库失败:', error)
    ElMessage.error(`导入表 "${row.tableName}" 失败: ${error.message || '未知错误'}`)
  }
}
</script>

<style lang="scss" scoped>
.data-source-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .info-text {
    color: var(--el-text-color-regular);
    font-size: 14px;
  }

  .table-count {
    color: var(--el-text-color-regular);
    font-size: 14px;
    margin-left: 8px;
  }
}

.op-col__wrap {
  display: flex;
  gap: 8px;
}
</style>
