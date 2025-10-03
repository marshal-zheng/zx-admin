// 数据库类型枚举
export enum DatabaseType {
  MYSQL = 1, // MySql数据库
  DM = 2 // 达梦数据库
}

// 数据源基本信息接口
export interface DataSourceInfo {
  baseId?: string | number
  baseName: string
  baseType: DatabaseType
  baseIp: string
  basePort: string | number
  baseDataName: string
  baseUser: string
  basePassword: string
}

// 数据源表单数据接口
export interface DataSourceFormData {
  baseName: string
  baseType: DatabaseType | null
  baseIp: string
  basePort: string
  baseDataName: string
  baseUser: string
  basePassword: string
}

// 数据源列表查询参数接口
export interface DataSourceQueryParams {
  pageNumber?: number
  pageSize?: number
  keyword?: string
  baseType?: DatabaseType | null
}

// 数据源列表响应接口
export interface DataSourceListResponse {
  records: DataSourceInfo[]
  total: number
  current: number
  size: number
}

// 表信息接口
export interface TableInfo {
  tableName: string
  tableComment?: string
  tableType?: string
}

// 表列表查询参数接口
export interface TableQueryParams {
  pageNumber?: number
  pageSize?: number
  keyword?: string
}

// 表列表响应接口
export interface TableListResponse {
  records: TableInfo[]
  total: number
  current: number
  size: number
}

// 数据库类型选项接口
export interface DatabaseTypeOption {
  label: string
  value: DatabaseType
}
