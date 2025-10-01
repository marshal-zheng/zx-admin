import { onMounted, onUnmounted } from 'vue'
import { useGraphInstance } from './useGraphInstance'
import { useLatest } from './useLatest'

export function useGraphEvent(eventName, callback) {
  const graph = useGraphInstance()
  const latestCallback = useLatest(callback)

  onMounted(() => {
    if (graph && graph.value) {
      graph.value.on(eventName, (...args) => {
        if (latestCallback && latestCallback.value) {
          latestCallback.value(...args)
        }
      })
    }
  })

  onUnmounted(() => {
    if (graph && graph.value) {
      graph.value.off(eventName)
    }
  })

  return {
    graph
  }
}
