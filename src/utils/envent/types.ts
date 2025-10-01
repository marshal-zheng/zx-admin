/**
 * JavaScript 版本的事件系统类型定义
 * 从 TypeScript 版本转换而来，保持所有功能不变
 */

/**
 * @alpha
 * Base event type
 */
export class BusEventBase {
  type: string
  payload: any

  constructor() {
    // 获取构造函数的 type 属性
    this.type = (this.constructor as any).type
    this.payload = undefined
  }
}

/**
 * @alpha
 * Base event type with payload
 */
export class BusEventWithPayload extends BusEventBase {
  constructor(payload: any) {
    super()
    this.payload = payload
  }
}

/**
 * 创建事件类型构造函数的工厂函数
 * @param {string} type - 事件类型名称
 * @returns {Function} 事件构造函数
 */
export function createBusEventType(type: string) {
  class EventType extends BusEventBase {
    static type = type

    constructor(payload?: any) {
      super()
      if (payload !== undefined) {
        this.payload = payload
      }
    }
  }

  EventType.type = type
  return EventType
}

/**
 * 创建带载荷的事件类型构造函数的工厂函数
 * @param {string} type - 事件类型名称
 * @returns {Function} 事件构造函数
 */
export function createBusEventWithPayloadType(type: string) {
  class EventWithPayloadType extends BusEventWithPayload {
    static type = type

    constructor(payload: any) {
      super(payload)
    }
  }

  EventWithPayloadType.type = type
  return EventWithPayloadType
}

/**
 * 验证是否为有效的 BusEvent
 * @param {any} event - 要验证的事件对象
 * @returns {boolean} 是否为有效事件
 */
export function isBusEvent(event) {
  return event && typeof event === 'object' && typeof event.type === 'string'
}

/**
 * 验证是否为有效的事件类型构造函数
 * @param {any} eventType - 要验证的事件类型
 * @returns {boolean} 是否为有效事件类型
 */
export function isBusEventType(eventType) {
  return typeof eventType === 'function' && typeof eventType.type === 'string'
}

/**
 * 创建简单的 Unsubscribable 对象
 * @param {Function} unsubscribeFn - 取消订阅的函数
 * @returns {Object} Unsubscribable 对象
 */
export function createUnsubscribable(unsubscribeFn) {
  return {
    unsubscribe: unsubscribeFn
  }
}

/**
 * 简单的 Observable 实现
 * 用于替代 rxjs 的 Observable
 */
export class SimpleObservable {
  private subscribeFn: (observer: any) => (() => void) | void

  constructor(subscribeFn: (observer: any) => (() => void) | void) {
    this.subscribeFn = subscribeFn
  }

  subscribe(observerOrNext: any, error?: any, complete?: any) {
    let observer

    if (typeof observerOrNext === 'function') {
      observer = {
        next: observerOrNext,
        error: error || (() => {}),
        complete: complete || (() => {})
      }
    } else {
      observer = observerOrNext || {}
      observer.next = observer.next || (() => {})
      observer.error = observer.error || (() => {})
      observer.complete = observer.complete || (() => {})
    }

    const unsubscribeFn = this.subscribeFn(observer)
    return createUnsubscribable(unsubscribeFn || (() => {}))
  }
}

/**
 * Legacy 事件处理器包装函数
 * @param {Function} handler - 原始处理器
 * @returns {Function} 包装后的处理器
 */
export function wrapLegacyHandler(handler) {
  const wrappedHandler = (emittedEvent) => {
    handler(emittedEvent.payload)
  }

  // 保存原始处理器的引用，用于后续的 off 操作
  wrappedHandler.originalHandler = handler
  handler.wrapper = wrappedHandler

  return wrappedHandler
}

/**
 * 验证是否为 Legacy 事件
 * @param {any} event - 要验证的事件
 * @returns {boolean} 是否为 Legacy 事件
 */
export function isLegacyEvent(event) {
  return event && typeof event === 'object' && typeof event.name === 'string'
}

/**
 * 获取事件的标识符（type 或 name）
 * @param {any} event - 事件对象
 * @returns {string} 事件标识符
 */
export function getEventIdentifier(event) {
  if (typeof event === 'string') {
    return event
  }

  if (isBusEvent(event)) {
    return event.type
  }

  if (isLegacyEvent(event)) {
    return event.name
  }

  throw new Error('Invalid event object')
}

/**
 * 事件总线接口的默认实现检查
 */
export const EventBusInterface = {
  requiredMethods: ['publish', 'subscribe', 'getStream', 'removeAllListeners'],
  legacyMethods: ['emit', 'on', 'off']
}

/**
 * 验证对象是否实现了 EventBus 接口
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否实现了接口
 */
export function implementsEventBus(obj) {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  return EventBusInterface.requiredMethods.every((method) => typeof obj[method] === 'function')
}

/**
 * 验证对象是否实现了 LegacyEmitter 接口
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否实现了接口
 */
export function implementsLegacyEmitter(obj) {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  return EventBusInterface.legacyMethods.every((method) => typeof obj[method] === 'function')
}
