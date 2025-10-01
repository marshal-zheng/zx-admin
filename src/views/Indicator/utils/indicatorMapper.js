const deepClone = (value) => {
  if (value == null || typeof value !== 'object') {
    return value
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch (error) {
      console.warn('[indicatorHelper] structuredClone failed, falling back to JSON clone:', error)
    }
  }

  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    console.warn('[indicatorHelper] deepClone fallback warning:', error)
    return value
  }
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
