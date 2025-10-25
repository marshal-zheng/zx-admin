<template>
  <div v-if="visibleNotices.length > 0" class="panel-header-notices">
    <PanelHeaderNotice
      v-for="(notice, index) in visibleNotices"
      :key="`${notice.severity}-${index}`"
      :notice="notice"
      :can-inspect="canInspect"
      @inspect-click="handleInspectClick"
      @notice-click="handleNoticeClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PanelHeaderNotice from './PanelHeaderNotice.vue'
import type { PanelNotice } from './types'

interface Props {
  /** 面板ID */
  panelId?: string | number
  /** 通知列表 */
  notices?: PanelNotice[]
  /** 数据帧列表（用于自动检测通知） */
  dataFrames?: Array<{
    meta?: {
      notices?: Array<{
        severity: string
        text: string
        inspect?: string
        link?: string
      }>
    }
  }>
  /** 是否可以检查 */
  canInspect?: boolean
  /** 是否去重（基于severity） */
  deduplicate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  panelId: '',
  notices: () => [],
  dataFrames: () => [],
  canInspect: true,
  deduplicate: true
})

const emit = defineEmits<{
  /** 检查点击事件 */
  'inspect-click': [panelId: string | number, inspectTab: string, notice: PanelNotice, event: Event]
  /** 通知点击事件 */
  'notice-click': [panelId: string | number, notice: PanelNotice, event: Event]
}>()

/** 从数据帧中提取通知 */
const extractNoticesFromFrames = computed(() => {
  const notices: PanelNotice[] = []

  for (const frame of props.dataFrames) {
    if (!frame.meta?.notices) continue

    for (const notice of frame.meta.notices) {
      notices.push({
        severity: notice.severity as any,
        text: notice.text,
        inspect: notice.inspect,
        link: notice.link
      })
    }
  }

  return notices
})

/** 合并所有通知 */
const allNotices = computed(() => {
  const frameNotices = extractNoticesFromFrames.value
  const propNotices = props.notices || []

  return [...propNotices, ...frameNotices]
})

/** 可见的通知（去重处理） */
const visibleNotices = computed(() => {
  if (!props.deduplicate) {
    return allNotices.value
  }

  // 基于 severity 去重，保留第一个
  const seenSeverities = new Set<string>()
  const uniqueNotices: PanelNotice[] = []

  for (const notice of allNotices.value) {
    if (!seenSeverities.has(notice.severity)) {
      seenSeverities.add(notice.severity)
      uniqueNotices.push(notice)
    }
  }

  return uniqueNotices
})

/** 处理检查点击 */
const handleInspectClick = (notice: PanelNotice, inspectTab: string, event: Event) => {
  emit('inspect-click', props.panelId, inspectTab, notice, event)
}

/** 处理通知点击 */
const handleNoticeClick = (notice: PanelNotice, event: Event) => {
  emit('notice-click', props.panelId, notice, event)
}

/** 暴露方法给父组件 */
defineExpose({
  notices: visibleNotices,
  hasNotices: computed(() => visibleNotices.value.length > 0),
  hasErrors: computed(() => visibleNotices.value.some((n) => n.severity === 'error')),
  hasWarnings: computed(() => visibleNotices.value.some((n) => n.severity === 'warning'))
})
</script>

<script lang="ts">
export default {
  name: 'PanelHeaderNotices'
}
</script>

<style lang="scss" scoped>
.panel-header-notices {
  display: flex;
  align-items: center;
  gap: var(--panel-header-notices-gap, 4px);
}
</style>
