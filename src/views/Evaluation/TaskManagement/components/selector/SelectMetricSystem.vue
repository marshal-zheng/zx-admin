<template>
  <ZxSelect
    v-model="innerValue"
    :placeholder="placeholder"
    :loading="loading"
    :options="options"
    label-key="name"
    value-key="id"
    allow-search
    allow-clear
    :disabled="disabled"
    :size="size"
    @change="handleChange"
  >
    <template #option="{ option }">
      <div class="metric-system-option">
        <div class="option-title">{{ option.name }}</div>
        <div class="option-desc">{{ option.description }}</div>
        <div class="option-meta">
          <el-tag size="small" type="info">{{ option.indicatorCount }} 个指标</el-tag>
        </div>
      </div>
    </template>
  </ZxSelect>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ZXR from '@/api/http'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择指标体系'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default'
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// 响应式变量
const loading = ref(false)
const options = ref([])

// 双向绑定
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 加载指标体系列表
const loadOptions = async () => {
  loading.value = true
  try {
    const response = await ZXR.get('/api/indicator/system/options')
    options.value = response.data || []
  } catch (error) {
    console.error('加载指标体系失败:', error)
    options.value = []
  } finally {
    loading.value = false
  }
}

// 处理变化
const handleChange = (value) => {
  const matchedOption = options.value.find((item) => item.id === value)
  emit('update:modelValue', value)
  emit('change', matchedOption || value)
}

// 组件挂载时加载数据
onMounted(() => {
  loadOptions()
})
</script>

<style scoped lang="scss">
.metric-system-option {
  padding: 4px 0;

  .option-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .option-desc {
    font-size: 12px;
    color: #909399;
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .option-meta {
    display: flex;
    gap: 6px;
  }
}
</style>
