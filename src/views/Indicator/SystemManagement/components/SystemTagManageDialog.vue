<template>
  <ZxDialog v-bind="dialogProps" v-on="dialogEvents" :ok-text="'确定'">
    <div class="system-tag-manage-container">
      <ZxTagsInput
        ref="tagsInputRef"
        v-model="state.data.tagId"
        :load-tags="loadTags"
        :transform="transformTags"
        value-key="id"
        label-key="tagName"
        :show-add-button="true"
        placeholder="请输入标签，按回车添加"
        :max-count="0"
        :max-length="20"
        :show-tip="true"
        tag-type="primary"
        tag-effect="light"
        input-position="bottom"
        :before-add="handleBeforeAdd"
        :before-remove="handleBeforeRemove"
        @change="handleChange"
      />
    </div>
  </ZxDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDialog } from '@zxio/zxui'
import { systemTagApi, type SystemTag } from '@/api/modules/indicator/systemTag'

// 定义事件
const emit = defineEmits<{
  success: [tagIds: string[]]
}>()

// 表单引用
const tagsInputRef = ref()

// 存储所有标签数据，用于通过 id 查找标签信息
// const allTagsData = ref<SystemTag[]>([])

// 加载已选标签列表（根据传入的 tagId 过滤）
const loadTags = async () => {
  const response = await systemTagApi.getSystemTagList({ size: 999 })
  // allTagsData.value = response.records || []

  return response.records
}

// 转换标签列表数据
const transformTags = (list: SystemTag[]) => {
  return list
}

// 处理变化
const handleChange = (value: string[]) => {
  // 可以在这里添加额外的处理逻辑
}

// 新增标签前的钩子
const handleBeforeAdd = async (tagName: string) => {
  // 调用创建接口
  const newTag = await systemTagApi.createSystemTag({ tagName })

  // 将新创建的标签 ID 添加到选中列表
  if (newTag && newTag.id) {
    const res = await tagsInputRef.value?.reload()
  }
}

// 删除标签前的钩子
const handleBeforeRemove = async (tagId: string) => {
  // 弹出确认框
  await ElMessageBox.confirm(`确定要删除该标签吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  // 用户确认后，调用删除接口
  await systemTagApi.deleteSystemTag(tagId)

  // 从选中列表中移除
  // state.data.tagId = (state.data.tagId || []).filter((id) => id !== tagId)
  // 从所有标签数据中移除
  // allTagsData.value = allTagsData.value.filter((t) => t.id !== tagId)
  // 重新加载标签列表
  await tagsInputRef.value?.reload()

  // 返回 false 阻止组件的默认删除行为
  return false
}

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open, close } = useDialog<{ tagId: string[] }>({
  title: '体系标签管理',
  width: '50%',
  okText: '确定',

  // 默认数据
  defaultData: () => ({
    tagId: []
  }),

  // 数据转换（打开时使用）
  dataTransform: (raw: { tagId: string[] }) => ({
    tagId: raw.tagId || []
  }),

  // 确认回调
  onConfirm: async (data) => {
    // 触发成功事件，通知父组件
    emit('success', data.tagId)
    return data.tagId
  },

  // 错误处理回调
  onConfirmError: (error: any) => {
    console.error('表单提交失败:', error)
    const errorMsg = error?.response?.data?.message || error?.message || '操作失败，请重试'
    ElMessage.error(errorMsg)
  }
})

// 暴露方法给父组件
defineExpose({
  open: (initialTagIds?: string[]) => {
    open({ tagId: initialTagIds || [] })
  },
  close
})
</script>

<style lang="scss" scoped>
.system-tag-manage-container {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}
</style>
