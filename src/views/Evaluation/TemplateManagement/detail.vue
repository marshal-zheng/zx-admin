<template>
  <ContentDetailWrap
    :data="detailData"
    header-type="compact"
    :fixed-header="true"
    :loading="loading"
    :skeleton-animated="true"
    :skeleton-rows="8"
  >
    <div v-if="taskDetail" class="detail-content">
      <!-- 评估方案列表 -->
      <TaskJobList v-if="templateId" :template-id="templateId" />
    </div>

    <el-empty v-else description="未找到模版详情" />
  </ContentDetailWrap>
</template>

<script setup>
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { useRouter, useRoute } from 'vue-router'
import { evaluationApi } from '@/api/modules/evaluation'
import TaskJobList from '../components/TaskJobList.vue'

const route = useRoute()

// 获取模版ID
const templateId = computed(() => route.params.id)

// 模版详情数据
const taskDetail = ref(null)
const loading = ref(false)

// 构建详情数据
const detailData = computed(() => {
  if (!taskDetail.value) return []

  return [
    { label: '模版名称', value: taskDetail.value.taskName || '-' },
    { label: '评估方案', value: taskDetail.value.scheme || '-' },
    { label: '评估目的', value: taskDetail.value.purpose || '-' },
    { label: '评估流程', value: taskDetail.value.process || '-' },
    { label: '评估对象', value: taskDetail.value.object || '-' },
    { label: '创建时间', value: taskDetail.value.createTime || '-' },
    { label: '模版描述', value: taskDetail.value.taskDescribe || '-' }
  ]
})

// 获取模版详情
const getTaskDetail = async () => {
  if (!templateId.value) {
    ElMessage.error('模版ID不存在')
    return
  }

  loading.value = true
  try {
    const response = await evaluationApi.getEvaluationDetail(templateId.value)
    taskDetail.value = response
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// 页面挂载时获取详情
onMounted(() => {
  getTaskDetail()
})
</script>

<style scoped lang="less">
.detail-content {
  padding: 20px;
}
</style>
