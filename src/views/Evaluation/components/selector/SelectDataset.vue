<template>
  <div class="select-dataset">
    <el-select
      :model-value="modelValue"
      placeholder="请选择数据集"
      @update:model-value="handleChange"
      style="width: 100%"
      clearable
      filterable
    >
      <el-option v-for="item in datasetOptions" :key="item.id" :label="item.name" :value="item.id">
        <div class="dataset-option">
          <span class="dataset-option__name">{{ item.name }}</span>
          <span class="dataset-option__desc">{{ item.description }}</span>
        </div>
      </el-option>
    </el-select>

    <!-- 数据映射配置提示 -->
    <div v-if="modelValue && modelValue.length > 0" class="mapping-info">
      <Icon icon="ep:info-filled" class="mapping-info__icon" />
      <span>已配置 {{ modelValue.length }} 个数据映射</span>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@/components/Icon'

defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  metricSystemId: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择数据集'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 模拟数据集选项
const datasetOptions = ref([
  { id: 'dataset-1', name: '数据集A', description: '包含基础性能指标' },
  { id: 'dataset-2', name: '数据集B', description: '包含安全评估数据' },
  { id: 'dataset-3', name: '数据集C', description: '综合评估数据集' }
])

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="less">
.select-dataset {
  .dataset-option {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &__name {
      font-size: 14px;
      color: var(--el-text-color-primary);
    }

    &__desc {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .mapping-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px 12px;
    background: var(--el-color-primary-light-9);
    border-radius: 4px;
    font-size: 13px;
    color: var(--el-color-primary);

    &__icon {
      font-size: 16px;
    }
  }
}
</style>


