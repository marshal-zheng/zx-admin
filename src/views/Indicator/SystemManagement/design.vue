<template>
  <Design :form-data="formData" @save="handleSaveSuccess" />
</template>

<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Design from '../components/Design.vue'

const router = useRouter()
const route = useRoute()

// 从 sessionStorage 获取表单数据
const formData = computed(() => {
  try {
    const storedData = sessionStorage.getItem('system_create_form_data')

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      return parsedData
    }
  } catch (error) {
    console.error('解析表单数据失败:', error)
  }

  return {}
})

// 保存成功后跳转回列表
const handleSaveSuccess = (data) => {
  // 清除 sessionStorage 中的表单数据
  sessionStorage.removeItem('system_create_form_data')

  // 延迟跳转，让用户看到成功提示
  setTimeout(() => {
    router.push('/indicator/system-list')
  }, 1000)
}

// 组件卸载时清除 sessionStorage（防止数据残留）
onBeforeUnmount(() => {
  sessionStorage.removeItem('system_create_form_data')
})
</script>
<style scoped></style>
