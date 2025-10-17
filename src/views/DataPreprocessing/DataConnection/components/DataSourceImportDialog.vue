<template>
  <ZxDialog v-bind="dialogProps" v-on="dialogEvents">
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="state.data"
        :rules="formRules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="数据库名称" prop="baseDataName">
          <el-input
            v-model="state.data.baseDataName"
            placeholder="请输入数据库名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="导入文件" prop="file">
          <ZxUpload
            ref="uploadRef"
            v-model="fileList"
            drag
            :auto-upload="false"
            :limit="1"
            accept=".xlsx,.xls,.csv,.json,.xml"
            :max-size="500 * 1024 * 1024"
            main-text="将文件拖到此处，或点击上传"
            sub-text="支持 .xlsx, .xls, .csv, .json, .xml 格式文件，且不超过 500MB"
            :before-upload="handleBeforeUpload"
            @change="handleFileListChange"
            @exceed="handleExceed"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useDialog } from 'zxui'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 定义导入表单数据接口
interface ImportFormData {
  baseDataName: string
  file: File | null
}

// 定义事件
const emit = defineEmits<{
  success: [data?: any]
}>()

// 表单引用
const formRef = ref()
const uploadRef = ref()

// 文件列表
const fileList = ref([])

// 表单验证规则
const formRules = computed(() => ({
  baseDataName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
  file: [{ required: true, message: '请选择导入文件', trigger: 'change' }]
}))

// 清理文件状态的通用函数
const clearFileState = () => {
  fileList.value = []
  state.data.file = null
  
  // 立即清理上传组件状态
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  
  // 延时再次确保清理，防止组件状态同步延迟
  setTimeout(() => {
    fileList.value = []
    state.data.file = null
    if (uploadRef.value) {
      uploadRef.value.clearFiles()
    }
  }, 100)
}

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open } = useDialog<ImportFormData>({
  // 对话框配置
  title: '导入数据源',
  width: '45%',

  // 表单配置
  formRef: formRef,
  preValidate: true,
  autoScrollToError: true,

  // 默认数据
  defaultData: () => ({
    baseDataName: '',
    file: null
  }),

  // 确认回调
  onConfirm: async (data) => {
    if (!data.file) {
      ElMessage.error('请选择导入文件')
      throw new Error('请选择导入文件')
    }

    // 调用导入 API
    const response = await dataConnectionApi.importDataSource(data.baseDataName, data.file)

    // 导入成功后立即清理文件状态
    clearFileState()
    
    emit('success', response)
    return response
  },

  // 错误处理回调
  onConfirmError: (error: any) => {
  },

  // 打开后回调 - 重置文件列表
  onOpened: () => {
    clearFileState()
  },

  // 关闭后回调 - 清理文件列表
  onClosed: () => {
    clearFileState()
  }
})

// 文件列表变化处理
const handleFileListChange = (files: any[]) => {
  console.log('handleFileListChange', files)
  
  if (files.length > 0) {
    // 获取最新的文件（raw 是原始 File 对象）
    const latestFile = files[files.length - 1]
    const file = latestFile.raw || latestFile
    
    // 更新表单数据
    state.data.file = file
    
    // 触发表单验证
    formRef.value?.validateField('file')
  } else {
    state.data.file = null
    formRef.value?.validateField('file')
  }
}

// 文件上传前的验证
const handleBeforeUpload = (file: File) => {
  // 文件类型验证
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/json', // .json
    'application/xml', // .xml
    'text/xml' // .xml
  ]

  const allowedExtensions = ['.xlsx', '.xls', '.csv', '.json', '.xml']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    ElMessage.error('文件格式不支持，请选择 .xlsx, .xls, .csv, .json, .xml 格式的文件')
    return false
  }

  // 文件大小验证（500MB）
  const maxSize = 500 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过 500MB')
    return false
  }

  // 返回 false 阻止自动上传（因为我们设置了 auto-upload: false）
  // 但不阻止文件添加到列表
  return true
}

// 文件超出限制处理
const handleExceed = () => {
  ElMessage.warning('最多只能上传 1 个文件，请先删除已有文件')
}

// 暴露方法给父组件
defineExpose({
  open
})
</script>

<style scoped>
.dialog-form-container {
  padding: 20px 0;
}
</style>