<template>
  <div class="flex flex-wrap items-center">
    <div class="mr-[8px]">{{ props.content }}</div>
    <ZxButton v-if="props.showDetail" @click="goDetail">{{ t('ms.upload.detail') }}</ZxButton>
  </div>
</template>

<script setup>
import ZxButton from '../ZxButton/index.vue'

// 简化的国际化函数
const useI18n = () => {
  const t = (key) => {
    const translations = {
      'ms.upload.detail': '查看详情'
    }
    return translations[key] || key
  }
  return { t }
}

const props = withDefaults(
  defineProps({
    mode: {
      type: String,
      default: 'message'
    },
    content: {
      type: String,
      required: true
    },
    showDetail: {
      type: Boolean,
      default: true
    }
  }),
  {
    mode: 'message',
    showDetail: true
  }
)
const emit = defineEmits(['goDetail'])
const { t } = useI18n()

function goDetail() {
  emit('goDetail')
}
</script>
