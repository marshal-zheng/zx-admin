<template>
  <div class="color-card" :style="{ backgroundColor: color }">
    <div class="card-content">
      <h3>{{ title || `${color}卡片` }}</h3>
      <p>{{ content || `这是一个${color}色的示例卡片` }}</p>
      <div class="card-stats">
        <span>数值: {{ value || Math.floor(Math.random() * 1000) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#409eff'
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  value: {
    type: [Number, String],
    default: null
  }
})

// 根据颜色名称映射到实际颜色值
const colorMap = {
  red: '#f56c6c',
  orange: '#e6a23c',
  green: '#67c23a',
  blue: '#409eff',
  purple: '#909399'
}

const color = computed(() => {
  return colorMap[props.color] || props.color
})
</script>

<style scoped>
.color-card {
  display: flex;
  height: 100%;
  padding: 20px;
  color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  transition: transform 0.2s;
  flex-direction: column;
  justify-content: center;
}

.color-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 15%);
}

.card-content {
  text-align: center;
}

.card-content h3 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: bold;
}

.card-content p {
  margin: 0 0 15px;
  font-size: 14px;
  opacity: 0.9;
}

.card-stats {
  font-size: 16px;
  font-weight: 600;
}
</style>
