<template>
  <div class="algorithm-form-fields">
    <!-- 根据算法类型渲染不同的表单字段 -->
    <template v-if="currentAlgorithmType">
      <!-- 算法配置区域标题 -->
      <el-divider content-position="left" class="algorithm-section-divider">
        <span class="algorithm-section-title">
          <el-icon class="algorithm-icon"><Setting /></el-icon>
          算法参数配置
          <ZxTag type="success" theme="light" size="small" class="algorithm-type-tag-inline">
            {{ algorithmTypeName }}
          </ZxTag>
        </span>
      </el-divider>

      <!-- 模糊综合法字段 -->
      <template v-if="currentAlgorithmType === ALGORITHM_TYPES.FUZZY_COMPREHENSIVE">
        <el-form-item label="模糊类型" prop="fuzzyType">
          <FuzzyTypeSelector
            v-model="formData.fuzzyType"
            :disabled="disabled"
            placeholder="请选择模糊类型"
          />
        </el-form-item>

        <el-form-item label="模糊描述" prop="fuzzyDesc">
          <ZxInput v-model="formData.fuzzyDesc" placeholder="请输入模糊描述" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="最优评价" prop="fuzzyBest">
          <ZxInput v-model="formData.fuzzyBest" placeholder="请输入最优评价" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="较优评价" prop="fuzzyBetter">
          <ZxInput
            v-model="formData.fuzzyBetter"
            placeholder="请输入较优评价"
            :disabled="disabled"
          />
        </el-form-item>

        <el-form-item label="中等评价" prop="fuzzyMedium">
          <ZxInput
            v-model="formData.fuzzyMedium"
            placeholder="请输入中等评价"
            :disabled="disabled"
          />
        </el-form-item>

        <el-form-item label="较差评价" prop="fuzzyPoor">
          <ZxInput v-model="formData.fuzzyPoor" placeholder="请输入较差评价" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="最差评价" prop="fuzzyWorst">
          <ZxInput
            v-model="formData.fuzzyWorst"
            placeholder="请输入最差评价"
            :disabled="disabled"
          />
        </el-form-item>
      </template>

      <!-- TOPSIS算法字段 -->
      <template v-else-if="currentAlgorithmType === ALGORITHM_TYPES.TOPSIS">
        <el-form-item label="TOPSIS类型" prop="topType">
          <TopsisTypeSelector
            v-model="formData.topType"
            :disabled="disabled"
            placeholder="请选择TOPSIS类型"
          />
        </el-form-item>

        <el-form-item label="TOPSIS描述" prop="topDesc">
          <ZxInput v-model="formData.topDesc" placeholder="请输入TOPSIS描述" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="最优值" prop="topBest">
          <ZxInput v-model="formData.topBest" placeholder="请输入最优值" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="最差值" prop="topWorst">
          <ZxInput v-model="formData.topWorst" placeholder="请输入最差值" :disabled="disabled" />
        </el-form-item>
      </template>

      <!-- 未知算法类型 -->
      <template v-else>
        <el-form-item>
          <div class="unknown-algorithm">
            <el-alert
              title="未知的算法类型"
              :description="`当前算法类型 ${currentAlgorithmType} 暂不支持，请联系系统管理员`"
              type="warning"
              :closable="false"
              show-icon
            />
          </div>
        </el-form-item>
      </template>
    </template>

    <!-- 未设置算法类型 -->
    <template v-else>
      <el-form-item>
        <div class="no-algorithm">
          <el-alert
            title="未设置算法类型"
            description="请在上级组件中设置算法类型以显示相应的算法参数配置"
            type="info"
            :closable="false"
            show-icon
          />
        </div>
      </el-form-item>
    </template>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref } from 'vue'
import { Setting, InfoFilled } from '@element-plus/icons-vue'
import FuzzyTypeSelector from './selector/FuzzyTypeSelector.vue'
import TopsisTypeSelector from './selector/TopsisTypeSelector.vue'
import {
  ALGORITHM_TYPES,
  getAlgorithmTypeName,
  isValidAlgorithmType
} from '../constants/algorithmTypes'

// Props 定义
const props = defineProps({
  // 算法类型
  algoType: {
    type: Number,
    default: null
  },
  // 表单数据模型
  modelValue: {
    type: Object,
    default: () => ({})
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const formData = reactive({
  // 模糊综合法字段
  fuzzyType: null,
  fuzzyDesc: '',
  fuzzyBest: '',
  fuzzyBetter: '',
  fuzzyMedium: '',
  fuzzyPoor: '',
  fuzzyWorst: '',

  // TOPSIS算法字段
  topType: null,
  topDesc: '',
  topBest: '',
  topWorst: ''
})

// 计算属性
const currentAlgorithmType = computed(() => {
  const type = props.algoType
  return isValidAlgorithmType(type) ? type : null
})

const algorithmTypeName = computed(() => {
  return currentAlgorithmType.value ? getAlgorithmTypeName(currentAlgorithmType.value) : ''
})

// 根据算法类型获取相关字段
const getFieldsByAlgorithmType = (type) => {
  switch (type) {
    case ALGORITHM_TYPES.FUZZY_COMPREHENSIVE:
      return [
        'fuzzyType',
        'fuzzyDesc',
        'fuzzyBest',
        'fuzzyBetter',
        'fuzzyMedium',
        'fuzzyPoor',
        'fuzzyWorst'
      ]
    case ALGORITHM_TYPES.TOPSIS:
      return ['topType', 'topDesc', 'topBest', 'topWorst']
    default:
      return []
  }
}

// 监听算法类型变化，清理不相关字段的数据
watch(
  () => props.algoType,
  (newType, oldType) => {
    if (newType !== oldType) {
      // 设置标记，防止循环更新
      isUpdatingFromExternal.value = true

      try {
        // 获取新算法类型的字段
        const newFields = getFieldsByAlgorithmType(newType)
        const oldFields = getFieldsByAlgorithmType(oldType)

        // 清理旧字段的数据
        oldFields.forEach((field) => {
          if (!newFields.includes(field)) {
            formData[field] = getDefaultValueForField(field)
          }
        })
      } finally {
        // 重置标记
        isUpdatingFromExternal.value = false
      }

      // 触发数据更新
      emitFormData()
    }
  }
)

// 获取字段的默认值
const getDefaultValueForField = (field) => {
  if (['fuzzyType', 'topType'].includes(field)) {
    return null
  }
  return ''
}

// 标记是否正在更新外部数据，避免循环更新
const isUpdatingFromExternal = ref(false)

// 监听表单数据变化
watch(
  () => formData,
  () => {
    // 如果正在从外部更新数据，则不触发 emit
    if (!isUpdatingFromExternal.value) {
      emitFormData()
    }
  },
  { deep: true }
)

// 监听外部数据变化
watch(
  () => props.modelValue,
  (newValue) => {
    console.log('AlgorithmFormFields - 外部数据变化:', newValue)

    // 设置标记，防止循环更新
    isUpdatingFromExternal.value = true

    // 首先重置所有字段为默认值
    Object.keys(formData).forEach((key) => {
      formData[key] = getDefaultValueForField(key)
    })

    // 然后设置新的值
    if (newValue && typeof newValue === 'object') {
      Object.keys(newValue).forEach((key) => {
        if (formData.hasOwnProperty(key)) {
          formData[key] = newValue[key]
        }
      })
    }

    console.log('AlgorithmFormFields - 表单数据已更新:', formData)

    // 延迟重置标记，确保所有响应式更新完成
    setTimeout(() => {
      isUpdatingFromExternal.value = false
    }, 0)
  },
  { immediate: true }
)

// 发送表单数据
const emitFormData = () => {
  // 如果正在从外部更新，不要 emit
  if (isUpdatingFromExternal.value) {
    return
  }

  const currentFields = getFieldsByAlgorithmType(currentAlgorithmType.value)
  const dataToEmit = {}

  // 只包含当前算法类型相关的字段
  currentFields.forEach((field) => {
    dataToEmit[field] = formData[field]
  })

  emit('update:modelValue', dataToEmit)
}

// 验证表单数据
const validateForm = () => {
  const currentFields = getFieldsByAlgorithmType(currentAlgorithmType.value)
  const errors = []

  currentFields.forEach((field) => {
    const value = formData[field]

    // 选择器类型字段验证
    if (['fuzzyType', 'topType'].includes(field)) {
      if (value === null || value === undefined || value === '') {
        errors.push(`${getFieldLabel(field)}不能为空`)
      } else if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
        errors.push(`${getFieldLabel(field)}必须选择有效的选项`)
      }
    }

    // 字符串类型字段验证
    if (
      [
        'fuzzyDesc',
        'fuzzyBest',
        'fuzzyBetter',
        'fuzzyMedium',
        'fuzzyPoor',
        'fuzzyWorst',
        'topDesc',
        'topBest',
        'topWorst'
      ].includes(field)
    ) {
      if (!value || value.trim() === '') {
        errors.push(`${getFieldLabel(field)}不能为空`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

// 获取字段标签
const getFieldLabel = (field) => {
  const labels = {
    fuzzyType: '模糊类型',
    fuzzyDesc: '模糊描述',
    fuzzyBest: '最优评价',
    fuzzyBetter: '较优评价',
    fuzzyMedium: '中等评价',
    fuzzyPoor: '较差评价',
    fuzzyWorst: '最差评价',
    topType: 'TOPSIS类型',
    topDesc: 'TOPSIS描述',
    topBest: '最优值',
    topWorst: '最差值'
  }
  return labels[field] || field
}

// 重置表单
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = getDefaultValueForField(key)
  })
  emitFormData()
}

// 暴露方法
defineExpose({
  validateForm,
  resetForm,
  formData
})
</script>

<style lang="scss" scoped>
.algorithm-form-fields {
  // 主分割线样式
  .algorithm-section-divider {
    margin: 24px 0 20px 0;

    :deep(.el-divider__text) {
      background-color: var(--el-bg-color);
      padding: 0 16px;
    }

    .algorithm-section-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-color-primary);
      gap: 8px;

      .algorithm-icon {
        font-size: 18px;
      }

      .algorithm-type-tag-inline {
        margin-left: 4px;

        :deep(.zx-tag-content) {
          font-weight: 500;
          font-size: 12px;
        }
      }
    }
  }

  .unknown-algorithm,
  .no-algorithm {
    width: 100%;

    :deep(.el-alert) {
      border-radius: 6px;

      .el-alert__title {
        font-size: 14px;
        font-weight: 500;
      }

      .el-alert__description {
        font-size: 12px;
        margin-top: 4px;
        line-height: 1.4;
      }
    }
  }

  // 表单项样式
  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__label {
      color: var(--el-text-color-primary);
      font-weight: 500;
      font-size: 14px;
    }

    .el-form-item__content {
      .el-input,
      .el-input-number {
        width: 100%;
      }

      .el-input {
        :deep(.el-input__wrapper) {
          border-radius: 6px;
          transition: all 0.2s ease;

          &:hover {
            box-shadow: 0 0 0 1px var(--el-color-primary-light-7);
          }

          &.is-focus {
            box-shadow: 0 0 0 1px var(--el-color-primary);
          }
        }
      }
    }

    // 最后一个表单项去除下边距
    &:last-child {
      margin-bottom: 0;
    }
  }

  // 输入框数字样式
  :deep(.el-input-number) {
    .el-input__inner {
      text-align: left;
    }

    .el-input__wrapper {
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 0 0 1px var(--el-color-primary-light-7);
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .algorithm-form-fields {
    .algorithm-section-divider {
      margin: 20px 0 16px 0;

      .algorithm-section-title {
        font-size: 15px;

        .algorithm-icon {
          font-size: 16px;
        }
      }
    }

    :deep(.el-form-item) {
      margin-bottom: 16px;

      .el-form-item__label {
        font-size: 13px;
      }
    }
  }
}
</style>
