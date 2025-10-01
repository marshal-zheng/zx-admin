/**
 * JavaScript 版本的事件工厂实现
 * 从 TypeScript 版本转换而来，保持所有功能不变
 */

// 用于跟踪已定义的事件类型，防止重复定义
const typeList = new Set()

/**
 * 创建 Legacy 应用事件
 * @param {string} name - 事件名称
 * @returns {Object} Legacy 事件对象
 * @throws {Error} 如果事件名称已存在
 */
export function eventFactory(name: string) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Event name must be a non-empty string')
  }

  if (typeList.has(name)) {
    throw new Error(`There is already an event defined with type '${name}'`)
  }

  typeList.add(name)
  return { name }
}

/**
 * 创建现代事件类型构造函数
 * @param {string} type - 事件类型名称
 * @returns {Function} 事件构造函数
 * @throws {Error} 如果事件类型已存在
 */
export function createEventType(type: string) {
  if (typeof type !== 'string' || type.trim() === '') {
    throw new Error('Event type must be a non-empty string')
  }

  if (typeList.has(type)) {
    throw new Error(`There is already an event defined with type '${type}'`)
  }

  typeList.add(type)

  // 创建事件构造函数
  class EventType {
    static type = type
    type: string
    payload: any

    constructor(payload?: any) {
      this.type = type
      this.payload = payload
    }
  }

  // 确保静态属性正确设置
  EventType.type = type

  return EventType
}

/**
 * 创建带载荷的事件类型构造函数
 * @param {string} type - 事件类型名称
 * @returns {Function} 事件构造函数
 * @throws {Error} 如果事件类型已存在
 */
export function createEventWithPayloadType(type: string) {
  if (typeof type !== 'string' || type.trim() === '') {
    throw new Error('Event type must be a non-empty string')
  }

  if (typeList.has(type)) {
    throw new Error(`There is already an event defined with type '${type}'`)
  }

  typeList.add(type)

  // 创建带载荷的事件构造函数
  class EventWithPayloadType {
    static type = type
    type: string
    payload: any

    constructor(payload: any) {
      if (payload === undefined) {
        throw new Error(`Event of type '${type}' requires a payload`)
      }
      this.type = type
      this.payload = payload
    }
  }

  // 确保静态属性正确设置
  EventWithPayloadType.type = type

  return EventWithPayloadType
}

/**
 * 检查事件类型是否已注册
 * @param {string} name - 事件名称或类型
 * @returns {boolean} 是否已注册
 */
export function isEventRegistered(name) {
  return typeList.has(name)
}

/**
 * 获取所有已注册的事件类型
 * @returns {Array<string>} 事件类型数组
 */
export function getRegisteredEvents() {
  return Array.from(typeList)
}

/**
 * 清除所有已注册的事件类型（主要用于测试）
 * @param {boolean} force - 是否强制清除（默认 false）
 */
export function clearRegisteredEvents(force = false) {
  if (force || process.env.NODE_ENV === 'test') {
    typeList.clear()
  } else {
    console.warn('clearRegisteredEvents should only be used in test environment')
  }
}

/**
 * 移除特定的事件类型注册
 * @param {string} name - 要移除的事件名称或类型
 * @returns {boolean} 是否成功移除
 */
export function unregisterEvent(name) {
  return typeList.delete(name)
}

/**
 * 批量创建 Legacy 事件
 * @param {Array<string>} names - 事件名称数组
 * @returns {Object} 事件对象映射
 */
export function createLegacyEvents(names) {
  if (!Array.isArray(names)) {
    throw new Error('Names must be an array')
  }

  const events = {}

  for (const name of names) {
    events[name] = eventFactory(name)
  }

  return events
}

/**
 * 批量创建现代事件类型
 * @param {Array<string>} types - 事件类型数组
 * @returns {Object} 事件类型构造函数映射
 */
export function createEventTypes(types) {
  if (!Array.isArray(types)) {
    throw new Error('Types must be an array')
  }

  const eventTypes = {}

  for (const type of types) {
    eventTypes[type] = createEventType(type)
  }

  return eventTypes
}

/**
 * 创建事件命名空间
 * @param {string} namespace - 命名空间名称
 * @returns {Object} 命名空间对象
 */
export function createEventNamespace(namespace) {
  if (typeof namespace !== 'string' || namespace.trim() === '') {
    throw new Error('Namespace must be a non-empty string')
  }

  return {
    /**
     * 在命名空间中创建 Legacy 事件
     * @param {string} name - 事件名称
     * @returns {Object} Legacy 事件对象
     */
    createLegacyEvent(name) {
      const fullName = `${namespace}:${name}`
      return eventFactory(fullName)
    },

    /**
     * 在命名空间中创建现代事件类型
     * @param {string} type - 事件类型
     * @returns {Function} 事件构造函数
     */
    createEventType(type) {
      const fullType = `${namespace}:${type}`
      return createEventType(fullType)
    },

    /**
     * 在命名空间中创建带载荷的事件类型
     * @param {string} type - 事件类型
     * @returns {Function} 事件构造函数
     */
    createEventWithPayloadType(type) {
      const fullType = `${namespace}:${type}`
      return createEventWithPayloadType(fullType)
    },

    /**
     * 获取命名空间名称
     * @returns {string} 命名空间名称
     */
    getNamespace() {
      return namespace
    }
  }
}

/**
 * 验证事件工厂的配置
 * @returns {Object} 配置信息
 */
export function getEventFactoryConfig() {
  return {
    registeredEventsCount: typeList.size,
    registeredEvents: getRegisteredEvents(),
    version: '1.0.0',
    features: {
      legacyEvents: true,
      modernEvents: true,
      namespaces: true,
      batchCreation: true
    }
  }
}
