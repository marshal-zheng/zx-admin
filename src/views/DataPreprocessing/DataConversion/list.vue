<template>
  <ContentWrap>
    <div class="data-conversion-container">
      <el-tabs v-model="activeTab" class="data-conversion-tabs" tab-position="top">
        <el-tab-pane label="转换前" name="before-conversion">
          <TableQuery
            :show-create-button="true"
            table-type="before-conversion"
            source="data-conversion"
            @create-success="handleCreateSuccess"
          />
        </el-tab-pane>
        <el-tab-pane label="转换后" name="after-conversion">
          <TableQuery
            :show-create-button="false"
            table-type="after-conversion"
            source="data-conversion"
            @create-success="handleCreateSuccess"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </ContentWrap>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import TableQuery from '../components/TableQuery.vue'

// 当前激活的标签页
const activeTab = ref('before-conversion')

// 创建成功回调
const handleCreateSuccess = () => {
  console.log('数据创建成功，刷新当前标签页数据')
  // 这里可以添加刷新逻辑，或者通过事件通知TableQuery组件刷新
}

// 添加组件初始化调试
onMounted(() => {
  console.log('=== Data Conversion List 组件已挂载 ===')
  console.log('当前激活标签页:', activeTab.value)
})
</script>

<style lang="scss" scoped>
.data-conversion-container {
  height: calc(100vh - 200px); // 预留顶部导航和面包屑的空间
  min-height: 600px;
  display: flex;
  flex-direction: column;

  .data-conversion-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    /* 强制 header 在上、内容在下（仅本页生效） */
    :deep(.el-tabs__header) {
      order: 0;
    }
    :deep(.el-tabs__content) {
      order: 1;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      padding: 0;
      overflow: hidden;
    }

    :deep(.el-tabs__header) {
      flex-shrink: 0;
      margin-bottom: 20px;
    }

    :deep(.el-tab-pane) {
      height: 100%;
      padding: 0;
      overflow: hidden;
    }
  }
}
</style>