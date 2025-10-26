<template>
  <ZxSelect
    v-model="innerValue"
    :options="fieldTypeOptions"
    :filterable="false"
    :clearable="false"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    style="width: 100%"
    @change="onChange"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getFieldTypeOptions } from '../utils'

defineOptions({ name: 'FieldTypeSelector' })

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择字段类型'
  },
  size: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  autoSelectFirst: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const innerValue = ref(props.modelValue)

// 字段类型选项 - 从model.ts获取，更加灵活可扩展
const fieldTypeOptions = getFieldTypeOptions()

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

// 组件挂载时自动选择第一个选项
onMounted(() => {
  if (props.autoSelectFirst && !props.modelValue && fieldTypeOptions.length > 0) {
    const firstOption = fieldTypeOptions[0]
    innerValue.value = firstOption.value
    emit('update:modelValue', firstOption.value)
    emit('change', firstOption.value)
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-select) {
  width: 100%;
}
</style>