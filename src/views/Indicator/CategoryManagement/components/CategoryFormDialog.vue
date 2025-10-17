<template>
  <ZxDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="45%"
    :ok-text="mode === 'create' ? '创建' : '保存'"
    :show-cancel="true"
    :cancel-text="mode === 'view' ? '关闭' : '取消'"
    :confirm="handleSubmit"
    :form-ref="formRef"
    :form-model="formData"
    :auto-scroll-to-error="true"
    :loading="dialogLoading"
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
        <el-form-item label="分类名称" prop="clazzName" required>
          <el-input
            v-model="formData.clazzName"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
            :disabled="mode === 'view'"
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="分类描述" prop="clazzDescr">
          <el-input
            v-model="formData.clazzDescr"
            type="textarea"
            placeholder="请输入分类描述"
            :rows="3"
            maxlength="200"
            show-word-limit
            :disabled="mode === 'view'"
            class="form-input"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { categoryApi } from '@/api/modules/indicator/category'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categoryData: {
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

// Dialog loading 状态
const dialogLoading = ref(false)

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 弹窗标题
const dialogTitle = computed(() => {
  const titleMap = {
    create: '新建指标分类',
    edit: '编辑指标分类',
    view: '查看指标分类'
  }
  return titleMap[props.mode] || '分类表单'
})

// 表单数据
const formData = reactive({
  clazzName: '',
  clazzDescr: ''
})

// 表单验证规则
const formRules = {
  clazzName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '分类名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  clazzDescr: [{ max: 200, message: '分类描述不能超过 200 个字符', trigger: 'blur' }]
}

// 初始化表单数据
const initFormData = async () => {
  if (props.categoryData && (props.mode === 'edit' || props.mode === 'view')) {
    // 编辑或查看模式，调用接口获取最新数据
    await loadCategoryDetail(props.categoryData.id)
  } else {
    // 新建模式，重置表单
    resetFormData()
  }
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    clazzName: '',
    clazzDescr: ''
  })
}

// 加载分类详情
const loadCategoryDetail = async (id) => {
  dialogLoading.value = true
  try {
    const detail = await categoryApi.getCategoryDetail(id)
    
    // 填充表单数据
    Object.assign(formData, {
      clazzName: detail.clazzName || '',
      clazzDescr: detail.clazzDescr || ''
    })
  } catch (error) {
    ElMessage.error('获取分类详情失败')
    throw error
  } finally {
    dialogLoading.value = false
  }
}

// 表单提交 - 返回 Promise，ZxDialog 会自动处理 loading 状态
const handleSubmit = async () => {
  if (!formRef.value) return

  // 准备提交数据
  const submitData = {
    clazzName: formData.clazzName,
    clazzDescr: formData.clazzDescr
  }

  let requestPromise

  if (props.mode === 'create') {
    requestPromise = categoryApi.createCategory(submitData)
  } else if (props.mode === 'edit') {
    submitData.id = props.categoryData.id
    requestPromise = categoryApi.updateCategory(submitData)
  }

  if (!requestPromise) {
    emit('success')
    return
  }

  const response = await requestPromise
  emit('success', response)
  return response
}

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      await initFormData()
    }
  },
  { immediate: true }
)

// 监听分类数据变化
watch(
  () => props.categoryData,
  async () => {
    if (props.modelValue) {
      await initFormData()
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.dialog-form-container {
  padding: 0;
}

.form-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-light);
  padding-bottom: 8px;
}

.form-input {
  width: 100%;
}

// 只读模式样式
.dialog-form-readonly {
  :deep(.el-input__inner),
  :deep(.el-textarea__inner) {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
  }
}
</style>
