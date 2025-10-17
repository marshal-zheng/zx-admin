<template>
  <TableQuery tableType="datasets" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import TableQuery from '../components/TableQuery.vue'
</script>
