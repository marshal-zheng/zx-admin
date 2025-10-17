<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadTableData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="20"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="table-query-grid zx-grid-list--page"
      :pageViewportOffset="tableType === 'datasets' ? 1 : 20"
    >
      <!-- 工具栏：左-操作 | 中-数据源信息 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState, grid }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton v-if="tableType === 'datasets'" type="primary" @click="handleCreateTable">
              录入数据
            </ZxButton>
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              :placeholder="getSearchPlaceholder()"
              :loading="loading"
              search-mode="click"
              @search="() => onSearch({ refresh, updateState })"
              @clear="() => onSearch({ refresh, updateState })"
            />
          </div>
        </div>
      </template>

      <!-- 表格内容 -->
      <template #table="{ grid, refresh }">
        <el-table :data="grid.list" style="width: 100%" max-height="calc(100vh - 230px)">
          <el-table-column
            prop="createTableName"
            label="表名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="tableComment"
            label="表注释"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column prop="createType" label="创建类型" width="120" align="center">
            <template #default="{ row }">
              <span v-if="row.createType === 1" class="text-blue-500">手动创建</span>
              <span v-else-if="row.createType === 2" class="text-green-500">导入创建</span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="handType" label="处理类型" width="120" align="center">
            <template #default="{ row }">
              <span v-if="row.handType === 1" class="text-orange-500">待处理</span>
              <span v-else-if="row.handType === 2" class="text-green-500">已处理</span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" show-overflow-tooltip />
          <el-table-column
            label="操作"
            :width="isConversionType ? '120' : '250'"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleViewData(row)">查看数据</ZxButton>
                <template v-if="!isConversionType">
                  <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                  <ZxMoreAction
                    :list="getMoreActionList(row)"
                    @select="handleMoreActionSelect($event, row, refresh)"
                  />
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 新增表抽屉 -->
    <CreateTableDrawer ref="createTableDrawerRef" @success="handleCreateSuccess" />
  </ContentWrap>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, h } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import CreateTableDrawer from './CreateTableDrawer.vue'
import { confirmInputDanger } from 'zxui'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'
import { Delete, View } from '@element-plus/icons-vue'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 定义 Props
const props = defineProps({
  // 自定义数据加载函数
  loadData: {
    type: Function,
    default: null
  },
  // 是否显示创建按钮
  showCreateButton: {
    type: Boolean,
    default: true
  },
  // 表格类型，用于区分不同场景
  tableType: {
    type: String,
    default: ''
  },
  // 来源标识，用于区分路由跳转
  source: {
    type: String,
    default: 'data-entry' // 默认数据录入
  }
})

// 定义 Emits
const emit = defineEmits(['create-success'])

// 路由相关
const router = useRouter()

// 响应式数据
const gridListRef = ref()
const createTableDrawerRef = ref()

// 计算属性：判断是否为转换类型（转换前或转换后）
const isConversionType = computed(() => {
  return props.tableType === 'before-conversion' || props.tableType === 'after-conversion'
})

// 数据加载函数 - 适配 ZxGridList
const loadTableData = async (params) => {
  // 如果传入了自定义加载函数，优先使用
  if (props.loadData && typeof props.loadData === 'function') {
    return await props.loadData(params)
  }

  // 根据表格类型添加不同的筛选条件
  const queryParams = { ...params }
  if (props.tableType === 'before-conversion') {
    queryParams.handType = 2
  } else if (props.tableType === 'after-conversion') {
    queryParams.handType = 3
  }

  // 使用默认的数据加载
  const response = await datasetsApi.getDatasetList(queryParams)
  return response
}

// 根据表格类型获取搜索框占位符
const getSearchPlaceholder = () => {
  switch (props.tableType) {
    case 'before-conversion':
      return '搜索转换前表名'
    case 'after-conversion':
      return '搜索转换后表名'
    default:
      return '搜索表名'
  }
}

// 搜索处理
const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

const handleViewData = (row) => {
  // 根据来源区分跳转到不同的表数据查看页面
  let routeName = 'DataEntryTableData' // 默认数据录入页面

  if (props.source === 'data-conversion') {
    routeName = 'DataConversionTableList' // 数据转换页面
  }

  router.push({
    name: routeName,
    params: {
      id: row.createTableId
    },
    query: {
      tableName: row.createTableName
    }
  })
}

const handleImportToLocal = async (row) => {
  try {
    const params = {
      createTableId: row.createTableId,
      tableName: row.createTableName
    }

    console.log('=== 导入本地数据库 ===', params)

    await datasetsApi.migrationToLocalHost(params)

    const messageInstance = ElMessage.success({
      message: h('span', [
        `表 "${row.createTableName}" 已成功导入到数据集，`,
        h(
          'a',
          {
            style: { color: 'var(--el-color-primary)', cursor: 'pointer' },
            onClick: () => {
              messageInstance.close()
              router.push({ name: 'DataEntry' })
            }
          },
          '点击查看'
        )
      ]),
      duration: 5000
    })
  } catch (error) {
    ElMessage.error(`导入表 "${row.createTableName}" 失败: ${error.message || '未知错误'}`)
  }
}

const handleDelete = async (row, handleRefresh) => {
  try {
    await confirmInputDanger({
      targetName: '数据集',
      targetType: '数据集',
      keyword: '确认删除',
      dangerMessage: `您即将删除数据集"${row.createTableName}"`,
      description: '此操作不可恢复,请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await datasetsApi.deleteDataset(row.createTableId)
        handleRefresh()
      }
    })
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}

const handleCreateTable = () => {
  createTableDrawerRef.value?.open()
}

const handleEdit = (row) => {
  // 调用编辑组件，传递 createTableId
  createTableDrawerRef.value?.open(row.createTableId)
}

const getMoreActionList = (row) => {
  return [
    {
      label: '删除',
      eventTag: 'delete',
      icon: Delete,
      danger: true
    }
  ]
}

const handleMoreActionSelect = async (action, row, handleRefresh) => {
  switch (action.eventTag) {
    case 'delete':
      await handleDelete(row, handleRefresh)
      break
    default:
      break
  }
}

const handleCreateSuccess = () => {
  // 刷新表格数据
  gridListRef.value?.refresh()
  // 向父组件发送创建成功事件
  emit('create-success')
}
</script>

<style lang="scss" scoped>
.data-source-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .info-text {
    color: var(--el-text-color-regular);
    font-size: 14px;
  }

  .table-count {
    color: var(--el-text-color-regular);
    font-size: 14px;
    margin-left: 8px;
  }
}

.table-type-indicator {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
</style>
