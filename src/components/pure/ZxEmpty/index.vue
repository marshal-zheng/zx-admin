<template>
  <div class="zx-empty-wrapper" :class="{ simple: simple }">
    <el-empty :description="description" :image="image" :image-size="imageSize">
      <template v-if="$slots.image" #image>
        <slot name="image"></slot>
      </template>
      <template v-if="$slots.description" #description>
        <slot name="description"></slot>
      </template>
      <template v-if="$slots.default" #default>
        <slot></slot>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ZxEmpty'
})

const props = defineProps({
  // 描述文字
  description: {
    type: String,
    default: '暂无数据'
  },
  // 图片地址或内置图片类型
  image: {
    type: String,
    default: ''
  },
  // 图片尺寸
  imageSize: {
    type: [String, Number],
    default: undefined
  },
  // 是否显示简洁模式
  simple: {
    type: Boolean,
    default: false
  }
})

// 如果需要国际化支持，可以在这里添加
// const { t } = useI18n()
// const description = computed(() => props.description || t('common.noData'))
</script>

<style lang="scss">
// 引入组件样式
@import './index.scss';
</style>
