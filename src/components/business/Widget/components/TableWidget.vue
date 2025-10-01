<template>
  <div class="table-widget">
    <div class="table-container">
      <el-table
        v-if="tableData.data.length > 0"
        :data="tableData.data"
        max-height="400"
        style="width: 100%"
        border
      >
        <!-- 动态渲染列 -->
        <el-table-column
          v-for="column in tableData.columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :fixed="column.fixed"
        />
      </el-table>
      <!-- 空状态 -->
      <div v-else class="table-widget__empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { transformToTableData } from '../util'

defineOptions({
  name: 'TableWidget'
})

// Props 定义
const props = defineProps({
  panel: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 计算属性：从 panel 解析 evaluationData
const evaluationData = computed(() => {
  try {
    return JSON.parse(props.panel?.metadata?.data || '{}')
  } catch (error) {
    console.warn('TableWidget: 无法解析 panel.metadata.data:', error)
    return {}
  }
})

// 计算属性 - 处理评估数据为表格格式
const tableData = computed(() => {
  if (!evaluationData.value || Object.keys(evaluationData.value).length === 0) {
    console.log('TableWidget: 没有评估数据')
    return { columns: [], data: [] }
  }

  const result = transformToTableData(evaluationData.value)
  console.log('TableWidget: 最终表格数据', result)
  console.log('TableWidget: 列数量', result.columns?.length)
  console.log('TableWidget: 行数量', result.data?.length)

  return result
})
</script>

<style scoped>
.table-widget {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
}

.table-container {
  width: 100%;
  height: 100%;
  max-height: 400px;
  overflow: auto;
}

.table-widget__empty {
  display: flex;
  width: 100%;
  height: 200px;
  align-items: center;
  justify-content: center;
}

/* 表格样式定制 */
.table-widget :deep(.el-table) {
  height: 100%;
  font-size: 13px;
}

.table-widget :deep(.el-table__header-wrapper) {
  background-color: var(--el-fill-color-lighter);
}

.table-widget :deep(.el-table th) {
  padding: 8px 10px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  background-color: var(--el-fill-color-lighter);
}

.table-widget :deep(.el-table tbody tr:hover > td) {
  background-color: var(--el-fill-color-light);
}

.table-widget :deep(.el-table td) {
  padding: 8px 10px;
}

/* 第一列固定样式 */
.table-widget :deep(.el-table .el-table-fixed-column--left) {
  background-color: var(--el-bg-color-page);
}

/* 表格滚动条样式 */
.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: var(--el-border-color-darker);
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-dark);
}
</style>
