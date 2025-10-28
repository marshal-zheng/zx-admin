<template>
  <ZxDrawer
    v-bind="drawer.drawerProps.value"
    title="新建指标体系"
    :loading="drawerLoading"
    loadingType="skeleton"
    v-on="drawer.drawerEvents.value"
  >
    <div class="system-form-container">
      <!-- 基本信息表单 -->
      <el-form
        ref="formRef"
        :model="drawer.state.data"
        :rules="formRules"
        label-position="top"
        class="mb-6"
      >
        <el-form-item label="体系分类" prop="clazzId">
          <CategorySelector
            v-model="drawer.state.data.clazzId"
            placeholder="请选择体系分类"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="体系名称" prop="evaluaName">
          <el-input
            v-model="drawer.state.data.evaluaName"
            placeholder="请输入体系名称"
            maxlength="50"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="评估模板" prop="templateId">
          <EvaluationTemplateSelector
            v-model="drawer.state.data.templateId"
            placeholder="请选择评估模板"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="体系说明" prop="evaluaExpplain">
          <el-input
            v-model="drawer.state.data.evaluaExpplain"
            type="textarea"
            placeholder="请输入体系说明"
            :rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="体系标签" prop="tagId">
          <el-transfer
            ref="transferRef"
            v-model="drawer.state.data.tagId"
            :data="allTags"
            :titles="['可选标签', '已选标签']"
            :props="{
              key: 'id',
              label: 'tagName'
            }"
            filterable
            filter-placeholder="搜索标签"
            style="width: 100%"
            class="system-transfer"
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDrawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useDrawer } from '@zxio/zxui'
import { systemApi } from '@/api/modules/indicator/system'
import { systemTagApi, type SystemTag } from '@/api/modules/indicator/systemTag'
import { CategorySelector } from '../../components/selector'
import { EvaluationTemplateSelector } from './selector'

// 定义指标体系表单数据接口
interface SystemFormData {
  evaluaId?: string | number
  id?: string | number // 兼容列表传递的 id 字段
  evalu?: string | number // 兼容列表传递的 id 字段
  clazzId: string
  clazzName?: string
  createTime?: string
  evaluaName: string
  evaluaExpplain: string
  evaluaTemplate?: number
  templateId?: string | number
  tagId?: string[]
  reEvaluaSystemTags?: Array<{ id: string; tagName: string }>
}

// 定义事件
const emit = defineEmits<{
  success: [data?: any]
}>()

// 表单引用
const formRef = ref<FormInstance | null>(null)

// Transfer 引用
const transferRef = ref()

// Drawer loading 状态
const drawerLoading = ref(false)

// 表单验证规则
const formRules = {
  clazzId: [{ required: true, message: '请选择指标体系分类', trigger: 'change' }],
  evaluaName: [
    { required: true, message: '请输入指标体系名称', trigger: 'blur' },
    { min: 2, max: 50, message: '指标体系名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  evaluaExpplain: [{ max: 200, message: '指标体系说明不能超过 200 个字符', trigger: 'blur' }]
}

// 标签数据
const allTags = ref<SystemTag[]>([])

// 使用 drawer hook
const drawer = useDrawer<SystemFormData>({
  title: '新建指标体系',
  size: '35%',
  okText: '下一步',
  placement: 'right',
  formRef,
  formModel: computed(() => drawer.state.data),
  autoResetForm: true,
  preValidate: true,
  autoScrollToError: true,
  defaultData: () => ({
    clazzId: '',
    evaluaName: '',
    evaluaExpplain: '',
    templateId: '',
    tagId: []
  }),
  onConfirm: async () => {
    // 准备提交数据，只排除不需要的字段
    const { reEvaluaSystemTags, ...submitData } = drawer.state.data

    emit('success', submitData)
  },
  onConfirmError: (error: any) => {
  }
})

// 加载所有标签数据
const loadAllTags = async () => {
  try {
    const response = await systemTagApi.getSystemTagList({ size: 999 })
    allTags.value = response.records || []
  } catch (error) {
    console.error('加载标签列表失败:', error)
  }
}

// 设置穿梭框双击事件
const setupTransferDblClick = () => {
  nextTick(() => {
    const transferEl = transferRef.value?.$el
    if (!transferEl) return

    // 获取左右两侧的列表容器
    const panels = transferEl.querySelectorAll('.el-transfer-panel')
    if (panels.length !== 2) return

    // 为左右两侧的列表项添加双击事件
    panels.forEach((panel: Element) => {
      panel.addEventListener('dblclick', (e: Event) => {
        const target = e.target as HTMLElement
        // 查找最近的列表项元素
        const listItem = target.closest('.el-transfer-panel__item')
        if (!listItem) return

        // 获取列表项的 label 元素
        const labelEl = listItem.querySelector('.el-checkbox__label')
        if (!labelEl) return

        // 获取 label 的内容（标签名称）
        const tagName = labelEl.textContent?.trim()
        if (!tagName) return

        // 查找对应的标签 ID
        const tag = allTags.value.find((t) => t.tagName === tagName)
        if (!tag) return

        const tagId = tag.id
        const selectedIds = drawer.state.data.tagId || []

        // 切换选中状态
        if (selectedIds.includes(tagId)) {
          // 从右侧移到左侧
          drawer.state.data.tagId = selectedIds.filter((id) => id !== tagId)
        } else {
          // 从左侧移到右侧
          drawer.state.data.tagId = [...selectedIds, tagId]
        }
      })
    })
  })
}

// 自定义 open 方法
const openDrawer = async (systemData?: SystemFormData) => {
  // 加载标签列表
  await loadAllTags()

  // 兼容 evaluaId 和 id 两种字段
  const systemId = systemData?.evaluaId || systemData?.id

  if (systemData && systemId) {
    // 先打开抽屉
    drawer.open()

    // 设置加载状态
    drawerLoading.value = true

    try {
      // 调用详情接口获取完整数据
      const detail = await systemApi.getSystemDetail(systemId)

      // 直接使用 detail 数据填充表单，不需要手动逐个赋值
      drawer.state.data = {
        ...detail,
        // 从 reEvaluaSystemTags 中提取标签 ID 列表
        tagId: detail.reEvaluaSystemTags && Array.isArray(detail.reEvaluaSystemTags)
          ? detail.reEvaluaSystemTags.map((tag: any) => tag.id)
          : []
      }
    } finally {
      drawerLoading.value = false
    }

    // 设置穿梭框双击事件
    setupTransferDblClick()
  } else {
    // 新增模式
    drawer.open()

    // 设置穿梭框双击事件
    setupTransferDblClick()
  }
}

// 暴露方法
defineExpose({
  open: openDrawer,
  close: drawer.close
})
</script>

<style lang="scss" scoped>
.system-form-container {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.system-transfer) {
    display: flex;
    justify-content: space-between;

    // .el-transfer-panel {
    //   width: 48%;
    // }
    .el-transfer__buttons {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
