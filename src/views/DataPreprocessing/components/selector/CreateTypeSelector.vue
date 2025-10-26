<template>
  <ZxSelect
    v-model="innerValue"
    :options="CREATE_TYPE_OPTIONS"
    :placeholder="placeholder"
    :clearable="clearable"
    :filterable="allowSearch"
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
import { CREATE_TYPE_OPTIONS, CreateType } from '../model'

defineOptions({
  name: 'CreateTypeSelector'
})

interface Props {
  /** 绑定值 */
  modelValue?: CreateType | CreateType[] | null | undefined
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
  /** 加载状态 */
  loading?: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 是否有全选选项（仅多选模式有效） */
  hasAllSelect?: boolean
  /** 是否默认全选（仅多选模式有效） */
  defaultAllSelect?: boolean
  /** 是否至少选择一个（仅多选模式有效） */
  atLeastOne?: boolean
  /** 是否使用对象值 */
  objectValue?: boolean
  /** 是否需要计算最大展示选项数量（仅多选模式有效） */
  shouldCalculateMaxTag?: boolean
  /** 最大展示标签数量（仅多选模式有效） */
  maxTagCount?: number
  /** 完整提示位置 */
  fullTooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** 选项提示位置 */
  optionTooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** 组件宽度 */
  width?: string | number
}

interface Emits {
  (e: 'update:modelValue', value: CreateType | CreateType[] | null): void
  (e: 'change', value: CreateType | CreateType[] | null): void
  (e: 'clear'): void
  (e: 'blur'): void
  (e: 'focus'): void
  (e: 'visible-change', visible: boolean): void
  (e: 'remove-tag', value: CreateType): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择创建类型',
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
  optionTooltipPosition: 'left'
})

const emit = defineEmits<Emits>()

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value as CreateType | CreateType[] | null)
})

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, any> = {}
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  return style
})
</script>

<style scoped>
.create-type-selector {
  display: inline-block;
}
</style>
