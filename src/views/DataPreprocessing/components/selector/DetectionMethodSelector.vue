<template>
  <ZxSelect
    :model-value="modelValue"
    :options="DETECTION_METHOD_OPTIONS"
    :placeholder="placeholder"
    :allow-clear="clearable"
    :allow-search="allowSearch"
    :disabled="disabled"
    :size="size"
    :loading="loading"
    :multiple="multiple"
    :has-all-select="hasAllSelect && multiple"
    :default-all-select="defaultAllSelect"
    :at-least-one="atLeastOne"
    :object-value="objectValue"
    :should-calculate-max-tag="shouldCalculateMaxTag"
    :max-tag-count="maxTagCount"
    :full-tooltip-position="fullTooltipPosition"
    :option-tooltip-position="optionTooltipPosition"
    :width="width"
    :style="computedStyle"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
    @clear="$emit('clear')"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @visible-change="$emit('visible-change', $event)"
    @remove-tag="$emit('remove-tag', $event)"
  >
    <!-- 透传插槽 -->
    <template v-if="$slots.option" #option="slotProps">
      <slot name="option" v-bind="slotProps"></slot>
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header"></slot>
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty"></slot>
    </template>
  </ZxSelect>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DETECTION_METHOD_OPTIONS, DetectionMethod } from '../model'

defineOptions({
  name: 'DetectionMethodSelector'
})

interface Props {
  /** 绑定值 */
  modelValue?: DetectionMethod | DetectionMethod[] | null
  /** 占位符 */
  placeholder?: string
  /** 是否可清空 */
  clearable?: boolean
  /** 是否可搜索 */
  allowSearch?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 是否加载中 */
  loading?: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 是否有全选选项（仅多选时生效） */
  hasAllSelect?: boolean
  /** 是否默认全选（仅多选时生效） */
  defaultAllSelect?: boolean
  /** 至少选择一项（仅多选时生效） */
  atLeastOne?: boolean
  /** 是否对象值 */
  objectValue?: boolean
  /** 是否自动计算最大标签数 */
  shouldCalculateMaxTag?: boolean
  /** 最大标签数 */
  maxTagCount?: number
  /** 完整提示位置 */
  fullTooltipPosition?: 'top' | 'bottom'
  /** 选项提示位置 */
  optionTooltipPosition?: 'top' | 'bottom'
  /** 宽度 */
  width?: string | number
  /** 自定义样式 */
  style?: string | object
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择检测方式',
  clearable: true,
  allowSearch: false,
  disabled: false,
  size: 'default',
  loading: false,
  multiple: false,
  hasAllSelect: false,
  defaultAllSelect: false,
  atLeastOne: false,
  objectValue: false,
  shouldCalculateMaxTag: true,
  maxTagCount: 3,
  fullTooltipPosition: 'top',
  optionTooltipPosition: 'top'
})

defineEmits<{
  'update:modelValue': [value: DetectionMethod | DetectionMethod[] | null]
  change: [value: DetectionMethod | DetectionMethod[] | null]
  clear: []
  blur: []
  focus: []
  'visible-change': [visible: boolean]
  'remove-tag': [value: DetectionMethod]
}>()

// 计算样式
const computedStyle = computed(() => {
  const baseStyle: Record<string, any> = {}

  if (props.width) {
    baseStyle.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.style) {
    if (typeof props.style === 'string') {
      return `${Object.entries(baseStyle)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ')};${props.style}`
    } else {
      return { ...baseStyle, ...props.style }
    }
  }

  return baseStyle
})
</script>