<template>
  <el-space>
    <el-dropdown trigger="click" @command="(key) => onLayoutDirectionChange(key)">
      <el-button type="primary" size="small"> 布局 {{ layoutLabel }} </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="TB">竖向布局</el-dropdown-item>
          <el-dropdown-item command="LR">横向布局</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button type="success" size="small" @click="onSave">
      <el-icon><Document /></el-icon>
      保存
    </el-button>
  </el-space>
</template>

<script setup>
import { ref } from 'vue'
import { useOptionalGraphInstance } from '../../ZxFlow/composables/useGraphInstance'
import { useGraphStore } from '../../ZxFlow/composables/useGraphStore'
import { useKeyboard } from '../../ZxFlow/composables/useKeyboard'
import { Document } from '@element-plus/icons-vue'
import { dagreLayout } from '../utils/layout.js'
import { refreshCollapseState } from '../utils/collapse.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['layout-change', 'save'])

const graph = useOptionalGraphInstance()
const graphStore = useGraphStore()

const layoutDir = ref('LR')
const layoutLabel = ref('横向')

const onDelete = (e) => {
  if (e && typeof e.preventDefault === 'function') e.preventDefault()
  const g = graph?.value
  if (!g) return
  const selectedNodes = g.getSelectedCells().filter((cell) => cell.isNode?.())
  if (selectedNodes.length) {
    graphStore.removeNodes(selectedNodes.map((cell) => cell.id))
  }
}

// 保留删除键盘快捷键
useKeyboard('backspace', onDelete)
useKeyboard('delete', onDelete)

// 清理节点数据，移除 originalData
const cleanNodeData = (nodeData) => {
  if (!nodeData) return nodeData
  const cleaned = { ...nodeData }
  if (cleaned.originalData) {
    delete cleaned.originalData
  }
  return cleaned
}

const onSave = () => {
  const g = graph?.value
  if (!g) {
    ElMessage.warning('图实例不存在')
    return
  }

  try {
    // 获取所有节点数据，格式与data.json保持一致
    const nodes = g.getNodes().map((node) => {
      const position = node.getPosition()
      const nodeData = cleanNodeData(node.getData()) || {}

      return {
        id: node.id,
        type: nodeData.type || 'leaf-node', // 从节点数据中获取type
        x: position.x,
        y: position.y,
        properties: nodeData.properties || {}
      }
    })

    // 获取所有边数据，格式与data.json保持一致
    const edges = g.getEdges().map((edge) => {
      const sourcePoint = edge.getSourcePoint()
      const targetPoint = edge.getTargetPoint()
      const edgeData = edge.getData() || {}

      return {
        id: edge.id,
        type: 'mindmap-edge', // 固定为mindmap-edge
        sourceNodeId: edge.getSourceCellId(),
        targetNodeId: edge.getTargetCellId(),
        startPoint: { x: sourcePoint.x, y: sourcePoint.y },
        endPoint: { x: targetPoint.x, y: targetPoint.y },
        properties: edgeData.properties || {},
        pointsList: edge.getVertices() || []
      }
    })

    // 构建完整的图数据，格式与data.json保持一致
    const graphData = {
      nodes,
      edges
    }

    // 打印图数据到控制台
    console.log('格式化后的完整图数据:', graphData)
    console.log(`包含 ${nodes.length} 个节点和 ${edges.length} 条边`)

    // 向外发出保存事件，传递图数据
    emit('save', graphData)

    ElMessage.success(`图数据已保存，包含 ${nodes.length} 个节点和 ${edges.length} 条边`)
  } catch (error) {
    console.error('保存图数据时出错:', error)
    ElMessage.error('保存图数据失败')
  }
}

const onLayoutDirectionChange = async (dir) => {
  const g = graph?.value
  if (!g) return
  layoutDir.value = dir
  layoutLabel.value = dir === 'TB' ? '竖向' : '横向'
  await dagreLayout(g, dir)
  refreshCollapseState(g)
  g.centerContent()
  // 通知父级更新 DnD 使用的布局方向
  emit('layout-change', dir)
}
</script>

<style scoped></style>
