import { inject, provide, ref } from 'vue'

const GRAPH_INSTANCE_KEY = Symbol('graphInstance')

// 提供 Graph 实例
export function provideGraphInstance() {
  const graph = ref(null)

  provide(GRAPH_INSTANCE_KEY, {
    graph,
    setGraph: (instance) => {
      graph.value = instance
    }
  })

  return {
    graph,
    setGraph: (instance) => {
      graph.value = instance
    }
  }
}

// 使用 Graph 实例
export function useGraphInstance() {
  // 传入默认值以避免 Vue 在注入缺失时输出控制台告警
  const context = inject(GRAPH_INSTANCE_KEY, null)

  if (!context) {
    throw new Error('useGraphInstance must be used within XFlow component')
  }

  return context.graph
}
