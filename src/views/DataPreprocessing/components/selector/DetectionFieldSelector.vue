<template>
  <zx-select
    :model-value="modelValue"
    :options="loadFieldOptions"
    multiple
    placeholder="请选择检测字段"
    @update:model-value="handleChange"
  />
</template>

<script setup lang="ts">
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'
import { ElMessage } from 'element-plus'

interface TableField {
  name: string
  comment: string
  type: string
}

interface Props {
  modelValue?: string[]
  tableName: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const handleChange = (value: string[]) => {
  console.log('DetectionFieldSelector 值变化:', value)
  emit('update:modelValue', value)
}

// 加载字段选项的函数 - zx-select 会自动调用
const loadFieldOptions = async () => {
  console.log('DetectionFieldSelector 加载字段选项, tableName:', props.tableName)
  if (!props.tableName) {
    console.warn('tableName 为空，无法加载字段选项')
    return []
  }

  try {
    const response = await datasetsApi.getTableField(props.tableName)

    let fields: TableField[] = []
    if (Array.isArray(response)) {
      fields = response
    } else if (response?.data && Array.isArray(response.data)) {
      fields = response.data
    }

    return fields.map((field) => ({
      label: field.name,
      value: field.name
    }))
  } catch (error) {
    console.error('获取表字段失败:', error)
    ElMessage.error('获取表字段失败')
    return []
  }
}
</script>
