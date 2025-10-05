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
      <!-- 工具栏：左-返回按钮+标题 | 右-搜索 -->
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
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'

// 定义 Props
interface Props {
  tableName: string
}

const props = defineProps<Props>()

// 响应式数据
const gridListRef = ref()

// 计算表格标题
const title = computed(() => {
  return props.tableName ? `表数据 - ${props.tableName}` : '表数据'
})

// 搜索处理
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

// 数据加载函数
const loadData = async (params) => {
  try {
    const response = await datasetsApi.getTableDataByTableName(props.tableName, params)
    console.log('API 响应完整数据:', response)
    console.log('response.data:', response.data)
    console.log('response 类型:', typeof response)
    console.log('response.data 类型:', typeof response.data)
    console.log('response.data 是否为数组:', Array.isArray(response.data))
    
    return {
      list: response || [],
      total: response?.length || 0
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

// 刷新数据
const refresh = () => {
  if (gridListRef.value) {
    gridListRef.value.refresh()
  }
}

// 暴露方法
defineExpose({
  refresh
})
</script>
