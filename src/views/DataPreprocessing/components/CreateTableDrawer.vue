<template>
  <ZxDrawer 
    v-bind="drawer.drawerProps.value" 
    :title="isEditMode ? '编辑表' : '新增表'"
    :loading="drawerLoading" 
    loadingType="skeleton" 
    v-on="drawer.drawerEvents.value"
  >
    <div class="create-table-container">
      <!-- 基本信息表单 -->
      <el-form
        ref="formRef"
        :model="drawer.state.data"
        :rules="formRules"
        label-position="top"
        class="mb-6"
      >
        <el-form-item label="表名" prop="tableName">
          <el-input
            v-model="drawer.state.data.tableName"
            placeholder="请输入表名"
            clearable
          />
        </el-form-item>
        <el-form-item label="表注释" prop="tableComment">
          <el-input
            v-model="drawer.state.data.tableComment"
            placeholder="请输入表注释"
            clearable
          />
        </el-form-item>
        <el-form-item label="表字段">
          <DataGrid
            v-model="drawer.state.data.fields"
            :columns="fieldColumns"
            :show-add-button="true"
            :show-actions="true"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { DataGrid } from '@/components/DataGrid'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'
import { useDrawer } from '@zxio/zxui'
import FieldTypeSelector from '@/views/DataPreprocessing/components/selector/FieldTypeSelector.vue'

// 定义事件
const emit = defineEmits(['success'])

// 表单引用
const formRef = ref<FormInstance | null>(null)

// Drawer loading 状态
const drawerLoading = ref(false)

// 字段接口定义
interface TableField {
  name: string
  type: string
  extent: number
  comment: string
  isNew?: boolean // 标识是否为新字段，true为新字段，false为旧字段
}

// 表单数据接口
interface FormData {
  tableName: string
  tableComment: string
  fields: TableField[]
}

// 表单验证规则
const formRules = {
  tableName: [
    { required: true, message: '请输入表名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '表名必须以字母开头,只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  tableComment: [{ required: true, message: '请输入表注释', trigger: 'blur' }]
}



// 字段列配置
const fieldColumns = computed(() => [
  {
    key: 'name',
    dataKey: 'name',
    title: '字段名',
    type: 'input' as const,
    placeholder: '请输入字段名',
    rules: [
      { required: true, message: '字段名不能为空', trigger: 'blur' as const },
      {
        pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
        message: '字段名必须以字母开头,只能包含字母、数字和下划线',
        trigger: 'blur' as const
      }
    ]
  },
  {
    key: 'type',
    dataKey: 'type',
    title: '字段类型',
    type: 'custom' as const,
    component: FieldTypeSelector,
    componentProps: {
      autoSelectFirst: true
    },
    defaultValue: 'varchar',
    rules: [{ required: true, message: '字段类型不能为空', trigger: 'change' as const }]
  },
  {
    key: 'extent',
    dataKey: 'extent',
    title: '字段长度',
    type: 'input' as const,
    placeholder: '长度（整数或13,2格式）',
    defaultValue: '255',
    rules: [
      { required: true, message: '字段长度不能为空', trigger: 'blur' as const },
      {
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('字段长度不能为空'))
            return
          }
          
          // 检查是否为整数
          if (/^\d+$/.test(value)) {
            const num = parseInt(value)
            if (num >= 1 && num <= 65535) {
              callback()
            } else {
              callback(new Error('整数长度必须在1-65535之间'))
            }
            return
          }
          
          // 检查是否为 double 格式 (如: 13,2)
          if (/^\d+,\d+$/.test(value)) {
            const [precision, scale] = value.split(',').map(Number)
            if (precision >= 1 && precision <= 65 && scale >= 0 && scale <= 30 && scale <= precision) {
              callback()
            } else {
              callback(new Error('double格式应为"精度,标度"，精度1-65，标度0-30且不超过精度'))
            }
            return
          }
          
          callback(new Error('请输入整数或double格式(如:13,2)'))
        },
        trigger: 'blur' as const
      }
    ]
  },
  {
    key: 'comment',
    dataKey: 'comment',
    title: '字段注释',
    type: 'input' as const,
    placeholder: '请输入字段注释',
    rules: [{ required: true, message: '字段注释不能为空', trigger: 'blur' as const }]
  }
])

// 验证字段数据
const validateFields = (fields: TableField[]) => {
  console.log('开始验证字段数据:', fields)
  
  if (fields.length === 0) {
    console.log('验证失败: 字段数组为空')
    ElMessage.error('请至少添加一个字段')
    return false
  }

  // 检查字段名重复
  const fieldNames = fields.map((f) => f.name).filter(Boolean)
  const uniqueNames = new Set(fieldNames)
  if (fieldNames.length !== uniqueNames.size) {
    console.log('验证失败: 字段名重复', fieldNames)
    ElMessage.error('字段名不能重复')
    return false
  }

  // 检查必填字段
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    console.log(`验证第 ${i + 1} 行字段:`, field)
    
    if (!field.name) {
      console.log(`验证失败: 第 ${i + 1} 行字段名为空`)
      ElMessage.error(`第 ${i + 1} 行字段名不能为空`)
      return false
    }
    if (!field.type) {
      console.log(`验证失败: 第 ${i + 1} 行字段类型为空`)
      ElMessage.error(`第 ${i + 1} 行字段类型不能为空`)
      return false
    }
    if (!field.comment) {
      console.log(`验证失败: 第 ${i + 1} 行字段注释为空`)
      ElMessage.error(`第 ${i + 1} 行字段注释不能为空`)
      return false
    }

    // 验证字段名格式
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.name)) {
      console.log(`验证失败: 第 ${i + 1} 行字段名格式不正确`, field.name)
      ElMessage.error(`第 ${i + 1} 行字段名格式不正确,必须以字母开头,只能包含字母、数字和下划线`)
      return false
    }
  }

  console.log('字段验证通过')
  return true
}

// 编辑模式状态
const isEditMode = ref(false)
const editingTableId = ref<string | null>(null)

// 使用 drawer hook
const drawer = useDrawer<FormData>({
  title: computed(() => isEditMode.value ? '编辑表' : '新增表'),
  size: '65%',
  placement: 'right',
  formRef,
  formModel: computed(() => drawer.state.data),
  autoResetForm: true,
  preValidate: true,
  autoScrollToError: true,
  defaultData: () => ({
    tableName: '',
    tableComment: '',
    fields: [
      {
        name: '',
        type: 'varchar',
        extent: 255,
        comment: '',
        isNew: true // 默认新字段
      }
    ]
  }),
  onConfirm: async () => {
    // 验证字段数据
    if (!validateFields(drawer.state.data.fields)) {
      throw new Error('字段验证失败')
    }

    let response
    if (isEditMode.value && editingTableId.value) {
      // 编辑模式：使用新的编辑接口
      const editData = {
        updateId: editingTableId.value,
        oldTableName: drawer.state.data.tableName, // 保存原表名
        tableName: drawer.state.data.tableName,
        tableComment: drawer.state.data.tableComment,
        createTableRowDtos: drawer.state.data.fields.map((field) => ({
          name: field.name,
          type: field.type,
          extent: String(field.extent),
          comment: field.comment,
          ...(field.isNew === false && { oldColumnName: field.name }) // 只为旧字段传递oldColumnName
        }))
      }
      response = await datasetsApi.modifyTable(editData)
    } else {
      // 新增模式：调用创建接口
      const submitData = {
        tableName: drawer.state.data.tableName,
        tableComment: drawer.state.data.tableComment,
        createTableRowDtos: drawer.state.data.fields.map((field) => ({
          name: field.name,
          type: field.type,
          extent: String(field.extent),
          comment: field.comment
        }))
      }
      console.log('新增提交数据:', submitData)
      response = await datasetsApi.createTable(submitData)
    }

    
    emit('success')
    drawer.close()
    
  },
  onConfirmError: (error: any) => {
    console.error('操作失败:', error)
    const errorMsg = error?.message || '操作失败'
    ElMessage.error(errorMsg)
  }
})

// 加载数据集详情
const loadDatasetDetail = async (createTableId: string) => {
  drawerLoading.value = true
  try {
    const detail = await datasetsApi.getDatasetDetail(createTableId)
    
    // 填充表单数据
    drawer.state.data.tableName = detail.tableName || ''
    drawer.state.data.tableComment = detail.tableComment || ''
    
    // 填充字段数据
    if (detail.createTableRowDtos && detail.createTableRowDtos.length > 0) {
      drawer.state.data.fields = detail.createTableRowDtos.map((field: any) => ({
        name: field.name || '',
        type: field.type || 'varchar',
        extent: field.extent || '255',
        comment: field.comment || '',
        isNew: false // 从后端加载的都是旧字段
      }))
    } else {
      // 如果没有字段数据，保持默认的一个空字段
      drawer.state.data.fields = [
        {
          name: '',
          type: 'varchar',
          extent: 255,
          comment: '',
          isNew: true // 默认新字段
        }
      ]
    }
  }finally {
     drawerLoading.value = false
   }
}

// 自定义 open 方法
const openDrawer = async (createTableId?: string) => {
  if (createTableId) {
    // 编辑模式
    isEditMode.value = true
    editingTableId.value = createTableId
    
    // 先打开抽屉
    drawer.open()
    
    await loadDatasetDetail(createTableId)
  
  } else {
    // 新增模式
    isEditMode.value = false
    editingTableId.value = null
    drawer.open()
  }
}

// 暴露方法
defineExpose({
  open: openDrawer,
  close: drawer.close
})
</script>

<style lang="scss" scoped>
.create-table-container {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}
</style>
