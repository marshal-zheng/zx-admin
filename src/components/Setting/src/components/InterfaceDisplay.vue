<script setup lang="ts">
import { ElSwitch, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'
import { computed, watch } from 'vue'
import { setCssVar } from '@/utils'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('interface-display')

const appStore = useAppStore()

const { t } = useI18n()

// 面包屑
const breadcrumb = computed({
  get: () => appStore.getBreadcrumb,
  set: (value: boolean) => appStore.setBreadcrumb(value)
})

const breadcrumbChange = (show: boolean) => {
  appStore.setBreadcrumb(show)
}

// 面包屑图标
const breadcrumbIcon = computed({
  get: () => appStore.getBreadcrumbIcon,
  set: (value: boolean) => appStore.setBreadcrumbIcon(value)
})

const breadcrumbIconChange = (show: boolean) => {
  appStore.setBreadcrumbIcon(show)
}

// 折叠图标
const hamburger = computed({
  get: () => appStore.getHamburger,
  set: (value: boolean) => appStore.setHamburger(value)
})

const hamburgerChange = (show: boolean) => {
  appStore.setHamburger(show)
}

// 全屏图标
const screenfull = computed({
  get: () => appStore.getScreenfull,
  set: (value: boolean) => appStore.setScreenfull(value)
})

const screenfullChange = (show: boolean) => {
  appStore.setScreenfull(show)
}

// 尺寸图标
const size = computed({
  get: () => appStore.getSize,
  set: (value: boolean) => appStore.setSize(value)
})

const sizeChange = (show: boolean) => {
  appStore.setSize(show)
}

// 多语言图标
const locale = computed({
  get: () => appStore.getLocale,
  set: (value: boolean) => appStore.setLocale(value)
})

const localeChange = (show: boolean) => {
  appStore.setLocale(show)
}

// 标签页
const tagsView = computed({
  get: () => appStore.getTagsView,
  set: (value: boolean) => {
    setCssVar('--tags-view-height', value ? '35px' : '0px')
    appStore.setTagsView(value)
  }
})

const tagsViewChange = (show: boolean) => {
  // 切换标签栏显示时，同步切换标签栏的高度
  setCssVar('--tags-view-height', show ? '35px' : '0px')
  appStore.setTagsView(show)
}

// 标签页图标
const tagsViewIcon = computed({
  get: () => appStore.getTagsViewIcon,
  set: (value: boolean) => appStore.setTagsViewIcon(value)
})

const tagsViewIconChange = (show: boolean) => {
  appStore.setTagsViewIcon(show)
}

// logo
const logo = computed({
  get: () => appStore.getLogo,
  set: (value: boolean) => appStore.setLogo(value)
})

const logoChange = (show: boolean) => {
  appStore.setLogo(show)
}

// 菜单手风琴
const uniqueOpened = computed({
  get: () => appStore.getUniqueOpened,
  set: (value: boolean) => appStore.setUniqueOpened(value)
})

const uniqueOpenedChange = (uniqueOpened: boolean) => {
  appStore.setUniqueOpened(uniqueOpened)
}

// 固定头部
const fixedHeader = computed({
  get: () => appStore.getFixedHeader,
  set: (value: boolean) => appStore.setFixedHeader(value)
})

const fixedHeaderChange = (show: boolean) => {
  appStore.setFixedHeader(show)
}

// 页脚
const footer = computed({
  get: () => appStore.getFooter,
  set: (value: boolean) => appStore.setFooter(value)
})

const footerChange = (show: boolean) => {
  appStore.setFooter(show)
}

// 灰色模式
const greyMode = computed({
  get: () => appStore.getGreyMode,
  set: (value: boolean) => appStore.setGreyMode(value)
})

const greyModeChange = (show: boolean) => {
  appStore.setGreyMode(show)
}

// 动态路由
const dynamicRouter = computed({
  get: () => !!appStore.getDynamicRouter,
  set: (value: boolean) => {
    ElMessage.info(t('setting.reExperienced'))
    appStore.setDynamicRouter(value)
  }
})

const dynamicRouterChange = (show: boolean) => {
  ElMessage.info(t('setting.reExperienced'))
  appStore.setDynamicRouter(show)
}

// 服务端动态路由
const serverDynamicRouter = computed({
  get: () => appStore.getServerDynamicRouter,
  set: (value: boolean) => {
    ElMessage.info(t('setting.reExperienced'))
    appStore.setServerDynamicRouter(value)
  }
})

const serverDynamicRouterChange = (show: boolean) => {
  ElMessage.info(t('setting.reExperienced'))
  appStore.setServerDynamicRouter(show)
}

// 固定菜单
const fixedMenu = computed({
  get: () => appStore.getFixedMenu,
  set: (value: boolean) => appStore.setFixedMenu(value)
})

const fixedMenuChange = (show: boolean) => {
  appStore.setFixedMenu(show)
}

const layout = computed(() => appStore.getLayout)

watch(
  () => layout.value,
  (n) => {
    if (n === 'top') {
      appStore.setCollapse(false)
    }
  }
)
</script>

<template>
  <div :class="prefixCls">
    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.breadcrumb') }}</span>
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.breadcrumbIcon') }}</span>
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.hamburgerIcon') }}</span>
      <ElSwitch v-model="hamburger" @change="hamburgerChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.screenfullIcon') }}</span>
      <ElSwitch v-model="screenfull" @change="screenfullChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.sizeIcon') }}</span>
      <ElSwitch v-model="size" @change="sizeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.localeIcon') }}</span>
      <ElSwitch v-model="locale" @change="localeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.tagsView') }}</span>
      <ElSwitch v-model="tagsView" @change="tagsViewChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.tagsViewIcon') }}</span>
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.logo') }}</span>
      <ElSwitch v-model="logo" @change="logoChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.uniqueOpened') }}</span>
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.fixedHeader') }}</span>
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.footer') }}</span>
      <ElSwitch v-model="footer" @change="footerChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.greyMode') }}</span>
      <ElSwitch v-model="greyMode" @change="greyModeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.dynamicRouter') }}</span>
      <ElSwitch v-model="dynamicRouter" @change="dynamicRouterChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.serverDynamicRouter') }}</span>
      <ElSwitch v-model="serverDynamicRouter" @change="serverDynamicRouterChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.fixedMenu') }}</span>
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
    </div>
  </div>
</template>
