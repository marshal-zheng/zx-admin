<template>
  <ContentWrap>
    <ZxGridList
      :load-data="loadTemplateData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="template-grid zx-grid-list--page"
    >
      <!-- 工具栏：筛选和搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
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
          <el-table-column prop="clazzName" label="体系分类" width="150" />
          <el-table-column prop="evaluaName" label="体系名称" min-width="200" />
          <el-table-column
            prop="evaluaExpplain"
            label="体系说明"
            min-width="300"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="180" />
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
  </ContentWrap>
</template>

<script setup>
import { ContentWrap } from '@/components/ContentWrap'
import { systemApi } from '@/api/modules/indicator/system'
import { CategorySelector } from '../components/selector'
import { confirmInputDanger } from '@zxio/zxui'

const router = useRouter()

// 数据加载函数 - 适配 ZxGridList
const loadTemplateData = async (params) => {
  return systemApi.getSystemList({ ...params, evaluaTemplate: 1 })
}

const onFilterChange = (field, value, { refresh, updateState }) => {
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

// 编辑 - 跳转到编辑页面
const handleEdit = (row) => {
  router.push(`/indicator/template-edit/${row.evaluaId}`)
}

// 获取当前实例
const instance = getCurrentInstance()
const { proxy } = instance || {}

// 删除模版
const handleDelete = async (row, refresh) => {
  try {
    if (proxy?.$confirmInput) {
      await proxy.$confirmInput.danger({
        targetName: row.evaluaName,
        targetType: '模版',
        keyword: row.evaluaName,
        dangerMessage: `您即将删除模版"${row.evaluaName}"`,
        description: '此操作不可恢复，请输入模版名称以确认删除。',
        confirmAction: async () => {
          return systemApi.deleteSystem(row.evaluaId).then(() => {
            refresh()
          })
        }
      })
    } else {
      await confirmInputDanger({
        targetName: row.evaluaName,
        targetType: '模版',
        keyword: row.evaluaName,
        dangerMessage: `您即将删除模版"${row.evaluaName}"`,
        description: '此操作不可恢复，请输入模版名称以确认删除。',
        confirmAction: async () => {
          return systemApi.deleteSystem(row.evaluaId).then(() => {
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
