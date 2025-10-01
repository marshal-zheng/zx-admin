<template>
  <div class="zx-detail-card-wrapper">
    <div
      class="zx-detail-card"
      :style="{
        padding: props.padding,
        borderRadius: props.enableBorderRadius ? 'var(--cmp-detail-card-border-radius, 8px)' : '0'
      }"
    >
      <div class="zx-detail-card-title">
        <div class="flex flex-1 items-center gap-[8px]">
          <slot name="titlePrefix"></slot>
          <ZxTooltipOrPopover :content="props.title">
            <div
              class="one-line-text max-w-[300px] font-medium text-[var(--cmp-detail-card-title-color)]"
            >
              {{ props.title }}
            </div>
          </ZxTooltipOrPopover>
          <slot name="titleAppend"></slot>
        </div>
        <div v-if="$slots.titleRight" class="flex items-center overflow-hidden">
          <slot name="titleRight"></slot>
        </div>
      </div>
      <div v-if="showingDescription.length > 0" class="zx-detail-card-desc">
        <div
          v-for="item of showingDescription"
          :key="item.key"
          :class="[
            `zx-detail-card-desc-item ${
              Array.isArray(item.value) && item.value.length > 0 ? 'zx-detail-card-desc-tag' : ''
            } flex w-[calc(100%/3)] items-center gap-[8px]`
          ]"
          :style="{ width: item.width }"
        >
          <div class="whitespace-nowrap text-[var(--cmp-detail-card-label-color)]">
            {{ item.locale }}
          </div>
          <div v-if="Array.isArray(item.value)" class="pr-[24px]">
            <ZxTagGroup :tag-list="item.value" size="small" is-string-tag />
          </div>
          <slot v-else :name="item.key" :value="item.value">
            <ZxTooltipOrPopover
              :content="item.value"
              :disabled="isEmpty(item.value)"
              :placement="item.tooltipPosition"
            >
              <div
                class="text-ov overflow-hidden overflow-ellipsis whitespace-nowrap pr-[24px] text-[var(--cmp-detail-card-value-color)]"
                >{{ item.value || '-' }}</div
              >
            </ZxTooltipOrPopover>
          </slot>
        </div>
      </div>
      <button
        v-if="props.simpleShowCount !== undefined && props.simpleShowCount > 0"
        type="button"
        class="more-btn"
        @click="toggleExpand"
      >
        <div v-if="isExpand" class="flex items-center gap-[4px]">
          {{ '收起' }}
          <ZxIcon icon="ArrowUp" :size="14" />
        </div>
        <div v-else class="flex items-center gap-[4px]">
          {{ '更多' }}
          <ZxIcon icon="ArrowDown" :size="14" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isEmpty } from 'lodash-es'
import ZxTagGroup from '../ZxTag/ZxTagGroup/index.vue'
import ZxTooltipOrPopover from '../ZxTooltipOrPopover/index.vue'
import ZxIcon from '../ZxIcon/index.vue'

// 组件名称
defineOptions({
  name: 'ZxDetailCard'
})

// Props 定义
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: Array,
    default: () => []
  },
  simpleShowCount: {
    type: Number,
    default: undefined
  },
  padding: {
    type: String,
    default: '20px'
  },
  enableBorderRadius: {
    type: Boolean,
    default: false
  }
})

// 事件定义
const emit = defineEmits(['expand', 'collapse'])

// 响应式数据
const isExpand = ref(false)

// 方法
function toggleExpand() {
  isExpand.value = !isExpand.value
  emit(isExpand.value ? 'expand' : 'collapse')
}

// 计算属性
const showingDescription = computed(() => {
  if (isExpand.value) {
    return props.description
  }
  if (props.simpleShowCount && props.description.length > props.simpleShowCount) {
    return props.description.slice(0, props.simpleShowCount)
  }
  return props.description
})
</script>

<style lang="scss">
@import './index.scss';
</style>
