<template>
  <ZxSelect
    v-model="innerValue"
    :options="options"
    :loading="loading"
    :filterable="filterable"
    :placeholder="placeholder"
    :disabled="disabled"
    labelKey="name"
    valueKey="id"
    @change="onChange"
    @clear="onClear"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { systemTagApi } from '@/api/modules/indicator/systemTag'

defineOptions({ name: 'IndicatorSystemTagSelector' })

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择指标体系标签'
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

// 双向绑定
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const options = ref([])
const loading = ref(false)

const loadOptions = async () => {
  loading.value = true
  try {
    const res = await systemTagApi.getSystemTagList({ current: 1, size: 999 })
    const list = Array.isArray(res) ? res : res?.data?.records || res?.records || res?.data || []
    // 规范化字段为 { id, name }
    options.value = list
      .map((item) => ({
        id: item?.id,
        name: item?.tagName
      }))
      .filter((it) => it && it.id != null && it.name != null)
  } catch (e) {
    console.error('加载指标体系标签列表失败:', e)
    options.value = []
  } finally {
    loading.value = false
  }
}

const onChange = (val) => {
  emit('change', val)
}

const onClear = () => {
  emit('clear')
}

// 组件挂载时立即加载选项
onMounted(() => {
  loadOptions()
})
</script>

<style scoped></style>
