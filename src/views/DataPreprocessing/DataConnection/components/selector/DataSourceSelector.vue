<template>
  <div class="data-source-selector">
    <ZxSelect
      v-model="selectedValue"
      :options="allDataSources"
      placeholder="请选择数据源类型"
      :allow-clear="false"
      :allow-search="true"
      @change="handleChange"
    >
      <template #option="{ option }">
        <div class="data-source-option">
          <ZxIcon :icon="option.icon" :size="20" />
          <div class="option-content">
            <div class="option-label">{{ option.label }}</div>
          </div>
        </div>
      </template>
    </ZxSelect>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ZxSelect, ZxIcon } from '@/components/pure'

defineOptions({
  name: 'DataSourceSelector'
})

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectedValue = ref(props.modelValue)

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    selectedValue.value = newVal
  }
)

// 所有数据源选项
const allDataSources = computed(() => [
  {
    label: '文件 (Excel/CSV/JSON/XML)',
    value: 'file',
    icon: 'Document',
    category: 'file',
    categoryLabel: '文件'
  },
  // 数据库类型
  {
    label: 'MySQL',
    value: 'mysql',
    icon: 'CircleCheck',
    category: 'database',
    categoryLabel: '数据库'
  },
  {
    label: 'PostgreSQL',
    value: 'postgresql',
    icon: 'Operation',
    category: 'database',
    categoryLabel: '数据库'
  },
  {
    label: 'Oracle',
    value: 'oracle',
    icon: 'Box',
    category: 'database',
    categoryLabel: '数据库'
  },
  {
    label: 'SQL Server',
    value: 'sqlserver',
    icon: 'Grid',
    category: 'database',
    categoryLabel: '数据库'
  }
])

// 处理选择变化
const handleChange = (value) => {
  const selectedOption = allDataSources.value.find((item) => item.value === value)
  emit('update:modelValue', value)
  emit('change', selectedOption)
}

// 组件挂载时不自动设置默认值，避免触发不必要的表单验证
// 让父组件控制初始值的设置
</script>

<style lang="scss" scoped>
.data-source-selector {
  width: 100%;

  :deep(.zx-select) {
    width: 100%;
  }

  .data-source-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;

    .option-content {
      flex: 1;

      .option-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        line-height: 1.4;
      }

      .option-category {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        line-height: 1.2;
        margin-top: 2px;
      }
    }
  }
}
</style>
