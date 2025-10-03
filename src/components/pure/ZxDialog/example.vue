<template>
  <div class="zx-dialog-example">
    <h2>ZxDialog 组件示例</h2>

    <div class="example-section">
      <h3>基础用法</h3>
      <el-button @click="basicDialog = true">基础对话框</el-button>

      <ZxDialog
        v-model="basicDialog"
        title="基础对话框"
        width="600px"
        @confirm="handleBasicConfirm"
      >
        <p>这是一个基础的对话框示例，包含标题、内容和操作按钮。</p>
        <p>您可以点击确定或取消按钮来关闭对话框。</p>
      </ZxDialog>
    </div>

    <div class="example-section">
      <h3>带开关的对话框</h3>
      <el-button @click="switchDialog = true">开关对话框</el-button>

      <ZxDialog
        v-model="switchDialog"
        title="功能设置"
        :switch-props="{
          showSwitch: true,
          switchName: '启用自动保存',
          switchTooltip: '开启后将自动保存您的更改',
          enable: autoSave
        }"
        @confirm="handleSwitchConfirm"
      >
        <p>这是一个带开关控制的对话框示例。</p>
        <p>您可以通过开关来控制功能的启用状态。</p>
        <p
          >当前自动保存状态：<strong>{{ autoSave ? '已启用' : '已禁用' }}</strong></p
        >
      </ZxDialog>
    </div>

    <div class="example-section">
      <h3>描述列表对话框</h3>
      <el-button @click="descDialog = true">详情对话框</el-button>

      <ZxDialog
        v-model="descDialog"
        title="用户详情"
        :descriptions="userDescriptions"
        :show-skeleton="descLoading"
        width="700px"
      >
        <template #descValue="{ item }">
          <span v-if="item.label === '状态'" :class="getStatusClass(item.value)">
            {{ item.value }}
          </span>
          <el-tag v-else-if="item.label === '角色'" :type="getRoleType(item.value)">
            {{ item.value }}
          </el-tag>
          <span v-else>{{ item.value }}</span>
        </template>
      </ZxDialog>
    </div>

    <div class="example-section">
      <h3>自定义操作按钮</h3>
      <el-button @click="customDialog = true">自定义按钮</el-button>

      <ZxDialog
        v-model="customDialog"
        title="文档管理"
        :show-continue="true"
        save-continue-text="保存并新建"
        @confirm="handleSave"
        @continue="handleSaveAndNew"
      >
        <template #self-button>
          <el-button type="info" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
          <el-button type="warning" @click="handlePreview">
            <el-icon><View /></el-icon>
            预览
          </el-button>
        </template>

        <template #footerLeft>
          <el-button type="info" @click="handleHelp">
            <el-icon><QuestionFilled /></el-icon>
            帮助
          </el-button>
        </template>

        <div class="custom-content">
          <p>这是一个带自定义操作按钮的对话框。</p>
          <el-form :model="form" label-width="80px">
            <el-form-item label="文档名称">
              <el-input v-model="form.name" placeholder="请输入文档名称" />
            </el-form-item>
            <el-form-item label="文档类型">
              <el-select v-model="form.type" placeholder="请选择文档类型">
                <el-option label="Word文档" value="word" />
                <el-option label="PDF文档" value="pdf" />
                <el-option label="Excel表格" value="excel" />
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.description" type="textarea" rows="3" />
            </el-form-item>
          </el-form>
        </div>
      </ZxDialog>
    </div>

    <div class="example-section">
      <h3>不同尺寸</h3>
      <el-button @click="showSizeDialog('small')">小尺寸</el-button>
      <el-button @click="showSizeDialog('medium')">中等尺寸</el-button>
      <el-button @click="showSizeDialog('large')">大尺寸</el-button>

      <ZxDialog v-model="sizeDialog" title="不同尺寸对话框" :dialog-size="currentSize">
        <div class="size-content">
          <h4>当前尺寸: {{ currentSize }}</h4>
          <p>这是一个 {{ currentSize }} 尺寸的对话框示例。</p>
          <div class="size-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="小尺寸">适合简单的确认对话框</el-descriptions-item>
              <el-descriptions-item label="中等尺寸">适合一般的表单和内容展示</el-descriptions-item>
              <el-descriptions-item label="大尺寸">适合复杂的表单和详细内容</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </ZxDialog>
    </div>

    <div class="example-section">
      <h3>Padding 配置</h3>
      <el-button @click="paddingDialog = true">自定义 Padding</el-button>
      <el-button @click="cssVariableDialog = true">CSS 变量 Padding</el-button>

      <!-- 通过 props 配置 padding -->
      <ZxDialog
        v-model="paddingDialog"
        title="自定义 Padding 对话框"
        header-padding="30px 40px"
        body-padding="40px"
        footer-padding="20px 40px"
        width="600px"
      >
        <p>这是一个通过 props 配置 padding 的对话框示例。</p>
        <p>Header padding: 30px 40px</p>
        <p>Body padding: 40px</p>
        <p>Footer padding: 20px 40px</p>
      </ZxDialog>

      <!-- 通过 CSS 变量配置 padding -->
      <ZxDialog
        v-model="cssVariableDialog"
        title="CSS 变量 Padding 对话框"
        :dialog-style="customPaddingStyle"
        width="600px"
      >
        <p>这是一个通过 CSS 变量配置 padding 的对话框示例。</p>
        <p>使用了自定义的 CSS 变量来控制各部分的 padding。</p>
        <p>Header: 10px, Body: 60px, Footer: 25px 30px</p>
      </ZxDialog>
    </div>

    <div class="example-section">
      <h3>Hooks 使用示例</h3>
      <div class="hooks-demo">
        <h4>useDialogState - 基础状态管理</h4>
        <el-button @click="hookStateDialog.open()">基础状态对话框</el-button>
        <el-button @click="showLoadingDialog">带加载状态</el-button>

        <h4 style="margin-top: 20px">useDialogConfirm - 确认对话框</h4>
        <el-button @click="hookConfirmDialog.open()">确认对话框</el-button>
        <el-button type="danger" @click="hookDeleteDialog.open()">删除确认</el-button>

        <h4 style="margin-top: 20px">useDialogForm - 表单对话框</h4>
        <el-button @click="hookFormDialog.open()">表单对话框</el-button>
        <el-button @click="fillFormData">填充示例数据</el-button>

        <h4 style="margin-top: 20px">useDialogData - 数据展示对话框</h4>
        <el-button @click="hookDataDialog.open()">数据展示对话框</el-button>
        <el-button @click="hookDataDialog.refreshData()">刷新数据</el-button>
      </div>
    </div>

    <div class="example-section">
      <h3>特殊配置</h3>
      <el-button @click="noMaskDialog = true">无遮罩</el-button>
      <el-button @click="noPaddingDialog = true">无内边距</el-button>
      <el-button @click="noTitleDialog = true">无标题</el-button>

      <!-- 无遮罩对话框 -->
      <ZxDialog v-model="noMaskDialog" title="无遮罩对话框" :mask="false">
        <p>这是一个没有遮罩层的对话框，背景不会变暗。</p>
      </ZxDialog>

      <!-- 无内边距对话框 -->
      <ZxDialog
        v-model="noPaddingDialog"
        title="无内边距对话框"
        :no-content-padding="true"
        width="800px"
      >
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="age" label="年龄" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </ZxDialog>

      <!-- 无标题对话框 -->
      <ZxDialog v-model="noTitleDialog" :no-title="true" width="500px">
        <div class="no-title-content">
          <h3>自定义标题区域</h3>
          <p>这是一个没有默认标题栏的对话框，您可以完全自定义头部内容。</p>
        </div>
      </ZxDialog>

      <!-- Hooks 使用示例对话框 -->

      <!-- useDialogState 示例 -->
      <ZxDialog v-bind="hookStateDialog.baseProps.value" v-on="hookStateDialog.baseEvents.value">
        <div class="hook-example-content">
          <h4>useDialogState Hook 示例</h4>
          <p>这是一个使用 useDialogState Hook 管理的对话框。</p>
          <p>当前状态：{{ hookStateDialog.loading.value ? '加载中...' : '正常' }}</p>
          <p>按钮状态：{{ hookStateDialog.disabled.value ? '禁用' : '可用' }}</p>

          <div class="hook-demo-actions">
            <el-button @click="hookStateDialog.setDisabled(!hookStateDialog.disabled.value)">
              {{ hookStateDialog.disabled.value ? '启用按钮' : '禁用按钮' }}
            </el-button>
            <el-button @click="hookStateDialog.setLoading(!hookStateDialog.loading.value)">
              {{ hookStateDialog.loading.value ? '停止加载' : '开始加载' }}
            </el-button>
          </div>
        </div>
      </ZxDialog>

      <!-- useDialogConfirm 示例 -->
      <ZxDialog
        v-bind="hookConfirmDialog.confirmProps.value"
        v-on="hookConfirmDialog.confirmEvents.value"
      >
        <div class="hook-example-content">
          <h4>useDialogConfirm Hook 示例</h4>
          <p>这是一个确认对话框，点击确认后会执行异步操作。</p>
          <p>支持自动处理加载状态和错误处理。</p>
        </div>
      </ZxDialog>

      <ZxDialog
        v-bind="hookDeleteDialog.confirmProps.value"
        v-on="hookDeleteDialog.confirmEvents.value"
      >
        <div class="hook-example-content">
          <el-alert title="警告" type="warning" :closable="false" style="margin-bottom: 15px">
            此操作不可撤销，请谨慎操作！
          </el-alert>
          <h4>删除确认示例</h4>
          <p>确定要删除这个项目吗？删除后将无法恢复。</p>
        </div>
      </ZxDialog>

      <!-- useDialogForm 示例 -->
      <ZxDialog v-bind="hookFormDialog.formProps.value" v-on="hookFormDialog.formEvents.value">
        <div class="hook-example-content">
          <h4>useDialogForm Hook 示例</h4>
          <el-form :model="hookFormDialog.formData" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="hookFormDialog.formData.name" placeholder="请输入姓名" />
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="hookFormDialog.formData.email" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="年龄">
              <el-input-number
                v-model="hookFormDialog.formData.age"
                :min="1"
                :max="120"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="描述">
              <el-input
                v-model="hookFormDialog.formData.description"
                type="textarea"
                :rows="3"
                placeholder="请输入描述信息"
              />
            </el-form-item>
          </el-form>

          <div style="padding: 10px; margin-top: 20px; background: #f5f7fa; border-radius: 4px">
            <h5>当前表单数据：</h5>
            <pre style="font-size: 12px">{{
              JSON.stringify(hookFormDialog.formData, null, 2)
            }}</pre>
          </div>
        </div>
      </ZxDialog>

      <!-- useDialogData 示例 -->
      <ZxDialog v-bind="hookDataDialog.dataProps.value" v-on="hookDataDialog.dataEvents.value">
        <div class="hook-example-content">
          <h4>useDialogData Hook 示例</h4>

          <div v-if="hookDataDialog.dataError.value" class="error-state">
            <el-alert
              title="数据加载失败"
              :description="hookDataDialog.dataError.value.message"
              type="error"
              :closable="false"
              style="margin-bottom: 20px"
            />
            <el-button type="primary" @click="hookDataDialog.loadData()">重新加载</el-button>
          </div>

          <!-- 这里应该使用 ZxDialog 的 descValue 插槽，但为了简化示例，我们直接显示数据 -->

          <div
            v-if="hookDataDialog.data.value"
            style="padding: 15px; margin-top: 20px; background: #fafbfc; border-radius: 6px"
          >
            <h5 style="margin: 0 0 10px; color: #606266">原始数据：</h5>
            <pre style="margin: 0; font-size: 12px; color: #909399; white-space: pre-wrap">{{
              JSON.stringify(hookDataDialog.data.value, null, 2)
            }}</pre>
          </div>

          <div style="display: flex; margin-top: 15px; gap: 10px">
            <el-button @click="hookDataDialog.refreshData()">刷新数据</el-button>
            <el-button @click="hookDataDialog.clearData()">清除数据</el-button>
          </div>
        </div>
      </ZxDialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, View, QuestionFilled } from '@element-plus/icons-vue'
import ZxDialog from './index.vue'
import { useDialogState, useDialogConfirm, useDialogForm, useDialogData } from './hooks/index.js'

// 基础对话框
const basicDialog = ref(false)

// 开关对话框
const switchDialog = ref(false)
const autoSave = ref(false)

// 描述列表对话框
const descDialog = ref(false)
const descLoading = ref(false)
const userDescriptions = ref([
  { label: '用户名', value: 'admin' },
  { label: '真实姓名', value: '管理员' },
  { label: '邮箱', value: 'admin@example.com' },
  { label: '手机号', value: '138****8888' },
  { label: '角色', value: '超级管理员' },
  { label: '状态', value: '正常' },
  { label: '最后登录', value: '2023-12-01 10:30:00' },
  { label: '创建时间', value: '2023-01-01 09:00:00' }
])

// 自定义按钮对话框
const customDialog = ref(false)
const form = reactive({
  name: '',
  type: '',
  description: ''
})

// 尺寸对话框
const sizeDialog = ref(false)
const currentSize = ref('medium')

// Padding 配置对话框
const paddingDialog = ref(false)
const cssVariableDialog = ref(false)
const customPaddingStyle = {
  '--zx-dialog-header-padding': '10px',
  '--zx-dialog-body-padding': '60px',
  '--zx-dialog-footer-padding': '25px 30px'
}

// Hooks 示例
// useDialogState 示例
const hookStateDialog = useDialogState({
  title: 'Hook 基础状态示例',
  width: '500px'
})

// useDialogConfirm 示例
const hookConfirmDialog = useDialogConfirm({
  title: '确认操作',
  okText: '确认',
  cancelText: '取消',
  onConfirm: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    ElMessage.success('操作完成！')
  },
  onCancel: () => {
    ElMessage.info('操作已取消')
  }
})

const hookDeleteDialog = useDialogConfirm({
  title: '删除确认',
  okText: '删除',
  cancelText: '取消',
  onConfirm: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    ElMessage.success('删除成功！')
  }
})

// useDialogForm 示例
const hookFormDialog = useDialogForm({
  title: '用户信息表单',
  width: '600px',
  initialData: {
    name: '',
    email: '',
    age: '',
    description: ''
  },
  onSubmit: async (formData) => {
    console.log('提交的表单数据:', formData)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    ElMessage.success('用户信息保存成功！')
  }
})

// useDialogData 示例
const hookDataDialog = useDialogData({
  title: '用户详情数据',
  width: '700px',
  autoLoad: true,
  dataSource: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      id: 1001,
      username: 'admin',
      realName: '系统管理员',
      email: 'admin@example.com',
      phone: '138****8888',
      role: '超级管理员',
      status: '正常',
      lastLogin: '2023-12-01 10:30:00',
      createTime: '2023-01-01 09:00:00',
      loginCount: 156
    }
  },
  onDataLoad: (data) => {
    console.log('数据加载完成:', data)
    ElMessage.success('数据加载成功')
  }
})

// 特殊配置对话框
const noMaskDialog = ref(false)
const noPaddingDialog = ref(false)
const noTitleDialog = ref(false)

// 表格数据
const tableData = ref([
  { name: '张三', age: 25, address: '北京市朝阳区' },
  { name: '李四', age: 30, address: '上海市浦东新区' },
  { name: '王五', age: 28, address: '广州市天河区' }
])

// 事件处理函数
const handleBasicConfirm = () => {
  ElMessage.success('基础对话框确认成功！')
  basicDialog.value = false
}

const handleSwitchConfirm = (enable) => {
  autoSave.value = enable
  ElMessage.success(`自动保存已${enable ? '启用' : '禁用'}！`)
  switchDialog.value = false
}

const handleSave = () => {
  if (!form.name) {
    ElMessage.warning('请输入文档名称')
    return
  }
  ElMessage.success('文档保存成功！')
  customDialog.value = false
  resetForm()
}

const handleSaveAndNew = () => {
  if (!form.name) {
    ElMessage.warning('请输入文档名称')
    return
  }
  ElMessage.success('文档保存成功，可以继续新建！')
  resetForm()
}

const handleExport = () => {
  ElMessage.info('导出功能演示')
}

const handlePreview = () => {
  ElMessage.info('预览功能演示')
}

const handleHelp = () => {
  ElMessage.info('帮助功能演示')
}

const showSizeDialog = (size) => {
  currentSize.value = size
  sizeDialog.value = true
}

const resetForm = () => {
  form.name = ''
  form.type = ''
  form.description = ''
}

// Hooks 相关方法
const showLoadingDialog = async () => {
  hookStateDialog.open()
  hookStateDialog.setLoading(true)

  // 模拟异步操作
  setTimeout(() => {
    hookStateDialog.setLoading(false)
    hookStateDialog.close()
    ElMessage.success('操作完成')
  }, 3000)
}

const fillFormData = () => {
  hookFormDialog.setFormData({
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    description: '这是一个示例用户'
  })
  ElMessage.success('已填充示例数据')
}

// 工具函数
const getStatusClass = (status) => {
  return status === '正常' ? 'text-green-600' : 'text-red-600'
}

const getRoleType = (role) => {
  const typeMap = {
    超级管理员: 'danger',
    管理员: 'warning',
    普通用户: 'info'
  }
  return typeMap[role] || 'info'
}
</script>

<style scoped>
.zx-dialog-example {
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
}

.example-section {
  padding: 20px;
  margin-bottom: 30px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.example-section h3 {
  margin: 0 0 15px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.example-section .el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.custom-content {
  padding: 10px 0;
}

.size-content {
  text-align: center;
}

.size-content h4 {
  margin: 0 0 15px;
  color: #409eff;
}

.size-info {
  margin-top: 20px;
  text-align: left;
}

.no-title-content {
  padding: 20px;
  text-align: center;
}

.no-title-content h3 {
  margin: 0 0 15px;
  color: #409eff;
}

.text-green-600 {
  font-weight: 600;
  color: #16a085;
}

.text-red-600 {
  font-weight: 600;
  color: #e74c3c;
}

/* Hooks 示例样式 */
.hooks-demo h4 {
  margin: 15px 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

.hooks-demo .el-button {
  margin-right: 10px;
  margin-bottom: 8px;
}

.hook-example-content {
  padding: 10px 0;
}

.hook-example-content h4 {
  margin: 0 0 15px;
  font-size: 16px;
  color: #409eff;
}

.hook-example-content h5 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #606266;
}

.hook-demo-actions {
  display: flex;
  margin-top: 15px;
  gap: 10px;
}

.error-state {
  padding: 20px;
  text-align: center;
}
</style>
