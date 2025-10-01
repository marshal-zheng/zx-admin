<template>
  <ZxDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="50%"
    :ok-text="mode === 'create' ? '创建' : '保存'"
    :show-cancel="true"
    :cancel-text="mode === 'view' ? '关闭' : '取消'"
    :confirm="handleSubmit"
    :form-ref="formRef"
    :form-model="formData"
    :auto-scroll-to-error="true"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      label-position="right"
      class="form-container"
    >
      <!-- 必填项 -->
      <div class="form-section">
        <h4 class="section-title">基本信息</h4>

        <el-form-item label="指标体系名称" prop="name" required>
          <el-input
            v-model="formData.name"
            placeholder="请输入指标体系名称"
            maxlength="50"
            show-word-limit
            :disabled="mode === 'view'"
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="所属分类" prop="category" required>
          <SelectCategory
            v-model="formData.category"
            placeholder="请选择所属分类"
            :disabled="mode === 'view'"
            class="form-input"
          />
        </el-form-item>
      </div>

      <!-- 选填项 -->
      <div class="form-section">
        <h4 class="section-title">描述信息</h4>

        <el-form-item label="指标体系描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入指标体系描述"
            maxlength="200"
            show-word-limit
            :disabled="mode === 'view'"
            class="form-input"
          />
        </el-form-item>
      </div>
    </el-form>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ZxDialog from '@/components/pure/ZxDialog'
import SelectCategory from './selector/SelectCategory.vue'
import { indicatorSystemApi } from '../mock.js'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  indicatorSystemData: {
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

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 弹窗标题
const dialogTitle = computed(() => {
  const titleMap = {
    create: '新建指标体系',
    edit: '编辑指标体系',
    view: '查看指标体系'
  }
  return titleMap[props.mode] || '指标体系表单'
})

// 表单数据
const formData = reactive({
  name: '',
  category: '',
  description: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入指标体系名称', trigger: 'blur' },
    { min: 2, max: 50, message: '指标体系名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择所属分类', trigger: 'change' }]
}

// 监听数据变化，初始化表单
watch(
  () => props.indicatorSystemData,
  (newData) => {
    if (newData && (props.mode === 'edit' || props.mode === 'view')) {
      Object.assign(formData, {
        name: newData.name || '',
        category: newData.category || '',
        description: newData.description || ''
      })
    }
  },
  { immediate: true }
)

// 监听弹窗显示状态，重置表单
watch(
  () => props.modelValue,
  (visible) => {
    if (visible && props.mode === 'create') {
      resetForm()
    }
  }
)

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    category: '',
    description: ''
  })
  formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()

    const submitData = { ...formData }

    if (props.mode === 'edit') {
      submitData.id = props.indicatorSystemData.id
    }

    // 调用API
    const result =
      props.mode === 'create'
        ? await indicatorSystemApi.create(submitData)
        : await indicatorSystemApi.update(submitData)

    if (result.success) {
      ElMessage.success(props.mode === 'create' ? '创建成功' : '保存成功')
      emit('success', result.data)
      emit('update:modelValue', false)
      return true
    } else {
      ElMessage.error(result.message || '操作失败')
      return false
    }
  } catch (error) {
    console.error('提交失败:', error)
    return false
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 10px 0;
}

.form-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 15px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #ebeef5;
  }
}

.form-input {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}
</style>
