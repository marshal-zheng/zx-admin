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
import { indicatorApi } from '@/api/modules/indicator'

defineOptions({ name: 'IndicatorSystemSelector' })

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择指标体系设计'
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

// 获取指标体系设计选项 - 供ZxSelect的remote-func使用
const loadOptions = async () => {
  try {
    console.log('🚀 开始加载指标体系选项...')
    const response = await indicatorApi.getIndicatorSystemOptions()
    console.log('📥 指标体系API响应:', response)
    // 返回选项数组供ZxSelect使用
    const options = Array.isArray(response) ? response : response?.data || []
    console.log('📋 处理后的指标体系选项数据:', options)
    return options
  } catch (error) {
    console.error('❌ 获取指标体系设计选项失败:', error)
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
.indicator-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.indicator-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
  flex: 1;
}

.indicator-count {
  padding: 2px 6px;
  margin-left: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  border-radius: 10px;
}
</style>
