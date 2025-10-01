<template>
  <ZxDialog
    v-model="dialogVisible"
    :title="`表结构 - ${tableName}`"
    width="900px"
    :show-ok="false"
    :show-cancel="true"
    cancel-text="关闭"
  >
    <div class="table-structure-container">
      <el-table :data="structureData" style="width: 100%" max-height="500px" v-loading="loading">
        <el-table-column prop="columnName" label="字段名" width="150" show-overflow-tooltip />
        <el-table-column prop="dataType" label="数据类型" width="120" />
        <el-table-column prop="columnLength" label="长度" width="80" align="center">
          <template #default="{ row }">
            <span v-if="row.columnLength">{{ row.columnLength }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="nullable" label="允许空值" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.nullable === 'YES' ? 'success' : 'danger'" size="small">
              {{ row.nullable === 'YES' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isPrimaryKey" label="主键" width="80" align="center">
          <template #default="{ row }">
            <Icon v-if="row.isPrimaryKey" icon="ep:key" class="text-yellow-500" />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.defaultValue">{{ row.defaultValue }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="columnComment" label="注释" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.columnComment">{{ row.columnComment }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ZxDialog from '@/components/pure/ZxDialog'
import { Icon } from '@/components/Icon'
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
const structureData = ref([])
const loading = ref(false)

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 加载表结构数据
const loadTableStructure = async () => {
  if (!props.dataSourceId || !props.tableName) {
    return
  }

  loading.value = true
  try {
    console.log('=== 查询表结构 ===', {
      dataSourceId: props.dataSourceId,
      tableName: props.tableName
    })

    const response = await dataConnectionApi.getTableStructure(props.dataSourceId, props.tableName)
    console.log('=== 表结构 API 返回数据 ===', response)

    if (response.code === '200' || response.success) {
      structureData.value = response.data || response.result || []
    } else {
      throw new Error(response.msg || response.message || '获取表结构失败')
    }
  } catch (error) {
    console.error('=== loadTableStructure 错误 ===', error)
    ElMessage.error(error.message || '获取表结构失败')
    structureData.value = []
  } finally {
    loading.value = false
  }
}

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      loadTableStructure()
    } else {
      structureData.value = []
    }
  }
)

// 监听数据源和表名变化
watch([() => props.dataSourceId, () => props.tableName], () => {
  if (props.modelValue) {
    loadTableStructure()
  }
})
</script>

<style lang="scss" scoped>
.table-structure-container {
  .text-gray-400 {
    color: var(--el-text-color-placeholder);
  }

  .text-yellow-500 {
    color: #f59e0b;
  }
}
</style>
