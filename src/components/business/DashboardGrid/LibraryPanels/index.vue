<template>
  <zx-floating-panel
    title="组件库"
    class="cmp-floating-panel"
    :default-collapsed="true"
    :position="{ top: '120px', left: '24px' }"
    :size="{ width: '320px', maxHeight: '600px' }"
    :collapsed-size="{ width: '48px', height: '48px' }"
  >
    <!-- 组件列表区域 -->
    <div class="h-[calc(100%-60px)] overflow-hidden">
      <!-- 搜索区域 -->
      <div class="m-0.5 mb-3 p-0 px-0.5 overflow-visible relative z-1">
        <ZxSearch
          v-model="searchKeyword"
          placeholder="搜索组件类型..."
          :show-search-button="false"
          search-mode="input"
          @search="handleSearch"
          @input="handleSearch"
        />
      </div>

      <ZxList
        :data="filteredComponents"
        :selectable="false"
        :hoverable="true"
        class="h-full border-none pb-3"
        style="--zx-list-container-padding: 0; --zx-list-container-gap: 6px"
      >
        <template #item="{ item, index }">
          <div
            class="flex items-center rounded-md cursor-grab transition-all duration-200 ease-linear select-none w-full active:cursor-grabbing mb-1.5"
            :class="{ 'opacity-60 cursor-copy scale-95': false }"
            style="padding: 10px 12px; border: none"
            :draggable="true"
            @dragstart="handleDragStart($event, item)"
            @dragend="handleDragEnd($event)"
            @click="handleComponentSelect(item)"
          >
            <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded mr-2.5">
              <ZxIcon
                :icon="`svg-icon:${item.icon}`"
                :size="item.size || 24"
                type="element"
                class="text-[var(--el-color-primary)] text-base"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div
                class="text-sm font-medium text-[var(--el-text-color-primary)] mb-0.5 leading-tight"
              >
                {{ item.name }}
              </div>
              <div
                class="text-xs text-[var(--el-text-color-regular)] leading-tight overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {{ item.description }}
              </div>
            </div>
          </div>
        </template>
      </ZxList>
    </div>
  </zx-floating-panel>
</template>

<script setup>
import { ref, computed } from 'vue'
import { setDragPayload, clearDragPayload } from '../dragPayloadStore.ts'
import { allComponentTypes, getDefaultConfig } from './config'

// 组件名称
defineOptions({
  name: 'LibraryPanels'
})

// 事件定义
const emit = defineEmits(['component-select', 'component-drag'])

// 响应式数据
const searchKeyword = ref('')

// 组件数据（从外部数据文件导入）
const componentTypes = ref(allComponentTypes)

// 计算属性 - 过滤后的组件
const filteredComponents = computed(() => {
  // 确保 searchKeyword.value 是字符串且不为空
  if (!searchKeyword.value || typeof searchKeyword.value !== 'string') {
    return componentTypes.value
  }

  const keyword = searchKeyword.value.toLowerCase().trim()
  if (!keyword) {
    return componentTypes.value
  }

  return componentTypes.value.filter(
    (component) =>
      component.name.toLowerCase().includes(keyword) ||
      component.description.toLowerCase().includes(keyword)
  )
})

// 方法
const handleSearch = (value) => {
  // 确保 value 是字符串类型，防止显示 [object Object]
  if (typeof value === 'string') {
    searchKeyword.value = value
  } else if (value && typeof value === 'object' && value.target) {
    // 如果是事件对象，获取 input 的值
    searchKeyword.value = value.target.value || ''
  } else {
    // 其他情况设为空字符串
    searchKeyword.value = ''
  }
}

const handleComponentSelect = (component) => {
  emit('component-select', component)
}

const handleDragStart = (event, component) => {
  console.log(component, event)
  // 获取组件的默认配置
  const defaultConfig = getDefaultConfig(component.id)

  const { type, widget, name: title, description } = component

  // 设置拖拽数据 - 使用text/plain格式，与DashboardGrid期望的格式一致
  const dragPayload = {
    widget,
    type,
    title,
    description,
    w: defaultConfig.w, // 使用组件的默认宽度
    h: defaultConfig.h // 使用组件的默认高度
  }

  event.dataTransfer.setData('text/plain', JSON.stringify(dragPayload))

  // 设置拖拽效果
  event.dataTransfer.effectAllowed = 'copy'

  // 记录到共享 store，便于 grid 在 dragover 阶段读取 w/h
  setDragPayload(dragPayload)

  // 添加拖拽状态类
  event.target.classList.add('is-dragging')

  // 触发拖拽事件
  emit('component-drag', { event, component })
}

const handleDragEnd = (event) => {
  // 清理共享 store
  clearDragPayload()
  // 移除拖拽状态类
  event.target.classList.remove('is-dragging')
}
</script>
<style lang="less">
.cmp-floating-panel {
  --zx-list-item-bg: var(--el-bg-color-page);
  --zx-list-bg: transparent;
  --cmp-floating-panel-border-radius: 0;
  .zx-list__container {
    padding-right: 10px;
    .zx-list__item:last-child {
      margin-bottom: 30px;
    }
  }
}
</style>
