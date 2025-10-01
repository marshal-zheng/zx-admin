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
    class="topsis-type-selector"
  >
    <el-option
      v-for="item in topsisTypeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 定义 props
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null
  },
  placeholder: {
    type: String,
    default: '请选择TOPSIS类型'
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
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change', 'clear'])

// 响应式数据
const loading = ref(false)

// TOPSIS类型选项数据 - 根据截图数据
const topsisTypeOptions = ref([
  {
    label: '效益型',
    value: 1,
    disabled: false
  },
  {
    label: '成本型',
    value: 2,
    disabled: false
  },
  {
    label: '中间型',
    value: 3,
    disabled: false
  },
  {
    label: '区间型',
    value: 4,
    disabled: false
  }
])

// 双向绑定
const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 加载数据
const loadTopsisTypeData = async () => {
  try {
    loading.value = true
    // 这里可以调用API获取TOPSIS类型数据
    // const result = await topsisTypeApi.getList()
    // topsisTypeOptions.value = result.data

    // 模拟异步加载
    await new Promise((resolve) => setTimeout(resolve, 50))
  } catch (error) {
    console.error('加载TOPSIS类型数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理选择变化
const handleChange = (value) => {
  emit('change', value)
}

// 处理清空
const handleClear = () => {
  emit('clear')
}

// 组件挂载时加载数据
onMounted(() => {
  loadTopsisTypeData()
})

// 暴露方法
defineExpose({
  loadTopsisTypeData,
  topsisTypeOptions
})
</script>

<style lang="scss" scoped>
.topsis-type-selector {
  width: 100%;
}
</style>
