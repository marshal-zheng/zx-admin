<template>
  <div class="zx-input-wrapper">
    <div class="zx-input" :class="inputClasses">
      <ZxTooltipOrPopover
        v-if="hasTooltip"
        :content="tooltipContent"
        :title="tooltipTitle"
        :placement="tooltipPlacement"
        :trigger="tooltipTrigger"
        :visible="showTooltip"
        :disabled="!hasTooltip"
      >
        <component
          :is="inputComponent"
          v-model="inputValue"
          v-bind="inputProps"
          :class="componentClasses"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @change="handleChange"
        >
          <template v-if="type === 'search'" #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </component>
      </ZxTooltipOrPopover>
      <component
        v-else
        :is="inputComponent"
        v-model="inputValue"
        v-bind="inputProps"
        :class="componentClasses"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @change="handleChange"
      >
        <template v-if="type === 'search'" #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </component>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElInput, ElInputNumber } from 'element-plus'
import { debounce as lodashDebounce } from 'lodash-es'
import ZxTooltipOrPopover from '../ZxTooltipOrPopover/index.vue'

// 定义属性
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'textarea', 'password', 'search', 'number'].includes(value)
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  showPassword: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  maxlength: {
    type: [String, Number],
    default: undefined
  },
  minlength: {
    type: [String, Number],
    default: undefined
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: [String, Object],
    default: undefined
  },
  suffixIcon: {
    type: [String, Object],
    default: undefined
  },
  rows: {
    type: Number,
    default: 2
  },
  autosize: {
    type: [Boolean, Object],
    default: false
  },
  resize: {
    type: String,
    default: 'vertical',
    validator: (value) => ['none', 'both', 'horizontal', 'vertical'].includes(value)
  },
  // 工具提示相关
  tooltip: {
    type: [String, Object],
    default: ''
  },
  tooltipPlacement: {
    type: String,
    default: 'right'
  },
  tooltipTrigger: {
    type: String,
    default: 'hover',
    validator: (value) => ['hover', 'click', 'focus', 'manual'].includes(value)
  },
  // 防止自动填充
  preventAutoFill: {
    type: Boolean,
    default: true
  },
  // 防抖延迟
  debounce: {
    type: Number,
    default: 0
  },
  // 数字输入相关
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  step: {
    type: Number,
    default: 1
  },
  precision: {
    type: Number,
    default: undefined
  },
  controls: {
    type: Boolean,
    default: true
  },
  controlsPosition: {
    type: String,
    default: '',
    validator: (value) => ['', 'right'].includes(value)
  }
})

// 定义事件
const emit = defineEmits([
  'update:modelValue',
  'input',
  'change',
  'focus',
  'blur',
  'clear',
  'search'
])

// 响应式数据
const inputValue = ref(props.modelValue)
const showTooltip = ref(false)

// 计算属性
const inputComponent = computed(() => {
  switch (props.type) {
    case 'textarea':
      return ElInput
    case 'number':
      return ElInputNumber
    default:
      return ElInput
  }
})

const inputProps = computed(() => {
  const baseProps = {
    placeholder: props.placeholder,
    disabled: props.disabled,
    readonly: props.readonly,
    clearable: props.clearable,
    size: props.size,
    maxlength: props.maxlength,
    minlength: props.minlength,
    showWordLimit: props.showWordLimit,
    prefixIcon: props.prefixIcon,
    suffixIcon: props.suffixIcon
  }

  if (props.type === 'textarea') {
    return {
      ...baseProps,
      type: 'textarea',
      rows: props.rows,
      autosize: props.autosize,
      resize: props.resize
    }
  }

  if (props.type === 'password') {
    return {
      ...baseProps,
      type: 'password',
      showPassword: props.showPassword,
      autocomplete: props.preventAutoFill ? 'new-password' : undefined
    }
  }

  if (props.type === 'search') {
    return {
      ...baseProps,
      type: 'text'
    }
  }

  if (props.type === 'number') {
    return {
      placeholder: props.placeholder,
      disabled: props.disabled,
      readonly: props.readonly,
      size: props.size,
      min: props.min,
      max: props.max,
      step: props.step,
      precision: props.precision,
      controls: props.controls,
      controlsPosition: props.controlsPosition
    }
  }

  return {
    ...baseProps,
    type: props.type,
    autocomplete: props.preventAutoFill ? 'off' : undefined
  }
})

const hasTooltip = computed(() => {
  if (typeof props.tooltip === 'string') {
    return props.tooltip.length > 0
  }
  if (typeof props.tooltip === 'object') {
    return !!(props.tooltip.content || props.tooltip.title)
  }
  return false
})

const tooltipContent = computed(() => {
  if (typeof props.tooltip === 'string') {
    return props.tooltip
  }
  if (typeof props.tooltip === 'object') {
    return props.tooltip.content || ''
  }
  return ''
})

const tooltipTitle = computed(() => {
  if (typeof props.tooltip === 'object') {
    return props.tooltip.title || ''
  }
  return ''
})

const tooltipTrigger = computed(() => {
  if (typeof props.tooltip === 'object' && props.tooltip.trigger) {
    return props.tooltip.trigger
  }
  return props.tooltipTrigger
})

const inputClasses = computed(() => {
  return {
    [`zx-input--${props.size}`]: props.size !== 'default',
    'zx-input--disabled': props.disabled,
    'zx-input--readonly': props.readonly,
    [`zx-input--${props.type}`]: true
  }
})

const componentClasses = computed(() => {
  return {
    'zx-input__component': true,
    'zx-input__component--number': props.type === 'number'
  }
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val
  }
)

// 监听 inputValue 变化
watch(
  () => inputValue.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

// 创建防抖函数
const debouncedInput = computed(() => {
  if (props.debounce > 0) {
    return lodashDebounce((value) => {
      emit('input', value)
    }, props.debounce)
  }
  return (value) => emit('input', value)
})

// 事件处理函数
const handleFocus = (event) => {
  if (hasTooltip.value) {
    showTooltip.value = true
  }
  emit('focus', event)
}

const handleBlur = (event) => {
  if (hasTooltip.value) {
    showTooltip.value = false
  }
  emit('blur', event)
}

const handleInput = (value) => {
  debouncedInput.value(value)
}

const handleChange = (value) => {
  emit('change', value)
}

const handleSearch = () => {
  emit('search', inputValue.value)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
