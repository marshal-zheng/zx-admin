<template>
  <ContentWrap>
    <div class="data-conversion-placeholder">
      <el-empty description="数据转换功能开发中...">
        <ZxButton type="primary">敬请期待</ZxButton>
      </el-empty>
    </div>
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '@/components/ContentWrap'
import { ZxButton } from '@/components/pure'

// 添加组件初始化调试
onMounted(() => {
  console.log('=== Data Conversion List 组件已挂载 ===')
})
</script>

<style lang="scss" scoped>
.data-conversion-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>
