<template>
  <ZxDialog v-bind="dialogProps" v-on="dialogEvents" ok-text="确定导出">
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="state.data"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="选择导出模板" prop="templateId">
          <SelectExportTemplate
            v-model="state.data.templateId"
            placeholder="请选择导出模板"
            @change="handleTemplateChange"
          />
        </el-form-item>
        <el-form-item label="导出文件类型" prop="fileType">
          <SelectFileType
            v-model="state.data.fileType"
            placeholder="请选择导出文件类型"
            @change="handleFileTypeChange"
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
import { SelectExportTemplate, SelectFileType } from './selector'
import { evaluationApi } from '@/api/modules/evaluation'

// 定义导出表单数据接口
interface ExportFormData {
  taskId?: string | number
  taskName?: string
  resultId?: string | number
  jobId?: string | number
  templateId: string | number
  fileType: string
}

// 定义事件
const emit = defineEmits<{
  success: [data?: any]
}>()

// 表单引用
const formRef = ref()

// 表单验证规则
const formRules = computed(() => ({
  templateId: [{ required: true, message: '请选择导出模板', trigger: 'change' }],
  fileType: [{ required: true, message: '请选择导出文件类型', trigger: 'change' }]
}))

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open, close, setLoading } = useDialog<ExportFormData>({
  // 动态标题
  title: (data) => {
    return data.taskName ? `导出报告 - ${data.taskName}` : '导出报告'
  },

  // 对话框配置
  width: '40%',
  okText: '确定导出',

  // 表单配置
  formRef: formRef,
  preValidate: true,
  autoScrollToError: true,

  // 默认数据
  defaultData: () => ({
    taskId: '',
    taskName: '',
    resultId: '',
    jobId: '',
    templateId: '',
    fileType: ''
  }),

  // 数据转换
  dataTransform: (raw: ExportFormData) => ({
    taskId: raw.taskId || '',
    taskName: raw.taskName || '',
    resultId: raw.resultId || '',
    jobId: raw.jobId || '',
    templateId: raw.templateId || '',
    fileType: raw.fileType || ''
  }),

  // 确认回调
  onConfirm: async (data) => {
    // 准备提交数据
    const submitData = {
      templateId: data.templateId,
      taskId: data.taskId,
      fileType: data.fileType,
      resultId: data.resultId,
      jobId: data.jobId
    }

    // 调用导出接口
    const response = await evaluationApi.exportEvaluationReport(submitData)

    ElMessage.success(`${data.fileType.toUpperCase()} 格式的报告已生成成功！`)

    // 触发成功事件，通知父组件
    emit('success', response)
    return response
  },

  // 错误处理回调
  onConfirmError: (error: any) => {
    console.error('导出失败:', error)
    // 显示错误提示
    const errorMsg = error?.response?.data?.message || error?.message || '导出失败，请重试'
    ElMessage.error(errorMsg)
  }
})

// 模板变化处理
const handleTemplateChange = (val: any) => {
  console.log('选择的模板:', val)
}

// 文件类型变化处理
const handleFileTypeChange = (val: string) => {
  console.log('选择的文件类型:', val)
}

// 暴露方法给父组件
defineExpose({
  open: (taskData?: ExportFormData) => {
    if (taskData) {
      open(taskData)
    } else {
      open()
    }
  },
  close
})
</script>

<style scoped lang="scss">
.dialog-form-container {
  padding: 16px 0;
}
</style>
