import { buildProps } from '@zxui/utils'

import type { ExtractPropTypes, PropType } from 'vue'
import type { Placement } from '@floating-ui/dom'

export const zxSelectProps = buildProps({
  mode: {
    type: String,
    default: 'static',
    validator: (v: string) => ['static', 'remote'].includes(v),
  },
  modelValue: {
    type: [String, Number, Array, Object],
    default: null,
  },
  allowSearch: {
    type: Boolean,
    default: true,
  },
  allowClear: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  hasAllSelect: {
    type: Boolean,
    default: false,
  },
  defaultAllSelect: {
    type: Boolean,
    default: false,
  },
  searchKeys: {
    type: Array as PropType<string[]>,
    default: () => ['label'],
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  options: {
    type: [Array, Promise] as PropType<any[] | Promise<any[]>>,
    default: () => [],
  },
  transform: {
    type: Function as PropType<(list: any) => any>,
    default: (list: any) => list,
  },
  objectValue: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  atLeastOne: {
    type: Boolean,
    default: false,
  },
  remoteFieldsMap: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  remoteExtraParams: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  notAutoInitSearch: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  optionNotExitsText: {
    type: String,
    default: '选项不存在',
  },
  shouldCalculateMaxTag: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    values: ['', 'large', 'default', 'small'],
    default: 'default',
  },
  remoteFunc: {
    type: Function as PropType<(...args: any[]) => any>,
    default: null,
  },
  optionLabelRender: {
    type: Function as PropType<(...args: any[]) => any>,
    default: null,
  },
  remoteFilterFunc: {
    type: Function as PropType<(...args: any[]) => any>,
    default: null,
  },
  tooltip: {
    type: Object as PropType<{
      content?: string
      placement?: Placement
    }>,
    default: () => ({
      content: '',
      placement: 'top' as Placement,
    }),
  },
  width: {
    type: String,
    default: '100%',
  },
} as const)

export type ZxSelectProps = ExtractPropTypes<typeof zxSelectProps>

export const selectEmits = [
  'update:modelValue',
  'remoteSearch',
  'visible-change',
  'update:loading',
  'remove',
  'change',
  'changeObject', // @deprecated use 'select' instead
  'select', // 单选返回对象，多选返回对象数组
  'blur',
] as const

export type SelectEmits = typeof selectEmits
