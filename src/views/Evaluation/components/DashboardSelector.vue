<template>
  <ZxGridList
    ref="gridListRef"
    :load-data="loadDashboardData"
    :show-pagination="false"
    :default-page-size="999"
    :load-on-mounted="true"
    :clear-selection-on-load="true"
    class="dashboard-grid-list w-full h-full"
  >
    <!-- 搜索栏 -->
    <template #form="{ query, loading, refresh, updateState }">
      <div class="zx-grid-form-bar">
        <div class="zx-grid-form-bar__right w-full">
          <ZxSearch
            v-model="query.keyword"
            placeholder="搜索仪表盘名称或描述"
            :loading="loading"
            search-mode="click"
            @search="() => onSearch({ refresh, updateState })"
            @clear="() => onSearch({ refresh, updateState })"
          />
        </div>
      </div>
    </template>

    <!-- 卡片网格内容 -->
    <template #table="{ grid }">
      <ElEmpty
        v-if="!grid.list || grid.list.length === 0"
        description="暂无仪表盘数据"
        :image-size="140"
      />

      <div v-else class="w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        <ElCard
          v-for="item in grid.list"
          :key="item.id"
          shadow="hover"
          :body-style="{ padding: '16px', height: '100%' }"
          :class="[
            'dashboard-card cursor-pointer transition-all duration-300 border-2',
            selectedId === item.id
              ? 'is-selected border-primary bg-primary-light-9'
              : 'border-transparent hover:border-primary-light-5'
          ]"
          @click="handleSelectDashboard(item)"
        >
          <template #header>
            <div class="flex items-center justify-between gap-2 py-2">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <Icon
                  :icon="selectedId === item.id ? 'ep:select' : 'ep:monitor'"
                  :size="18"
                  :class="selectedId === item.id ? 'text-primary' : 'text-info'"
                />
                <ElText
                  tag="b"
                  size="default"
                  truncated
                  :type="selectedId === item.id ? 'primary' : ''"
                  class="flex-1 min-w-0 font-semibold"
                >
                  {{ item.schemeName }}
                </ElText>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <ElTooltip content="预览仪表盘" placement="top">
                  <ElButton link type="primary" :icon="View" @click.stop="handlePreview(item)" />
                </ElTooltip>
                <ElTag
                  v-if="selectedId === item.id"
                  type="primary"
                  effect="dark"
                  size="small"
                  round
                >
                  已选中
                </ElTag>
              </div>
            </div>
          </template>

          <div class="flex flex-col h-full">
            <div class="flex-1 min-h-0">
              <ElText type="info" class="text-sm leading-relaxed line-clamp-3 block">
                {{ item.schemeDescribe || '暂无描述' }}
              </ElText>
            </div>

            <div class="pt-3 mt-3 border-t border-[var(--el-border-color-lighter)]">
              <div class="flex items-center gap-1.5">
                <Icon icon="ep:calendar" :size="14" class="text-info" />
                <ElText size="small" type="info">
                  {{ item.createTime }}
                </ElText>
              </div>
            </div>
          </div>
        </ElCard>
      </div>
    </template>
  </ZxGridList>

  <!-- 预览弹窗 -->
  <DashboardPreviewDialog ref="previewDialogRef" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@/components/Icon'
import { dashboardApi } from '@/api/modules/evaluation/dashboard'
import { View } from '@element-plus/icons-vue'
import DashboardPreviewDialog from './DashboardPreviewDialog.vue'

defineOptions({ name: 'DashboardSelector' })

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const gridListRef = ref()
const selectedId = ref(props.modelValue)

// 预览弹窗引用
const previewDialogRef = ref()

// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    selectedId.value = val
  }
)

// 数据加载函数 - 适配 ZxGridList
const loadDashboardData = async (params) => {
  const response = await dashboardApi.getDashboardList({
    ...params,
    pageNumber: 1,
    pageSize: 999
  })
  return response
}

// 搜索处理
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 选择仪表盘
const handleSelectDashboard = (item) => {
  selectedId.value = item.id
  emit('update:modelValue', item.id)
  emit('change', item.id, item)
}

// 预览仪表盘
const handlePreview = (item) => {
  previewDialogRef.value?.open({
    dashboardId: item.id,
    config: item.config || null,
    name: item.schemeName || ''
  })
}

// 暴露方法
defineExpose({
  refresh: () => gridListRef.value?.refresh()
})
</script>

<style lang="less" scoped>
:deep(.zx-grid-list) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.zx-grid-list__main) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

:deep(.zx-grid-list__table) {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding: 16px;
}

.dashboard-card {
  height: 220px;
  display: flex;
  flex-direction: column;

  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &.is-selected {
    :deep(.el-card__header) {
      background-color: var(--el-color-primary-light-9);
      border-bottom-color: var(--el-color-primary-light-7);
    }
  }
}
</style>
