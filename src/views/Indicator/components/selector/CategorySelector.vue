<template>
  <ZxSelect
    v-model="innerValue"
    mode="remote"
    :remote-func="fetchOptions"
    :allow-search="true"
    :not-auto-init-search="true"
    labelKey="clazzName"
    valueKey="id"
    :allow-clear="true"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    @change="onChange"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
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
  const response = await categoryApi.getCategoryList({ query: { page: 1, size: 999 } })
  return response?.records || []
}

const onChange = (val) => {
  console.log('val', val)
  emit('change', val)
}
</script>
