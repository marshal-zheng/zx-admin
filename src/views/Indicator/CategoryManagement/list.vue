<template>
  <ContentWrap>
    <ZxGridList
      :load-data="loadCategoryData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="category-grid"
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
import ZxGridList from '@/components/pure/ZxGridList/index.vue'
import CategoryFormDialog from './components/CategoryFormDialog.vue'
import { ZxSearch, ZxButton } from '@/components/pure'
import { danger as confirmInputDanger } from '@/components/pure/ZxConfirmInput/service'

const router = useRouter()

// 响应式数据
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

// 获取当前实例
const instance = getCurrentInstance()
const { proxy } = instance || {}

// 删除分类
const handleDelete = async (row, refresh) => {
  try {
    if (proxy?.$confirmInput) {
      await proxy.$confirmInput.danger({
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
    } else {
      await confirmInputDanger({
        targetName: row.name,
        targetType: '分类',
        keyword: row.name,
        dangerMessage: `您即将删除分类"${row.name}"`,
        description: '此操作不可恢复，请输入分类名称以确认删除。',
        confirmAction: async () => {
          return categoryApi.deleteCategory(row.id).then(() => {
            refresh()
          })
        }
      })
    }
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}

// 表单成功回调
const handleFormSuccess = () => {
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped></style>
