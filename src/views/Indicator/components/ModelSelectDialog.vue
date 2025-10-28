<template>
  <ZxDialog
    v-model="visible"
    title="选择计算模型"
    width="800px"
    :ok-text="'确定'"
    :cancel-text="'取消'"
    :ok-disabled="!selectedModel"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="model-select-dialog">
      <!-- 搜索框 -->
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入名称进行搜索"
          clearable
          @input="handleSearch"
          @clear="handleSearch"
          style="width: 100%; margin-bottom: 16px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 模型列表 -->
      <ZxGridList
        ref="gridRef"
        :page-sizes="[10, 20, 50, 100]"
        :default-page-size="10"
        :load-data="loadModelData"
        :show-pagination="true"
        :debounce-delay="300"
        :auto-fit-table-height="false"
        :params-transform="paramsTransform"
        @dataLoaded="onDataLoaded"
        style="height: 400px"
      >
        <template #table="{ grid, loading }">
          <el-table
            ref="tableRef"
            :data="grid.list"
            v-loading="loading"
            border
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%; height: 100%"
          >
            <!-- 序号列 -->
            <el-table-column type="index" label="序号" width="60" align="center" />

            <!-- 计算模型名称列 -->
            <el-table-column
              prop="oprModelName"
              label="计算模型名称"
              min-width="200"
              show-overflow-tooltip
            />

            <!-- 描述列 -->
            <el-table-column
              prop="oprModelDesc"
              label="描述"
              min-width="200"
              show-overflow-tooltip
            />

            <!-- 选择列 -->
            <el-table-column label="选择" width="80" align="center">
              <template #default="{ row }">
                <el-radio
                  v-model="selectedModelId"
                  :label="row.id"
                  @change="handleRadioChange(row)"
                >
                  &nbsp;
                </el-radio>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- 空状态 -->
        <template #empty>
          <el-empty
            :description="searchKeyword ? '未找到匹配的模型' : '暂无模型数据'"
            :image-size="100"
          />
        </template>
      </ZxGridList>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getCalculationModelList } from '@/api/modules/indicator'

// 定义组件选项
defineOptions({
  name: 'ModelSelectDialog'
})

// Props 定义
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 预选中的模型ID
  defaultSelectedId: {
    type: [String, Number],
    default: null
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// 响应式数据
const visible = ref(false)
const searchKeyword = ref('')
const selectedModelId = ref(null)
const selectedModel = ref(null)
const gridRef = ref(null)
const tableRef = ref(null)

// 数据加载函数
const loadModelData = async (params) => {
  const response = await getCalculationModelList(params)
  
  // 处理返回数据格式，将 records 映射为 list，并添加字段映射
  
  return response
}

// 将外部搜索关键字合并到请求参数中，并转换分页参数
const paramsTransform = (params) => {
  const merged = { ...params }
  
  // 转换分页参数：page -> pageNumber, size -> pageSize
  if (params.page) {
    merged.pageNumber = params.page
    delete merged.page
  }
  if (params.size) {
    merged.pageSize = params.size
    delete merged.size
  }
  
  // 合并搜索关键字
  if (searchKeyword.value) {
    merged.keyword = searchKeyword.value
  }
  
  // 移除 query 对象，直接使用顶层参数
  delete merged.query
  
  return merged
}

// 搜索处理
const handleSearch = () => {
  if (gridRef.value) {
    gridRef.value.refresh()
  }
}

// 单选处理
const handleRadioChange = (row) => {
  selectedModel.value = row
  // 设置表格当前行高亮
  nextTick(() => {
    if (tableRef.value) {
      tableRef.value.setCurrentRow(row)
    }
  })
}

// 表格当前行变化处理
const handleCurrentChange = (currentRow) => {
  if (currentRow) {
    selectedModelId.value = currentRow.id
    selectedModel.value = currentRow
  }
}

// 确认处理
const handleConfirm = () => {
  if (selectedModel.value) {
    emit('confirm', selectedModel.value)
    handleClose()
  }
}

// 取消处理
const handleCancel = () => {
  emit('cancel')
  handleClose()
}

// 关闭弹框
const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}

// 重置状态
const resetState = async () => {
  searchKeyword.value = ''
  selectedModelId.value = props.defaultSelectedId || null
  selectedModel.value = null
}

// 监听弹框显示状态
watch(
  () => props.modelValue,
  async (newVal) => {
    visible.value = newVal
    if (newVal) {
      await resetState()
      // 延迟刷新数据，确保组件已渲染
      nextTick(() => {
        if (gridRef.value) {
          gridRef.value.refresh()
        }
      })
    }
  }
)

// 监听内部visible变化
watch(visible, (newVal) => {
  if (!newVal) {
    emit('update:modelValue', false)
  }
})

// 数据加载完成后，根据默认选中ID设置选中项与高亮
const onDataLoaded = async (response) => {
  if (!props.defaultSelectedId) return
  try {
    const list = response?.list || response?.data || response?.items || []
    const match = Array.isArray(list)
      ? list.find((item) => item.id === props.defaultSelectedId)
      : null
    if (match) {
      selectedModel.value = match
      selectedModelId.value = match.id
      await nextTick()
      if (tableRef.value) {
        tableRef.value.setCurrentRow(match)
      }
    }
  } catch (e) {
    // ignore
  }
}
</script>

<style lang="scss" scoped>
.model-select-dialog {
  .search-section {
    margin-bottom: 16px;
  }

  :deep(.el-table) {
    .el-table__row {
      cursor: pointer;

      &:hover {
        background-color: var(--el-table-row-hover-bg-color);
      }

      &.current-row {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }

  :deep(.el-radio) {
    .el-radio__input {
      .el-radio__inner {
        width: 16px;
        height: 16px;

        &::after {
          width: 6px;
          height: 6px;
        }
      }
    }
  }
}
</style>
