<template>
  <ZxSelect
    v-model="innerValue"
    mode="static"
    :options="options"
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
import { TemplateTypeOptions } from '@/views/Evaluation/components/model'

defineOptions({ name: 'SelectTemplateType' })

const props = defineProps({
  modelValue: {
    type: [Number, null],
    default: null
  },
  placeholder: {
    type: String,
    default: '选择模板类型'
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

// 从枚举中获取选项
const options = TemplateTypeOptions

watch(
  () => props.modelValue,
  (v) => {
    innerValue.value = v
  }
)

watch(innerValue, (v) => {
  emit('update:modelValue', v)
})

const onChange = (val) => {
  emit('change', val)
}
</script>

<style scoped></style>
