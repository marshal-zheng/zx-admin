<template>
  <TableList 
    :create-table-id="createTableId" 
    :table-name="tableName"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'
import TableList from '../components/TableList.vue'

// 路由相关
const route = useRoute()

import { computed, watch } from 'vue'

// 使用 computed 计算路由上的值，并同步到已有的 ref
const createTableId = computed(() => route.params?.id ?? '')
const tableName = computed(() => route.query?.tableName ?? '')

</script>
