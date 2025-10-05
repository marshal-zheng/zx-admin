<template>
  <div class="data-entry-container">
    <el-row :gutter="16">
      <!-- 左侧：数据表列表 -->
      <el-col :span="10">
        <TableQuery @view-table-data="handleViewTableData" />
      </el-col>
      
      <!-- 右侧：表数据展示 -->
      <el-col :span="14">
        <ContentWrap>
          <TableList ref="tableListRef" />
        </ContentWrap>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import TableQuery from '../components/TableQuery.vue'
import TableList from './tableList.vue'

// 响应式数据
const tableListRef = ref()

// 查看表数据处理
const handleViewTableData = (data: { createTableId: string | number; tableName: string }) => {
  console.log('查看表数据:', data)
  // 调用 tableList 组件加载数据
  tableListRef.value?.loadTableData(data)
}
</script>

<style lang="scss" scoped>
.data-entry-container {
  height: 100%;
  padding: 16px;

  :deep(.el-row) {
    height: 100%;
  }

  :deep(.el-col) {
    height: 100%;
  }
}
</style>
