import cloneDeep from 'lodash-es/cloneDeep'

const deepClone = (value) => {
  if (value == null || typeof value !== 'object') {
    return value
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch (error) {
      if (import.meta.env?.DEV) {
        console.debug('[indicatorHelper] structuredClone fallback, using cloneDeep instead.', error)
      }
    }
  }

  try {
    return cloneDeep(value)
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.debug('[indicatorHelper] cloneDeep failed, attempting JSON fallback.', error)
    }
  }

  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error('[indicatorHelper] deepClone failed. Returning source reference.', error)
    }
  }

  return value
}

const ensureObject = (value, fallback = {}) => {
  return value && typeof value === 'object' ? value : deepClone(fallback)
}

export const createEmptyNodeData = () => ({
  id: '',
  type: '',
  label: '',
  x: 0,
  y: 0,
  properties: {
    content: {
      id: '',
      label: ''
    },
    weight: 0,
    otherData: {},
    parentNodeId: '',
    customType: '',
    customProperties: '',
    unit: '',
    priority: '',
    defaultValue: '',
    notes: '',
    level: 0
  }
})

export const cloneNodeForForm = (nodeLike = {}) => {
  const base = createEmptyNodeData()
  const sanitizedSource = { ...nodeLike }
  if (sanitizedSource && typeof sanitizedSource === 'object') {
    delete sanitizedSource.originalData
  }
  const source = deepClone(sanitizedSource)

  const properties = ensureObject(source.properties, base.properties)
  const content = ensureObject(properties.content, base.properties.content)
  const otherData = ensureObject(properties.otherData, {})

  const merged = {
    ...base,
    ...source,
    properties: {
      ...base.properties,
      ...properties,
      content: {
        ...base.properties.content,
        ...content
      },
      otherData
    }
  }

  const label = merged.properties.content.label || merged.label || ''
  merged.label = label
  merged.properties.content.label = label
  merged.properties.weight = Number(merged.properties.weight) || 0

  return merged
}

export const prepareNodeSubmitData = (formNode, options = {}) => {
  const { isLeafNode = true } = options
  const node = cloneNodeForForm(formNode)

  node.properties.weight = Number(node.properties.weight) || 0

  if (!isLeafNode) {
    node.properties.otherData = {}
  }

  // 保证 label 一致
  const label = node.properties.content.label || node.label || ''
  node.label = label
  node.properties.content.label = label

  return node
}
