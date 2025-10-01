<template>
  <ZxSelect
    v-model="selectedValue"
    mode="remote"
    :remote-func="loadOptions"
    :allow-search="filterable"
    :allow-clear="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    @change="handleChange"
    @clear="handleClear"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { evaluateApi } from '@/api/modules/evaluate'

defineOptions({ name: 'EvaluationAlgorithmSelector' })

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择评估算法'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear'])

const selectedValue = ref(props.modelValue)

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    selectedValue.value = newVal
  }
)

// 监听内部值变化，同步到外部
watch(selectedValue, (newVal) => {
  emit('update:modelValue', newVal)
})

// 获取评估算法选项 - 供ZxSelect的remote-func使用
const loadOptions = async () => {
  try {
    console.log('🚀 开始加载评估算法选项...')
    const response = await evaluateApi.getEvaluationAlgorithmOptions()
    console.log('📥 评估算法API响应:', response)
    // 返回选项数组供ZxSelect使用
    const options = Array.isArray(response) ? response : response?.data || []
    console.log('📋 处理后的算法选项数据:', options)
    return options
  } catch (error) {
    console.error('❌ 获取评估算法选项失败:', error)
    return []
  }
}

// 处理选择变化
const handleChange = (value) => {
  emit('change', value)
}

// 处理清空
const handleClear = () => {
  emit('clear')
}
</script>

<style scoped>
.algorithm-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.algorithm-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.algorithm-desc {
  font-size: 12px;
  line-height: 1.2;
  color: var(--el-text-color-secondary);
}
</style>
