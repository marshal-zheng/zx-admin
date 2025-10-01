<template>
  <div
    v-if="showTagList.length"
    :class="['zx-tag-group', props.allowEdit ? 'zx-tag-group-editable' : '']"
    @click="handleClick"
  >
    <ZxTag
      v-for="tag of showTagList"
      :key="getTagKey(tag)"
      :class="props.showTable ? 'zx-tag-group-item' : ''"
      :width="getTagWidth(tag)"
      :size="props.size"
      :type="props.tagType"
      :theme="props.tagTheme"
      :tooltip-disabled="!props.showTable"
      v-bind="$attrs"
    >
      {{ getTagContent(tag) }}
      <template v-if="props.showTable" #tooltipContent>
        {{ props.isStringTag ? tag : tag[props.nameKey] }}
      </template>
    </ZxTag>
    <ZxTooltipOrPopover
      :disabled="!(props.tagList.length > props.showNum)"
      :content="tagsTooltip"
      :placement="props.tagPosition"
      :show-after="300"
    >
      <ZxTag
        v-show="props.tagList.length > props.showNum"
        class="zx-tag-group-number"
        :width="numberTagWidth"
        :size="props.size"
        :type="props.tagType"
        :theme="props.tagTheme"
        tooltip-disabled
        v-bind="$attrs"
      >
        +{{ props.tagList.length - props.showNum }}
      </ZxTag>
    </ZxTooltipOrPopover>
  </div>
  <!-- 避免在标签为空时，增大点击区域快速编辑 -->
  <div
    v-else
    :class="['zx-tag-group-empty', props.allowEdit ? 'zx-tag-group-editable' : '']"
    @click="handleClick"
  >
    -
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ZxTag from '../index.vue'
import ZxTooltipOrPopover from '../../ZxTooltipOrPopover/index.vue'

// 定义属性
const props = defineProps({
  tagList: {
    type: Array,
    default: () => []
  },
  showNum: {
    type: Number,
    default: 2
  },
  nameKey: {
    type: String,
    default: 'name'
  },
  isStringTag: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  allowEdit: {
    type: Boolean,
    default: false
  },
  showTable: {
    type: Boolean,
    default: false
  },
  tagPosition: {
    type: String,
    default: 'top',
    validator: (value) =>
      [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end'
      ].includes(value)
  },
  tagType: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'danger'].includes(value)
  },
  tagTheme: {
    type: String,
    default: 'light',
    validator: (value) => ['dark', 'light', 'plain'].includes(value)
  }
})

// 定义事件
const emit = defineEmits(['click'])

// 过滤标签列表
const filterTagList = computed(() => {
  return (props.tagList || []).filter((item) => item) || []
})

// 显示的标签列表
const showTagList = computed(() => {
  // 在表格展示则全部展示，按照自适应去展示标签个数
  if (props.showTable) {
    return filterTagList.value
  }
  return filterTagList.value.slice(0, props.showNum)
})

// 标签提示内容
const tagsTooltip = computed(() => {
  return filterTagList.value.map((e) => (props.isStringTag ? e : e[props.nameKey])).join('，')
})

// 获取标签宽度
const getTagWidth = (tag) => {
  const tagStr = props.isStringTag ? tag : tag[props.nameKey]
  const tagWidth = tagStr ? tagStr.length : 0
  // 16个中文字符
  return tagWidth < 16 ? tagWidth : 16
}

// 数字标签宽度
const numberTagWidth = computed(() => {
  const numberStr = `${props.tagList.length - props.showNum}`
  return numberStr.length + 4
})

// 获取标签内容
const getTagContent = (tag) => {
  const tagContent = (props.isStringTag ? tag : tag[props.nameKey]) || ''
  if (props.showTable) {
    return tagContent.length > 16 ? tagContent.slice(0, 9) + '...' : tagContent
  }
  return tagContent
}

// 获取标签key
const getTagKey = (tag) => {
  if (props.isStringTag) {
    return tag
  }
  return tag.id || tag[props.nameKey] || Math.random()
}

// 点击事件处理
const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
