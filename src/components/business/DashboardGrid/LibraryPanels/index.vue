<template>
  <ZxFloatingPanel
    title="组件库"
    :width="320"
    :height="600"
    :resizable="true"
    :default-collapsed="false"
    :collapsible="true"
    class="library-panels"
  >
    <!-- 组件列表区域 -->
    <div class="library-panels__content">
      <!-- 搜索区域 -->
      <div class="library-panels__search">
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
        class="component-list"
      >
        <template #item="{ item, index }">
          <div
            class="component-item"
            :draggable="true"
            @dragstart="handleDragStart($event, item)"
            @dragend="handleDragEnd($event)"
            @click="handleComponentSelect(item)"
          >
            <div class="component-item__icon">
              <ZxIcon :icon="`svg-icon:${item.icon}`" :size="item.size || 24" type="element" />
            </div>
            <div class="component-item__content">
              <div class="component-item__title">{{ item.name }}</div>
              <div class="component-item__description">{{ item.description }}</div>
            </div>
          </div>
        </template>
      </ZxList>
    </div>
  </ZxFloatingPanel>
</template>

<script setup>
import { ref, computed } from 'vue'
import ZxFloatingPanel from '../../../pure/ZxFloatingPanel/index.vue'
import ZxSearch from '../../../pure/ZxSearch/index.vue'
import ZxList from '../../../pure/ZxList/index.vue'
import ZxIcon from '../../../pure/ZxIcon/index.vue'
import { setDragPayload, clearDragPayload } from '../dragPayloadStore'
import { allComponentTypes, getDefaultConfig } from './config.js'
import './index.scss'

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
  if (!searchKeyword.value) {
    return componentTypes.value
  }

  const keyword = searchKeyword.value.toLowerCase()
  return componentTypes.value.filter(
    (component) =>
      component.name.toLowerCase().includes(keyword) ||
      component.description.toLowerCase().includes(keyword)
  )
})

// 方法
const handleSearch = (value) => {
  searchKeyword.value = value
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
