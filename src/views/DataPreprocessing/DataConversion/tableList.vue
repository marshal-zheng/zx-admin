<template>
  <TableList 
    :create-table-id="createTableId" 
    :table-name="tableName"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import TableList from '../components/TableList.vue'
import { Icon } from '@/components/Icon'

// 路由相关
const route = useRoute()

import { computed, watch } from 'vue'

// 使用 computed 计算路由上的值，并同步到已有的 ref
const createTableId = computed(() => route.params?.id ?? '')
const tableName = computed(() => route.query?.tableName ?? '')

</script>
