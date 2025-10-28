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
export function getTableDataByTableName(id: string | number, tableName: string, params = {}) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/selectTable/${encodeURIComponent(tableName)}`,
    params: {
      ...params,
      id
    }
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
    extent: string
    comment: string
  }>
}) {
  return ZXR.post({
    url: '/zhpgxt/zhpgCreateTable/creatTable',
    data
  })
}

// 编辑表
export function modifyTable(data: {
  updateId: string
  oldTableName: string
  tableName: string
  tableComment: string
  createTableRowDtos: Array<{
    name: string
    type: string
    extent: string
    comment: string
    oldColumnName: string
  }>
}) {
  return ZXR.post({
    url: '/zhpgxt/zhpgCreateTable/modifyTable',
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

// 删除表
export function deleteTable(tableName: string) {
  return ZXR.delete({
    url: `/zhpgxt/zhpgCreateTable/deleteTable/${encodeURIComponent(tableName)}`
  })
}

// 获取表结构
export function getTableStructure(tableName: string) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/structure/${encodeURIComponent(tableName)}`
  })
}

// 获取表字段
export function getTableField(tableName: string) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/getTableField/${encodeURIComponent(tableName)}`
  })
}

// 新建表数据
export function insertTable(data: {
  tableName: string
  createTableRowDtoLists: Array<Array<{
    name: string
    tValue: string
  }>>
}) {
  return ZXR.post({
    url: `/zhpgxt/zhpgCreateTable/insterTable`,
    data
  })
}

// 编辑表数据
export function updateTableRow(data: {
  updateId: string | number
  tableName: string
  createTableRowDtos: Array<{
    name: string
    tValue: string
  }>
}) {
  return ZXR.post({
    url: `/zhpgxt/zhpgCreateTable/updateTable`,
    data
  })
}

// 删除表数据行
export function deleteTableRow(data: {
  updateId: string | number
  tableName: string
}) {
  return ZXR.post({
    url: `/zhpgxt/zhpgCreateTable/deleteTable`,
    data
  })
}

// 数据转换 - 脏数据检测
export function dirtyDataDetection(tableName: string, data: {
  zsjSelectDataList: Array<{
    name: string
    type: string
    regexp: string
  }>
}) {
  return ZXR.post({
    url: `/zhpgxt/zhpgCreateTable/dataConversion/dirtyDataDetection/${encodeURIComponent(tableName)}`,
    data
  })
}

// 数据转换 - 缺失值填充
export function missingValueFill(tableName: string, data: {
  qszSelectDataList: Array<{
    name: string
    value: string
  }>
}) {
  return ZXR.post({
    url: `/zhpgxt/zhpgCreateTable/dataConversion/missingValueFill/${encodeURIComponent(tableName)}`,
    data
  })
}

// 数据转换 - 野值剔除
export function outlierRemoval(tableName: string, data: {
  fields: string[]
  minValue?: number
  maxValue?: number
}) {
  return ZXR.post({
    url: `/zhpgxt/zhpgCreateTable/dataConversion/outlierRemoval/${encodeURIComponent(tableName)}`,
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
  deleteTable,
  deleteTableRow,
  getTableStructure,
  getTableField,
  insertTable,
  updateTableRow,
  migrationToLocalHost: migrationDatasetToLocalHost,
  createTable,
  modifyTable,
  updateDataset,
  dirtyDataDetection,
  missingValueFill,
  outlierRemoval
}