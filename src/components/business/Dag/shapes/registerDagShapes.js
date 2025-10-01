import { Graph, Path } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import DagNode from './DagNode.vue'
import { PORT_GROUPS } from '../constants/portConfig.js'

export const DAG_NODE = 'dag-node'
export const DAG_EDGE = 'dag-edge'
export const DAG_CONNECTOR = 'dag-connector'

let registered = false

export const registerDagShapes = () => {
  if (registered) {
    return
  }

  register({
    shape: DAG_NODE,
    width: 180,
    height: 36,
    component: DagNode,
    effect: ['data'],
    attrs: {
      body: {
        width: 180,
        height: 36
      }
    },
    ports: {
      groups: PORT_GROUPS
    }
  })

  Graph.registerConnector(
    DAG_CONNECTOR,
    (s, e) => {
      const offset = 15 // 进一步增加偏移量，让线条更高
      const deltaY = Math.abs(e.y - s.y)
      const deltaX = Math.abs(e.x - s.x)

      // 根据距离动态调整控制点，让线条更自然
      const minControl = 30 // 增加最小控制距离，让弧度更大
      const control = Math.max(minControl, Math.floor(Math.max(deltaY, deltaX) / 1.5)) // 减少除数，增加弧度

      const v1 = { x: s.x, y: s.y + offset + control }
      const v2 = { x: e.x, y: e.y - offset - control }

      return Path.normalize(
        `M ${s.x} ${s.y}
         L ${s.x} ${s.y + offset}
         C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
         L ${e.x} ${e.y}`
      )
    },
    true
  )

  Graph.registerEdge(
    DAG_EDGE,
    {
      inherit: 'edge',
      attrs: {
        line: {
          stroke: '#C2C8D5',
          strokeWidth: 4,
          targetMarker: null
        }
      },
      // 默认走直角路由与圆角连接器，兼容四向布局
      router: 'manhattan',
      connector: 'rounded',
      zIndex: -1
    },
    true
  )

  registered = true
}
