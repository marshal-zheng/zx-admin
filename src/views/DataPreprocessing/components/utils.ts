import {
  DatabaseType,
  DatabaseTypeOption,
  CreateType,
  CreateTypeOption,
  HandType,
  HandTypeOption,
  DATABASE_TYPE_OPTIONS,
  CREATE_TYPE_OPTIONS,
  HAND_TYPE_OPTIONS
} from './model'

// ===== 创建类型相关工具函数 =====

// 工具函数：根据创建类型获取选项配置
export function getCreateTypeOption(type: CreateType): CreateTypeOption | undefined {
  return CREATE_TYPE_OPTIONS.find((option) => option.value === type)
}

// 工具函数：获取创建类型文本
export function getCreateTypeText(type: CreateType): string {
  return getCreateTypeOption(type)?.label || '未知'
}

// 工具函数：获取创建类型颜色
export function getCreateTypeColor(type: CreateType): string {
  return getCreateTypeOption(type)?.color || 'default'
}

// ===== 处理状态相关工具函数 =====

// 工具函数：根据处理状态获取选项配置
export function getHandTypeOption(type: HandType): HandTypeOption | undefined {
  return HAND_TYPE_OPTIONS.find((option) => option.value === type)
}

// 工具函数：获取处理状态文本
export function getHandTypeText(type: HandType): string {
  return getHandTypeOption(type)?.label || '未知'
}

// 工具函数：获取处理状态颜色
export function getHandTypeColor(type: HandType): string {
  return getHandTypeOption(type)?.color || 'default'
}

// ===== 数据库类型相关工具函数 =====

// 工具函数：根据数据库类型获取选项配置
export function getDatabaseTypeOption(type: DatabaseType): DatabaseTypeOption | undefined {
  return DATABASE_TYPE_OPTIONS.find((option) => option.value === type)
}

// 工具函数：获取数据库类型文本
export function getDatabaseTypeText(type: DatabaseType): string {
  return getDatabaseTypeOption(type)?.label || '未知类型'
}

// 工具函数：获取数据库类型选项
export function getDatabaseTypeOptions(): DatabaseTypeOption[] {
  return DATABASE_TYPE_OPTIONS
}

// 验证数据库类型是否有效
export function isValidDatabaseType(type: any): type is DatabaseType {
  return Object.values(DatabaseType).includes(type)
}

// 获取数据库类型名称
export function getDatabaseTypeName(type: DatabaseType): string {
  switch (type) {
    case DatabaseType.MYSQL:
      return 'MySql数据库'
    case DatabaseType.DM:
      return '达梦数据库'
    default:
      return '未知类型'
  }
}
