<template>
  <ZxDialog
    v-bind="dialogProps"
    v-on="dialogEvents"
    :ok-text="currentMode === 'create' ? '下一步' : '确定'"
  >
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="state.data"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="体系分类" prop="categoryId">
          <CategorySelector
            v-model="state.data.categoryId"
            placeholder="请选择体系分类"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="体系名称" prop="name">
          <el-input
            v-model="state.data.name"
            placeholder="请输入体系名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="体系说明" prop="description">
          <el-input
            v-model="state.data.description"
            type="textarea"
            placeholder="请输入体系说明"
            :rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="体系标签" prop="tagId">
          <SystemTagSelector
            v-model="state.data.tagId"
            placeholder="请输入或选择标签，按回车添加"
            :show-tip="true"
            tag-type="primary"
            tag-effect="light"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useDialog } from 'zxui'
import { systemApi } from '@/api/modules/indicator/system'
import { CategorySelector } from '../../components/selector'
import { SystemTagSelector } from './selector'

// 定义指标体系表单数据接口
interface SystemFormData {
  id?: string | number
  categoryId: string
  name: string
  description: string
  tagId: string[]
}

// 当前模式（通过 open 方法的参数自动判断）
const currentMode = ref<'create' | 'edit'>('create')

// 定义事件
const emit = defineEmits<{
  success: [data?: any]
}>()

// 表单引用
const formRef = ref()

// 表单验证规则
const formRules = computed(() => ({
  categoryId: [{ required: true, message: '请选择指标体系分类', trigger: 'change' }],
  name: [
    { required: true, message: '请输入指标体系名称', trigger: 'blur' },
    { min: 2, max: 50, message: '指标体系名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [{ max: 200, message: '指标体系说明不能超过 200 个字符', trigger: 'blur' }]
}))

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open, close, setLoading } = useDialog<SystemFormData>({
  // 动态标题
  title: (data) => {
    if (currentMode.value === 'edit') {
      return data.name ? `编辑指标体系 - ${data.name}` : '编辑基础配置'
    }
    return '新建指标体系'
  },

  // 对话框配置
  width: '50%',
  okText: '确定',

  // 表单配置
  formRef: formRef,
  preValidate: true,
  autoScrollToError: true,

  // 默认数据
  defaultData: () => ({
    categoryId: '',
    name: '',
    description: '',
    tagId: []
  }),

  // 数据转换（编辑时使用）
  dataTransform: (raw: SystemFormData) => ({
    id: raw.id,
    categoryId: raw.categoryId || '',
    name: raw.name || '',
    description: raw.description || '',
    tagId: raw.tagId || []
  }),

  // 确认回调
  onConfirm: async (data) => {
    // 准备提交数据
    const submitData = {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      tagId: data.tagId
    }

    let response
    if (currentMode.value === 'edit' && data.id) {
      // 编辑模式：直接全量提交
      response = await systemApi.updateSystem({ id: data.id, ...submitData })
    } else {
      // 创建模式：保持原逻辑，交由父组件处理下一步
      response = submitData
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
  open: async (dataOrMode?: SystemFormData | 'create' | 'edit', systemData?: SystemFormData) => {
    if (typeof dataOrMode === 'string') {
      // 传入的是模式字符串 (兼容原有的调用方式)
      currentMode.value = dataOrMode
      if (systemData) {
        open(systemData)
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
