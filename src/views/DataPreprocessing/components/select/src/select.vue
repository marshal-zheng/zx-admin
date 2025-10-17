<template>
  <div 
    :class="ns.b('container')" 
    :style="{ 
      '--el-select-width': width 
    }"
  >
    <el-tooltip
      v-if="tooltip?.content"
      :content="tooltip.content"
      :placement="tooltip.placement || 'top'"
      :show-after="300"
    >
      <el-select
        ref="selectRef"
        v-model="innerValue"
        :class="ns.b()"
        :placeholder="placeholder"
        :clearable="allowClear"
        :filterable="allowSearch"
        :loading="loading || optionsLoading"
        :multiple="multiple"
        :collapse-tags="shouldCalculateMaxTag !== false && multiple"
        :max-collapse-tags="maxTagCount"
        :filter-method="handleSearch"
        :disabled="disabled"
        :size="size"
        :popper-append-to-body="false"
        :teleported="true"
        @change="handleChange"
        @blur="handleBlur"
        @visible-change="handlePopupVisibleChange"
        @remove-tag="handleRemoveTag"
        @clear="handleClear"
      >
        <el-option
          v-if="hasAllSelect && multiple"
          :value="'__ALL_SELECT__'"
          :label="'全选'"
          :disabled="true"
          class="all-select-option"
        >
          <el-checkbox
            :model-value="isSelectAll"
            :indeterminate="indeterminate"
            @click.stop="handleSelectAllClick"
          >
            全选
          </el-checkbox>
        </el-option>

        <el-option
          v-for="item in filterOptions"
          :key="item[valueKey || 'value']"
          :value="objectValue ? item : item[valueKey || 'value']"
          :label="item[labelKey || 'label']"
          :disabled="getOptionItemDisabled(item)"
        >
          <div class="option-content" v-html="optionItemLabelRender(item)" />
        </el-option>

        <template v-if="$slots.header" #header>
          <slot name="header" />
        </template>

        <template v-if="$slots.footer" #footer>
          <slot name="footer" />
        </template>

        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </el-select>
    </el-tooltip>
    
    <el-select
      v-else
      ref="selectRef"
      v-model="innerValue"
      :class="ns.b()"
      :placeholder="placeholder"
      :clearable="allowClear"
      :filterable="allowSearch"
      :loading="loading || optionsLoading"
      :multiple="multiple"
      :collapse-tags="shouldCalculateMaxTag !== false && multiple"
      :max-collapse-tags="maxTagCount"
      :filter-method="handleSearch"
      :disabled="disabled"
      :size="size"
      :popper-append-to-body="false"
      :teleported="true"
      @change="handleChange"
      @blur="handleBlur"
      @visible-change="handlePopupVisibleChange"
      @remove-tag="handleRemoveTag"
      @clear="handleClear"
    >
      <el-option
        v-if="hasAllSelect && multiple"
        :value="'__ALL_SELECT__'"
        :label="'全选'"
        :disabled="true"
        class="all-select-option"
      >
        <el-checkbox
          :model-value="isSelectAll"
          :indeterminate="indeterminate"
          @click.stop="handleSelectAllClick"
        >
          全选
        </el-checkbox>
      </el-option>

      <el-option
        v-for="item in filterOptions"
        :key="item[valueKey || 'value']"
        :value="objectValue ? item : item[valueKey || 'value']"
        :label="item[labelKey || 'label']"
        :disabled="getOptionItemDisabled(item)"
      >
        <div class="option-content" v-html="optionItemLabelRender(item)" />
      </el-option>

      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>

      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>

      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
    </el-select>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { ElCheckbox, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { useNamespace } from '@zxui/hooks'
import { zxSelectProps } from './select'

export default defineComponent({
  name: 'ZxSelect',
  components: {
    ElSelect: ElSelect as any,
    ElOption: ElOption as any,
    ElTooltip: ElTooltip as any,
    ElCheckbox: ElCheckbox as any,
  },
  inheritAttrs: false,
  props: zxSelectProps,
  emits: [
    'update:modelValue',
    'remoteSearch',
    'visible-change',
    'update:loading',
    'remove',
    'change',
    'changeObject', // @deprecated use 'select' instead
    'select',
    'blur',
  ],
  setup(props, { emit }) {
    const ns = useNamespace('select')

    const selectRef = ref()
    const innerValue = ref<any>(props.modelValue)
    const inputValue = ref('')
    const tempInputValue = ref('')
    const filterOptions = ref<any[]>([])
    const remoteOriginOptions = ref<any[]>([])
    const loading = ref(!!props.loading)
    const isArcoFirstSearch = ref(true)
    const popupVisible = ref(false)
    const maxTagCount = ref(3)
    const optionsLoading = ref(false)

    watch(
      () => props.modelValue,
      (val) => {
        innerValue.value = val
      },
      { immediate: true }
    )
    watch(
      () => props.loading,
      (val) => {
        loading.value = !!val
      }
    )
    watch(
      () => loading.value,
      (val) => {
        emit('update:loading', val)
      }
    )

    const indeterminate = computed(() => {
      if (props.multiple && Array.isArray(innerValue.value)) {
        return (
          innerValue.value.length > 0 &&
          innerValue.value.length < filterOptions.value.length
        )
      }
      return false
    })

    const isSelectAll = computed(() => {
      if (props.multiple && Array.isArray(innerValue.value)) {
        return innerValue.value.length === filterOptions.value.length
      }
      return false
    })

    const allowClear = computed(() => {
      if (props.atLeastOne && Array.isArray(innerValue.value)) {
        return innerValue.value.length > 1 && props.allowClear
      }
      return props.allowClear
    })

    async function handleSearch(val = '', manual = false) {
      if (isArcoFirstSearch.value && !manual) {
        isArcoFirstSearch.value = false
        return
      }
      isArcoFirstSearch.value = false
      try {
        loading.value = true
        if (props.mode === 'remote' && typeof props.remoteFunc === 'function') {
          const result = await props.remoteFunc({
            ...props.remoteExtraParams,
            keyword: val,
          })
          remoteOriginOptions.value = result.map((e: any) => {
            const item = { ...e }
            if (props.remoteFieldsMap) {
              const map = props.remoteFieldsMap as any
              Object.keys(map).forEach((key) => {
                item[key] = e[map[key]]
              })
            }
            return item
          })
          if (
            props.remoteFilterFunc &&
            typeof props.remoteFilterFunc === 'function'
          ) {
            remoteOriginOptions.value = props.remoteFilterFunc(
              remoteOriginOptions.value
            )
          }
          emit('remoteSearch', remoteOriginOptions.value)
        }

        if (val.trim() === '') {
          filterOptions.value = remoteOriginOptions.value.map((e: any) => ({
            ...e,
          }))
          return
        }

        const highlightedKeyword = `<span class="highlight-keyword">${val}</span>`
        filterOptions.value = remoteOriginOptions.value
          .map((e: any) => {
            const item = { ...e }
            let hasMatch = false
            if (props.searchKeys) {
              for (let i = 0; i < props.searchKeys.length; i++) {
                const key = (props.searchKeys as string[])[i]
                if (e[key]?.toLowerCase().includes(val.toLowerCase())) {
                  hasMatch = true
                  item[key] = e[key].replace(
                    new RegExp(
                      val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                      'gi'
                    ),
                    highlightedKeyword
                  )
                }
              }
            }
            if (hasMatch)
              return {
                ...item,
              }
            return null
          })
          .filter((e: any) => e)
      } catch (error) {
        console.error('搜索出错:', error)
      } finally {
        loading.value = false
      }
    }

    function optionItemLabelRender(item: any) {
      return typeof props.optionLabelRender === 'function'
        ? props.optionLabelRender(item)
        : item[props.labelKey || 'label']
    }

    function handleSelectAllChange(val: any) {
      if (val) {
        innerValue.value = props.objectValue
          ? [...filterOptions.value]
          : filterOptions.value.map((e: any) => e[props.valueKey || 'value'])
      } else {
        innerValue.value = []
      }
      emit('update:modelValue', innerValue.value)
      emit('change', innerValue.value)
    }

    function handleSelectAllClick() {
      handleSelectAllChange(!isSelectAll.value)
    }

    watch(
      () => props.options,
      async () => {
        if (props.mode !== 'remote') {
          await handleOptionsPromise()
          handleSearch('', true)
          if (props.defaultAllSelect) handleSelectAllChange(true)
        }
      }
    )

    function getOptionItemDisabled(item: any) {
      return (
        !!item.disabled ||
        (!!props.multiple &&
          !!props.atLeastOne &&
          Array.isArray(innerValue.value) &&
          !!innerValue.value.some((e: any) =>
            props.objectValue
              ? e[props.valueKey || 'value'] === item[props.valueKey || 'value']
              : e === item[props.valueKey || 'value']
          ) &&
          innerValue.value.length === 1)
      )
    }

    function handleChange(value: any) {
      if (props.multiple) {
        nextTick(() => {
          inputValue.value = tempInputValue.value
        })
      }
      emit('update:modelValue', value)
      emit('change', value)
      
      // 获取选中的实体对象
      let selectedEntity: any = null
      if (props.multiple && Array.isArray(value)) {
        // 多选：返回对象数组
        selectedEntity = value.map((val: any) => {
          if (props.objectValue) {
            return val
          }
          return remoteOriginOptions.value.find(
            (e: any) => e[props.valueKey || 'value'] === val
          )
        }).filter(Boolean)
      } else {
        // 单选：返回单个对象
        if (props.objectValue) {
          selectedEntity = value
        } else {
          selectedEntity = remoteOriginOptions.value.find(
            (e: any) => e[props.valueKey || 'value'] === value
          )
        }
      }
      
      // 新的 select 事件：语义更清晰
      emit('select', selectedEntity)
      // 保留旧的 changeObject 事件以向后兼容（仅单选时触发）
      if (!props.multiple) {
        emit('changeObject', selectedEntity)
      }
    }

    function handlePopupVisibleChange(val: boolean) {
      popupVisible.value = val
      if (val) handleSearch('', true)
      else {
        inputValue.value = ''
        tempInputValue.value = ''
      }
      emit('visible-change', val)
    }

    function handleRemoveTag(val: any) {
      emit('remove', val)
    }
    function handleClear() {
      innerValue.value = props.multiple ? [] : ''
      emit('update:modelValue', innerValue.value)
    }

    function handleBlur() {
      emit('blur')
    }

    async function handleOptionsPromise() {
      if (props.options instanceof Promise) {
        try {
          optionsLoading.value = true
          const result = await props.options
          const processedData = props.transform(result)
          remoteOriginOptions.value = Array.isArray(processedData)
            ? processedData
            : []
          filterOptions.value = remoteOriginOptions.value.map((e: any) => ({
            ...e,
          }))
        } catch (error) {
          console.error('处理options Promise出错:', error)
          remoteOriginOptions.value = []
          filterOptions.value = []
        } finally {
          optionsLoading.value = false
        }
      } else if (Array.isArray(props.options)) {
        const processedData = props.transform(props.options)
        remoteOriginOptions.value = [...processedData]
        filterOptions.value = remoteOriginOptions.value.map((e: any) => ({
          ...e,
        }))
      }
    }

    onBeforeMount(async () => {
      await handleOptionsPromise()
      if (props.mode === 'remote' && props.notAutoInitSearch === true) {
        // Skip auto init search for remote mode
      } else if (props.mode !== 'remote') {
        handleSearch('', true)
      }
    })
    onMounted(() => {
      if (props.defaultAllSelect) handleSelectAllChange(true)
    })

    watchEffect(() => {
      if (props.hasAllSelect && selectRef.value) {
        const selectEl = selectRef.value.$el
        if (selectEl && isSelectAll.value) {
          // Handle select all state if needed
        }
      }
    })

    return {
      ns,
      selectRef,
      innerValue,
      filterOptions,
      optionsLoading,
      indeterminate,
      isSelectAll,
      allowClear,
      maxTagCount,
      handleSearch,
      optionItemLabelRender,
      handleSelectAllChange,
      handleSelectAllClick,
      getOptionItemDisabled,
      handleChange,
      handlePopupVisibleChange,
      handleRemoveTag,
      handleClear,
      handleBlur,
    }
  },
})
</script>
