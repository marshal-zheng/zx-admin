/**
 * JavaScript 版本的事件总线实现
 * 从 TypeScript 版本转换而来，保持所有功能不变
 * 需要安装 eventemitter3: yarn add eventemitter3
 */

import EventEmitter from 'eventemitter3'
import {
  SimpleObservable,
  createUnsubscribable,
  isBusEvent,
  isBusEventType,
  isLegacyEvent,
  getEventIdentifier,
  wrapLegacyHandler,
  implementsEventBus,
  implementsLegacyEmitter
} from './types'

/**
 * @alpha
 * 事件总线服务实现
 * 同时实现现代事件系统和 Legacy 兼容接口
 */
export class EventBusSrv {
  private emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  /**
   * 发布事件
   * @param {Object} event - 要发布的事件对象
   */
  publish(event: any) {
    if (!isBusEvent(event)) {
      throw new Error('Invalid event object: must have a type property')
    }
    this.emitter.emit(event.type, event)
  }

  /**
   * 订阅事件
   * @param {Function} typeFilter - 事件类型构造函数
   * @param {Function} handler - 事件处理函数
   * @returns {Object} Unsubscribable 对象
   */
  subscribe(typeFilter: any, handler: (...args: any[]) => void) {
    if (!isBusEventType(typeFilter)) {
      throw new Error('Invalid event type: must be a constructor function with type property')
    }

    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }

    return this.getStream(typeFilter).subscribe(handler)
  }

  /**
   * 获取事件流
   * @param {Function} eventType - 事件类型构造函数
   * @returns {SimpleObservable} 事件流
   */
  getStream(eventType: any) {
    if (!isBusEventType(eventType)) {
      throw new Error('Invalid event type: must be a constructor function with type property')
    }

    return new SimpleObservable((observer) => {
      const handler = (event: any) => {
        observer.next(event)
      }

      this.emitter.on(eventType.type, handler)

      return () => {
        this.emitter.off(eventType.type, handler)
      }
    })
  }

  /**
   * Legacy 函数：发射事件
   * @param {Object|string} event - 事件对象或事件名称
   * @param {any} payload - 事件载荷
   */
  emit(event: any, payload?: any) {
    if (typeof event === 'string') {
      this.emitter.emit(event, { type: event, payload })
    } else if (isLegacyEvent(event)) {
      this.emitter.emit(event.name, { type: event.name, payload })
    } else {
      throw new Error('Invalid event: must be a string or legacy event object with name property')
    }
  }

  /**
   * Legacy 函数：监听事件
   * @param {Object|string} event - 事件对象或事件名称
   * @param {Function} handler - 事件处理函数
   * @param {Object} scope - 作用域对象（可选）
   */
  on(event: any, handler: (...args: any[]) => void, scope?: any) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }

    // 需要这个包装器来使旧事件与旧处理器兼容
    const wrappedHandler = wrapLegacyHandler(handler)

    const eventIdentifier = getEventIdentifier(event)
    this.emitter.on(eventIdentifier, wrappedHandler)

    // 如果提供了作用域，在作用域销毁时自动取消监听
    if (scope && typeof scope.$on === 'function') {
      const unbind = scope.$on('$destroy', () => {
        this.off(event, handler)
        unbind()
      })
    }
  }

  /**
   * Legacy 函数：取消监听事件
   * @param {Object|string} event - 事件对象或事件名称
   * @param {Function} handler - 要取消的事件处理函数
   */
  off(event: any, handler: (...args: any[]) => void) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }

    const eventIdentifier = getEventIdentifier(event)

    // 使用包装器中保存的引用
    if ((handler as any).wrapper) {
      this.emitter.off(eventIdentifier, (handler as any).wrapper)
    } else {
      // 如果没有包装器，尝试直接移除（可能不会成功，但保持兼容性）
      this.emitter.off(eventIdentifier, handler)
    }
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners() {
    this.emitter.removeAllListeners()
  }

  /**
   * 获取指定事件的监听器数量
   * @param {string} eventName - 事件名称
   * @returns {number} 监听器数量
   */
  listenerCount(eventName: string) {
    return this.emitter.listenerCount(eventName)
  }

  /**
   * 获取所有事件名称
   * @returns {Array<string>} 事件名称数组
   */
  eventNames() {
    return this.emitter.eventNames()
  }

  /**
   * 获取指定事件的所有监听器
   * @param {string} eventName - 事件名称
   * @returns {Array<Function>} 监听器数组
   */
  listeners(eventName: string) {
    return this.emitter.listeners(eventName)
  }

  /**
   * 一次性监听事件
   * @param {Object|string} event - 事件对象或事件名称
   * @param {Function} handler - 事件处理函数
   */
  once(event: any, handler: (...args: any[]) => void) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }

    const eventIdentifier = getEventIdentifier(event)

    if (typeof event === 'string' || isLegacyEvent(event)) {
      // Legacy 事件需要包装
      const wrappedHandler = wrapLegacyHandler(handler)
      this.emitter.once(eventIdentifier, wrappedHandler)
    } else {
      // 现代事件直接使用
      this.emitter.once(eventIdentifier, handler)
    }
  }

  /**
   * 在指定位置插入监听器（如果EventEmitter支持的话）
   * @param {Object|string} event - 事件对象或事件名称
   * @param {Function} handler - 事件处理函数
   */
  prependListener(event: any, handler: (...args: any[]) => void) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }

    const eventIdentifier = getEventIdentifier(event)

    if (typeof event === 'string' || isLegacyEvent(event)) {
      // Legacy 事件需要包装
      const wrappedHandler = wrapLegacyHandler(handler)
      // 如果不支持prependListener，使用普通的on
      if (typeof (this.emitter as any).prependListener === 'function') {
        ;(this.emitter as any).prependListener(eventIdentifier, wrappedHandler)
      } else {
        this.emitter.on(eventIdentifier, wrappedHandler)
      }
    } else {
      // 现代事件直接使用
      if (typeof (this.emitter as any).prependListener === 'function') {
        ;(this.emitter as any).prependListener(eventIdentifier, handler)
      } else {
        this.emitter.on(eventIdentifier, handler)
      }
    }
  }

  /**
   * 在指定位置插入一次性监听器（如果EventEmitter支持的话）
   * @param {Object|string} event - 事件对象或事件名称
   * @param {Function} handler - 事件处理函数
   */
  prependOnceListener(event: any, handler: (...args: any[]) => void) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }

    const eventIdentifier = getEventIdentifier(event)

    if (typeof event === 'string' || isLegacyEvent(event)) {
      // Legacy 事件需要包装
      const wrappedHandler = wrapLegacyHandler(handler)
      // 如果不支持prependOnceListener，使用普通的once
      if (typeof (this.emitter as any).prependOnceListener === 'function') {
        ;(this.emitter as any).prependOnceListener(eventIdentifier, wrappedHandler)
      } else {
        this.emitter.once(eventIdentifier, wrappedHandler)
      }
    } else {
      // 现代事件直接使用
      if (typeof (this.emitter as any).prependOnceListener === 'function') {
        ;(this.emitter as any).prependOnceListener(eventIdentifier, handler)
      } else {
        this.emitter.once(eventIdentifier, handler)
      }
    }
  }
}

/**
 * 创建默认的事件总线实例
 * @returns {EventBusSrv} 事件总线实例
 */
export function createEventBus() {
  return new EventBusSrv()
}

/**
 * 验证事件总线实例
 * @param {any} eventBus - 要验证的事件总线
 * @returns {boolean} 是否为有效的事件总线
 */
export function isValidEventBus(eventBus: any) {
  return implementsEventBus(eventBus) && implementsLegacyEmitter(eventBus)
}

// 导出默认实例（单例模式）
export const defaultEventBus = createEventBus()
