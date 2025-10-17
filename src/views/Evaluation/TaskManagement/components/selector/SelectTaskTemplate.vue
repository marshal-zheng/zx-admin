<template>
  <ZxSelect
    v-model="innerValue"
    :options="fetchOptions"
    :allow-search="filterable"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    label-key="taskName"
    value-key="id"
    @change="onChange"
    @clear="onClear"
  >
    <template #option="{ option }">
      <div class="task-template-option">
        <div class="task-name">{{ option.taskName }}</div>
        <div class="task-desc">{{ option.taskDescribe }}</div>
        <div class="task-meta">
          <el-tag size="small" type="success">模板</el-tag>
          <el-tag size="small" type="info">类型：{{ option.taskType }}</el-tag>
        </div>
      </div>
    </template>
  </ZxSelect>
</template>

<script setup>
import { ref, watch } from 'vue'
import { evaluationApi } from '@/api/modules/evaluation'

defineOptions({ name: 'SelectTaskTemplate' })

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择评估任务模版'
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
  const res = await evaluationApi.getEvaluationList({
    pageNumber: 1,
    pageSize: 999,
    taskTemplate: 1
  })
  console.log('res333', res)
  return res
}

const onChange = (val) => {
  emit('change', val)
}

const onClear = () => {
  emit('clear')
}
</script>

<style scoped>
.task-template-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.task-desc {
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}

.task-meta {
  display: flex;
  gap: 6px;
}
</style>
