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
      class="table-query-grid zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 中-数据源信息 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState, grid }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__filters"> </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索表名"
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
          <el-table-column
            prop="createTableName"
            label="表名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="tableComment"
            label="表注释"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column prop="createType" label="创建类型" width="120" align="center">
            <template #default="{ row }">
              <span v-if="row.createType === 1" class="text-blue-500">手动创建</span>
              <span v-else-if="row.createType === 2" class="text-green-500">导入创建</span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="handType" label="处理类型" width="120" align="center">
            <template #default="{ row }">
              <span v-if="row.handType === 1" class="text-orange-500">待处理</span>
              <span v-else-if="row.handType === 2" class="text-green-500">已处理</span>
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
                <ZxButton link type="danger" @click="handleDelete(row.createTableId, refresh)">删除</ZxButton>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 表数据查看弹窗 -->
    <TableDataDialog ref="tableDataDialogRef" />
  </ContentWrap>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import TableDataDialog from './TableDataDialog.vue'
import { confirmInputDanger } from 'zxui'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const gridListRef = ref()
const tableDataDialogRef = ref()

// 数据加载函数 - 适配 ZxGridList
const loadTableData = async (params) => {
  const response = await datasetsApi.getDatasetList(params)
  return response
}

// 搜索处理
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

const handleViewData = (row) => {
  tableDataDialogRef.value?.open({
    createTableId: row.createTableId,
    tableName: row.createTableName
  })
}

const handleImportToLocal = async (row) => {
  try {
    const params = {
      createTableId: row.createTableId,
      tableName: row.createTableName
    }

    console.log('=== 导入本地数据库 ===', params)

    await datasetsApi.migrationToLocalHost(params)

    const messageInstance = ElMessage.success({
      message: h('span', [
        `表 "${row.createTableName}" 已成功导入到数据集，`,
        h(
          'a',
          {
            style: { color: 'var(--el-color-primary)', cursor: 'pointer' },
            onClick: () => {
              messageInstance.close()
              router.push({ name: 'DataEntry' })
            }
          },
          '点击查看'
        )
      ]),
      duration: 5000
    })
  } catch (error) {
    ElMessage.error(`导入表 "${row.createTableName}" 失败: ${error.message || '未知错误'}`)
  }
}

const handleDelete = async (createTableId, handleRefresh) => {
  try {
    await confirmInputDanger({
      targetName: '数据集',
      targetType: '数据集',
      keyword: '确认删除',
      dangerMessage: '您即将删除该数据集',
      description: '此操作不可恢复,请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await datasetsApi.deleteDataset(createTableId)
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
