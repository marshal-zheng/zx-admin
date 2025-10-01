<template>
  <div class="zx-upload-example">
    <div class="example-header">
      <h1>ZxUpload 文件上传组件</h1>
      <p>基于 Element Plus 的文件上传组件，支持拖拽上传、多文件上传、文件预览等功能。</p>
    </div>

    <div class="example-section">
      <h2>基础用法</h2>
      <p>最简单的文件上传，点击选择文件。</p>
      <div class="example-demo">
        <ZxUpload
          v-model="basicFiles"
          action="/api/upload"
          :auto-upload="false"
          @change="handleBasicChange"
        />
      </div>
      <div class="example-code">
        <h4>当前文件列表：</h4>
        <pre>{{ JSON.stringify(basicFiles, null, 2) }}</pre>
      </div>
    </div>

    <div class="example-section">
      <h2>拖拽上传</h2>
      <p>支持拖拽文件到指定区域进行上传。</p>
      <div class="example-demo">
        <ZxUpload
          v-model="dragFiles"
          action="/api/upload"
          :drag="true"
          :auto-upload="false"
          main-text="拖拽文件到此处上传"
          sub-text="支持单个或批量上传，严禁上传公司数据或其他敏感信息"
          @change="handleDragChange"
        />
      </div>
      <div class="example-code">
        <h4>当前文件列表：</h4>
        <pre>{{ JSON.stringify(dragFiles, null, 2) }}</pre>
      </div>
    </div>

    <div class="example-section">
      <h2>多文件上传</h2>
      <p>支持同时选择多个文件进行上传。</p>
      <div class="example-demo">
        <ZxUpload
          v-model="multipleFiles"
          action="/api/upload"
          :multiple="true"
          :limit="5"
          :auto-upload="false"
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
          :max-size="5 * 1024 * 1024"
          @change="handleMultipleChange"
          @exceed="handleExceed"
        />
      </div>
      <div class="example-code">
        <h4>当前文件列表：</h4>
        <pre>{{ JSON.stringify(multipleFiles, null, 2) }}</pre>
      </div>
    </div>

    <div class="example-section">
      <h2>图片上传</h2>
      <p>专门用于图片上传的卡片式布局。</p>
      <div class="example-demo">
        <ZxUpload
          v-model="imageFiles"
          action="/api/upload"
          list-type="picture-card"
          :multiple="true"
          :limit="3"
          accept="image/*"
          :max-size="2 * 1024 * 1024"
          :auto-upload="false"
          @change="handleImageChange"
          @preview="handlePreview"
        />
      </div>
      <div class="example-code">
        <h4>当前文件列表：</h4>
        <pre>{{ JSON.stringify(imageFiles, null, 2) }}</pre>
      </div>
    </div>

    <div class="example-section">
      <h2>自定义文件列表</h2>
      <p>使用自定义的文件列表样式，提供更多操作按钮。</p>
      <div class="example-demo">
        <ZxUpload
          v-model="customFiles"
          action="/api/upload"
          :drag="true"
          :multiple="true"
          :custom-file-list="true"
          :allow-preview="true"
          :allow-download="true"
          :auto-upload="false"
          @change="handleCustomChange"
          @preview="handlePreview"
          @download="handleDownload"
        />
      </div>
      <div class="example-code">
        <h4>当前文件列表：</h4>
        <pre>{{ JSON.stringify(customFiles, null, 2) }}</pre>
      </div>
    </div>

    <div class="example-section">
      <h2>不同尺寸</h2>
      <p>提供大、中、小三种尺寸的上传组件。</p>
      <div class="example-demo">
        <div class="size-demo">
          <div class="size-item">
            <h4>大尺寸</h4>
            <ZxUpload
              v-model="largeFiles"
              action="/api/upload"
              :drag="true"
              size="large"
              :auto-upload="false"
            />
          </div>
          <div class="size-item">
            <h4>默认尺寸</h4>
            <ZxUpload
              v-model="defaultFiles"
              action="/api/upload"
              :drag="true"
              size="default"
              :auto-upload="false"
            />
          </div>
          <div class="size-item">
            <h4>小尺寸</h4>
            <ZxUpload
              v-model="smallFiles"
              action="/api/upload"
              :drag="true"
              size="small"
              :auto-upload="false"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="example-section">
      <h2>禁用状态</h2>
      <p>禁用文件上传功能。</p>
      <div class="example-demo">
        <ZxUpload
          v-model="disabledFiles"
          action="/api/upload"
          :drag="true"
          :disabled="true"
          :auto-upload="false"
        />
      </div>
    </div>

    <div class="example-section">
      <h2>手动上传</h2>
      <p>选择文件后，手动触发上传。</p>
      <div class="example-demo">
        <ZxUpload
          ref="manualUploadRef"
          v-model="manualFiles"
          action="/api/upload"
          :auto-upload="false"
          :multiple="true"
          @change="handleManualChange"
        />
        <div class="manual-buttons">
          <el-button type="primary" @click="submitUpload" :disabled="manualFiles.length === 0">
            开始上传
          </el-button>
          <el-button @click="clearFiles"> 清空文件 </el-button>
        </div>
      </div>
      <div class="example-code">
        <h4>当前文件列表：</h4>
        <pre>{{ JSON.stringify(manualFiles, null, 2) }}</pre>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="50%">
      <img :src="previewUrl" alt="预览图片" style="width: 100%; height: auto" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ZxUpload from './index.vue'

// 响应式数据
const basicFiles = ref([])
const dragFiles = ref([])
const multipleFiles = ref([])
const imageFiles = ref([])
const customFiles = ref([])
const largeFiles = ref([])
const defaultFiles = ref([])
const smallFiles = ref([])
const disabledFiles = ref([])
const manualFiles = ref([])

// 手动上传引用
const manualUploadRef = ref()

// 图片预览
const previewVisible = ref(false)
const previewUrl = ref('')

// 事件处理函数
const handleBasicChange = (fileList) => {
  console.log('基础上传文件变化:', fileList)
}

const handleDragChange = (fileList) => {
  console.log('拖拽上传文件变化:', fileList)
}

const handleMultipleChange = (fileList) => {
  console.log('多文件上传变化:', fileList)
}

const handleImageChange = (fileList) => {
  console.log('图片上传变化:', fileList)
}

const handleCustomChange = (fileList) => {
  console.log('自定义列表文件变化:', fileList)
}

const handleManualChange = (fileList) => {
  console.log('手动上传文件变化:', fileList)
}

const handleExceed = (files, fileList) => {
  ElMessage.warning('文件数量超出限制')
  console.log('超出限制:', files, fileList)
}

const handlePreview = (file) => {
  console.log('预览文件:', file)
  if (file.url) {
    previewUrl.value = file.url
    previewVisible.value = true
  } else {
    ElMessage.info('该文件暂无预览')
  }
}

const handleDownload = (file) => {
  console.log('下载文件:', file)
  ElMessage.success('开始下载文件')
}

// 手动上传方法
const submitUpload = () => {
  manualUploadRef.value?.submit()
  ElMessage.success('开始上传文件')
}

const clearFiles = () => {
  manualUploadRef.value?.clearFiles()
  ElMessage.info('已清空文件列表')
}
</script>

<style lang="scss" scoped>
.zx-upload-example {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  .example-header {
    margin-bottom: 32px;
    text-align: center;

    h1 {
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    p {
      font-size: 16px;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }

  .example-section {
    margin-bottom: 48px;

    h2 {
      margin-bottom: 8px;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    p {
      margin-bottom: 16px;
      font-size: 14px;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }

    .example-demo {
      margin-bottom: 16px;
      padding: 24px;
      border: 1px solid var(--el-border-color-light);
      border-radius: var(--el-border-radius-base);
      background-color: var(--el-bg-color);
    }

    .example-code {
      padding: 16px;
      border: 1px solid var(--el-border-color-light);
      border-radius: var(--el-border-radius-base);
      background-color: var(--el-fill-color-lighter);

      h4 {
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      pre {
        margin: 0;
        padding: 0;
        font-size: 12px;
        color: var(--el-text-color-regular);
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 200px;
        overflow-y: auto;
      }
    }
  }

  .size-demo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;

    .size-item {
      h4 {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        text-align: center;
      }
    }
  }

  .manual-buttons {
    margin-top: 16px;
    display: flex;
    gap: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .zx-upload-example {
    padding: 16px;

    .example-header {
      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }
    }

    .example-section {
      .example-demo {
        padding: 16px;
      }
    }

    .size-demo {
      grid-template-columns: 1fr;
    }
  }
}
</style>
