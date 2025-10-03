# ZxGridList 组件使用文档

一个功能强大、易于使用的 Vue 3 列表组件，支持查询、分页、排序等功能。

## 特性

- 🚀 基于 Vue 3 Composition API
- 📱 响应式设计，支持移动端
- 🔄 支持自动刷新
- 🌐 支持 URL 状态同步
- ⚡ 内置防抖优化
- 🎨 现代化 UI 设计
- 📦 轻量级，无额外依赖

## 安装

```bash
# 如果是内部组件，无需安装
# 直接从项目中导入使用
```

## 基本用法

```vue
<template>
  <ZxGridList :load-data="loadUserList" :show-pagination="true" :page-sizes="[10, 20, 50, 100]">
    <!-- 查询表单插槽 -->
    <template #form="{ query, data, loading }">
      <el-form inline>
        <el-form-item label="用户名">
          <el-input v-model="query.username" placeholder="请输入用户名" @input="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading"> 搜索 </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 表格插槽 -->
    <template #table="{ grid, loading, refresh }">
      <el-table :data="grid.list" :loading="loading" @sort-change="handleSortChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" sortable="custom" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </ZxGridList>
</template>

<script setup>
import { ref } from 'vue'
import ZxGridList from '@/components/pure/ZxGridList/index.vue'
import { getUserList } from '@/api/user'

const gridRef = ref()

// 数据加载函数
const loadUserList = async (params) => {
  try {
    const { query, pager } = params
    const response = await getUserList({
      ...query,
      page: pager.page,
      size: pager.size
    })

    return {
      list: response.data.list,
      pager: {
        page: response.data.page,
        size: response.data.size,
        total: response.data.total
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    throw error
  }
}

// 搜索处理
const handleSearch = () => {
  gridRef.value?.loadData({}, { immediate: true })
}

// 重置处理
const handleReset = () => {
  gridRef.value?.updateState('query', {})
  gridRef.value?.loadData({}, { immediate: true })
}

// 排序处理
const handleSortChange = ({ prop, order }) => {
  const sortParams = {
    sortBy: order ? prop : undefined,
    sortOrder: order
  }
  gridRef.value?.updateState('query', sortParams)
  gridRef.value?.loadData({}, { immediate: true })
}

// 编辑用户
const handleEdit = (row) => {
  console.log('编辑用户:', row)
}

// 删除用户
const handleDelete = (row) => {
  console.log('删除用户:', row)
}
</script>
```

## 布局控制

- 当 ZxGridList 作为页面级列表使用时，可通过额外添加 `zx-grid-list--page` 类，让分页始终贴底展示，并把滚动行为限定在表格主体内。
- 该类只作为开关使用，不会影响在弹窗或卡片中的默认行为，可与业务类名组合，例如 `class="user-list zx-grid-list--page"`。
- 组件会根据视口高度自动重新计算可用空间，因此无需再为 `el-table` 设置额外的 `max-height`。如需微调高度，可通过 `page-viewport-offset` 属性或在容器上设置 `--zx-grid-list-page-offset-top / bottom` CSS 变量来补偿顶部/底部留白（支持正负值）。

```vue
<ZxGridList
  class="user-list zx-grid-list--page"
  :load-data="loadUserList"
  :show-pagination="true"
  :page-viewport-offset="{ bottom: 16 }"
>
  <!-- slots -->
</ZxGridList>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loadData | 数据加载函数，必需 | Function | - |
| initialState | 初始状态 | Object | `{}` |
| showPagination | 是否显示分页 | Boolean | `true` |
| pageSizes | 分页大小选项 | Array | `[10, 20, 50, 100]` |
| paginationLayout | 分页组件布局 | String | `'total, sizes, prev, pager, next, jumper'` |
| small | 分页组件是否为小尺寸 | Boolean | `false` |
| paginationBackground | 分页按钮是否有背景色 | Boolean | `true` |
| loadOnMounted | 组件挂载时是否自动加载 | Boolean | `true` |
| queryTransform | 查询参数转换函数 | Function | `(query) => query` |
| paramsTransform | 参数预处理函数 | Function | `(params) => params` |
| autoRefresh | 自动刷新配置 | Boolean/Object | `true` |
| clearSelectionOnLoad | 加载时是否清除表格选择 | Boolean | `true` |
| syncUrlState | 是否同步 URL 状态 | Boolean | `false` |
| urlStateKey | URL 状态键名 | String | `'_state'` |
| pageFrom0 | 分页是否从 0 开始 | Boolean | `false` |
| debounceDelay | 防抖延迟(ms) | Number | `300` |
| defaultPageSize | 默认分页大小 | Number | `20` |
| showTableBorder | 是否显示表格内边框 | Boolean | `false` |
| paginationPaddingBottom | 分页组件底部内边距 | String/Number | `'12px'` |
| pageViewportOffset | 页面布局模式下的额外视口留白（px），可为数字或 `{ top, bottom }` 对象，正数增加预留、负数抵消预留 | Number/String/Object | `0` |

## Events

| 事件名      | 说明               | 参数         |
| ----------- | ------------------ | ------------ |
| beforeLoad  | 加载前触发         | `(params)`   |
| dataLoaded  | 数据加载成功后触发 | `(response)` |
| loadError   | 数据加载失败后触发 | `(error)`    |
| stateChange | 状态变化时触发     | `(newState)` |

## Slots

### form 插槽

查询表单区域，提供以下参数：

- `query`: 当前查询参数
- `data`: 完整的组件状态
- `loading`: 加载状态

### table 插槽

表格区域，提供以下参数：

- `grid`: 组件状态，包含 list、pager 等
- `loading`: 加载状态
- `refresh`: 刷新函数

### pagination 插槽

分页区域，提供以下参数：

- `pager`: 分页信息

## 暴露的方法

```javascript
const gridRef = ref()

// 加载数据
await gridRef.value.loadData(params, options)

// 刷新数据
await gridRef.value.refresh(options)

// 更新单个状态
gridRef.value.updateState('query.username', 'test')

// 更新多个状态
gridRef.value.updateMultiState({
  query: { username: 'test' },
  pager: { page: 1 }
})

// 获取状态快照
const snapshot = gridRef.value.getStateSnapshot()

// 清除表格选择
gridRef.value.clearTableSelection()
```

## 高级用法

### 自动刷新

```vue
<ZxGridList :load-data="loadData" :auto-refresh="{ enabled: true, interval: 30000 }">
  <!-- 插槽内容 -->
</ZxGridList>
```

自动刷新支持两种用法：

- 布尔值

  - `:auto-refresh="true"` 开启自动刷新，默认间隔 1000ms
  - `:auto-refresh="false"` 关闭自动刷新

- 对象配置
  - `interval`: 刷新间隔（毫秒），默认 `1000`
  - `enabled`: 是否启用；对象形式下未显式传入时默认 `true`

示例：

```vue
<!-- 开启自动刷新，使用默认 1000ms -->
<ZxGridList :load-data="loadData" :auto-refresh="true" />

<!-- 对象形式（推荐）：未写 enabled 时默认启用 -->
<ZxGridList :load-data="loadData" :auto-refresh="{ interval: 5000 }" />

<!-- 显式关闭 -->
<ZxGridList :load-data="loadData" :auto-refresh="{ enabled: false }" />
```

行为说明：

- 组件挂载并首次成功加载数据后开始进入定时刷新；随后每到间隔时机触发一次静默刷新（不展示 loading 态）。
- 若正在加载中则会跳过本次间隔，等待下一次。
- 页面失活时会自动暂停，返回激活时自动恢复。
- 若需要尽快进入自动刷新循环，保持 `loadOnMounted` 为 `true`（默认），以便尽早设置首次 `lastLoadTime`。

### URL 状态同步

```vue
<ZxGridList :load-data="loadData" :sync-url-state="true" url-state-key="listState">
  <!-- 插槽内容 -->
</ZxGridList>
```

### 自定义参数转换

```vue
<template>
  <ZxGridList
    :load-data="loadData"
    :query-transform="queryTransform"
    :params-transform="paramsTransform"
  >
    <!-- 插槽内容 -->
  </ZxGridList>
</template>

<script setup>
// 查询参数转换
const queryTransform = (query) => {
  return {
    ...query,
    // 添加默认参数
    tenant: 'default'
  }
}

// 参数预处理
const paramsTransform = (params) => {
  return {
    ...params,
    // 添加时间戳
    timestamp: Date.now()
  }
}
</script>
```

### 样式定制高级用法

```vue
<template>
  <ZxGridList
    :load-data="loadData"
    :show-table-border="dynamicBorderControl"
    :pagination-padding-bottom="computedPadding"
    class="custom-grid-list"
  >
    <!-- 插槽内容 -->
  </ZxGridList>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式样式控制
const screenSize = ref('desktop')
const userPreference = ref({ showBorder: true, compactMode: false })

// 动态边框控制
const dynamicBorderControl = computed(() => {
  return screenSize.value === 'mobile' ? false : userPreference.value.showBorder
})

// 计算分页间距
const computedPadding = computed(() => {
  if (userPreference.value.compactMode) {
    return screenSize.value === 'mobile' ? 8 : 6
  }
  return screenSize.value === 'mobile' ? 16 : 12
})

// 监听屏幕尺寸变化
onMounted(() => {
  const updateScreenSize = () => {
    screenSize.value = window.innerWidth < 768 ? 'mobile' : 'desktop'
  }

  window.addEventListener('resize', updateScreenSize)
  updateScreenSize()
})
</script>

<style scoped>
.custom-grid-list {
  /* 自定义 CSS 变量 */
  --zx-grid-list-table-inner-border-color: var(--el-color-primary-light-7);
  --zx-grid-list-table-inner-border-width: 2px;
}

/* 响应式样式定制 */
@media (max-width: 768px) {
  .custom-grid-list {
    --zx-grid-list-pagination-padding-bottom: 8px;
  }
}
</style>
```

## 样式定制

组件支持 CSS 变量定制：

```scss
.zx-grid-list {
  // 自定义间距
  gap: 20px;

  // 自定义分页样式
  .zx-grid-list__pagination {
    :deep(.el-pagination) {
      --el-pagination-font-size: 16px;
      --el-pagination-button-width: 36px;
      --el-pagination-button-height: 36px;
    }
  }
}
```

### 表格边框控制

组件提供了表格内边框的显示控制功能：

#### 通过 Props 控制

```vue
<ZxGridList :show-table-border="true" :load-data="loadData">
  <!-- 插槽内容 -->
</ZxGridList>
```

#### 通过 CSS 变量控制

```scss
:root {
  // 表格内边框颜色
  --zx-grid-list-table-inner-border-color: #dcdfe6;
  // 表格内边框宽度
  --zx-grid-list-table-inner-border-width: 1px;
}
```

### 分页间距控制

组件提供了分页组件底部间距的灵活配置：

#### 通过 Props 控制（推荐）

```vue
<ZxGridList
  :pagination-padding-bottom="16"
  <!-- 或者使用字符串格式 -->
  :pagination-padding-bottom="'20px'"
  :load-data="loadData"
>
  <!-- 插槽内容 -->
</ZxGridList>
```

#### 通过 CSS 变量控制（全局）

```scss
:root {
  // 分页组件底部内边距
  --zx-grid-list-pagination-padding-bottom: 16px;
}
```

#### 动态控制示例

```vue
<template>
  <div>
    <!-- 控制面板 -->
    <div class="controls">
      <el-switch v-model="showBorder" active-text="显示表格边框" />
      <el-input-number v-model="paddingBottom" :min="0" :max="50" placeholder="分页间距" />
    </div>

    <!-- 列表组件 -->
    <ZxGridList
      :show-table-border="showBorder"
      :pagination-padding-bottom="paddingBottom"
      :load-data="loadData"
    >
      <!-- 插槽内容 -->
    </ZxGridList>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showBorder = ref(false)
const paddingBottom = ref(12)
</script>
```

### CSS 变量优先级

1. **Props 属性** > **CSS 变量** > **默认值**
2. Props 方式具有最高优先级，可以覆盖全局 CSS 变量设置
3. 适合需要动态控制或组件级别定制的场景

### 可用的 CSS 变量

| 变量名                                     | 说明           | 默认值    |
| ------------------------------------------ | -------------- | --------- |
| `--zx-grid-list-table-inner-border-color`  | 表格内边框颜色 | `#dcdfe6` |
| `--zx-grid-list-table-inner-border-width`  | 表格内边框宽度 | `1px`     |
| `--zx-grid-list-pagination-padding-bottom` | 分页底部内边距 | `12px`    |

## 迁移指南

### 从旧版本迁移

如果你正在从旧的 `GridList` 组件迁移，请注意以下变化：

1. **Props 重命名**：

   - `storeLoadList` → `loadData`
   - `loadOnCreated` → `loadOnMounted`
   - `chainQuery` → `queryTransform`
   - `paramsReduce` → `paramsTransform`
   - `autoReload` → `autoRefresh`
   - `queryStateKey` → `urlStateKey`

2. **插槽变化**：

   - 插槽参数结构有所调整，请参考新的插槽文档

3. **API 变化**：
   - `state` 现在是响应式的只读对象
   - 新增了更多便捷的方法

## 注意事项

1. `loadData` 函数必须返回 Promise
2. 响应数据结构应包含 `list` 和 `pager` 字段
3. 组件会自动处理并发请求，避免数据混乱
4. 建议在开发环境启用 Vue DevTools 以便调试
