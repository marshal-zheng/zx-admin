<template>
  <div class="zx-select-wrapper">
    <el-tooltip
      :content="selectFullTooltip"
      :disabled="disabledTooltip"
      :placement="fullTooltipPosition || 'top'"
      :show-after="300"
    >
      <el-select
        ref="selectRef"
        v-model="innerValue"
        class="zx-select"
        :placeholder="placeholder"
        :clearable="allowClear"
        :filterable="allowSearch"
        :loading="loading || optionsLoading"
        :multiple="multiple"
        :collapse-tags="shouldCalculateMaxTag !== false && multiple"
        :max-collapse-tags="maxTagCount"
        :filter-method="handleSearch"
        :disabled="disabled"
        :size="size"
        :popper-append-to-body="false"
        :teleported="false"
        @change="handleChange"
        @blur="$emit('blur')"
        @visible-change="handlePopupVisibleChange"
        @remove-tag="handleRemoveTag"
        @clear="handleClear"
      >
        <!-- 全选选项 -->
        <el-option
          v-if="hasAllSelect && multiple"
          :value="'__ALL_SELECT__'"
          :label="'全选'"
          class="all-select-option"
          @click.stop="handleSelectAllChange(!isSelectAll)"
        >
          <el-checkbox
            :model-value="isSelectAll"
            :indeterminate="indeterminate"
            @change="handleSelectAllChange"
          >
            全选
          </el-checkbox>
        </el-option>

        <!-- 选项列表 -->
        <el-option
          v-for="item in filterOptions"
          :key="item[valueKey || 'value']"
          :value="objectValue ? item : item[valueKey || 'value']"
          :label="item[labelKey || 'label']"
          :disabled="getOptionItemDisabled(item)"
        >
          <el-tooltip
            :content="item.tooltipContent || item[labelKey || 'label']"
            :placement="optionTooltipPosition || 'left'"
            :show-after="500"
          >
            <div class="option-content" v-html="optionItemLabelRender(item)"></div>
          </el-tooltip>
        </el-option>

        <!-- 自定义插槽 -->
        <template v-if="$slots.header" #header>
          <slot name="header"></slot>
        </template>

        <template v-if="$slots.footer" #footer>
          <slot name="footer"></slot>
        </template>

        <template v-if="$slots.empty" #empty>
          <slot name="empty"></slot>
        </template>
      </el-select>
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed, ref, watch, onBeforeMount, onMounted, nextTick, watchEffect } from 'vue'
import './index.scss'

// 组件名称
defineOptions({
  name: 'ZxSelect'
})

// Props 定义
const props = defineProps({
  // 模式：静态或远程
  mode: {
    type: String,
    default: 'static',
    validator: (value) => ['static', 'remote'].includes(value)
  },
  // 绑定值
  modelValue: {
    type: [String, Number, Array, Object],
    default: () => null
  },
  // 是否可搜索
  allowSearch: {
    type: Boolean,
    default: true
  },
  // 是否可清空
  allowClear: {
    type: Boolean,
    default: true
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否有全选选项
  hasAllSelect: {
    type: Boolean,
    default: false
  },
  // 是否默认全选
  defaultAllSelect: {
    type: Boolean,
    default: false
  },
  // 搜索字段
  searchKeys: {
    type: Array,
    default: () => ['label']
  },
  // 值字段名
  valueKey: {
    type: String,
    default: 'value'
  },
  // 标签字段名
  labelKey: {
    type: String,
    default: 'label'
  },
  // 选项数据
  options: {
    type: [Array, Promise],
    default: () => []
  },
  // 数据转换函数
  transform: {
    type: Function,
    default: (list) => list
  },
  // 是否使用对象值
  objectValue: {
    type: Boolean,
    default: false
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 是否至少选择一个
  atLeastOne: {
    type: Boolean,
    default: false
  },
  // 远程字段映射
  remoteFieldsMap: {
    type: Object,
    default: () => ({})
  },
  // 远程额外参数
  remoteExtraParams: {
    type: Object,
    default: () => ({})
  },
  // 是否禁用自动初始搜索
  notAutoInitSearch: {
    type: Boolean,
    default: false
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 选项不存在时的提示文案
  optionNotExitsText: {
    type: String,
    default: '选项不存在'
  },
  // 是否需要计算最大展示选项数量
  shouldCalculateMaxTag: {
    type: Boolean,
    default: true
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 尺寸
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  // 远程请求函数
  remoteFunc: {
    type: Function,
    default: null
  },
  // 自定义选项标签渲染
  optionLabelRender: {
    type: Function,
    default: null
  },
  // 自定义选项提示内容
  optionTooltipContent: {
    type: Function,
    default: null
  },
  // 远程过滤函数
  remoteFilterFunc: {
    type: Function,
    default: null
  },
  // 选项提示位置
  optionTooltipPosition: {
    type: String,
    default: 'left'
  },
  // 全选提示位置
  fullTooltipPosition: {
    type: String,
    default: 'top'
  }
})

// Emits 定义
const emit = defineEmits([
  'update:modelValue',
  'remoteSearch',
  'visible-change',
  'update:loading',
  'remove',
  'change',
  'changeObject',
  'blur'
])

// 响应式数据
const selectRef = ref()
const innerValue = ref(props.modelValue)
const inputValue = ref('')
const tempInputValue = ref('')
const filterOptions = ref([])
const remoteOriginOptions = ref([])
const loading = ref(props.loading || false)
const isArcoFirstSearch = ref(true)
const popupVisible = ref(false)
const maxTagCount = ref(3) // 默认最大标签数
const optionsLoading = ref(false) // options Promise加载状态

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val
  },
  { immediate: true }
)

// 监听 loading 变化
watch(
  () => props.loading,
  (val) => {
    loading.value = !!val
  }
)

watch(
  () => loading.value,
  (val) => {
    emit('update:loading', val)
  }
)

// 半选状态
const indeterminate = computed(() => {
  if (props.multiple && Array.isArray(innerValue.value)) {
    return innerValue.value.length > 0 && innerValue.value.length < filterOptions.value.length
  }
  return false
})

// 是否全选
const isSelectAll = computed(() => {
  if (props.multiple && Array.isArray(innerValue.value)) {
    return innerValue.value.length === filterOptions.value.length
  }
  return false
})

// 是否可清空
const allowClear = computed(() => {
  if (props.atLeastOne && Array.isArray(innerValue.value)) {
    return innerValue.value.length > 1 && props.allowClear
  }
  return props.allowClear
})

// 完整提示内容
const selectFullTooltip = computed(() => {
  const values = Array.isArray(innerValue.value) ? innerValue.value : [innerValue.value]
  let tooltip = ''
  if (props.objectValue) {
    tooltip = values.map((e) => e.tooltipContent || e[props.labelKey || 'label']).join('，')
  } else {
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < remoteOriginOptions.value.length; j++) {
        const optItem = remoteOriginOptions.value[j]
        if (optItem[props.valueKey || 'value'] === values[i]) {
          tooltip += optItem[props.labelKey || 'label']
          if (i !== values.length - 1) {
            tooltip += '，'
          }
          break
        }
      }
    }
  }
  return tooltip
})

// 是否禁用提示
const disabledTooltip = computed(() => {
  if (popupVisible.value) {
    return true
  }
  if (typeof innerValue.value === 'string' && innerValue.value.trim() === '') {
    return true
  }
  if (Array.isArray(innerValue.value) && innerValue.value.length === 0) {
    return true
  }
  return false
})

// 搜索处理
async function handleSearch(val = '', manual = false) {
  if (isArcoFirstSearch.value && !manual) {
    isArcoFirstSearch.value = false
    return
  }
  isArcoFirstSearch.value = false

  try {
    loading.value = true

    // 远程模式
    if (props.mode === 'remote' && typeof props.remoteFunc === 'function') {
      const result = await props.remoteFunc({ ...props.remoteExtraParams, keyword: val })
      remoteOriginOptions.value = result.map((e) => {
        const item = { ...e }

        // 字段映射
        if (props.remoteFieldsMap) {
          const map = props.remoteFieldsMap
          Object.keys(map).forEach((key) => {
            item[key] = e[map[key]]
          })
        }

        // 提示内容
        item.tooltipContent =
          typeof props.optionTooltipContent === 'function'
            ? props.optionTooltipContent(e)
            : e[props.labelKey || 'label']

        return item
      })

      if (props.remoteFilterFunc && typeof props.remoteFilterFunc === 'function') {
        remoteOriginOptions.value = props.remoteFilterFunc(remoteOriginOptions.value)
      }

      emit('remoteSearch', remoteOriginOptions.value)
    }

    if (val.trim() === '') {
      filterOptions.value = remoteOriginOptions.value.map((e) => ({
        ...e,
        tooltipContent:
          typeof props.optionTooltipContent === 'function'
            ? props.optionTooltipContent(e)
            : e[props.labelKey || 'label']
      }))
      return
    }

    // 搜索过滤
    const highlightedKeyword = `<span style="color: var(--el-color-primary);">${val}</span>`
    filterOptions.value = remoteOriginOptions.value
      .map((e) => {
        const item = { ...e }
        let hasMatch = false

        if (props.searchKeys) {
          for (let i = 0; i < props.searchKeys.length; i++) {
            const key = props.searchKeys[i]
            if (e[key]?.toLowerCase().includes(val.toLowerCase())) {
              hasMatch = true
              item[key] = e[key].replace(
                new RegExp(val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
                highlightedKeyword
              )
            }
          }
        }

        if (hasMatch) {
          return {
            ...item,
            tooltipContent:
              typeof props.optionTooltipContent === 'function'
                ? props.optionTooltipContent(e)
                : e[props.labelKey || 'label']
          }
        }
        return null
      })
      .filter((e) => e)
  } catch (error) {
    console.error('搜索出错:', error)
  } finally {
    loading.value = false
  }
}

// 选项标签渲染
function optionItemLabelRender(item) {
  return typeof props.optionLabelRender === 'function'
    ? props.optionLabelRender(item)
    : item[props.labelKey || 'label']
}

// 全选处理
function handleSelectAllChange(val) {
  if (val) {
    innerValue.value = props.objectValue
      ? [...filterOptions.value]
      : filterOptions.value.map((e) => e[props.valueKey || 'value'])
  } else {
    innerValue.value = []
  }
  emit('update:modelValue', innerValue.value)
  emit('change', innerValue.value)
}

// 监听选项变化
watch(
  () => props.options,
  async (val) => {
    if (props.mode !== 'remote') {
      await handleOptionsPromise()
      handleSearch('', true)
      if (props.defaultAllSelect) {
        handleSelectAllChange(true)
      }
    }
  }
)

// 获取选项禁用状态
function getOptionItemDisabled(item) {
  return (
    !!item.disabled ||
    (!!props.multiple &&
      !!props.atLeastOne &&
      Array.isArray(innerValue.value) &&
      !!innerValue.value.find((e) =>
        props.objectValue
          ? e[props.valueKey || 'value'] === item[props.valueKey || 'value']
          : e === item[props.valueKey || 'value']
      ) &&
      innerValue.value.length === 1)
  )
}

// 值变化处理
function handleChange(value) {
  if (props.multiple) {
    nextTick(() => {
      inputValue.value = tempInputValue.value
    })
  }

  emit('update:modelValue', value)
  emit('change', value)

  const changeObject = remoteOriginOptions.value.find((e) => value === e[props.valueKey || 'value'])
  emit('changeObject', changeObject)
}

// 弹出层显示状态变化
function handlePopupVisibleChange(val) {
  popupVisible.value = val
  if (val) {
    handleSearch('', true)
  } else {
    inputValue.value = ''
    tempInputValue.value = ''
  }
  emit('visible-change', val)
}

// 移除标签
function handleRemoveTag(val) {
  emit('remove', val)
}

// 清空处理
function handleClear() {
  innerValue.value = props.multiple ? [] : ''
  emit('update:modelValue', innerValue.value)
}

// 检查选项是否存在
function checkOptionExit(value) {
  if (typeof props.optionLabelRender === 'function') {
    return value
  }
  const option = remoteOriginOptions.value.find(
    (e) =>
      String(e[props.valueKey || 'value']).toLowerCase() === String(value).toLowerCase() ||
      String(e[props.labelKey || 'label']).toLowerCase() === String(value)?.toLowerCase()
  )
  return option ? option[props.labelKey || 'label'] : props.optionNotExitsText
}

// 处理options Promise
async function handleOptionsPromise() {
  if (props.options instanceof Promise) {
    try {
      optionsLoading.value = true
      const result = await props.options

      // 使用transform函数处理数据
      const processedData = props.transform(result)

      remoteOriginOptions.value = Array.isArray(processedData) ? processedData : []

      // 更新filterOptions
      filterOptions.value = remoteOriginOptions.value.map((e) => ({
        ...e,
        tooltipContent:
          typeof props.optionTooltipContent === 'function'
            ? props.optionTooltipContent(e)
            : e[props.labelKey || 'label']
      }))
    } catch (error) {
      console.error('处理options Promise出错:', error)
      remoteOriginOptions.value = []
      filterOptions.value = []
    } finally {
      optionsLoading.value = false
    }
  } else if (Array.isArray(props.options)) {
    // 如果是数组，直接处理
    const processedData = props.transform(props.options)

    remoteOriginOptions.value = [...processedData]
    filterOptions.value = remoteOriginOptions.value.map((e) => ({
      ...e,
      tooltipContent:
        typeof props.optionTooltipContent === 'function'
          ? props.optionTooltipContent(e)
          : e[props.labelKey || 'label']
    }))
  }
}

// 生命周期
onBeforeMount(async () => {
  // 首先处理options（可能是Promise）
  await handleOptionsPromise()

  if (props.mode === 'remote' && props.notAutoInitSearch === true) {
    // 如果是远程模式且禁用自动搜索，不需要额外处理
  } else if (props.mode !== 'remote') {
    // 非远程模式，直接使用已处理的options
    handleSearch('', true)
  }
})

onMounted(() => {
  if (props.defaultAllSelect) {
    handleSelectAllChange(true)
  }
})

// 全选状态检测
watchEffect(() => {
  if (props.hasAllSelect && selectRef.value) {
    const selectEl = selectRef.value.$el
    if (selectEl && isSelectAll.value) {
      // 这里可以添加全选状态的特殊样式处理
    }
  }
})
</script>
