<template>
  <div class="m-load-comp async-load-comp">
    <Suspense>
      <template #default>
        <component :is="dynamicComponent" v-bind="componentProps" v-if="dynamicComponent" />
      </template>
      <template #fallback>
        <div class="loading">
          <el-icon class="is-loading">
            <Loading />
          </el-icon>
          <span class="loading-text">加载中...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, Suspense } from 'vue'
import { Loading } from '@element-plus/icons-vue'

// 自动扫描并按需导入当前目录下 components 内的所有 .vue 组件（开发与构建均可用）
// Vite 会据此进行代码分割与预打包，不需要手动维护映射表
const modules = import.meta.glob('./components/**/*.vue')

// 定义 props
const props = defineProps({
  // 更友好的使用方式：传业务名称
  name: {
    type: String,
    required: false
  },
  path: {
    type: String,
    required: false,
    default: ''
  },
  props: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

// 重命名 props 避免与组件 props 冲突
const componentProps = computed(() => props.props)

// 可选的别名映射：支持在同目录创建 widget.aliases.ts/js 并默认导出一个别名表
// 例如：export default { hello: 'components/HelloWidget.vue' }
const aliasModulesTs = import.meta.glob('./widget.aliases.ts', { eager: true })
const aliasModulesJs = import.meta.glob('./widget.aliases.js', { eager: true })
const aliasMapRaw = {}
for (const mod of [...Object.values(aliasModulesTs), ...Object.values(aliasModulesJs)]) {
  // 兼容 default 或命名导出 aliases
  const map = (mod && (mod.default || mod.aliases)) || {}
  Object.assign(aliasMapRaw, map)
}
const aliasMapLower = Object.fromEntries(
  Object.entries(aliasMapRaw).map(([k, v]) => [String(k).toLowerCase(), v])
)

// 将多种形式的 path/name 解析为 import.meta.glob 的 key
// 支持：
// 1) './components/Foo.vue'
// 2) 'components/Foo.vue'
// 3) 'Foo' | 'Foo.vue'
// 4) 'foo'（kebab/camel 会尝试转为 PascalCase 匹配 Foo.vue）
function toPascalCase(name) {
  return name
    .replace(/[-_ ]+(.)/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase())
}

function fileBaseName(filePath) {
  const m = filePath.match(/([^/\\]+)\.vue$/i)
  return m ? m[1] : null
}

function suggestCandidates(input, keys) {
  // 取所有去重后的基名，用于提示
  const bases = Array.from(new Set(keys.map(fileBaseName).filter(Boolean)))
  const norm = String(input).toLowerCase()
  const scored = bases
    .map((b) => ({ b, d: levenshtein(norm, b.toLowerCase()) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5)
    .map((i) => i.b)
  return scored
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

function resolveModuleKey(rawPathOrName) {
  if (!rawPathOrName) return null

  const keys = Object.keys(modules) // e.g. './components/HelloWidget.vue'
  const normalized = String(rawPathOrName).trim()

  // 0) 别名优先（大小写不敏感），别名值视为路径
  const aliasHit = aliasMapLower[normalized.toLowerCase()]
  if (aliasHit) {
    // 将别名展开为路径后，继续按路径规则解析
    const asPath = String(aliasHit)
    const byAlias = resolveModuleKey(asPath)
    if (byAlias) return byAlias
  }

  // 1) 完全匹配（原样）
  if (modules[normalized]) return normalized

  // 2) 补齐前缀 './'
  if (!normalized.startsWith('./') && modules[`./${normalized}`]) {
    return `./${normalized}`
  }

  // 3) 仅给出基名（含或不含后缀） -> 在 components 下查找唯一的同名文件
  const baseWithExt = normalized.endsWith('.vue') ? normalized : `${normalized}.vue`
  let candidates = keys.filter((k) => k.endsWith(`/${baseWithExt}`))
  if (candidates.length === 1) return candidates[0]

  // 4) kebab/camel -> PascalCase.vue
  const base = normalized.replace(/\.vue$/i, '')
  const pascal = toPascalCase(base)
  candidates = keys.filter((k) => k.endsWith(`/${pascal}.vue`))
  if (candidates.length === 1) return candidates[0]

  // 5) 再次尝试大小写不敏感匹配（防止大小写差异）
  const lower = baseWithExt.toLowerCase()
  candidates = keys.filter((k) => k.toLowerCase().endsWith(`/${lower}`))
  if (candidates.length === 1) return candidates[0]

  // 如果存在多个候选，给出明确警告并返回第一个，避免静默选错
  if (candidates.length > 1) {
    console.warn(
      `[AsyncLoadComp] 组件路径/名称存在歧义: "${rawPathOrName}" -> 匹配到多个候选:`,
      candidates
    )
    return candidates[0]
  }

  // 未匹配到，给出相似候选建议
  const suggestions = suggestCandidates(normalized, keys)
  if (suggestions.length) {
    console.warn(`[AsyncLoadComp] 未找到 "${normalized}" 对应的组件，是否想要：`, suggestions)
  }
  return null
}

// 动态组件加载（基于 import.meta.glob 结果）
const dynamicComponent = computed(() => {
  const key = resolveModuleKey(props.name || props.path)

  if (!key) {
    console.warn(`组件标识 "${props.name || props.path}" 未找到匹配的组件文件`)
    return defineAsyncComponent({
      loader: () => Promise.reject(new Error(`组件 ${props.name || props.path} 不存在`)),
      errorComponent: {
        template: '<div class="error">组件路径不存在或未注册</div>'
      }
    })
  }

  const loader = modules[key]

  return defineAsyncComponent({
    loader,
    errorComponent: {
      template: '<div class="error">组件加载失败</div>'
    },
    delay: 200,
    timeout: 30000 // 生产首包较大或网络慢时更宽松
  })
})
</script>

<style lang="scss" scoped>
.async-load-comp {
  height: 100%;
  width: 100%;

  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: var(--el-color-primary);
    gap: 8px;

    .el-icon {
      font-size: 24px;
    }

    .loading-text {
      font-size: 14px;
    }
  }

  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: var(--el-color-danger);
    font-size: 14px;
  }
}
</style>
