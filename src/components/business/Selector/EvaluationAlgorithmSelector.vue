<template>
  <ZxSelect
    v-model="innerValue"
    :options="options"
    :placeholder="placeholder"
    :disabled="disabled"
    filterable
    clearable
    @change="onChange"
    @clear="onClear"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { EVALUATION_ALGORITHM_OPTIONS } from '@/constants/evaluation'

defineOptions({ name: 'EvaluationAlgorithmSelector' })

interface OptionItem {
  label: string
  value: number
  description?: string
}

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
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

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const options = ref<OptionItem[]>([])

const loadOptions = () => {
  // 直接设置枚举选项
  options.value = EVALUATION_ALGORITHM_OPTIONS
}

const onChange = (val: number) => {
  // 找到对应的选项对象
  const selectedOption = options.value.find((opt) => opt.value === val)
  emit('change', val, selectedOption)
}

const onClear = () => {
  emit('clear')
}

// 组件挂载时立即加载选项
onMounted(() => {
  loadOptions()
})
</script>
