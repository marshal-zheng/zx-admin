<template>
  <ZxDialog
    v-model="visible"
    :title="dialogTitle"
    width="50%"
    :ok-text="mode === 'create' ? '下一步' : '确定'"
    :show-cancel="true"
    :cancel-text="'取消'"
    :confirm="handleSubmit"
    :form-ref="formRef"
    :form-model="formData"
    :auto-scroll-to-error="true"
  >
    <div class="dialog-form-container">
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
    </div>
  </ZxDialog>
</template>

<script setup>
import { systemApi } from '@/api/modules/indicator/system'
import ZxDialog from '@/components/pure/ZxDialog'
import { CategorySelector } from '../../components/selector'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  systemData: {
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

const formRef = ref()

// 表单数据
const formData = ref({
  categoryId: '',
  name: '',
  description: ''
})

// 表单验证规则
const formRules = {
  categoryId: [{ required: true, message: '请选择指标体系分类', trigger: 'change' }],
  name: [
    { required: true, message: '请输入指标体系名称', trigger: 'blur' },
    { min: 2, max: 50, message: '指标体系名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [{ max: 200, message: '指标体系说明不能超过 200 个字符', trigger: 'blur' }]
}

// 计算属性
const dialogTitle = computed(() => {
  return props.mode === 'create' ? '新建指标体系' : '编辑基础配置'
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
  () => props.systemData,
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

// 提交表单 - 返回 Promise，ZxDialog 会自动处理 loading 状态
const handleSubmit = async () => {
  if (!formRef.value) return

  // 准备提交数据
  const submitData = { ...formData.value }

  // 编辑模式：直接全量提交
  if (props.mode === 'edit') {
    const id = props.systemData?.id
    if (!id) {
      return Promise.reject(new Error('缺少体系ID'))
    }
    const res = await systemApi.updateSystem({ id, ...submitData })
    emit('success', res)
    return res
  }

  // 创建模式：保持原逻辑，交由父组件处理下一步
  emit('success', submitData)
  return Promise.resolve(submitData)
}
</script>
