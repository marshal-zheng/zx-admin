<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :multiple="multiple"
    :size="size"
    :loading="loading"
    @change="handleChange"
    @clear="handleClear"
    class="select-category"
  >
    <el-option
      v-for="item in categoryOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 定义 props
const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择分类'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default'
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change', 'clear'])

// 响应式数据
const loading = ref(false)

// 分类选项数据
const categoryOptions = ref([
  {
    label: '管理效能',
    value: 'management_efficiency',
    disabled: false
  },
  {
    label: '技术能力',
    value: 'technical_capability',
    disabled: false
  },
  {
    label: '服务质量',
    value: 'service_quality',
    disabled: false
  },
  {
    label: '创新能力',
    value: 'innovation_capability',
    disabled: false
  },
  {
    label: '风险控制',
    value: 'risk_control',
    disabled: false
  },
  {
    label: '资源配置',
    value: 'resource_allocation',
    disabled: false
  },
  {
    label: '人员素质',
    value: 'personnel_quality',
    disabled: false
  },
  {
    label: '成本控制',
    value: 'cost_control',
    disabled: false
  }
])

// 双向绑定
const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 加载分类数据
const loadCategoryData = async () => {
  try {
    loading.value = true
    // 这里可以调用API获取分类数据
    // const result = await categoryApi.getList()
    // categoryOptions.value = result.data

    // 模拟异步加载
    await new Promise((resolve) => setTimeout(resolve, 100))
  } catch (error) {
    console.error('加载分类数据失败:', error)
  } finally {
    loading.value = false
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

// 组件挂载时加载数据
onMounted(() => {
  loadCategoryData()
})

// 暴露方法
defineExpose({
  loadCategoryData
})
</script>

<style lang="scss" scoped>
.select-category {
  width: 100%;
}
</style>
