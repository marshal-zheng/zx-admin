<template>
  <el-dropdown
    v-if="menuItems && menuItems.length > 0"
    :class="['zx-panel-header-menu', className]"
    popper-class="zx-panel-header-menu__popper"
    :style="style"
    trigger="click"
    placement="bottom-end"
    :show-arrow="false"
    @command="handleMenuCommand"
  >
    <el-icon :class="['zx-panel-header-menu__trigger-icon']" :style="{ color: iconHoverColor }">
      <MoreFilled />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(item, index) in visibleMenuItems" :key="`${item.text}-${index}`">
          <!-- 分隔线 -->
          <template v-if="item.type === 'divider'">
            <li class="el-dropdown-menu__item--divided"></li>
          </template>

          <!-- 分组 -->
          <template v-else-if="item.type === 'group'">
            <li class="zx-panel-header-menu__group-title">
              {{ item.text }}
            </li>
            <template v-if="item.subMenu">
              <el-dropdown-item
                v-for="(subItem, subIndex) in item.subMenu.filter(
                  (subItem) => subItem.visible !== false
                )"
                :key="`${subItem.text}-${subIndex}`"
                :command="subItem"
                :disabled="subItem.disabled"
                :class="[
                  'zx-panel-header-menu__sub-item',
                  { 'zx-panel-header-menu__item--disabled': subItem.disabled }
                ]"
              >
                <ZxIcon
                  v-if="subItem.iconClassName"
                  type="element"
                  :icon="subItem.iconClassName"
                  class="zx-panel-header-menu__icon"
                />
                <span class="zx-panel-header-menu__text">{{ subItem.text }}</span>
                <span v-if="subItem.shortcut" class="zx-panel-header-menu__shortcut">
                  {{ subItem.shortcut }}
                </span>
              </el-dropdown-item>
            </template>
          </template>

          <!-- 普通菜单项 -->
          <template v-else>
            <el-dropdown-item
              :command="item"
              :disabled="item.disabled"
              :class="[
                'zx-panel-header-menu__item',
                { 'zx-panel-header-menu__item--disabled': item.disabled }
              ]"
            >
              <ZxIcon
                v-if="item.iconClassName"
                type="element"
                :icon="item.iconClassName"
                class="zx-panel-header-menu__icon"
              />
              <span class="zx-panel-header-menu__text">{{ item.text }}</span>
              <span v-if="item.shortcut" class="zx-panel-header-menu__shortcut">
                {{ item.shortcut }}
              </span>
            </el-dropdown-item>
          </template>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import type { PanelMenuItem } from './types'
import { MoreFilled } from '@element-plus/icons-vue'

interface Props {
  /** 菜单项列表 */
  menuItems?: PanelMenuItem[]
  /** 自定义样式 */
  style?: Record<string, any>
  /** 自定义类名 */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [],
  style: () => ({}),
  className: ''
})

const emit = defineEmits<{
  /** 菜单项点击事件 */
  'menu-click': [item: PanelMenuItem, event: Event]
}>()

/** 过滤可见的菜单项 */
const visibleMenuItems = computed(() => {
  return props.menuItems.filter((item) => item.visible !== false)
})

/** 图标 hover 颜色 */
const iconHoverColor = computed(() => {
  return 'var(--panel-header-menu-icon-hover-color, var(--el-text-color-primary))'
})

/** 处理菜单命令 */
const handleMenuCommand = (item: PanelMenuItem) => {
  if (item.disabled) return

  // 如果有链接，打开链接
  if (item.href) {
    window.open(item.href, '_blank')
    return
  }

  // 触发点击事件
  const event = new Event('click')
  if (item.onClick) {
    item.onClick(event)
  }

  // 向父组件发送事件
  emit('menu-click', item, event)
}
</script>

<style lang="scss">
/* 去掉 scoped，使用 zx 前缀避免全局样式冲突 */
.zx-panel-header-menu__popper {
  .el-popper__arrow {
    display: none;
  }
}

.zx-panel-header-menu {
  &__trigger-icon {
    color: var(--panel-header-menu-icon-color, var(--el-text-color-secondary));
    font-size: var(--panel-header-menu-icon-size, 16px);
    cursor: pointer;
    transition: color var(--el-transition-duration-fast) ease;

    &:hover {
      color: var(--panel-header-menu-icon-hover-color, var(--el-text-color-primary));
    }
  }

  &__trigger {
    --el-button-text-color: var(--panel-header-menu-trigger-color, var(--el-text-color-secondary));
    --el-button-hover-text-color: var(
      --panel-header-menu-trigger-hover-color,
      var(--el-text-color-primary)
    );
    --el-button-hover-bg-color: var(
      --panel-header-menu-trigger-hover-bg,
      var(--el-fill-color-light)
    );

    width: var(--panel-header-menu-trigger-size, 24px);
    height: var(--panel-header-menu-trigger-size, 24px);
    border: none;
    transition: all var(--el-transition-duration-fast) ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--panel-header-menu-focus-color, var(--el-color-primary-light-7));
    }
  }

  &__icon {
    margin-right: var(--panel-header-menu-icon-margin, 8px);
    color: var(--panel-header-menu-icon-color, var(--el-text-color-secondary));
    font-size: var(--panel-header-menu-icon-size, 14px);
  }

  &__text {
    flex: 1;
    color: var(--panel-header-menu-text-color, var(--el-text-color-primary));
  }

  &__shortcut {
    margin-left: auto;
    padding-left: var(--panel-header-menu-shortcut-padding, 16px);
    color: var(--panel-header-menu-shortcut-color, var(--el-text-color-placeholder));
    font-size: var(--panel-header-menu-shortcut-size, 12px);
    opacity: 0.7;
  }

  &__group-title {
    padding: var(--panel-header-menu-group-padding, 8px 16px 4px);
    color: var(--panel-header-menu-group-color, var(--el-text-color-secondary));
    font-size: var(--panel-header-menu-group-size, 12px);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--panel-header-menu-group-border, var(--el-border-color-lighter));
    margin-bottom: 4px;
    list-style: none;
  }

  &__sub-item {
    padding-left: var(--panel-header-menu-sub-item-padding, 32px) !important;
  }

  &__item--disabled {
    opacity: var(--panel-header-menu-disabled-opacity, 0.5);
    cursor: not-allowed;

    &:hover {
      background-color: transparent !important;
    }
  }
}

/* Element Plus 下拉菜单样式优化 */
.zx-panel-header-menu__popper {
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    min-height: var(--panel-header-menu-item-height, 32px);
    padding: var(--panel-header-menu-item-padding, 8px 16px);
    border-radius: var(--panel-header-menu-item-border-radius, 4px);
    margin: var(--panel-header-menu-item-margin, 0 4px);
    transition: all var(--el-transition-duration-fast) ease;

    &:hover {
      background-color: var(--panel-header-menu-item-hover-bg, var(--el-fill-color));
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &--divided {
      border-top: 1px solid var(--panel-header-menu-divider-color, var(--el-border-color-light));
      margin: var(--panel-header-menu-divider-margin, 4px 0);
      padding: 0;
      height: 1px;
    }
  }

  .el-dropdown-menu {
    border: 1px solid var(--panel-header-menu-border-color, var(--el-border-color-light));
    border-radius: var(--panel-header-menu-border-radius, 8px);
    box-shadow: var(--panel-header-menu-shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
    background-color: var(--panel-header-menu-bg, var(--el-bg-color-overlay));
    padding: var(--panel-header-menu-padding, 4px 0);
    min-width: var(--panel-header-menu-min-width, 160px);
  }
}

/* 隐藏下拉菜单的三角箭头，提升企业级应用视觉效果 */
.el-popper.is-pure {
  padding: 0;
}

.el-popper[data-popper-placement^='bottom'] .el-popper__arrow,
.el-popper[data-popper-placement^='top'] .el-popper__arrow,
.el-popper[data-popper-placement^='left'] .el-popper__arrow,
.el-popper[data-popper-placement^='right'] .el-popper__arrow {
  display: none !important;
}
</style>
