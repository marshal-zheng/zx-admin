<template>
  <div class="virtualized-data-grid-demo">
    <ElCard header="VirtualizedDataGrid 示例">
      <div class="demo-controls">
        <ElButton @click="isDisabled = !isDisabled">
          {{ isDisabled ? '启用编辑' : '禁用编辑' }}
        </ElButton>
        <ElButton @click="generateLargeData"> 生成 1000 条数据 </ElButton>
        <ElButton @click="clearData"> 清空数据 </ElButton>
      </div>

      <div class="demo-grid">
        <VirtualizedDataGrid
          v-model="tableData"
          :columns="columns"
          :height="500"
          :disabled="isDisabled"
          :show-add-button="true"
          :disable-delete="disableDeleteRow"
          @add="handleAdd"
          @delete="handleDelete"
          @change="handleChange"
          @cell-change="handleCellChange"
        >
          <template #header>
            <div class="grid-header">
              <h3>用户数据表</h3>
              <ElTag>共 {{ tableData.length }} 条数据</ElTag>
            </div>
          </template>

          <!-- 自定义状态列渲染 -->
          <template #cell-status="{ row }">
            <ElTag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </ElTag>
          </template>

          <!-- 自定义操作列 -->
          <template #actions="{ row, index }">
            <ElButton link type="primary" :icon="Edit" @click="handleEdit(row)"> 编辑 </ElButton>
            <ElButton
              link
              type="danger"
              :icon="Delete"
              :disabled="row.role === 'admin'"
              @click="confirmDelete(index)"
            >
              删除
            </ElButton>
          </template>
        </VirtualizedDataGrid>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElCard, ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import VirtualizedDataGrid from './VirtualizedDataGrid.vue'
import type { DataGridColumn } from './types'

const isDisabled = ref(false)

// 初始数据
const tableData = ref([
  {
    id: 1,
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    status: 1,
    role: 'admin',
    department: 'tech',
    salary: 8000,
    joinDate: '2024-01-01',
    active: true,
    description: 'Senior Developer'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 30,
    email: 'jane@example.com',
    status: 1,
    role: 'user',
    department: 'sales',
    salary: 6000,
    joinDate: '2024-02-15',
    active: true,
    description: 'Sales Manager'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    age: 28,
    email: 'bob@example.com',
    status: 0,
    role: 'user',
    department: 'tech',
    salary: 7000,
    joinDate: '2024-03-20',
    active: false,
    description: 'Frontend Developer'
  }
])

// 列配置
const columns: DataGridColumn[] = [
  {
    key: 'id',
    dataKey: 'id',
    title: 'ID',
    width: 80,
    type: 'number',
    disabled: true, // ID 列禁用编辑
    defaultValue: () => Date.now()
  },
  {
    key: 'name',
    dataKey: 'name',
    title: '姓名',
    width: 150,
    type: 'input',
    placeholder: '请输入姓名',
    rules: [
      { required: true, message: '姓名不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    defaultValue: ''
  },
  {
    key: 'age',
    dataKey: 'age',
    title: '年龄',
    width: 120,
    type: 'number',
    cellProps: {
      min: 18,
      max: 65,
      step: 1
    },
    rules: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
    defaultValue: 18
  },
  {
    key: 'email',
    dataKey: 'email',
    title: '邮箱',
    width: 220,
    type: 'input',
    placeholder: '请输入邮箱',
    rules: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    defaultValue: ''
  },
  {
    key: 'status',
    dataKey: 'status',
    title: '状态',
    width: 120,
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    defaultValue: 1
  },
  {
    key: 'role',
    dataKey: 'role',
    title: '角色',
    width: 150,
    type: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' },
      { label: '访客', value: 'guest' }
    ],
    defaultValue: 'user'
  },
  {
    key: 'department',
    dataKey: 'department',
    title: '部门',
    width: 150,
    type: 'select',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '销售部', value: 'sales' },
      { label: '市场部', value: 'marketing' },
      { label: '人事部', value: 'hr' }
    ],
    defaultValue: 'tech'
  },
  {
    key: 'salary',
    dataKey: 'salary',
    title: '薪资',
    width: 150,
    type: 'number',
    cellProps: {
      min: 0,
      max: 99999,
      step: 100,
      precision: 0
    },
    formatter: (value) => `¥${value}`,
    defaultValue: 5000
  },
  {
    key: 'joinDate',
    dataKey: 'joinDate',
    title: '入职日期',
    width: 180,
    type: 'datePicker',
    cellProps: {
      type: 'date',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    },
    defaultValue: new Date().toISOString().split('T')[0]
  },
  {
    key: 'active',
    dataKey: 'active',
    title: '激活状态',
    width: 120,
    type: 'switch',
    cellProps: {
      activeText: '是',
      inactiveText: '否'
    },
    defaultValue: true
  },
  {
    key: 'description',
    dataKey: 'description',
    title: '描述',
    width: 250,
    type: 'textarea',
    cellProps: {
      rows: 2,
      autosize: { minRows: 1, maxRows: 4 }
    },
    defaultValue: ''
  }
]

// 判断删除按钮是否禁用
const disableDeleteRow = (row: any, index: number) => {
  return row.role === 'admin' // 管理员角色不可删除
}

// 事件处理
const handleAdd = (row: any) => {
  ElMessage.success('添加了新行')
  console.log('Added row:', row)
}

const handleDelete = (index: number, row: any) => {
  ElMessage.success(`删除了第 ${index + 1} 行`)
  console.log('Deleted row:', index, row)
}

const handleChange = (data: any[]) => {
  console.log('Data changed, total rows:', data.length)
}

const handleCellChange = (row: any, key: string, value: any, index: number) => {
  console.log('Cell changed:', { row, key, value, index })
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑: ${row.name}`)
  console.log('Edit row:', row)
}

const confirmDelete = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    tableData.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 生成大量数据
const generateLargeData = () => {
  const newData: any[] = []
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Fiona']
  const departments = ['tech', 'sales', 'marketing', 'hr']
  const roles = ['admin', 'user', 'guest']

  for (let i = 0; i < 1000; i++) {
    newData.push({
      id: i + 1,
      name: `${names[i % names.length]} ${i}`,
      age: Math.floor(Math.random() * 47) + 18, // 18-65
      email: `user${i}@example.com`,
      status: Math.random() > 0.5 ? 1 : 0,
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 10000) + 5000,
      joinDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      active: Math.random() > 0.5,
      description: `Employee description ${i}`
    })
  }

  tableData.value = newData
  ElMessage.success('已生成 1000 条数据')
}

// 清空数据
const clearData = () => {
  tableData.value = []
  ElMessage.info('已清空数据')
}
</script>

<style lang="scss" scoped>
.virtualized-data-grid-demo {
  padding: 20px;

  .demo-controls {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .demo-grid {
    margin-top: 20px;
  }

  .grid-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
