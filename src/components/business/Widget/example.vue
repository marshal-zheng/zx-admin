<template>
  <div class="widget-example">
    <div class="example-header">
      <h2>Chart Widget 异步加载组件示例</h2>
      <p>展示 AsyncLoadComp 组件加载图表组件的两种使用方式</p>
    </div>

    <div class="example-sections">
      <!-- 使用 name（别名）方式加载图表组件 -->
      <div class="example-card">
        <div class="example-description">
          <p>使用 name（在 widget.aliases.ts 中配置），无需记具体路径，推荐写法</p>
        </div>
        <div class="example-demo">
          <div class="component-container">
            <AsyncLoadComp
              name="echarts"
              :props="{ hasChartTitle: true, title: '通过name加载的图表' }"
              :data="{ type: 'line', message: 'Loaded by name: echarts' }"
            />
          </div>
        </div>
      </div>

      <!-- 使用 path 方式加载图表组件 -->
      <div class="example-card">
        <div class="example-description">
          <p>使用 path 直接指定组件路径</p>
        </div>
        <div class="example-demo">
          <div class="component-container">
            <AsyncLoadComp
              path="./components/EChartsWidget.vue"
              :props="{ hasChartTitle: true, title: '通过path加载的图表' }"
              :data="{ type: 'bar', message: 'Welcome to EChartsWidget!' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AsyncLoadComp from './AsyncLoadComp.vue'
</script>

<style lang="scss" scoped>
.widget-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .example-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      color: var(--el-color-primary);
      margin-bottom: 10px;
    }

    p {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }

  .example-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .example-card {
    .example-description {
      margin-bottom: 15px;
      padding: 10px;
      background-color: var(--el-color-info-light-9);
      border-radius: 4px;
      border-left: 4px solid var(--el-color-info);

      p {
        margin: 0;
        color: var(--el-text-color-regular);
        font-size: 13px;
      }
    }

    .example-demo {
      margin-bottom: 20px;
      padding: 15px;
      background-color: var(--el-bg-color-page);
      border-radius: 4px;
      border: 1px solid var(--el-border-color-light);
    }

    .component-container {
      min-height: 200px;
      border: 2px dashed var(--el-border-color);
      border-radius: 8px;
      padding: 20px;
      background-color: var(--el-bg-color);
      position: relative;

      &::before {
        content: '异步组件容器';
        position: absolute;
        top: -10px;
        left: 10px;
        background-color: var(--el-bg-color);
        padding: 0 8px;
        font-size: 12px;
        color: var(--el-text-color-placeholder);
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    padding: 10px;

    .example-card {
      .example-demo {
        padding: 10px;
      }

      .component-container {
        padding: 15px;
      }
    }
  }
}
</style>
