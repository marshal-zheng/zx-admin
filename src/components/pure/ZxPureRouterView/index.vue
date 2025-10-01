<template>
  <router-view />
</template>

<script setup>
// Vue 3 Composition API 写法
// 静态属性可以通过组件实例访问
defineOptions({
  name: 'PureRouterView',
  isPureView: true
})
</script>
