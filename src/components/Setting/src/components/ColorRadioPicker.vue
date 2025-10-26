<script setup lang="ts">
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('color-radio-picker')

const props = defineProps({
  schema: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleColorSelect = (item: string) => {
  emit('update:modelValue', item)
  emit('change', item)
}
</script>

<template>
  <div :class="prefixCls" class="flex flex-wrap space-x-14px">
    <span
      v-for="(item, i) in schema"
      :key="`radio-${i}`"
      class="w-20px h-20px cursor-pointer rounded-2px border-solid border-gray-300 border-2px text-center leading-20px mb-5px"
      :class="{ 'is-active': modelValue === item }"
      :style="{
        background: item
      }"
      @click="handleColorSelect(item)"
    >
      <Icon v-if="modelValue === item" color="#fff" icon="vi-ep:check" :size="16" />
    </span>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-color-radio-picker';

.@{prefix-cls} {
  .is-active {
    border-color: var(--el-color-primary);
  }
}
</style>
