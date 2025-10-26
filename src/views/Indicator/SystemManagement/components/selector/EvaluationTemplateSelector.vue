<template>
  <ZxSelect
    v-model="innerValue"
    :placeholder="placeholder"
    :options="loadFieldOptions"
    :transform="transformData"
    label-key="evaluaName"
    value-key="evaluaId"
    filterable
    clearable
    :disabled="disabled"
    :size="size"
    @change="handleChange"
  >
    <template #option="{ option }">
      <div class="evaluation-template-option">
        <div class="option-title">{{ option.evaluaName }}</div>
        <div class="option-desc" v-if="option.evaluaExpplain">{{ option.evaluaExpplain }}</div>
        <div class="option-meta">
          <el-tag size="small" type="success">评估模板</el-tag>
          <el-tag v-if="option.clazzName" size="small" type="info">{{ option.clazzName }}</el-tag>
        </div>
      </div>
    </template>
  </ZxSelect>
</template>

<script setup>
import { systemApi } from '@/api/modules/indicator/system'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择评估模板'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default'
  },
  /**
   * 额外的查询参数
   */
  extraParams: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// 双向绑定
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 使用 optionsPromise 方式加载数据
const loadFieldOptions = async () => {
  const res = systemApi.getSystemList({
    pageNumber: 1,
    pageSize: 999,
    evaluaTemplate: 1,
    ...props.extraParams
  })
  console.log('res2222: ', res)
  return res
}

// 转换数据格式
const transformData = (response) => {
  // ZXR 返回的数据格式可能是 response.data.records 或 response.records
  const records = response?.data?.records || response?.records || []
  return records
}

// 处理变化
const handleChange = (value) => {
  emit('change', value)
}
</script>

<style scoped lang="less">
.evaluation-template-option {
  padding: 4px 0;

  .option-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
  }

  .option-desc {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .option-meta {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
}
</style>
