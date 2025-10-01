<template>
  <ZxDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="50%"
    :ok-text="mode === 'create' ? '创建' : '保存'"
    :show-cancel="true"
    :cancel-text="'取消'"
    :confirm="handleSubmit"
    :form-ref="formRef"
    :form-model="formData"
    :auto-scroll-to-error="true"
  >
    <!-- 自定义按钮：测试按钮（仅在数据库配置时显示） -->
    <template #self-button>
      <ZxButton
        v-if="isDatabaseType"
        class="mx-4"
        type="default"
        :loading="testLoading"
        :disabled="!canTest"
        @click="handleTestConnection"
      >
        测试
      </ZxButton>
    </template>
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <!-- 数据源名称 -->
        <el-form-item label="数据源名称" prop="baseName" required>
          <el-input v-model="formData.baseName" placeholder="请输入数据源名称" />
        </el-form-item>

        <!-- 数据源类型选择 -->
        <el-form-item label="数据源类型" prop="baseType" required>
          <DataSourceSelector v-model="formData.baseType" @change="handleDataSourceTypeChange" />
        </el-form-item>

        <!-- 文件上传配置 -->
        <template v-if="formData.baseType === 'file'">
          <el-form-item label="文件上传" prop="fileData" required>
            <ZxUpload
              v-model="formData.fileData"
              action="/api/upload"
              accept=".xlsx,.xls,.csv,.json,.xml"
              :multiple="false"
              :limit="1"
              :auto-upload="false"
              :drag="true"
              main-text="点击或拖拽文件到此区域上传"
              sub-text="支持 Excel、CSV、JSON、XML 格式文件"
              @change="handleFileChange"
            />
          </el-form-item>
        </template>

        <!-- 数据库连接配置 -->
        <template v-else>
          <el-form-item label="IP地址" prop="baseIp" required>
            <el-input v-model="formData.baseIp" placeholder="请输入IP地址" />
          </el-form-item>

          <el-form-item label="端口" prop="basePort" required>
            <el-input v-model="formData.basePort" placeholder="请输入端口号" />
          </el-form-item>

          <el-form-item label="数据库名称" prop="baseDataName" required>
            <el-input v-model="formData.baseDataName" placeholder="请输入数据库名称" />
          </el-form-item>

          <el-form-item label="用户名" prop="baseUser" required>
            <el-input v-model="formData.baseUser" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="密码" prop="basePassword" required>
            <el-input
              v-model="formData.basePassword"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ZxDialog, ZxUpload, ZxButton } from '@/components/pure'
import DataSourceSelector from './selector/DataSourceSelector.vue'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataSourceData: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create', // create, edit
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref()

// 测试连接状态
const testLoading = ref(false)

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 弹窗标题
const dialogTitle = computed(() => {
  const titleMap = {
    create: '新增数据源',
    edit: '编辑数据源'
  }
  return titleMap[props.mode] || '数据源表单'
})

// 表单数据
const formData = reactive({
  baseName: '',
  baseIp: '',
  basePort: '',
  baseDataName: '',
  baseUser: '',
  basePassword: '',
  baseType: '',
  fileData: null
})

// 数据源类型判断
const isDatabaseType = computed(() => {
  return formData.baseType !== 'file'
})

const isFileType = computed(() => {
  return formData.baseType === 'file'
})

// 测试按钮是否可用
const canTest = computed(() => {
  if (!isDatabaseType.value) return false

  // 检查数据库连接必填字段是否都已填写
  return !!(
    formData.baseIp &&
    formData.basePort &&
    formData.baseDataName &&
    formData.baseUser &&
    formData.basePassword
  )
})

// 动态表单验证规则
const formRules = computed(() => {
  const baseRules = {
    baseName: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
    baseType: [{ required: true, message: '请选择数据源类型', trigger: 'change' }]
  }

  // 数据库类型的验证规则
  if (isDatabaseType.value) {
    Object.assign(baseRules, {
      baseIp: [
        { required: true, message: '请输入IP地址', trigger: 'blur' },
        { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP地址格式不正确', trigger: 'blur' }
      ],
      basePort: [
        { required: true, message: '请输入端口号', trigger: 'blur' },
        { pattern: /^\d+$/, message: '端口号必须为数字', trigger: 'blur' }
      ],
      baseDataName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
      baseUser: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      basePassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    })
  }

  // 文件类型的验证规则 - 不设置自动触发，只在提交时验证
  if (isFileType.value) {
    Object.assign(baseRules, {
      fileData: [{ required: true, message: '请选择要上传的文件', trigger: 'manual' }]
    })
  }

  return baseRules
})

// 数据源类型变化处理
const handleDataSourceTypeChange = (selectedOption) => {
  if (selectedOption && selectedOption.value) {
    formData.baseType = selectedOption.value
  }

  // 使用 nextTick 确保响应式更新完成后再执行后续操作
  nextTick(() => {
    // 清除其他字段的验证错误
    if (formRef.value) {
      formRef.value.clearValidate()
    }

    // 根据类型重置相关字段
    if (isFileType.value) {
      // 切换到文件类型时，清空数据库相关字段
      formData.baseIp = ''
      formData.basePort = ''
      formData.baseDataName = ''
      formData.baseUser = ''
      formData.basePassword = ''
    } else if (isDatabaseType.value) {
      // 切换到数据库类型时，清空文件相关字段
      formData.fileData = null
    }
  })
}

// 文件变化处理
const handleFileChange = (fileList) => {
  formData.fileData = fileList
  // 清除文件字段的验证错误
  if (formRef.value) {
    formRef.value.clearValidate(['fileData'])
  }
}

// 初始化表单数据
const initFormData = () => {
  if (props.dataSourceData && props.mode === 'edit') {
    // 编辑模式，填充现有数据
    Object.assign(formData, {
      baseName: props.dataSourceData.baseName || '',
      baseIp: props.dataSourceData.baseIp || '',
      basePort: props.dataSourceData.basePort || '',
      baseDataName: props.dataSourceData.baseDataName || '',
      baseUser: props.dataSourceData.baseUser || '',
      basePassword: props.dataSourceData.basePassword || '',
      baseType: props.dataSourceData.baseType || '',
      fileData: props.dataSourceData.fileData || null
    })
  } else {
    // 新建模式，重置表单
    resetFormData()
  }
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    baseName: '',
    baseIp: '',
    basePort: '',
    baseDataName: '',
    baseUser: '',
    basePassword: '',
    baseType: '',
    fileData: null
  })
}

// 测试数据库连接
const handleTestConnection = async () => {
  if (!canTest.value) {
    ElMessage.warning('请先填写完整的数据库连接信息')
    return
  }

  testLoading.value = true

  try {
    // 创建临时数据源用于测试
    const testData = {
      baseName: `test_${Date.now()}`, // 临时名称
      baseIp: formData.baseIp,
      basePort: formData.basePort,
      baseDataName: formData.baseDataName,
      baseUser: formData.baseUser,
      basePassword: formData.basePassword,
      baseType: formData.baseType === 'mysql' ? 1 : 2 // 1 MySql数据库 2 达梦数据库
    }

    // 先创建临时数据源
    const createResponse = await dataConnectionApi.addDataSource(testData)

    if (createResponse.code === '200' || createResponse.success) {
      const tempBaseId = createResponse.data?.baseId || createResponse.data?.id

      if (tempBaseId) {
        try {
          // 尝试获取表列表来验证连接
          const testResponse = await dataConnectionApi.getTableNames(tempBaseId, {
            pageNumber: 1,
            pageSize: 1
          })

          if (testResponse.code === '200' || testResponse.success) {
            ElMessage.success('数据库连接测试成功！')
          } else {
            throw new Error(testResponse.msg || testResponse.message || '连接测试失败')
          }
        } finally {
          // 无论成功失败都要删除临时数据源
          try {
            await dataConnectionApi.deleteDataSource(tempBaseId)
          } catch (deleteError) {
            console.warn('删除临时数据源失败:', deleteError)
          }
        }
      } else {
        throw new Error('创建临时数据源失败，无法获取ID')
      }
    } else {
      throw new Error(createResponse.msg || createResponse.message || '创建临时数据源失败')
    }
  } catch (error) {
    console.error('数据库连接测试失败:', error)
    ElMessage.error(error.message || '数据库连接测试失败，请检查连接信息')
  } finally {
    testLoading.value = false
  }
}

// 表单提交 - 返回 Promise，ZxDialog 会自动处理 loading 状态
const handleSubmit = async () => {
  if (!formRef.value) return

  // 准备提交数据
  const submitData = {
    baseName: formData.baseName,
    baseType: formData.baseType
  }

  // 根据数据源类型添加相应字段
  if (isDatabaseType.value) {
    Object.assign(submitData, {
      baseIp: formData.baseIp,
      basePort: formData.basePort,
      baseDataName: formData.baseDataName,
      baseUser: formData.baseUser,
      basePassword: formData.basePassword
    })
  } else if (isFileType.value) {
    Object.assign(submitData, {
      fileData: formData.fileData
    })
  }

  let requestPromise

  if (props.mode === 'create') {
    requestPromise = dataConnectionApi.addDataSource(submitData)
  } else if (props.mode === 'edit') {
    requestPromise = dataConnectionApi.editDataSource(props.dataSourceData.baseId, submitData)
  }

  if (!requestPromise) {
    emit('success')
    return
  }

  const response = await requestPromise

  if (response.code === '200' || response.success) {
    ElMessage.success(props.mode === 'create' ? '数据源创建成功' : '数据源更新成功')
    emit('success', response)
  } else {
    throw new Error(response.msg || response.message || '操作失败')
  }

  return response
}

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      initFormData()
    }
  },
  { immediate: true }
)

// 监听数据源数据变化
watch(
  () => props.dataSourceData,
  () => {
    if (props.modelValue) {
      initFormData()
    }
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.dialog-form-container {
  .form-input {
    width: 100%;
  }
}

/* 强制设置 el-upload-dragger 的 padding 为 0 */
:deep(.el-upload-dragger) {
  padding: 0 !important;
}
</style>
