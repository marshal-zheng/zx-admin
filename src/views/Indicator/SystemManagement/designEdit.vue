<template>
  <Design :id="id" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Design from '../components/Design.vue'

const route = useRoute()

// 从路由参数中获取 id
const id = computed(() => {
  return route.query?.systemId
})
</script>
<style scoped></style>
