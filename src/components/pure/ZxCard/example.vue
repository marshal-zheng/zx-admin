<template>
  <div class="zx-card-example">
    <div class="example-header">
      <h1>ZxCard 组件示例</h1>
      <p>展示 ZxCard 组件的各种用法和配置选项</p>
    </div>

    <!-- 基础用法 -->
    <div class="example-section">
      <h2>基础用法</h2>
      <ZxCard title="基础卡片" sub-title="这是一个基础的卡片示例">
        <div class="demo-content">
          <p>这是卡片的内容区域。</p>
          <p>可以放置任何内容，如表单、表格、图表等。</p>
        </div>
      </ZxCard>
    </div>

    <!-- 简单模式 -->
    <div class="example-section">
      <h2>简单模式</h2>
      <ZxCard simple>
        <div class="demo-content">
          <p>简单模式的卡片，没有标题栏和底部操作栏。</p>
          <p>适用于纯内容展示的场景。</p>
        </div>
      </ZxCard>
    </div>

    <!-- 加载状态 -->
    <div class="example-section">
      <h2>加载状态</h2>
      <ZxCard title="加载中的卡片" :loading="loading">
        <div class="demo-content">
          <p>这个卡片正在加载中...</p>
          <el-button @click="toggleLoading">切换加载状态</el-button>
        </div>
      </ZxCard>
    </div>

    <!-- 编辑模式 -->
    <div class="example-section">
      <h2>编辑模式</h2>
      <ZxCard
        title="编辑用户信息"
        sub-title="修改用户的基本信息"
        :is-edit="true"
        @save="handleSave"
      >
        <div class="demo-content">
          <el-form :model="form" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-form>
        </div>
      </ZxCard>
    </div>

    <!-- 创建模式 -->
    <div class="example-section">
      <h2>创建模式</h2>
      <ZxCard
        title="创建新用户"
        sub-title="添加新的用户信息"
        :is-edit="false"
        @save="handleCreate"
        @save-and-continue="handleSaveAndContinue"
      >
        <div class="demo-content">
          <el-form :model="newForm" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="newForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="newForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="newForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-form>
        </div>
      </ZxCard>
    </div>

    <!-- 全屏功能 -->
    <div class="example-section">
      <h2>全屏功能</h2>
      <ZxCard
        title="支持全屏的卡片"
        sub-title="点击右上角的全屏按钮"
        :show-full-screen="true"
        @toggle-full-screen="handleToggleFullScreen"
      >
        <div class="demo-content">
          <p>这个卡片支持全屏显示功能。</p>
          <p>点击右上角的全屏按钮可以切换全屏状态。</p>
          <div class="chart-placeholder">
            <div class="chart-mock">图表区域</div>
          </div>
        </div>
      </ZxCard>
    </div>

    <!-- 自定义插槽 -->
    <div class="example-section">
      <h2>自定义插槽</h2>
      <ZxCard title="自定义插槽示例">
        <template #headerRight>
          <el-button type="primary" size="small">自定义按钮</el-button>
        </template>

        <template #subHeader>
          <el-alert title="这是子标题区域" type="info" :closable="false" show-icon />
        </template>

        <div class="demo-content">
          <p>这个卡片展示了如何使用自定义插槽。</p>
          <p>可以在头部右侧、子标题区域、底部左侧等位置添加自定义内容。</p>
        </div>

        <template #footerLeft>
          <el-tag type="success">状态：正常</el-tag>
        </template>
      </ZxCard>
    </div>

    <!-- 无底部栏 -->
    <div class="example-section">
      <h2>无底部栏</h2>
      <ZxCard title="无底部操作栏" :hide-footer="true">
        <div class="demo-content">
          <p>这个卡片隐藏了底部操作栏。</p>
          <p>适用于纯展示内容，不需要操作按钮的场景。</p>
        </div>
      </ZxCard>
    </div>

    <!-- 自定义文案 -->
    <div class="example-section">
      <h2>自定义按钮文案</h2>
      <ZxCard
        title="自定义按钮文案"
        save-text="提交申请"
        save-and-continue-text="提交并继续"
        cancel-text="返回列表"
        @save="handleCustomSave"
      >
        <div class="demo-content">
          <p>可以自定义底部按钮的文案。</p>
          <p>适用于不同业务场景的个性化需求。</p>
        </div>
      </ZxCard>
    </div>

    <!-- 无内容边距 -->
    <div class="example-section">
      <h2>无内容边距</h2>
      <ZxCard title="无内容边距" :no-content-padding="true">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="age" label="年龄" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </ZxCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import ZxCard from './index.vue'

// 响应式数据
const loading = ref(false)

const form = reactive({
  username: 'john_doe',
  email: 'john@example.com',
  phone: '13800138000'
})

const newForm = reactive({
  username: '',
  email: '',
  phone: ''
})

const tableData = ref([
  { name: '张三', age: 25, address: '北京市朝阳区' },
  { name: '李四', age: 30, address: '上海市浦东新区' },
  { name: '王五', age: 28, address: '广州市天河区' }
])

// 方法
const toggleLoading = () => {
  loading.value = !loading.value
  if (loading.value) {
    setTimeout(() => {
      loading.value = false
    }, 3000)
  }
}

const handleSave = () => {
  ElMessage.success('保存成功！')
  console.log('保存数据:', form)
}

const handleCreate = () => {
  ElMessage.success('创建成功！')
  console.log('创建数据:', newForm)
}

const handleSaveAndContinue = () => {
  ElMessage.success('保存成功，可以继续创建！')
  console.log('保存并继续:', newForm)
  // 清空表单
  Object.keys(newForm).forEach((key) => {
    newForm[key] = ''
  })
}

const handleToggleFullScreen = (isFullScreen) => {
  console.log('全屏状态:', isFullScreen)
  ElMessage.info(isFullScreen ? '已进入全屏模式' : '已退出全屏模式')
}

const handleCustomSave = () => {
  ElMessage.success('申请已提交！')
}
</script>

<style lang="scss" scoped>
.zx-card-example {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.example-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    color: #303133;
    margin-bottom: 10px;
  }

  p {
    color: #606266;
    font-size: 14px;
  }
}

.example-section {
  margin-bottom: 40px;

  h2 {
    color: #303133;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #409eff;
    font-size: 18px;
  }
}

.demo-content {
  padding: 20px 0;

  p {
    margin-bottom: 15px;
    color: #606266;
    line-height: 1.6;
  }

  .chart-placeholder {
    margin-top: 20px;

    .chart-mock {
      height: 200px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      font-weight: bold;
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-alert) {
  margin: 10px 0;
}
</style>
