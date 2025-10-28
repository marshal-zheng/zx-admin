<template>
  <ZxDialog
    v-model="state.visible"
    :title="state.title"
    width="70%"
    :show-cancel="true"
    cancel-text="关闭"
    :footer="false"
  >
    <ZxGridList
      :load-data="loadData"
      :show-pagination="false"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="data-connection-grid"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索数据内容"
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
          :data="grid.list"
          style="width: 100%"
          max-height="calc(100vh - 280px)"
          stripe
          border
        >
          <el-table-column
            v-for="key in getTableColumns(grid.list)"
            :key="key"
            :prop="key"
            :label="key"
            :min-width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ formatCellValue(row[key]) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>
  </ZxDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDialog } from '@zxio/zxui'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 定义表数据查看的数据接口
interface TableViewData {
  dataSourceId: string | number
  tableName: string
}

// 定义事件
const emit = defineEmits<{
  success: [data?: any]
}>()

// 使用 useDialog
const {
  state,
  dialogProps,
  dialogEvents,
  open: openDialog,
  close: closeDialog,
  setTitle
} = useDialog<TableViewData>({
  title: '表数据查看',
  width: '70%',
  defaultData: () => ({
    dataSourceId: '',
    tableName: ''
  })
})

// 响应式数据
const gridListRef = ref()
const currentData = ref<TableViewData | null>(null)

const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 获取表格列名
const getTableColumns = (list) => {
  if (!list || list.length === 0) {
    return []
  }
  return Object.keys(list[0])
}

const loadData = async (params) => {
  if (!currentData.value) {
    return { list: [] }
  }

  try {
    const data = await dataConnectionApi.getTableData({
      id: currentData.value.dataSourceId,
      tableName: currentData.value.tableName,
      ...params
    })
    console.log('response', data)
    return { list: data }
  } catch (error) {
    ElMessage.error('获取表数据失败')
    return { list: [] }
  }
}

// 格式化单元格值显示
const formatCellValue = (value) => {
  if (value === null || value === undefined) return '-'
  if (value === '') return '(空)'
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return String(value)
}

// 内部 open 方法
const open = (data: TableViewData) => {
  currentData.value = data
  // 更新对话框标题
  setTitle(`表数据查看 - ${data.tableName}`)
  openDialog()

  // 延迟刷新表格数据
  setTimeout(() => {
    if (gridListRef.value) {
      gridListRef.value.refresh()
    }
  }, 100)
}

// 暴露给父组件的方法
defineExpose({
  open
})
</script>

<style lang="less" scoped>
.table-data-container {
  height: 100%;
}
</style>
