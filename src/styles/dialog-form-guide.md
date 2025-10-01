# 弹框表单统一样式使用指南

## 概述

为了确保系统中所有弹框表单保持一致的视觉效果和用户体验，我们提供了统一的样式配置。通过使用预定义的CSS类，可以快速实现标准化的弹框表单布局。

## 核心样式类

### 1. `.dialog-form-container`

主要的表单容器类，提供统一的内边距、高度限制和滚动行为。

### 2. `.form-section`

表单分组容器，用于将相关的表单项组织在一起。

### 3. `.section-title`

分组标题样式，提供统一的标题外观。

### 4. `.form-input`

表单输入控件的统一样式类。

## 基础使用方法

### 标准弹框表单结构

```vue
<template>
  <ZxDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :confirm="handleSubmit"
    :form-ref="formRef"
    :form-model="formData"
    :class="{ 'dialog-form-readonly': mode === 'view' }"
  >
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <!-- 表单分组 1 -->
        <div class="form-section">
          <h4 class="section-title">基本信息</h4>

          <el-form-item label="名称" prop="name" required>
            <el-input v-model="formData.name" placeholder="请输入名称" class="form-input" />
          </el-form-item>

          <el-form-item label="类型" prop="type" required>
            <el-select v-model="formData.type" placeholder="请选择类型" class="form-input">
              <el-option label="选项1" value="option1" />
              <el-option label="选项2" value="option2" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 表单分组 2 -->
        <div class="form-section">
          <h4 class="section-title">详细信息</h4>

          <el-form-item label="描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
              class="form-input"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </ZxDialog>
</template>
```

## 特殊场景使用

### 1. 小尺寸弹框表单

```vue
<ZxDialog v-model="dialogVisible" dialog-size="small" class="dialog-form-small">
  <div class="dialog-form-container">
    <!-- 表单内容 -->
  </div>
</ZxDialog>
```

### 2. 大尺寸弹框表单

```vue
<ZxDialog v-model="dialogVisible" dialog-size="large" class="dialog-form-large">
  <div class="dialog-form-container">
    <!-- 表单内容 -->
  </div>
</ZxDialog>
```

### 3. 只读模式表单

```vue
<ZxDialog v-model="dialogVisible" class="dialog-form-readonly">
  <div class="dialog-form-container">
    <!-- 表单内容 -->
  </div>
</ZxDialog>
```

## 样式变量自定义

如果需要在特定页面调整样式，可以通过CSS变量进行自定义：

```vue
<style scoped>
.custom-dialog-form {
  --dialog-form-label-width: 140px;
  --dialog-form-item-margin-bottom: 24px;
  --dialog-form-section-title-color: #409eff;
}
</style>
```

## 响应式适配

样式已内置响应式适配，在移动端（768px以下）会自动调整：

- 减少内边距
- 调整标签宽度
- 优化按钮布局

## 最佳实践

### 1. 表单分组

- 使用 `.form-section` 对相关表单项进行分组
- 每个分组添加有意义的 `.section-title`
- 避免单个分组内表单项过多（建议不超过6个）

### 2. 表单项标签

- 保持标签文字简洁明了
- 必填项会自动显示红色星号
- 标签宽度已统一为120px（移动端80px）

### 3. 输入控件

- 所有输入控件添加 `.form-input` 类
- 使用合适的placeholder提示
- 设置合理的maxlength限制

### 4. 验证规则

- 使用Element Plus标准验证规则
- 错误信息会自动显示在输入框下方
- 支持自动滚动到第一个错误项

## 迁移现有表单

对于现有的弹框表单，按以下步骤进行迁移：

1. 在ZxDialog外层添加相应的样式类
2. 在表单内容外包裹 `.dialog-form-container`
3. 使用 `.form-section` 和 `.section-title` 组织表单结构
4. 为输入控件添加 `.form-input` 类
5. 移除自定义的内边距和间距样式

## 注意事项

1. 不要在 `.dialog-form-container` 内部重写基础样式
2. 如需特殊样式，通过CSS变量或额外的类名实现
3. 保持表单结构的语义化和可访问性
4. 测试不同屏幕尺寸下的显示效果

通过遵循这些规范，可以确保系统中所有弹框表单保持一致的用户体验。
