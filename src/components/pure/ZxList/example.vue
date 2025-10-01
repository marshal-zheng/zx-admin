<template>
  <div class="zx-list-example">
    <h2>ZxList 列表组件示例</h2>

    <!-- 基础用法 -->
    <section class="example-section">
      <h3>基础用法</h3>
      <p>最简单的列表展示</p>
      <ZxList :data="basicData" @item-click="handleItemClick" />
    </section>

    <!-- 带操作菜单 -->
    <section class="example-section">
      <h3>带操作菜单</h3>
      <p>列表项支持更多操作</p>
      <ZxList
        :data="actionData"
        :item-actions="itemActions"
        @item-click="handleItemClick"
        @action-select="handleActionSelect"
      />
    </section>

    <!-- 加载状态 -->
    <section class="example-section">
      <h3>加载状态</h3>
      <p>显示加载中和没有更多数据的状态</p>
      <div class="operation-bar">
        <el-button @click="toggleLoading">{{ loading ? '停止加载' : '开始加载' }}</el-button>
        <el-button @click="toggleNoMore">{{
          noMoreData ? '有更多数据' : '没有更多数据'
        }}</el-button>
      </div>
      <ZxList
        :data="loadingData"
        :loading="loading"
        :no-more-data="noMoreData"
        :max-height="300"
        @load-more="handleLoadMore"
        @item-click="handleItemClick"
      />
    </section>

    <!-- 自定义内容 -->
    <section class="example-section">
      <h3>自定义内容</h3>
      <p>自定义列表项内容和空状态</p>
      <ZxList :data="customData">
        <template #item="{ item }">
          <div class="custom-item">
            <el-avatar :src="item.avatar" :size="40" />
            <div class="custom-item__content">
              <div class="custom-item__name">{{ item.name }}</div>
              <div class="custom-item__role">{{ item.role }}</div>
            </div>
            <el-tag :type="item.status === 'online' ? 'success' : 'info'">
              {{ item.status === 'online' ? '在线' : '离线' }}
            </el-tag>
          </div>
        </template>
        <template #empty>
          <div class="custom-empty">
            <el-icon size="48" color="#ccc"><User /></el-icon>
            <p>暂无用户数据</p>
            <el-button type="primary" @click="loadCustomData">加载用户</el-button>
          </div>
        </template>
      </ZxList>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ZxList from './index.vue'

// 基础数据
const basicData = ref([])

// 带操作的数据
const actionData = ref([])

// 加载状态数据
const loadingData = ref([])
const loading = ref(false)
const noMoreData = ref(false)

// 自定义数据
const customData = ref([])

// 操作菜单
const itemActions = ref([
  { label: '编辑', value: 'edit', icon: 'Edit' },
  { label: '删除', value: 'delete', icon: 'Delete' },
  { label: '查看详情', value: 'view', icon: 'View' }
])

// 加载基础数据
const loadBasicData = () => {
  basicData.value = [
    { id: 1, title: '列表项 1', description: '这是第一个列表项的描述信息' },
    { id: 2, title: '列表项 2', description: '这是第二个列表项的描述信息' },
    { id: 3, title: '列表项 3', description: '这是第三个列表项的描述信息' },
    { id: 4, title: '列表项 4', description: '这是第四个列表项的描述信息' },
    { id: 5, title: '列表项 5', description: '这是第五个列表项的描述信息' }
  ]
}

// 加载带操作的数据
const loadActionData = () => {
  actionData.value = [
    { id: 1, title: '任务 1', description: '完成项目文档编写' },
    { id: 2, title: '任务 2', description: '代码审查和优化' },
    { id: 3, title: '任务 3', description: '测试用例编写' }
  ]
}

// 加载状态数据
const loadStateData = () => {
  loadingData.value = [
    { id: 1, title: '数据项 1', description: '已加载的数据项' },
    { id: 2, title: '数据项 2', description: '已加载的数据项' }
  ]
}

// 加载自定义数据
const loadCustomData = () => {
  customData.value = [
    {
      id: 1,
      name: '张三',
      role: '前端开发工程师',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
    },
    {
      id: 2,
      name: '李四',
      role: '后端开发工程师',
      status: 'offline',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
    },
    {
      id: 3,
      name: '王五',
      role: 'UI设计师',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
    }
  ]
}

// 切换加载状态
const toggleLoading = () => {
  loading.value = !loading.value
}

// 切换没有更多数据状态
const toggleNoMore = () => {
  noMoreData.value = !noMoreData.value
}

// 处理加载更多
const handleLoadMore = () => {
  ElMessage.info('触发加载更多')
}

// 列表项点击事件
const handleItemClick = (item, index) => {
  console.log('点击了列表项:', item, '索引:', index)
  ElMessage.success(`点击了: ${item.title || item.name}`)
}

// 操作选择事件
const handleActionSelect = (action, item, index) => {
  console.log('选择了操作:', action, '项目:', item, '索引:', index)
  ElMessage.success(`${action.label}: ${item.title}`)
}

// 初始化
onMounted(() => {
  loadBasicData()
  loadActionData()
  loadStateData()
})
</script>

<style scoped>


/* 响应式设计 */
@media (width <= 768px) {
  .zx-list-example {
    padding: 16px;
  }

  .example-section {
    padding: 16px;
    margin-bottom: 24px;
  }

  .operation-bar {
    flex-direction: column;
  }

  .custom-item {
    gap: 8px;
  }
}

.zx-list-example {
  max-width: 800px;
  padding: 24px;
  margin: 0 auto;
}

.example-section {
  padding: 24px;
  margin-bottom: 32px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.example-section h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.example-section p {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
}

.operation-bar {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
}

.custom-item {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.custom-item__content {
  flex: 1;
}

.custom-item__name {
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.custom-item__role {
  font-size: 12px;
  color: #909399;
}

.custom-empty {
  padding: 40px 20px;
  color: #909399;
  text-align: center;
}

.custom-empty .el-icon {
  margin-bottom: 16px;
}

.custom-empty p {
  margin: 16px 0;
  font-size: 14px;
}
</style>
