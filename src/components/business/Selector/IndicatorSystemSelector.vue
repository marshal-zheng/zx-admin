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
import { ref, watch, onMounted, computed } from 'vue'
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

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const options = ref([])
const loading = ref(false)

// 当 tagId 改变时，清空当前选择值并重新加载选项
watch(
  () => props.tagId,
  () => {
    innerValue.value = ''
    loadOptions()
  }
)

const loadOptions = async () => {
  loading.value = true
  try {
    const params = { page: 1, pageSize: 999 }
    // 如果有 tagId，则添加到请求参数中
    if (props.tagId) {
      params.tagId = props.tagId
    }

    const res = await systemApi.getSystemList(params)
    const list = Array.isArray(res) ? res : res?.data?.records || res?.records || res?.data || []
    // 规范化字段为 { id, name }
    options.value = list
      .map((item) => ({
        id: item?.id ?? item?.evaluaId ?? item?.evaluaid,
        name: item?.name ?? item?.evaluaName
      }))
      .filter((it) => it && it.id != null && it.name != null)
  } catch (e) {
    console.error('加载指标体系列表失败:', e)
    options.value = []
  } finally {
    loading.value = false
  }
}

const onChange = (val) => {
  // 找到对应的选项对象
  const selectedOption = options.value.find((opt) => opt.id === val)
  emit('change', val, selectedOption)
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
