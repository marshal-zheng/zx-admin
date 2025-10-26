<template>
  <ZxSelect
    v-model="selectedValue"
    :options="options"
    :loading="loading"
    filterable
    labelKey="clazzName"
    valueKey="id"
    clearable
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    @change="onChange"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { categoryApi } from '@/api/modules/indicator/category'

defineOptions({ name: 'CategorySelector' })

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: ''
  },
  placeholder: {
    type: String,
    default: '选择状态'
  },
  size: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const options = ref([])
const loading = ref(false)

// 使用 computed 实现同步的双向绑定
const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loadOptions = async () => {
  loading.value = true
  try {
    const response = await categoryApi.getCategoryList({ query: { page: 1, size: 999 } })
    options.value = response?.records || []
  } catch (error) {
    console.error('加载分类选项失败:', error)
    options.value = []
  } finally {
    loading.value = false
  }
}

const onChange = (val) => {
  emit('change', val)
}

// 组件挂载时立即加载选项
onMounted(() => {
  loadOptions()
})
</script>
