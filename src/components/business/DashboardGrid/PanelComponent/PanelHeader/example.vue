<template>
  <div class="panel-header-example">
    <h2>PanelHeader 组件示例</h2>

    <!-- 基础示例 -->
    <div class="example-section">
      <h3>基础使用</h3>
      <div class="example-container">
        <PanelHeader panel-id="basic-panel" title="基础面板" :draggable="true" />
      </div>
    </div>

    <!-- 带状态和通知的示例 -->
    <div class="example-section">
      <h3>带状态和通知</h3>
      <div class="example-container">
        <PanelHeader
          panel-id="status-panel"
          title="状态面板"
          alert-state="warning"
          time-info="5m ago"
          :notices="notices"
          @menu-action="handleMenuAction"
          @inspect-click="handleInspectClick"
        />
      </div>
    </div>

    <!-- 自定义菜单示例 -->
    <div class="example-section">
      <h3>自定义菜单</h3>
      <div class="example-container">
        <PanelHeader
          panel-id="custom-panel"
          title="自定义面板"
          :initial-menu-items="customMenuItems"
          :menu-config="customMenuConfig"
          @menu-click="handleMenuClick"
        />
      </div>
    </div>

    <!-- 带链接的示例 -->
    <div class="example-section">
      <h3>带链接</h3>
      <div class="example-container">
        <PanelHeader
          panel-id="links-panel"
          title="链接面板"
          :panel-links="panelLinks"
          @link-click="handleLinkClick"
        />
      </div>
    </div>

    <!-- 自定义内容示例 -->
    <div class="example-section">
      <h3>自定义内容</h3>
      <div class="example-container">
        <PanelHeader panel-id="custom-content-panel" :show-title-items="false">
          <template #title>
            <div class="custom-title">
              <zx-icon name="chart-line" />
              <span>图表面板</span>
              <el-tag size="small" type="success">实时</el-tag>
            </div>
          </template>

          <template #actions>
            <el-button size="small" type="primary" :icon="ElIconRefresh" circle />
            <el-button size="small" type="info" :icon="ElIconSetting" circle />
          </template>
        </PanelHeader>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import { Refresh as ElIconRefresh, Setting as ElIconSetting } from '@element-plus/icons-vue'
import PanelHeader from './index.vue'
import type { PanelMenuItem, PanelNotice } from './types'

// 通知数据
const notices = ref<PanelNotice[]>([
  {
    severity: 'warning',
    text: '数据延迟警告',
    inspect: 'data'
  },
  {
    severity: 'info',
    text: '查看详细信息',
    link: 'https://example.com'
  }
])

// 自定义菜单项
const customMenuItems = ref<PanelMenuItem[]>([
  {
    type: 'item',
    text: '刷新数据',
    iconClassName: 'refresh',
    shortcut: 'Ctrl+R',
    onClick: () => console.log('刷新数据')
  },
  {
    type: 'divider',
    text: 'divider-1'
  },
  {
    type: 'group',
    text: '导出选项',
    subMenu: [
      {
        type: 'item',
        text: '导出为PNG',
        iconClassName: 'image',
        onClick: () => console.log('导出PNG')
      },
      {
        type: 'item',
        text: '导出为PDF',
        iconClassName: 'document',
        onClick: () => console.log('导出PDF')
      }
    ]
  }
])

// 自定义菜单配置
const customMenuConfig = ref({
  showEdit: true,
  showDuplicate: false,
  showDelete: true,
  showExport: false,
  showFullscreen: true,
  customItems: []
})

// 面板链接
const panelLinks = ref([
  {
    title: '数据源文档',
    url: 'https://docs.example.com/datasource',
    icon: 'document'
  },
  {
    title: '报告模板',
    url: 'https://templates.example.com',
    icon: 'template'
  }
])

// 事件处理器
const handleMenuAction = (action: string, panelId: string | number, data?: any) => {
  console.log('Menu action:', action, panelId, data)

  switch (action) {
    case 'edit':
      console.log('编辑面板')
      break
    case 'duplicate':
      console.log('复制面板')
      break
    case 'delete':
      console.log('删除面板')
      break
    case 'fullscreen':
      console.log('全屏显示')
      break
    case 'export':
      console.log('导出面板')
      break
    case 'inspect':
      console.log('检查面板')
      break
  }
}

const handleMenuClick = (item: PanelMenuItem, event: Event) => {
  console.log('Menu click:', item.text, event)
}

const handleInspectClick = (
  panelId: string | number,
  inspectTab: string,
  notice: PanelNotice,
  event: Event
) => {
  console.log('Inspect click:', panelId, inspectTab, notice, event)
  // 这里可以打开检查面板
}

const handleLinkClick = (link: any, event: Event) => {
  console.log('Link click:', link.title, link.url, event)
}
</script>

<style lang="scss" scoped>
.panel-header-example {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.example-section {
  margin-bottom: 40px;

  h3 {
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
    font-size: 16px;
    font-weight: 600;
  }
}

.example-container {
  position: relative;
  height: 60px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  margin-bottom: 16px;
  overflow: hidden;
}

.custom-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

/* 确保示例容器内的面板头部正确显示 */
:deep(.panel-header) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
}
</style>
