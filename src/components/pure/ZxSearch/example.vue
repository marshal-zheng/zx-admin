<template>
  <div class="zx-search-example">
    <div class="example-header">
      <h2>ZxSearch 组件示例</h2>
      <p>基于 Element Plus 的搜索组件，支持多种搜索模式和配置</p>
    </div>

    <!-- 不同搜索模式演示 -->
    <div class="demo-section">
      <h3>不同搜索模式演示</h3>

      <div class="config-demo">
        <h4>点击图标搜索模式（默认）</h4>
        <ZxSearch
          v-model="searchValue2"
          search-mode="click"
          placeholder="输入内容后点击搜索图标"
          @search="handleSearch2"
        />
        <p class="mode-description">需要点击搜索图标才会触发搜索事件</p>
      </div>

      <div class="config-demo">
        <h4>直接输入检索模式</h4>
        <ZxSearch
          v-model="searchValue3"
          search-mode="input"
          placeholder="直接输入即可搜索（防抖300ms）"
          @search="handleSearch3"
        />
        <p class="mode-description">输入内容后自动触发搜索（防抖300ms），无需点击搜索按钮</p>
      </div>

      <div class="result-display">
        <h4>搜索结果展示</h4>
        <p><strong>点击模式搜索值:</strong> {{ searchValue2 }}</p>
        <p><strong>输入模式搜索值:</strong> {{ searchValue3 }}</p>
      </div>
    </div>

    <!-- 表格数据筛选演示 -->
    <div class="demo-section">
      <h3>表格数据筛选</h3>
      <div class="search-container">
        <ZxSearch
          v-model="searchValue"
          placeholder="请输入搜索内容筛选表格数据"
          @search="handleSearch"
          @clear="handleClear"
        />
      </div>

      <div class="table-container">
        <el-table :data="filteredTableData" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="应用名" width="150" />
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '运行中' ? 'success' : 'info'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
        </el-table>
      </div>

      <div class="result-display">
        <p><strong>搜索值:</strong> {{ searchValue }}</p>
        <p><strong>搜索模式:</strong> 模糊搜索（默认）</p>
        <p><strong>筛选结果:</strong> 共 {{ filteredTableData.length }} 条数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ZxSearch from './index.vue'

// 搜索相关数据
const searchValue = ref('')
const searchValue2 = ref('')
const searchValue3 = ref('')

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '用户管理系统',
    type: 'Web应用',
    status: '运行中',
    description: '企业用户权限管理平台',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '数据分析平台',
    type: 'Web应用',
    status: '停止',
    description: '业务数据统计分析工具',
    createTime: '2024-01-20 14:20:00'
  },
  {
    id: 3,
    name: '移动端APP',
    type: '移动应用',
    status: '运行中',
    description: '客户服务移动应用',
    createTime: '2024-02-01 09:15:00'
  },
  {
    id: 4,
    name: 'API网关',
    type: '微服务',
    status: '运行中',
    description: '统一API接口管理',
    createTime: '2024-02-10 16:45:00'
  },
  {
    id: 5,
    name: '消息推送服务',
    type: '微服务',
    status: '运行中',
    description: '实时消息推送系统',
    createTime: '2024-02-15 11:30:00'
  },
  {
    id: 6,
    name: '文件存储服务',
    type: '微服务',
    status: '停止',
    description: '分布式文件存储',
    createTime: '2024-02-20 13:20:00'
  },
  {
    id: 7,
    name: '监控告警系统',
    type: 'Web应用',
    status: '运行中',
    description: '系统性能监控和告警',
    createTime: '2024-03-01 08:00:00'
  },
  {
    id: 8,
    name: '日志分析工具',
    type: 'Web应用',
    status: '运行中',
    description: '系统日志收集分析',
    createTime: '2024-03-05 15:10:00'
  }
])

// 筛选后的表格数据
const filteredTableData = computed(() => {
  if (!searchValue.value.trim()) {
    return tableData.value
  }

  const keyword = searchValue.value.toLowerCase()
  return tableData.value.filter((item) => {
    return (
      item.name.toLowerCase().includes(keyword) ||
      item.type.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    )
  })
})

// 事件处理函数
const handleSearch = (searchData) => {
  console.log('搜索事件:', searchData)
  ElMessage.success(`搜索: ${searchData.value}`)
}

const handleClear = () => {
  console.log('清空搜索')
  ElMessage.info('已清空搜索内容')
}

const handleSearch2 = (searchData) => {
  console.log('点击模式搜索:', searchData)
  ElMessage.success(`点击搜索: ${searchData.value}`)
}

const handleSearch3 = (searchData) => {
  console.log('输入模式搜索:', searchData)
  ElMessage.success(`输入搜索: ${searchData.value}`)
}
</script>

<style lang="scss" scoped>
.zx-search-example {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.example-header {
  text-align: center;
  margin-bottom: 40px;

  h2 {
    color: var(--el-text-color-primary);
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 600;
  }

  p {
    color: var(--el-text-color-secondary);
    font-size: 16px;
  }
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-bg-color);

  h3 {
    color: var(--el-text-color-primary);
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
    border-bottom: 2px solid var(--el-color-primary-light-8);
    padding-bottom: 8px;
  }
}

.config-demo {
  margin-bottom: 24px;

  h4 {
    color: var(--el-text-color-regular);
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 500;
  }
}

.mode-description {
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--el-color-info-light-9);
  border-left: 3px solid var(--el-color-info);
  border-radius: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.search-container {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.result-display {
  margin-top: 16px;
  padding: 12px;
  background: var(--el-color-info-light-9);
  border-left: 3px solid var(--el-color-info);
  border-radius: 4px;

  h4 {
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  p {
    margin: 4px 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .zx-search-example {
    padding: 16px;
  }

  .demo-section {
    padding: 16px;
  }
}
</style>
