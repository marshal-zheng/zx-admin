<template>
  <div class="zx-drawer-example">
    <div class="example-header">
      <h2>ZxDrawer 组件示例</h2>
      <p>基于 Element Plus 的抽屉组件，支持多种配置和交互方式</p>
    </div>

    <div class="example-controls">
      <el-space wrap>
        <el-button type="primary" @click="openBasicDrawer"> 基础抽屉 </el-button>
        <el-button type="success" @click="openFullScreenDrawer"> 全屏功能抽屉 </el-button>
        <el-button type="info" @click="openResizableDrawer"> 可拖拽宽度抽屉 </el-button>
        <el-button type="warning" @click="openDescriptionDrawer"> 描述列表抽屉 </el-button>
        <el-button type="danger" @click="openNoMaskDrawer"> 无遮罩抽屉 </el-button>
        <el-button type="primary" plain @click="openHeaderRightDrawer"> 自定义头部操作 </el-button>
        <el-button type="primary" @click="openValidationDrawer"> 表单校验抽屉 </el-button>
        <el-button type="success" plain @click="openManualLoadingDrawer">
          手动 loading 抽屉
        </el-button>
      </el-space>
    </div>

    <!-- 主题切换 -->
    <div class="theme-controls">
      <el-space>
        <span>主题切换：</span>
        <el-button
          :type="currentTheme === 'light' ? 'primary' : 'default'"
          @click="switchTheme('light')"
        >
          浅色
        </el-button>
        <el-button
          :type="currentTheme === 'dark-blue' ? 'primary' : 'default'"
          @click="switchTheme('dark-blue')"
        >
          深蓝色
        </el-button>
        <span>当前主题：{{ currentTheme }}</span>
      </el-space>
    </div>

    <!-- 动态抽屉 - 懒加载 -->
    <ZxDrawer
      v-if="currentDrawer"
      v-model="drawerVisible"
      :title="currentDrawer.title"
      :width="currentDrawer.width"
      :disabled-width-drag="currentDrawer.disabledWidthDrag"
      :descriptions="currentDrawer.descriptions"
      :mask="currentDrawer.mask"
      :show-full-screen="currentDrawer.showFullScreen"
      :confirm="currentDrawer.confirm"
      :form-ref="currentDrawer.formRef"
      :form-model="currentDrawer.formModel"
      :auto-reset-form="currentDrawer.autoResetForm"
      :pre-validate="currentDrawer.preValidate"
      :auto-scroll-to-error="currentDrawer.autoScrollToError"
      :scroll-error-offset="currentDrawer.scrollErrorOffset"
      :auto-confirm-loading="currentDrawer.autoConfirmLoading"
      @confirm="(payload) => currentDrawer.onConfirm?.(payload)"
      @cancel="handleDrawerCancel"
    >
      <template v-if="currentDrawer.content" v-html="currentDrawer.content"></template>
      <component v-else-if="currentDrawer.component" :is="currentDrawer.component" />

      <template v-else-if="currentDrawer.type === 'form-validate'">
        <div class="validation-form-wrapper">
          <el-form
            ref="validationFormRef"
            :model="validationForm"
            :rules="validationRules"
            label-width="120px"
            class="validation-form"
          >
            <el-form-item label="项目名称" prop="name" required>
              <el-input v-model="validationForm.name" placeholder="请输入项目名称" />
            </el-form-item>
            <el-form-item label="项目负责人" prop="owner" required>
              <el-input v-model="validationForm.owner" placeholder="请输入负责人" />
            </el-form-item>
            <el-form-item label="联系邮箱" prop="email" required>
              <el-input v-model="validationForm.email" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item label="所属部门" prop="department" required>
              <el-input v-model="validationForm.department" placeholder="请输入所属部门" />
            </el-form-item>
            <el-form-item label="项目目标" prop="goal" required>
              <el-input
                v-model="validationForm.goal"
                type="textarea"
                :rows="3"
                placeholder="请输入项目目标"
              />
            </el-form-item>
            <el-form-item label="风险评估" prop="risk" required>
              <el-input
                v-model="validationForm.risk"
                type="textarea"
                :rows="3"
                placeholder="请列出主要风险"
              />
            </el-form-item>
            <el-form-item label="资源需求" prop="resource" required>
              <el-input v-model="validationForm.resource" placeholder="请描述关键资源需求" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="validationForm.remark"
                type="textarea"
                :rows="4"
                placeholder="选填：补充其他信息"
              />
            </el-form-item>
          </el-form>
        </div>
      </template>

      <template v-else-if="currentDrawer.type === 'manual-loading'">
        <div class="validation-form-wrapper">
          <el-alert
            title="手动 loading 示例"
            type="info"
            :closable="false"
            description="点击确定后 2 秒内按钮保持自定义 loading，结束后自动关闭抽屉。"
            style="margin-bottom: 16px"
            show-icon
          />
          <el-form label-width="120px">
            <el-form-item label="当前状态">
              <el-tag :type="manualState.running ? 'warning' : 'success'">
                {{ manualState.running ? '执行中' : '空闲' }}
              </el-tag>
            </el-form-item>
            <el-form-item label="进度日志">
              <el-input v-model="manualState.log" type="textarea" :rows="4" readonly />
            </el-form-item>
          </el-form>
        </div>
      </template>

      <template v-if="currentDrawer.hasDescSlot" #descValue="{ item }">
        <span v-if="item.label === '状态'">
          <el-tag :type="item.value === '正常' ? 'success' : 'danger'">
            {{ item.value }}
          </el-tag>
        </span>
        <span v-else>{{ item.value }}</span>
      </template>

      <template v-if="currentDrawer.showHeaderRight" #headerRight>
        <ZxIcon icon="Refresh" tooltip="刷新数据" @click="handleRefresh" />
        <ZxIcon icon="Download" tooltip="下载数据" @click="handleDownload" />
        <ZxIcon icon="Setting" tooltip="设置" @click="handleSettings" />
      </template>
    </ZxDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, defineComponent, h } from 'vue'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
  ElAlert,
  ElTable,
  ElTableColumn,
  ElCard,
  ElTag
} from 'element-plus'
import ZxDrawer from './index.vue'
import ZxIcon from '@/components/pure/ZxIcon'
import { useTheme } from '@/composables/useTheme.js'

// 主题管理
const { currentTheme, switchTheme } = useTheme()

// 动态drawer配置
const drawerVisible = ref(false)
const currentDrawer = ref(null)

// 表单数据
const form = reactive({
  username: '',
  email: '',
  description: ''
})

// 校验示例表单
const validationFormRef = ref()
const validationForm = reactive({
  name: '',
  owner: '',
  email: '',
  department: '',
  goal: '',
  risk: '',
  resource: '',
  remark: ''
})

const validationRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  department: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
  goal: [{ required: true, message: '请填写项目目标', trigger: 'blur' }],
  risk: [{ required: true, message: '请填写风险评估', trigger: 'blur' }],
  resource: [{ required: true, message: '请填写资源需求', trigger: 'blur' }],
  remark: [{ max: 200, message: '备注不能超过 200 字', trigger: 'blur' }]
}

// 手动 loading 状态
const manualState = reactive({
  running: false,
  log: '等待触发...'
})

// 表格数据
const tableData = [
  { name: '张三', age: 25, address: '北京市朝阳区' },
  { name: '李四', age: 30, address: '上海市浦东新区' },
  { name: '王五', age: 28, address: '广州市天河区' },
  { name: '赵六', age: 32, address: '深圳市南山区' }
]

// 描述列表数据
const descriptions = [
  { label: '用户ID', value: 'U001' },
  { label: '用户名', value: '张三' },
  { label: '邮箱', value: 'zhangsan@example.com' },
  { label: '手机号', value: '138****8888' },
  { label: '注册时间', value: '2023-01-15 10:30:00' },
  { label: '最后登录', value: '2024-01-15 14:25:30' },
  { label: '状态', value: '正常' },
  { label: '角色', value: '普通用户' },
  { label: '部门', value: '技术部' },
  { label: '备注', value: '这是一个测试用户账号，用于演示描述列表功能。' }
]

// 创建动态组件
const createBasicContent = () => {
  return defineComponent({
    setup() {
      return () =>
        h('div', { class: 'test-content' }, [
          h('h3', '基础抽屉内容'),
          h('p', '这是一个基础的抽屉组件示例。'),
          h(
            ElForm,
            { model: form, labelWidth: '120px' },
            {
              default: () => [
                h(
                  ElFormItem,
                  { label: '用户名' },
                  {
                    default: () =>
                      h(ElInput, {
                        modelValue: form.username,
                        'onUpdate:modelValue': (val) => (form.username = val),
                        placeholder: '请输入用户名'
                      })
                  }
                ),
                h(
                  ElFormItem,
                  { label: '邮箱' },
                  {
                    default: () =>
                      h(ElInput, {
                        modelValue: form.email,
                        'onUpdate:modelValue': (val) => (form.email = val),
                        placeholder: '请输入邮箱'
                      })
                  }
                ),
                h(
                  ElFormItem,
                  { label: '描述' },
                  {
                    default: () =>
                      h(ElInput, {
                        modelValue: form.description,
                        'onUpdate:modelValue': (val) => (form.description = val),
                        type: 'textarea',
                        rows: 4,
                        placeholder: '请输入描述'
                      })
                  }
                )
              ]
            }
          )
        ])
    }
  })
}

const createFullScreenContent = () => {
  return defineComponent({
    setup() {
      return () =>
        h('div', { class: 'test-content' }, [
          h('h3', '支持全屏切换的抽屉'),
          h('p', '点击右上角的全屏按钮可以切换全屏模式。'),
          h(ElAlert, {
            title: '全屏提示',
            type: 'info',
            description: '在全屏模式下，抽屉会占据整个屏幕宽度，提供更大的操作空间。',
            showIcon: true,
            closable: false
          }),
          h('div', { style: 'margin-top: 20px;' }, [
            h(
              ElTable,
              { data: tableData, style: 'width: 100%' },
              {
                default: () => [
                  h(ElTableColumn, { prop: 'name', label: '姓名', width: '180' }),
                  h(ElTableColumn, { prop: 'age', label: '年龄', width: '180' }),
                  h(ElTableColumn, { prop: 'address', label: '地址' })
                ]
              }
            )
          ])
        ])
    }
  })
}

const createResizableContent = () => {
  return defineComponent({
    setup() {
      return () =>
        h('div', { class: 'test-content' }, [
          h('h3', '可拖拽调整宽度'),
          h('p', '将鼠标悬停在抽屉左边缘，可以拖拽调整抽屉宽度。'),
          h(ElAlert, {
            title: '拖拽提示',
            type: 'success',
            description:
              '拖拽左边缘的手柄可以调整抽屉宽度，最小宽度为初始宽度，最大宽度为屏幕宽度的90%。',
            showIcon: true,
            closable: false
          }),
          h('div', { style: 'margin-top: 20px;' }, [
            h(
              ElCard,
              {},
              {
                header: () => h('span', '示例卡片'),
                default: () => [
                  h('p', '这是一个示例卡片内容，用于测试拖拽调整宽度时的内容适应性。'),
                  h('p', '当抽屉宽度改变时，内容应该能够正确地重新布局。')
                ]
              }
            )
          ])
        ])
    }
  })
}

const createNoMaskContent = () => {
  return defineComponent({
    setup() {
      return () =>
        h('div', { class: 'test-content' }, [
          h('h3', '无遮罩模式'),
          h('p', '这个抽屉没有背景遮罩，可以与页面其他内容交互。'),
          h(ElAlert, {
            title: '无遮罩提示',
            type: 'warning',
            description: '在无遮罩模式下，用户可以与页面其他元素交互，适合辅助信息展示。',
            showIcon: true,
            closable: false
          })
        ])
    }
  })
}

const createHeaderRightContent = () => {
  return defineComponent({
    setup() {
      return () =>
        h('div', { class: 'test-content' }, [
          h('h3', '自定义头部操作'),
          h('p', '这个抽屉展示了如何使用 headerRight 插槽添加自定义操作按钮。'),
          h(ElAlert, {
            title: '功能说明',
            type: 'info',
            description:
              '头部右侧提供了刷新、下载、设置等操作按钮，同时支持全屏切换和拖拽调整宽度。',
            showIcon: true,
            closable: false
          }),
          h('div', { style: 'margin-top: 20px;' }, [
            h(
              ElCard,
              {},
              {
                header: () => h('span', '操作演示'),
                default: () => [
                  h('p', '• 点击头部的刷新按钮可以刷新数据'),
                  h('p', '• 点击下载按钮可以下载数据'),
                  h('p', '• 点击设置按钮可以打开设置'),
                  h('p', '• 点击全屏按钮可以切换全屏模式'),
                  h('p', '• 拖拽左边缘可以调整抽屉宽度')
                ]
              }
            )
          ])
        ])
    }
  })
}

// Drawer配置工厂函数
const createDrawerConfig = (type) => {
  const configs = {
    basic: {
      title: '基础抽屉',
      width: 480,
      showFullScreen: false,
      disabledWidthDrag: true,
      mask: true,
      component: createBasicContent(),
      autoResetForm: true,
      onConfirm: () => {
        ElMessage.success('确认操作成功！')
        handleDrawerCancel()
      }
    },
    fullScreen: {
      title: '全屏功能抽屉',
      width: 600,
      showFullScreen: true,
      disabledWidthDrag: true,
      mask: true,
      component: createFullScreenContent(),
      autoResetForm: true,
      onConfirm: () => {
        ElMessage.success('确认操作成功！')
        handleDrawerCancel()
      }
    },
    resizable: {
      title: '可拖拽宽度抽屉',
      width: 480,
      showFullScreen: false,
      disabledWidthDrag: false,
      mask: true,
      component: createResizableContent(),
      autoResetForm: true,
      onConfirm: () => {
        ElMessage.success('确认操作成功！')
        handleDrawerCancel()
      }
    },
    description: {
      title: '描述列表抽屉',
      width: 480,
      showFullScreen: false,
      disabledWidthDrag: true,
      mask: true,
      descriptions: descriptions,
      hasDescSlot: true,
      autoResetForm: true,
      onConfirm: () => {
        ElMessage.success('确认操作成功！')
        handleDrawerCancel()
      }
    },
    noMask: {
      title: '无遮罩抽屉',
      width: 400,
      showFullScreen: false,
      disabledWidthDrag: true,
      mask: false,
      component: createNoMaskContent(),
      autoResetForm: true,
      onConfirm: () => {
        ElMessage.success('确认操作成功！')
        handleDrawerCancel()
      }
    },
    headerRight: {
      title: '自定义头部操作',
      width: 600,
      showFullScreen: true,
      disabledWidthDrag: false,
      mask: true,
      showHeaderRight: true,
      component: createHeaderRightContent(),
      autoResetForm: true,
      onConfirm: () => {
        ElMessage.success('确认操作成功！')
        handleDrawerCancel()
      }
    },
    validateForm: {
      title: '表单校验抽屉',
      width: 540,
      showFullScreen: false,
      disabledWidthDrag: true,
      mask: true,
      type: 'form-validate',
      formRef: validationFormRef,
      formModel: validationForm,
      preValidate: true,
      autoScrollToError: true,
      autoResetForm: true,
      autoConfirmLoading: false,
      confirm: async ({ setLoading }) => {
        setLoading(true)
        try {
          // 模拟异步提交
          await new Promise((resolve) => setTimeout(resolve, 600))
          return { ...validationForm }
        } finally {
          setLoading(false)
        }
      },
      onConfirm: (payload) => {
        ElMessage.success(`提交成功：${payload?.name || '未命名项目'}`)
        handleDrawerCancel()
      }
    },
    manualLoading: {
      title: '手动 loading 抽屉',
      width: 500,
      showFullScreen: false,
      disabledWidthDrag: true,
      mask: true,
      type: 'manual-loading',
      autoConfirmLoading: false,
      autoResetForm: true,
      confirm: async ({ setLoading, close }) => {
        manualState.running = true
        manualState.log = '开始执行...'
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))
        manualState.log = '执行完成，准备关闭'
        setLoading(false)
        close()
        manualState.running = false
        return true
      },
      onConfirm: () => {
        ElMessage.success('手动 loading 示例完成')
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

// 打开抽屉的方法
const openBasicDrawer = () => {
  showDrawer('basic')
}

const openFullScreenDrawer = () => {
  showDrawer('fullScreen')
}

const openResizableDrawer = () => {
  showDrawer('resizable')
}

const openDescriptionDrawer = () => {
  showDrawer('description')
}

const openNoMaskDrawer = () => {
  showDrawer('noMask')
}

const openHeaderRightDrawer = () => {
  showDrawer('headerRight')
}

const openValidationDrawer = () => {
  Object.assign(validationForm, {
    name: '',
    owner: '',
    email: '',
    department: '',
    goal: '',
    risk: '',
    resource: '',
    remark: ''
  })
  showDrawer('validateForm')
}

const openManualLoadingDrawer = () => {
  manualState.running = false
  manualState.log = '等待触发...'
  showDrawer('manualLoading')
}

// 头部操作按钮事件处理
const handleRefresh = () => {
  ElMessage.success('数据已刷新')
}

const handleDownload = () => {
  ElMessage.success('开始下载数据')
}

const handleSettings = () => {
  ElMessage.info('打开设置面板')
}

// 处理drawer取消/关闭
const handleDrawerCancel = () => {
  drawerVisible.value = false
  ElMessage.info('已取消操作')
  // 延迟清空配置，确保动画完成
  setTimeout(() => {
    currentDrawer.value = null
  }, 300)
}
</script>

<style lang="scss" scoped>
.zx-drawer-example {
  padding: 20px;
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

.example-header {
  text-align: center;
  margin-bottom: 40px;

  h2 {
    color: var(--el-text-color-primary);
    margin-bottom: 10px;
  }

  p {
    color: var(--el-text-color-secondary);
    font-size: 16px;
  }
}

.example-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;

  .el-button {
    margin: 0 8px 8px 0;
  }
}

.theme-controls {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  border: 1px solid var(--el-border-color);

  span {
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}

.test-content {
  h3 {
    color: var(--el-text-color-primary);
    margin-bottom: 16px;
  }

  p {
    color: var(--el-text-color-regular);
    line-height: 1.6;
    margin-bottom: 16px;
  }
}

.validation-form-wrapper {
  max-height: 360px;
  overflow-y: auto;
  padding-right: 12px;
}

.validation-form {
  .el-form-item {
    margin-bottom: 18px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .zx-drawer-example {
    padding: 16px;
  }

  .example-controls {
    .el-button {
      width: 100%;
      margin: 0 0 8px 0;
    }
  }
}
</style>
