<template>
  <ZxDialog
    v-bind="dialogProps"
    v-on="dialogEvents"
    :ok-text="currentMode === 'create' ? '创建' : '确定'"
  >
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="state.data"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input
            v-model="state.data.taskName"
            placeholder="请输入任务名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="评估对象" prop="object">
          <el-input
            v-model="state.data.object"
            placeholder="请输入评估对象"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item v-if="currentMode !== 'edit'" label="任务模版" prop="taskTemplate">
          <SelectTaskTemplate v-model="state.data.taskTemplate" placeholder="请选择任务模版" />
        </el-form-item>
        <el-form-item label="评估流程" prop="process">
          <el-input
            v-model="state.data.process"
            type="textarea"
            placeholder="请输入评估流程"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="评估目的" prop="purpose">
          <el-input
            v-model="state.data.purpose"
            type="textarea"
            placeholder="请输入评估目的"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="评估方案" prop="scheme">
          <el-input
            v-model="state.data.scheme"
            placeholder="请输入评估方案"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="任务描述" prop="taskDescribe">
          <el-input
            v-model="state.data.taskDescribe"
            type="textarea"
            placeholder="请输入任务描述"
            :rows="4"
            maxlength="200"
            show-word-limit
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
import { evaluationApi } from '@/api/modules/evaluation'
import { SelectTaskTemplate } from './selector'

// 定义评估任务表单数据接口
interface TaskFormData {
  id?: string | number
  taskName: string
  taskDescribe: string
  object: string
  taskTemplate?: string | number
  process: string
  purpose: string
  scheme: string
}

// 当前模式
const currentMode = ref<'create' | 'edit'>('create')

// 定义事件
const emit = defineEmits<{
  success: [data?: any]
}>()

// 表单引用
const formRef = ref()

// 表单验证规则
const formRules = computed(() => ({
  taskName: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, max: 50, message: '任务名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  taskDescribe: [{ max: 200, message: '任务描述不能超过 200 个字符', trigger: 'blur' }],
  object: [{ max: 100, message: '评估对象不能超过 100 个字符', trigger: 'blur' }],
  process: [{ max: 200, message: '评估流程不能超过 200 个字符', trigger: 'blur' }],
  purpose: [{ max: 200, message: '评估目的不能超过 200 个字符', trigger: 'blur' }],
  scheme: [{ max: 100, message: '评估方案不能超过 100 个字符', trigger: 'blur' }]
}))

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open, close, setLoading } = useDialog<TaskFormData>({
  // 动态标题
  title: (data) => {
    if (currentMode.value === 'edit') {
      return data.taskName ? `编辑评估任务 - ${data.taskName}` : '编辑评估任务'
    }
    return '新建评估任务'
  },

  // 对话框配置
  width: '50%',
  okText: '创建',

  // 表单配置
  formRef: formRef,
  preValidate: true,
  autoScrollToError: true,

  // 默认数据
  defaultData: () => ({
    taskName: '',
    taskDescribe: '',
    object: '',
    taskTemplate: '',
    process: '',
    purpose: '',
    scheme: ''
  }),

  // 数据转换（编辑时使用）
  dataTransform: (raw: TaskFormData) => ({
    id: raw.id,
    taskName: raw.taskName || '',
    taskDescribe: raw.taskDescribe || '',
    object: raw.object || '',
    taskTemplate: raw.taskTemplate || '',
    process: raw.process || '',
    purpose: raw.purpose || '',
    scheme: raw.scheme || ''
  }),

  // 确认回调
  onConfirm: async (data) => {
    // 准备提交数据
    const submitData = {
      formType: 4,
      taskName: data.taskName,
      taskDescribe: data.taskDescribe,
      object: data.object,
      taskTemplate: data.taskTemplate,
      process: data.process,
      purpose: data.purpose,
      scheme: data.scheme,
      taskType: 1
    }

    let response
    if (currentMode.value === 'edit' && data.id) {
      // 编辑模式：调用更新接口
      response = await evaluationApi.updateEvaluation({ id: data.id, ...submitData })
      ElMessage.success('更新成功')
    } else {
      // 创建模式：调用创建接口
      response = await evaluationApi.createEvaluation(submitData)
      ElMessage.success('创建成功')
    }

    // 触发成功事件，通知父组件
    emit('success', response)
    return response
  },

  // 错误处理回调
  onConfirmError: (error: any) => {
    console.error('表单提交失败:', error)
    // 显示错误提示
    const errorMsg = error?.response?.data?.message || error?.message || '操作失败，请重试'
    ElMessage.error(errorMsg)
  }
})

// 暴露方法给父组件
defineExpose({
  open: async (dataOrMode?: TaskFormData | 'create' | 'edit', taskData?: TaskFormData) => {
    if (typeof dataOrMode === 'string') {
      // 传入的是模式字符串
      currentMode.value = dataOrMode
      if (taskData) {
        open(taskData)
      } else {
        open()
      }
    } else if (dataOrMode) {
      // 传入的是完整数据对象
      if (dataOrMode.id) {
        // 有 ID，表示编辑模式
        currentMode.value = 'edit'
      } else {
        // 无 ID，表示新增模式
        currentMode.value = 'create'
      }
      open(dataOrMode)
    } else {
      // 无数据，表示新增模式
      currentMode.value = 'create'
      open()
    }
  }
})
</script>
