<template>
  <div class="operator-library">
    <!-- Header区域 -->
    <div class="library-header">
      <h3 class="header-title">{{ title }}</h3>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        :placeholder="searchPlaceholder"
        :prefix-icon="Search"
        clearable
        size="default"
        :disabled="loading"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-icon class="loading-icon is-loading"><Loading /></el-icon>
      <div class="loading-text">{{ textConfig.loadingText }}</div>
    </div>

    <!-- 算子列表 -->
    <div v-else class="operator-list">
      <div
        v-for="item in displayOperators"
        :key="item.key"
        class="operator-item"
        @mousedown.stop.prevent="(e) => handleMouseDown(e, item)"
      >
        <div class="operator-icon">
          <el-icon><Box /></el-icon>
        </div>
        <div class="operator-title">{{ item.title }}</div>
      </div>

      <!-- 搜索无结果状态 -->
      <div v-if="searchKeyword && displayOperators.length === 0" class="empty-state">
        <el-icon class="empty-icon"><Search /></el-icon>
        <div class="empty-text">{{ textConfig.emptySearchText }}</div>
        <div class="empty-desc">{{ textConfig.emptySearchDesc }}</div>
      </div>

      <!-- 无数据状态 -->
      <div v-if="!searchKeyword && displayOperators.length === 0" class="empty-state">
        <el-icon class="empty-icon"><Box /></el-icon>
        <div class="empty-text">{{ textConfig.emptyDataText }}</div>
        <div class="empty-desc">{{ textConfig.emptyDataDesc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import { Search, Box, Loading } from '@element-plus/icons-vue'
import { useDnd } from '../../ZxFlow/composables/useDnd'
import { DAG_NODE, registerDagShapes } from '../shapes/registerDagShapes'
import { useUserOperators } from '../composables/useUserOperators'
import { generateNodeId, generateContentId } from '../utils/nodeDataUtils'
import { getNodeSizeByLayout } from '../utils/nodeGeometry.js'

registerDagShapes()

// Props 定义
const props = defineProps({
  /**
   * 主图实例引用（可选），用于在图渲染后获取最新的 Graph
   */
  graphInstance: {
    type: [Object, Function],
    default: null
  },
  /**
   * 是否为只读模式（只读时禁用拖拽）
   */
  readonly: {
    type: Boolean,
    default: false
  },
  /**
   * 用户传入的简单数据列表
   * @type {Array<{name: string, value: string}>}
   */
  operators: {
    type: Array,
    default: () => []
  },
  /**
   * 是否显示加载状态
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * 搜索框占位符
   */
  searchPlaceholder: {
    type: String,
    default: '搜索算子、组件...'
  },
  /**
   * 库标题
   */
  title: {
    type: String,
    default: '算子库'
  },
  /**
   * 布局方向：vertical(竖向-上下连接桩) | horizontal(横向-左右连接桩)
   */
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['vertical', 'horizontal'].includes(value)
  },
  /**
   * 文案配置
   */
  textConfig: {
    type: Object,
    default: () => ({
      loadingText: '正在加载算子...',
      emptySearchText: '未找到相关算子',
      emptySearchDesc: '请尝试其他关键词',
      emptyDataText: '暂无算子数据',
      emptyDataDesc: '请传入算子数据'
    })
  }
})

const searchKeyword = ref('')
const idSeed = ref(0)
const graphInstanceRef = toRef(props, 'graphInstance')
const { startDrag } = useDnd(graphInstanceRef)

// 使用新的 composable 处理用户数据
const { processedOperators, categoryGroups, stats } = useUserOperators(
  computed(() => props.operators),
  computed(() => props.layout)
)

// 数据处理完成

const displayOperators = computed(() => {
  if (!searchKeyword.value) {
    return processedOperators.value
  }
  const lowerKeyword = searchKeyword.value.toLowerCase()
  return processedOperators.value.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      (item.shortDesc && item.shortDesc.toLowerCase().includes(lowerKeyword)) ||
      (item.originalData.value && item.originalData.value.toLowerCase().includes(lowerKeyword))
  )
})

const createNodeId = () => {
  return generateNodeId()
}

const handleMouseDown = (event, item) => {
  if (props.readonly) {
    return
  }
  const id = createNodeId()
  const layoutDirection = props.layout === 'vertical' ? 'vertical' : 'horizontal'
  const sizeConfig = getNodeSizeByLayout(layoutDirection)

  // 根据当前布局动态生成固定 ID 的四向连接桩（t/b/l/r），并按需隐藏
  const generatePorts = () => {
    const isHorizontal = layoutDirection === 'horizontal'
    const make = (pid, group, visible, role) => ({
      id: pid,
      group,
      attrs: {
        circle: {
          magnet: visible ? (role === 'output' ? true : 'passive') : false,
          style: { display: visible ? '' : 'none' }
        }
      }
    })
    return [
      make('t', 'top', !isHorizontal, 'input'),
      make('b', 'bottom', !isHorizontal, 'output'),
      make('l', 'left', isHorizontal, 'input'),
      make('r', 'right', isHorizontal, 'output')
    ]
  }

  startDrag(
    {
      id,
      shape: DAG_NODE,
      width: sizeConfig.width,
      height: sizeConfig.height,
      data: {
        // 新的数据结构
        type: 'leaf-node', // 新拖入的节点默认为叶子节点
        layoutDirection,
        collapsed: false,
        properties: {
          content: {
            id: generateContentId(),
            label: item.title
          },
          weight: 50,
          otherData: {}, // 空的计算模型数据
          parentNodeId: null, // 稍后会在连线时更新
          customType: '',
          customProperties: '',
          unit: '',
          priority: '',
          defaultValue: '',
          notes: '',
          level: 1 // 稍后会根据实际位置更新
        },
        // 兼容旧结构
        id,
        label: item.title,
        status: 'default',
        description: item.shortDesc || item.value,
        originalData: item.originalData || { name: item.title, value: item.shortDesc }
      },
      // 创建时确保只包含标准四向端口
      ports: generatePorts(),
      // 确保节点默认可拖拽和未锁定
      draggable: true,
      locked: false
    },
    event
  )
}
</script>

<style scoped lang="scss">
.operator-library {
  width: 100%;
  max-width: 320px;
  height: 100%;
  background: rgb(247, 248, 250);
  border: 1px solid #eee;
  // border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;

  .library-header {
    padding: 16px 20px 12px;
    background: rgb(247, 248, 250);
    border-bottom: 1px solid #eee;

    .header-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      letter-spacing: -0.025em;
    }
  }

  .search-section {
    padding: 10px;
    background: rgb(247, 248, 250);
    border-bottom: 1px solid #e2e8f0;

    :deep(.el-input) {
      .el-input__wrapper {
        // border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px 12px;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &.is-focus {
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      }

      .el-input__inner {
        font-size: 14px;
        height: 20px;
      }
    }
  }

  .operator-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px;
    // background: #ffffff;
    // border: 1px solid #e2e8f0;
    border-radius: 8px;
    // margin: 12px;
    box-sizing: border-box;

    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;

      &:hover {
        background: #9ca3af;
      }
    }
  }

  .operator-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    // border: 1px solid #e5e7eb;
    // border-radius: 6px;
    background: #ffffff;
    cursor: grab;
    user-select: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 6px;
    box-sizing: border-box;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 4px rgba(59, 130, 246, 0.08);
    }

    .operator-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      font-size: 14px;
      flex-shrink: 0;
    }

    .operator-title {
      flex: 1;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 12px;
      min-width: 0;
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;

    .loading-icon {
      font-size: 32px;
      color: #3b82f6;
      margin-bottom: 12px;

      &.is-loading {
        animation: rotate 2s linear infinite;
      }
    }

    .loading-text {
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;

    .empty-icon {
      font-size: 32px;
      color: #d1d5db;
      margin-bottom: 12px;
    }

    .empty-text {
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .empty-desc {
      font-size: 12px;
      color: #9ca3af;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
