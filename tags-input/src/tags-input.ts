import { buildProps, definePropType } from '@zxui/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type { Awaitable } from '@zxui/utils/typescript'

type TagListLoader = (keyword?: string) => any[] | Promise<any[]> | undefined | null

export const zxTagsInputProps = buildProps({
  /**
   * @description 已选标签值数组
   */
  modelValue: {
    type: Array,
    default: () => [],
  },
  /**
   * @description 初始标签数据，用于回显（可能需要调接口获取），加载后会更新到 modelValue
   */
  loadTags: {
    type: [Array, Function] as PropType<any[] | TagListLoader>,
    default: () => [] as any[],
  },
  /**
   * @description 建议标签列表，用户可以从中快速选择
   */
  suggestions: {
    type: [Array, Function] as PropType<any[] | TagListLoader>,
    default: () => [] as any[],
  },
  /**
   * @description 转换从 loadTags 获取的数据
   */
  transform: {
    type: Function as PropType<(list: any) => any>,
    default: (list: any) => list,
  },
  /**
   * @description 转换从 suggestions 获取的数据
   */
  transformSuggestions: {
    type: Function as PropType<(list: any) => any>,
    default: (list: any) => list,
  },
  /**
   * @description 初始标签的值字段名
   */
  valueKey: {
    type: String,
    default: 'value',
  },
  /**
   * @description 初始标签的显示字段名
   */
  labelKey: {
    type: String,
    default: 'label',
  },
  /**
   * @description 建议标签的值字段名
   */
  suggestionValueKey: {
    type: String,
    default: 'value',
  },
  /**
   * @description 建议标签的显示字段名
   */
  suggestionLabelKey: {
    type: String,
    default: 'label',
  },
  /**
   * @description 是否显示建议标签列表
   */
  showSuggestions: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 建议标签最大显示数量
   */
  maxSuggestions: {
    type: Number,
    default: 10,
  },
  /**
   * @description 已选标签区域标题
   */
  tagsLabel: {
    type: String,
    default: '已选标签',
  },
  /**
   * @description 输入区域标题
   */
  inputLabel: {
    type: String,
    default: '添加标签',
  },
  /**
   * @description 标签列表为空时的占位描述
   */
  emptyText: {
    type: String,
    default: '暂无标签',
  },
  /**
   * @description 是否展示分割线
   */
  showDivider: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 输入框占位符
   */
  placeholder: {
    type: String,
    default: '请输入标签，按回车添加',
  },
  /**
   * @description 最大标签数量，0 表示不限制
   */
  maxCount: {
    type: Number,
    default: 0,
  },
  /**
   * @description 单个标签最大长度
   */
  maxLength: {
    type: Number,
    default: 20,
  },
  /**
   * @description 单个标签最小长度
   */
  minLength: {
    type: Number,
    default: 1,
  },
  /**
   * @description 是否允许重复标签
   */
  allowDuplicates: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 是否只读
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 尺寸
   */
  size: {
    type: String,
    values: ['large', 'default', 'small'],
    default: 'large',
  },
  /**
   * @description 标签类型
   */
  tagType: {
    type: String,
    values: ['primary', 'success', 'info', 'warning', 'danger'],
    default: undefined,
  },
  /**
   * @description 标签效果
   */
  tagEffect: {
    type: String,
    values: ['dark', 'light', 'plain'],
    default: 'light',
  },
  /**
   * @description 是否显示添加按钮
   */
  showAddButton: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 添加按钮文本
   */
  addButtonText: {
    type: String,
    default: '添加',
  },
  /**
   * @description 是否显示字数统计
   */
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 是否显示提示信息
   */
  showTip: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 自定义验证器
   */
  validator: {
    type: Function,
    default: null,
  },
  /**
   * @description 失焦时自动添加
   */
  addOnBlur: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 是否去除首尾空格
   */
  trimValue: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 添加标签前的钩子，返回 `false` 阻止添加
   */
  beforeAdd: {
    type: definePropType<
      (tag: string, tags: string[]) => Awaitable<boolean | void>
    >([Function]),
    default: null,
  },
  /**
   * @description 删除标签前的钩子，返回 `false` 阻止删除
   */
  beforeRemove: {
    type: definePropType<
      (tag: string, index: number, tags: string[]) => Awaitable<boolean | void>
    >([Function]),
    default: null,
  },
  /**
   * @description 输入区域位置
   */
  inputPosition: {
    type: String,
    values: ['top', 'bottom'],
    default: 'bottom',
  },
} as const)

export const zxTagsInputEmits = {
  'update:modelValue': (value: string[]) => Array.isArray(value),
  change: (value: string[]) => Array.isArray(value),
  add: (tag: string) => typeof tag === 'string',
  remove: (tag: string, index: number) => typeof tag === 'string' && typeof index === 'number',
  'add-cancel': (tag: string) => typeof tag === 'string',
  'remove-cancel': (tag: string, index: number) => typeof tag === 'string' && typeof index === 'number',
  'tag-click': (tag: string, index: number) => typeof tag === 'string' && typeof index === 'number',
  'suggestion-click': (tag: any) => true,
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  'input-change': (value: string) => typeof value === 'string',
  'tags-loaded': (tags: any[]) => Array.isArray(tags),
  'suggestions-loaded': (tags: any[]) => Array.isArray(tags),
}

export type ZxTagsInputProps = ExtractPropTypes<typeof zxTagsInputProps>
export type ZxTagsInputEmits = typeof zxTagsInputEmits
