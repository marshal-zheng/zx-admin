<template>
  <div class="zx-expand-toggle-demo">
    <h1>ZxExpandToggle 展开收起组件</h1>
    <p>一个基于 Element Plus 的通用展开收起组件，支持自定义内容、样式和交互。</p>

    <!-- 基础用法 -->
    <el-card class="demo-card" header="基础用法">
      <p class="demo-description">最基本的展开收起功能，点击按钮可展开/收起内容。</p>
      <ZxExpandToggle v-model="basicExpanded">
        <template #content>
          <el-form :model="basicForm" label-width="120px">
            <el-form-item label="用户名">
              <el-input v-model="basicForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="启用通知">
              <el-switch v-model="basicForm.notification" />
            </el-form-item>
          </el-form>
        </template>
      </ZxExpandToggle>
      <div class="demo-actions">
        <el-button @click="basicExpanded = !basicExpanded">
          外部控制 (当前状态: {{ basicExpanded ? '展开' : '收起' }})
        </el-button>
        <el-button @click="handleBasicSubmit" type="primary">提交表单</el-button>
      </div>
    </el-card>

    <!-- 自定义文本和图标 -->
    <el-card class="demo-card" header="自定义文本和图标">
      <p class="demo-description">可以自定义展开/收起时的文本和图标。</p>
      <ZxExpandToggle
        v-model="customExpanded"
        expanded-text="隐藏"
        collapsed-text="显示"
        text-suffix="高级选项"
        :expanded-icon="Hide"
        :collapsed-icon="View"
      >
        <template #content>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="面板宽度">
                <el-input-number
                  v-model="customForm.width"
                  :min="200"
                  :max="1200"
                  :step="10"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面板高度">
                <el-input-number
                  v-model="customForm.height"
                  :min="150"
                  :max="800"
                  :step="10"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="背景透明">
            <el-switch v-model="customForm.transparent" />
          </el-form-item>
        </template>
      </ZxExpandToggle>
    </el-card>

    <!-- 不同位置对齐 -->
    <el-card class="demo-card" header="触发器位置">
      <p class="demo-description">支持左对齐、居中对齐和右对齐三种位置。</p>

      <div class="position-demo">
        <h4>左对齐</h4>
        <ZxExpandToggle v-model="leftExpanded" trigger-position="left" trigger-class="trigger-left">
          <template #content>
            <el-alert title="左对齐的展开内容" type="info" :closable="false" />
          </template>
        </ZxExpandToggle>
      </div>

      <div class="position-demo">
        <h4>居中对齐（默认）</h4>
        <ZxExpandToggle v-model="centerExpanded">
          <template #content>
            <el-alert title="居中对齐的展开内容" type="success" :closable="false" />
          </template>
        </ZxExpandToggle>
      </div>

      <div class="position-demo">
        <h4>右对齐</h4>
        <ZxExpandToggle
          v-model="rightExpanded"
          trigger-position="right"
          trigger-class="trigger-right"
        >
          <template #content>
            <el-alert title="右对齐的展开内容" type="warning" :closable="false" />
          </template>
        </ZxExpandToggle>
      </div>
    </el-card>

    <!-- 禁用状态 -->
    <el-card class="demo-card" header="禁用状态">
      <p class="demo-description">禁用状态下，用户无法展开或收起内容。</p>
      <ZxExpandToggle v-model="disabledExpanded" :disabled="isDisabled" text-suffix="设置">
        <template #content>
          <el-alert
            title="系统维护中"
            description="当前系统正在维护，暂时无法修改设置。"
            type="warning"
            :closable="false"
          />
        </template>
      </ZxExpandToggle>
      <div class="demo-actions">
        <el-button @click="isDisabled = !isDisabled">
          {{ isDisabled ? '启用' : '禁用' }} 组件
        </el-button>
      </div>
    </el-card>

    <!-- 事件监听 -->
    <el-card class="demo-card" header="事件监听">
      <p class="demo-description">监听组件的展开、收起等事件。</p>
      <ZxExpandToggle
        v-model="eventExpanded"
        text-suffix="事件演示"
        @toggle="handleToggle"
        @expand="handleExpand"
        @collapse="handleCollapse"
      >
        <template #content>
          <el-timeline>
            <el-timeline-item
              v-for="(event, index) in events"
              :key="index"
              :timestamp="event.time"
              placement="top"
            >
              {{ event.message }}
            </el-timeline-item>
          </el-timeline>
        </template>
      </ZxExpandToggle>
      <div class="demo-actions">
        <el-button @click="clearEvents">清空事件记录</el-button>
      </div>
    </el-card>

    <!-- 方法调用 -->
    <el-card class="demo-card" header="方法调用">
      <p class="demo-description">通过 ref 调用组件的方法。</p>
      <ZxExpandToggle ref="methodToggleRef" v-model="methodExpanded" text-suffix="方法演示">
        <template #content>
          <div class="method-content">
            <p>这是通过方法控制的展开内容</p>
            <el-progress :percentage="progressValue" :stroke-width="8" />
          </div>
        </template>
      </ZxExpandToggle>
      <div class="demo-actions">
        <el-button @click="callExpand">调用 expand()</el-button>
        <el-button @click="callCollapse">调用 collapse()</el-button>
        <el-button @click="callToggle">调用 toggle()</el-button>
        <el-button @click="checkStatus">检查状态</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import ZxExpandToggle from './index.vue'

// 基础用法
const basicExpanded = ref(false)
const basicForm = reactive({
  username: '',
  email: '',
  notification: true
})

// 自定义文本和图标
const customExpanded = ref(false)
const customForm = reactive({
  width: 400,
  height: 300,
  transparent: false
})

// 位置对齐
const leftExpanded = ref(false)
const centerExpanded = ref(false)
const rightExpanded = ref(false)

// 禁用状态
const disabledExpanded = ref(false)
const isDisabled = ref(false)

// 事件监听
const eventExpanded = ref(false)
const events = ref([])

// 方法调用
const methodToggleRef = ref()
const methodExpanded = ref(false)
const progressValue = ref(30)

// 方法
const handleBasicSubmit = () => {
  ElMessage.success(`提交成功！用户名: ${basicForm.username}, 邮箱: ${basicForm.email}`)
}

const handleToggle = (expanded) => {
  addEvent(`切换状态: ${expanded ? '展开' : '收起'}`)
}

const handleExpand = () => {
  addEvent('展开事件触发')
}

const handleCollapse = () => {
  addEvent('收起事件触发')
}

const addEvent = (message) => {
  events.value.unshift({
    message,
    time: new Date().toLocaleTimeString()
  })
  // 限制事件记录数量
  if (events.value.length > 10) {
    events.value = events.value.slice(0, 10)
  }
}

const clearEvents = () => {
  events.value = []
  ElMessage.info('事件记录已清空')
}

const callExpand = () => {
  methodToggleRef.value?.expand()
  ElMessage.info('调用了 expand() 方法')
}

const callCollapse = () => {
  methodToggleRef.value?.collapse()
  ElMessage.info('调用了 collapse() 方法')
}

const callToggle = () => {
  methodToggleRef.value?.toggle()
  ElMessage.info('调用了 toggle() 方法')
}

const checkStatus = () => {
  const status = methodToggleRef.value?.isExpanded()
  ElMessage.info(`当前状态: ${status ? '展开' : '收起'}`)
}

// 生命周期
onMounted(() => {
  // 模拟进度条变化
  const timer = setInterval(() => {
    progressValue.value = (progressValue.value + 10) % 100
  }, 1000)

  // 清理定时器
  setTimeout(() => {
    clearInterval(timer)
  }, 10000)
})
</script>

<style lang="scss" scoped>
.zx-expand-toggle-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: var(--el-text-color-primary);
    margin-bottom: 16px;
    font-size: 28px;
    font-weight: 600;
  }

  > p {
    color: var(--el-text-color-regular);
    margin-bottom: 32px;
    font-size: 16px;
    line-height: 1.6;
  }
}

.demo-card {
  margin-bottom: 24px;

  .demo-description {
    color: var(--el-text-color-secondary);
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
  }

  .demo-actions {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter);
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.position-demo {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
  }
}

.method-content {
  padding: 16px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;

  p {
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }
}

// 自定义触发器样式
:deep(.trigger-left) {
  justify-content: flex-start;
}

:deep(.trigger-right) {
  justify-content: flex-end;
}
</style>
