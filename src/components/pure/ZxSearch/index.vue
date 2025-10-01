<template>
  <div class="zx-search" :class="searchClasses">
    <!-- 简化的搜索输入框 -->
    <div class="zx-search__input-wrapper">
      <el-input
        v-model="searchValue"
        :placeholder="placeholder || '请输入搜索内容'"
        :disabled="disabled"
        :clearable="clearable"
        :size="size"
        class="zx-search__input"
        @input="handleInput"
        @keyup.enter="handleSearch"
        @clear="handleClear"
      >
        <template #append v-if="showSearchButton && searchMode === 'click'">
          <el-button type="primary" :loading="loading" :disabled="disabled" @click="handleSearch">
            <ZxIcon icon="Search" :size="16" />
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ZxIcon from '../ZxIcon/index.vue'
import './index.scss'

// 组件名称
defineOptions({
  name: 'ZxSearch'
})

// Props 定义
const props = defineProps({
  // 基础属性
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },

  // 搜索按钮相关
  showSearchButton: {
    type: Boolean,
    default: true
  },

  // 样式相关
  showPrefixIcon: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },

  // 搜索行为
  realTimeSearch: {
    type: Boolean,
    default: false
  },
  searchDelay: {
    type: Number,
    default: 300
  },

  // 搜索模式：'click' - 点击图标搜索（默认），'input' - 直接输入检索
  searchMode: {
    type: String,
    default: 'click',
    validator: (value) => ['click', 'input'].includes(value)
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'search', 'clear', 'input'])

// 响应式数据
const searchValue = ref(props.modelValue)
const searchTimer = ref(null)

// 计算属性
const searchClasses = computed(() => {
  return [
    'zx-search',
    {
      'zx-search--disabled': props.disabled,
      'zx-search--loading': props.loading,
      [`zx-search--${props.size}`]: props.size !== 'default'
    },
    props.customClass
  ]
})

// 监听器
watch(
  () => props.modelValue,
  (newValue) => {
    searchValue.value = newValue
  }
)

watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue)
  emit('input', newValue)

  // 根据搜索模式决定是否触发搜索
  if (props.searchMode === 'input') {
    handleInputSearch()
  }
  // 注意：click模式下不自动触发搜索，只能通过点击按钮或回车键搜索
})

// 方法
const handleInput = (value) => {
  searchValue.value = value
}

const handleSearch = () => {
  if (props.disabled || props.loading) return

  const trimmedValue = searchValue.value.trim()

  emit('search', {
    value: trimmedValue,
    mode: 'fuzzy' // 默认模糊搜索
  })
}

const handleClear = () => {
  searchValue.value = ''
  emit('clear')
  emit('search', {
    value: '',
    mode: 'fuzzy'
  })
}

const handleRealTimeSearch = () => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }

  searchTimer.value = setTimeout(() => {
    handleSearch()
  }, props.searchDelay)
}

// 处理直接输入检索（带防抖）
const handleInputSearch = () => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }

  searchTimer.value = setTimeout(() => {
    const trimmedValue = searchValue.value.trim()
    if (trimmedValue) {
      emit('search', {
        value: trimmedValue,
        mode: 'fuzzy'
      })
    }
  }, props.searchDelay)
}
</script>

<style scoped>


/* 响应式设计 */
@media (width <= 768px) {
  .zx-search {
    flex-direction: column;
    gap: 8px;
  }

  .search-input {
    width: 100%;
  }

  .search-button,
  .advanced-button {
    width: 100%;
  }
}

.zx-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.zx-search.is-disabled {
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  flex: 1;
}

.search-button,
.advanced-button {
  flex-shrink: 0;
}
</style>
