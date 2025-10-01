<template>
  <div :class="['zx-tags-input', props.class]">
    <div class="zx-tags-input-container">
      <!-- 已添加的标签 -->
      <div class="zx-tags-input-tags">
        <el-tag
          v-for="(tag, index) in innerModelValue"
          :key="index"
          :closable="!props.readonly && !props.disabled"
          :type="props.tagType"
          :size="props.size"
          :effect="props.tagEffect"
          @close="removeTag(index)"
          @click="handleTagClick(tag, index)"
        >
          <slot name="tag" :tag="tag" :index="index">
            {{ tag }}
          </slot>
        </el-tag>
      </div>

      <!-- 输入框 -->
      <el-input
        v-if="!props.readonly && showInput"
        ref="inputRef"
        v-model="inputValue"
        :placeholder="props.placeholder || '请输入标签，按回车添加'"
        :size="props.size"
        :disabled="props.disabled"
        :maxlength="props.maxLength"
        :show-word-limit="props.showWordLimit"
        class="zx-tags-input-input"
        @keydown.enter.prevent="addTag"
        @keydown.backspace="handleBackspace"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <template v-if="$slots.prefix" #prefix>
          <slot name="prefix"></slot>
        </template>
        <template v-if="$slots.suffix" #suffix>
          <slot name="suffix"></slot>
        </template>
      </el-input>

      <!-- 添加按钮 -->
      <el-button
        v-if="props.showAddButton && !props.readonly"
        :size="props.size"
        :disabled="props.disabled || !inputValue.trim() || reachedMaxCount"
        @click="addTag"
      >
        {{ props.addButtonText || '添加' }}
      </el-button>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="zx-tags-input-error">
      {{ errorMessage }}
    </div>

    <!-- 提示信息 -->
    <div v-if="props.showTip && !errorMessage" class="zx-tags-input-tip">
      {{ tipMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

// 定义属性
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxCount: {
    type: Number,
    default: 10
  },
  maxLength: {
    type: Number,
    default: 20
  },
  minLength: {
    type: Number,
    default: 1
  },
  allowDuplicates: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  tagType: {
    type: String,
    default: '',
    validator: (value) => ['', 'success', 'info', 'warning', 'danger'].includes(value)
  },
  tagEffect: {
    type: String,
    default: 'light',
    validator: (value) => ['dark', 'light', 'plain'].includes(value)
  },
  showAddButton: {
    type: Boolean,
    default: false
  },
  addButtonText: {
    type: String,
    default: ''
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  showTip: {
    type: Boolean,
    default: true
  },
  validator: {
    type: Function,
    default: null
  },
  class: {
    type: String,
    default: ''
  },
  addOnBlur: {
    type: Boolean,
    default: false
  },
  trimValue: {
    type: Boolean,
    default: true
  }
})

// 定义事件
const emit = defineEmits([
  'update:modelValue',
  'change',
  'add',
  'remove',
  'tag-click',
  'focus',
  'blur',
  'input-change'
])

// 响应式数据
const innerModelValue = ref([...props.modelValue])
const inputValue = ref('')
const inputRef = ref()
const showInput = ref(true)

// 计算属性
const reachedMaxCount = computed(() => {
  return innerModelValue.value.length >= props.maxCount
})

const errorMessage = computed(() => {
  if (inputValue.value.length > props.maxLength) {
    return `标签长度不能超过 ${props.maxLength} 个字符`
  }
  if (reachedMaxCount.value && inputValue.value.trim()) {
    return `最多只能添加 ${props.maxCount} 个标签`
  }
  return ''
})

const tipMessage = computed(() => {
  const current = innerModelValue.value.length
  const max = props.maxCount
  return `已添加 ${current}/${max} 个标签`
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    innerModelValue.value = [...val]
  },
  { deep: true }
)

// 监听内部值变化
watch(
  () => innerModelValue.value,
  (val) => {
    emit('update:modelValue', [...val])
    emit('change', [...val])
  },
  { deep: true }
)

// 监听输入值变化
watch(
  () => inputValue.value,
  (val) => {
    emit('input-change', val)
  }
)

// 方法
const addTag = () => {
  let value = inputValue.value

  if (props.trimValue) {
    value = value.trim()
  }

  if (!value) {
    return
  }

  // 长度验证
  if (value.length < props.minLength) {
    ElMessage.warning(`标签长度不能少于 ${props.minLength} 个字符`)
    return
  }

  if (value.length > props.maxLength) {
    ElMessage.warning(`标签长度不能超过 ${props.maxLength} 个字符`)
    return
  }

  // 数量验证
  if (reachedMaxCount.value) {
    ElMessage.warning(`最多只能添加 ${props.maxCount} 个标签`)
    return
  }

  // 重复验证
  if (!props.allowDuplicates && innerModelValue.value.includes(value)) {
    ElMessage.warning('标签已存在')
    return
  }

  // 自定义验证
  if (props.validator && !props.validator(value)) {
    return
  }

  // 添加标签
  innerModelValue.value.push(value)
  inputValue.value = ''
  emit('add', value)

  // 聚焦输入框
  nextTick(() => {
    if (inputRef.value && !reachedMaxCount.value) {
      inputRef.value.focus()
    }
  })
}

const removeTag = (index) => {
  const removedTag = innerModelValue.value[index]
  innerModelValue.value.splice(index, 1)
  emit('remove', removedTag, index)

  // 聚焦输入框
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

const handleTagClick = (tag, index) => {
  emit('tag-click', tag, index)
}

const handleBackspace = () => {
  if (!inputValue.value && innerModelValue.value.length > 0) {
    removeTag(innerModelValue.value.length - 1)
  }
}

const handleBlur = () => {
  if (props.addOnBlur && inputValue.value.trim()) {
    addTag()
  }
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}

// 暴露方法
defineExpose({
  focus: () => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  },
  blur: () => {
    if (inputRef.value) {
      inputRef.value.blur()
    }
  },
  addTag,
  removeTag,
  clear: () => {
    innerModelValue.value = []
    inputValue.value = ''
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
