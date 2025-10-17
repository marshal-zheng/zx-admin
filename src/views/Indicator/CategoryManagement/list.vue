<template>
  <ContentWrap>
    <ZxGridList
      ref="gridListRef"
      :load-data="loadCategoryData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="category-grid zx-grid-list--page"
    >
      <!-- 工具栏：左-操作 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <ZxButton type="primary" @click="handleCreate">新建指标分类</ZxButton>
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索分类名称"
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
          <el-table-column prop="clazzName" label="分类名称" min-width="200" />
          <el-table-column
            prop="clazzDescr"
            label="分类描述"
            min-width="300"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="id" label="编号" width="120" />
          <el-table-column
            label="操作"
            width="150"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleEdit(row)">编辑</ZxButton>
                <ZxButton link type="danger" @click="handleDelete(row, refresh)">删除</ZxButton>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 分类表单弹窗 -->
    <CategoryFormDialog
      v-model="dialogVisible"
      :category-data="currentCategory"
      :mode="dialogMode"
      @success="handleFormSuccess"
    />
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '@/components/ContentWrap'
import { categoryApi } from '@/api/modules/indicator/category'
import CategoryFormDialog from './components/CategoryFormDialog.vue'
import { confirmInputDanger } from 'zxui'

const router = useRouter()

// 响应式数据
const gridListRef = ref(null)
const dialogVisible = ref(false)
const currentCategory = ref(null)
const dialogMode = ref('create') // create | edit

// 数据加载函数 - 适配 ZxGridList
const loadCategoryData = async (params) => {
  const response = await categoryApi.getCategoryList(params)
  return response
}

const onSearch = ({ refresh, updateState }) => {
  updateState('pager.page', 1)
  refresh()
}

// 新建
const handleCreate = () => {
  currentCategory.value = null
  dialogMode.value = 'create'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  currentCategory.value = row
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (row, refresh) => {
  await confirmInputDanger({
    targetName: row.clazzName,
    targetType: '分类',
    keyword: row.clazzName,
    dangerMessage: `您即将删除分类"${row.clazzName}"`,
    description: '此操作不可恢复，请输入分类名称以确认删除。',
    confirmAction: async () => {
      return categoryApi.deleteCategory(row.id).then(() => {
        refresh()
      })
    }
  })
}

// 表单成功回调
const handleFormSuccess = () => {
  dialogVisible.value = false
  // 编辑或创建成功后刷新列表
  gridListRef.value?.refresh?.()
}
</script>

<style lang="scss" scoped></style>
