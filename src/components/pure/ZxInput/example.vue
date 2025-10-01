<template>
  <div class="zx-input-example">
    <div class="example-header">
      <h1>ZxInput 增强输入框组件</h1>
      <p>基于 Element Plus 的增强输入框组件，支持多种类型、工具提示、防抖等功能。</p>
    </div>

    <div class="example-section">
      <h2>基础用法</h2>
      <div class="example-block">
        <div class="example-item">
          <label>基础文本输入：</label>
          <ZxInput v-model="basicValue" placeholder="请输入文本" clearable @change="handleChange" />
          <span class="example-value">值：{{ basicValue }}</span>
        </div>

        <div class="example-item">
          <label>带工具提示：</label>
          <ZxInput
            v-model="tooltipValue"
            placeholder="带工具提示的输入框"
            tooltip="这是一个简单的工具提示信息"
            tooltip-placement="top"
          />
        </div>

        <div class="example-item">
          <label>气泡确认框（点击触发）：</label>
          <ZxInput
            v-model="popoverValue"
            placeholder="带气泡确认框的输入框"
            :tooltip="{
              title: '输入提示',
              content: '这是一个带标题的气泡确认框，可以显示更多详细信息。支持点击触发。',
              trigger: 'click'
            }"
            tooltip-placement="right"
          />
        </div>

        <div class="example-item">
          <label>气泡确认框（悬停触发）：</label>
          <ZxInput
            v-model="hoverPopoverValue"
            placeholder="悬停显示气泡框"
            :tooltip="{
              title: '悬停提示',
              content: '这是悬停触发的气泡框，包含标题和内容。',
              trigger: 'hover'
            }"
            tooltip-placement="bottom"
          />
        </div>

        <div class="example-item">
          <label>禁用状态：</label>
          <ZxInput v-model="disabledValue" placeholder="禁用状态" disabled />
        </div>
      </div>
    </div>

    <div class="example-section">
      <h2>不同类型</h2>
      <div class="example-block">
        <div class="example-item">
          <label>密码输入：</label>
          <ZxInput
            v-model="passwordValue"
            type="password"
            placeholder="请输入密码"
            show-password
            prevent-auto-fill
          />
        </div>

        <div class="example-item">
          <label>搜索输入：</label>
          <ZxInput
            v-model="searchValue"
            type="search"
            placeholder="请输入搜索关键词"
            @search="handleSearch"
          />
        </div>

        <div class="example-item">
          <label>数字输入：</label>
          <ZxInput
            v-model="numberValue"
            type="number"
            placeholder="请输入数字"
            :min="0"
            :max="100"
            :step="1"
            controls
          />
        </div>

        <div class="example-item">
          <label>文本域：</label>
          <ZxInput
            v-model="textareaValue"
            type="textarea"
            placeholder="请输入多行文本"
            :rows="4"
            :maxlength="200"
            show-word-limit
            resize="vertical"
          />
        </div>
      </div>
    </div>

    <div class="example-section">
      <h2>尺寸变体</h2>
      <div class="example-block">
        <div class="example-item">
          <label>大尺寸：</label>
          <ZxInput v-model="largeValue" size="large" placeholder="大尺寸输入框" clearable />
        </div>

        <div class="example-item">
          <label>默认尺寸：</label>
          <ZxInput v-model="defaultValue" size="default" placeholder="默认尺寸输入框" clearable />
        </div>

        <div class="example-item">
          <label>小尺寸：</label>
          <ZxInput v-model="smallValue" size="small" placeholder="小尺寸输入框" clearable />
        </div>
      </div>
    </div>

    <div class="example-section">
      <h2>防抖功能</h2>
      <div class="example-block">
        <div class="example-item">
          <label>防抖输入（500ms）：</label>
          <ZxInput
            v-model="debounceValue"
            placeholder="输入内容，500ms后触发事件"
            :debounce="500"
            @input="handleDebounceInput"
            clearable
          />
          <div class="example-log">
            <p>输入事件日志：</p>
            <ul>
              <li v-for="(log, index) in inputLogs" :key="index">
                {{ log }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="example-section">
      <h2>高级功能</h2>
      <div class="example-block">
        <div class="example-item">
          <label>带前缀图标：</label>
          <ZxInput v-model="prefixValue" placeholder="带前缀图标" prefix-icon="User" clearable />
        </div>

        <div class="example-item">
          <label>带后缀图标：</label>
          <ZxInput
            v-model="suffixValue"
            placeholder="带后缀图标"
            suffix-icon="Calendar"
            clearable
          />
        </div>

        <div class="example-item">
          <label>只读状态：</label>
          <ZxInput v-model="readonlyValue" placeholder="只读状态" readonly />
        </div>

        <div class="example-item">
          <label>自适应文本域：</label>
          <ZxInput
            v-model="autosizeValue"
            type="textarea"
            placeholder="自适应高度的文本域"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </div>
      </div>
    </div>

    <div class="example-section">
      <h2>事件演示</h2>
      <div class="example-block">
        <div class="example-item">
          <label>事件监听：</label>
          <ZxInput
            v-model="eventValue"
            placeholder="触发各种事件"
            clearable
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleEventChange"
            @clear="handleClear"
          />
          <div class="example-log">
            <p>事件日志：</p>
            <ul>
              <li v-for="(log, index) in eventLogs" :key="index">
                {{ log }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ZxInput from './index.vue'

// 响应式数据
const basicValue = ref('')
const tooltipValue = ref('')
const popoverValue = ref('')
const hoverPopoverValue = ref('')
const disabledValue = ref('禁用状态的值')
const passwordValue = ref('')
const searchValue = ref('')
const numberValue = ref(0)
const textareaValue = ref('')
const largeValue = ref('')
const defaultValue = ref('')
const smallValue = ref('')
const debounceValue = ref('')
const prefixValue = ref('')
const suffixValue = ref('')
const readonlyValue = ref('这是只读内容')
const autosizeValue = ref('')
const eventValue = ref('')

// 日志数据
const inputLogs = ref([])
const eventLogs = ref([])

// 事件处理函数
const handleChange = (value) => {
  ElMessage.success(`值已改变：${value}`)
}

const handleSearch = (value) => {
  ElMessage.info(`搜索：${value}`)
}

const handleDebounceInput = (value) => {
  const timestamp = new Date().toLocaleTimeString()
  inputLogs.value.unshift(`${timestamp}: ${value}`)
  if (inputLogs.value.length > 5) {
    inputLogs.value.pop()
  }
}

const handleFocus = (event) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLogs.value.unshift(`${timestamp}: 获得焦点`)
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}

const handleBlur = (event) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLogs.value.unshift(`${timestamp}: 失去焦点`)
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}

const handleEventChange = (value) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLogs.value.unshift(`${timestamp}: 值改变 - ${value}`)
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}

const handleClear = () => {
  const timestamp = new Date().toLocaleTimeString()
  eventLogs.value.unshift(`${timestamp}: 清空内容`)
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}
</script>

<style lang="scss" scoped>
.zx-input-example {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  .example-header {
    margin-bottom: 32px;
    text-align: center;

    h1 {
      font-size: 28px;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }

    p {
      font-size: 16px;
      color: var(--el-text-color-regular);
      margin: 0;
    }
  }

  .example-section {
    margin-bottom: 40px;

    h2 {
      font-size: 20px;
      color: var(--el-text-color-primary);
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--el-color-primary);
    }

    .example-block {
      display: grid;
      gap: 20px;
    }

    .example-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-weight: 500;
        color: var(--el-text-color-primary);
        font-size: 14px;
      }

      .example-value {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin-top: 4px;
      }

      .example-log {
        margin-top: 12px;
        padding: 12px;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;
        border: 1px solid var(--el-border-color-light);

        p {
          margin: 0 0 8px 0;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        ul {
          margin: 0;
          padding: 0;
          list-style: none;
          max-height: 120px;
          overflow-y: auto;

          li {
            padding: 4px 0;
            font-size: 12px;
            color: var(--el-text-color-regular);
            border-bottom: 1px solid var(--el-border-color-lighter);

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }
  }

  // 响应式设计
  @media (min-width: 768px) {
    .example-section {
      .example-block {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      }
    }
  }

  @media (max-width: 767px) {
    padding: 16px;

    .example-header {
      margin-bottom: 24px;

      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }
    }

    .example-section {
      margin-bottom: 32px;

      h2 {
        font-size: 18px;
      }
    }
  }
}
</style>
