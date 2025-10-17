<script setup lang="ts">
import { h } from 'vue'
import { ElTag, ElLink } from 'element-plus'
import ContentDetailWrap from './ContentDetailWrap.vue'

// 紧凑型示例数据 (类似图片中的布局)
const compactData = [
  { label: '所属租户', value: 'zzrz' },
  { label: '所属集群', value: 'test-tenant' },
  { label: '标签', value: '-', render: (item) => h(ElTag, { type: 'info' }, () => item.value) },
  { label: '创建者', value: 'zzrz--lms' },
  { label: '创建时间', value: '2025-10-10 09:57:37' },
  { label: '更新时间', value: '2025-10-10 10:01:11' },
  {
    label: '别名',
    value: '-',
    render: (item) => h(ElLink, { type: 'primary', underline: false }, () => item.value)
  },
  {
    label: '备注',
    value: '-',
    render: (item) => h(ElLink, { type: 'primary', underline: false }, () => item.value)
  },
  { label: '部署类型', value: '无状态型 (Deployment)' }
]

// 正常型示例数据
const normalData = [
  { label: '用户名', value: 'admin', span: 1 },
  { label: '手机号', value: '18888888888', span: 1 },
  { label: '邮箱', value: 'admin@example.com', span: 1 },
  {
    label: '状态',
    value: '正常',
    span: 1,
    render: (item) => h(ElTag, { type: 'success' }, () => item.value)
  },
  { label: '创建时间', value: '2025-10-10 09:57:37', span: 2 },
  {
    label: '备注',
    value: '这是一段很长的备注信息，用于测试正常型布局的显示效果。',
    span: 3
  }
]
</script>

<template>
  <div class="p-20px">
    <h2 class="mb-20px">紧凑型布局示例</h2>
    <ContentDetailWrap :data="compactData" header-type="compact" :fixed-header="true">
      <div class="p-20px">
        <h3>内容区域</h3>
        <p>这里是主要内容区域，当滚动时，上面的头部信息会固定在顶部。</p>
        <div v-for="i in 20" :key="i" class="mb-10px">
          <p>这是第 {{ i }} 行内容，用于测试滚动效果...</p>
        </div>
      </div>
    </ContentDetailWrap>

    <h2 class="mt-40px mb-20px">正常型布局示例</h2>
    <ContentDetailWrap
      :data="normalData"
      header-type="normal"
      :fixed-header="true"
      :column="3"
      :border="true"
    >
      <div class="p-20px">
        <h3>内容区域</h3>
        <p>这是使用 Descriptions 组件的正常型布局。</p>
        <div v-for="i in 20" :key="i" class="mb-10px">
          <p>这是第 {{ i }} 行内容，用于测试滚动效果...</p>
        </div>
      </div>
    </ContentDetailWrap>

    <h2 class="mt-40px mb-20px">自定义 Header Slot 示例</h2>
    <ContentDetailWrap :fixed-header="true">
      <template #header>
        <div class="custom-header">
          <h3>自定义头部内容</h3>
          <p>您可以通过 header slot 完全自定义头部内容</p>
        </div>
      </template>
      <div class="p-20px">
        <h3>内容区域</h3>
        <p>使用自定义 header slot 的示例。</p>
        <div v-for="i in 20" :key="i" class="mb-10px">
          <p>这是第 {{ i }} 行内容...</p>
        </div>
      </div>
    </ContentDetailWrap>
  </div>
</template>

<style scoped>
.custom-header {
  padding: 16px;
  background: var(--el-color-primary-light-9);
  border-radius: 4px;
}
</style>
