<template>
  <el-collapse
    v-model="activeNames"
    class="zx-more-setting-collapse"
    :class="{ 'zx-more-setting-collapse--no-border': disableBorder }"
    :accordion="false"
  >
    <el-collapse-item name="moreSetting">
      <template #title>
        <ZxButton
          type="text"
          class="zx-more-setting-collapse__trigger"
          :style="{ padding: props.titlePadding }"
          @click.stop="toggleCollapse"
        >
          {{ title }}
        </ZxButton>
      </template>
      <div class="zx-more-setting-collapse__content" :style="{ padding: props.contentPadding }">
        <slot name="content"></slot>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ZxButton from '../ZxButton/index.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '更多设置'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  titlePadding: {
    type: String,
    default: ''
  },
  contentPadding: {
    type: String,
    default: ''
  },
  disableBorder: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close'])

const activeNames = ref([])

const isExpanded = computed(() => {
  return activeNames.value.includes('moreSetting')
})

// 同步 modelValue 与内部状态
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && !isExpanded.value) {
      activeNames.value = ['moreSetting']
    } else if (!newVal && isExpanded.value) {
      activeNames.value = []
    }
  },
  { immediate: true }
)

// 监听内部状态变化
watch(isExpanded, (newVal) => {
  emit('update:modelValue', newVal)
  emit('change', newVal)
  if (newVal) {
    emit('open')
  } else {
    emit('close')
  }
})

const toggleCollapse = () => {
  if (props.disabled) return

  if (isExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = ['moreSetting']
  }
}

const clearMoreSettingActive = () => {
  activeNames.value = []
}

defineExpose({
  clearMoreSettingActive,
  toggleCollapse
})
</script>

<style lang="scss">
@import './index.scss';
</style>
