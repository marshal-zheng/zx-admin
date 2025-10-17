<template>
  <EvaluationTaskWizard :task-id="taskId" @cancel="handleCancel" @success="handleSuccess" />
</template>

<script setup>
import { ContentWrap } from '@/components/ContentWrap'
import EvaluationTaskWizard from '@/views/Evaluation/components/EvaluationTaskWizard.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 从路由获取任务ID
const taskId = computed(() => route.query.taskId)

// 取消操作
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消创建吗？未保存的数据将会丢失。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    router.back()
  } catch {
    // 用户取消
  }
}

// 成功回调
const handleSuccess = (formData) => {
  console.log('表单提交数据:', formData)
  ElMessage.success('创建成功！')
  router.back()
}
</script>
