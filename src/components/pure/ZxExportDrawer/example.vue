<template>
  <div class="p-6">
    <h2 class="mb-4 text-xl font-bold">ZXExportDrawer 导出字段选择抽屉</h2>

    <div class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">基础用法</h3>
      <ZxButton type="primary" @click="showBasicDrawer"> 打开基础导出抽屉 </ZxButton>
    </div>

    <div class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">自定义标题</h3>
      <ZxButton type="primary" @click="showCustomTitleDrawer"> 打开自定义标题抽屉 </ZxButton>
    </div>

    <div class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">数组列模式</h3>
      <ZxButton type="primary" @click="showArrayColumnDrawer"> 打开数组列模式抽屉 </ZxButton>
    </div>

    <!-- 动态导出抽屉 - 懒加载 -->
    <ZxExportDrawer
      v-if="currentDrawer"
      v-model="drawerVisible"
      :title="currentDrawer.title"
      :fields="currentDrawer.fields"
      :default-selected="currentDrawer.defaultSelected"
      :array-mode="currentDrawer.arrayMode"
      @confirm="currentDrawer.onConfirm"
      @cancel="handleDrawerCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ZxButton from '@/components/pure/ZxButton/index.vue'
import ZxExportDrawer from './index.vue'

// 动态drawer配置
const drawerVisible = ref(false)
const currentDrawer = ref(null)

// 基础字段数据
const basicFields = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '名称' },
  { key: 'email', label: '邮箱' },
  { key: 'phone', label: '电话' },
  { key: 'address', label: '地址' },
  { key: 'status', label: '状态' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'customField1', label: '自定义字段1' },
  { key: 'customField2', label: '自定义字段2' },
  { key: 'customField3', label: '自定义字段3' },
  { key: 'otherField1', label: '其他字段1' },
  { key: 'otherField2', label: '其他字段2' }
]

const basicDefaultSelected = [
  { key: 'name', label: '名称' },
  { key: 'id', label: 'ID' },
  { key: 'status', label: '状态' }
]

const arrayFields = ['列1', '列2', '列3', '列4']
const arrayDefaultSelected = ['列1', '列2']

// Drawer配置工厂函数
const createDrawerConfig = (type) => {
  const configs = {
    basic: {
      title: '',
      fields: basicFields,
      defaultSelected: basicDefaultSelected,
      arrayMode: false,
      onConfirm: (selectedFields) => {
        console.log('基础模式选中的字段:', selectedFields)
        alert(`导出完成！共选择了 ${selectedFields.length} 个字段`)
        handleDrawerCancel()
      }
    },
    customTitle: {
      title: '导出用户数据',
      fields: basicFields,
      defaultSelected: basicDefaultSelected,
      arrayMode: false,
      onConfirm: (selectedFields) => {
        console.log('自定义标题模式选中的字段:', selectedFields)
        alert(`导出完成！共选择了 ${selectedFields.length} 个字段`)
        handleDrawerCancel()
      }
    },
    arrayColumn: {
      title: '数组列模式导出',
      fields: arrayFields,
      defaultSelected: arrayDefaultSelected,
      arrayMode: true,
      onConfirm: (selectedFields) => {
        console.log('数组列模式选中的字段:', selectedFields)
        alert(`导出完成！共选择了 ${selectedFields.length} 个字段`)
        handleDrawerCancel()
      }
    }
  }
  return configs[type]
}

// 显示drawer的统一方法
const showDrawer = (type) => {
  currentDrawer.value = createDrawerConfig(type)
  drawerVisible.value = true
}

// 显示基础抽屉
const showBasicDrawer = () => {
  showDrawer('basic')
}

// 显示自定义标题抽屉
const showCustomTitleDrawer = () => {
  showDrawer('customTitle')
}

// 显示数组列模式抽屉
const showArrayColumnDrawer = () => {
  showDrawer('arrayColumn')
}

// 处理drawer取消/关闭
const handleDrawerCancel = () => {
  drawerVisible.value = false
  // 延迟清空配置，确保动画完成
  setTimeout(() => {
    currentDrawer.value = null
  }, 300)
}
</script>

<style scoped>
.p-6 {
  padding: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}
</style>
