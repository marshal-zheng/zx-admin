<template>
  <div class="zx-popconfirm-example">
    <div class="example-header">
      <h2>ZxPopconfirm 气泡确认框</h2>
      <p>基于 Element Plus 的气泡确认框组件，支持自定义内容、表单验证等功能。</p>
    </div>

    <div class="example-section">
      <h3>基础用法</h3>
      <div class="example-demo">
        <ZxPopconfirm title="确定删除吗？" @confirm="handleConfirm" @cancel="handleCancel">
          <el-button type="danger">删除</el-button>
        </ZxPopconfirm>
      </div>
    </div>

    <div class="example-section">
      <h3>自定义图标和副标题</h3>
      <div class="example-demo">
        <ZxPopconfirm
          title="确定要执行此操作吗？"
          subtitle="此操作不可撤销，请谨慎操作"
          icon="Warning"
          icon-color="#f56c6c"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        >
          <el-button type="warning">执行操作</el-button>
        </ZxPopconfirm>
      </div>
    </div>

    <div class="example-section">
      <h3>带输入框的确认</h3>
      <div class="example-demo">
        <ZxPopconfirm
          title="请输入名称"
          subtitle="名称不能为空且不能重复"
          show-input
          input-placeholder="请输入名称"
          :input-validator="validateName"
          @confirm="handleInputConfirm"
          @cancel="handleCancel"
        >
          <el-button type="primary">添加项目</el-button>
        </ZxPopconfirm>
      </div>
    </div>

    <div class="example-section">
      <h3>带文本域的确认</h3>
      <div class="example-demo">
        <ZxPopconfirm
          title="请输入备注"
          show-textarea
          textarea-placeholder="请输入备注信息（可选）"
          @confirm="handleTextareaConfirm"
          @cancel="handleCancel"
        >
          <el-button>添加备注</el-button>
        </ZxPopconfirm>
      </div>
    </div>

    <div class="example-section">
      <h3>自定义按钮文本</h3>
      <div class="example-demo">
        <ZxPopconfirm
          title="确定要保存更改吗？"
          confirm-button-text="保存"
          cancel-button-text="取消"
          confirm-button-type="success"
          @confirm="handleSave"
          @cancel="handleCancel"
        >
          <el-button type="success">保存更改</el-button>
        </ZxPopconfirm>
      </div>
    </div>

    <div class="example-section">
      <h3>不同触发方式</h3>
      <div class="example-demo">
        <el-space>
          <ZxPopconfirm title="点击触发" trigger="click" @confirm="handleConfirm">
            <el-button>点击触发</el-button>
          </ZxPopconfirm>

          <ZxPopconfirm title="悬停触发" trigger="hover" @confirm="handleConfirm">
            <el-button>悬停触发</el-button>
          </ZxPopconfirm>
        </el-space>
      </div>
    </div>

    <div class="example-section">
      <h3>不同位置</h3>
      <div class="example-demo">
        <el-space wrap>
          <ZxPopconfirm title="顶部显示" placement="top" @confirm="handleConfirm">
            <el-button>顶部</el-button>
          </ZxPopconfirm>

          <ZxPopconfirm title="右侧显示" placement="right" @confirm="handleConfirm">
            <el-button>右侧</el-button>
          </ZxPopconfirm>

          <ZxPopconfirm title="底部显示" placement="bottom" @confirm="handleConfirm">
            <el-button>底部</el-button>
          </ZxPopconfirm>

          <ZxPopconfirm title="左侧显示" placement="left" @confirm="handleConfirm">
            <el-button>左侧</el-button>
          </ZxPopconfirm>
        </el-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

// 基础确认处理
const handleConfirm = () => {
  ElMessage.success('确认操作成功')
}

const handleCancel = () => {
  ElMessage.info('已取消操作')
}

// 输入框确认处理
const handleInputConfirm = (value) => {
  ElMessage.success(`输入的名称：${value}`)
}

// 文本域确认处理
const handleTextareaConfirm = (value) => {
  ElMessage.success(`输入的备注：${value || '无'}`)
}

// 保存处理
const handleSave = () => {
  ElMessage.success('保存成功')
}

// 名称验证
const validateName = (value) => {
  if (!value || value.trim() === '') {
    return '名称不能为空'
  }
  if (value.length > 20) {
    return '名称长度不能超过20个字符'
  }
  // 模拟重复检查
  if (value === 'test') {
    return '名称已存在'
  }
  return true
}
</script>

<style scoped>
.zx-popconfirm-example {
  max-width: 1200px;
  padding: 24px;
  margin: 0 auto;
}

.example-header {
  padding-bottom: 16px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.example-header h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.example-header p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.example-section {
  margin-bottom: 32px;
}

.example-section h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.example-demo {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
}

.example-demo .el-space {
  width: 100%;
}
</style>
