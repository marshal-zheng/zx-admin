// 数据集模块API
import ZXR from '../../http'

// 根据创建表ID查询数据集数据
export function getDatasetByCreateTableId(createTableId: string | number, params = {}) {
  return ZXR.get({
    url: `/zhpgxt/zhpgCreateTable/${createTableId}`,
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
    url: `/zhpgxt/zhpgCreateTable/${createTableId}/detail`
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

// 导出数据集API
export const datasetsApi = {
  getTableData: getDatasetByCreateTableId,
  getDatasetList,
  getDatasetDetail,
  getDatasetFields,
  deleteDataset,
  migrationToLocalHost: migrationDatasetToLocalHost
}
