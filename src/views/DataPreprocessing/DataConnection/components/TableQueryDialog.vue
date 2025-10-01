<template>
  <ZxDialog
    v-model="dialogVisible"
    title="数据源表查询"
    width="800px"
    :show-ok="false"
    :show-cancel="true"
    cancel-text="关闭"
  >
    <div class="table-query-container">
      <ZxGridList
        ref="gridListRef"
        :load-data="loadTableData"
        :columns="tableColumns"
        :pagination="true"
        :page-size="10"
        :page-sizes="[10, 20, 50]"
        :show-selection="false"
        :show-index="false"
        :max-height="400"
      />
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ZxDialog from '@/components/pure/ZxDialog'
import { ZxGridList } from '@/components/pure'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataSource: {
    type: Object,
    default: null
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

// 表格列配置
const tableColumns = [
  {
    prop: 'tableName',
    label: '表名称',
    minWidth: 200
  },
  {
    prop: 'rowCount',
    label: '数据行数量',
    width: 120
  }
]

// 数据加载函数 - 适配 ZxGridList
const loadTableData = async (params) => {
  if (!props.dataSource?.baseId) {
    return {
      records: [],
      total: 0
    }
  }

  try {
    const response = await dataConnectionApi.getTableNames(props.dataSource.baseId, {
      pageNumber: params.current,
      pageSize: params.size
    })

    if (response.code === '200' || response.success) {
      return {
        records: response.data.records || response.data || [],
        total: response.data.total || 0
      }
    } else {
      throw new Error(response.msg || response.message || '获取表列表失败')
    }
  } catch (error) {
    console.error('加载表列表失败:', error)
    throw error
  }
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

// 监听数据源变化
watch(
  () => props.dataSource,
  () => {
    if (props.modelValue && gridListRef.value) {
      gridListRef.value.refresh()
    }
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.table-query-container {
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
