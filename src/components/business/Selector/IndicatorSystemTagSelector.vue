<template>
  <ZxSelect
    v-model="innerValue"
    :options="fetchOptions"
    :allow-search="filterable"
    :placeholder="placeholder"
    :disabled="disabled"
    labelKey="name"
    valueKey="id"
    @change="onChange"
    @clear="onClear"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
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

const innerValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    innerValue.value = v
  }
)

watch(innerValue, (v) => {
  emit('update:modelValue', v)
})

const fetchOptions = async () => {
  try {
    const res = await systemTagApi.getSystemTagList({ current: 1, size: 999 })
    const list = Array.isArray(res) ? res : res?.data?.records || res?.records || res?.data || []
    // 规范化字段为 { id, name }
    const options = list
      .map((item) => ({
        id: item?.id,
        name: item?.tagName
      }))
      .filter((it) => it && it.id != null && it.name != null)
    return options
  } catch (e) {
    console.error('加载指标体系标签列表失败:', e)
    return []
  }
}

const onChange = (val) => {
  emit('change', val)
}

const onClear = () => {
  emit('clear')
}
</script>

<style scoped></style>
