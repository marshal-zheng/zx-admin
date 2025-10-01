import { ref, onMounted, watch } from 'vue'
import { Dnd } from '@antv/x6-plugin-dnd'
import { useGraphInstance } from './useGraphInstance'

export function useDnd(arg1 = null, arg2 = {}) {
  let graph
  let options

  const isGraphLike = (g) => {
    if (!g) return false
    if (typeof g === 'function') {
      try {
        const val = g()
        return !!(val && typeof val.createNode === 'function')
      } catch {
        return false
      }
    }
    const v = g.value ?? g
    return !!(v && typeof v.createNode === 'function')
  }

  if (isGraphLike(arg1)) {
    graph = arg1
    options = arg2 || {}
  } else {
    options = arg1 || {}
    try {
      graph = useGraphInstance()
    } catch (e) {
      graph = null
    }
  }

  const dndRef = ref(null)

  const getGraph = () => {
    if (!graph) return null
    if (typeof graph === 'function') {
      try {
        return graph()
      } catch {
        return null
      }
    }
    return graph?.value ?? graph
  }

  const ensureInit = () => {
    const g = getGraph()
    if (g && !dndRef.value) {
      console.log('Initializing DnD with graph:', g)
      dndRef.value = new Dnd({
        target: g,
        scaled: false,
        animation: false,
        validateNode() {
          return true
        },
        getDragNode: (node) => node.clone(),
        getDropNode: (node) => node.clone(),
        ...options
      })
      console.log('DnD initialized:', dndRef.value)
    }
  }

  onMounted(() => {
    ensureInit()
  })

  // 惰性监听 graph 的可用性
  if (graph && typeof watch === 'function' && graph.value !== undefined) {
    watch(
      () => graph?.value,
      () => ensureInit(),
      { immediate: true }
    )
  }

  const startDrag = (nodeOptions, event) => {
    const g = getGraph()
    console.log('startDrag called:', { graph: g, options: nodeOptions, event })
    if (!g) {
      console.error('No graph available for DnD')
      return
    }
    if (!dndRef.value) {
      console.log('DnD not initialized, initializing now...')
      ensureInit()
    }
    if (!dndRef.value) {
      console.error('Failed to initialize DnD')
      return
    }

    try {
      const node = g.createNode(nodeOptions)
      console.log('Created node for drag:', node)
      dndRef.value.start(node, event)
      console.log('DnD started successfully')
    } catch (error) {
      console.error('Error in startDrag:', error)
    }
  }

  return {
    startDrag
  }
}
