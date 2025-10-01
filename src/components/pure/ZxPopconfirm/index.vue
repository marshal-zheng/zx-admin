<template>
  <el-popconfirm
    v-model:visible="currentVisible"
    :title="props.title"
    :confirm-button-text="props.okText || '确认'"
    :cancel-button-text="props.cancelText || '取消'"
    :confirm-button-type="props.type === 'error' ? 'danger' : 'primary'"
    :icon="props.isDelete ? WarningFilled : null"
    :icon-color="props.isDelete ? '#f56c6c' : '#409eff'"
    :width="props.isDelete ? 352 : 200"
    :placement="props.isDelete ? 'bottom-end' : 'bottom'"
    :disabled="props.loading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @show="handleOpen"
    @hide="handleClose"
  >
    <template #reference>
      <slot></slot>
    </template>

    <div class="zx-popconfirm__content">
      <!-- 标题和图标 -->
      <div class="zx-popconfirm__header">
        <slot name="icon">
          <el-icon v-if="props.isDelete" class="zx-popconfirm__icon">
            <WarningFilled />
          </el-icon>
        </slot>
        <div class="zx-popconfirm__title">
          {{ props.title || '' }}
        </div>
      </div>

      <!-- 描述展示 -->
      <div v-if="props.subTitleTip" class="zx-popconfirm__subtitle">
        {{ props.subTitleTip }}
      </div>

      <!-- 表单展示 -->
      <el-form
        v-else-if="props.fieldConfig"
        ref="formRef"
        :model="form"
        class="zx-popconfirm__form"
      >
        <el-form-item
          prop="field"
          :rules="
            props.fieldConfig?.rules || [
              { required: true, message: '名称不能为空！' },
              { validator: validateName, trigger: 'blur' }
            ]
          "
        >
          <el-input
            v-if="!props.fieldConfig?.isTextArea"
            v-model="form.field"
            :maxlength="255"
            :placeholder="props.fieldConfig?.placeholder"
            class="zx-popconfirm__input"
            @keyup.enter="handleConfirm"
          />
          <el-input
            v-else
            v-model="form.field"
            type="textarea"
            :maxlength="props.fieldConfig?.maxLength || 1000"
            :rows="4"
            :placeholder="props.fieldConfig?.placeholder"
            class="zx-popconfirm__textarea"
            @keyup.enter="handleConfirm"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-popconfirm>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subTitleTip: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['error', 'info', 'success', 'warning'].includes(value)
  },
  isDelete: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  okText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  visible: {
    type: Boolean,
    default: false
  },
  fieldConfig: {
    type: Object,
    default: null
  },
  allNames: {
    type: Array,
    default: () => []
  },
  nodeId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible', 'open', 'close'])

const currentVisible = ref(props.visible || false)
const formRef = ref()

// 表单数据
const form = ref({
  field: props.fieldConfig?.field || ''
})

// 重置表单
const reset = () => {
  form.value.field = props.fieldConfig?.field || ''
  formRef.value?.resetFields()
}

// 处理取消
const handleCancel = () => {
  currentVisible.value = false
  emit('cancel')
  reset()
}

// 处理确认
const handleConfirm = () => {
  if (!formRef.value) {
    // 没有表单，直接确认
    emit('confirm', { field: form.value.field, id: props.nodeId }, handleCancel)
    return
  }

  // 有表单，先验证
  formRef.value.validate((valid) => {
    if (valid) {
      emit('confirm', { field: form.value.field, id: props.nodeId }, handleCancel)
    }
  })
}

// 处理打开
const handleOpen = () => {
  emit('open')
}

// 处理关闭
const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

// 校验名称是否重复
const validateName = (rule, value, callback) => {
  if ((props.allNames || []).includes(value)) {
    const message = props.fieldConfig?.nameExistTipText || '名称已存在！'
    callback(new Error(message))
  } else {
    callback()
  }
}

// 监听 fieldConfig 变化
watch(
  () => props.fieldConfig?.field,
  (val) => {
    form.value.field = val || ''
  }
)

// 监听 visible 变化
watch(
  () => props.visible,
  (val) => {
    currentVisible.value = val
  }
)

// 监听内部 visible 变化
watch(
  () => currentVisible.value,
  (val) => {
    if (!val) {
      emit('cancel')
    }
    emit('update:visible', val)
  }
)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
