# JavaScript 事件系统

这是从 TypeScript 版本完整转换而来的 JavaScript 事件系统，保持了所有原有功能。

## 功能特性

- ✅ **现代事件系统**: 支持类型化事件和 Observable 模式
- ✅ **Legacy 兼容**: 完全兼容旧版事件系统
- ✅ **事件工厂**: 防重复的事件类型创建
- ✅ **命名空间**: 支持事件命名空间
- ✅ **简单 Observable**: 内置轻量级 Observable 实现
- ✅ **错误处理**: 完善的错误检查和处理
- ✅ **性能优化**: 高效的事件发布订阅机制

## 依赖要求

```bash
# 需要安装 eventemitter3
yarn add eventemitter3
```

## 基本使用

### 1. 导入模块

```javascript
import {
  createEventBus,
  eventFactory,
  createEventType,
  createEventSystem
} from './utils/envent-new/index.js'
```

### 2. Legacy 事件使用

```javascript
// 创建事件总线
const eventBus = createEventBus()

// 创建 Legacy 事件
const userLoginEvent = eventFactory('user-login')

// 监听事件
eventBus.on(userLoginEvent, (userData) => {
  console.log('用户登录:', userData)
})

// 发射事件
eventBus.emit(userLoginEvent, { userId: 123, name: 'Alice' })
```

### 3. 现代事件使用

```javascript
// 创建现代事件类型
const UserLoginEvent = createEventType('user-login-modern')

// 订阅事件
const subscription = eventBus.subscribe(UserLoginEvent, (event) => {
  console.log('事件类型:', event.type)
  console.log('事件载荷:', event.payload)
})

// 发布事件
eventBus.publish(new UserLoginEvent({ userId: 456, name: 'Bob' }))

// 取消订阅
subscription.unsubscribe()
```

### 4. 事件流 (Observable)

```javascript
const UserActionEvent = createEventType('user-action')

// 获取事件流
const actionStream = eventBus.getStream(UserActionEvent)

// 订阅流
const streamSub = actionStream.subscribe({
  next: (event) => console.log('流事件:', event),
  error: (err) => console.error('流错误:', err),
  complete: () => console.log('流完成')
})

// 发布事件到流
eventBus.publish(new UserActionEvent('click'))
eventBus.publish(new UserActionEvent('scroll'))

// 取消订阅
streamSub.unsubscribe()
```

## 高级使用

### 1. 完整事件系统

```javascript
// 创建带命名空间的事件系统
const eventSystem = createEventSystem({
  enableLegacy: true,
  namespace: 'myapp'
})

// 使用命名空间创建事件
const MyEvent = eventSystem.createEvent('my-event')
const myLegacyEvent = eventSystem.createLegacyEvent('my-legacy-event')

// 便捷方法
eventSystem.subscribe(MyEvent, (event) => {
  console.log('命名空间事件:', event)
})

eventSystem.publish(new MyEvent('Hello Namespace!'))

// 获取系统信息
console.log(eventSystem.getInfo())

// 清理
eventSystem.destroy()
```

### 2. 简单事件系统

```javascript
// 创建简化的事件系统
const simpleEvents = createSimpleEventSystem()

// 订阅
const unsubscribe = simpleEvents.subscribe('notification', (message) => {
  console.log('通知:', message)
})

// 发布
simpleEvents.publish('notification', '您有新消息')

// 一次性订阅
simpleEvents.once('alert', (message) => {
  console.log('警告:', message)
})

// 取消订阅
unsubscribe()

// 清理所有
simpleEvents.clear()
```

### 3. 事件命名空间

```javascript
import { createEventNamespace } from './utils/envent-new/index.js'

// 创建命名空间
const userNamespace = createEventNamespace('user')
const systemNamespace = createEventNamespace('system')

// 在命名空间中创建事件
const UserLoginEvent = userNamespace.createEventType('login')
const SystemErrorEvent = systemNamespace.createEventType('error')

// 事件类型会自动添加命名空间前缀
console.log(UserLoginEvent.type) // 'user:login'
console.log(SystemErrorEvent.type) // 'system:error'
```

## API 参考

### EventBusSrv 类

#### 现代事件方法

- `publish(event)` - 发布事件
- `subscribe(eventType, handler)` - 订阅事件
- `getStream(eventType)` - 获取事件流
- `removeAllListeners()` - 移除所有监听器

#### Legacy 兼容方法

- `emit(event, payload)` - 发射事件
- `on(event, handler, scope?)` - 监听事件
- `off(event, handler)` - 取消监听
- `once(event, handler)` - 一次性监听

#### 扩展方法

- `listenerCount(eventName)` - 获取监听器数量
- `eventNames()` - 获取所有事件名称
- `listeners(eventName)` - 获取指定事件的监听器
- `prependListener(event, handler)` - 在前面插入监听器
- `prependOnceListener(event, handler)` - 在前面插入一次性监听器

### 工厂函数

#### 事件创建

- `eventFactory(name)` - 创建 Legacy 事件
- `createEventType(type)` - 创建现代事件类型
- `createEventWithPayloadType(type)` - 创建必须带载荷的事件类型

#### 批量创建

- `createLegacyEvents(names)` - 批量创建 Legacy 事件
- `createEventTypes(types)` - 批量创建现代事件类型

#### 管理函数

- `isEventRegistered(name)` - 检查事件是否已注册
- `getRegisteredEvents()` - 获取所有已注册事件
- `clearRegisteredEvents(force?)` - 清除已注册事件（测试用）
- `unregisterEvent(name)` - 取消注册特定事件

### 工具函数

#### 验证函数

- `isBusEvent(event)` - 验证是否为有效事件
- `isBusEventType(eventType)` - 验证是否为有效事件类型
- `isLegacyEvent(event)` - 验证是否为 Legacy 事件
- `implementsEventBus(obj)` - 验证是否实现事件总线接口
- `implementsLegacyEmitter(obj)` - 验证是否实现 Legacy 发射器接口

#### 系统函数

- `createEventBus()` - 创建事件总线实例
- `createEventSystem(options)` - 创建完整事件系统
- `createSimpleEventSystem()` - 创建简单事件系统
- `validateEventSystem()` - 验证事件系统功能
- `getVersion()` - 获取版本信息

## 迁移指南

### 从 TypeScript 版本迁移

1. **导入更改**:

   ```javascript
   // 旧的 TypeScript 导入
   import { EventBusSrv } from './events'

   // 新的 JavaScript 导入
   import { EventBusSrv } from './envent-new'
   ```

2. **类型注解移除**:

   ```javascript
   // TypeScript 版本
   const handler: BusEventHandler<UserLoginEvent> = (event) => {}

   // JavaScript 版本
   const handler = (event) => {}
   ```

3. **接口实现**:

   ```javascript
   // TypeScript 版本
   class MyEventBus implements EventBus {}

   // JavaScript 版本
   class MyEventBus {
     // 实现所有必需方法
   }
   ```

### 功能对比

| 功能         | TypeScript 版本 | JavaScript 版本 | 状态     |
| ------------ | --------------- | --------------- | -------- |
| 现代事件系统 | ✅              | ✅              | 完全兼容 |
| Legacy 事件  | ✅              | ✅              | 完全兼容 |
| Observable   | RxJS            | 内置实现        | 功能等价 |
| 类型检查     | 编译时          | 运行时          | 行为一致 |
| 错误处理     | ✅              | ✅              | 完全兼容 |
| 性能         | 高              | 高              | 相同     |

## 测试和验证

运行测试示例:

```javascript
import { runAllTests, usageExample } from './test-example.js'

// 运行所有功能验证
runAllTests()

// 查看使用示例
usageExample()
```

## 注意事项

1. **依赖**: 需要安装 `eventemitter3` 包
2. **模块**: 使用 ES6 模块语法，确保项目支持
3. **兼容性**: 保持与原 TypeScript 版本 100% 功能兼容
4. **性能**: 在大量事件场景下性能表现良好
5. **内存**: 记得及时取消订阅避免内存泄漏

## 故障排除

### 常见问题

1. **导入错误**: 确保使用正确的文件路径和 `.js` 扩展名
2. **依赖缺失**: 确保已安装 `eventemitter3`
3. **事件重复**: 使用 `isEventRegistered()` 检查事件是否已存在
4. **内存泄漏**: 确保调用 `unsubscribe()` 或 `removeAllListeners()`

### 调试技巧

```javascript
// 获取事件总线状态
const eventBus = createEventBus()
console.log('事件名称:', eventBus.eventNames())
console.log('监听器数量:', eventBus.listenerCount('my-event'))

// 验证系统功能
const validation = validateEventSystem()
if (!validation.valid) {
  console.error('系统验证失败:', validation.errors)
}

// 获取注册的事件类型
console.log('已注册事件:', getRegisteredEvents())
```

## 版本信息

- **版本**: 1.0.0
- **来源**: TypeScript 到 JavaScript 完整转换
- **兼容性**: 100% 功能兼容
- **依赖**: eventemitter3 ^4.0.0 || ^5.0.0

---

**转换完成**: 所有 TypeScript 功能已成功转换为 JavaScript，保持完全兼容性。
