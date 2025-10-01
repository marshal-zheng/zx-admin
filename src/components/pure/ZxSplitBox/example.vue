<template>
  <div class="zx-split-box-example">
    <div class="example-header">
      <h1>ZxSplitBox 分割面板组件示例</h1>
      <p>基于 Element Plus 的可调整大小的分割面板组件</p>
    </div>

    <div class="example-section">
      <h2>基础用法</h2>
      <p>水平分割面板，支持拖拽调整大小</p>
      <div class="demo-container">
        <ZxSplitBox
          :default-size="300"
          :min-size="200"
          :max-size="500"
          direction="horizontal"
          :allow-collapse="true"
        >
          <template #first>
            <div class="demo-panel demo-panel--primary">
              <h3>左侧面板</h3>
              <p>这是左侧面板的内容</p>
              <el-button type="primary">按钮示例</el-button>
            </div>
          </template>
          <template #second>
            <div class="demo-panel demo-panel--success">
              <h3>右侧面板</h3>
              <p>这是右侧面板的内容，可以拖拽左侧的分割线来调整大小</p>
              <el-tag type="success">标签示例</el-tag>
            </div>
          </template>
        </ZxSplitBox>
      </div>
    </div>

    <div class="example-section">
      <h2>垂直分割</h2>
      <p>垂直分割面板，上下布局</p>
      <div class="demo-container">
        <ZxSplitBox
          :default-size="200"
          :min-size="100"
          :max-size="400"
          direction="vertical"
          :allow-collapse="true"
        >
          <template #first>
            <div class="demo-panel demo-panel--warning">
              <h3>顶部面板</h3>
              <p>这是顶部面板的内容</p>
              <el-switch v-model="switchValue" active-text="开启" inactive-text="关闭" />
            </div>
          </template>
          <template #second>
            <div class="demo-panel demo-panel--info">
              <h3>底部面板</h3>
              <p>这是底部面板的内容，可以拖拽上方的分割线来调整大小</p>
              <el-progress :percentage="progressValue" :stroke-width="8" />
            </div>
          </template>
        </ZxSplitBox>
      </div>
    </div>

    <div class="example-section">
      <h2>嵌套分割</h2>
      <p>分割面板可以嵌套使用，创建复杂的布局</p>
      <div class="demo-container">
        <ZxSplitBox :default-size="250" direction="horizontal" :allow-collapse="true">
          <template #first>
            <div class="demo-panel demo-panel--primary">
              <h3>侧边栏</h3>
              <el-menu :default-active="activeMenu" class="demo-menu" @select="handleMenuSelect">
                <el-menu-item index="1">
                  <el-icon><Document /></el-icon>
                  <span>文档</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <el-icon><Setting /></el-icon>
                  <span>设置</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <el-icon><User /></el-icon>
                  <span>用户</span>
                </el-menu-item>
              </el-menu>
            </div>
          </template>
          <template #second>
            <ZxSplitBox :default-size="150" direction="vertical" :allow-collapse="true">
              <template #first>
                <div class="demo-panel demo-panel--success">
                  <h3>工具栏</h3>
                  <el-button-group>
                    <el-button type="primary" :icon="Plus">新建</el-button>
                    <el-button type="success" :icon="Edit">编辑</el-button>
                    <el-button type="danger" :icon="Delete">删除</el-button>
                  </el-button-group>
                </div>
              </template>
              <template #second>
                <div class="demo-panel demo-panel--info">
                  <h3>主内容区</h3>
                  <p>当前选中菜单：{{ activeMenu }}</p>
                  <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="name" label="姓名" width="120" />
                    <el-table-column prop="age" label="年龄" width="80" />
                    <el-table-column prop="address" label="地址" />
                  </el-table>
                </div>
              </template>
            </ZxSplitBox>
          </template>
        </ZxSplitBox>
      </div>
    </div>

    <div class="example-section">
      <h2>配置选项</h2>
      <p>通过不同的配置选项来自定义组件行为</p>
      <div class="config-panel">
        <el-form :model="config" label-width="120px">
          <el-form-item label="分割方向">
            <el-radio-group v-model="config.direction">
              <el-radio label="horizontal">水平</el-radio>
              <el-radio label="vertical">垂直</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="默认大小">
            <el-slider v-model="config.defaultSize" :min="100" :max="500" show-input />
          </el-form-item>
          <el-form-item label="最小大小">
            <el-slider v-model="config.minSize" :min="50" :max="300" show-input />
          </el-form-item>
          <el-form-item label="最大大小">
            <el-slider v-model="config.maxSize" :min="300" :max="800" show-input />
          </el-form-item>
          <el-form-item label="允许收起">
            <el-switch v-model="config.allowCollapse" />
          </el-form-item>
          <el-form-item label="禁用调整">
            <el-switch v-model="config.disabled" />
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-container">
        <ZxSplitBox
          :default-size="config.defaultSize"
          :min-size="config.minSize"
          :max-size="config.maxSize"
          :direction="config.direction"
          :allow-collapse="config.allowCollapse"
          :disabled="config.disabled"
          @resize="handleResize"
          @collapse="handleCollapse"
          @expand="handleExpand"
        >
          <template #first>
            <div class="demo-panel demo-panel--primary">
              <h3>面板 A</h3>
              <p>当前大小：{{ currentSize }}px</p>
              <p>配置：{{ JSON.stringify(config, null, 2) }}</p>
            </div>
          </template>
          <template #second>
            <div class="demo-panel demo-panel--success">
              <h3>面板 B</h3>
              <p>这是第二个面板的内容</p>
              <el-alert
                title="提示"
                description="你可以通过左侧的配置面板来调整组件的行为"
                type="info"
                show-icon
                :closable="false"
              />
            </div>
          </template>
        </ZxSplitBox>
      </div>
    </div>

    <div class="example-section">
      <h2>事件监听</h2>
      <p>组件支持多种事件，可以监听用户的操作</p>
      <div class="event-log">
        <h4>事件日志：</h4>
        <div class="log-container">
          <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-event">{{ log.event }}</span>
            <span class="log-data">{{ log.data }}</span>
          </div>
        </div>
        <el-button @click="clearLogs" size="small" type="danger">清空日志</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Document, Setting, User, Plus, Edit, Delete } from '@element-plus/icons-vue'
import ZxSplitBox from './index.vue'

// 响应式数据
const switchValue = ref(true)
const progressValue = ref(70)
const activeMenu = ref('1')
const currentSize = ref(300)
const eventLogs = ref([])

// 配置选项
const config = reactive({
  direction: 'horizontal',
  defaultSize: 300,
  minSize: 150,
  maxSize: 500,
  allowCollapse: true,
  disabled: false
})

// 表格数据
const tableData = ref([
  { name: '张三', age: 25, address: '北京市朝阳区' },
  { name: '李四', age: 30, address: '上海市浦东新区' },
  { name: '王五', age: 28, address: '广州市天河区' }
])

// 事件处理函数
const handleMenuSelect = (index) => {
  activeMenu.value = index
  addEventLog('menu-select', `选中菜单: ${index}`)
}

const handleResize = (size) => {
  currentSize.value = size
  addEventLog('resize', `调整大小: ${size}px`)
}

const handleCollapse = () => {
  addEventLog('collapse', '面板已收起')
}

const handleExpand = () => {
  addEventLog('expand', '面板已展开')
}

const addEventLog = (event, data) => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  eventLogs.value.unshift({ time, event, data })
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}

const clearLogs = () => {
  eventLogs.value = []
}
</script>

<style scoped>


/* 响应式设计 */
@media (width <= 768px) {
  .zx-split-box-example {
    padding: 10px;
  }

  .demo-container {
    height: 300px;
  }

  .demo-panel {
    padding: 15px;
  }

  .config-panel {
    padding: 15px;
  }
}

.zx-split-box-example {
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
}

.example-header {
  margin-bottom: 40px;
  text-align: center;
}

.example-header h1 {
  margin-bottom: 10px;
  color: #409eff;
}

.example-header p {
  font-size: 16px;
  color: #666;
}

.example-section {
  margin-bottom: 40px;
}

.example-section h2 {
  padding-bottom: 5px;
  margin-bottom: 10px;
  color: #303133;
  border-bottom: 2px solid #409eff;
}

.example-section p {
  margin-bottom: 20px;
  color: #666;
}

.demo-container {
  height: 400px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.demo-panel {
  display: flex;
  height: 100%;
  padding: 20px;
  flex-direction: column;
  gap: 15px;
}

.demo-panel--primary {
  background-color: #ecf5ff;
  border-left: 4px solid #409eff;
}

.demo-panel--success {
  background-color: #f0f9ff;
  border-left: 4px solid #67c23a;
}

.demo-panel--warning {
  background-color: #fdf6ec;
  border-left: 4px solid #e6a23c;
}

.demo-panel--info {
  background-color: #f4f4f5;
  border-left: 4px solid #909399;
}

.demo-panel h3 {
  margin: 0 0 10px;
  color: #303133;
}

.demo-panel p {
  margin: 0;
  line-height: 1.6;
  color: #606266;
}

.demo-menu {
  background: transparent;
  border: none;
}

.config-panel {
  padding: 20px;
  margin-bottom: 20px;
  background: #f8f9fa;
  border-radius: 4px;
}

.event-log {
  margin-top: 20px;
}

.event-log h4 {
  margin-bottom: 10px;
  color: #303133;
}

.log-container {
  max-height: 200px;
  padding: 15px;
  margin-bottom: 10px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.log-item {
  display: flex;
  padding: 5px 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  border-bottom: 1px solid #e4e7ed;
  gap: 10px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  min-width: 60px;
  color: #909399;
}

.log-event {
  min-width: 80px;
  font-weight: bold;
  color: #409eff;
}

.log-data {
  color: #606266;
  flex: 1;
}
</style>
