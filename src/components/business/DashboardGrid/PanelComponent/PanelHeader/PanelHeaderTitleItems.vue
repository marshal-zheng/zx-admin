<template>
  <div v-if="visibleItems.length > 0" class="panel-header-title-items">
    <template v-for="(item, index) in visibleItems" :key="`${item.type}-${index}`">
      <!-- 状态指示器 -->
      <div
        v-if="item.type === 'status'"
        class="panel-header-title-item panel-header-title-item--status"
        :class="`panel-header-title-item--${item.status}`"
      >
        <ZxTooltipOrPopover
          :content="item.tooltip || getStatusText(item.status)"
          placement="bottom"
        >
          <ZxIcon
            :icon="getStatusIcon(item.status)"
            :class="[
              'panel-header-title-item__icon',
              `panel-header-title-item__icon--${item.status}`
            ]"
          />
        </ZxTooltipOrPopover>
      </div>

      <!-- 时间偏移显示 -->
      <div
        v-else-if="item.type === 'timeshift'"
        class="panel-header-title-item panel-header-title-item--timeshift"
        @click="item.onClick && item.onClick($event)"
      >
        <ZxTooltipOrPopover :content="item.tooltip || '时间偏移信息'" placement="bottom">
          <div class="panel-header-title-item__timeshift">
            <ZxIcon icon="Clock" class="panel-header-title-item__icon" />
            <span class="panel-header-title-item__text">{{ item.content }}</span>
          </div>
        </ZxTooltipOrPopover>
      </div>

      <!-- 链接项 -->
      <div
        v-else-if="item.type === 'links'"
        class="panel-header-title-item panel-header-title-item--links"
      >
        <el-dropdown
          v-if="panelLinks && panelLinks.length > 0"
          trigger="click"
          placement="bottom-end"
          @command="handleLinkCommand"
        >
          <ZxButton
            class="panel-header-title-item__link-trigger"
            :icon="ElIconLink"
            circle
            text
            size="small"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(link, linkIndex) in panelLinks"
                :key="`link-${linkIndex}`"
                :command="link"
                :disabled="!link.url"
              >
                <ZxIcon
                  v-if="link.icon"
                  :icon="link.icon"
                  class="panel-header-title-item__link-icon"
                />
                <span>{{ link.title || link.url }}</span>
                <ZxIcon icon="ExternalLink" class="panel-header-title-item__external-icon" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 自定义项 -->
      <div
        v-else-if="item.type === 'custom'"
        class="panel-header-title-item panel-header-title-item--custom"
        @click="item.onClick && item.onClick($event)"
      >
        <ZxTooltipOrPopover v-if="item.tooltip" :content="item.tooltip" placement="bottom">
          <div class="panel-header-title-item__custom">
            <ZxIcon v-if="item.icon" :icon="item.icon" class="panel-header-title-item__icon" />
            <span v-if="item.content" class="panel-header-title-item__text">
              {{ item.content }}
            </span>
          </div>
        </ZxTooltipOrPopover>
        <div v-else class="panel-header-title-item__custom">
          <ZxIcon v-if="item.icon" :icon="item.icon" class="panel-header-title-item__icon" />
          <span v-if="item.content" class="panel-header-title-item__text">
            {{ item.content }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Link as ElIconLink } from '@element-plus/icons-vue'
import type { PanelTitleItem, PanelMenuSeverity } from './types'

interface PanelLink {
  title?: string
  url: string
  icon?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

interface Props {
  /** 标题项列表 */
  titleItems?: PanelTitleItem[]
  /** 面板链接 */
  panelLinks?: PanelLink[]
  /** 状态信息 */
  alertState?: PanelMenuSeverity
  /** 时间信息 */
  timeInfo?: string
}

const props = withDefaults(defineProps<Props>(), {
  titleItems: () => [],
  panelLinks: () => [],
  alertState: undefined,
  timeInfo: ''
})

const emit = defineEmits<{
  /** 标题项点击事件 */
  'title-item-click': [item: PanelTitleItem, event: Event]
  /** 链接点击事件 */
  'link-click': [link: PanelLink, event: Event]
}>()

/** 获取可见的标题项 */
const visibleItems = computed(() => {
  const items = [...props.titleItems]

  // 自动添加状态项
  if (props.alertState) {
    items.unshift({
      type: 'status',
      status: props.alertState
    })
  }

  // 自动添加时间偏移项
  if (props.timeInfo) {
    items.push({
      type: 'timeshift',
      content: props.timeInfo
    })
  }

  // 自动添加链接项
  if (props.panelLinks && props.panelLinks.length > 0) {
    items.push({
      type: 'links'
    })
  }

  return items
})

/** 获取状态图标 */
const getStatusIcon = (status?: PanelMenuSeverity): string => {
  switch (status) {
    case 'error':
      return 'WarningFilled'
    case 'warning':
      return 'Warning'
    case 'success':
      return 'CircleCheckFilled'
    case 'info':
    default:
      return 'InfoFilled'
  }
}

/** 获取状态文本 */
const getStatusText = (status?: PanelMenuSeverity): string => {
  switch (status) {
    case 'error':
      return '错误状态'
    case 'warning':
      return '警告状态'
    case 'success':
      return '正常状态'
    case 'info':
    default:
      return '信息状态'
  }
}

/** 处理链接命令 */
const handleLinkCommand = (link: PanelLink) => {
  if (!link.url) return

  const event = new Event('click')

  // 打开链接
  window.open(link.url, link.target || '_blank')

  // 发送事件
  emit('link-click', link, event)
}
</script>

<style lang="scss" scoped>
.panel-header-title-items {
  display: flex;
  align-items: center;
  gap: var(--panel-header-title-items-gap, 8px);
  margin-left: auto;
  margin-right: var(--panel-header-title-items-margin-right, 8px);
}

.panel-header-title-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--panel-header-title-item-height, 24px);
  border-radius: var(--panel-header-title-item-radius, var(--el-border-radius-base));
  transition: all var(--el-transition-duration-fast) ease;
  cursor: pointer;

  &__icon {
    font-size: var(--panel-header-title-item-icon-size, 14px);
    transition: color var(--el-transition-duration-fast) ease;
  }

  &__text {
    margin-left: var(--panel-header-title-item-text-margin, 4px);
    font-size: var(--panel-header-title-item-text-size, 12px);
    color: var(--panel-header-title-item-text-color, var(--el-text-color-regular));
    white-space: nowrap;
  }

  &__timeshift {
    display: flex;
    align-items: center;
    padding: var(--panel-header-title-item-timeshift-padding, 4px 8px);
    background-color: var(--panel-header-title-item-timeshift-bg, var(--el-fill-color-light));
    border-radius: var(--panel-header-title-item-timeshift-radius, var(--el-border-radius-base));

    &:hover {
      background-color: var(--panel-header-title-item-timeshift-hover-bg, var(--el-fill-color));
    }
  }

  &__custom {
    display: flex;
    align-items: center;
    padding: var(--panel-header-title-item-custom-padding, 4px);

    &:hover {
      background-color: var(--panel-header-title-item-custom-hover-bg, var(--el-fill-color-light));
      border-radius: var(
        --panel-header-title-item-custom-hover-radius,
        var(--el-border-radius-base)
      );
    }
  }

  &__link-trigger {
    --el-button-text-color: var(
      --panel-header-title-item-link-color,
      var(--el-text-color-secondary)
    );
    --el-button-hover-text-color: var(
      --panel-header-title-item-link-hover-color,
      var(--el-text-color-primary)
    );
    --el-button-hover-bg-color: var(
      --panel-header-title-item-link-hover-bg,
      var(--el-fill-color-light)
    );

    width: var(--panel-header-title-item-link-size, 24px);
    height: var(--panel-header-title-item-link-size, 24px);
    border: none;
  }

  &__link-icon {
    margin-right: var(--panel-header-title-item-link-icon-margin, 8px);
    color: var(--panel-header-title-item-link-icon-color, var(--el-text-color-secondary));
  }

  &__external-icon {
    margin-left: auto;
    color: var(--panel-header-title-item-external-icon-color, var(--el-text-color-placeholder));
    font-size: var(--panel-header-title-item-external-icon-size, 12px);
  }

  // 状态相关样式
  &--status {
    padding: var(--panel-header-title-item-status-padding, 4px);

    &:hover {
      background-color: var(--panel-header-title-item-status-hover-bg, var(--el-fill-color-light));
    }
  }

  &--success {
    .panel-header-title-item__icon--success {
      color: var(--panel-header-title-item-success-color, var(--el-color-success));
    }

    &:hover .panel-header-title-item__icon--success {
      color: var(--panel-header-title-item-success-hover-color, var(--el-color-success-dark-2));
    }
  }

  &--warning {
    .panel-header-title-item__icon--warning {
      color: var(--panel-header-title-item-warning-color, var(--el-color-warning));
    }

    &:hover .panel-header-title-item__icon--warning {
      color: var(--panel-header-title-item-warning-hover-color, var(--el-color-warning-dark-2));
    }
  }

  &--error {
    .panel-header-title-item__icon--error {
      color: var(--panel-header-title-item-error-color, var(--el-color-danger));
    }

    &:hover .panel-header-title-item__icon--error {
      color: var(--panel-header-title-item-error-hover-color, var(--el-color-danger-dark-2));
    }
  }

  &--info {
    .panel-header-title-item__icon--info {
      color: var(--panel-header-title-item-info-color, var(--el-color-info));
    }

    &:hover .panel-header-title-item__icon--info {
      color: var(--panel-header-title-item-info-hover-color, var(--el-color-info-dark-2));
    }
  }

  &--timeshift {
    .panel-header-title-item__icon {
      color: var(--panel-header-title-item-timeshift-icon-color, var(--el-color-primary));
    }

    .panel-header-title-item__text {
      color: var(--panel-header-title-item-timeshift-text-color, var(--el-color-primary));
    }

    &:hover {
      .panel-header-title-item__icon,
      .panel-header-title-item__text {
        color: var(--panel-header-title-item-timeshift-hover-color, var(--el-color-primary-dark-2));
      }
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  min-height: var(--panel-header-title-item-dropdown-item-height, 32px);

  &:hover {
    background-color: var(--panel-header-title-item-dropdown-item-hover-bg, var(--el-fill-color));
  }
}
</style>
