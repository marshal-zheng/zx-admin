/**
 * JavaScript 版本的事件系统统一入口
 * 从 TypeScript 版本转换而来，保持所有功能不变
 */

// 内部导入，用于函数内部使用
import { createEventBus } from './EventBus'
import {
  createEventNamespace,
  createEventType,
  eventFactory,
  getRegisteredEvents
} from './eventFactory'

// 导出事件工厂相关功能
export {
  eventFactory,
  createEventType,
  createEventWithPayloadType,
  isEventRegistered,
  getRegisteredEvents,
  clearRegisteredEvents,
  unregisterEvent,
  createLegacyEvents,
  createEventTypes,
  createEventNamespace,
  getEventFactoryConfig
} from './eventFactory'

// 导出类型和工具函数
export {
  BusEventBase,
  BusEventWithPayload,
  createBusEventType,
  createBusEventWithPayloadType,
  isBusEvent,
  isBusEventType,
  createUnsubscribable,
  SimpleObservable,
  wrapLegacyHandler,
  isLegacyEvent,
  getEventIdentifier,
  EventBusInterface,
  implementsEventBus,
  implementsLegacyEmitter
} from './types'

// 导出事件总线相关功能
export { EventBusSrv, createEventBus, isValidEventBus, defaultEventBus } from './EventBus'

// 为了保持与原 TypeScript 版本的兼容性，提供一些别名
export { EventBusSrv as EventBus } from './EventBus'
export { defaultEventBus as eventBus } from './EventBus'

/**
 * 快速创建和配置事件系统的便捷函数
 */

/**
 * 创建完整的事件系统实例
 * @param {Object} options - 配置选项
 * @param {boolean} options.enableLegacy - 是否启用 Legacy 支持（默认 true）
 * @param {string} options.namespace - 事件命名空间（可选）
 * @returns {Object} 事件系统实例
 */
export function createEventSystem(options: any = {}) {
  const { enableLegacy = true, namespace } = options

  const eventBus = createEventBus()
  const eventNamespace = namespace ? createEventNamespace(namespace) : null

  return {
    // 事件总线实例
    eventBus,

    // 命名空间（如果提供）
    namespace: eventNamespace,

    // 便捷方法
    publish: eventBus.publish.bind(eventBus),
    subscribe: eventBus.subscribe.bind(eventBus),
    getStream: eventBus.getStream.bind(eventBus),

    // Legacy 方法（如果启用）
    ...(enableLegacy && {
      emit: eventBus.emit.bind(eventBus),
      on: eventBus.on.bind(eventBus),
      off: eventBus.off.bind(eventBus),
      once: eventBus.once.bind(eventBus)
    }),

    // 工厂方法
    createEvent:
      namespace && eventNamespace
        ? eventNamespace.createEventType.bind(eventNamespace)
        : createEventType,
    createLegacyEvent:
      namespace && eventNamespace
        ? eventNamespace.createLegacyEvent.bind(eventNamespace)
        : eventFactory,

    // 清理方法
    destroy() {
      eventBus.removeAllListeners()
    },

    // 获取系统信息
    getInfo() {
      return {
        namespace: namespace || null,
        legacyEnabled: enableLegacy,
        eventCount: eventBus.eventNames().length,
        registeredTypes: getRegisteredEvents()
      }
    }
  }
}

/**
 * 创建简单的事件发布订阅系统
 * @returns {Object} 简化的事件系统
 */
export function createSimpleEventSystem() {
  const eventBus = createEventBus()

  return {
    /**
     * 发布事件
     * @param {string} type - 事件类型
     * @param {any} payload - 事件载荷
     */
    publish(type, payload) {
      eventBus.emit(type, payload)
    },

    /**
     * 订阅事件
     * @param {string} type - 事件类型
     * @param {Function} handler - 处理函数
     * @returns {Function} 取消订阅函数
     */
    subscribe(type, handler) {
      eventBus.on(type, handler)
      return () => eventBus.off(type, handler)
    },

    /**
     * 一次性订阅
     * @param {string} type - 事件类型
     * @param {Function} handler - 处理函数
     */
    once(type, handler) {
      eventBus.once(type, handler)
    },

    /**
     * 取消订阅
     * @param {string} type - 事件类型
     * @param {Function} handler - 处理函数
     */
    unsubscribe(type, handler) {
      eventBus.off(type, handler)
    },

    /**
     * 清除所有订阅
     */
    clear() {
      eventBus.removeAllListeners()
    }
  }
}

/**
 * 获取事件系统的版本信息
 * @returns {Object} 版本信息
 */
export function getVersion() {
  return {
    version: '1.0.0',
    source: 'TypeScript to JavaScript conversion',
    features: {
      modernEvents: true,
      legacyEvents: true,
      observables: true,
      namespaces: true,
      typescript: false,
      javascript: true
    },
    dependencies: {
      eventemitter3: '^4.0.0 || ^5.0.0'
    }
  }
}

/**
 * 验证事件系统的完整性
 * @returns {Object} 验证结果
 */
export function validateEventSystem() {
  const results: any = {
    valid: true,
    errors: [],
    warnings: []
  }

  try {
    // 测试基本功能
    const testBus = createEventBus()
    const TestEvent = createEventType('test')

    // 测试现代事件
    let received = false
    const unsubscribe = testBus.subscribe(TestEvent, () => {
      received = true
    })

    testBus.publish(new TestEvent('test payload'))

    if (!received) {
      results.errors.push('Modern event system not working')
      results.valid = false
    }

    unsubscribe.unsubscribe()

    // 测试 Legacy 事件
    let legacyReceived = false
    testBus.on('legacy-test', () => {
      legacyReceived = true
    })

    testBus.emit('legacy-test', 'test payload')

    if (!legacyReceived) {
      results.errors.push('Legacy event system not working')
      results.valid = false
    }

    testBus.removeAllListeners()
  } catch (error: any) {
    results.errors.push(`Validation error: ${error.message}`)
    results.valid = false
  }

  return results
}

// 默认导出主要的事件总线实例（通过重导出避免本地未定义标识符问题）
export { defaultEventBus as default } from './EventBus'
