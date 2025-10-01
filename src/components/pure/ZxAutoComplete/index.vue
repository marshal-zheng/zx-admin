<template>
  <ZxTooltipOrPopover
    v-bind="tooltipProps"
    :class="['zx-auto-complete-wrapper', { 'zx-auto-complete--with-tooltip': hasTooltip }]"
  >
    <el-autocomplete
      v-model="inputValue"
      v-bind="$attrs"
      :fetch-suggestions="handleFetchSuggestions"
      :clearable="allowClear"
      :loading="loading"
      @focus="handleFocus"
      @blur="handleBlur"
      @select="handleSelect"
      @change="handleChange"
    >
      <template #suffix>
        <el-icon
          v-if="loading"
          class="zx-auto-complete__loading is-loading"
          :style="{
            animation: 'zx-loading-rotate 2s linear infinite',
            color: 'var(--el-color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }"
        >
          <Loading />
        </el-icon>
        <slot name="suffix" v-else></slot>
      </template>
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot v-if="name !== 'suffix'" :name="name" v-bind="slotData"></slot>
      </template>
    </el-autocomplete>
  </ZxTooltipOrPopover>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElAutocomplete, ElIcon } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import ZxTooltipOrPopover from '../ZxTooltipOrPopover/index.vue'

// 组件名称
defineOptions({
  name: 'ZxAutoComplete',
  inheritAttrs: false
})

// Props 定义
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: [Array, Function],
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  tooltip: {
    type: Object,
    default: () => ({})
  },
  allowClear: {
    type: Boolean,
    default: true
  },
  filterOption: {
    type: Function,
    default: null
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'select', 'change', 'focus', 'blur'])

// 响应式数据
const inputValue = ref(props.modelValue)
const loading = ref(false)
const internalOptions = ref([])
const openTooltip = ref(false)

// 计算属性
const hasTooltip = computed(() => {
  return Boolean(props.tooltip.title || props.tooltip.content)
})

const tooltipProps = computed(() => {
  return {
    placement: 'right',
    ...props.tooltip,
    open: openTooltip.value
  }
})

const selectOptions = computed(() => {
  const result = internalOptions.value.map((option) => {
    if (option.options) {
      return {
        label: option[props.labelKey],
        options: option.options.map((subOption) => {
          // 为子选项创建新对象，确保 value 字段用于显示
          const {
            [props.valueKey]: originalValue,
            [props.labelKey]: displayLabel,
            ...otherProps
          } = subOption
          return {
            value: displayLabel, // el-autocomplete 显示的文本
            label: displayLabel, // 保持兼容性
            originalValue: originalValue, // 保存原始值
            ...otherProps
          }
        })
      }
    }

    // 为顶级选项创建新对象，确保 value 字段用于显示
    const {
      [props.valueKey]: originalValue,
      [props.labelKey]: displayLabel,
      ...otherProps
    } = option
    return {
      value: displayLabel, // el-autocomplete 显示的文本 (北京市)
      label: displayLabel, // 保持兼容性
      originalValue: originalValue, // 保存原始值 (beijing)
      ...otherProps // 其他属性如 code, population, region
    }
  })

  return result
})

// 默认过滤函数
const defaultFilterOption = (queryString, item) => {
  return item.label.toLowerCase().includes(queryString.toLowerCase())
}

// 方法
const loadOptions = async (params) => {
  loading.value = true
  try {
    let data
    if (typeof props.options === 'function') {
      data = await props.options(params)
    } else {
      data = props.options
    }
    internalOptions.value = data || []
  } catch (error) {
    console.error('Failed to load options:', error)
    internalOptions.value = []
  } finally {
    loading.value = false
  }
}

const handleFetchSuggestions = async (queryString, callback) => {
  // 如果 options 是函数（异步加载），则调用它
  if (typeof props.options === 'function') {
    await loadOptions(queryString)
  }

  const filterFn = props.filterOption || defaultFilterOption
  const filteredOptions = selectOptions.value.filter((item) => {
    return queryString ? filterFn(queryString, item) : true
  })
  callback(filteredOptions)
}

const handleFocus = (event) => {
  if (hasTooltip.value) {
    openTooltip.value = true
  }
  emit('focus', event)
}

const handleBlur = (event) => {
  if (hasTooltip.value) {
    openTooltip.value = false
  }
  emit('blur', event)
}

const handleSelect = (item) => {
  // 如果有 originalValue，则使用原始值，否则使用 value
  const selectedValue = item.originalValue !== undefined ? item.originalValue : item.value

  // 更新输入框的值为显示文本
  inputValue.value = item.value

  // 发送选中事件，包含完整的选项信息
  emit('select', {
    ...item,
    selectedValue // 添加实际选中的值
  })

  // 更新 modelValue 为显示文本（保持与输入框一致）
  emit('update:modelValue', item.value)
}

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

// 监听器
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue
  }
)

watch(
  () => inputValue.value,
  (newValue) => {
    emit('update:modelValue', newValue)
  }
)

// 生命周期
onMounted(() => {
  loadOptions()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
