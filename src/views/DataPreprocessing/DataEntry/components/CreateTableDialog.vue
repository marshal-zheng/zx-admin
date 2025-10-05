<template>
  <ZxDialog
    v-model="dialogVisible"
    title="新增表"
    width="80%"
    :show-ok="true"
    :show-cancel="true"
    ok-text="确定"
    cancel-text="取消"
    :loading="loading"
    @ok="handleSubmit"
  >
    <div class="create-table-container">
      <!-- 基本信息表单 -->
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" class="mb-6">
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="formData.tableName" placeholder="请输入表名" clearable />
        </el-form-item>
        <el-form-item label="表注释" prop="tableComment">
          <el-input v-model="formData.tableComment" placeholder="请输入表注释" clearable />
        </el-form-item>
        <el-form-item label="表字段">
          <DataGrid
            v-model="formData.fields"
            :columns="fieldColumns"
            :show-add-button="true"
            :show-actions="true"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { DataGrid } from '@/components/DataGrid'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'

// 定义事件
const emit = defineEmits(['success'])

// 响应式数据
const formRef = ref()
const loading = ref(false)

// 弹窗显示状态
const dialogVisible = ref(false)

// 表单数据
const formData = ref({
  tableName: '',
  tableComment: '',
  fields: [
    {
      name: '',
      type: 'varchar',
      extent: 255,
      comment: ''
    }
  ]
})

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

// 字段类型选项
const fieldTypeOptions = [
  { label: 'VARCHAR', value: 'varchar' },
  { label: 'INT', value: 'int' },
  { label: 'BIGINT', value: 'bigint' },
  { label: 'DECIMAL', value: 'decimal' },
  { label: 'TEXT', value: 'text' },
  { label: 'DATE', value: 'date' },
  { label: 'DATETIME', value: 'datetime' },
  { label: 'TIMESTAMP', value: 'timestamp' }
]

// 字段列配置
const fieldColumns = computed(() => [
  {
    key: 'name',
    dataKey: 'name',
    title: '字段名',
    type: 'input',
    placeholder: '请输入字段名',
    rules: [
      { required: true, message: '字段名不能为空', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
        message: '字段名必须以字母开头,只能包含字母、数字和下划线',
        trigger: 'blur'
      }
    ]
  },
  {
    key: 'type',
    dataKey: 'type',
    title: '字段类型',
    type: 'select',
    options: fieldTypeOptions,
    defaultValue: 'varchar',
    rules: [{ required: true, message: '字段类型不能为空', trigger: 'change' }]
  },
  {
    key: 'extent',
    dataKey: 'extent',
    title: '字段长度',
    type: 'number',
    placeholder: '长度',
    cellProps: {
      min: 1,
      max: 65535,
      precision: 0
    },
    defaultValue: 255
  },
  {
    key: 'comment',
    dataKey: 'comment',
    title: '字段注释',
    type: 'input',
    placeholder: '请输入字段注释'
  }
])

// 重置表单
const resetForm = () => {
  formData.value = {
    tableName: '',
    tableComment: '',
    fields: [
      {
        name: '',
        type: 'varchar',
        extent: 255,
        comment: ''
      }
    ]
  }
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 验证字段数据
const validateFields = () => {
  const fields = formData.value.fields

  if (fields.length === 0) {
    ElMessage.error('请至少添加一个字段')
    return false
  }

  // 检查字段名重复
  const fieldNames = fields.map((f) => f.name).filter(Boolean)
  const uniqueNames = new Set(fieldNames)
  if (fieldNames.length !== uniqueNames.size) {
    ElMessage.error('字段名不能重复')
    return false
  }

  // 检查必填字段
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    if (!field.name) {
      ElMessage.error(`第 ${i + 1} 行字段名不能为空`)
      return false
    }
    if (!field.type) {
      ElMessage.error(`第 ${i + 1} 行字段类型不能为空`)
      return false
    }

    // 验证字段名格式
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.name)) {
      ElMessage.error(`第 ${i + 1} 行字段名格式不正确,必须以字母开头,只能包含字母、数字和下划线`)
      return false
    }
  }

  return true
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证基本表单
    const valid = await formRef.value.validate()
    if (!valid) return

    // 验证字段数据
    if (!validateFields()) return

    loading.value = true

    const submitData = {
      tableName: formData.value.tableName,
      tableComment: formData.value.tableComment,
      createTableRowDtos: formData.value.fields.map((field) => ({
        name: field.name,
        type: field.type,
        extent: field.extent || null,
        comment: field.comment || ''
      }))
    }

    console.log('=== 提交新增表数据 ===', submitData)

    // 调用 API 创建表
    const response = await datasetsApi.createTable(submitData)

    if (response.code === '200' || response.success) {
      ElMessage.success('表创建成功')
      dialogVisible.value = false
      emit('success')
      resetForm()
    } else {
      throw new Error(response.msg || response.message || '创建表失败')
    }
  } catch (error) {
    console.error('=== 创建表错误 ===', error)
    ElMessage.error(error.message || '创建表失败')
  } finally {
    loading.value = false
  }
}

// 监听弹窗显示状态
watch(
  () => dialogVisible.value,
  (newValue) => {
    if (newValue) {
      resetForm()
    }
  }
)

// 暴露方法
defineExpose({
  open: () => {
    dialogVisible.value = true
  },
  close: () => {
    dialogVisible.value = false
  }
})
</script>

<style lang="scss" scoped>
.create-table-container {
  .fields-section {
    .table-footer {
      margin-top: 16px;
    }
  }
}
</style>
