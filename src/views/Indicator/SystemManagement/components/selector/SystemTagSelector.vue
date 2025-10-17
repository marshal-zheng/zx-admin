<template>
  <div>
    <ZxTagsInput
      ref="tagsInputRef"
      v-model="innerValue"
      :load-tags="loadInitialTags"
      :transform="transformInitialTags"
      value-key="id"
      label-key="tagName"
      :show-add-button="true"
      :placeholder="placeholder"
      :max-count="maxCount"
      :max-length="maxLength"
      :show-tip="showTip"
      :tag-type="tagType"
      :tag-effect="tagEffect"
      :disabled="disabled"
      :readonly="readonly"
      :size="size"
      :before-add="handleBeforeAdd"
      :before-remove="handleBeforeRemove"
      v-bind="$attrs"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { systemTagApi, type SystemTag } from '@/api/modules/indicator/systemTag'

defineOptions({
  name: 'SystemTagSelector',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请输入或选择标签，按回车添加'
  },
  maxCount: {
    type: Number,
    default: 0
  },
  maxLength: {
    type: Number,
    default: 20
  },
  showTip: {
    type: Boolean,
    default: true
  },
  tagType: {
    type: String,
    default: 'primary'
  },
  tagEffect: {
    type: String,
    default: 'light'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

const innerValue = ref<string[]>([...props.modelValue])
const tagsInputRef = ref()
// 存储所有标签数据，用于通过 id 查找标签信息
const allTagsData = ref<SystemTag[]>([])

// 监听外部变化
watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = [...newVal]
  },
  { deep: true }
)

// 加载初始标签列表
const loadInitialTags = async () => {
  const response = await systemTagApi.getSystemTagList({ size: 999 })
  allTagsData.value = response.records || []
  return response.records || []
}

// 转换初始标签列表数据
const transformInitialTags = (list: SystemTag[]) => {
  return list
}

// 处理变化
const handleChange = (value: string[]) => {
  emit('update:modelValue', value)
  emit('change', value)
}

// 新增标签前的钩子
const handleBeforeAdd = async (tagName: string) => {
  try {
    // 调用创建接口
    await systemTagApi.createSystemTag({ tagName })
    ElMessage.success('标签创建成功')

    // 重新加载标签列表
    await tagsInputRef.value?.reload()

    // 返回 false 阻止组件的默认添加行为（因为我们已经通过 reload 重新加载了数据）
    return false
  } catch (error) {
    ElMessage.error('标签创建失败')
    console.error('创建标签失败:', error)
    return false
  }
}

// 删除标签前的钩子
const handleBeforeRemove = async (tagId: string) => {
  try {
    // 从所有标签数据中查找要删除的标签信息
    const tag = allTagsData.value.find((t) => t.id === tagId)
    const tagName = tag?.tagName || '该标签'

    // 弹出确认框
    await ElMessageBox.confirm(`确定要删除标签"${tagName}"吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 用户确认后，调用删除接口
    await systemTagApi.deleteSystemTag(tagId)
    ElMessage.success('标签删除成功')

    // 重新加载标签列表
    await tagsInputRef.value?.reload()

    // 返回 false 阻止组件的默认删除行为（因为我们已经通过 reload 重新加载了数据）
    return false
  } catch (error: any) {
    // 用户取消或删除失败
    if (error !== 'cancel') {
      ElMessage.error('标签删除失败')
      console.error('删除标签失败:', error)
    }
    return false
  }
}
</script>
