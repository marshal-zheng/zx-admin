<template>
  <ElTour
    v-model="open"
    :current="current"
    :mask="maskConfig"
    :z-index="zIndex"
    :scroll-into-view-options="scrollOptions"
    @change="handleChange"
    @finish="handleFinish"
    @close="handleClose"
  >
    <ElTourStep
      v-for="step in steps"
      :key="step.id"
      :title="step.title"
      :description="step.description"
      :placement="step.placement ?? 'bottom'"
      :target="resolveTarget(step.target)"
      :next-button-props="{ type: 'primary' }"
      :prev-button-props="{ text: true }"
    >
      <template #default>
        <div class="tour-step-content">
          <div v-if="step.description" class="tour-step-description">
            {{ step.description }}
          </div>
        </div>
      </template>
    </ElTourStep>

    <!-- 自定义指示器 -->
    <template #indicators="{ current: currentIndex, total }">
      <div class="tour-indicators">
        <span class="tour-indicator-text">{{ currentIndex + 1 }} / {{ total }}</span>
      </div>
    </template>
  </ElTour>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElTour, ElTourStep } from 'element-plus'
import { tourService } from '@/tour/service'
import type { TourStep } from '@/tour/types'

// 响应式状态
const open = ref(false)
const current = ref(0)
const steps = ref<TourStep[]>([])

// 配置项
const maskConfig = computed(() => ({
  color: 'rgba(0, 0, 0, 0.45)',
  style: {
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)'
  }
}))

const zIndex = 2100

const scrollOptions: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'center',
  inline: 'center'
}

// 生命周期
onMounted(() => {
  // 挂载服务
  tourService.mount({ open, current, steps })
})

// 方法
function resolveTarget(target: string | (() => HTMLElement | null)): HTMLElement | string {
  if (typeof target === 'function') {
    const element = target()
    return element || ''
  }
  return target
}

function handleChange(index: number): void {
  tourService.onChange(index)
}

function handleFinish(): void {
  tourService.onFinish()
}

function handleClose(): void {
  tourService.onClose()
}
</script>

<style scoped lang="less">
.tour-step-content {
  font-size: 14px;
  line-height: 1.6;
}

.tour-step-description {
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
}

.tour-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
}

.tour-indicator-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  opacity: 0.8;
}

/* 覆盖 Element Plus 默认样式 */
:deep(.el-tour__content) {
  padding: 16px;
}

:deep(.el-tour__footer) {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-tour__closebtn) {
  top: 12px;
  right: 12px;
}
</style>

