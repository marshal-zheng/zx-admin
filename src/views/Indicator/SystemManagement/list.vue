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
      class="system-grid"
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
            width="220"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleEditIndicator(row)">编辑指标</ZxButton>
                <ZxButton link type="primary" @click="handleEdit(row)">编辑配置</ZxButton>
                <ZxButton link type="danger" @click="handleDelete(row, refresh)">删除</ZxButton>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 新建体系对话框 -->
    <SystemFormDialog v-model="createDialog.visible" mode="create" @success="handleCreateSuccess" />

    <!-- 编辑体系对话框 -->
    <SystemFormDialog
      v-model="editDialog.visible"
      mode="edit"
      :system-data="editingSystem"
      @success="handleEditSuccess"
    />
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '@/components/ContentWrap'
import { systemApi } from '@/api/modules/indicator/system'
import ZxGridList from '@/components/pure/ZxGridList/index.vue'
import { ZxSearch, ZxButton } from '@/components/pure'
import { CategorySelector } from '../components/selector'
import { danger as confirmInputDanger } from '@/components/pure/ZxConfirmInput/service'
import SystemFormDialog from './components/SystemFormDialog.vue'
import { ElMessage } from 'element-plus'
import useDialog from '@/hooks/comp/useDialog'

const router = useRouter()

// 对话框状态
const createDialog = useDialog()
const editDialog = useDialog()
const editingSystem = ref(null)

// 获取ZxGridList组件引用
const gridListRef = ref(null)

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
  createDialog.open()
}

// 处理对话框成功提交后的跳转
const handleCreateSuccess = (response) => {
  createDialog.close()
  // 跳转到创建页面，可以携带创建的体系ID或其他信息
  if (response && response.id) {
    router.push(`/indicator/system-create?systemId=${response.id}`)
  } else {
    router.push('/indicator/system-create')
  }
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
  editingSystem.value = { ...row } // 传入当前item数据的副本
  editDialog.open()
}

// 处理编辑对话框成功提交
const handleEditSuccess = () => {
  editDialog.close()
  editingSystem.value = null
  gridListRef.value.refresh() // 刷新列表
}

// 获取当前实例
const instance = getCurrentInstance()
const { proxy } = instance || {}

// 删除体系
const handleDelete = async (row, refresh) => {
  try {
    if (proxy?.$confirmInput) {
      await proxy.$confirmInput.danger({
        targetName: row.name,
        targetType: '体系',
        keyword: row.name,
        dangerMessage: `您即将删除体系"${row.name}"`,
        description: '此操作不可恢复，请输入体系名称以确认删除。',
        confirmAction: async () => {
          return systemApi.deleteSystem(row.id).then(() => {
            refresh()
          })
        }
      })
    } else {
      await confirmInputDanger({
        targetName: row.name,
        targetType: '体系',
        keyword: row.name,
        dangerMessage: `您即将删除体系"${row.name}"`,
        description: '此操作不可恢复，请输入体系名称以确认删除。',
        confirmAction: async () => {
          return systemApi.deleteSystem(row.id).then(() => {
            refresh()
          })
        }
      })
    }
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}
</script>

<style lang="scss" scoped></style>
