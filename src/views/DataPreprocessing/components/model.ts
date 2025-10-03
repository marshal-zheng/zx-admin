/**
 * 数据预处理模块类型定义
 */

// 数据库类型枚举
export enum DatabaseType {
  MYSQL = 1, // MySql数据库
  DM = 2 // 达梦数据库
}

// 创建类型枚举
export enum CreateType {
  /** 人工建表 */
  MANUAL = 1,
  /** 外表导入 */
  EXTERNAL_IMPORT = 2,
  /** 文件导入 */
  FILE_IMPORT = 3
}

// 处理状态枚举
export enum HandType {
  /** 未处理 */
  UNPROCESSED = 0,
  /** 已处理 */
  PROCESSED = 1
}

// 创建类型选项配置
export interface CreateTypeOption {
  label: string
  value: CreateType
  color?: string
}

// 处理状态选项配置
export interface HandTypeOption {
  label: string
  value: HandType
  color?: string
}

// 创建类型选项列表
export const CREATE_TYPE_OPTIONS: CreateTypeOption[] = [
  {
    label: '人工建表',
    value: CreateType.MANUAL,
    color: 'primary'
  },
  {
    label: '外表导入',
    value: CreateType.EXTERNAL_IMPORT,
    color: 'warning'
  },
  {
    label: '文件导入',
    value: CreateType.FILE_IMPORT,
    color: 'info'
  }
]

// 处理状态选项列表
export const HAND_TYPE_OPTIONS: HandTypeOption[] = [
  {
    label: '未处理',
    value: HandType.UNPROCESSED,
    color: 'warning'
  },
  {
    label: '已处理',
    value: HandType.PROCESSED,
    color: 'success'
  }
]

// 数据库类型选项接口
export interface DatabaseTypeOption {
  label: string
  value: DatabaseType
}

// 数据库类型选项列表
export const DATABASE_TYPE_OPTIONS: DatabaseTypeOption[] = [
  {
    label: 'MySql数据库',
    value: DatabaseType.MYSQL
  },
  {
    label: '达梦数据库',
    value: DatabaseType.DM
  }
]
