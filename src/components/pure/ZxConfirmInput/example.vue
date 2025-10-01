<template>
  <div class="demo-container">
    <h2>ZxConfirmInput 确认对话框示例</h2>

    <!-- 基础示例 -->
    <div class="demo-section">
      <h3>基础示例</h3>
      <div class="demo-buttons">
        <el-button type="danger" @click="show1 = true">删除项目</el-button>
        <el-button type="danger" @click="show2 = true">删除用户</el-button>
        <el-button type="warning" @click="show3 = true">重置系统</el-button>
        <el-button type="primary" @click="show4 = true">发布版本</el-button>
      </div>
    </div>

    <!-- 高级功能 -->
    <div class="demo-section">
      <h3>高级功能</h3>
      <div class="demo-buttons">
        <el-button type="danger" @click="show5 = true">自定义插槽</el-button>
        <el-button type="danger" @click="show6 = true">异步操作</el-button>
        <el-button type="success" @click="show7 = true">Hook 示例</el-button>
        <el-button type="info" @click="show8 = true">高级 Hook</el-button>
      </div>
    </div>

    <!-- 插件式调用 -->
    <div class="demo-section">
      <h3>插件式调用</h3>
      <div class="demo-buttons">
        <el-button type="danger" @click="callDangerAPI">danger()</el-button>
        <el-button type="warning" @click="callWarningAPI">warning()</el-button>
        <el-button type="primary" @click="callInfoAPI">info()</el-button>
        <el-button type="danger" @click="callDeleteProjectAPI">业务层-删除项目</el-button>
        <el-button type="danger" @click="callDeleteUserAPI">业务层-删除用户</el-button>
        <el-button type="warning" @click="callResetSystemAPI">业务层-重置系统</el-button>
      </div>
    </div>

    <!-- Hook 示例 -->
    <div class="demo-section">
      <h3>Hook 组合式函数示例</h3>
      <div class="demo-buttons">
        <el-button type="success" @click="testHookBasic">基础 Hook</el-button>
        <el-button type="danger" @click="testHookDanger">危险 Hook</el-button>
        <el-button type="info" @click="testHookAdvanced">高级 Hook</el-button>
        <el-button type="primary" @click="testMessageHooks">消息 Hook</el-button>
      </div>
      <p style="margin-top: 10px; font-size: 13px; color: #666">
        Hook 示例展示如何使用组合式函数来封装 ZxConfirmInput 的逻辑
      </p>
    </div>

    <!-- 对话框组件 -->

    <!-- GitLab 风格 - 删除项目 -->
    <ZxConfirmInput
      v-model="show1"
      title="需要确认"
      target-name="郑翰卿 / mcp-echarts"
      target-type="项目"
      keyword="mcp-echarts"
      ok-text="确认删除"
      @confirm="onConfirm('删除项目', $event)"
      @cancel="onCancel('删除项目')"
    />

    <!-- 删除用户 -->
    <ZxConfirmInput
      v-model="show2"
      title="删除用户账户"
      target-name="郑翰卿"
      target-type="用户账户"
      keyword="郑翰卿"
      description="此操作将永久删除用户账户及其所有相关数据。"
      ok-text="确认删除用户"
      @confirm="onConfirm('删除用户', $event)"
      @cancel="onCancel('删除用户')"
    />

    <!-- 警告语气 -->
    <ZxConfirmInput
      v-model="show3"
      title="重置系统设置"
      target-name="系统配置"
      target-type="配置"
      keyword="RESET"
      tone="warning"
      description="此操作将重置所有系统设置到默认状态。"
      ok-text="确认重置"
      @confirm="onConfirm('重置系统', $event)"
      @cancel="onCancel('重置系统')"
    />

    <!-- 信息语气 -->
    <ZxConfirmInput
      v-model="show4"
      title="发布新版本"
      target-name="v2.1.0"
      target-type="版本"
      keyword="v2.1.0"
      tone="info"
      description="此操作将发布新版本到生产环境。"
      ok-text="确认发布"
      @confirm="onConfirm('发布版本', $event)"
      @cancel="onCancel('发布版本')"
    />

    <!-- 自定义内容插槽 -->
    <ZxConfirmInput
      v-model="show5"
      title="自定义确认框"
      keyword="CUSTOM"
      ok-text="执行操作"
      @confirm="onConfirm('自定义操作', $event)"
      @cancel="onCancel('自定义操作')"
    >
      <template #danger-message>
        <strong>⚠️ 您即将执行自定义危险操作！</strong>
      </template>
      <template #description>
        这是一个使用插槽自定义内容的示例。您可以在这里放置任何自定义的描述内容。
      </template>
      <template #input-hint> 请输入确认码 <code>CUSTOM</code> 以继续操作。 </template>
    </ZxConfirmInput>

    <!-- 使用 confirmAction 异步接口 -->
    <ZxConfirmInput
      v-model="show6"
      title="异步删除确认"
      target-name="重要数据"
      target-type="数据"
      keyword="DELETE"
      :confirm-action="handleAsyncDelete"
      ok-text="确认删除"
      @confirm="onConfirm('异步删除成功', $event)"
      @cancel="onCancel('异步删除')"
      @error="onError"
    />

    <!-- Hook 基础示例 -->
    <ZxConfirmInput
      v-model="hook1.visible.value"
      :title="hookProps1.title"
      :target-name="hookProps1.targetName"
      :target-type="hookProps1.targetType"
      :keyword="hookProps1.keyword"
      :require-keyword="hookProps1.requireKeyword"
      :case-sensitive="hookProps1.caseSensitive"
      :autofocus="hookProps1.autofocus"
      ok-text="Hook 确认"
      tone="info"
      @confirm="hookEmit1.confirm"
      @cancel="hookEmit1.cancel"
      @error="hookEmit1.error"
      @open="hookEmit1.open"
      @close="hookEmit1.close"
    >
      <template #description>
        这是一个使用 <strong>useZxConfirmInput</strong> Hook 的基础示例。 Hook
        封装了表单验证、对话框状态管理等逻辑。
      </template>
      <template #input-hint>
        请输入项目名称 <strong>{{ hookProps1.keyword }}</strong> 来测试 Hook 功能。
      </template>
    </ZxConfirmInput>

    <!-- Hook 高级示例 -->
    <ZxConfirmInput
      v-model="hook2.visible.value"
      :title="hookProps2.title"
      :target-name="hookProps2.targetName"
      :target-type="hookProps2.targetType"
      :require-keyword="hookProps2.requireKeyword"
      :validator="hookProps2.validator"
      :confirm-action="hookProps2.confirmAction"
      :autofocus="hookProps2.autofocus"
      ok-text="Hook 异步确认"
      tone="warning"
      @confirm="hookEmit2.confirm"
      @cancel="hookEmit2.cancel"
      @error="hookEmit2.error"
      @open="hookEmit2.open"
      @close="hookEmit2.close"
    >
      <template #description>
        这是一个高级 Hook 示例，展示了：
        <ul style=" padding-left: 20px;margin: 10px 0">
          <li>自定义异步验证器（至少3个字符，仅字母数字）</li>
          <li>异步确认操作（模拟 API 调用）</li>
          <li>完整的错误处理和 loading 状态</li>
        </ul>
      </template>
      <template #input-hint> 请输入符合要求的字符串（至少3个字符，仅字母数字）。 </template>
    </ZxConfirmInput>

    <!-- Hook 危险示例 -->
    <ZxConfirmInput
      v-model="hook3.visible.value"
      :title="hookProps3.title"
      :target-name="hookProps3.targetName"
      :target-type="hookProps3.targetType"
      :keyword="hookProps3.keyword"
      :require-keyword="hookProps3.requireKeyword"
      :case-sensitive="hookProps3.caseSensitive"
      :autofocus="hookProps3.autofocus"
      ok-text="Hook 危险确认"
      tone="danger"
      @confirm="hookEmit3.confirm"
      @cancel="hookEmit3.cancel"
      @error="hookEmit3.error"
      @open="hookEmit3.open"
      @close="hookEmit3.close"
    >
      <template #description>
        这是一个危险语气的 Hook 示例。请输入确认关键字以继续删除操作。
      </template>
      <template #input-hint>
        请输入 <strong>{{ hookProps3.keyword }}</strong> 以确认。
      </template>
    </ZxConfirmInput>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import ZxConfirmInput from './index.vue'
import { deleteProject, deleteUser, resetSystem } from '@/utils/confirmHelpers'
import { useZxConfirmInput, useFormValidation, useMessage, useConfirmAction } from './hook.js'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
const show6 = ref(false)
const show7 = ref(false)
const show8 = ref(false)

// 获取当前实例以访问全局属性
const { proxy } = getCurrentInstance()

const onConfirm = (label, payload) => {
  ElMessage.success(`${label}：已确认（输入=${payload.value}）`)
}

const onCancel = (label) => {
  ElMessage.info(`${label}：已取消操作`)
}

const onError = ({ error, payload }) => {
  ElMessage.error(`操作失败：${error.message}`)
}

// 异步删除操作示例
const handleAsyncDelete = async (payload) => {
  // 模拟异步 API 调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        // 70% 成功率
        resolve({ success: true, message: '删除成功' })
      } else {
        reject(new Error('网络错误，删除失败'))
      }
    }, 2000) // 模拟 2 秒的网络延迟
  })
}

// 插件式 API 调用示例
const callDangerAPI = async () => {
  try {
    const result = await proxy.$confirmInput.danger({
      targetName: 'test-project',
      keyword: 'test-project'
    })
    ElMessage.success(`危险操作确认：${result.value}`)
  } catch (error) {
    ElMessage.info('用户取消了危险操作')
  }
}

const callWarningAPI = async () => {
  try {
    const result = await proxy.$confirmInput.warning({
      targetName: '系统配置',
      keyword: 'RESET'
    })
    ElMessage.success(`警告操作确认：${result.value}`)
  } catch (error) {
    ElMessage.info('用户取消了警告操作')
  }
}

const callInfoAPI = async () => {
  try {
    const result = await proxy.$confirmInput.info({
      targetName: 'v1.0.0',
      keyword: 'v1.0.0',
      okText: '确认发布'
    })
    ElMessage.success(`信息确认：${result.value}`)
  } catch (error) {
    ElMessage.info('用户取消了信息确认')
  }
}

const callDeleteProjectAPI = async () => {
  try {
    const result = await deleteProject('my-awesome-project')
    ElMessage.success('项目删除成功')
    console.log('删除项目结果:', result)
  } catch (error) {
    ElMessage.info('用户取消删除')
  }
}

const callDeleteUserAPI = async () => {
  try {
    const result = await deleteUser('张三')
    ElMessage.success('用户删除成功')
    console.log('删除用户结果:', result)
  } catch (error) {
    ElMessage.info('用户取消删除')
  }
}

const callResetSystemAPI = async () => {
  try {
    const result = await resetSystem()
    ElMessage.success('系统重置成功')
    console.log('重置系统结果:', result)
  } catch (error) {
    ElMessage.info('用户取消重置')
  }
}

// Hook 示例：基础用法
const hookProps1 = reactive({
  modelValue: false,
  title: 'Hook 基础示例',
  targetName: 'hook-test-project',
  targetType: '项目',
  keyword: 'hook-test-project',
  requireKeyword: true,
  caseSensitive: true,
  autofocus: true
})

const hookEmit1 = {
  'update:modelValue': (value) => {
    hookProps1.modelValue = value
    show7.value = value
  },
  confirm: (payload) => {
    ElMessage.success(`Hook 确认成功：${payload.value}`)
    console.log('Hook confirm:', payload)
  },
  cancel: () => {
    ElMessage.info('Hook 取消操作')
  },
  error: ({ error, payload }) => {
    ElMessage.error(`Hook 操作失败：${error.message}`)
  },
  open: () => console.log('Hook dialog opened'),
  close: () => console.log('Hook dialog closed')
}

// 使用 Hook
const hook1 = useZxConfirmInput(hookProps1, hookEmit1)

// Hook 示例：高级用法 - 带自定义验证和异步操作
const hookProps2 = reactive({
  modelValue: false,
  title: 'Hook 高级示例',
  targetName: '敏感数据',
  targetType: '数据',
  keyword: '', // 不使用关键字匹配
  requireKeyword: true,
  validator: async (value) => {
    // 模拟异步验证
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (value.length < 3) return '至少输入3个字符'
    if (!/^[a-zA-Z0-9]+$/.test(value)) return '只能包含字母和数字'
    return true
  },
  confirmAction: async (payload) => {
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 2000))
    if (Math.random() > 0.7) {
      throw new Error('服务器错误，请重试')
    }
    return { success: true, data: payload.value }
  },
  autofocus: true
})

const hookEmit2 = {
  'update:modelValue': (value) => {
    hookProps2.modelValue = value
    show8.value = value
  },
  confirm: (payload) => {
    ElMessage.success(`高级 Hook 操作成功！结果：${JSON.stringify(payload.result)}`)
    console.log('Advanced Hook confirm:', payload)
  },
  cancel: () => {
    ElMessage.info('高级 Hook 取消操作')
  },
  error: ({ error, payload }) => {
    ElMessage.error(`高级 Hook 操作失败：${error.message}`)
    console.error('Advanced Hook error:', error, payload)
  },
  open: () => console.log('Advanced Hook dialog opened'),
  close: () => console.log('Advanced Hook dialog closed')
}

// 使用高级 Hook
const hook2 = useZxConfirmInput(hookProps2, hookEmit2)

// Hook 示例：危险用法 - 关键字匹配 + 危险语气
const hookProps3 = reactive({
  modelValue: false,
  title: 'Hook 危险示例',
  targetName: 'critical-project',
  targetType: '项目',
  keyword: 'DELETE-PROJECT',
  requireKeyword: true,
  caseSensitive: true,
  autofocus: true
})

const hookEmit3 = {
  'update:modelValue': (value) => {
    hookProps3.modelValue = value
  },
  confirm: (payload) => {
    ElMessage.success(`危险 Hook 确认成功：${payload.value}`)
    console.log('Danger Hook confirm:', payload)
  },
  cancel: () => {
    ElMessage.info('危险 Hook 取消操作')
  },
  error: ({ error }) => {
    ElMessage.error(`危险 Hook 操作失败：${error.message}`)
  },
  open: () => console.log('Danger Hook dialog opened'),
  close: () => console.log('Danger Hook dialog closed')
}

const hook3 = useZxConfirmInput(hookProps3, hookEmit3)

// 独立使用消息 Hook
const { showSuccess, showError, showWarning, showInfo } = useMessage()

// Hook 测试函数
const testHookBasic = () => {
  // 使用 Hook 返回的可见状态打开对话框
  hook1.visible.value = true
}

const testHookDanger = () => {
  // 使用 Hook 返回的可见状态打开对话框
  hook3.visible.value = true
}

const testHookAdvanced = () => {
  // 使用 Hook 返回的可见状态打开对话框
  hook2.visible.value = true
}

const testMessageHooks = () => {
  showSuccess('这是成功消息')
  setTimeout(() => showWarning('这是警告消息'), 500)
  setTimeout(() => showError('这是错误消息'), 1000)
  setTimeout(() => showInfo('这是信息消息'), 1500)
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.demo-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
