<template>
  <div class="zx-tag-example">
    <div class="example-header">
      <h1>ZxTag 标签组件</h1>
      <p>用于标记和选择的标签组件，支持多种主题和尺寸。</p>
    </div>

    <!-- 基础用法 -->
    <div class="example-section">
      <h2>基础用法</h2>
      <div class="example-content">
        <ZxTag>默认标签</ZxTag>
        <ZxTag type="success">成功标签</ZxTag>
        <ZxTag type="info">信息标签</ZxTag>
        <ZxTag type="warning">警告标签</ZxTag>
        <ZxTag type="danger">危险标签</ZxTag>
      </div>
    </div>

    <!-- 不同主题 -->
    <div class="example-section">
      <h2>不同主题</h2>
      <div class="example-content">
        <div class="theme-group">
          <h3>浅色主题 (light)</h3>
          <ZxTag theme="light" type="success">成功</ZxTag>
          <ZxTag theme="light" type="info">信息</ZxTag>
          <ZxTag theme="light" type="warning">警告</ZxTag>
          <ZxTag theme="light" type="danger">危险</ZxTag>
        </div>
        <div class="theme-group">
          <h3>深色主题 (dark)</h3>
          <ZxTag theme="dark" type="success">成功</ZxTag>
          <ZxTag theme="dark" type="info">信息</ZxTag>
          <ZxTag theme="dark" type="warning">警告</ZxTag>
          <ZxTag theme="dark" type="danger">危险</ZxTag>
        </div>
        <div class="theme-group">
          <h3>朴素主题 (plain)</h3>
          <ZxTag theme="plain" type="success">成功</ZxTag>
          <ZxTag theme="plain" type="info">信息</ZxTag>
          <ZxTag theme="plain" type="warning">警告</ZxTag>
          <ZxTag theme="plain" type="danger">危险</ZxTag>
        </div>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="example-section">
      <h2>不同尺寸</h2>
      <div class="example-content">
        <ZxTag size="large" type="info">大尺寸</ZxTag>
        <ZxTag size="default" type="info">默认尺寸</ZxTag>
        <ZxTag size="small" type="info">小尺寸</ZxTag>
      </div>
    </div>

    <!-- 可关闭标签 -->
    <div class="example-section">
      <h2>可关闭标签</h2>
      <div class="example-content">
        <ZxTag
          v-for="tag in closableTags"
          :key="tag.id"
          :type="tag.type"
          closable
          @close="handleTagClose(tag.id)"
        >
          {{ tag.name }}
        </ZxTag>
      </div>
    </div>

    <!-- 圆角标签 -->
    <div class="example-section">
      <h2>圆角标签</h2>
      <div class="example-content">
        <ZxTag round type="success">圆角成功</ZxTag>
        <ZxTag round type="info">圆角信息</ZxTag>
        <ZxTag round type="warning">圆角警告</ZxTag>
        <ZxTag round type="danger">圆角危险</ZxTag>
      </div>
    </div>

    <!-- 自定义颜色 -->
    <div class="example-section">
      <h2>自定义颜色</h2>
      <div class="example-content">
        <ZxTag color="#f50">自定义红色</ZxTag>
        <ZxTag color="#2db7f5">自定义蓝色</ZxTag>
        <ZxTag color="#87d068">自定义绿色</ZxTag>
        <ZxTag color="#108ee9">自定义深蓝</ZxTag>
      </div>
    </div>

    <!-- 标签组 -->
    <div class="example-section">
      <h2>标签组 (ZxTagGroup)</h2>
      <div class="example-content">
        <div class="tag-group-demo">
          <h3>字符串数组标签组</h3>
          <ZxTagGroup
            :tag-list="stringTags"
            :show-num="3"
            is-string-tag
            @click="handleTagGroupClick"
          />
        </div>

        <div class="tag-group-demo">
          <h3>对象数组标签组</h3>
          <ZxTagGroup
            :tag-list="objectTags"
            :show-num="2"
            name-key="label"
            tag-type="success"
            @click="handleTagGroupClick"
          />
        </div>

        <div class="tag-group-demo">
          <h3>可编辑标签组</h3>
          <ZxTagGroup
            :tag-list="editableTags"
            :show-num="4"
            is-string-tag
            allow-edit
            tag-theme="dark"
            @click="handleEditableTagClick"
          />
        </div>

        <div class="tag-group-demo">
          <h3>表格模式标签组</h3>
          <ZxTagGroup :tag-list="tableTags" is-string-tag show-table tag-type="warning" />
        </div>
      </div>
    </div>

    <!-- 带图标的标签 -->
    <div class="example-section">
      <h2>带图标的标签</h2>
      <div class="example-content">
        <ZxTag type="success">
          <template #icon>
            <el-icon><Check /></el-icon>
          </template>
          成功标签
        </ZxTag>
        <ZxTag type="info">
          <template #icon>
            <el-icon><InfoFilled /></el-icon>
          </template>
          信息标签
        </ZxTag>
        <ZxTag type="warning">
          <template #icon>
            <el-icon><Warning /></el-icon>
          </template>
          警告标签
        </ZxTag>
        <ZxTag type="danger">
          <template #icon>
            <el-icon><Close /></el-icon>
          </template>
          危险标签
        </ZxTag>
      </div>
    </div>

    <!-- 使用 ZxTooltipOrPopover 的标签 -->
    <div class="example-section">
      <h2>Tooltip 和 Popover 标签</h2>
      <div class="example-content">
        <div class="popover-demo">
          <h3>Tooltip 模式（无标题）</h3>
          <ZxTooltipOrPopover content="这是一个简单的提示信息">
            <ZxTag type="info">鼠标悬停显示 Tooltip</ZxTag>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover content="这是成功状态的提示信息" placement="top">
            <ZxTag type="success">
              <template #icon>
                <el-icon><Check /></el-icon>
              </template>
              成功提示
            </ZxTag>
          </ZxTooltipOrPopover>
        </div>

        <div class="popover-demo">
          <h3>Popover 模式（有标题）</h3>
          <ZxTooltipOrPopover
            title="详细信息"
            content="这是一个包含标题的弹出框，可以显示更多详细信息。支持多行文本和丰富的内容展示。"
            trigger="click"
            placement="right"
          >
            <ZxTag type="warning">点击显示 Popover</ZxTag>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover title="操作确认" trigger="click" placement="bottom">
            <template #content>
              <div style="padding: 8px 0">
                <p style="margin: 0 0 8px">确定要执行此操作吗？</p>
                <div style="text-align: right">
                  <el-button size="small" @click="handlePopoverCancel">取消</el-button>
                  <el-button size="small" type="primary" @click="handlePopoverConfirm"
                    >确定</el-button
                  >
                </div>
              </div>
            </template>
            <ZxTag type="danger">
              <template #icon>
                <el-icon><Close /></el-icon>
              </template>
              危险操作
            </ZxTag>
          </ZxTooltipOrPopover>
        </div>

        <div class="popover-demo">
          <h3>不同触发方式</h3>
          <ZxTooltipOrPopover
            title="悬停触发"
            content="鼠标悬停时显示的弹出框"
            trigger="hover"
            placement="top"
          >
            <ZxTag theme="dark" type="info">悬停触发</ZxTag>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover
            title="点击触发"
            content="点击时显示的弹出框"
            trigger="click"
            placement="bottom"
          >
            <ZxTag theme="plain" type="success">点击触发</ZxTag>
          </ZxTooltipOrPopover>

          <ZxTooltipOrPopover
            title="聚焦触发"
            content="获得焦点时显示的弹出框"
            trigger="focus"
            placement="left"
          >
            <ZxTag theme="light" type="warning">聚焦触发</ZxTag>
          </ZxTooltipOrPopover>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, InfoFilled, Warning, Close } from '@element-plus/icons-vue'
import ZxTag from './index.vue'
import ZxTagGroup from './ZxTagGroup/index.vue'
import ZxTooltipOrPopover from '../ZxTooltipOrPopover/index.vue'

// 可关闭标签数据
const closableTags = ref([
  { id: 1, name: '标签一', type: 'success' },
  { id: 2, name: '标签二', type: 'info' },
  { id: 3, name: '标签三', type: 'warning' },
  { id: 4, name: '标签四', type: 'danger' }
])

// 字符串标签组数据
const stringTags = ref(['Vue.js', 'React', 'Angular', 'JavaScript', 'TypeScript', 'Node.js'])

// 对象标签组数据
const objectTags = ref([
  { id: 1, label: '前端开发', value: 'frontend' },
  { id: 2, label: '后端开发', value: 'backend' },
  { id: 3, label: '全栈开发', value: 'fullstack' },
  { id: 4, label: '移动开发', value: 'mobile' },
  { id: 5, label: '数据分析', value: 'data' }
])

// 可编辑标签组数据
const editableTags = ref(['产品设计', '用户体验', '交互设计', '视觉设计', '原型设计', '用户研究'])

// 表格标签组数据
const tableTags = ref([
  '这是一个很长的标签名称用于测试截断效果',
  '短标签',
  '中等长度的标签名称',
  '另一个长标签测试'
])

// 处理标签关闭
const handleTagClose = (tagId) => {
  const index = closableTags.value.findIndex((tag) => tag.id === tagId)
  if (index > -1) {
    closableTags.value.splice(index, 1)
    ElMessage.success('标签已删除')
  }
}

// 处理标签组点击
const handleTagGroupClick = () => {
  ElMessage.info('标签组被点击')
}

// 处理可编辑标签组点击
const handleEditableTagClick = () => {
  ElMessage.success('可编辑标签组被点击，可以在这里添加编辑逻辑')
}

// 处理 Popover 取消
const handlePopoverCancel = () => {
  ElMessage.info('操作已取消')
}

// 处理 Popover 确认
const handlePopoverConfirm = () => {
  ElMessage.success('操作已确认')
}
</script>

<style lang="scss" scoped>
.zx-tag-example {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  .example-header {
    margin-bottom: 32px;

    h1 {
      font-size: 28px;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: var(--el-text-color-regular);
      margin: 0;
    }
  }

  .example-section {
    margin-bottom: 32px;

    h2 {
      font-size: 20px;
      color: var(--el-text-color-primary);
      margin-bottom: 16px;
      border-bottom: 1px solid var(--el-border-color-light);
      padding-bottom: 8px;
    }

    h3 {
      font-size: 16px;
      color: var(--el-text-color-regular);
      margin-bottom: 12px;
    }
  }

  .example-content {
    .zx-tag {
      margin-right: 8px;
      margin-bottom: 8px;
    }

    .theme-group {
      margin-bottom: 20px;
    }

    .tag-group-demo {
      margin-bottom: 20px;
      padding: 16px;
      background: var(--el-bg-color-page);
      border-radius: 6px;
      border: 1px solid var(--el-border-color-light);

      h3 {
        margin-top: 0;
      }
    }

    .popover-demo {
      margin-bottom: 24px;
      padding: 16px;
      background: var(--el-bg-color-page);
      border-radius: 6px;
      border: 1px solid var(--el-border-color-light);

      h3 {
        margin-top: 0;
        margin-bottom: 12px;
        color: var(--el-text-color-regular);
        font-size: 14px;
      }

      .zx-tag {
        margin-right: 12px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
