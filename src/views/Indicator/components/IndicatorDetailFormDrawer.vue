<template>
  <ZxDrawer
    v-model="visible"
    :title="isReadOnly ? '指标详情（只读）' : '指标详情'"
    :width="520"
    :mask="true"
    :close-on-press-escape="true"
    :disabled-width-drag="false"
    :show-handle-border="true"
    :mask-closable="true"
    :footer="true"
    :form-ref="formRef"
    :form-model="formData"
    :auto-reset-form="true"
    :pre-validate="true"
    :ok-disabled="isReadOnly"
    :confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div class="indicator-detail-form">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        size="default"
      >
        <!-- 上级指标 - 只有当存在上级指标时才显示 -->
        <el-form-item v-if="formMeta.parentIndicator" label="上级指标">
          <div class="parent-indicator-display">
            <ZxTag
              type="info"
              theme="light"
              size="default"
              :tooltip-disabled="false"
              :max-width="'100%'"
              class="parent-indicator-tag"
            >
              {{ formMeta.parentIndicator }}
            </ZxTag>
          </div>
        </el-form-item>

        <!-- 指标名称 -->
        <el-form-item label="指标名称" prop="properties.content.label">
          <ZxInput
            v-model="formData.properties.content.label"
            placeholder="请输入指标名称"
            maxlength="50"
            show-word-limit
            :disabled="disabledMenu.includes('indicatorName') || isReadOnly"
          />
        </el-form-item>

        <el-form-item label="支撑说明" prop="properties.weight">
          <div class="support-description-field">
            <el-input-number
              v-model="formData.properties.weight"
              placeholder="0"
              :min="0"
              :max="100"
              :precision="0"
              :disabled="disabledMenu.includes('supportDescription') || isReadOnly"
              class="support-input"
            />
            <span class="percent-symbol">%</span>
          </div>
        </el-form-item>

        <!-- 计算模型：仅叶子节点显示 -->
        <el-form-item v-if="isLeafNode" label="计算模型">
          <div class="calculation-model-field">
            <!-- 当有选择的计算模型时，使用ZxTag展示 -->
            <div v-if="calculationModelName" class="calculation-model-display">
              <ZxTag
                type="primary"
                size="default"
                :tooltip="calculationModelName"
                class="calculation-model-tag"
              >
                <span class="model-name-text">{{ calculationModelName }}</span>
              </ZxTag>
              <el-button
                type="primary"
                size="small"
                :disabled="disabledMenu.includes('calculationModel') || isReadOnly"
                @click="openModelSelectDialog"
                style="margin-left: 8px"
              >
                更换
              </el-button>
            </div>

            <!-- 当没有选择计算模型时，显示选择按钮 -->
            <div v-else class="calculation-model-empty">
              <span class="empty-text">未选择计算模型</span>
              <el-button
                type="primary"
                :disabled="disabledMenu.includes('calculationModel') || isReadOnly"
                @click="openModelSelectDialog"
                style="margin-left: 8px"
              >
                选择
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!-- 类型 -->
        <el-form-item label="类型" prop="properties.customType">
          <ZxInput
            v-model="formData.properties.customType"
            placeholder="请输入类型"
            :disabled="disabledMenu.includes('customType') || isReadOnly"
          />
        </el-form-item>

        <!-- 属性 -->
        <el-form-item label="属性" prop="properties.customProperties">
          <ZxInput
            v-model="formData.properties.customProperties"
            placeholder="请输入属性"
            :disabled="disabledMenu.includes('customProperties') || isReadOnly"
          />
        </el-form-item>

        <!-- 单位 -->
        <el-form-item label="单位" prop="properties.unit">
          <ZxInput
            v-model="formData.properties.unit"
            placeholder="请输入单位"
            :disabled="disabledMenu.includes('unit') || isReadOnly"
          />
        </el-form-item>

        <!-- 优先级 -->
        <el-form-item label="优先级" prop="properties.priority">
          <ZxInput
            v-model="formData.properties.priority"
            placeholder="请输入优先级"
            :disabled="disabledMenu.includes('priority') || isReadOnly"
          />
        </el-form-item>

        <!-- 默认值 -->
        <el-form-item label="默认值" prop="properties.defaultValue">
          <ZxInput
            v-model="formData.properties.defaultValue"
            placeholder="请输入默认值"
            :disabled="disabledMenu.includes('defaultValue') || isReadOnly"
          />
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注" prop="properties.notes">
          <ZxInput
            v-model="formData.properties.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            :disabled="disabledMenu.includes('notes') || isReadOnly"
          />
        </el-form-item>

        <!-- 算法参数配置 -->
        <template v-if="algoType">
          <AlgorithmFormFields
            :model-value="algorithmFormData"
            :algo-type="algoType"
            :disabled="isReadOnly"
            @update:model-value="handleAlgorithmFormDataUpdate"
          />
        </template>
      </el-form>
    </div>

    <!-- 计算模型选择对话框 -->
    <ModelSelectDialog
      v-model="showModelSelectDialog"
      :default-selected-id="calculationModelId"
      @confirm="handleModelSelect"
      @cancel="handleModelSelectCancel"
    />
  </ZxDrawer>
</template>

<script setup>
import { ref, reactive, computed, watch, isRef } from 'vue'
import ModelSelectDialog from './ModelSelectDialog.vue'
import AlgorithmFormFields from './AlgorithmFormFields.vue'
import {
  cloneNodeForForm,
  createEmptyNodeData,
  prepareNodeSubmitData
} from '../utils/indicatorMapper'

// Props 定义
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  indicatorData: {
    type: Object,
    default: () => ({})
  },
  parentIndicatorName: {
    type: String,
    default: ''
  },
  isLeafNode: {
    type: Boolean,
    default: true
  },
  disabledMenu: {
    type: Array,
    default: () => []
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  // 算法类型：2-模糊综合法，3-TOPSIS算法
  algoType: {
    type: Number,
    default: null
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

// 响应式数据
const formRef = ref(null)
const showModelSelectDialog = ref(false)
const algorithmFormData = ref({})
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 表单数据
const formData = reactive(cloneNodeForForm())
const formMeta = reactive({
  parentIndicator: props.parentIndicatorName || '',
  isLeafNode: props.isLeafNode
})

const extractNodePayload = (payload) => (isRef(payload) ? payload.value : payload)

const cloneModel = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return payload
  }
  try {
    return JSON.parse(JSON.stringify(payload))
  } catch (error) {
    return payload
  }
}

// 计算属性
const isLeafNode = computed(() => formMeta.isLeafNode)
const calculationModelName = computed(() => {
  const data = formData.properties.otherData || {}
  return data.oprModelName || data.name || data.title || data.label || ''
})
const calculationModelId = computed(() => formData.properties.otherData?.id || null)

// 表单验证规则
const formRules = {
  'properties.content.label': [
    { required: true, message: '请输入指标名称', trigger: 'blur' },
    { max: 50, message: '指标名称不能超过50个字符', trigger: 'blur' }
  ],
  'properties.weight': [
    { type: 'number', min: 0, max: 100, message: '支撑说明必须在0-100之间', trigger: 'blur' }
  ]
}

// 监听指标数据变化，更新表单
watch(
  () => props.indicatorData,
  (newData) => {
    const resolved = extractNodePayload(newData)
    if (resolved && Object.keys(resolved).length > 0) {
      const nextState = cloneNodeForForm(resolved)
      Object.assign(formData, nextState)

      // 提取算法参数数据从 properties.algo 字段
      const algoData = resolved.properties?.algo || {}
      if (algoData && Object.keys(algoData).length > 0) {
        const { algoType, ...algorithmParams } = algoData
        algorithmFormData.value = algorithmParams
      } else {
        algorithmFormData.value = {}
      }
    } else {
      Object.assign(formData, createEmptyNodeData())
      algorithmFormData.value = {}
    }
  },
  { immediate: true }
)

watch(
  () => props.parentIndicatorName,
  (val) => {
    formMeta.parentIndicator = extractNodePayload(val) || ''
  },
  { immediate: true }
)

watch(
  () => props.isLeafNode,
  (val) => {
    const resolved = extractNodePayload(val)
    formMeta.isLeafNode = !!resolved
    if (!formMeta.isLeafNode) {
      formData.properties.otherData = {}
    }
  },
  { immediate: true }
)

// 打开模型选择对话框
const openModelSelectDialog = () => {
  if (props.isReadOnly) {
    return // 只读模式下不允许打开模型选择对话框
  }
  showModelSelectDialog.value = true
}

// 处理模型选择确认
const handleModelSelect = (selectedModel) => {
  formData.properties.otherData = cloneModel(selectedModel) || {}
  showModelSelectDialog.value = false
}

// 处理模型选择取消
const handleModelSelectCancel = () => {
  showModelSelectDialog.value = false
}

// 处理算法表单数据更新
const handleAlgorithmFormDataUpdate = (data) => {
  algorithmFormData.value = data
}

// 事件处理函数
const handleConfirm = async () => {
  // 只读模式下不执行确认逻辑
  if (props.isReadOnly) {
    return false
  }

  try {
    // 表单验证
    await formRef.value.validate()

    // 准备提交数据
    const submitData = prepareNodeSubmitData(formData, { isLeafNode: formMeta.isLeafNode })

    // 合并算法参数数据到 properties.algo 字段
    if (
      props.algoType &&
      algorithmFormData.value &&
      Object.keys(algorithmFormData.value).length > 0
    ) {
      submitData.properties = {
        ...submitData.properties,
        algo: {
          algoType: props.algoType,
          ...algorithmFormData.value
        }
      }
    } else if (props.algoType) {
      // 即使没有算法参数数据，也要保存 algoType
      submitData.properties = {
        ...submitData.properties,
        algo: {
          algoType: props.algoType
        }
      }
    }

    emit('confirm', submitData)

    return true
  } catch (error) {
    return false
  }
}

const handleCancel = () => {
  // 取消时重置算法表单数据
  algorithmFormData.value = {}
  emit('cancel')
}

const handleClose = () => {
  // 关闭时重置算法表单数据
  algorithmFormData.value = {}
  emit('close')
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 重置为默认值
  Object.assign(formData, createEmptyNodeData())
  algorithmFormData.value = {}
  formMeta.parentIndicator = ''
  formMeta.isLeafNode = true
}

// 暴露方法
defineExpose({
  resetForm,
  formRef
})
</script>

<style lang="scss" scoped>
.indicator-detail-form {
  padding: 20px;

  .parent-indicator-display {
    display: flex;
    align-items: center;

    .parent-indicator-tag {
      width: 100%;

      :deep(.zx-tag-content) {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;

        .zx-tag-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .zx-tag-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .support-description-field {
    display: flex;
    align-items: center;
    width: 100%;

    .support-input {
      flex: 1;
    }

    .percent-symbol {
      margin-left: 8px;
      color: var(--el-text-color-regular);
      font-size: 14px;
      flex-shrink: 0;
    }
  }

  .calculation-model-field {
    display: flex;
    align-items: center;
    width: 100%;

    .calculation-model-display {
      display: flex;
      align-items: center;
      width: 100%;

      .calculation-model-tag {
        max-width: 300px;

        .model-name-text {
          display: inline-block;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
      }
    }

    .calculation-model-empty {
      display: flex;
      align-items: center;
      width: 100%;

      .empty-text {
        color: var(--el-text-color-placeholder);
        font-size: 14px;
        flex: 1;
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__label {
      color: var(--el-text-color-primary);
      font-weight: 500;
    }

    .el-form-item__content {
      .el-input,
      .el-select,
      .el-input-number {
        width: 100%;
      }

      .el-textarea {
        .el-textarea__inner {
          resize: vertical;
          min-height: 80px;
        }
      }
    }
  }

  // 支撑说明输入框样式调整
  :deep(.el-input-number) {
    .el-input__inner {
      text-align: left;
    }
  }

  // 主分割线样式
  .main-divider {
    margin: 24px 0 16px 0;
    border-color: var(--el-border-color-light);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .indicator-detail-form {
    padding: 16px;

    :deep(.el-form-item) {
      margin-bottom: 16px;
    }
  }
}
</style>
