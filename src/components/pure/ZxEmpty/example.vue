<template>
  <div class="zx-empty-example">
    <h2>ZxEmpty 组件示例</h2>

    <div class="example-section">
      <h3>基础用法</h3>
      <div class="example-item">
        <ZxEmpty />
      </div>
    </div>

    <div class="example-section">
      <h3>自定义描述</h3>
      <div class="example-item">
        <ZxEmpty description="没有找到相关数据" />
      </div>
    </div>

    <div class="example-section">
      <h3>自定义图片</h3>
      <div class="example-item">
        <ZxEmpty
          description="暂无内容"
          image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          :image-size="100"
        />
      </div>
    </div>

    <div class="example-section">
      <h3>自定义插槽内容</h3>
      <div class="example-item">
        <ZxEmpty description="暂无数据">
          <el-button type="primary" @click="handleRefresh">刷新数据</el-button>
        </ZxEmpty>
      </div>
    </div>

    <div class="example-section">
      <h3>自定义图片插槽</h3>
      <div class="example-item">
        <ZxEmpty description="网络连接失败">
          <template #image>
            <el-icon :size="80" color="#909399">
              <Connection />
            </el-icon>
          </template>
          <el-button type="primary" @click="handleRetry">重试</el-button>
        </ZxEmpty>
      </div>
    </div>

    <div class="example-section">
      <h3>简洁模式</h3>
      <div class="example-item" style="height: 150px">
        <ZxEmpty simple description="暂无数据" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Connection } from '@element-plus/icons-vue'
import ZxEmpty from './index.vue'

const handleRefresh = () => {
  ElMessage.success('刷新数据成功')
}

const handleRetry = () => {
  ElMessage.info('正在重试连接...')
}
</script>

<style lang="scss" scoped>
.zx-empty-example {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: var(--el-text-color-primary);
  }

  h3 {
    margin: 20px 0 10px;
    color: var(--el-text-color-regular);
    font-size: 16px;
  }

  .example-section {
    margin-bottom: 30px;
  }

  .example-item {
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
    padding: 20px;
    background-color: var(--el-bg-color);
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
