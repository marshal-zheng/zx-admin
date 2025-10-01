<template>
  <ZxDialog
    v-model="dialogVisible"
    title="表字段信息"
    width="60%"
    :show-ok="false"
    :show-cancel="true"
    cancel-text="关闭"
  >
    <ZxGridList
      :load-data="loadData"
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
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索字段名称"
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
        </el-table>
      </template>
    </ZxGridList>
  </ZxDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ZxDialog from '@/components/pure/ZxDialog'
import { ZxGridList, ZxSearch } from '@/components/pure'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataSourceId: {
    type: [String, Number],
    default: null
  },
  tableName: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const gridListRef = ref()

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 注意：使用自定义 el-table 模板时不需要 columns 配置

const loadData = async (params) => {
  const response = await dataConnectionApi.getTableFields(params)
  console.log('response', response)
  return { records: response.data || [], page: 1, size: response.data.length }
}
// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && gridListRef.value) {
      gridListRef.value.refresh()
    }
  }
)

// 监听表名变化
watch(
  () => props.tableName,
  () => {
    if (props.modelValue && gridListRef.value) {
      gridListRef.value.refresh()
    }
  }
)

// 监听数据源ID变化
watch(
  () => props.dataSourceId,
  () => {
    if (props.modelValue && gridListRef.value) {
      gridListRef.value.refresh()
    }
  }
)
</script>

<style lang="less" scoped>
.table-data-container {
  height: 100%;
}
</style>
