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
import { systemApi } from '@/api/modules/indicator/system'

defineOptions({ name: 'IndicatorSystemSelector' })

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  tagId: {
    type: [String, Number, null],
    default: null
  },
  placeholder: {
    type: String,
    default: '请选择指标体系设计'
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
const optionsList = ref([])

watch(
  () => props.modelValue,
  (v) => {
    innerValue.value = v
  }
)

watch(innerValue, (v) => {
  emit('update:modelValue', v)
})

// 当 tagId 改变时，清空当前选择值
watch(
  () => props.tagId,
  () => {
    innerValue.value = ''
  }
)

const fetchOptions = async () => {
  try {
    const params = { page: 1, pageSize: 999 }
    // 如果有 tagId，则添加到请求参数中
    if (props.tagId) {
      params.tagId = props.tagId
    }

    const res = await systemApi.getSystemList(params)
    const list = Array.isArray(res) ? res : res?.data?.records || res?.records || res?.data || []
    // 规范化字段为 { id, name }
    const options = list
      .map((item) => ({
        id: item?.id ?? item?.evaluaId ?? item?.evaluaid,
        name: item?.name ?? item?.evaluaName
      }))
      .filter((it) => it && it.id != null && it.name != null)
    // 缓存选项列表
    optionsList.value = options
    return options
  } catch (e) {
    console.error('加载指标体系列表失败:', e)
    return []
  }
}

const onChange = (val) => {
  // 找到对应的选项对象
  const selectedOption = optionsList.value.find((opt) => opt.id === val)
  emit('change', val, selectedOption)
}

const onClear = () => {
  emit('clear')
}
</script>

<style scoped></style>
