<template>
  <div>
    <div
      v-if="props.mode === 'remote' && props.showTab"
      class="sticky top-[0] z-[9999] mb-[8px] flex justify-between bg-[var(--color-text-fff)]"
    >
      <el-radio-group v-model="fileListTab" size="small">
        <el-radio-button value="all">{{
          `${t('ms.upload.all')} (${innerFileList.length})`
        }}</el-radio-button>
        <el-radio-button value="waiting">{{
          `${t('ms.upload.uploading')} (${totalWaitingFileList.length})`
        }}</el-radio-button>
        <el-radio-button value="success">{{
          `${t('ms.upload.success')} (${totalSuccessFileList.length})`
        }}</el-radio-button>
        <el-radio-button value="error">{{
          `${t('ms.upload.fail')} (${totalFailFileList.length})`
        }}</el-radio-button>
      </el-radio-group>
      <slot name="tabExtra"></slot>
    </div>
    <MsList
      v-if="props.showMode === 'fileList'"
      :data="filterFileList"
      :bordered="false"
      :split="false"
      item-border
      no-hover
    >
      <template #item="{ item }">
        <div
          class="mb-[8px] w-full rounded-[var(--border-radius-small)] border border-solid border-[var(--color-text-n8)] !p-[8px_12px] flex items-start gap-3"
          :style="{
            borderColor:
              item.status === UploadStatus.error ? 'rgb(var(--danger-5))' : 'var(--color-text-n8)'
          }"
        >
          <!-- Avatar section -->
          <div class="flex-shrink-0">
            <el-avatar
              shape="square"
              class="rounded-[var(--border-radius-mini)] bg-[var(--color-text-n9)]"
              :size="40"
            >
              <el-image
                v-if="item.file?.type?.includes('image/')"
                :src="item.url"
                style="width: 40px; height: 40px"
                fit="cover"
              />
              <ZxIcon
                v-else
                type="iconfont"
                :icon="getFileIcon(item, item.status)"
                :size="24"
                class="text-[var(--color-text-4)]"
              />
            </el-avatar>
          </div>
          <!-- Content section -->
          <div class="flex-1 min-w-0">
            <!-- Title section -->
            <div class="mb-[2px] flex items-center">
              <el-tooltip :content="item.file.name">
                <div class="show-file-name">
                  <div
                    :class="`file-name-first one-line-text pl-[4px] font-normal max-w-[${
                      props.fileNameMaxWidth || '300px'
                    }]`"
                  >
                    {{ item.file.name.slice(0, item.file.name.indexOf('.')) }}
                  </div>
                  <span class="font-normal text-[var(--color-text-1)]">
                    {{ item.file.name.slice(item.file.name.lastIndexOf('.')) }}
                  </span>
                </div>
              </el-tooltip>
              <slot name="title" :item="item"></slot>
              <div v-if="props.buttonInTitle" class="ml-auto flex items-center font-normal">
                <slot name="titleAction" :item="item">
                  <MsButton
                    v-if="item.file.type.includes('image/')"
                    type="button"
                    status="primary"
                    class="!mr-0"
                    @click="handlePreview(item)"
                  >
                    {{ t('ms.upload.preview') }}
                  </MsButton>
                  <el-divider v-if="item.file.type.includes('image/')" direction="vertical" />
                  <MsButton
                    v-if="item.status === UploadStatus.error"
                    type="button"
                    status="secondary"
                    class="!mr-0"
                    @click="reupload(item)"
                  >
                    {{ t('ms.upload.reUpload') }}
                  </MsButton>
                  <el-divider v-if="item.status === UploadStatus.error" direction="vertical" />
                </slot>
                <MsButton
                  v-if="props.showDelete && item.status !== 'uploading'"
                  type="button"
                  :status="item.deleteContent ? 'primary' : 'danger'"
                  class="!mr-[4px]"
                  @click="deleteFile(item)"
                >
                  {{ t(item.deleteContent) || t('ms.upload.delete') }}
                </MsButton>
              </div>
            </div>
            <!-- Description section -->
            <div class="mt-1">
              <div
                v-if="item.status === UploadStatus.init"
                class="text-[12px] leading-[16px] text-[var(--color-text-4)]"
              >
                {{ initFileSaveTips ? initFileSaveTips : t('ms.upload.waiting') }}
              </div>
              <div
                v-else-if="item.status === UploadStatus.done"
                class="flex items-center gap-[8px] pl-[4px] text-[12px] leading-[16px] text-[var(--color-text-4)]"
              >
                <div class="one-line-text max-w-[421px]" style="display: flex">
                  <el-tooltip
                    :content="`${formatFileSize(item.file.size)}  ${item.createUserName || ''}  ${getUploadDesc(
                      item
                    )} ${dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}`"
                  >
                    <div class="one-line-text">
                      {{
                        `${formatFileSize(item.file.size)}  ${item.createUserName || ''}  ${getUploadDesc(
                          item
                        )} ${dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}`
                      }}
                    </div>
                  </el-tooltip>
                  <div v-if="showUploadSuccess(item)" class="ml-4 flex items-center">
                    <ZxIcon type="iconfont" icon="icon-icon_succeed_colorful" class="mr-2" />
                    {{ t('ms.upload.uploadSuccess') }}
                  </div>
                </div>
              </div>
              <el-progress
                v-else-if="item.status === UploadStatus.uploading"
                :percentage="asyncTaskStore.uploadFileTask.singleProgress"
                :show-text="false"
                class="w-[200px]"
              />
              <div
                v-else-if="item.status === UploadStatus.error"
                class="text-[12px] leading-[20px] text-[rgb(var(--danger-6))]"
              >
                {{ item.errMsg || t('ms.upload.uploadFail') }}
              </div>
            </div>
          </div>
          <!-- Actions section -->
          <div v-if="!props.buttonInTitle" class="flex items-center">
            <MsButton
              v-if="item.file.type.includes('image/')"
              type="button"
              status="primary"
              class="!mr-0"
              @click="handlePreview(item)"
            >
              {{ t('ms.upload.preview') }}
            </MsButton>
            <el-divider v-if="item.file.type.includes('image/')" direction="vertical" />
            <MsButton
              v-if="item.status === UploadStatus.error"
              type="button"
              status="secondary"
              class="!mr-0"
              @click="reupload(item)"
            >
              {{ t('ms.upload.reUpload') }}
            </MsButton>
            <el-divider v-if="item.status === UploadStatus.error" direction="vertical" />
            <MsButton
              v-if="props.showDelete && item.status !== 'uploading'"
              type="button"
              :status="item.deleteContent ? 'primary' : 'danger'"
              class="!mr-[4px]"
              @click="deleteFile(item)"
            >
              {{ t(item.deleteContent) || t('ms.upload.delete') }}
            </MsButton>
            <slot name="actions" :item="item"></slot>
          </div>
        </div>
      </template>
    </MsList>
    <div v-else class="flex w-full items-center gap-[8px]">
      <div v-for="item of filterFileList" :key="item.uid" class="image-item">
        <el-image
          :src="item.url"
          style="width: 40px; height: 40px"
          :preview-src-list="[]"
          class="cursor-pointer"
          @click="handlePreview(item)"
        />
        <icon-close-circle-fill class="image-item-close-icon" @click="deleteFile(item)" />
      </div>
    </div>
    <el-image-viewer
      v-if="previewVisible"
      :url-list="previewList"
      :initial-index="previewCurrent"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import dayjs from 'dayjs'

import ZxIcon from '../ZxIcon'
import { getFileIcon, UploadStatus } from './iconMap.js'
import type { MsFileItem } from './types'

// 简化的工具函数
const formatFileSize = (size) => {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(1)} ${units[index]}`
}

// 简化的国际化函数
const useI18n = () => {
  const t = (key) => {
    const translations = {
      'ms.upload.all': '全部',
      'ms.upload.uploading': '上传中',
      'ms.upload.success': '成功',
      'ms.upload.fail': '失败',
      'ms.upload.preview': '预览',
      'ms.upload.reUpload': '重新上传',
      'ms.upload.delete': '删除',
      'ms.upload.waiting': '等待中',
      'ms.upload.uploadSuccess': '上传成功',
      'ms.upload.uploadFail': '上传失败',
      'ms.upload.uploadAt': '上传于',
      'ms.upload.associatedAt': '关联于'
    }
    return translations[key] || key
  }
  return { t }
}

// 简化的异步任务存储
const useAsyncTaskStore = () => {
  return {
    uploadFileTask: {
      singleProgress: 0,
      finishedTime: null,
      isBackstageUpload: false,
      uploadQueue: [] as MsFileItem[],
      timer: null
    },
    setUploadFunc: (_func, _params) => {},
    startUpload: (_fileList, _route, _routeQuery) => {}
  }
}

const props = withDefaults(
  defineProps<{
    mode?: 'static' | 'remote' // 静态|远程
    fileList: MsFileItem[]
    showMode?: 'fileList' | 'imageList' // 展示模式, 文件列表|图片列表
    uploadFunc?: (params: any) => Promise<any> // 上传文件时，自定义上传方法
    requestParams?: Record<string, any> // 上传文件时，额外的请求参数
    route?: string // 用于后台上传文件时，查看详情跳转的路由
    routeQuery?: Record<string, string> // 用于后台上传文件时，查看详情跳转的路由参数
    showTab?: boolean // 是否显示tab
    handleDelete?: (item: MsFileItem) => void
    handleReupload?: (item: MsFileItem) => void
    showDelete?: boolean // 是否展示删除按钮
    handleView?: (item: MsFileItem) => void // 是否自定义预览
    showUploadTypeDesc?: boolean // 自定义上传类型关联于&上传于
    initFileSaveTips?: string // 上传初始文件时的提示
    buttonInTitle?: boolean // 按钮是否在标题中
    fileNameMaxWidth?: string // 文件名称最大宽度
  }>(),
  {
    mode: 'remote',
    showTab: true,
    showDelete: true,
    showMode: 'fileList',
    boolean: false,
    showUploadTypeDesc: false,
    buttonInTitle: false
  }
)
const emit = defineEmits<{
  (e: 'update:fileList', fileList: MsFileItem[]): void
  (e: 'delete', item: MsFileItem): void
  (e: 'finish'): void
  (e: 'start'): void
}>()

const asyncTaskStore = useAsyncTaskStore()
const { t } = useI18n()

const fileListTab = ref('all')
const innerFileList = ref<MsFileItem[]>(props.fileList)

watch(
  () => props.fileList,
  (val) => {
    innerFileList.value = val.sort((a, b) => {
      if (a.status === UploadStatus.init && b.status !== UploadStatus.init) {
        return -1 // "init" 排在前面
      }
      if (a.status !== UploadStatus.init && b.status === UploadStatus.init) {
        return 1 // "init" 排在前面
      }
      return 0 // 保持原始顺序
    })
  }
)

watch(
  () => innerFileList.value,
  (val) => {
    emit('update:fileList', val)
  }
)

const totalWaitingFileList = computed(() => {
  return innerFileList.value.filter(
    (e) => e.status && (e.status === UploadStatus.init || e.status === UploadStatus.uploading)
  )
})
const totalSuccessFileList = computed(() => {
  return innerFileList.value.filter((e) => e.status && e.status === UploadStatus.done)
})
const totalFailFileList = computed(() => {
  return innerFileList.value.filter((e) => e.status && e.status === UploadStatus.error)
})

function getUploadDesc(item: MsFileItem) {
  if (item.local !== undefined) {
    return item.local ? t('ms.upload.uploadAt') : t('ms.upload.associatedAt')
  }
  return t('ms.upload.uploadAt')
}
function showUploadSuccess(item: MsFileItem) {
  if (item.local !== undefined) {
    return item.local
  }
  return true
}

const filterFileList = computed(() => {
  switch (fileListTab.value) {
    case 'waiting':
      return totalWaitingFileList.value
    case 'success':
      return totalSuccessFileList.value
    case 'error':
      return totalFailFileList.value
    default:
      return innerFileList.value
  }
})

/**
 * 开始上传
 */
function startUpload() {
  emit('start')
  if (props.mode === 'remote' && props.uploadFunc) {
    asyncTaskStore.setUploadFunc(props.uploadFunc, props.requestParams)
    asyncTaskStore.startUpload(innerFileList.value, props.route, props.routeQuery)
  }
}

/**
 * 后台上传
 */
function backstageUpload() {
  asyncTaskStore.uploadFileTask.isBackstageUpload = true
  if (asyncTaskStore.uploadFileTask.uploadQueue.length === 0) {
    // 开启后台上传时，如果队列为空，则说明是直接触发后台上传，并不是先startUpload然后再进行后台上传，需要触发一下上传任务开启
    startUpload()
  }
}

watch(
  () => asyncTaskStore.uploadFileTask.finishedTime,
  (val) => {
    if (val) {
      emit('finish')
    }
  }
)

const previewVisible = ref(false)
const previewCurrent = ref(0)

const previewList = computed(() => {
  return innerFileList.value
    .filter((item: any) => item.file?.type.includes('image/'))
    .map((item: any) => item.url)
})

function handlePreview(item: MsFileItem) {
  if (typeof props.handleView === 'function') {
    props.handleView(item)
  } else {
    previewVisible.value = true
    previewCurrent.value = previewList.value.indexOf(item.url)
  }
}

function deleteFile(item: MsFileItem) {
  if (typeof props.handleDelete === 'function') {
    props.handleDelete(item)
  } else {
    const index = innerFileList.value.findIndex((e) => e.uid === item.uid)
    if (index !== -1) {
      innerFileList.value.splice(index, 1)
    }
    emit('delete', item)
  }
}

function reupload(item: MsFileItem) {
  if (typeof props.handleReupload === 'function') {
    props.handleReupload(item)
  } else {
    item.status = 'init' as keyof typeof UploadStatus // 重置状态
    if (asyncTaskStore.uploadFileTask.uploadQueue.length > 0) {
      // 此时队列中还有任务，则 push 入队列末尾
      asyncTaskStore.uploadFileTask.uploadQueue.push(item)
    } else {
      // 此时队列任务已清空
      startUpload()
    }
  }
}

// 在组件销毁时清除定时器
onBeforeUnmount(() => {
  if (asyncTaskStore.uploadFileTask.timer !== null) {
    clearInterval(asyncTaskStore.uploadFileTask.timer as unknown as number)
    asyncTaskStore.uploadFileTask.timer = null
  }
})

defineExpose({
  startUpload,
  backstageUpload
})
</script>

<style lang="less" scoped>
:deep(.arco-list) {
  overflow: auto;

  .arco-list-content {
    min-width: 425px;
  }
}

.image-item {
  @apply relative;

  &:hover {
    .image-item-close-icon {
      @apply visible;
    }
  }

  .image-item-close-icon {
    @apply invisible absolute cursor-pointer rounded-full;

    top: -7px;
    right: -5px;
    z-index: 10;
    color: var(--color-text-4);
    cursor: pointer;
    background-color: var(--color-text-n8);
  }
}

.show-file-name {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 4px;
}
</style>
