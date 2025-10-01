# ZxTagsInput 标签输入组件

基于 Element Plus 的标签输入组件，支持多种配置和自定义验证。

## 特性

- 🏷️ 支持多种标签类型和尺寸
- ⌨️ 支持回车键和按钮添加标签
- 🔍 支持自定义验证规则
- 📏 支持标签数量和长度限制
- 🎨 支持自定义标签内容插槽
- 🌐 支持国际化
- 📱 支持响应式设计
- ♿ 支持无障碍访问

## 基础用法

```vue
<template>
  <ZxTagsInput v-model="tags" placeholder="请输入标签，按回车添加" @change="handleChange" />
</template>

<script setup>
import { ref } from 'vue'

const tags = ref(['Vue', 'Element Plus'])

const handleChange = (newTags) => {
  console.log('标签变化:', newTags)
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | Array | — | [] |
| placeholder | 输入框占位文本 | String | — | '请输入标签' |
| size | 尺寸 | String | large / default / small | default |
| disabled | 是否禁用 | Boolean | — | false |
| readonly | 是否只读 | Boolean | — | false |
| clearable | 是否可清空 | Boolean | — | true |
| maxCount | 最大标签数量 | Number | — | — |
| minLength | 标签最小长度 | Number | — | 1 |
| maxLength | 标签最大长度 | Number | — | 20 |
| showWordLimit | 是否显示字数统计 | Boolean | — | false |
| allowDuplicates | 是否允许重复标签 | Boolean | — | false |
| tagType | 标签类型 | String | success / info / warning / danger | — |
| tagSize | 标签尺寸 | String | large / default / small | default |
| tagEffect | 标签主题 | String | dark / light / plain | light |
| tagClosable | 标签是否可关闭 | Boolean | — | true |
| showAddButton | 是否显示添加按钮 | Boolean | — | false |
| addButtonText | 添加按钮文本 | String | — | '添加' |
| separator | 分隔符 | String / Array | — | [',', '，', ';', '；'] |
| validator | 自定义验证函数 | Function | — | — |
| validateEvent | 是否触发表单验证 | Boolean | — | true |

### Events

| 事件名    | 说明                 | 回调参数                     |
| --------- | -------------------- | ---------------------------- |
| change    | 标签变化时触发       | (tags: Array)                |
| add       | 添加标签时触发       | (tag: String)                |
| remove    | 删除标签时触发       | (tag: String, index: Number) |
| tag-click | 点击标签时触发       | (tag: String, index: Number) |
| focus     | 输入框获得焦点时触发 | (event: Event)               |
| blur      | 输入框失去焦点时触发 | (event: Event)               |
| input     | 输入框输入时触发     | (value: String)              |
| clear     | 清空标签时触发       | —                            |

### Methods

| 方法名    | 说明               | 参数            |
| --------- | ------------------ | --------------- |
| focus     | 使输入框获得焦点   | —               |
| blur      | 使输入框失去焦点   | —               |
| addTag    | 添加当前输入的标签 | —               |
| removeTag | 删除指定标签       | (index: Number) |
| clear     | 清空所有标签       | —               |

### Slots

| 插槽名 | 说明           | 参数                           |
| ------ | -------------- | ------------------------------ |
| tag    | 自定义标签内容 | { tag: String, index: Number } |
| prefix | 输入框前置内容 | —                              |
| suffix | 输入框后置内容 | —                              |

## 高级用法

### 自定义验证

```vue
<template>
  <ZxTagsInput v-model="tags" :validator="customValidator" placeholder="只能添加数字标签" />
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const tags = ref([])

const customValidator = (value) => {
  const isNumber = /^\d+$/.test(value)
  if (!isNumber) {
    ElMessage.warning('只能添加纯数字标签')
  }
  return isNumber
}
</script>
```

### 限制配置

```vue
<template>
  <ZxTagsInput
    v-model="tags"
    :max-count="5"
    :min-length="2"
    :max-length="10"
    :show-word-limit="true"
    placeholder="最多5个标签，每个2-10字符"
  />
</template>
```

### 自定义标签样式

```vue
<template>
  <ZxTagsInput v-model="tags" tag-type="success" tag-effect="dark" placeholder="自定义标签样式">
    <template #tag="{ tag, index }">
      <span class="custom-tag">
        <el-icon><Star /></el-icon>
        {{ tag }}
        <span class="tag-index">#{{ index + 1 }}</span>
      </span>
    </template>
  </ZxTagsInput>
</template>

<script setup>
import { Star } from '@element-plus/icons-vue'
</script>

<style scoped>
.custom-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-index {
  font-size: 12px;
  opacity: 0.7;
}
</style>
```

### 方法调用

```vue
<template>
  <ZxTagsInput ref="tagsInputRef" v-model="tags" placeholder="测试方法调用" />
  <el-button @click="focusInput">聚焦</el-button>
  <el-button @click="addTag">添加标签</el-button>
  <el-button @click="clearTags">清空</el-button>
</template>

<script setup>
import { ref } from 'vue'

const tags = ref([])
const tagsInputRef = ref()

const focusInput = () => {
  tagsInputRef.value?.focus()
}

const addTag = () => {
  tagsInputRef.value?.addTag()
}

const clearTags = () => {
  tagsInputRef.value?.clear()
}
</script>
```

## 样式定制

组件支持通过 CSS 变量进行样式定制：

```css
.zx-tags-input {
  /* 容器样式 */
  --zx-tags-input-bg-color: #ffffff;
  --zx-tags-input-border-color: #dcdfe6;
  --zx-tags-input-border-radius: 4px;
  --zx-tags-input-padding: 8px 12px;

  /* 标签样式 */
  --zx-tags-input-tag-margin: 0 6px 6px 0;
  --zx-tags-input-tag-padding: 0 8px;
  --zx-tags-input-tag-height: 24px;
  --zx-tags-input-tag-font-size: 12px;

  /* 输入框样式 */
  --zx-tags-input-input-min-width: 120px;
  --zx-tags-input-input-font-size: 14px;

  /* 错误状态 */
  --zx-tags-input-error-color: #f56c6c;
  --zx-tags-input-error-border-color: #f56c6c;
}
```

## 国际化

组件支持国际化，默认提供中英文语言包：

```javascript
// 中文
export default {
  'zx-tags-input': {
    duplicate: '标签已存在',
    placeholder: '请输入标签',
    maxCount: '最多添加 {count} 个标签'
  }
}

// 英文
export default {
  'zx-tags-input': {
    duplicate: 'Tag already exists',
    placeholder: 'Please enter tag',
    maxCount: 'Maximum {count} tags allowed'
  }
}
```

## 无障碍访问

组件遵循 WAI-ARIA 规范，支持键盘导航和屏幕阅读器：

- 支持 `Tab` 键聚焦
- 支持 `Enter` 键添加标签
- 支持 `Backspace` 键删除最后一个标签
- 支持 `Escape` 键清空输入
- 提供适当的 ARIA 标签和描述

## 注意事项

1. **性能优化**：当标签数量较多时，建议设置合理的 `maxCount` 限制
2. **验证规则**：自定义验证函数应该返回布尔值，`true` 表示验证通过
3. **事件处理**：避免在事件回调中进行耗时操作，可能影响用户体验
4. **样式覆盖**：使用 CSS 变量进行样式定制，避免直接覆盖组件内部样式
5. **国际化**：确保在多语言环境下正确配置语言包

## 更新日志

### v1.0.0

- 🎉 初始版本发布
- ✨ 支持基础标签输入功能
- ✨ 支持多种配置选项
- ✨ 支持自定义验证
- ✨ 支持国际化
- ✨ 支持无障碍访问

## 许可证

MIT License
