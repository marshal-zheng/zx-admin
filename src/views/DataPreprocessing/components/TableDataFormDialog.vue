<template>
  <ZxDialog v-bind="dialogProps" v-on="dialogEvents" :loading="dialogLoading">
    <div class="create-table-data-container">
      <!-- 表单数据 -->
      <div class="table-data-form">
        <DataGrid
          v-model="formData"
          :columns="dataColumns"
          :show-add-button="mode === 'create'"
          :show-actions="mode === 'create'"
          :min-rows="1"
          :max-rows="mode === 'edit' ? 1 : undefined"
        />
      </div>
    </div>


  </ZxDialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { DataGrid } from '@/components/DataGrid'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'
import { useDialog } from '@zxio/zxui'

// 定义接口
interface TableField {
  name: string
  type: string
  comment?: string
}

interface FormRow {
  [key: string]: string
}

// 定义事件
const emit = defineEmits<{
  success: []
}>()

// 其它响应式数据
const tableName = ref('')
const tableFields = ref<TableField[]>([])
const formData = ref<FormRow[]>([])
const dialogLoading = ref(false)

// 组件模式
const mode = ref<'create' | 'edit'>('create')
const editingRowData = ref<FormRow | null>(null)

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open: openDialog, close: closeDialog, setLoading } = useDialog<{ tableName: string; mode: string }>({
  title: (data) => {
    const modeText = mode.value === 'edit' ? '编辑表数据' : '新建表数据'
    return `${modeText} - ${data?.tableName || ''}`
  },
  width: '80%',
  defaultData: () => ({ tableName: '', mode: 'create' }),
  
  // 确认回调
  onConfirm: async () => {
    // 验证数据
    for (let i = 0; i < formData.value.length; i++) {
      const row = formData.value[i]
      for (const field of tableFields.value) {
        const value = row[field.name]
        // 检查值是否为空或者转换为字符串后为空
        if (value === null || value === undefined || String(value).trim() === '') {
          throw new Error(`第 ${i + 1} 行的 ${field.name} 不能为空`)
        }
      }
    }

    let response
    if (mode.value === 'edit') {
      // 编辑模式：调用编辑接口
      const updateId = editingRowData.value?.id
     
      const editData = {
        updateId: updateId!,
        tableName: tableName.value,
        createTableRowDtos: Object.keys(formData.value[0]).map(key => ({
          name: key,
          tValue: String(formData.value[0][key])
        }))
      }
      
      response = await datasetsApi.updateTableRow(editData)
    } else {
      // 新建模式：调用新建接口
      const createData = {
        tableName: tableName.value,
        createTableRowDtoLists: formData.value.map(row => {
          return Object.keys(row).map(key => ({
            name: key,
            tValue: String(row[key])
          }))
        })
      }
      
      response = await datasetsApi.insertTable(createData)
    }
    
    emit('success')
    return response
  },

  // 错误处理回调
  onConfirmError: (error: any) => {
  }
})

// 动态生成列配置
const dataColumns = computed(() => {
  return tableFields.value.map(field => ({
    key: field.name,
    dataKey: field.name,
    title: field.name,
    type: 'input' as const,
    placeholder: `请输入`,
    rules: [
      { 
        required: true, 
        message: `${field.name}不能为空`, 
        trigger: 'blur' as const 
      }
    ]
  }))
})

// 获取表字段（带降级：失败时从示例数据推断字段）
const fetchTableFields = async (name: string) => {
  dialogLoading.value = true
  try {
    const response = await datasetsApi.getTableField(name)
    // 兼容不同返回结构：若后端直接返回数组/或包裹在 data 中
    const fields = Array.isArray(response)
      ? response
      : (response?.data ?? [])
    tableFields.value = fields || []

    if (!Array.isArray(tableFields.value) || tableFields.value.length === 0) {
      // 若没有返回有效字段，尝试降级
      await deriveFieldsFromSample(name)
    }

    initFormData()
  } catch (error: any) {
    // 500 或其他错误时，尝试降级逻辑
    await deriveFieldsFromSample(name)
    initFormData()
  } finally {
    dialogLoading.value = false
  }
}

// 通过首行示例数据推断字段
const deriveFieldsFromSample = async (name: string) => {
  try {
    const sample = await datasetsApi.getTableDataByTableName(name, { page: 1, pageSize: 1 })
    const list = Array.isArray(sample)
      ? sample
      : (sample?.list ?? sample?.data ?? [])
    if (Array.isArray(list) && list.length > 0) {
      const keys = Object.keys(list[0])
      tableFields.value = keys.map((k) => ({ name: k, type: 'varchar', comment: '' }))
    } else {
      // 如果没有数据，无法推断，保留空数组
      tableFields.value = []
    }
  } catch (e) {
    tableFields.value = []
  }
}

// 初始化表单数据
const initFormData = () => {
  if (mode.value === 'edit' && editingRowData.value) {
    // 编辑模式：使用传入的行数据
    formData.value = [{ ...editingRowData.value }]
  } else {
    // 新建模式：创建空行
    const initialRow: FormRow = {}
    tableFields.value.forEach(field => {
      initialRow[field.name] = ''
    })
    formData.value = [initialRow]
  }
}

// 打开弹框 - 新建模式
const openCreateDialog = async (name: string) => {
  mode.value = 'create'
  editingRowData.value = null
  tableName.value = name
  
  openDialog({ tableName: name, mode: 'create' })
  
  await nextTick()
  
  try {
    await fetchTableFields(name)
  } catch (error) {
    closeDialog()
    resetState()
  }
}

// 打开弹框 - 编辑模式
const openEditDialog = async (name: string, rowData: FormRow) => {
  mode.value = 'edit'
  editingRowData.value = { ...rowData }
  tableName.value = name
  
  openDialog({ tableName: name, mode: 'edit' })
  
  await nextTick()
  
  try {
    await fetchTableFields(name)
  } catch (error) {
    closeDialog()
    resetState()
  }
}

// 重置状态
const resetState = () => {
  tableName.value = ''
  tableFields.value = []
  formData.value = []
  editingRowData.value = null
}

// 暴露方法
defineExpose({
  openCreate: openCreateDialog,
  openEdit: openEditDialog,
  // 兼容旧的调用方式
  open: openCreateDialog
})
</script>

<style lang="scss" scoped>
.create-table-data-container {
  .table-data-form {
    min-height: 300px;
  }
}
</style>