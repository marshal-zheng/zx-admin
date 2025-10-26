<template>
  <ZxSelect
    v-model="innerValue"
    :options="fetchOptions"
    :filterable="filterable"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    label-key="templateName"
    value-key="id"
    clearable
    @change="onChange"
    @clear="onClear"
  >
    <template #option="{ option }">
      <div class="template-option">
        <div class="template-name">{{ option.templateName }}</div>
        <div class="template-meta">
          <el-tag size="small" type="success">
            {{ option.templateType === 1 ? '标准模板' : '自定义模板' }}
          </el-tag>
          <span class="template-time">{{ option.createTime }}</span>
        </div>
      </div>
    </template>
  </ZxSelect>
</template>

<script setup>
import { ref, watch } from 'vue'
import { evaluationApi } from '@/api/modules/evaluation'

defineOptions({ name: 'SelectExportTemplate' })

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择导出模板'
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
  },
  size: {
    type: String,
    default: 'default'
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
  const res = await evaluationApi.getReportTemplateList({
    pageNumber: 1,
    pageSize: 999
  })
  console.log('res', res)
  return res?.records || []
}

const onChange = (val) => {
  emit('change', val)
}

const onClear = () => {
  emit('clear')
}
</script>

<style scoped>
.template-option {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.template-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.template-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
