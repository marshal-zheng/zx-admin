<template>
  <div class="zx-collapsible-container-example">
    <!-- 背景内容区域 -->
    <div class="background-content">
      <h1>ZxFloatingPanel 浮动面板组件示例</h1>
      <p>支持展开收起的浮动面板组件，具有状态指示和平滑动画效果</p>
    </div>

    <!-- 浮动的可折叠容器 -->
    <ZxFloatingPanel title="工具面板" :default-collapsed="true">
      <h4>快速操作</h4>
      <div class="action-buttons">
        <el-button type="primary" size="small" @click="handleAction('新建')">
          <el-icon><Plus /></el-icon>
          新建
        </el-button>
        <el-button type="success" size="small" @click="handleAction('保存')">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
        <el-button type="warning" size="small" @click="handleAction('编辑')">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
      </div>

      <el-divider />

      <h4>设置选项</h4>
      <div class="settings">
        <el-switch
          v-model="settings.autoSave"
          active-text="自动保存"
          @change="handleSettingChange('autoSave', $event)"
        />
        <el-switch
          v-model="settings.notifications"
          active-text="通知提醒"
          @change="handleSettingChange('notifications', $event)"
        />
      </div>

      <el-divider />

      <h4>统计信息</h4>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">总数:</span>
          <span class="stat-value">{{ stats.total }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">完成:</span>
          <span class="stat-value">{{ stats.completed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">进行中:</span>
          <span class="stat-value">{{ stats.inProgress }}</span>
        </div>
      </div>
    </ZxFloatingPanel>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Check, Edit } from '@element-plus/icons-vue'
import ZxFloatingPanel from './index.vue'

// 设置选项
const settings = reactive({
  autoSave: true,
  notifications: false
})

// 统计数据
const stats = reactive({
  total: 156,
  completed: 89,
  inProgress: 67
})

// 容器样式 - 浮动在左上角
const containerStyle = computed(() => ({
  top: '20px',
  left: '20px',
  zIndex: 1000,
  width: '280px'
}))

// 方法
const handleAction = (action) => {
  ElMessage.success(`执行${action}操作`)
}

const handleSettingChange = (key, value) => {
  ElMessage.info(`${key === 'autoSave' ? '自动保存' : '通知提醒'}: ${value ? '开启' : '关闭'}`)
}
</script>

<style scoped>


/* 响应式设计 */
@media (width <= 768px) {
  .background-content {
    padding: 60px 15px 15px;
  }

  .background-content h1 {
    font-size: 2rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

.zx-collapsible-container-example {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.background-content {
  max-width: 1200px;
  padding: 80px 20px 20px;
  margin: 0 auto;
}

.background-content h1 {
  margin-bottom: 20px;
  font-size: 2.5rem;
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgb(0 0 0 / 30%);
}

.background-content > p {
  margin-bottom: 40px;
  font-size: 1.1rem;
  color: rgb(255 255 255 / 90%);
  text-align: center;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.content-card {
  padding: 20px;
  color: white;
  background: rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgb(0 0 0 / 20%);
}

.content-card h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: white;
}

.content-card p {
  line-height: 1.6;
  color: rgb(255 255 255 / 80%);
}

/* 浮动容器内容样式 */
h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-buttons .el-button {
  justify-content: flex-start;
  width: 100%;
}

.action-buttons .el-button .el-icon {
  margin-right: 6px;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-color-primary);
}
</style>
