<template>
  <ContentWrap>
    <ZxGridList
      :load-data="loadDataEntryData"
      :show-pagination="true"
      :page-sizes="[10, 20, 50, 100]"
      :default-page-size="10"
      :load-on-mounted="true"
      :clear-selection-on-load="true"
      class="data-entry-grid"
    >
      <!-- 工具栏：左-操作 | 中-筛选 | 右-搜索 -->
      <template #form="{ query, loading, refresh, updateState }">
        <div class="zx-grid-form-bar">
          <div class="zx-grid-form-bar__left">
            <!-- 根据需求，暂时不显示录入按钮 -->
          </div>
          <div class="zx-grid-form-bar__filters">
            <el-select
              v-model="query.createType"
              placeholder="创建类型"
              style="width: 150px"
              clearable
              @change="(v) => onFilterChange('createType', v, { refresh, updateState })"
            >
              <el-option label="自建表" :value="1" />
              <el-option label="其他库导入表" :value="2" />
              <el-option label="文件导入表" :value="3" />
            </el-select>
            <el-select
              v-model="query.handType"
              placeholder="处理状态"
              style="width: 150px; margin-left: 12px"
              clearable
              @change="(v) => onFilterChange('handType', v, { refresh, updateState })"
            >
              <el-option label="未处理" :value="0" />
              <el-option label="已处理" :value="1" />
            </el-select>
          </div>
          <div class="zx-grid-form-bar__right">
            <ZxSearch
              v-model="query.keyword"
              placeholder="搜索表名称"
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
          <el-table-column prop="createTableName" label="表名" min-width="200" />
          <el-table-column
            prop="tableComment"
            label="表备注"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="createType" label="创建类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getCreateTypeTag(row.createType)">
                {{ getCreateTypeText(row.createType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="handType" label="处理状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getHandTypeTag(row.handType)">
                {{ getHandTypeText(row.handType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column
            label="操作"
            width="200"
            class-name="op-col"
            label-class-name="op-col__header"
          >
            <template #default="{ row }">
              <div class="op-col__wrap">
                <ZxButton link type="primary" @click="handleTableData(row)">表数据</ZxButton>
                <ZxButton link type="danger" @click="handleDelete(row, refresh)">删除</ZxButton>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </ZxGridList>

    <!-- 表数据弹窗 -->
    <el-dialog
      v-model="tableDataVisible"
      title="表数据管理"
      width="90%"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 16px">
        <ZxButton type="primary" @click="handleNewTableData">新建表数据</ZxButton>
      </div>

      <!-- 表数据列表 -->
      <el-table :data="tableDataList" style="width: 100%" max-height="500px">
        <el-table-column
          v-for="field in tableFields"
          :key="field.name"
          :prop="field.name"
          :label="field.comment || field.name"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <ZxButton link type="primary" @click="handleEditTableData(row)">编辑</ZxButton>
            <ZxButton link type="danger" @click="handleDeleteTableData(row)">删除</ZxButton>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 表数据编辑弹窗 -->
    <el-dialog
      v-model="tableDataFormVisible"
      :title="tableDataFormMode === 'create' ? '新建表数据' : '编辑表数据'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="tableDataForm" label-width="120px">
        <el-form-item
          v-for="field in tableFields"
          :key="field.name"
          :label="field.comment || field.name"
        >
          <el-input
            v-if="field.type.includes('varchar') || field.type.includes('text')"
            v-model="tableDataForm[field.name]"
            :placeholder="`请输入${field.comment || field.name}`"
          />
          <el-input-number
            v-else-if="field.type.includes('int') || field.type.includes('double')"
            v-model="tableDataForm[field.name]"
            :placeholder="`请输入${field.comment || field.name}`"
            style="width: 100%"
          />
          <el-date-picker
            v-else-if="field.type.includes('datetime')"
            v-model="tableDataForm[field.name]"
            type="datetime"
            :placeholder="`请选择${field.comment || field.name}`"
            style="width: 100%"
          />
          <el-input
            v-else
            v-model="tableDataForm[field.name]"
            :placeholder="`请输入${field.comment || field.name}`"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <ZxButton @click="tableDataFormVisible = false">取消</ZxButton>
          <ZxButton type="primary" @click="handleSaveTableData">保存</ZxButton>
        </div>
      </template>
    </el-dialog>
  </ContentWrap>
</template>

<script setup>
// Vue 3 API 和 Element Plus 组件现在通过 unplugin-auto-import 自动导入
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import ZxGridList from '@/components/pure/ZxGridList/index.vue'
import { ZxSearch, ZxButton } from '@/components/pure'
import { danger as confirmInputDanger } from '@/components/pure/ZxConfirmInput/service'

const { t } = useI18n()

// 添加组件初始化调试
onMounted(() => {
  console.log('=== Data Entry List 组件已挂载 ===')
})

// 响应式数据
const tableDataVisible = ref(false)
const tableDataFormVisible = ref(false)
const tableDataFormMode = ref('create') // create | edit
const currentTable = ref(null)
const tableDataList = ref([])
const tableFields = ref([])
const tableDataForm = ref({})
const currentEditingData = ref(null)

// 创建类型映射
const createTypeMap = {
  1: { text: '自建表', tag: 'success' },
  2: { text: '其他库导入表', tag: 'warning' },
  3: { text: '文件导入表', tag: 'info' }
}

// 处理状态映射
const handTypeMap = {
  0: { text: '未处理', tag: 'warning' },
  1: { text: '已处理', tag: 'success' }
}

// 模拟API调用 - 实际项目中需要替换为真实的API
const mockDataEntryApi = {
  // 分页查询录入数据
  getDataEntryList: async (params) => {
    console.log('=== 查询录入数据列表 ===', params)
    // 模拟数据
    const mockData = {
      records: [
        {
          createTableId: '1',
          createTableName: 'user_info',
          tableComment: '用户信息表',
          createType: 1,
          handType: 1,
          createTime: '2025-01-26 16:00:00'
        },
        {
          createTableId: '2',
          createTableName: 'order_data',
          tableComment: '订单数据表',
          createType: 2,
          handType: 0,
          createTime: '2025-01-26 15:30:00'
        },
        {
          createTableId: '3',
          createTableName: 'product_catalog',
          tableComment: '产品目录表',
          createType: 3,
          handType: 1,
          createTime: '2025-01-26 14:00:00'
        }
      ],
      total: 3,
      size: params.pageSize || 10,
      current: params.pageNumber || 1,
      pages: 1
    }

    // 模拟筛选
    if (params.createType !== undefined && params.createType !== null) {
      mockData.records = mockData.records.filter((item) => item.createType === params.createType)
      mockData.total = mockData.records.length
    }

    if (params.handType !== undefined && params.handType !== null) {
      mockData.records = mockData.records.filter((item) => item.handType === params.handType)
      mockData.total = mockData.records.length
    }

    // 模拟搜索
    if (params.keyword) {
      mockData.records = mockData.records.filter((item) =>
        item.createTableName.includes(params.keyword)
      )
      mockData.total = mockData.records.length
    }

    return mockData
  },

  // 查询表数据
  getTableData: async (tableName) => {
    console.log('=== 查询表数据 ===', tableName)
    return [
      { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
      { id: 2, name: '李四', email: 'lisi@example.com', age: 30 }
    ]
  },

  // 查询表字段
  getTableFields: async (tableName) => {
    console.log('=== 查询表字段 ===', tableName)
    return [
      { name: 'id', comment: 'ID', type: 'int(11)' },
      { name: 'name', comment: '姓名', type: 'varchar(255)' },
      { name: 'email', comment: '邮箱', type: 'varchar(255)' },
      { name: 'age', comment: '年龄', type: 'int(11)' }
    ]
  },

  // 新增表数据
  createTableData: async (tableName, data) => {
    console.log('=== 新增表数据 ===', tableName, data)
    return { success: true }
  },

  // 编辑表数据
  updateTableData: async (tableName, updateId, data) => {
    console.log('=== 编辑表数据 ===', tableName, updateId, data)
    return { success: true }
  },

  // 删除表数据
  deleteTableData: async (tableName, updateId) => {
    console.log('=== 删除表数据 ===', tableName, updateId)
    return { success: true }
  },

  // 删除表结构
  deleteTable: async (createTableId) => {
    console.log('=== 删除表结构 ===', createTableId)
    return { success: true }
  }
}

// 数据加载函数 - 适配 ZxGridList
const loadDataEntryData = async (params) => {
  try {
    // 添加固定参数 createType=1 (自建表)
    const queryParams = { ...params, createType: 1 }
    const data = await mockDataEntryApi.getDataEntryList(queryParams)
    console.log('=== DataEntry API 返回数据 ===', data)
    return data
  } catch (error) {
    console.error('=== loadDataEntryData 错误 ===', error)
    throw error
  }
}

// 工具函数
const getCreateTypeText = (type) => createTypeMap[type]?.text || '未知'
const getCreateTypeTag = (type) => createTypeMap[type]?.tag || 'info'
const getHandTypeText = (type) => handTypeMap[type]?.text || '未知'
const getHandTypeTag = (type) => handTypeMap[type]?.tag || 'info'

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

// 表数据管理
const handleTableData = async (row) => {
  currentTable.value = row
  tableDataVisible.value = true
  await loadTableDataAndFields()
}

// 加载表数据和字段
const loadTableDataAndFields = async () => {
  try {
    // 先获取表字段
    const fields = await mockDataEntryApi.getTableFields(currentTable.value.createTableName)
    tableFields.value = fields

    // 再获取表数据
    const data = await mockDataEntryApi.getTableData(currentTable.value.createTableName)
    tableDataList.value = data
  } catch (error) {
    console.error('加载表数据失败:', error)
    ElMessage.error('加载表数据失败')
  }
}

// 新建表数据
const handleNewTableData = () => {
  tableDataFormMode.value = 'create'
  tableDataForm.value = {}
  currentEditingData.value = null
  tableDataFormVisible.value = true
}

// 编辑表数据
const handleEditTableData = (row) => {
  tableDataFormMode.value = 'edit'
  tableDataForm.value = { ...row }
  currentEditingData.value = row
  tableDataFormVisible.value = true
}

// 保存表数据
const handleSaveTableData = async () => {
  try {
    if (tableDataFormMode.value === 'create') {
      // 构造新增数据格式
      const createTableRowDtoLists = [
        tableFields.value.map((field) => ({
          name: field.name,
          tValue: tableDataForm.value[field.name] || ''
        }))
      ]

      await mockDataEntryApi.createTableData(currentTable.value.createTableName, {
        createTableRowDtoLists
      })
      ElMessage.success('新增成功')
    } else {
      // 构造编辑数据格式
      const createTableRowDtos = tableFields.value.map((field) => ({
        name: field.name,
        tValue: tableDataForm.value[field.name] || ''
      }))

      await mockDataEntryApi.updateTableData(
        currentTable.value.createTableName,
        currentEditingData.value.id,
        { createTableRowDtos }
      )
      ElMessage.success('编辑成功')
    }

    tableDataFormVisible.value = false
    await loadTableDataAndFields()
  } catch (error) {
    console.error('保存表数据失败:', error)
    ElMessage.error('保存失败')
  }
}

// 删除表数据
const handleDeleteTableData = async (row) => {
  try {
    await ElMessageBox.confirm('是否确认删除这条数据？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await mockDataEntryApi.deleteTableData(currentTable.value.createTableName, row.id)
    ElMessage.success('删除成功')
    await loadTableDataAndFields()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除表数据失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 删除表结构
const handleDelete = async (row, refresh) => {
  try {
    await confirmInputDanger({
      targetName: row.createTableName,
      targetType: '表结构',
      keyword: row.createTableName,
      dangerMessage: `您即将删除表结构"${row.createTableName}"`,
      description: '此操作不可恢复，请输入表名称以确认删除。',
      confirmAction: async () => {
        return mockDataEntryApi.deleteTable(row.createTableId).then(() => {
          refresh()
          ElMessage.success('删除成功')
        })
      }
    })
  } catch (error) {
    console.log('用户取消删除或操作失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.data-entry-grid {
  .op-col__wrap {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
