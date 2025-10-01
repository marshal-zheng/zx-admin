import { useGraphStore as usePiniaGraphStore } from '../stores/graphStore'
import { computed } from 'vue'

// 导出 Pinia store 的便捷封装
export function useGraphStore(selector) {
  const store = usePiniaGraphStore()

  if (!store) {
    throw new Error('useGraphStore can only be used inside the XFlow component.')
  }

  // 如果提供了选择器函数，返回计算属性
  if (selector && typeof selector === 'function') {
    return computed(() => selector(store))
  }

  // 否则返回整个 store
  return store
}
