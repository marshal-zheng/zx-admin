<template>
  <div class="zx-tabs-example">
    <div class="example-header">
      <h2>ZxTabs 标签页组件演示</h2>
      <p>基于 Element Plus 的增强标签页组件，支持拖拽排序、URL同步、懒加载等功能</p>
    </div>

    <div class="demo-section">
      <h3>基础用法</h3>
      <p>最简单的标签页用法</p>
      <ZxTabs v-model="activeTab1" :items="basicItems" />
    </div>

    <div class="demo-section">
      <h3>卡片类型</h3>
      <p>卡片样式的标签页</p>
      <ZxTabs v-model="activeTab2" :items="cardItems" type="card" />
    </div>

    <div class="demo-section">
      <h3>边框卡片类型</h3>
      <p>带边框的卡片样式</p>
      <ZxTabs v-model="activeTab3" :items="borderCardItems" type="border-card" />
    </div>

    <div class="demo-section">
      <h3>可编辑标签页</h3>
      <p>支持新增和删除标签页</p>
      <ZxTabs
        v-model="activeTab4"
        :items="editableItems"
        editable
        @tab-add="handleTabAdd"
        @tab-remove="handleTabRemove"
      />
    </div>

    <div class="demo-section">
      <h3>URL参数同步</h3>
      <p>标签页状态与URL参数同步，刷新页面保持状态</p>
      <ZxTabs v-model="activeTab5" :items="urlSyncItems" use-url-params param-name="demo-tab" />
    </div>

    <div class="demo-section">
      <h3>组件懒加载</h3>
      <p>标签页内容支持组件懒加载</p>
      <ZxTabs v-model="activeTab6" :items="lazyItems" lazy />
    </div>

    <div class="demo-section">
      <h3>垂直标签页</h3>
      <p>标签页位置在左侧</p>
      <ZxTabs
        v-model="activeTab7"
        :items="verticalItems"
        tab-position="left"
        style="height: 300px"
      />
    </div>

    <div class="demo-section">
      <h3>拉伸标签页</h3>
      <p>标签页平均分布</p>
      <ZxTabs v-model="activeTab8" :items="stretchItems" stretch />
    </div>

    <div class="demo-section">
      <h3>自定义标签内容</h3>
      <p>使用插槽自定义标签页内容</p>
      <ZxTabs v-model="activeTab9" :items="customItems">
        <template #custom1>
          <div class="custom-content">
            <el-icon><Star /></el-icon>
            <span>这是自定义内容 1</span>
          </div>
        </template>
        <template #custom2>
          <div class="custom-content">
            <el-icon><Plus /></el-icon>
            <span>这是自定义内容 2</span>
          </div>
        </template>
      </ZxTabs>
    </div>

    <!-- 事件日志 -->
    <div class="demo-section">
      <h3>事件日志</h3>
      <div class="event-log">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
          <span class="log-data">{{ log.data }}</span>
        </div>
      </div>
      <el-button @click="clearLogs" size="small">清空日志</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { Star, Plus, Document, Setting, User } from '@element-plus/icons-vue'
import ZxTabs from './index.vue'

// 响应式数据
const activeTab1 = ref('tab1')
const activeTab2 = ref('card1')
const activeTab3 = ref('border1')
const activeTab4 = ref('edit1')
const activeTab5 = ref('url1')
const activeTab6 = ref('lazy1')
const activeTab7 = ref('vertical1')
const activeTab8 = ref('stretch1')
const activeTab9 = ref('custom1')

// 事件日志
const eventLogs = ref([])

// 基础标签页数据
const basicItems = ref([
  {
    key: 'tab1',
    label: '用户管理',
    content: '这是用户管理的内容区域，可以在这里管理系统用户。'
  },
  {
    key: 'tab2',
    label: '角色管理',
    content: '这是角色管理的内容区域，可以在这里配置用户角色和权限。'
  },
  {
    key: 'tab3',
    label: '系统设置',
    content: '这是系统设置的内容区域，可以在这里配置系统参数。'
  }
])

// 卡片类型数据
const cardItems = ref([
  {
    key: 'card1',
    label: '概览',
    content: '系统概览信息展示'
  },
  {
    key: 'card2',
    label: '统计',
    content: '数据统计图表展示'
  },
  {
    key: 'card3',
    label: '报告',
    content: '系统报告生成和下载'
  }
])

// 边框卡片数据
const borderCardItems = ref([
  {
    key: 'border1',
    label: '任务列表',
    content: '当前待处理的任务列表'
  },
  {
    key: 'border2',
    label: '已完成',
    content: '已完成的任务记录'
  }
])

// 可编辑标签页数据
const editableItems = ref([
  {
    key: 'edit1',
    label: '标签页 1',
    content: '可编辑标签页内容 1',
    closable: true
  },
  {
    key: 'edit2',
    label: '标签页 2',
    content: '可编辑标签页内容 2',
    closable: true
  }
])

// URL同步数据
const urlSyncItems = ref([
  {
    key: 'url1',
    label: '首页',
    content: '首页内容，URL参数会同步更新'
  },
  {
    key: 'url2',
    label: '产品',
    content: '产品页面内容'
  },
  {
    key: 'url3',
    label: '关于',
    content: '关于页面内容'
  }
])

// 懒加载组件
const LazyComponent1 = markRaw({
  template: `
    <div style="padding: 20px; background: #f0f9ff; border-radius: 4px;">
      <h4>懒加载组件 1</h4>
      <p>这是一个懒加载的组件，只有在切换到此标签页时才会加载。</p>
      <el-button type="primary" @click="handleClick">点击测试</el-button>
    </div>
  `,
  setup() {
    const handleClick = () => {
      ElMessage.success('懒加载组件 1 被点击了！')
    }
    return { handleClick }
  }
})

const LazyComponent2 = markRaw({
  template: `
    <div style="padding: 20px; background: #f0f2f5; border-radius: 4px;">
      <h4>懒加载组件 2</h4>
      <p>另一个懒加载组件，展示不同的内容。</p>
      <el-tag type="success">成功标签</el-tag>
    </div>
  `
})

// 懒加载数据
const lazyItems = ref([
  {
    key: 'lazy1',
    label: '懒加载 1',
    component: LazyComponent1
  },
  {
    key: 'lazy2',
    label: '懒加载 2',
    component: LazyComponent2
  }
])

// 垂直标签页数据
const verticalItems = ref([
  {
    key: 'vertical1',
    label: '导航一',
    content: '垂直导航内容 1'
  },
  {
    key: 'vertical2',
    label: '导航二',
    content: '垂直导航内容 2'
  },
  {
    key: 'vertical3',
    label: '导航三',
    content: '垂直导航内容 3'
  }
])

// 拉伸标签页数据
const stretchItems = ref([
  {
    key: 'stretch1',
    label: '选项A',
    content: '拉伸标签页内容 A'
  },
  {
    key: 'stretch2',
    label: '选项B',
    content: '拉伸标签页内容 B'
  },
  {
    key: 'stretch3',
    label: '选项C',
    content: '拉伸标签页内容 C'
  }
])

// 自定义内容数据
const customItems = ref([
  {
    key: 'custom1',
    label: '自定义 1'
  },
  {
    key: 'custom2',
    label: '自定义 2'
  }
])

// 添加事件日志
const addLog = (event, data = '') => {
  const time = new Date().toLocaleTimeString()
  eventLogs.value.unshift({ time, event, data })
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}

// 处理标签页添加
const handleTabAdd = () => {
  const newKey = `edit${editableItems.value.length + 1}`
  const newTab = {
    key: newKey,
    label: `标签页 ${editableItems.value.length + 1}`,
    content: `新增的标签页内容 ${editableItems.value.length + 1}`,
    closable: true
  }
  editableItems.value.push(newTab)
  activeTab4.value = newKey
  addLog('标签页添加', `新增标签页: ${newTab.label}`)
  ElMessage.success('标签页添加成功')
}

// 处理标签页删除
const handleTabRemove = (key) => {
  const index = editableItems.value.findIndex((item) => item.key === key)
  if (index > -1) {
    const removedTab = editableItems.value[index]
    editableItems.value.splice(index, 1)

    // 如果删除的是当前激活的标签页，切换到其他标签页
    if (activeTab4.value === key && editableItems.value.length > 0) {
      activeTab4.value = editableItems.value[Math.max(0, index - 1)].key
    }

    addLog('标签页删除', `删除标签页: ${removedTab.label}`)
    ElMessage.success('标签页删除成功')
  }
}

// 清空日志
const clearLogs = () => {
  eventLogs.value = []
  ElMessage.info('日志已清空')
}
</script>

<style lang="scss" scoped>
.zx-tabs-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-header {
  margin-bottom: 40px;
  text-align: center;

  h2 {
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    color: #606266;
    font-size: 14px;
  }
}

.demo-section {
  margin-bottom: 40px;

  h3 {
    color: #303133;
    margin-bottom: 8px;
    font-size: 18px;
  }

  p {
    color: #606266;
    font-size: 14px;
    margin-bottom: 16px;
  }
}

.custom-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;

  .el-icon {
    font-size: 20px;
  }
}

.event-log {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;

  .log-item {
    display: flex;
    gap: 12px;
    padding: 4px 0;
    border-bottom: 1px solid #e9ecef;

    &:last-child {
      border-bottom: none;
    }

    .log-time {
      color: #6c757d;
      font-size: 12px;
      min-width: 80px;
    }

    .log-event {
      color: #495057;
      font-weight: 500;
      min-width: 80px;
    }

    .log-data {
      color: #6c757d;
      font-size: 12px;
    }
  }
}

// 暗色主题适配
[data-theme='dark'] {
  .example-header {
    h2 {
      color: #e4e7ed;
    }

    p {
      color: #c0c4cc;
    }
  }

  .demo-section {
    h3 {
      color: #e4e7ed;
    }

    p {
      color: #c0c4cc;
    }
  }

  .event-log {
    background: #2d2d2d;
    border-color: #4c4d4f;

    .log-item {
      border-color: #4c4d4f;

      .log-time,
      .log-data {
        color: #909399;
      }

      .log-event {
        color: #c0c4cc;
      }
    }
  }
}
</style>
