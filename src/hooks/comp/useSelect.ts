import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { calculateMaxDepth } from '@/utils'

interface SelectConfig {
  selectRef: any
  selectVal: any
  isCascade?: boolean
  panelWidth?: number
  options?: any[]
  valueKey?: string
  labelKey?: string
}

interface SelectProps {
  options?: any[]
}

/**
 * 计算 Select 组件的单行展示的最大标签数量
 * @param {Object} config - 配置对象
 * @param {Object} config.selectRef - 选择器 ref 对象
 * @param {Object} config.selectVal - 选择器的 v-model
 * @param {boolean} config.isCascade - 是否级联选择器
 * @param {number} config.panelWidth - 级联选择器的下拉面板宽度
 * @param {Array} config.options - 选择器的选项
 * @param {string} config.valueKey - 选项的 value 字段名，默认为 value
 * @param {string} config.labelKey - 选项的 label 字段名，默认为 label
 * @param {Object} props - 组件 props
 * @param {Array} props.options - 选项数据
 */
export default function useSelect(config: SelectConfig, props: SelectProps) {
  const maxTagCount = ref(0)
  const selectWidth = ref(0)
  const selectViewInner = ref<HTMLElement | null>(null) // 输入框内容容器 DOM
  const singleTagMaxWidth = ref(0) // 单个标签的最大宽度，当只显示得下一个标签时，有可能出现标签+额外宽度超出选择框的情况导致选择框换行撑高了
  const cascadeDeep = ref(0) // 级联选择器的深度

  /**
   * 计算最大标签数量
   * Element Plus Select 组件的标签计算逻辑
   */
  function calculateMaxTag() {
    nextTick(() => {
      if (config.selectRef.value && selectViewInner.value) {
        const innerViewWidth = selectViewInner.value?.getBoundingClientRect().width
        let remainingWidth = innerViewWidth - 60 // 60px 是"+N"的标签宽度+聚焦输入框的宽度
        const tagElements = selectViewInner.value.querySelectorAll('.el-tag')

        // 如果已经计算过且当前选中项数量没有增加，则不重新计算
        if (maxTagCount.value >= 1 && maxTagCount.value < config.selectVal.value?.length) {
          return
        }

        let visibleTagCount = 0
        for (let i = 0; i < tagElements.length; i++) {
          const tagElement = tagElements[i] as HTMLElement
          const tagWidth = tagElement.offsetWidth + 6 // 6px 是标签的边距

          if (remainingWidth >= tagWidth + 30) {
            // 30px 是搜索框最小宽度
            remainingWidth -= tagWidth
            visibleTagCount++
          } else {
            break
          }
        }

        maxTagCount.value = Math.max(1, visibleTagCount)
      }
    })
  }

  function updateTriggerWidth() {
    const selectInput = config.selectRef.value?.$el
    if (selectInput) {
      selectWidth.value = selectInput.offsetWidth // 设置成输入框的宽度
    }
  }

  const getOptionComputedStyle = computed(() => {
    if (config.isCascade && selectWidth.value > 0) {
      // 减去 80px 是为了防止溢出，因为会出现单选框、右侧箭头
      return {
        width:
          cascadeDeep.value <= 2
            ? `${selectWidth.value / cascadeDeep.value - 80 - cascadeDeep.value * 4}px`
            : `${config.panelWidth || 150}px`
      }
    }
    // 减去 60px 是为了防止溢出，因为有复选框、边距等
    return {
      width: `${selectWidth.value - 60}px`
    }
  })

  watch(
    () => props?.options,
    (arr) => {
      if (config.isCascade && arr && arr.length > 0) {
        // 级联选择器的选项发生变化时，重新计算最大深度
        cascadeDeep.value = calculateMaxDepth(arr)
      }
    },
    {
      immediate: true,
      deep: true
    }
  )

  onMounted(() => {
    if (config.selectRef.value) {
      // Element Plus Select 组件的标签容器选择器
      const selectEl = config.selectRef.value.$el
      selectViewInner.value =
        selectEl.querySelector('.el-select__tags') || selectEl.querySelector('.el-select__wrapper')
    }
  })

  onBeforeUnmount(() => {
    selectViewInner.value = null // 释放 DOM 引用
  })

  return {
    maxTagCount,
    singleTagMaxWidth,
    getOptionComputedStyle, // 获取选择器选项的样式
    updateTriggerWidth,
    calculateMaxTag // 在需要的时机调用此函数以计算最大标签数量，一般在 select 的 change 事件中调用
  }
}
