<template>
  <div class="zx-button-wrapper">
    <TooltipOrPopover v-if="!isEmpty(tooltip)" v-bind="tooltip">
      <el-button v-bind="buttonAttrs" :loading="enableLoading && loading" @click="handleClick">
        <slot></slot>
      </el-button>
      <template v-slot:content>
        <slot name="tooltip-content"></slot>
      </template>
    </TooltipOrPopover>
    <el-button v-else v-bind="buttonAttrs" :loading="enableLoading && loading" @click="handleClick">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onUnmounted, toRefs } from 'vue'
import { ElButton } from 'element-plus'
import { debounce, throttle, omit, isEmpty } from 'lodash-es'
import TooltipOrPopover from '../ZxTooltipOrPopover/index.vue'

export default defineComponent({
  name: 'ZxButton',
  inheritAttrs: false,
  // ZxButton 基于 Element Plus 的 el-button，默认跟随系统主题
  // 支持通过 CSS 变量自定义样式：
  // --zx-button-border-radius: 自定义圆角
  // --zx-button-font-weight: 自定义字重
  // --zx-button-transition: 自定义过渡动画
  // --zx-button-box-shadow: 自定义悬停阴影效果
  components: {
    ElButton,
    TooltipOrPopover
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Object,
      default: () => ({})
    },
    debounce: {
      type: Number,
      default: 300
    },
    throttle: {
      type: Number,
      default: 300
    },
    enableLoading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, attrs }) {
    const { debounce: debounceDuration, throttle: throttleDuration, enableLoading } = toRefs(props)
    const loading = ref(props.modelValue)

    const executeClick = async () => {
      // Prevent re-entrance while already executing (avoids double triggers)
      if (enableLoading.value && loading.value) return
      loading.value = true
      emit('update:modelValue', true)
      emit('startLoading')
      try {
        if (typeof attrs.onClick === 'function') {
          await attrs.onClick()
        }
        emit('success')
      } catch (error) {
        console.error('Error during button click:', error)
        emit('error', error)
      } finally {
        loading.value = false
        emit('update:modelValue', false)
        emit('endLoading')
      }
    }

    // Build a single runner: prefer debounce, else throttle, else direct
    let runner = executeClick

    const rebuildRunner = () => {
      // Cancel existing scheduled runs if any
      if (runner && typeof runner.cancel === 'function') {
        runner.cancel()
      }

      if (debounceDuration.value && debounceDuration.value > 0) {
        // Debounce: fire immediately, suppress subsequent clicks during the window
        runner = debounce(executeClick, debounceDuration.value, { leading: true, trailing: false })
      } else if (throttleDuration.value && throttleDuration.value > 0) {
        // Throttle: single call on leading edge, no trailing
        runner = throttle(executeClick, throttleDuration.value, { leading: true, trailing: false })
      } else {
        runner = executeClick
      }
    }

    watch(
      [debounceDuration, throttleDuration],
      () => {
        rebuildRunner()
      },
      { immediate: true }
    )

    watch(
      () => props.modelValue,
      (newValue) => {
        loading.value = newValue
      }
    )

    onUnmounted(() => {
      if (runner && typeof runner.cancel === 'function') runner.cancel()
    })

    const buttonAttrs = {
      ...omit(attrs, ['onClick']),
      type: attrs.type || 'primary'
    }

    return {
      loading,
      handleClick: (...args) => runner(...args),
      buttonAttrs,
      isEmpty
    }
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
