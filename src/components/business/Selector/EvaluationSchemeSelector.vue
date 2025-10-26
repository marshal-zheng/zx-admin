<template>
  <ZxSelect
    v-model="innerValue"
    mode="remote"
    :remote-func="loadOptions"
    :filterable="filterable"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    @change="handleChange"
    @clear="handleClear"
  />
</template>

<script setup>
import { computed } from 'vue'
import { evaluateApi } from '@/api/modules/evaluate'

defineOptions({ name: 'EvaluationSchemeSelector' })

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择评估方案'
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

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 获取评估方案选项 - 供ZxSelect的remote-func使用
const loadOptions = async () => {
  try {
    console.log('🚀 开始加载评估方案选项...')
    const response = await evaluateApi.getEvaluationSchemeOptions()
    console.log('📥 评估方案API响应:', response)
    // 返回选项数组供ZxSelect使用
    const options = Array.isArray(response) ? response : response?.data || []
    console.log('📋 处理后的选项数据:', options)
    return options
  } catch (error) {
    console.error('❌ 获取评估方案选项失败:', error)
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
/* 如果需要自定义样式可以在这里添加 */
</style>
