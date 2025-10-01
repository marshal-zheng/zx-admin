<template>
  <div class="grid-list-example">
    <h2>ZxGridList 组件使用示例</h2>

    <!-- 控制选项 -->
    <div
      class="demo-controls"
      style=" padding: 16px;margin-bottom: 16px; background: #f5f7fa; border-radius: 4px"
    >
      <el-space wrap>
        <span>控制选项：</span>
        <el-switch
          v-model="showTableBorder"
          active-text="显示表格内边框"
          inactive-text="隐藏表格内边框"
        />
        <div style="display: flex; align-items: center; gap: 8px">
          <span>分页底部间距：</span>
          <el-input-number
            v-model="paginationPaddingBottom"
            :min="0"
            :max="50"
            size="small"
            style="width: 120px"
          />
          <span>px</span>
        </div>
      </el-space>
    </div>

    <!-- 使用 ZxGridList 组件 -->
    <ZxGridList
      ref="gridRef"
      :load-data="loadUserData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="20"
      :auto-refresh="{ enabled: false, interval: 30000 }"
      :show-table-border="showTableBorder"
      :pagination-padding-bottom="paginationPaddingBottom + 'px'"
      @before-load="handleBeforeLoad"
      @data-loaded="handleDataLoaded"
      @load-error="handleLoadError"
    >
      <!-- 查询表单插槽 -->
      <template #form="{ query, loading }">
        <el-form inline class="search-form">
          <el-form-item label="用户名">
            <el-input
              v-model="query.username"
              placeholder="请输入用户名"
              clearable
              style="width: 200px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input
              v-model="query.email"
              placeholder="请输入邮箱"
              clearable
              style="width: 200px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="query.status"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="激活" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch" :loading="loading"> 搜索 </el-button>
            <el-button @click="handleReset" :disabled="loading"> 重置 </el-button>
            <el-button @click="handleRefresh" :loading="loading"> 刷新 </el-button>
          </el-form-item>
        </el-form>

        <!-- 批量操作工具栏 -->
        <div v-if="selectedRows.length > 0" class="batch-toolbar">
          <el-alert
            :title="`已选择 ${selectedRows.length} 项`"
            type="info"
            show-icon
            :closable="false"
          >
            <template #default>
              <el-space>
                <span>已选择 {{ selectedRows.length }} 项</span>
                <el-button size="small" @click="handleBatchDelete"> 批量删除 </el-button>
                <el-button size="small" @click="handleBatchExport"> 批量导出 </el-button>
                <el-button size="small" @click="clearSelection"> 清空选择 </el-button>
              </el-space>
            </template>
          </el-alert>
        </div>
      </template>

      <!-- 表格插槽 -->
      <template #table="{ grid, loading }">
        <el-table
          ref="tableRef"
          :data="grid.list"
          v-loading="loading"
          :border="showTableBorder"
          stripe
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          style="width: 100%"
          height="400"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />

          <el-table-column prop="id" label="ID" width="80" sortable="custom" />

          <el-table-column prop="username" label="用户名" min-width="120" sortable="custom" />

          <el-table-column prop="realName" label="真实姓名" min-width="100" />

          <el-table-column prop="email" label="邮箱" min-width="180" sortable="custom" />

          <el-table-column prop="phone" label="手机号" width="130" />

          <el-table-column prop="department" label="部门" width="100" />

          <el-table-column prop="role" label="角色" width="100" />

          <el-table-column prop="status" label="状态" width="100" sortable="custom">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" width="160" sortable="custom">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)"> 查看 </el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)"> 编辑 </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 自定义空状态 -->
      <template #empty="{ refresh }">
        <el-empty description="暂无用户数据">
          <el-button type="primary" @click="refresh">刷新数据</el-button>
        </el-empty>
      </template>

      <!-- 自定义分页 -->
      <template #pagination="{ pager }">
        <div class="custom-pagination">
          <span>共 {{ pager.total }} 条记录</span>
          <el-pagination
            :total="pager.total"
            :current-page="pager.page"
            :page-size="pager.size"
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </template>
    </ZxGridList>

    <!-- 状态信息展示 -->
    <div
      class="status-info"
      style=" padding: 12px;margin-top: 16px; background: #f5f7fa; border-radius: 4px"
    >
      <el-row :gutter="16">
        <el-col :span="6">
          <el-statistic title="总记录数" :value="gridRef?.gridState?.pager?.total || 0" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="当前页" :value="gridRef?.currentPage || 1" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="每页条数" :value="gridRef?.gridState?.pager?.size || 20" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="已选择" :value="selectedRows.length" />
        </el-col>
      </el-row>
    </div>

    <!-- 选中项详情 -->
    <div v-if="selectedRows.length > 0" class="selection-details" style="margin-top: 16px">
      <el-card header="选中项详情">
        <div style="max-height: 200px; overflow-y: auto">
          <el-tag
            v-for="item in selectedRows"
            :key="item.id"
            style="margin: 2px"
            closable
            @close="removeSelection(item)"
          >
            {{ item.username }} ({{ item.realName }})
          </el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ZxGridList from './index.vue'

// 组件引用
const gridRef = ref()
const tableRef = ref()

// 控制选项
const showTableBorder = ref(false)
const paginationPaddingBottom = ref(16)

// 选中行数据
const selectedRows = ref([])

// 模拟API调用
const loadUserData = async (params) => {
  console.log('Mock API - 请求参数：', params)

  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  const { query = {}, pager = {} } = params
  const { page = 1, size = 20 } = pager

  // 生成模拟数据
  const mockUsers = []
  const statuses = ['active', 'inactive']
  const domains = ['gmail.com', 'qq.com', '163.com', 'hotmail.com', 'outlook.com', 'sina.com']
  const firstNames = [
    '张',
    '李',
    '王',
    '刘',
    '陈',
    '杨',
    '赵',
    '黄',
    '周',
    '吴',
    '徐',
    '孙',
    '胡',
    '朱',
    '高',
    '林',
    '何',
    '郭',
    '马',
    '罗'
  ]
  const lastNames = [
    '伟',
    '芳',
    '娜',
    '秀英',
    '敏',
    '静',
    '丽',
    '强',
    '磊',
    '军',
    '洋',
    '勇',
    '艳',
    '杰',
    '娟',
    '涛',
    '明',
    '超',
    '秀兰',
    '霞'
  ]

  for (let i = 1; i <= 150; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const chineseName = firstName + lastName
    const username = `${chineseName}_${i}`

    mockUsers.push({
      id: i,
      username: username,
      email: `user${i}@${domains[i % domains.length]}`,
      phone: `1${Math.floor(Math.random() * 9) + 3}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      realName: chineseName,
      department: ['技术部', '产品部', '运营部', '市场部', '人事部'][Math.floor(Math.random() * 5)],
      role: ['管理员', '普通用户', '访客'][Math.floor(Math.random() * 3)]
    })
  }

  // 过滤数据
  let filteredUsers = mockUsers
  if (query.username) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(query.username.toLowerCase()) ||
        user.realName.includes(query.username)
    )
  }
  if (query.email) {
    filteredUsers = filteredUsers.filter((user) =>
      user.email.toLowerCase().includes(query.email.toLowerCase())
    )
  }
  if (query.status) {
    filteredUsers = filteredUsers.filter((user) => user.status === query.status)
  }

  // 排序
  if (query.sortBy && query.sortOrder) {
    filteredUsers.sort((a, b) => {
      const aVal = a[query.sortBy]
      const bVal = b[query.sortBy]
      if (query.sortOrder === 'ascending') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  // 分页
  const total = filteredUsers.length
  const start = (page - 1) * size
  const end = start + size
  const list = filteredUsers.slice(start, end)

  console.log('Mock API - 返回数据：', { list, total, page, size })

  return {
    list,
    pager: {
      page,
      size,
      total
    }
  }
}

// 事件处理函数
const handleBeforeLoad = (params) => {
  console.log('数据加载前：', params)
}

const handleDataLoaded = (data) => {
  console.log('数据加载完成：', data)
  // 清空选择
  selectedRows.value = []
}

const handleLoadError = (error) => {
  console.error('数据加载失败：', error)
  ElMessage.error('数据加载失败：' + error.message)
}

const handleSearch = () => {
  console.log('执行搜索')
  gridRef.value?.loadData({}, { immediate: true })
}

const handleReset = () => {
  console.log('重置搜索')
  gridRef.value?.updateState('query', {})
  gridRef.value?.loadData({}, { immediate: true })
}

const handleRefresh = () => {
  console.log('刷新数据')
  gridRef.value?.refresh()
}

const handleSortChange = ({ prop, order }) => {
  console.log('排序变化：', prop, order)
  const sortParams = {
    sortBy: order ? prop : undefined,
    sortOrder: order
  }
  gridRef.value?.updateState('query', {
    ...gridRef.value.state.query,
    ...sortParams
  })
  gridRef.value?.loadData({}, { immediate: true })
}

const handleSizeChange = (size) => {
  console.log('分页大小变化：', size)
  gridRef.value?.updateState('pager.size', size)
  gridRef.value?.updateState('pager.page', 1) // 重置到第一页
  gridRef.value?.loadData({}, { immediate: true })
}

const handlePageChange = (page) => {
  console.log('页码变化：', page)
  gridRef.value?.updateState('pager.page', page)
  gridRef.value?.loadData({}, { immediate: true })
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  console.log('选中行变化：', selection)
}

const clearSelection = () => {
  selectedRows.value = []
  tableRef.value?.clearSelection()
}

const removeSelection = (item) => {
  const index = selectedRows.value.findIndex((row) => row.id === item.id)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
    tableRef.value?.toggleRowSelection(item, false)
  }
}

// 批量操作
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 项吗？`, '批量删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    ElMessage.success(`已删除 ${selectedRows.value.length} 项`)
    selectedRows.value = []
    gridRef.value?.refresh()
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleBatchExport = () => {
  ElMessage.success(`正在导出 ${selectedRows.value.length} 项数据...`)
}

// 单行操作
const handleView = (row) => {
  ElMessage.info(`查看用户：${row.username}`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑用户：${row.username}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    ElMessage.success('删除成功')
    gridRef.value?.refresh()
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 工具函数
const getStatusType = (status) => {
  return status === 'active' ? 'success' : 'danger'
}

const getStatusText = (status) => {
  return status === 'active' ? '激活' : '禁用'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<style scoped>


/* 响应式设计 */
@media (width <= 768px) {
  .search-form .el-form-item {
    margin-bottom: 10px;
  }
}

.grid-list-example {
  padding: 20px;
}

.demo-controls {
  padding: 16px;
  margin-bottom: 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.search-form {
  margin-bottom: 16px;
}

.batch-toolbar {
  margin-top: 16px;
}

.status-info {
  padding: 12px;
  margin-top: 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.selection-details {
  margin-top: 16px;
}

.custom-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
</style>
