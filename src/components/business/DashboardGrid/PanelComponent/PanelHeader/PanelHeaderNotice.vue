<template>
  <div class="panel-header-notice" :class="`panel-header-notice--${notice.severity}`">
    <!-- 可点击的通知（带检查功能） -->
    <ZxButton
      v-if="notice.inspect && canInspect"
      class="panel-header-notice__button"
      :class="`panel-header-notice__button--${notice.severity}`"
      :icon="getNoticeIcon(notice.severity)"
      circle
      text
      size="small"
      @click="handleInspectClick"
    />

    <!-- 外部链接通知 -->
    <a
      v-else-if="notice.link"
      class="panel-header-notice__link"
      :class="`panel-header-notice__link--${notice.severity}`"
      :href="notice.link"
      :aria-label="notice.text"
      target="_blank"
      rel="noopener noreferrer"
    >
      <ZxIcon :icon="getNoticeIcon(notice.severity)" class="panel-header-notice__icon" />
    </a>

    <!-- 普通通知（仅显示） -->
    <ZxTooltipOrPopover v-else :content="notice.text" placement="bottom" :disabled="!notice.text">
      <div
        class="panel-header-notice__display"
        :class="`panel-header-notice__display--${notice.severity}`"
      >
        <ZxIcon :icon="getNoticeIcon(notice.severity)" class="panel-header-notice__icon" />
      </div>
    </ZxTooltipOrPopover>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PanelNotice, PanelMenuSeverity } from './types'

interface Props {
  /** 通知信息 */
  notice: PanelNotice
  /** 是否可以检查 */
  canInspect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canInspect: true
})

const emit = defineEmits<{
  /** 检查点击事件 */
  'inspect-click': [notice: PanelNotice, inspectTab: string, event: Event]
  /** 通知点击事件 */
  'notice-click': [notice: PanelNotice, event: Event]
}>()

/** 获取通知图标 */
const getNoticeIcon = (severity: PanelMenuSeverity): string => {
  switch (severity) {
    case 'error':
      return 'circle-close-filled'
    case 'warning':
      return 'warning-filled'
    case 'success':
      return 'circle-check-filled'
    case 'info':
    default:
      return 'info-filled'
  }
}

/** 处理检查点击 */
const handleInspectClick = (event: Event) => {
  event.stopPropagation()

  if (props.notice.inspect) {
    emit('inspect-click', props.notice, props.notice.inspect, event)
  }

  emit('notice-click', props.notice, event)
}
</script>

<style lang="scss" scoped>
.panel-header-notice {
  display: flex;
  align-items: center;
  justify-content: center;

  &__button {
    --el-button-text-color: var(--panel-header-notice-color, var(--el-text-color-secondary));
    --el-button-hover-text-color: var(
      --panel-header-notice-hover-color,
      var(--el-text-color-primary)
    );
    --el-button-hover-bg-color: var(--panel-header-notice-hover-bg, var(--el-fill-color-light));

    width: var(--panel-header-notice-size, 24px);
    height: var(--panel-header-notice-size, 24px);
    border: none;
    border-radius: var(--panel-header-notice-radius, var(--el-border-radius-base));
    transition: all var(--el-transition-duration-fast) ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--panel-header-notice-focus-color, var(--el-color-primary-light-7));
    }

    &--error {
      --el-button-text-color: var(--panel-header-notice-error-color, var(--el-color-danger));
      --el-button-hover-text-color: var(
        --panel-header-notice-error-hover-color,
        var(--el-color-danger-dark-2)
      );
      --el-button-hover-bg-color: var(
        --panel-header-notice-error-hover-bg,
        var(--el-color-danger-light-9)
      );
    }

    &--warning {
      --el-button-text-color: var(--panel-header-notice-warning-color, var(--el-color-warning));
      --el-button-hover-text-color: var(
        --panel-header-notice-warning-hover-color,
        var(--el-color-warning-dark-2)
      );
      --el-button-hover-bg-color: var(
        --panel-header-notice-warning-hover-bg,
        var(--el-color-warning-light-9)
      );
    }

    &--success {
      --el-button-text-color: var(--panel-header-notice-success-color, var(--el-color-success));
      --el-button-hover-text-color: var(
        --panel-header-notice-success-hover-color,
        var(--el-color-success-dark-2)
      );
      --el-button-hover-bg-color: var(
        --panel-header-notice-success-hover-bg,
        var(--el-color-success-light-9)
      );
    }

    &--info {
      --el-button-text-color: var(--panel-header-notice-info-color, var(--el-color-info));
      --el-button-hover-text-color: var(
        --panel-header-notice-info-hover-color,
        var(--el-color-info-dark-2)
      );
      --el-button-hover-bg-color: var(
        --panel-header-notice-info-hover-bg,
        var(--el-color-info-light-9)
      );
    }
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--panel-header-notice-size, 24px);
    height: var(--panel-header-notice-size, 24px);
    border-radius: var(--panel-header-notice-radius, var(--el-border-radius-base));
    text-decoration: none;
    transition: all var(--el-transition-duration-fast) ease;

    &:hover {
      background-color: var(--panel-header-notice-hover-bg, var(--el-fill-color-light));
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--panel-header-notice-focus-color, var(--el-color-primary-light-7));
    }

    &--error {
      color: var(--panel-header-notice-error-color, var(--el-color-danger));

      &:hover {
        color: var(--panel-header-notice-error-hover-color, var(--el-color-danger-dark-2));
        background-color: var(--panel-header-notice-error-hover-bg, var(--el-color-danger-light-9));
      }
    }

    &--warning {
      color: var(--panel-header-notice-warning-color, var(--el-color-warning));

      &:hover {
        color: var(--panel-header-notice-warning-hover-color, var(--el-color-warning-dark-2));
        background-color: var(
          --panel-header-notice-warning-hover-bg,
          var(--el-color-warning-light-9)
        );
      }
    }

    &--success {
      color: var(--panel-header-notice-success-color, var(--el-color-success));

      &:hover {
        color: var(--panel-header-notice-success-hover-color, var(--el-color-success-dark-2));
        background-color: var(
          --panel-header-notice-success-hover-bg,
          var(--el-color-success-light-9)
        );
      }
    }

    &--info {
      color: var(--panel-header-notice-info-color, var(--el-color-info));

      &:hover {
        color: var(--panel-header-notice-info-hover-color, var(--el-color-info-dark-2));
        background-color: var(--panel-header-notice-info-hover-bg, var(--el-color-info-light-9));
      }
    }
  }

  &__display {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--panel-header-notice-size, 24px);
    height: var(--panel-header-notice-size, 24px);
    padding: var(--panel-header-notice-padding, 4px);
    border-radius: var(--panel-header-notice-radius, var(--el-border-radius-base));
    cursor: default;
    transition: all var(--el-transition-duration-fast) ease;

    &:hover {
      background-color: var(--panel-header-notice-hover-bg, var(--el-fill-color-light));
    }

    &--error {
      color: var(--panel-header-notice-error-color, var(--el-color-danger));

      &:hover {
        color: var(--panel-header-notice-error-hover-color, var(--el-color-danger-dark-2));
        background-color: var(--panel-header-notice-error-hover-bg, var(--el-color-danger-light-9));
      }
    }

    &--warning {
      color: var(--panel-header-notice-warning-color, var(--el-color-warning));

      &:hover {
        color: var(--panel-header-notice-warning-hover-color, var(--el-color-warning-dark-2));
        background-color: var(
          --panel-header-notice-warning-hover-bg,
          var(--el-color-warning-light-9)
        );
      }
    }

    &--success {
      color: var(--panel-header-notice-success-color, var(--el-color-success));

      &:hover {
        color: var(--panel-header-notice-success-hover-color, var(--el-color-success-dark-2));
        background-color: var(
          --panel-header-notice-success-hover-bg,
          var(--el-color-success-light-9)
        );
      }
    }

    &--info {
      color: var(--panel-header-notice-info-color, var(--el-color-info));

      &:hover {
        color: var(--panel-header-notice-info-hover-color, var(--el-color-info-dark-2));
        background-color: var(--panel-header-notice-info-hover-bg, var(--el-color-info-light-9));
      }
    }
  }

  &__icon {
    font-size: var(--panel-header-notice-icon-size, 14px);
    transition: color var(--el-transition-duration-fast) ease;
  }
}
</style>
