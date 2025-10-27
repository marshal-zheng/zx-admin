import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
import { ElMessage, ComponentSize } from 'element-plus'
import { useCssVar } from '@vueuse/core'
import { unref, watch } from 'vue'
import { useDark } from '@vueuse/core'

interface AppState {
  // 本地持久化的状态版本，用于向前兼容迁移
  stateVersion?: number
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  serverDynamicRouter: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  isDark: boolean
  currentSize: ComponentSize
  sizeMap: ComponentSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
}

// 默认版本号：每次对默认状态结构有破坏性调整时 +1
const APP_STATE_VERSION = 1

// 配置项哈希：用于检测代码默认值变更，触发自动同步
let configHash = ''

// 当版本变更时，需要与代码默认值保持同步的关键字段
const SYNC_DEFAULT_KEYS: (keyof AppState)[] = [
  'logo',
  'breadcrumb',
  'breadcrumbIcon',
  'fixedHeader',
  'footer',
  'dynamicRouter',
  'serverDynamicRouter',
  'fixedMenu',
  'layout',
  'size',
  'locale',
  'tagsView',
  'tagsViewIcon'
]

// 计算配置项的哈希值，用于检测默认值变更
function calculateConfigHash(config: AppState): string {
  const syncConfig = SYNC_DEFAULT_KEYS.reduce(
    (acc, key) => {
      acc[key] = config[key] as any
      return acc
    },
    {} as Record<string, any>
  )
  return JSON.stringify(syncConfig)
}

function createDefaultState(): AppState {
  const state = {
    stateVersion: APP_STATE_VERSION,
    sizeMap: ['default', 'large', 'small'] as ComponentSize[],
    mobile: false, // 是否是移动端
    title: import.meta.env.VITE_APP_TITLE, // 标题
    pageLoading: false, // 路由跳转loading
    breadcrumb: true, // 面包屑
    breadcrumbIcon: false, // 面包屑图标
    collapse: false, // 折叠菜单
    uniqueOpened: false, // 是否只保持一个子菜单的展开
    hamburger: true, // 折叠图标
    screenfull: true, // 全屏图标
    size: false, // 尺寸图标
    locale: false, // 多语言图标
    tagsView: false, // 标签页
    tagsViewIcon: true, // 是否显示标签图标
    logo: false, // logo
    fixedHeader: true, // 固定toolheader
    footer: false, // 显示页脚
    greyMode: false, // 是否开始灰色模式，用于特殊悼念日
    dynamicRouter: false, // 是否动态路由
    serverDynamicRouter: false, // 是否服务端渲染动态路由
    fixedMenu: false, // 是否固定菜单

    layout: 'classic' as LayoutType, // layout布局
    isDark: false, // 是否是暗黑模式
    currentSize: 'default' as ComponentSize, // 组件尺寸
    theme: {
      // 主题色
      elColorPrimary: '#409eff',
      // 左侧菜单边框颜色
      leftMenuBorderColor: '#f0f2f5',
      // 左侧菜单背景颜色 - 改为浅色
      leftMenuBgColor: '#ffffff',
      // 左侧菜单浅色背景颜色 - 改为更浅的灰色
      leftMenuBgLightColor: '#f8f9fa',
      // 左侧菜单选中背景颜色 - 使用主题色的浅色版本
      leftMenuBgActiveColor: 'rgba(64, 158, 255, 0.1)',
      // 左侧菜单收起选中背景颜色
      leftMenuCollapseBgActiveColor: 'rgba(64, 158, 255, 0.1)',
      // 左侧菜单字体颜色 - 改为深色
      leftMenuTextColor: '#495057',
      // 左侧菜单选中字体颜色 - 使用主题色
      leftMenuTextActiveColor: 'var(--el-color-primary)',
      // logo字体颜色 - 改为深色
      logoTitleTextColor: '#495057',
      // logo边框颜色
      logoBorderColor: '#f0f2f5',
      // 头部背景颜色
      topHeaderBgColor: '#fff',
      // 头部字体颜色 - 改为深色
      topHeaderTextColor: '#495057',
      // 头部悬停颜色
      topHeaderHoverColor: '#f8f9fa',
      // 头部边框颜色
      topToolBorderColor: '#f0f2f5'
    }
  }

  // 初始化时计算配置哈希
  if (!configHash) {
    configHash = calculateConfigHash(state)
  }

  return state
}

export const useAppStore = defineStore('app', {
  state: (): AppState => createDefaultState(),
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ComponentSize {
      return this.currentSize
    },
    getSizeMap(): ComponentSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    // 迁移并同步本地存储：当版本落后或配置哈希变更时，将关键系统配置对齐为当前默认值
    migrateAndSync() {
      const defaults = createDefaultState()
      const currentVersion = this.stateVersion ?? 0
      const currentConfigHash = calculateConfigHash(this as AppState)
      const defaultConfigHash = calculateConfigHash(defaults)

      // 版本升级或配置哈希变更时，同步默认值
      const shouldSync =
        currentVersion < APP_STATE_VERSION || currentConfigHash !== defaultConfigHash

      if (shouldSync) {
        console.log('🔄 检测到配置变更，同步默认值到本地存储')
        SYNC_DEFAULT_KEYS.forEach((key) => {
          // 以代码默认为准，覆盖本地历史值，保证"配置 + UI"一致
          // @ts-ignore 索引签名
          this[key] = defaults[key]
        })
        this.theme = { ...defaults.theme, ...(this.theme || {}) }
        this.stateVersion = APP_STATE_VERSION
      }
      // 每次确保 CSS 变量与主题同步
      this.setCssVarTheme()
    },
    // 重置为默认状态，并保持必要的主题变量同步
    resetToDefaults() {
      const defaults = createDefaultState()
      // 逐字段赋值，避免替换 this 引用
      Object.assign(this, defaults)
      this.setCssVarTheme()
    },
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo: boolean) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter: boolean) {
      this.dynamicRouter = dynamicRouter
    },
    setServerDynamicRouter(serverDynamicRouter: boolean) {
      this.serverDynamicRouter = serverDynamicRouter
    },
    setFixedMenu(fixedMenu: boolean) {
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其它布局')
        return
      }
      this.layout = layout
    },
    setTitle(title: string) {
      this.title = title
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      this.setPrimaryLight()
    },
    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
      this.setPrimaryLight()
    },
    setFooter(footer: boolean) {
      this.footer = footer
    },
    setPrimaryLight() {
      if (this.theme.elColorPrimary) {
        const elColorPrimary = this.theme.elColorPrimary
        const color = this.isDark ? '#000000' : '#ffffff'
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    },
    setMenuTheme(color: string) {
      const primaryColor = useCssVar('--el-color-primary', document.documentElement)
      const isDarkColor = colorIsDark(color)
      
      // 根据系统主题和颜色深浅自动调整
      const isSystemDark = this.isDark || window.matchMedia('(prefers-color-scheme: dark)').matches
      
      const theme: Recordable = {
        // 左侧菜单边框颜色 - 浅色主题使用更柔和的边框
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#f0f2f5',
        // 左侧菜单背景颜色
        leftMenuBgColor: color,
        // 左侧菜单浅色背景颜色 - 优化浅色主题的层次感
        leftMenuBgLightColor: isDarkColor 
          ? lighten(color!, 6) 
          : (isSystemDark ? '#f5f6f7' : '#f8f9fa'),
        // 左侧菜单选中背景颜色 - 使用更合适的透明度
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor) as string, 0.08),
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor) as string, 0.08),
        // 左侧菜单字体颜色 - 优化浅色主题的可读性
        leftMenuTextColor: isDarkColor 
          ? '#bfcbd9' 
          : (isSystemDark ? '#6c757d' : '#495057'),
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
        // logo字体颜色 - 适配浅色主题
        logoTitleTextColor: isDarkColor 
          ? '#fff' 
          : (isSystemDark ? '#495057' : '#212529'),
        // logo边框颜色
        logoBorderColor: isDarkColor ? color : '#f0f2f5'
      }
      this.setTheme(theme)
      this.setCssVarTheme()
    },
    setHeaderTheme(color: string) {
      const isDarkColor = colorIsDark(color)
      const textColor = isDarkColor ? '#fff' : 'inherit'
      const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
      const topToolBorderColor = isDarkColor ? color : '#eee'
      setCssVar('--top-header-bg-color', color)
      setCssVar('--top-header-text-color', textColor)
      setCssVar('--top-header-hover-color', textHoverColor)
      this.setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor
      })
      if (this.getLayout === 'top') {
        this.setMenuTheme(color)
      }
    },
    initTheme() {
      // 优先处理迁移与同步，避免 UI 与存储不一致
      this.migrateAndSync()
      const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      isDark.value = this.getIsDark
      
      // 监听系统主题变化
      this.setupSystemThemeListener()
      
      const newTitle = import.meta.env.VITE_APP_TITLE
      newTitle !== this.getTitle && this.setTitle(newTitle)
    },
    // 设置系统主题监听器
    setupSystemThemeListener() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // 当系统主题改变时，如果当前使用的是浅色侧边栏，则重新应用主题以适配系统色系
        const currentMenuColor = this.theme.leftMenuBgColor || '#ffffff'
        if (currentMenuColor === '#ffffff' || !colorIsDark(currentMenuColor)) {
          console.log('🎨 检测到系统主题变化，自动适配侧边栏颜色')
          this.setMenuTheme(currentMenuColor)
        }
      }
      
      // 添加监听器
      mediaQuery.addEventListener('change', handleSystemThemeChange)
      
      // 初始化时也检查一次
      handleSystemThemeChange({ matches: mediaQuery.matches } as MediaQueryListEvent)
    }
  },
  persist: {
    key: 'vepa-app',
    storage: localStorage
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}

// 统一的配置同步管理器：监听所有配置项变更，自动触发 localStorage 同步
export const setupAppStoreSync = () => {
  const appStore = useAppStore()

  // 监听所有同步字段的变更，确保实时同步到 localStorage
  SYNC_DEFAULT_KEYS.forEach((key) => {
    watch(
      () => (appStore as any)[key],
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          console.log(`📝 配置项 ${key} 已更新: ${oldValue} → ${newValue}`)
          // Pinia 持久化插件会自动处理同步，这里只是日志记录
        }
      },
      { immediate: false }
    )
  })

  // 监听主题对象变更
  watch(
    () => appStore.theme,
    (newTheme, oldTheme) => {
      if (JSON.stringify(newTheme) !== JSON.stringify(oldTheme)) {
        console.log('🎨 主题配置已更新')
        appStore.setCssVarTheme()
      }
    },
    { deep: true, immediate: false }
  )

  console.log('✅ 应用配置同步管理器已启动')
}
