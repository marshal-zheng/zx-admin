<template>
  <ZxDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :ok-text="mode === 'create' ? '创建' : '保存'"
    :show-cancel="true"
    :cancel-text="mode === 'view' ? '关闭' : '取消'"
    :confirm="handleSubmit"
    :form-ref="formRef"
    :form-model="formData"
    :auto-scroll-to-error="true"
    :class="{ 'dialog-form-readonly': mode === 'view' }"
  >
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="模版名称" prop="taskName">
          <el-input
            v-model="formData.taskName"
            placeholder="请输入模版名称"
            maxlength="50"
            show-word-limit
            :disabled="mode === 'view'"
          />
        </el-form-item>
        <el-form-item label="评估对象" prop="object">
          <el-input
            v-model="formData.object"
            placeholder="请输入评估对象"
            maxlength="100"
            show-word-limit
            :disabled="mode === 'view'"
          />
        </el-form-item>
        <el-form-item label="评估流程" prop="process">
          <el-input
            v-model="formData.process"
            type="textarea"
            placeholder="请输入评估流程"
            :rows="3"
            maxlength="200"
            show-word-limit
            :disabled="mode === 'view'"
          />
        </el-form-item>
        <el-form-item label="评估目的" prop="purpose">
          <el-input
            v-model="formData.purpose"
            type="textarea"
            placeholder="请输入评估目的"
            :rows="3"
            maxlength="200"
            show-word-limit
            :disabled="mode === 'view'"
          />
        </el-form-item>
        <el-form-item label="评估方案" prop="scheme">
          <el-input
            v-model="formData.scheme"
            placeholder="请输入评估方案"
            maxlength="100"
            show-word-limit
            :disabled="mode === 'view'"
          />
        </el-form-item>
        <el-form-item label="模版描述" prop="taskDescribe">
          <el-input
            v-model="formData.taskDescribe"
            type="textarea"
            placeholder="请输入模版描述"
            :rows="4"
            maxlength="200"
            show-word-limit
            :disabled="mode === 'view'"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { evaluationApi } from '@/api/modules/evaluation'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  templateData: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create', // create, edit, view
    validator: (value) => ['create', 'edit', 'view'].includes(value)
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref()

// 响应式数据
// submitLoading 已由 ZxDialog 内部管理，不需要手动维护

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 弹窗标题
const dialogTitle = computed(() => {
  const titleMap = {
    create: '新建任务模版',
    edit: '编辑任务模版',
    view: '查看任务模版'
  }
  return titleMap[props.mode] || '模版表单'
})

// 表单数据
const formData = reactive({
  taskName: '',
  taskDescribe: '',
  object: '',
  process: '',
  purpose: '',
  scheme: ''
})

// 表单验证规则
const formRules = {
  taskName: [
    { required: true, message: '请输入模版名称', trigger: 'blur' },
    { min: 2, max: 50, message: '模版名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  taskDescribe: [{ max: 200, message: '模版描述不能超过 200 个字符', trigger: 'blur' }],
  object: [
    { max: 100, message: '评估对象不能超过 100 个字符', trigger: 'blur' }
  ],
  process: [{ max: 200, message: '评估流程不能超过 200 个字符', trigger: 'blur' }],
  purpose: [{ max: 200, message: '评估目的不能超过 200 个字符', trigger: 'blur' }],
  scheme: [{ max: 100, message: '评估方案不能超过 100 个字符', trigger: 'blur' }]
}

// 初始化表单数据
const initFormData = () => {
  if (props.templateData && (props.mode === 'edit' || props.mode === 'view')) {
    // 编辑或查看模式，填充现有数据
    Object.assign(formData, {
      taskName: props.templateData.taskName || '',
      taskDescribe: props.templateData.taskDescribe || '',
      object: props.templateData.object || '',
      process: props.templateData.process || '',
      purpose: props.templateData.purpose || '',
      scheme: props.templateData.scheme || ''
    })
  } else {
    // 新建模式，重置表单
    resetFormData()
  }
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    taskName: '',
    taskDescribe: '',
    object: '',
    process: '',
    purpose: '',
    scheme: ''
  })
}

// 表单提交 - 返回 Promise，ZxDialog 会自动处理 loading 状态
const handleSubmit = async () => {
  if (!formRef.value) return

  // 准备提交数据
  const submitData = {
    taskName: formData.taskName,
    taskDescribe: formData.taskDescribe,
    object: formData.object,
    process: formData.process,
    purpose: formData.purpose,
    scheme: formData.scheme,
    taskTemplate: 1, // 标记为模版
    taskType: 1
  }

  let requestPromise

  if (props.mode === 'create') {
    requestPromise = evaluationApi.createEvaluation(submitData)
  } else if (props.mode === 'edit') {
    requestPromise = evaluationApi.updateEvaluation({
      ...submitData,
      id: props.templateData.id
    })
  }

  if (!requestPromise) {
    emit('success')
    return
  }

  const response = await requestPromise
  emit('success', response)
  return response
}

// 关闭弹窗
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

// 监听模版数据变化
watch(
  () => props.templateData,
  () => {
    if (props.modelValue) {
      initFormData()
    }
  },
  { deep: true }
)
</script>
