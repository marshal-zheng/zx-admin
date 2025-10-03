import { ref } from 'vue'

/**
 * 数据连接对话框状态管理 Hook
 * 用于管理数据源表单弹窗和表数据查看弹窗的状态
 */
export function useDataConnectionDialog() {
  // 数据源表单弹窗状态
  const formDialogVisible = ref(false)
  const currentDataSource = ref(null)
  const dialogMode = ref<'create' | 'edit'>('create')

  // 表数据查看弹窗状态
  const tableDataDialogVisible = ref(false)
  const currentDataSourceId = ref<string | number | null>(null)
  const currentTableName = ref('')

  // 数据源表单弹窗方法
  const openFormDialog = (mode: 'create' | 'edit', dataSource = null) => {
    dialogMode.value = mode
    currentDataSource.value = dataSource
    formDialogVisible.value = true
  }

  const closeFormDialog = () => {
    formDialogVisible.value = false
    currentDataSource.value = null
  }

  const handleFormSuccess = () => {
    closeFormDialog()
  }

  // 表数据查看弹窗方法
  const openTableDataDialog = (dataSourceId: string | number, tableName = '') => {
    currentDataSourceId.value = dataSourceId
    currentTableName.value = tableName
    tableDataDialogVisible.value = true
  }

  const closeTableDataDialog = () => {
    tableDataDialogVisible.value = false
    currentDataSourceId.value = null
    currentTableName.value = ''
  }

  // 便捷方法
  const handleAdd = () => {
    openFormDialog('create')
  }

  const handleEdit = (dataSource: any) => {
    openFormDialog('edit', dataSource)
  }

  return {
    // 数据源表单弹窗状态
    formDialogVisible,
    currentDataSource,
    dialogMode,

    // 表数据查看弹窗状态
    tableDataDialogVisible,
    currentDataSourceId,
    currentTableName,

    // 数据源表单弹窗方法
    openFormDialog,
    closeFormDialog,
    handleFormSuccess,
    handleAdd,
    handleEdit,

    // 表数据查看弹窗方法
    openTableDataDialog,
    closeTableDataDialog
  }
}
