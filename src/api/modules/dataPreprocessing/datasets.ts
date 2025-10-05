// 数据集模块API
import ZXR from '../../http'

// 根据创建表ID查询数据集数据
export function getDatasetByCreateTableId(createTableId: string | number, params = {}) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/${createTableId}`,
    params
  })
}

// 根据表名查询表数据
export function getTableDataByTableName(tableName: string, params = {}) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/selectTable/${tableName}`,
    params
  })
}

// 获取数据集列表
export function getDatasetList(params = {}) {
  return ZXR.get({
    url: '/zhpgxt/zhpgCreateTable',
    params
  })
}

// 根据创建表ID查询数据集详情
export function getDatasetDetail(createTableId: string | number) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/${createTableId}`
  })
}

// 根据创建表ID查询数据集字段信息
export function getDatasetFields(createTableId: string | number) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/${createTableId}/fields`
  })
}

// 删除数据集
export function deleteDataset(createTableId: string | number) {
  return ZXR.delete({
    url: `/zhpgxt/zhpgCreateTable/${createTableId}`
  })
}

// 迁移数据集到本地数据库
export function migrationDatasetToLocalHost(data: {
  createTableId: string | number
  tableName: string
}) {
  return ZXR.post({
    url: '/zhpgxt/zhpgCreateTable/migrationToLocalHost',
    data
  })
}

// 创建表
export function createTable(data: {
  tableName: string
  tableComment: string
  createTableRowDtos: Array<{
    name: string
    type: string
    extent: string | number
    comment: string
  }>
}) {
  return ZXR.post({
    url: '/zhpgxt/zhpgCreateTable',
    data
  })
}

// 更新数据集
export function updateDataset(createTableId: string | number, data: {
  tableName: string
  tableComment: string
  createTableRowDtos: Array<{
    name: string
    type: string
    extent: string | number
    comment: string
  }>
}) {
  return ZXR.put({
    url: `/zhpgxt/zhpgCreateTable/${createTableId}`,
    data
  })
}

// 导出数据集API
export const datasetsApi = {
  getTableData: getDatasetByCreateTableId,
  getTableDataByTableName,
  getDatasetList,
  getDatasetDetail,
  getDatasetFields,
  deleteDataset,
  migrationToLocalHost: migrationDatasetToLocalHost,
  createTable,
  updateDataset
}