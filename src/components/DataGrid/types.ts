import type { Component, VNode } from 'vue'

/**
 * Column configuration for DataGrid
 */
export interface DataGridColumn {
  /** Unique column key */
  key: string
  /** Column data property name */
  dataKey: string
  /** Column header title */
  title: string
  /** Column width */
  width?: number
  /** Minimum width */
  minWidth?: number
  /** Maximum width */
  maxWidth?: number
  /** Cell input type */
  type?: 'input' | 'select' | 'number' | 'textarea' | 'datePicker' | 'switch' | 'custom'
  /** Options for select type */
  options?: SelectOption[]
  /** Validation rules (Element Plus format) */
  rules?: ValidationRule[]
  /** Placeholder text */
  placeholder?: string
  /** Default value when adding new row */
  defaultValue?: any
  /** Whether column is disabled */
  disabled?: boolean
  /** Custom cell renderer component */
  cellRenderer?: Component
  /** Custom component for editable cell */
  component?: Component
  /** Row-based resolver for editable component */
  componentResolver?: (row: any, index: number) => Component
  /** Custom formatter function for display */
  formatter?: (value: any, row: any) => string
  /** Additional props to pass to cell component */
  cellProps?: Record<string, any>
  /** Dynamic props to pass to custom component */
  componentProps?: Record<string, any> | ((row: any, index: number) => Record<string, any>)
  /** Column alignment */
  align?: 'left' | 'center' | 'right'
  /** Whether column is fixed */
  fixed?: boolean | 'left' | 'right'
  /** Whether column is sortable */
  sortable?: boolean
  /** Custom header renderer */
  headerRenderer?: Component | ((props: HeaderRendererProps) => VNode)
}

/**
 * Select option interface
 */
export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
  [key: string]: any
}

/**
 * Validation rule interface (compatible with Element Plus)
 */
export interface ValidationRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change' | 'blur,change'
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'enum'
    | 'date'
    | 'url'
    | 'hex'
    | 'email'
    | 'any'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (rule: any, value: any, callback: (error?: Error) => void) => void
  [key: string]: any
}

/**
 * Cell renderer props
 */
export interface CellRendererProps {
  modelValue: any
  row: any
  column: DataGridColumn
  index: number
  disabled?: boolean
}

/**
 * Header renderer props
 */
export interface HeaderRendererProps {
  column: DataGridColumn
  index: number
}

/**
 * Row class function type
 */
export type RowClassFunction = (row: any, index: number) => string

/**
 * Delete disable function type
 */
export type DeleteDisableFunction = (row: any, index: number) => boolean

/**
 * Grid events
 */
export interface DataGridEmits {
  'update:modelValue': (value: any[]) => void
  add: (row: any) => void
  delete: (index: number, row: any) => void
  change: (data: any[]) => void
  'cell-change': (row: any, key: string, value: any, index: number) => void
  'row-click': (row: any, index: number) => void
}

/**
 * Grid expose methods
 */
export interface DataGridExpose {
  tableRef: any
  tableData: any[]
  addRow: () => void
  deleteRow: (index: number) => void
}
