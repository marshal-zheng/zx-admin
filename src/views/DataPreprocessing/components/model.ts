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

// 字段类型枚举
export enum FieldType {
  /** 字符串 */
  VARCHAR = 'varchar',
  /** 整型 */
  INT = 'int',
  /** 文本 */
  TEXT = 'text',
  /** 时间 */
  DATETIME = 'datetime',
  /** 浮点型 */
  DOUBLE = 'double'
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

// 字段类型选项配置
export interface FieldTypeOption {
  label: string
  value: FieldType
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

// 字段类型选项列表
export const FIELD_TYPE_OPTIONS: FieldTypeOption[] = [
  {
    label: '字符串',
    value: FieldType.VARCHAR
  },
  {
    label: '整型',
    value: FieldType.INT
  },
  {
    label: '文本',
    value: FieldType.TEXT
  },
  {
    label: '时间',
    value: FieldType.DATETIME
  },
  {
    label: '浮点型',
    value: FieldType.DOUBLE
  }
]

// 数据转换类型枚举
export enum DataConversionType {
  /** 脏数据检测 */
  DIRTY_DATA_DETECTION = 'dirtyDataDetection',
  /** 缺失值填充 */
  MISSING_VALUE_FILL = 'missingValueFill',
  /** 野值剔除 */
  OUTLIER_REMOVAL = 'outlierRemoval'
}

// 检测方式枚举
export enum DetectionMethod {
  /** 空值检测 */
  IS_NOT_NULL = 'isNotNull',
  /** 格式错误检测 */
  FORMAT_ERROR = 'formatError'
}

// 数据转换类型选项配置
export interface DataConversionTypeOption {
  label: string
  value: DataConversionType
}

// 检测方式选项配置
export interface DetectionMethodOption {
  label: string
  value: DetectionMethod
}

// 数据转换类型选项列表
export const DATA_CONVERSION_TYPE_OPTIONS: DataConversionTypeOption[] = [
  {
    label: '脏数据检测',
    value: DataConversionType.DIRTY_DATA_DETECTION
  },
  {
    label: '缺失值填充',
    value: DataConversionType.MISSING_VALUE_FILL
  },
  {
    label: '野值剔除',
    value: DataConversionType.OUTLIER_REMOVAL
  }
]

// 检测方式选项列表
export const DETECTION_METHOD_OPTIONS: DetectionMethodOption[] = [
  {
    label: '空值检测',
    value: DetectionMethod.IS_NOT_NULL
  },
  {
    label: '格式错误检测',
    value: DetectionMethod.FORMAT_ERROR
  }
]
