<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadSystemData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="system-grid zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleCreate">新建指标体系</ZxButton>
          </div>
          <div class="zx-grid-form-bar__filters">
            <CategorySelector
              v-model="query.categoryId"
              placeholder="选择体系分类"
              style="width: 150px"
              @change="(v) => onFilterChange('categoryId', v, { refresh, updateState })"
            />
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索体系名称"
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
          <el-table-column prop="categoryName" label="体系分类" width="150" />
          <el-table-column prop="name" label="体系名称" min-width="200" />
          <el-table-column
            prop="description"
            label="体系说明"
            min-width="300"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column
            label="操作"
            width="240"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleEditIndicator(row)">编辑指标</ZxButton>
                <ZxButton link type="primary" @click="handleEdit(row)">编辑配置</ZxButton>
                <ZxMoreAction
                  :list="getMoreActionList(row)"
                  @select="handleMoreActionSelect($event, row, refresh)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 指标体系表单弹窗 -->
    <SystemFormDialog ref="systemFormDialogRef" @success="handleFormSuccess" />
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '@/components/ContentWrap'
import { systemApi } from '@/api/modules/indicator/system'
import { CategorySelector } from '../components/selector'
import { confirmInputDanger } from 'zxui'
import SystemFormDialog from './components/SystemFormDialog.vue'
import { ElMessage } from 'element-plus'
import { Delete, Setting, Edit } from '@element-plus/icons-vue'

const router = useRouter()

// 组件引用
const gridListRef = ref(null)
const systemFormDialogRef = ref()

// 数据加载函数 - 适配 ZxGridList
const loadSystemData = async (params) => {
  try {
    const data = await systemApi.getSystemList(params)
    console.log('=== System API 返回数据 ===', data)
    return data
  } catch (error) {
    console.error('=== loadSystemData 错误 ===', error)
    throw error
  }
}

const onFilterChange = (field, value, { refresh, updateState }) => {
  console.log('=== onFilterChange 触发 ===')
  console.log(`筛选字段: ${field}, 选择的值:`, value)
  // 页码重置到第一页
  updateState('pager.page', 1)

  // 使用 nextTick 确保状态更新后再刷新
  nextTick(() => {
    refresh()
  })
}

const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 新建 - 显示对话框
const handleCreate = () => {
  // 调用子组件的 open 方法，不传数据表示新增
  systemFormDialogRef.value?.open()
}

// 编辑指标 - 跳转到designEdit.vue页面
const handleEditIndicator = (row) => {
  // 跳转到designEdit.vue页面，可以携带体系ID等参数
  router.push({
    path: '/indicator/system-design-edit',
    query: {
      systemId: row.id,
      systemName: row.name
    }
  })
}

// 编辑配置 - 弹出对话框
const handleEdit = (row) => {
  // 调用子组件的 open 方法，传递数据表示编辑
  systemFormDialogRef.value?.open(row)
}

// 处理表单成功提交
const handleFormSuccess = (response) => {
  // 判断是创建还是编辑模式
  if (response && typeof response === 'object' && !response.id) {
    // 创建模式：跳转到创建页面
    router.push('/indicator/system-create')
  } else {
    // 编辑模式：刷新列表
    gridListRef.value?.refresh()
  }
}

// 获取更多操作列表
const getMoreActionList = (row) => {
  return [
    {
      label: '设为模版',
      eventTag: 'setTemplate',
      icon: Setting,
      danger: false
    },
    {
      isDivider: true
    },
    {
      label: '删除',
      eventTag: 'delete',
      icon: Delete,
      danger: true
    }
  ]
}

// 处理更多操作选择
const handleMoreActionSelect = async (item, row, refresh) => {
  switch (item.eventTag) {
    case 'setTemplate':
      handleSetAsTemplate(row, refresh)
      break
    case 'delete':
      handleDelete(row.id, refresh)
      break
    default:
      break
  }
}

// 设为模版
const handleSetAsTemplate = async (row, refresh) => {
  try {
    await systemApi.setAsTemplate(row.id)
    ElMessage.success(`"${row.name}"已设为模版`)
    refresh()
  } catch (error) {
    ElMessage.error(`设为模版失败: ${error.message || '未知错误'}`)
    console.error('设为模版失败:', error)
  }
}

// 删除体系
const handleDelete = async (systemId, refresh) => {
  try {
    await confirmInputDanger({
      targetName: '指标体系',
      targetType: '指标体系',
      keyword: '确认删除',
      dangerMessage: '您即将删除该指标体系',
      description: '此操作不可恢复,请输入"确认删除"以确认删除。',
      confirmAction: async () => {
        const result = await systemApi.deleteSystem(systemId)
        refresh()
      }
    })
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}
</script>

<style lang="scss" scoped></style>
