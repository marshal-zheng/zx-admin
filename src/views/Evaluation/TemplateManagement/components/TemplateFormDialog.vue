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
        label-width="120px"
        label-position="right"
      >
        <!-- 必填项 -->
        <div class="form-section">
          <h4 class="section-title">基本信息</h4>

          <el-form-item label="模版名称" prop="name" required>
            <el-input
              v-model="formData.name"
              placeholder="请输入模版名称"
              maxlength="50"
              show-word-limit
              :disabled="mode === 'view'"
              class="form-input"
            />
          </el-form-item>

          <el-form-item label="评估方案" prop="evaluationScheme" required>
            <EvaluationSchemeSelector
              v-model="formData.evaluationScheme"
              placeholder="请选择评估方案"
              :disabled="mode === 'view'"
              class="form-input"
            />
          </el-form-item>

          <el-form-item label="评估算法" prop="evaluationAlgorithm" required>
            <EvaluationAlgorithmSelector
              v-model="formData.evaluationAlgorithm"
              placeholder="请选择评估算法"
              :disabled="mode === 'view'"
              class="form-input"
            />
          </el-form-item>

          <el-form-item label="指标体系设计" prop="indicatorSystem" required>
            <IndicatorSystemSelector
              v-model="formData.indicatorSystem"
              placeholder="请选择指标体系设计"
              :disabled="mode === 'view'"
              class="form-input"
            />
          </el-form-item>
        </div>

        <!-- 选填项 -->
        <div class="form-section">
          <h4 class="section-title">描述信息</h4>

          <el-form-item label="模版描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="请输入模版描述"
              maxlength="200"
              show-word-limit
              :disabled="mode === 'view'"
              class="form-input"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ZxDialog from '@/components/pure/ZxDialog'
import { templateApi } from '@/api/modules/evaluation/template'
import {
  EvaluationSchemeSelector,
  EvaluationAlgorithmSelector,
  IndicatorSystemSelector
} from '@/components/business/Selector'

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
    create: '新建模版',
    edit: '编辑模版',
    view: '查看模版'
  }
  return titleMap[props.mode] || '模版表单'
})

// 表单数据
const formData = reactive({
  name: '',
  description: '',
  evaluationScheme: '',
  evaluationAlgorithm: '',
  indicatorSystem: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入模版名称', trigger: 'blur' },
    { min: 2, max: 50, message: '模版名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  evaluationScheme: [{ required: true, message: '请选择评估方案', trigger: 'change' }],
  evaluationAlgorithm: [{ required: true, message: '请选择评估算法', trigger: 'change' }],
  indicatorSystem: [{ required: true, message: '请选择指标体系设计', trigger: 'change' }]
}

// 初始化表单数据
const initFormData = () => {
  if (props.templateData && (props.mode === 'edit' || props.mode === 'view')) {
    // 编辑或查看模式，填充现有数据
    Object.assign(formData, {
      name: props.templateData.name || '',
      description: props.templateData.description || '',
      evaluationScheme: props.templateData.evaluationScheme || '',
      evaluationAlgorithm: props.templateData.evaluationAlgorithm || '',
      indicatorSystem: props.templateData.indicatorSystem || ''
    })
  } else {
    // 新建模式，重置表单
    resetFormData()
  }
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    name: '',
    description: '',
    evaluationScheme: '',
    evaluationAlgorithm: '',
    indicatorSystem: ''
  })
}

// 表单提交 - 返回 Promise，ZxDialog 会自动处理 loading 状态
const handleSubmit = async () => {
  if (!formRef.value) return

  // 准备提交数据
  const submitData = {
    name: formData.name,
    description: formData.description,
    evaluationScheme: formData.evaluationScheme,
    evaluationAlgorithm: formData.evaluationAlgorithm,
    indicatorSystem: formData.indicatorSystem
  }

  let requestPromise

  if (props.mode === 'create') {
    requestPromise = templateApi.createTemplate(submitData)
  } else if (props.mode === 'edit') {
    requestPromise = templateApi.updateTemplate(props.templateData.id, submitData)
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
