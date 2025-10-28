---
mode: agent
---

## 触发条件

当满足任一条件时，自动启用本规则：

1. 在聊天中明确指定或引用本规则文件：
   - "按 **.github/prompts/gen-crud-auto.prompt.md** 的规则执行"
   - "使用 **gen-crud-auto** 自动生成 CRUD 页面"
   - "启用**自动生成 CRUD Agent**"
2. 兜底触发（可选）：消息首块存在 `---\nmode: agent\n---` 的 YAML 头，且包含 CRUD 页面实现需求
   > 反触发：若用户明确表示"仅预览/不要执行/只解释规则文本"，则不启用。

# 规则：CRUD Page Auto Builder（CRUD 页面自动生成 Agent）

> 启用后进入"零交互·自动提交"模式：除非缺失关键输入，否则不与用户往返对话；成功或失败时输出极简确认，不得回显或讨论代码内容。

## 目标

基于用户提供的需求描述（自然语言、数据模型、字段定义等），自动：

1. 解析与提炼 CRUD 需求规格（实体名称、字段、操作权限、筛选条件等）；
2. 在 `src/views/` 下生成符合本项目规范的 CRUD 页面骨架；
3. 完成列表页、创建/编辑表单（Dialog/Drawer/新页面）、API 调用；
4. 生成对应的 API 接口文件和类型定义；
5. 配置路由并完成导航集成；
6. 完成自检并尝试运行通过。

## 项目技术栈识别（必须执行）

**CRITICAL**: 在生成任何代码前，必须识别项目技术栈和组件库。

### 识别步骤

1. **读取 package.json**：
   - 识别 Vue 版本（Vue 2 / Vue 3）
   - 识别 UI 组件库（Element Plus / Element UI / Ant Design Vue 等）
   - 识别是否使用 TypeScript
   - 识别自定义组件库（如 `@zxio/zxui`）

2. **分析现有代码模式**：
   - 查看 `src/views/` 下现有页面的代码风格
   - 识别通用组件使用模式（如 `ZxGridList`、`ZxDialog`、`ZxDrawer` 等）
   - 识别 API 调用封装方式（如 `ZXR`、`axios` 等）
   - 识别路由配置方式

3. **适配技术栈**：
   - 根据识别结果选择对应的代码模板
   - 使用项目中已有的组件和工具函数
   - 遵循项目现有的代码风格和命名规范

## 强制执行约束（不可违反）

**在开始任何代码生成前，必须强制执行以下检查，任何违反都立即终止：**

1. **依赖零容忍**：
   - 不得引入项目中未安装的第三方依赖
   - 必须使用项目现有的组件库和工具函数
   - 若需要新功能，优先使用现有组件组合实现

2. **文件路径规范**：
   - 所有页面文件必须在 `src/views/<module-name>/` 目录下
   - API 文件必须在 `src/api/modules/<module-name>/` 目录下
   - 路由文件必须在 `src/router/routes/` 目录下
   - 类型定义文件必须在 API 文件同目录下或独立 `types.ts` 文件

3. **命名规范**：
   - 目录名：小写 kebab-case（如 `category-management`）
   - 文件名：小写 kebab-case（如 `list.vue`、`category-form-dialog.vue`）
   - 组件名：PascalCase（如 `CategoryFormDialog`）
   - API 变量名：驼峰命名 + Api 后缀（如 `categoryApi`）
   - 路由 name：PascalCase（如 `CategoryManagement`）

4. **代码质量要求**：
   - TypeScript 严格模式（若项目使用 TS）
   - 表单必须包含验证规则
   - 删除操作必须二次确认
   - API 调用必须包含错误处理
   - 列表必须支持分页和搜索

## 表单复杂度判定规则（关键决策点）

**CRITICAL**: 根据表单字段数量和复杂度选择合适的实现方式。

### 判定标准

#### 1. Dialog (弹框) - 简单表单

**适用场景**：
- 字段数量：2-5 个基础字段
- 字段类型：主要为 input、textarea、select 等简单输入
- 无复杂嵌套或动态字段
- 无需多步骤流程
- 表单高度不超过 600px

**典型示例**：
- 分类管理：名称 + 描述
- 标签管理：标签名 + 颜色
- 简单配置：开关 + 备注

**技术实现**：
- 使用 `ZxDialog` 组件（或项目中对应的 Dialog 组件）
- 表单宽度通常为 40%-50%
- label 位置：`label-position="right"`

#### 2. Drawer (抽屉) - 中等复杂表单

**适用场景**：
- 字段数量：5-15 个字段
- 包含复杂字段类型：穿梭框、级联选择、上传、富文本等
- 可能包含字段分组（section）
- 需要更大的表单展示空间
- 表单高度可能超过屏幕高度

**典型示例**：
- 用户管理：基本信息 + 角色权限 + 扩展信息
- 商品管理：基本信息 + 规格参数 + 图片上传
- 体系管理：分类 + 名称 + 说明 + 标签（穿梭框）

**技术实现**：
- 使用 `ZxDrawer` + `useDrawer` hook（或项目中对应的 Drawer 组件）
- 抽屉宽度通常为 35%-50%
- label 位置：`label-position="top"`（节省水平空间）
- 使用骨架屏加载（`loadingType="skeleton"`）

#### 3. 新页面 (独立路由) - 复杂表单

**适用场景**：
- 字段数量：15+ 个字段，或包含大量动态字段
- 多步骤流程（分步表单、向导式）
- 包含复杂可视化编辑（如拖拽设计、图表配置、流程编辑）
- 需要全屏展示和编辑
- 包含子表或复杂关联数据

**典型示例**：
- 指标体系设计：基本信息 + DAG 编辑器 + 指标配置
- 表单设计器：表单配置 + 可视化设计 + 预览
- 报表配置：数据源 + 图表设计 + 布局编辑

**技术实现**：
- 创建独立的 Vue 页面（如 `design.vue`、`edit.vue`）
- 配置独立路由（通常设置 `hidden: true` 且指定 `activeMenu`）
- 使用 `sessionStorage` 或路由参数传递初始数据
- 完成后跳转回列表页

### 判定流程图

```
开始 → 分析字段数量和类型
  ↓
字段 ≤ 5 且全为简单输入？
  ↓ 是
  使用 Dialog
  ↓ 否
字段 ≤ 15 且无复杂交互？
  ↓ 是
  使用 Drawer
  ↓ 否
  使用新页面
```

## 输出目录与文件结构

### 标准 CRUD 页面结构

```
src/views/<ModuleName>/
├── list.vue                          # 列表页（必需）
├── components/                       # 组件目录
│   ├── <Entity>FormDialog.vue        # Dialog 表单（简单）
│   ├── <Entity>FormDrawer.vue        # Drawer 表单（中等）
│   └── selector/                     # 选择器组件（可选）
│       ├── <Entity>Selector.vue
│       └── index.ts
├── design.vue                        # 设计页（复杂，可选）
└── edit.vue                          # 编辑页（复杂，可选）

src/api/modules/<moduleName>/
├── index.ts                          # API 接口定义
└── types.ts                          # 类型定义

src/router/routes/
└── <moduleName>.route.ts             # 路由配置
```

## 列表页代码规范（list.vue）

### 核心组件结构

```vue
<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadListData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <!-- 左侧：主要操作按钮 -->
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleCreate">新建</ZxButton>
            <!-- 其他操作按钮 -->
          </div>
          
          <!-- 中间：筛选器（可选） -->
          <div class="zx-grid-form-bar__filters">
            <!-- 下拉筛选、日期筛选等 -->
          </div>
          
          <!-- 右侧：搜索框 -->
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索关键字"
              :loading="loading"
              search-mode="click"
              @search="() => onSearch({ refresh, updateState })"
              @clear="() => onSearch({ refresh, updateState })"
            />
          </div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #table="{ grid, refresh }">
        <el-table 
          :data="grid.list" 
          style="width: 100%" 
          max-height="calc(100vh - 230px)"
        >
          <!-- 数据列 -->
          <el-table-column prop="name" label="名称" min-width="200" />
          <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          
          <!-- 操作列 -->
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                <ZxButton link type="danger" @click="handleDelete(row, refresh)">删除</ZxButton>
                <!-- 更多操作 -->
                <ZxMoreAction
                  :list="getMoreActionList(row)"
                  @select="handleMoreActionSelect($event, row, refresh)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 表单弹框/抽屉 -->
    <EntityFormDialog 
      v-if="useDialog"
      v-model="dialogVisible"
      :entity-data="currentEntity"
      :mode="formMode"
      @success="handleFormSuccess"
    />
    
    <EntityFormDrawer 
      v-if="useDrawer"
      ref="formDrawerRef"
      @success="handleFormSuccess"
    />
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '@/components/ContentWrap'
import { entityApi } from '@/api/modules/<moduleName>'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const gridListRef = ref(null)

// Dialog 模式状态
const dialogVisible = ref(false)
const currentEntity = ref(null)
const formMode = ref('create') // create | edit | view

// Drawer 模式引用
const formDrawerRef = ref()

// 数据加载函数
const loadListData = async (params) => {
  const response = await entityApi.getList(params)
  return response
}

// 搜索处理
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 新建（Dialog 模式）
const handleCreate = () => {
  currentEntity.value = null
  formMode.value = 'create'
  dialogVisible.value = true
}

// 新建（Drawer 模式）
const handleCreateDrawer = () => {
  formDrawerRef.value?.open()
}

// 编辑（Dialog 模式）
const handleEdit = (row) => {
  currentEntity.value = row
  formMode.value = 'edit'
  dialogVisible.value = true
}

// 编辑（Drawer 模式）
const handleEditDrawer = (row) => {
  formDrawerRef.value?.open(row)
}

// 编辑（新页面模式）
const handleEditPage = (row) => {
  router.push({
    path: '/module/entity-edit',
    query: { id: row.id }
  })
}

// 删除
const handleDelete = async (row, refresh) => {
  try {
    await ElMessageBox.confirm(
      `您即将删除"${row.name}"，此操作不可恢复，是否确认删除？`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    await entityApi.delete(row.id)
    ElMessage.success('删除成功')
    refresh()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 表单成功回调
const handleFormSuccess = () => {
  dialogVisible.value = false
  gridListRef.value?.refresh()
}

// 更多操作列表
const getMoreActionList = (row) => {
  return [
    { label: '查看详情', eventTag: 'view', icon: View },
    { label: '导出', eventTag: 'export', icon: Download },
    { isDivider: true },
    { label: '禁用', eventTag: 'disable', icon: CircleClose, danger: true }
  ]
}

// 更多操作处理
const handleMoreActionSelect = async (item, row, refresh) => {
  switch (item.eventTag) {
    case 'view':
      handleView(row)
      break
    case 'export':
      handleExport(row)
      break
    case 'disable':
      handleDisable(row, refresh)
      break
  }
}
</script>

<style lang="scss" scoped></style>
```

### 关键要点

1. **ZxGridList 配置**：
   - `load-data`：数据加载函数，返回符合格式的数据
   - `show-pagination`：显示分页
   - `load-on-mounted`：挂载时自动加载
   - `clear-selection-on-load`：加载时清除选择

2. **工具栏布局**：
   - 左侧：主要操作按钮（新建、批量操作等）
   - 中间：筛选器（下拉筛选、日期筛选等）
   - 右侧：搜索框

3. **表格配置**：
   - 使用 `el-table` 显示数据
   - 操作列固定在右侧（`fixed="right"`）
   - 长文本使用 `show-overflow-tooltip`
   - 高度适配：`max-height="calc(100vh - 230px)"`

4. **操作按钮**：
   - 主要操作：`ZxButton link` 样式
   - 更多操作：使用 `ZxMoreAction` 组件
   - 危险操作：`type="danger"` 且二次确认

## Dialog 表单规范（简单表单）

### 代码模板

```vue
<template>
  <ZxDialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="45%"
    :ok-text="mode === 'create' ? '创建' : '保存'"
    :show-cancel="true"
    :cancel-text="mode === 'view' ? '关闭' : '取消'"
    :confirm="handleSubmit"
    :form-ref="formRef"
    :form-model="formData"
    :auto-scroll-to-error="true"
    :loading="dialogLoading"
    :class="{ 'dialog-form-readonly': mode === 'view' }"
  >
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="名称" prop="name" required>
          <el-input
            v-model="formData.name"
            placeholder="请输入名称"
            maxlength="50"
            show-word-limit
            :disabled="mode === 'view'"
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="请输入描述"
            :rows="3"
            maxlength="200"
            show-word-limit
            :disabled="mode === 'view'"
            class="form-input"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { entityApi } from '@/api/modules/<moduleName>'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  entityData: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create', // create, edit, view
    validator: (value) => ['create', 'edit', 'view'].includes(value)
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref()

// Loading 状态
const dialogLoading = ref(false)

// Dialog 显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Dialog 标题
const dialogTitle = computed(() => {
  const titleMap = {
    create: '新建',
    edit: '编辑',
    view: '查看'
  }
  return titleMap[props.mode] || '表单'
})

// 表单数据
const formData = reactive({
  name: '',
  description: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 初始化表单数据
const initFormData = async () => {
  if (props.entityData && (props.mode === 'edit' || props.mode === 'view')) {
    await loadDetail(props.entityData.id)
  } else {
    resetFormData()
  }
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    name: '',
    description: ''
  })
}

// 加载详情
const loadDetail = async (id) => {
  dialogLoading.value = true
  try {
    const detail = await entityApi.getDetail(id)
    Object.assign(formData, {
      name: detail.name || '',
      description: detail.description || ''
    })
  } catch (error) {
    ElMessage.error('获取详情失败')
    throw error
  } finally {
    dialogLoading.value = false
  }
}

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  const submitData = {
    name: formData.name,
    description: formData.description
  }

  let requestPromise

  if (props.mode === 'create') {
    requestPromise = entityApi.create(submitData)
  } else if (props.mode === 'edit') {
    submitData.id = props.entityData.id
    requestPromise = entityApi.update(submitData)
  }

  if (!requestPromise) {
    emit('success')
    return
  }

  const response = await requestPromise
  emit('success', response)
  return response
}

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      await initFormData()
    }
  },
  { immediate: true }
)

// 监听数据变化
watch(
  () => props.entityData,
  async () => {
    if (props.modelValue) {
      await initFormData()
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.dialog-form-container {
  padding: 0;
}

.form-input {
  width: 100%;
}

// 只读模式样式
.dialog-form-readonly {
  :deep(.el-input__inner),
  :deep(.el-textarea__inner) {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
  }
}
</style>
```

### 关键要点

1. **ZxDialog 配置**：
   - 使用 `v-model` 双向绑定显示状态
   - `confirm` 属性传入提交函数（返回 Promise）
   - `form-ref` 和 `form-model` 用于自动表单验证
   - `auto-scroll-to-error` 自动滚动到错误字段

2. **三种模式**：
   - `create`：新建模式
   - `edit`：编辑模式
   - `view`：只读查看模式

3. **数据加载**：
   - 编辑/查看模式：调用详情接口获取最新数据
   - 新建模式：重置表单

4. **表单验证**：
   - 使用 Element Plus 的表单验证规则
   - 必填字段标记 `required`
   - 合理设置字段长度限制

## Drawer 表单规范（中等复杂表单）

### 代码模板

```vue
<template>
  <ZxDrawer
    v-bind="drawer.drawerProps.value"
    :title="isEditMode ? '编辑' : '新建'"
    :loading="drawerLoading"
    loadingType="skeleton"
    v-on="drawer.drawerEvents.value"
  >
    <div class="drawer-form-container">
      <el-form
        ref="formRef"
        :model="drawer.state.data"
        :rules="formRules"
        label-position="top"
        class="mb-6"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="drawer.state.data.name"
            placeholder="请输入名称"
            maxlength="50"
            show-word-limit
            clearable
          />
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <CategorySelector
            v-model="drawer.state.data.categoryId"
            placeholder="请选择分类"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="drawer.state.data.description"
            type="textarea"
            placeholder="请输入描述"
            :rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <!-- 复杂字段：穿梭框 -->
        <el-form-item label="标签" prop="tagIds">
          <el-transfer
            v-model="drawer.state.data.tagIds"
            :data="allTags"
            :titles="['可选标签', '已选标签']"
            :props="{ key: 'id', label: 'name' }"
            filterable
            filter-placeholder="搜索标签"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useDrawer } from '@zxio/zxui'
import { entityApi } from '@/api/modules/<moduleName>'
import { CategorySelector } from '../selector'

// 类型定义
interface FormData {
  id?: string | number
  name: string
  categoryId: string
  description: string
  tagIds: string[]
}

// Emits
const emit = defineEmits<{
  success: [data?: any]
}>()

// 表单引用
const formRef = ref<FormInstance | null>(null)

// Loading 状态
const drawerLoading = ref(false)

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  description: [
    { max: 200, message: '描述不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 编辑模式状态
const isEditMode = ref(false)
const editingId = ref<string | number | null>(null)

// 标签数据
const allTags = ref([])

// 使用 drawer hook
const drawer = useDrawer<FormData>({
  title: computed(() => isEditMode.value ? '编辑' : '新建'),
  size: '35%',
  okText: computed(() => isEditMode.value ? '保存' : '创建'),
  placement: 'right',
  formRef,
  formModel: computed(() => drawer.state.data),
  autoResetForm: true,
  preValidate: true,
  autoScrollToError: true,
  defaultData: () => ({
    name: '',
    categoryId: '',
    description: '',
    tagIds: []
  }),
  onConfirm: async () => {
    const submitData = {
      name: drawer.state.data.name,
      categoryId: drawer.state.data.categoryId,
      description: drawer.state.data.description,
      tagIds: drawer.state.data.tagIds
    }

    let response
    if (isEditMode.value && editingId.value) {
      response = await entityApi.update({ id: editingId.value, ...submitData })
      ElMessage.success('编辑成功')
    } else {
      response = await entityApi.create(submitData)
      ElMessage.success('创建成功')
    }

    emit('success', response)
    drawer.close()
  },
  onConfirmError: (error: any) => {
    console.error('操作失败:', error)
    const errorMsg = error?.response?.data?.message || error?.message || '操作失败，请重试'
    ElMessage.error(errorMsg)
  }
})

// 加载标签数据
const loadTags = async () => {
  try {
    const response = await entityApi.getTags()
    allTags.value = response.records || []
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

// 加载详情
const loadDetail = async (id: string | number) => {
  drawerLoading.value = true
  try {
    const detail = await entityApi.getDetail(id)
    
    drawer.state.data.name = detail.name || ''
    drawer.state.data.categoryId = detail.categoryId || ''
    drawer.state.data.description = detail.description || ''
    drawer.state.data.tagIds = detail.tagIds || []
  } catch (error) {
    ElMessage.error('加载详情失败')
    throw error
  } finally {
    drawerLoading.value = false
  }
}

// 自定义 open 方法
const openDrawer = async (entityData?: FormData) => {
  // 加载辅助数据
  await loadTags()

  const entityId = entityData?.id

  if (entityData && entityId) {
    // 编辑模式
    isEditMode.value = true
    editingId.value = entityId
    drawer.open()
    await loadDetail(entityId)
  } else {
    // 新增模式
    isEditMode.value = false
    editingId.value = null
    drawer.open()
  }
}

// 暴露方法
defineExpose({
  open: openDrawer,
  close: drawer.close
})
</script>

<style lang="scss" scoped>
.drawer-form-container {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}
</style>
```

### 关键要点

1. **useDrawer Hook**：
   - 统一管理 Drawer 状态和表单逻辑
   - 自动处理表单验证和提交
   - 支持 loading 状态管理

2. **Drawer 配置**：
   - `size`：通常为 35%-50%
   - `placement`：通常为 `right`
   - `label-position`：使用 `top` 节省水平空间
   - `loadingType`：使用 `skeleton` 骨架屏

3. **复杂字段**：
   - 选择器：使用自定义 Selector 组件
   - 穿梭框：`el-transfer`
   - 上传：`el-upload`
   - 富文本：`wangeditor` 等

4. **数据加载时机**：
   - 打开 Drawer 时加载辅助数据（如标签、分类等）
   - 编辑模式时异步加载详情数据
   - 使用骨架屏优化加载体验

## 新页面规范（复杂表单）

### 路由配置

```typescript
// src/router/routes/<moduleName>.route.ts
{
  path: 'entity-create',
  component: () => import('@/views/<ModuleName>/design.vue'),
  name: 'EntityCreate',
  meta: {
    title: '新建实体',
    hidden: true,
    activeMenu: '/module/entity-list'
  }
},
{
  path: 'entity-edit',
  component: () => import('@/views/<ModuleName>/edit.vue'),
  name: 'EntityEdit',
  meta: {
    title: '编辑实体',
    hidden: true,
    activeMenu: '/module/entity-list'
  }
}
```

### 创建页面（design.vue）

```vue
<template>
  <ComplexForm :form-data="formData" @save="handleSaveSuccess" />
</template>

<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ComplexForm from './components/ComplexForm.vue'

const router = useRouter()

// 从 sessionStorage 获取表单数据
const formData = computed(() => {
  try {
    const storedData = sessionStorage.getItem('entity_create_form_data')
    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    console.error('解析表单数据失败:', error)
  }
  return {}
})

// 保存成功后跳转回列表
const handleSaveSuccess = (data) => {
  // 清除 sessionStorage
  sessionStorage.removeItem('entity_create_form_data')
  
  // 延迟跳转
  setTimeout(() => {
    router.push('/module/entity-list')
  }, 1000)
}

// 组件卸载时清除 sessionStorage
onBeforeUnmount(() => {
  sessionStorage.removeItem('entity_create_form_data')
})
</script>
```

### 编辑页面（edit.vue）

```vue
<template>
  <ComplexForm :entity-id="entityId" @save="handleSaveSuccess" />
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ComplexForm from './components/ComplexForm.vue'

const router = useRouter()
const route = useRoute()

// 从路由参数获取 ID
const entityId = computed(() => route.query.id)

// 保存成功后跳转回列表
const handleSaveSuccess = () => {
  setTimeout(() => {
    router.push('/module/entity-list')
  }, 1000)
}
</script>
```

### 列表页跳转逻辑

```javascript
// 列表页 list.vue

// 新建（跳转到新页面）
const handleCreatePage = () => {
  // 1. 先弹出 Drawer 收集基本信息
  formDrawerRef.value?.open()
}

// Drawer 提交成功回调
const handleFormSuccess = (response) => {
  if (response && !response.id) {
    // 创建模式：将表单数据存入 sessionStorage
    const formData = {
      name: response.name,
      categoryId: response.categoryId,
      description: response.description
    }
    
    sessionStorage.setItem('entity_create_form_data', JSON.stringify(formData))
    
    // 跳转到创建页面
    router.push('/module/entity-create')
  } else {
    // 编辑模式：刷新列表
    gridListRef.value?.refresh()
  }
}

// 编辑（跳转到编辑页面）
const handleEditPage = (row) => {
  router.push({
    path: '/module/entity-edit',
    query: { id: row.id }
  })
}
```

### 关键要点

1. **路由配置**：
   - 设置 `hidden: true` 隐藏菜单
   - 设置 `activeMenu` 保持列表页高亮

2. **数据传递**：
   - 新建：使用 `sessionStorage` 传递初始数据
   - 编辑：使用路由参数传递 ID

3. **两步流程**（推荐）：
   - 第一步：Drawer 收集基本信息
   - 第二步：跳转到新页面进行复杂编辑

4. **页面跳转**：
   - 保存成功后跳转回列表页
   - 使用 `setTimeout` 延迟跳转，让用户看到成功提示

## API 接口规范

### API 文件结构

```typescript
// src/api/modules/<moduleName>/index.ts

import ZXR from '../../http'
import type { ListParams, ListResponse, EntityDetail, CreateData, UpdateData } from './types'

export const entityApi = {
  // 获取列表
  getList: (params: ListParams) => {
    return ZXR.get<ListResponse>({
      url: '/api/<moduleName>/<entityName>',
      params
    })
  },

  // 创建
  create: (data: CreateData) => {
    return ZXR.post<EntityDetail>({
      url: '/api/<moduleName>/<entityName>',
      data
    })
  },

  // 更新
  update: (data: UpdateData) => {
    return ZXR.put<EntityDetail>({
      url: `/api/<moduleName>/<entityName>/${data.id}`,
      data
    })
  },

  // 删除
  delete: (id: string | number) => {
    return ZXR.delete({
      url: `/api/<moduleName>/<entityName>/${id}`
    })
  },

  // 获取详情
  getDetail: (id: string | number) => {
    return ZXR.get<EntityDetail>({
      url: `/api/<moduleName>/<entityName>/${id}`
    })
  },

  // 批量删除
  batchDelete: (ids: (string | number)[]) => {
    return ZXR.delete({
      url: `/api/<moduleName>/<entityName>/batch`,
      data: { ids }
    })
  }
}
```

### 类型定义

```typescript
// src/api/modules/<moduleName>/types.ts

// 列表查询参数
export interface ListParams {
  page?: number
  size?: number
  keyword?: string
  categoryId?: string
  // 其他筛选参数
}

// 列表响应
export interface ListResponse {
  records: EntityDetail[]
  total: number
  size: number
  current: number
}

// 实体详情
export interface EntityDetail {
  id: string | number
  name: string
  description?: string
  categoryId?: string
  categoryName?: string
  createTime?: string
  updateTime?: string
  // 其他字段
}

// 创建数据
export interface CreateData {
  name: string
  description?: string
  categoryId?: string
  // 其他字段
}

// 更新数据
export interface UpdateData extends CreateData {
  id: string | number
}
```

### 关键要点

1. **RESTful 规范**：
   - GET `/api/entity`：获取列表
   - POST `/api/entity`：创建
   - PUT `/api/entity/{id}`：更新
   - DELETE `/api/entity/{id}`：删除
   - GET `/api/entity/{id}`：获取详情

2. **类型安全**：
   - 为所有 API 接口定义 TypeScript 类型
   - 使用泛型约束返回值类型
   - 导出类型供组件使用

3. **错误处理**：
   - 由 ZXR 封装统一处理
   - 组件层可以捕获特定错误进行个性化处理

4. **批量操作**：
   - 批量删除、批量导出等操作单独定义接口
   - 使用 POST 或 DELETE 传递 ID 数组

## 路由配置规范

### 路由文件结构

```typescript
// src/router/routes/<moduleName>.route.ts

import { Layout } from '@/utils/routerHelper'

export const <moduleName>Routes: AppRouteRecordRaw[] = [
  {
    path: '/<module-path>',
    component: Layout,
    name: '<ModuleName>',
    meta: {
      title: '模块名称',
      icon: 'vi-ep:folder',
      alwaysShow: true
    },
    redirect: '/<module-path>/<entity>-list',
    children: [
      {
        path: '<entity>-list',
        component: () => import('@/views/<ModuleName>/list.vue'),
        name: '<Entity>Management',
        meta: {
          title: '实体管理',
          icon: 'vi-ep:list'
        }
      },
      {
        path: '<entity>-create',
        component: () => import('@/views/<ModuleName>/design.vue'),
        name: '<Entity>Create',
        meta: {
          title: '新建实体',
          hidden: true,
          activeMenu: '/<module-path>/<entity>-list'
        }
      },
      {
        path: '<entity>-edit',
        component: () => import('@/views/<ModuleName>/edit.vue'),
        name: '<Entity>Edit',
        meta: {
          title: '编辑实体',
          hidden: true,
          activeMenu: '/<module-path>/<entity>-list'
        }
      }
    ]
  }
]
```

### 在主路由中注册

```typescript
// src/router/index.ts

import { <moduleName>Routes } from './routes/<moduleName>.route'

export const routes = [
  ...otherRoutes,
  ...<moduleName>Routes
]
```

### 关键要点

1. **路由命名**：
   - path：kebab-case（如 `category-list`）
   - name：PascalCase（如 `CategoryManagement`）

2. **Meta 配置**：
   - `title`：菜单显示名称
   - `icon`：菜单图标（使用 iconify 图标）
   - `hidden`：是否在菜单中隐藏
   - `activeMenu`：隐藏路由时高亮的菜单项

3. **布局组件**：
   - 使用 `Layout` 组件包裹模块路由
   - 子路由自动渲染在主内容区

## 原子化生成顺序（强制每步验证）

**CRITICAL**: 必须严格按顺序生成文件，每步完成后立即验证，禁止跳步或批量生成！

### 阶段1：需求分析与决策（严格执行）

1. **需求提炼**
   - 提取实体名称、字段定义、操作类型
   - 确定模块归属（新模块 or 现有模块）
   - 验证：需求清晰，字段完整

2. **表单复杂度判定**
   - 统计字段数量和类型
   - 根据判定规则选择实现方式（Dialog/Drawer/新页面）
   - 验证：决策合理，有明确依据

### 阶段2：API 层生成（依赖关系验证）

3. **类型定义文件**（`src/api/modules/<moduleName>/types.ts`）
   - 生成完成后立即验证：类型定义完整，导出正确
   - 失败则终止，输出 ERROR

4. **API 接口文件**（`src/api/modules/<moduleName>/index.ts`）
   - 必须引用 `./types` 中的类型
   - 生成完成后立即验证：能成功 import types，API 方法定义正确
   - 失败则终止，输出 ERROR

### 阶段3：视图层生成（严格顺序）

5. **列表页**（`src/views/<ModuleName>/list.vue`）
   - 必须在表单组件之前生成，确保列表页存在
   - 生成完成后立即验证：组件能正常导出，API 调用正确
   - 失败则终止，输出 ERROR

6. **表单组件**（Dialog/Drawer/新页面）
   - 根据复杂度判定结果生成对应组件
   - 生成完成后立即验证：组件能正常导出，表单验证规则完整
   - 失败则终止，输出 ERROR

### 阶段4：路由配置（集成验证）

7. **路由文件**（`src/router/routes/<moduleName>.route.ts`）
   - 生成或更新路由配置
   - 生成完成后立即验证：路由路径正确，组件路径能解析
   - 失败则终止，输出 ERROR

8. **路由注册**（`src/router/index.ts`）
   - 在主路由文件中注册新路由
   - 生成完成后立即验证：导入路径正确，路由能正常访问
   - 失败则终止，输出 ERROR

### 阶段5：辅助组件生成（可选）

9. **选择器组件**（如果需要）
   - 生成自定义选择器组件（`<Entity>Selector.vue`）
   - 验证：组件能正常工作，数据加载正确

10. **其他辅助组件**（如果需要）
    - 生成其他必要的辅助组件
    - 验证：组件功能正常

### 验证失败处理

- 任何阶段验证失败：立即终止，输出具体错误信息和失败的阶段
- 不得跳过验证或"先生成再说"
- 不得批量生成多个文件后再验证

## 最终完整性自检（零容错验证）

**所有文件生成完毕后，必须执行完整的最终自检。任何一项失败都视为整体失败。**

### 必需文件存在性检查

1. **核心文件结构验证**：

   ```
   src/views/<ModuleName>/
   ├── list.vue                          ✓ 必须存在
   ├── components/                       ✓ 必须存在
   │   ├── <Entity>FormDialog.vue        ✓ 简单表单必须存在
   │   ├── <Entity>FormDrawer.vue        ✓ 中等表单必须存在
   │   └── design.vue                    ✓ 复杂表单必须存在
   
   src/api/modules/<moduleName>/
   ├── index.ts                          ✓ 必须存在
   └── types.ts                          ✓ 必须存在
   
   src/router/routes/
   └── <moduleName>.route.ts             ✓ 必须存在
   ```

2. **文件内容完整性验证**：
   - `list.vue` 必须包含 `ZxGridList`、`loadData` 函数、操作方法
   - API 文件必须包含标准 CRUD 接口
   - 类型文件必须导出所有必要类型
   - 路由文件必须包含列表路由，复杂表单需包含创建/编辑路由

### 代码质量检查

3. **TypeScript 类型检查**（如果使用 TS）：
   - 所有接口和类型定义完整
   - 无类型错误和类型不匹配
   - Props 和 Emits 类型正确

4. **表单验证规则检查**：
   - 必填字段必须有验证规则
   - 字段长度限制合理
   - 自定义验证规则正确

5. **API 调用检查**：
   - 列表加载函数正确调用 API
   - 创建/编辑/删除操作正确调用 API
   - 错误处理完整

### 功能完整性检查

6. **CRUD 功能验证**：
   - 列表：分页、搜索、筛选功能完整
   - 创建：表单能正常提交，成功后刷新列表
   - 编辑：能正确加载详情，提交后更新成功
   - 删除：二次确认，删除后刷新列表

7. **路由功能验证**：
   - 列表页能正常访问
   - 创建/编辑页能正常访问（如果是新页面模式）
   - 路由跳转逻辑正确

8. **交互体验验证**：
   - Loading 状态正确显示
   - 成功/失败提示正确显示
   - 表单验证提示正确显示

### 命名一致性检查

9. **命名规范验证**：
   - 目录名：kebab-case
   - 文件名：kebab-case
   - 组件名：PascalCase
   - API 变量名：驼峰 + Api 后缀
   - 路由 name：PascalCase

### 自检失败处理

**如果任何一项检查失败**：

- 立即终止流程
- 输出具体的失败项和错误详情
- 返回标准失败消息（见下方标准）
- **不得部分提交或"先这样，后面再修复"**

## 标准成功/失败确认消息

### 成功消息（仅在所有检查通过时输出）：

```
✅ CRUD PAGE GENERATION SUCCESS

模块信息：
- 模块名称：<ModuleName>
- 实体名称：<EntityName>
- 表单类型：<Dialog/Drawer/新页面>

生成的文件：
- src/views/<ModuleName>/list.vue
- src/views/<ModuleName>/components/<Entity>Form<Dialog/Drawer>.vue
- src/api/modules/<moduleName>/index.ts
- src/api/modules/<moduleName>/types.ts
- src/router/routes/<moduleName>.route.ts

更新的文件：
- src/router/index.ts（路由注册）

验证结果：
✓ 所有文件依赖解析成功
✓ API 接口定义完整
✓ 类型定义完整
✓ 路由配置正确
✓ 表单验证规则完整
✓ CRUD 功能完整
✓ 命名规范符合要求

访问地址：
- 列表页：/<module-path>/<entity>-list
- 创建页：/<module-path>/<entity>-create（如适用）
- 编辑页：/<module-path>/<entity>-edit（如适用）
```

### 失败消息（任何检查失败时立即输出）：

```
❌ CRUD PAGE GENERATION FAILED

失败阶段：[具体失败的阶段，如 "阶段2：API 层生成" 或 "最终完整性自检"]
失败原因：[具体失败原因]
缺失/无效：[缺失或无效的文件/配置]

详细错误：
[具体错误详情]

建议：
[修复建议]

ERROR: CRUD 页面生成终止。已生成的文件已回滚。
```

## 最佳实践与禁止事项

### 最佳实践

1. **复用优先**：
   - 优先使用项目中已有的组件和工具函数
   - 复用现有的选择器组件、表单字段组件
   - 参考现有页面的代码风格

2. **类型安全**：
   - 使用 TypeScript 严格模式
   - 为所有接口和数据定义类型
   - 避免使用 `any` 类型

3. **用户体验**：
   - 合理使用 Loading 状态
   - 提供清晰的成功/失败提示
   - 表单验证提示要具体明确
   - 长文本使用 `show-overflow-tooltip`

4. **代码组织**：
   - 将复用逻辑提取为 Composable
   - 复杂组件拆分为小组件
   - 保持单个文件代码量在合理范围

### 禁止事项

1. **依赖管理**：
   - 禁止引入新的第三方依赖
   - 禁止使用项目未安装的组件库

2. **代码规范**：
   - 禁止直接使用魔法数字和字符串
   - 禁止在模板中写复杂逻辑
   - 禁止忽略 TypeScript 类型错误

3. **API 调用**：
   - 禁止在组件中直接使用 axios
   - 禁止忽略 API 错误处理
   - 禁止在循环中调用 API

4. **表单处理**：
   - 禁止跳过表单验证
   - 禁止删除操作不做二次确认
   - 禁止表单字段无验证规则

## 与现有规则的关系

本规则专注于 CRUD 页面的快速生成，与 `gen-com-auto.prompt.md`（组件生成规则）互补：

- `gen-com-auto`：用于生成可复用的 UI 组件
- `gen-crud-auto`：用于生成业务 CRUD 页面

两者可以配合使用：
1. 先使用 `gen-com-auto` 生成必要的自定义组件（如选择器）
2. 再使用 `gen-crud-auto` 生成完整的 CRUD 页面

## 输出约束

1. **极简输出**：
   - 成功时仅输出标准成功消息
   - 失败时仅输出标准失败消息
   - 不得额外讨论或解释代码

2. **无需确认**：
   - 除非缺失关键信息，否则自动执行
   - 不询问用户意见
   - 直接按规范生成代码

3. **原子性保证**：
   - 所有文件一次性生成
   - 失败则全部回滚
   - 不接受部分完成

---

**已完成任务**
