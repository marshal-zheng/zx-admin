<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="体系分类" prop="categoryId">
        <CategorySelector
          v-model="formData.categoryId"
          placeholder="请选择体系分类"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="体系名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入体系名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="体系说明" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入体系说明"
          :rows="4"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <ZxButton @click="handleClose">取消</ZxButton>
        <ZxButton type="primary" :loading="loading" @click="handleSubmit">
          {{ mode === 'create' ? '创建' : '保存' }}
        </ZxButton>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { indicatorTemplateApi } from '@/api/modules/indicator/template'
import CategorySelector from '../selector/CategorySelector.vue'

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
    default: 'create' // create | edit
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const formRef = ref()

// 表单数据
const formData = ref({
  categoryId: '',
  name: '',
  description: ''
})

// 表单验证规则
const formRules = {
  categoryId: [{ required: true, message: '请选择体系分类', trigger: 'change' }],
  name: [
    { required: true, message: '请输入体系名称', trigger: 'blur' },
    { min: 2, max: 50, message: '体系名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [{ max: 200, message: '体系说明不能超过 200 个字符', trigger: 'blur' }]
}

// 计算属性
const dialogTitle = computed(() => {
  return props.mode === 'create' ? '新建模版' : '编辑模版'
})

// 重置表单
const resetForm = () => {
  formData.value = {
    categoryId: '',
    name: '',
    description: ''
  }
  formRef.value?.clearValidate()
}

// 监听数据变化
watch(
  () => props.templateData,
  (newData) => {
    if (newData) {
      formData.value = {
        categoryId: newData.categoryId || '',
        name: newData.name || '',
        description: newData.description || ''
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    const submitData = { ...formData.value }

    if (props.mode === 'create') {
      await indicatorTemplateApi.createTemplate(submitData)
      ElMessage.success('模版创建成功')
    } else {
      submitData.id = props.templateData.id
      await indicatorTemplateApi.updateTemplate(submitData)
      ElMessage.success('模版更新成功')
    }

    emit('success')
  } catch (error) {
    console.error('表单提交失败:', error)
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  resetForm()
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
