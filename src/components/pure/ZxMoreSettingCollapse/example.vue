<template>
  <div class="zx-more-setting-collapse-demo">
    <h1>ZxMoreSettingCollapse 更多设置折叠组件</h1>
    <p>一个基于 Element Plus 的可折叠更多设置组件，支持自定义标题和内容。</p>

    <!-- 基础用法 -->
    <el-card class="demo-card" header="基础用法">
      <p class="demo-description">最基本的折叠面板，点击可展开/收起更多设置内容。</p>
      <ZxMoreSettingCollapse v-model="basicExpanded">
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
      </ZxMoreSettingCollapse>
      <div class="demo-actions">
        <el-button @click="basicExpanded = !basicExpanded">
          {{ basicExpanded ? '收起' : '展开' }} (当前状态: {{ basicExpanded ? '展开' : '收起' }})
        </el-button>
        <el-button @click="handleBasicSubmit" type="primary">提交设置</el-button>
      </div>
    </el-card>

    <!-- 自定义标题 -->
    <el-card class="demo-card" header="自定义标题">
      <p class="demo-description">可以自定义折叠面板的标题文本。</p>
      <ZxMoreSettingCollapse v-model="customExpanded" title="高级配置选项">
        <template #content>
          <el-form :model="customForm" label-width="120px">
            <el-form-item label="主题模式">
              <el-radio-group v-model="customForm.theme">
                <el-radio label="light">浅色</el-radio>
                <el-radio label="dark">深色</el-radio>
                <el-radio label="auto">跟随系统</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="语言设置">
              <el-select v-model="customForm.language" placeholder="请选择语言">
                <el-option label="中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
                <el-option label="日本語" value="ja-JP" />
              </el-select>
            </el-form-item>
            <el-form-item label="自动保存">
              <el-switch v-model="customForm.autoSave" />
            </el-form-item>
          </el-form>
        </template>
      </ZxMoreSettingCollapse>
      <div class="demo-actions">
        <el-button @click="handleCustomSubmit" type="primary">保存高级配置</el-button>
      </div>
    </el-card>

    <!-- 禁用状态 -->
    <el-card class="demo-card" header="禁用状态">
      <p class="demo-description">禁用状态下，用户无法展开或收起折叠面板。</p>
      <ZxMoreSettingCollapse v-model="disabledExpanded" title="系统维护设置" :disabled="true">
        <template #content>
          <el-alert
            title="系统维护中"
            description="当前系统正在维护，暂时无法修改设置。"
            type="warning"
            :closable="false"
          />
        </template>
      </ZxMoreSettingCollapse>
      <div class="demo-actions">
        <el-button @click="toggleDisabled"> {{ isDisabled ? '启用' : '禁用' }} 组件 </el-button>
      </div>
    </el-card>

    <!-- 事件监听 -->
    <el-card class="demo-card" header="事件监听">
      <p class="demo-description">监听组件的展开、收起等事件。</p>
      <ZxMoreSettingCollapse
        v-model="eventExpanded"
        title="事件演示"
        @open="handleOpen"
        @close="handleClose"
        @change="handleChange"
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
      </ZxMoreSettingCollapse>
      <div class="demo-actions">
        <el-button @click="clearEvents">清空事件记录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ZxMoreSettingCollapse from './index.vue'

// 基础用法
const basicExpanded = ref(false)
const basicForm = reactive({
  username: '',
  email: '',
  notification: true
})

// 自定义标题
const customExpanded = ref(false)
const customForm = reactive({
  theme: 'light',
  language: 'zh-CN',
  autoSave: true
})

// 禁用状态
const disabledExpanded = ref(false)
const isDisabled = ref(true)

// 事件监听
const eventExpanded = ref(false)
const events = ref([])

const handleBasicSubmit = () => {
  ElMessage.success(`基础设置已提交: ${JSON.stringify(basicForm)}`)
}

const handleCustomSubmit = () => {
  ElMessage.success(`高级配置已保存: ${JSON.stringify(customForm)}`)
}

const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value
  ElMessage.info(`组件已${isDisabled.value ? '禁用' : '启用'}`)
}

const addEvent = (message) => {
  events.value.unshift({
    message,
    time: new Date().toLocaleTimeString()
  })
  // 只保留最近10条事件
  if (events.value.length > 10) {
    events.value = events.value.slice(0, 10)
  }
}

const handleOpen = () => {
  addEvent('折叠面板已展开')
  ElMessage.info('折叠面板已展开')
}

const handleClose = () => {
  addEvent('折叠面板已收起')
  ElMessage.info('折叠面板已收起')
}

const handleChange = (expanded) => {
  addEvent(`状态变更: ${expanded ? '展开' : '收起'}`)
}

const clearEvents = () => {
  events.value = []
  ElMessage.success('事件记录已清空')
}
</script>

<style lang="scss" scoped>
.zx-more-setting-collapse-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }

  > p {
    color: var(--el-text-color-regular);
    margin-bottom: 24px;
    font-size: 14px;
  }

  .demo-card {
    margin-bottom: 24px;

    .demo-description {
      color: var(--el-text-color-regular);
      font-size: 14px;
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .demo-actions {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--el-border-color-lighter);

      .el-button {
        margin-right: 12px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .zx-more-setting-collapse-demo {
    padding: 16px;

    .demo-card {
      margin-bottom: 16px;

      .demo-actions {
        .el-button {
          margin-bottom: 8px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
