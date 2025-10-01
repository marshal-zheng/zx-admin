<template>
  <ZxSelect
    v-model="innerValue"
    mode="local"
    :options="dataSourceTypeOptions"
    :allow-search="false"
    :allow-clear="true"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    @change="onChange"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

defineOptions({ name: 'SelectDataSourceType' })

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  placeholder: {
    type: String,
    default: '数据源类型'
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

// 数据源类型选项
const dataSourceTypeOptions = [
  { label: 'MySql数据库', value: 1 },
  { label: '达梦数据库', value: 2 }
]

watch(
  () => props.modelValue,
  (v) => {
    innerValue.value = v
  }
)

const onChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
