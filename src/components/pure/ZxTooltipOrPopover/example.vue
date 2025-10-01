<template>
  <div class="zx-tooltip-popover-example">
    <div class="example-header">
      <h2>ZxTooltipOrPopover 提示组件演示</h2>
      <p>基于 Element Plus Tooltip 和 Popover 的统一提示组件</p>
    </div>

    <div class="demo-section">
      <h3>基础 Tooltip 用法</h3>
      <div class="demo-content">
        <div class="button-row">
          <ZxTooltipOrPopover content="这是一个简单的提示信息">
            <el-button>悬停显示提示</el-button>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover content="这是一个较长的提示信息，用于展示多行文本的显示效果">
            <el-button type="primary">长文本提示</el-button>
          </ZxTooltipOrPopover>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>不同位置的 Tooltip</h3>
      <div class="demo-content">
        <div class="placement-demo">
          <div class="placement-row">
            <ZxTooltipOrPopover content="顶部左侧" placement="top-start">
              <el-button>top-start</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="顶部居中" placement="top">
              <el-button>top</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="顶部右侧" placement="top-end">
              <el-button>top-end</el-button>
            </ZxTooltipOrPopover>
          </div>

          <div class="placement-row">
            <ZxTooltipOrPopover content="左侧顶部" placement="left-start">
              <el-button>left-start</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="左侧居中" placement="left">
              <el-button>left</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="左侧底部" placement="left-end">
              <el-button>left-end</el-button>
            </ZxTooltipOrPopover>
          </div>

          <div class="placement-row">
            <ZxTooltipOrPopover content="右侧顶部" placement="right-start">
              <el-button>right-start</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="右侧居中" placement="right">
              <el-button>right</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="右侧底部" placement="right-end">
              <el-button>right-end</el-button>
            </ZxTooltipOrPopover>
          </div>

          <div class="placement-row">
            <ZxTooltipOrPopover content="底部左侧" placement="bottom-start">
              <el-button>bottom-start</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="底部居中" placement="bottom">
              <el-button>bottom</el-button>
            </ZxTooltipOrPopover>
            <ZxTooltipOrPopover content="底部右侧" placement="bottom-end">
              <el-button>bottom-end</el-button>
            </ZxTooltipOrPopover>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Popover 模式</h3>
      <div class="demo-content">
        <div class="button-row">
          <ZxTooltipOrPopover
            title="标题信息"
            content="这是 Popover 的内容，可以包含更丰富的信息"
            trigger="click"
          >
            <el-button type="success">点击显示 Popover</el-button>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover title="悬停触发" content="这是悬停触发的 Popover" trigger="hover">
            <el-button type="warning">悬停显示 Popover</el-button>
          </ZxTooltipOrPopover>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>自定义内容</h3>
      <div class="demo-content">
        <div class="button-row">
          <ZxTooltipOrPopover title="自定义内容" trigger="click">
            <template #content>
              <div class="custom-content">
                <h4>自定义内容</h4>
                <p>这里可以放置任意的 HTML 内容</p>
                <el-button size="small" type="primary">操作按钮</el-button>
              </div>
            </template>
            <el-button type="info">自定义内容 Popover</el-button>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover>
            <template #content>
              <div class="tooltip-custom">
                <ZxIcon icon="Warning" color="#E6A23C" size="16" />
                <span>带图标的提示信息</span>
              </div>
            </template>
            <el-button type="danger">自定义 Tooltip</el-button>
          </ZxTooltipOrPopover>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>禁用状态</h3>
      <div class="demo-content">
        <div class="button-row">
          <ZxTooltipOrPopover content="这个提示被禁用了" :disabled="true">
            <el-button>禁用的 Tooltip</el-button>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover content="这个提示是启用的" :disabled="false">
            <el-button type="primary">启用的 Tooltip</el-button>
          </ZxTooltipOrPopover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZxTooltipOrPopoverExample'
}
</script>

<style lang="scss" scoped>
.zx-tooltip-popover-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .example-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      color: #303133;
      margin-bottom: 10px;
      font-size: 28px;
    }

    p {
      color: #606266;
      font-size: 16px;
    }
  }

  h3 {
    color: #606266;
    margin: 20px 0 15px;
    font-size: 18px;
    font-weight: 600;
  }

  .demo-section {
    margin-bottom: 30px;
    padding: 25px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    background-color: #fafafa;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .demo-content {
    .button-row {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      align-items: center;
    }

    .placement-demo {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .placement-row {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  }

  .custom-content {
    max-width: 200px;

    h4 {
      margin: 0 0 10px 0;
      color: #303133;
      font-size: 14px;
    }

    p {
      margin: 0 0 15px 0;
      color: #606266;
      font-size: 12px;
      line-height: 1.4;
    }
  }

  .tooltip-custom {
    display: flex;
    align-items: center;
    gap: 6px;

    span {
      color: #303133;
      font-size: 12px;
    }
  }
}
</style>
