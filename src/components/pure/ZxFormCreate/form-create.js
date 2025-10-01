// 表单字段类型配置

// 由于项目没有国际化配置，暂时使用中文占位符
const t = (key) => {
  const translations = {
    'formCreate.PleaseEnter': '请输入',
    'formCreate.PleaseSelect': '请选择'
  }
  return translations[key] || key
}

// 表单字段使用
export const INPUT = {
  type: 'el-input',
  title: '',
  field: 'fieldName',
  value: '',
  props: {
    placeholder: t('formCreate.PleaseEnter'),
    maxlength: 255,
    clearable: true
  }
}

export const SELECT = {
  type: 'el-select',
  field: 'fieldName',
  title: '',
  value: '',
  options: [],
  props: {
    multiple: false,
    placeholder: t('formCreate.PleaseSelect'),
    clearable: true
  }
}

export const MULTIPLE_SELECT = {
  type: 'el-select',
  field: 'fieldName',
  title: '',
  value: [],
  options: [],
  props: {
    multiple: true,
    placeholder: t('formCreate.PleaseSelect'),
    clearable: true
  }
}

export const RADIO = {
  type: 'el-radio-group',
  field: 'fieldName',
  title: '',
  value: '',
  options: []
}

export const CHECKBOX = {
  type: 'el-checkbox-group',
  field: 'fieldName',
  title: '',
  value: [],
  options: []
}

export const MEMBER = {
  type: 'el-select',
  field: 'fieldName',
  title: '',
  value: '',
  options: [],
  props: {
    multiple: false,
    placeholder: t('formCreate.PleaseSelect'),
    clearable: true
  }
}

export const MULTIPLE_MEMBER = {
  type: 'el-select',
  field: 'fieldName',
  title: '',
  value: [],
  options: [],
  props: {
    multiple: true,
    placeholder: t('formCreate.PleaseSelect'),
    clearable: true
  }
}

export const DATE = {
  type: 'el-date-picker',
  field: 'fieldName',
  title: '',
  value: '',
  props: {
    placeholder: t('formCreate.PleaseSelect'),
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  }
}

export const DATETIME = {
  type: 'el-date-picker',
  field: 'fieldName',
  title: '',
  value: '',
  props: {
    placeholder: t('formCreate.PleaseSelect'),
    format: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    type: 'datetime'
  }
}

export const FLOAT = {
  type: 'el-input-number',
  field: 'fieldName',
  title: '',
  value: 0.0,
  props: {
    precision: 2,
    placeholder: t('formCreate.PleaseEnter')
  }
}

export const INT = {
  type: 'el-input-number',
  field: 'fieldName',
  title: '',
  value: 0,
  props: {
    precision: 0,
    max: 999999999999999,
    min: -999999999999999,
    placeholder: t('formCreate.PleaseEnter')
  }
}

export const MULTIPLE_INPUT = {
  type: 'ZxTagsInput',
  field: 'fieldName',
  title: '',
  value: [],
  props: {
    placeholder: t('formCreate.PleaseEnter')
  }
}

export const TEXTAREA = {
  type: 'el-input',
  field: 'fieldName',
  title: '',
  value: '',
  props: {
    type: 'textarea',
    placeholder: t('formCreate.PleaseEnter'),
    maxlength: 1000,
    showWordLimit: true,
    autosize: { minRows: 1 }
  }
}

export const JIRAKEY = {
  type: 'JiraKey',
  field: 'jiraKey',
  title: '',
  value: '',
  props: {
    modelValue: '',
    instructionsIcon: ''
  }
}

export const PASSWORD = {
  type: 'PassWord',
  field: 'fieldName',
  title: '',
  value: '',
  props: {
    modelValue: '',
    instructionsIcon: '',
    clearable: true
  }
}

export const CASCADER = {
  type: 'el-cascader',
  field: 'fieldName',
  title: '',
  value: [],
  props: {
    clearable: true
  }
}

export const TIME = {
  type: 'el-time-picker',
  field: 'fieldName',
  title: '',
  value: '',
  props: {
    placeholder: t('formCreate.PleaseSelect'),
    format: 'HH:mm:ss',
    valueFormat: 'HH:mm:ss'
  }
}

export const FieldTypeFormRules = {
  INPUT,
  TIME,
  SELECT,
  MULTIPLE_SELECT,
  RADIO,
  CHECKBOX,
  MEMBER,
  MULTIPLE_MEMBER,
  DATE,
  DATETIME,
  INT,
  FLOAT,
  MULTIPLE_INPUT,
  TEXTAREA,
  JIRAKEY,
  PASSWORD,
  CASCADER
}
