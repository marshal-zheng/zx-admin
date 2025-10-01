<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :size="size"
    :loading="loading"
    @change="handleChange"
    @clear="handleClear"
    class="simple-type-selector"
    popper-class="simple-type-selector-dropdown"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script setup>
import { computed } from 'vue'

// 定义 props
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default'
  },
  loading: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change', 'clear'])

// 双向绑定
const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 处理选择变化
const handleChange = (value) => {
  emit('change', value)
}

// 处理清空
const handleClear = () => {
  emit('clear')
}
</script>

<style lang="scss" scoped>
.simple-type-selector {
  width: 100%;
}

// 全局样式修复下拉框定位
:global(.simple-type-selector-dropdown) {
  z-index: 9999 !important;
}
</style>
