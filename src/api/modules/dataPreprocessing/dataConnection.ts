// 数据引接模块API
import ZXR from '../../http'

// 分页查询数据源列表
export function getDataSourceList(params = {}) {
  return ZXR.get({
    url: '/zhpgxt/zhpgBase',
    params
  })
}

// 新增数据源
export function createDataSource(data) {
  return ZXR.post({
    url: '/zhpgxt/zhpgBase',
    data
  })
}

// 根据ID查询数据源详情
export function getDataSourceById(baseId) {
  return ZXR.get({
    url: `/zhpgxt/zhpgBase/${baseId}`
  })
}

// 编辑数据源
export function updateDataSource(baseId, data) {
  return ZXR.put({
    url: `/zhpgxt/zhpgBase/${baseId}`,
    data
  })
}

// 删除数据源
export function deleteDataSource(baseId) {
  return ZXR.delete({
    url: `/zhpgxt/zhpgBase/${baseId}`
  })
}

// 导出数据源
export function exportDataSource(baseId) {
  return ZXR.get({
    url: `/zhpgxt/zhpgBase/export/${baseId}`
  })
}

// 导入数据源
export function importDataSource(baseDataName, file) {
  const formData = new FormData()
  formData.append('file', file)

  return ZXR.post({
    url: `/zhpgxt/zhpgBase/import/${baseDataName}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 分页查询数据源表列表
export function getTableNames(baseId, params = {}) {
  return ZXR.get({
    url: `/zhpgxt/zhpgBase/getTableNameList/${baseId}`,
    params
  })
}

// 获取创建表列表
export function getCreateTableList(params = {}) {
  return ZXR.get({
    url: '/zhpgxt/zhpgCreateTable',
    params
  })
}

// 查询数据源表的所有数据行
export function getTableData(data) {
  return ZXR.post({
    url: '/zhpgxt/zhpgBase/getTableAllList',
    data
  })
}

// 查询数据源表字段
export function getTableFields(data) {
  return ZXR.post({
    url: '/zhpgxt/zhpgBase/getTableField',
    data
  })
}

// 导入表到本地数据库
export function migrationToLocalHost(data) {
  return ZXR.post({
    url: '/zhpgxt/zhpgCreateTable/migrationToLocalHost',
    data
  })
}

// 根据表名查询表数据
export function selectTableData(tableName: string, params = {}) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/selectTable/${tableName}`,
    params
  })
}

// 兼容旧接口名称
export const getTableList = getTableNames
export const getTableAllData = getTableData

// 导出所有API
export const dataConnectionApi = {
  getDataSourceList,
  addDataSource: createDataSource,
  getDataSourceById,
  editDataSource: updateDataSource,
  deleteDataSource,
  exportDataSource,
  importDataSource,
  getTableNames,
  getCreateTableList,
  getTableData,
  getTableFields,
  migrationToLocalHost,
  selectTableData,
  // 兼容旧名称
  getTableList: getTableNames,
  getTableAllData: getTableData
}
