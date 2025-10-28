<template>
  <ZxSelect
    v-model="innerValue"
    :options="dataSourceTypeOptions"
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
import { getDatabaseTypeOptions } from '../utils'

defineOptions({ name: 'SelectDataSourceType' })

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择数据源类型'
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

// 数据源类型选项 - 从model.ts获取，更加灵活可扩展
const dataSourceTypeOptions = getDatabaseTypeOptions()

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
  if (props.autoSelectFirst && !props.modelValue && dataSourceTypeOptions.length > 0) {
    const firstOption = dataSourceTypeOptions[0]
    innerValue.value = firstOption.value
    emit('update:modelValue', firstOption.value)
    emit('change', firstOption.value)
  }
})
</script>

<style lang="less" scoped>
:deep(.zx-select) {
  width: 100%;
}
</style>
