// 模板类型枚举
export enum TemplateType {
  SYSTEM = 1, // 系统内置
  CUSTOM = 2 // 自定义模板
}

// 模板类型文本映射
export const TemplateTypeText = {
  [TemplateType.SYSTEM]: '系统内置',
  [TemplateType.CUSTOM]: '自定义模板'
}

// 模板类型选项（用于下拉选择等）
export const TemplateTypeOptions = [
  { label: '系统内置', value: TemplateType.SYSTEM },
  { label: '自定义模板', value: TemplateType.CUSTOM }
]
