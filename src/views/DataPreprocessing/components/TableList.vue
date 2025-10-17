<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadData"
      :show-pagination="false"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="20"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
    >
      <!-- 工具栏：左-操作 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <zx-button type="primary" @click="handleCreateData">新建表数据</zx-button>
            <zx-button type="plain" @click="handleDataConversion">数据转换</zx-button>
          </div>
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
        >
          <el-table-column
            v-for="field in getTableColumns()"
            :key="field.name"
            :prop="field.name"
            :label="field.comment || field.name"
            :min-width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ formatCellValue(row[field.name]) }}</span>
            </template>
          </el-table-column>
          
          <!-- 操作列 -->
          <el-table-column
            label="操作"
            width="150"
            fixed="right"
          >
            <template #default="{ row, $index }">
              <el-button
                type="primary"
                link
                size="small"
                @click="handleEdit(row, $index)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click="handleDelete(row, $index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 表数据操作弹框 -->
    <TableDataFormDialog
      ref="tableDataFormDialogRef"
      @success="refresh"
    />

    <!-- 数据转换弹框 -->
    <DataConversionDialog
      ref="dataConversionDialogRef"
      @success="refresh"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'
import TableDataFormDialog from './TableDataFormDialog.vue'
import DataConversionDialog from './DataConversionDialog.vue'

// 定义表字段接口
interface TableField {
  name: string
  comment: string
  type: string
}

// 定义 Props
interface Props {
  tableName: string
}

const props = defineProps<Props>()

// 定义事件
const emit = defineEmits(['edit', 'delete'])

// 响应式数据
const gridListRef = ref()
const tableDataFormDialogRef = ref()
const dataConversionDialogRef = ref()
const tableFields = ref<TableField[]>([])

// 计算表格标题
const title = computed(() => {
  return props.tableName ? `表数据 - ${props.tableName}` : '表数据'
})

// 搜索处理
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 获取表格列配置
const getTableColumns = () => {
  return tableFields.value
}

// 加载表字段信息
const loadTableFields = async () => {
  try {
    if (!props.tableName) {
      console.warn('TableList - 表名为空，无法加载字段信息')
      return
    }
    
    console.log('TableList - 加载表字段，表名:', props.tableName)
    const response = await datasetsApi.getTableField(props.tableName)
    console.log('表字段API响应:', response)
    
    // 兼容不同的返回格式
    let fields: TableField[] = []
    if (Array.isArray(response)) {
      fields = response
    } else if (response?.data && Array.isArray(response.data)) {
      fields = response.data
    } else {
      console.warn('未知的字段响应格式:', response)
      fields = []
    }
    
    tableFields.value = fields
    console.log('设置表字段:', tableFields.value)
  } catch (error) {
    console.error('loadTableFields 错误:', error)
    // 如果获取字段失败，使用默认字段
    tableFields.value = []
  }
}

// 数据加载函数
const loadData = async (params) => {
  try {
    console.log('TableList - 加载数据，表名:', props.tableName, '参数:', params)
    
    if (!props.tableName) {
      console.warn('TableList - 表名为空，无法加载数据')
      return {
        list: [],
        total: 0
      }
    }

    // 首先加载表字段信息（如果还没有加载）
    if (tableFields.value.length === 0) {
      await loadTableFields()
    }
    
    // 然后加载表数据
    const response = await datasetsApi.getTableDataByTableName(props.tableName, params)
    console.log('表数据API响应:', response)
    
    // 兼容不同的返回格式
    let list: any[] = []
    if (Array.isArray(response)) {
      list = response
    } else if (response?.data && Array.isArray(response.data)) {
      list = response.data
    } else if (response?.list && Array.isArray(response.list)) {
      list = response.list
    } else {
      console.warn('未知的响应格式:', response)
      list = []
    }
    
    return {
      list: list,
      total: list.length || 0
    }
  } catch (error) {
    console.error('loadData 错误:', error)
    console.error('错误详情:', error instanceof Error ? error.message : String(error))
    throw error
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

// 处理新建表数据
const handleCreateData = () => {
  if (tableDataFormDialogRef.value) {
    tableDataFormDialogRef.value.openCreate(props.tableName)
  }
}

// 处理数据转换
const handleDataConversion = () => {
  if (!props.tableName) {
    ElMessage.warning('请先选择表')
    return
  }
  if (dataConversionDialogRef.value) {
    dataConversionDialogRef.value.open(props.tableName)
  }
}

// 处理编辑
const handleEdit = (row, index) => {
  if (tableDataFormDialogRef.value) {
    tableDataFormDialogRef.value.openEdit(props.tableName, row)
  }
}

// 处理删除
const handleDelete = async (row, index) => {
  try {
    // 获取行标识符，优先使用 id、updateId 或者 name 字段
    const updateId = row.id || row.updateId || row.rowId
    const rowIdentifier = row.name || row.title || `第 ${index + 1} 行`
    
    await ElMessageBox.confirm(
      `您即将删除 '${rowIdentifier}' 的数据，此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await datasetsApi.deleteTableRow({
      updateId: updateId,
      tableName: props.tableName
    })
    ElMessage.success('删除成功')
    refresh()
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}

// 刷新数据
const refresh = () => {
  if (gridListRef.value) {
    gridListRef.value.refresh()
  }
}

// 重新加载表字段和数据
const reload = async () => {
  tableFields.value = [] // 清空字段缓存
  await loadTableFields()
  refresh()
}

// 暴露方法
defineExpose({
  refresh,
  reload,
  loadTableFields
})
</script>
