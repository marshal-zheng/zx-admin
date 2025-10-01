<template>
  <ZxSelect
    v-model="innerValue"
    mode="remote"
    :remote-func="fetchOptions"
    :allow-search="true"
    :allow-clear="true"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    @change="onChange"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { templateApi } from '@/api/modules/evaluation/template'

defineOptions({ name: 'SelectStatus' })

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
  try {
    const data = await templateApi.getStatusOptions()
    // 期望后端返回 { code, message, data: Array<{ label, value }> }
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

const onChange = (val) => {
  emit('change', val)
}
</script>

<style scoped></style>
