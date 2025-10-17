<template>
  <div
    v-loading="loadTagsLoading"
    :class="[
      ns.b(),
      ns.m(size),
      ns.is('disabled', disabled),
      ns.is('readonly', readonly),
    ]"
  >
    <!-- 输入区域在上 -->
    <template v-if="inputPosition === 'top'">
      <section v-if="!readonly" :class="ns.e('section')">
        <header v-if="showInputHeader" :class="ns.e('section-header')">
          <div :class="ns.e('section-title')">
            <slot name="input-label">{{ inputLabel }}</slot>
          </div>
        </header>

        <div
          :class="ns.e('input-container')"
          @click="handleInputContainerClick"
        >
          <el-input
            ref="inputRef"
            v-model="inputValue"
            :placeholder="placeholder"
            :size="size"
            :disabled="inputDisabled"
            :maxlength="maxLength"
            :show-word-limit="showWordLimit"
            :class="ns.e('input')"
            @keydown.enter.prevent="handleAdd"
            @keydown.backspace="handleBackspace"
            @blur="handleBlur"
            @focus="handleFocus"
            @click.stop
          >
            <template v-if="$slots.prefix" #prefix>
              <slot name="prefix" />
            </template>
            <template v-if="$slots.suffix" #suffix>
              <slot name="suffix" />
            </template>
            <template #append>
              <el-button
                v-if="showAddButton"
                :size="size"
                :disabled="addButtonDisabled"
                :loading="isAdding"
                @click.stop="handleAdd"
              >
                {{ addButtonText }}
              </el-button>
            </template>
          </el-input>
        </div>

        <div v-if="errorMessage" :class="ns.e('error')">
          {{ errorMessage }}
        </div>

        <!-- 建议列表 -->
        <div
          v-if="
            showSuggestions && availableSuggestions.length > 0 && !inputDisabled
          "
          :class="ns.e('suggestions')"
        >
          <div :class="ns.e('suggestions-title')">
            <slot name="suggestions-title">建议标签</slot>
          </div>
          <div :class="ns.e('suggestions-list')">
            <el-tag
              v-for="(option, index) in filteredSuggestions"
              :key="option[suggestionValueKey] || index"
              :type="tagType"
              :size="size"
              :effect="tagEffect"
              :class="ns.e('suggestion-tag')"
              @click="handleSuggestionClick(option)"
            >
              <slot name="suggestion" :option="option">
                {{ option[suggestionLabelKey] || option }}
              </slot>
            </el-tag>
          </div>
        </div>
      </section>

      <el-divider v-if="showDivider && !readonly" :class="ns.e('divider')" />

      <section :class="ns.e('section')">
        <header v-if="showTagsHeader" :class="ns.e('section-header')">
          <div :class="ns.e('section-title')">
            <slot name="tags-label">{{ tagsLabel }}</slot>
          </div>
          <div v-if="showTip && !errorMessage" :class="ns.e('counter')">
            {{ tipMessage }}
          </div>
        </header>

        <div :class="ns.e('tags-container')" :data-empty="!hasTags">
          <div v-if="hasTags" :class="ns.e('tags')">
            <el-tag
              v-for="(tag, index) in innerModelValue"
              :key="`${tag}-${index}`"
              :closable="canRemove(index)"
              :type="tagType"
              :size="size"
              :effect="tagEffect"
              :disable-transitions="true"
              :class="[ns.e('tag'), { [ns.is('removing')]: isRemoving(index) }]"
              @close="handleRemove(index)"
              @click.stop="handleTagClick(tag, index)"
            >
              <slot
                name="tag"
                :tag="tag"
                :index="index"
                :label="getTagLabel(tag)"
              >
                {{ getTagLabel(tag) }}
              </slot>
            </el-tag>
          </div>
          <div v-else :class="ns.e('empty')">
            <slot name="empty">
              {{ emptyTagText }}
            </slot>
          </div>
        </div>
      </section>
    </template>

    <!-- 输入区域在下（默认） -->
    <template v-else>
      <section :class="ns.e('section')">
        <header v-if="showTagsHeader" :class="ns.e('section-header')">
          <div :class="ns.e('section-title')">
            <slot name="tags-label">{{ tagsLabel }}</slot>
          </div>
          <div v-if="showTip && !errorMessage" :class="ns.e('counter')">
            {{ tipMessage }}
          </div>
        </header>

        <div :class="ns.e('tags-container')" :data-empty="!hasTags">
          <div v-if="hasTags" :class="ns.e('tags')">
            <el-tag
              v-for="(tag, index) in innerModelValue"
              :key="`${tag}-${index}`"
              :closable="canRemove(index)"
              :type="tagType"
              :size="size"
              :effect="tagEffect"
              :disable-transitions="true"
              :class="[ns.e('tag'), { [ns.is('removing')]: isRemoving(index) }]"
              @close="handleRemove(index)"
              @click.stop="handleTagClick(tag, index)"
            >
              <slot
                name="tag"
                :tag="tag"
                :index="index"
                :label="getTagLabel(tag)"
              >
                {{ getTagLabel(tag) }}
              </slot>
            </el-tag>
          </div>
          <div v-else :class="ns.e('empty')">
            <slot name="empty">
              {{ emptyTagText }}
            </slot>
          </div>
        </div>
      </section>

      <el-divider v-if="showDivider && !readonly" :class="ns.e('divider')" />

      <section v-if="!readonly" :class="ns.e('section')">
        <header v-if="showInputHeader" :class="ns.e('section-header')">
          <div :class="ns.e('section-title')">
            <slot name="input-label">{{ inputLabel }}</slot>
          </div>
        </header>

        <div
          :class="ns.e('input-container')"
          @click="handleInputContainerClick"
        >
          <el-input
            ref="inputRef"
            v-model="inputValue"
            :placeholder="placeholder"
            :size="size"
            :disabled="inputDisabled"
            :maxlength="maxLength"
            :show-word-limit="showWordLimit"
            :class="ns.e('input')"
            @keydown.enter.prevent="handleAdd"
            @keydown.backspace="handleBackspace"
            @blur="handleBlur"
            @focus="handleFocus"
            @click.stop
          >
            <template v-if="$slots.prefix" #prefix>
              <slot name="prefix" />
            </template>
            <template v-if="$slots.suffix" #suffix>
              <slot name="suffix" />
            </template>
            <template #append>
              <el-button
                v-if="showAddButton"
                :size="size"
                :disabled="addButtonDisabled"
                :loading="isAdding"
                @click.stop="handleAdd"
              >
                {{ addButtonText }}
              </el-button>
            </template>
          </el-input>
        </div>

        <div v-if="errorMessage" :class="ns.e('error')">
          {{ errorMessage }}
        </div>

        <!-- 建议列表 -->
        <div
          v-if="
            showSuggestions && availableSuggestions.length > 0 && !inputDisabled
          "
          :class="ns.e('suggestions')"
        >
          <div :class="ns.e('suggestions-title')">
            <slot name="suggestions-title">建议标签</slot>
          </div>
          <div :class="ns.e('suggestions-list')">
            <el-tag
              v-for="(option, index) in filteredSuggestions"
              :key="option[suggestionValueKey] || index"
              :type="tagType"
              :size="size"
              :effect="tagEffect"
              :class="ns.e('suggestion-tag')"
              @click="handleSuggestionClick(option)"
            >
              <slot name="suggestion" :option="option">
                {{ option[suggestionLabelKey] || option }}
              </slot>
            </el-tag>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  ref,
  watch,
} from 'vue'
import { ElButton, ElDivider, ElInput, ElMessage, ElTag } from 'element-plus'
import { useNamespace } from '@zxui/hooks'
import { isPromise } from '@zxui/utils'
import { zxTagsInputEmits, zxTagsInputProps } from './tags-input'

export default defineComponent({
  name: 'ZxTagsInput',
  components: {
    ElTag,
    ElInput,
    ElButton,
    ElDivider,
  },
  props: zxTagsInputProps,
  emits: zxTagsInputEmits,
  setup(props, { emit, slots }) {
    const ns = useNamespace('tags-input')

    // 响应式数据
    const innerModelValue = ref<string[]>([...(props.modelValue as string[])])
    const inputValue = ref('')
    const inputRef = ref()
    const isAdding = ref(false)
    const removingIndexes = ref<number[]>([])
    const availableSuggestions = ref<any[]>([])
    const suggestionsLoading = ref(false)
    const hasLoadedSuggestions = ref(false)
    const loadTagsLoading = ref(false)
    // 保存完整的初始标签数据，用于显示 label
    const loadTagsData = ref<any[]>([])

    // 加载初始标签（用于回显）
    async function loadloadTags() {
      try {
        loadTagsLoading.value = true
        let result: any[] | undefined | null
        if (typeof props.loadTags === 'function') {
          result = await props.loadTags()
        } else {
          result = props.loadTags
        }
        const processedData = props.transform(result ?? [])
        const dataArray = Array.isArray(processedData) ? processedData : []

        // 保存完整的对象数据
        loadTagsData.value = dataArray

        // 从 loadTags 中提取 value 并更新到 modelValue
        const values = dataArray.map((item: any) => {
          return item[props.valueKey] ?? item
        })

        // 更新 modelValue
        innerModelValue.value = values
        emit('update:modelValue', values)
        emit('tags-loaded', dataArray)
      } catch (error) {
        console.error('[zx-tags-input] 加载 loadTags 出错:', error)
      } finally {
        loadTagsLoading.value = false
      }
    }

    // 加载建议标签列表
    async function loadSuggestions(keyword = '') {
      try {
        suggestionsLoading.value = true
        let result: any[] | undefined | null
        if (typeof props.suggestions === 'function') {
          result = await props.suggestions(keyword)
        } else {
          result = props.suggestions
        }
        const processedData = props.transformSuggestions(result ?? [])
        availableSuggestions.value = Array.isArray(processedData)
          ? [...processedData]
          : []
        hasLoadedSuggestions.value = true
        emit('suggestions-loaded', availableSuggestions.value)
      } catch (error) {
        console.error('[zx-tags-input] 加载 suggestions 出错:', error)
        availableSuggestions.value = []
      } finally {
        suggestionsLoading.value = false
      }
    }

    // 获取建议列表（过滤掉已添加的标签）
    const filteredSuggestions = computed(() => {
      if (!props.showSuggestions || availableSuggestions.value.length === 0) {
        return []
      }

      const keyword = inputValue.value.toLowerCase().trim()
      const existing = new Set(innerModelValue.value)

      let filtered = availableSuggestions.value.filter((option: any) => {
        const value = option[props.suggestionValueKey] ?? option
        const label = option[props.suggestionLabelKey] ?? option

        // 排除已添加的
        if (existing.has(value)) return false

        // 如果有输入，进行过滤
        if (keyword) {
          return String(label).toLowerCase().includes(keyword)
        }

        return true
      })

      // 限制数量
      if (props.maxSuggestions > 0) {
        filtered = filtered.slice(0, props.maxSuggestions)
      }

      return filtered
    })

    // 监听 loadTags 变化
    watch(
      () => props.loadTags,
      async () => {
        await loadloadTags()
      },
      { immediate: false }
    )

    // 监听 suggestions 变化
    watch(
      () => props.suggestions,
      async () => {
        hasLoadedSuggestions.value = false
        await loadSuggestions()
      },
      { immediate: false }
    )

    // 计算属性
    const reachedMaxCount = computed(() => {
      return (
        props.maxCount > 0 && innerModelValue.value.length >= props.maxCount
      )
    })

    const hasTags = computed(() => innerModelValue.value.length > 0)

    // 获取标签的显示文本
    const getTagLabel = (value: string): string => {
      // 如果有初始数据，从中查找对应的 label
      if (loadTagsData.value.length > 0) {
        const found = loadTagsData.value.find((item: any) => {
          const itemValue = item[props.valueKey] ?? item
          return itemValue === value
        })
        if (found) {
          return found[props.labelKey] ?? value
        }
      }
      // 否则直接返回 value
      return value
    }

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
      if (props.maxCount > 0) {
        const max = props.maxCount
        return `${current} / ${max}`
      }
      return `${current} 个标签`
    })

    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      (val) => {
        innerModelValue.value = [...(val as string[])]
      },
      { deep: true }
    )

    const showTagsHeader = computed(
      () =>
        !!props.tagsLabel ||
        !!slots['tags-label'] ||
        (props.showTip && !errorMessage.value)
    )
    const showInputHeader = computed(
      () => !!props.inputLabel || !!slots['input-label']
    )

    const inputDisabled = computed(
      () => props.disabled || reachedMaxCount.value
    )

    const addButtonDisabled = computed(() => {
      const trimmed = props.trimValue
        ? inputValue.value.trim()
        : inputValue.value
      return (
        inputDisabled.value ||
        !trimmed ||
        !!errorMessage.value ||
        isAdding.value
      )
    })

    const isRemoving = (index: number) => removingIndexes.value.includes(index)

    const canRemove = (index: number) =>
      !props.readonly && !props.disabled && !isRemoving(index)

    const toggleRemoving = (index: number, flag: boolean) => {
      if (flag) {
        if (!removingIndexes.value.includes(index)) {
          removingIndexes.value = [...removingIndexes.value, index]
        }
      } else {
        removingIndexes.value = removingIndexes.value.filter(
          (item) => item !== index
        )
      }
    }

    const resolveGuard = async <Args extends any[]>(
      guard: ((...args: Args) => any) | null,
      ...args: Args
    ) => {
      if (!guard) return true
      try {
        const result = guard(...args)
        if (isPromise(result)) {
          const value = await result
          return value !== false
        }
        return result !== false
      } catch (error) {
        console.warn('[zx-tags-input] guard execution failed:', error)
        return false
      }
    }

    // 方法
    const addTag = async () => {
      let value = inputValue.value
      if (props.trimValue) {
        value = value.trim()
      }

      // 基础验证
      if (!value) {
        return
      }

      if (value.length < props.minLength) {
        ElMessage.warning(`标签长度不能少于 ${props.minLength} 个字符`)
        return
      }

      if (value.length > props.maxLength) {
        ElMessage.warning(`标签长度不能超过 ${props.maxLength} 个字符`)
        return
      }

      if (!props.allowDuplicates && innerModelValue.value.includes(value)) {
        ElMessage.warning('标签已存在')
        return
      }

      if (reachedMaxCount.value) {
        ElMessage.warning(`最多只能添加 ${props.maxCount} 个标签`)
        return
      }

      // 自定义验证
      if (props.validator && !props.validator(value)) {
        return
      }

      const allowAdd = await resolveGuard(
        props.beforeAdd,
        value,
        innerModelValue.value.slice()
      )
      if (!allowAdd) {
        emit('add-cancel', value)
        return
      }

      isAdding.value = true
      try {
        // 添加标签
        innerModelValue.value = [...innerModelValue.value, value]

        // 触发事件
        emit('update:modelValue', innerModelValue.value)
        emit('change', innerModelValue.value)
        emit('add', value)

        inputValue.value = ''

        // 聚焦输入框
        nextTick(() => {
          inputRef.value?.focus()
        })
      } finally {
        isAdding.value = false
      }
    }

    const removeTag = async (index: number) => {
      const tag = innerModelValue.value[index]
      if (tag === undefined) return

      toggleRemoving(index, true)

      try {
        const allowRemove = await resolveGuard(
          props.beforeRemove,
          tag,
          index,
          innerModelValue.value.slice()
        )

        if (!allowRemove) {
          emit('remove-cancel', tag, index)
          return
        }

        const next = innerModelValue.value.slice()
        next.splice(index, 1)
        innerModelValue.value = next

        // 触发事件
        emit('update:modelValue', innerModelValue.value)
        emit('change', innerModelValue.value)
        emit('remove', tag, index)
      } finally {
        toggleRemoving(index, false)
      }
    }

    const handleBackspace = () => {
      if (inputValue.value === '' && innerModelValue.value.length > 0) {
        void removeTag(innerModelValue.value.length - 1)
      }
    }

    const handleBlur = (evt: FocusEvent) => {
      if (props.addOnBlur && inputValue.value.trim()) {
        addTag()
      }
      emit('blur', evt)
    }

    const handleFocus = (evt: FocusEvent) => {
      emit('focus', evt)
    }

    const handleTagClick = (tag: string, index: number) => {
      emit('tag-click', tag, index)
    }

    // 监听输入变化
    watch(inputValue, (val) => {
      emit('input-change', val)
    })

    const handleAdd = () => {
      if (!isAdding.value) {
        void addTag()
      }
    }

    const handleRemove = (index: number) => {
      if (!isRemoving(index)) {
        void removeTag(index)
      }
    }

    const handleInputContainerClick = () => {
      if (!props.disabled) {
        inputRef.value?.focus()
      }
    }

    // 处理建议标签点击
    const handleSuggestionClick = (option: any) => {
      const value = option[props.suggestionValueKey] ?? option
      inputValue.value = String(value)
      emit('suggestion-click', option)
      void addTag()
    }

    // 组件挂载前加载数据
    onBeforeMount(async () => {
      if (props.loadTags) {
        await loadloadTags()
      }
      if (props.suggestions) {
        await loadSuggestions()
      }
    })

    // 暴露给外部的方法
    const reload = async () => {
      if (props.loadTags) {
        await loadloadTags()
      }
    }

    return {
      ns,
      innerModelValue,
      inputValue,
      inputRef,
      reachedMaxCount,
      errorMessage,
      tipMessage,
      hasTags,
      showTagsHeader,
      showInputHeader,
      inputDisabled,
      addButtonDisabled,
      isAdding,
      isRemoving,
      canRemove,
      addTag,
      removeTag,
      handleBackspace,
      handleBlur,
      handleFocus,
      handleTagClick,
      handleAdd,
      handleRemove,
      handleInputContainerClick,
      handleSuggestionClick,
      filteredSuggestions,
      availableSuggestions,
      suggestionsLoading,
      getTagLabel,
      suggestionValueKey: props.suggestionValueKey,
      suggestionLabelKey: props.suggestionLabelKey,
      tagsLabel: props.tagsLabel,
      inputLabel: props.inputLabel,
      emptyTagText: props.emptyText,
      showDivider: props.showDivider,
      addButtonText: props.addButtonText,
      tagType: props.tagType,
      tagEffect: props.tagEffect,
      inputPosition: props.inputPosition,
      reload,
      loadTagsLoading,
    }
  },
})
</script>
