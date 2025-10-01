<template>
  <div class="zx-tags-input-demo">
    <div class="demo-header">
      <h1>ZxTagsInput 标签输入组件</h1>
      <p>基于 Element Plus 的标签输入组件，支持多种配置和自定义验证。</p>
    </div>

    <div class="demo-section">
      <h2>基础用法</h2>
      <p>最简单的用法，支持回车添加标签，点击删除标签。</p>
      <div class="demo-block">
        <ZxTagsInput
          v-model="basicTags"
          placeholder="请输入标签，按回车添加"
          @change="handleBasicChange"
        />
        <div class="demo-result">
          <strong>当前标签：</strong>{{ basicTags.join(', ') || '无' }}
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>带添加按钮</h2>
      <p>显示添加按钮，可以通过按钮添加标签。</p>
      <div class="demo-block">
        <ZxTagsInput
          v-model="buttonTags"
          placeholder="输入标签内容"
          :show-add-button="true"
          add-button-text="添加标签"
        />
        <div class="demo-result">
          <strong>当前标签：</strong>{{ buttonTags.join(', ') || '无' }}
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>不同尺寸</h2>
      <p>提供大、默认、小三种尺寸。</p>
      <div class="demo-block">
        <div class="size-demo">
          <div class="size-item">
            <label>大尺寸：</label>
            <ZxTagsInput v-model="sizeTags.large" size="large" placeholder="大尺寸标签输入" />
          </div>
          <div class="size-item">
            <label>默认尺寸：</label>
            <ZxTagsInput v-model="sizeTags.default" size="default" placeholder="默认尺寸标签输入" />
          </div>
          <div class="size-item">
            <label>小尺寸：</label>
            <ZxTagsInput v-model="sizeTags.small" size="small" placeholder="小尺寸标签输入" />
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>标签类型</h2>
      <p>支持不同类型的标签样式。</p>
      <div class="demo-block">
        <div class="type-demo">
          <div class="type-item">
            <label>默认类型：</label>
            <ZxTagsInput v-model="typeTags.default" tag-type="" placeholder="默认类型标签" />
          </div>
          <div class="type-item">
            <label>成功类型：</label>
            <ZxTagsInput v-model="typeTags.success" tag-type="success" placeholder="成功类型标签" />
          </div>
          <div class="type-item">
            <label>信息类型：</label>
            <ZxTagsInput v-model="typeTags.info" tag-type="info" placeholder="信息类型标签" />
          </div>
          <div class="type-item">
            <label>警告类型：</label>
            <ZxTagsInput v-model="typeTags.warning" tag-type="warning" placeholder="警告类型标签" />
          </div>
          <div class="type-item">
            <label>危险类型：</label>
            <ZxTagsInput v-model="typeTags.danger" tag-type="danger" placeholder="危险类型标签" />
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>限制配置</h2>
      <p>可以限制标签数量、长度等。</p>
      <div class="demo-block">
        <div class="limit-demo">
          <div class="limit-item">
            <label>最多3个标签：</label>
            <ZxTagsInput v-model="limitTags.count" :max-count="3" placeholder="最多添加3个标签" />
          </div>
          <div class="limit-item">
            <label>标签长度2-8字符：</label>
            <ZxTagsInput
              v-model="limitTags.length"
              :min-length="2"
              :max-length="8"
              :show-word-limit="true"
              placeholder="标签长度2-8字符"
            />
          </div>
          <div class="limit-item">
            <label>允许重复标签：</label>
            <ZxTagsInput
              v-model="limitTags.duplicate"
              :allow-duplicates="true"
              placeholder="允许添加重复标签"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>自定义验证</h2>
      <p>可以添加自定义验证规则。</p>
      <div class="demo-block">
        <ZxTagsInput
          v-model="validatorTags"
          :validator="customValidator"
          placeholder="只能添加数字标签"
        />
        <div class="demo-result"> <strong>验证规则：</strong>只能添加纯数字标签 </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>状态演示</h2>
      <p>只读和禁用状态。</p>
      <div class="demo-block">
        <div class="state-demo">
          <div class="state-item">
            <label>只读状态：</label>
            <ZxTagsInput v-model="stateTags.readonly" :readonly="true" />
          </div>
          <div class="state-item">
            <label>禁用状态：</label>
            <ZxTagsInput v-model="stateTags.disabled" :disabled="true" placeholder="禁用状态" />
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>事件监听</h2>
      <p>监听各种事件。</p>
      <div class="demo-block">
        <ZxTagsInput
          v-model="eventTags"
          placeholder="操作标签查看事件"
          @add="handleAdd"
          @remove="handleRemove"
          @tag-click="handleTagClick"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <div class="demo-result"> <strong>最近事件：</strong>{{ lastEvent || '无' }} </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>插槽使用</h2>
      <p>自定义标签内容。</p>
      <div class="demo-block">
        <ZxTagsInput v-model="slotTags" placeholder="添加标签查看自定义样式">
          <template #tag="{ tag, index }">
            <span class="custom-tag-content">
              <el-icon><Star /></el-icon>
              {{ tag }}
              <span class="tag-index">#{{ index + 1 }}</span>
            </span>
          </template>
        </ZxTagsInput>
      </div>
    </div>

    <div class="demo-section">
      <h2>方法调用</h2>
      <p>通过 ref 调用组件方法。</p>
      <div class="demo-block">
        <ZxTagsInput ref="methodRef" v-model="methodTags" placeholder="测试方法调用" />
        <div class="demo-actions">
          <el-button @click="focusInput">聚焦输入框</el-button>
          <el-button @click="blurInput">失焦输入框</el-button>
          <el-button @click="addMethodTag">添加标签</el-button>
          <el-button @click="clearTags">清空标签</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import ZxTagsInput from './index.vue'

// 基础用法
const basicTags = ref(['Vue', 'Element Plus'])

// 带按钮
const buttonTags = ref(['JavaScript', 'TypeScript'])

// 不同尺寸
const sizeTags = ref({
  large: ['大尺寸'],
  default: ['默认尺寸'],
  small: ['小尺寸']
})

// 标签类型
const typeTags = ref({
  default: ['默认'],
  success: ['成功'],
  info: ['信息'],
  warning: ['警告'],
  danger: ['危险']
})

// 限制配置
const limitTags = ref({
  count: ['标签1', '标签2'],
  length: ['短标签'],
  duplicate: ['重复', '重复']
})

// 自定义验证
const validatorTags = ref(['123', '456'])

// 状态演示
const stateTags = ref({
  readonly: ['只读标签1', '只读标签2'],
  disabled: ['禁用标签']
})

// 事件监听
const eventTags = ref(['事件标签'])
const lastEvent = ref('')

// 插槽使用
const slotTags = ref(['自定义标签'])

// 方法调用
const methodTags = ref(['方法测试'])
const methodRef = ref()

// 方法
const handleBasicChange = (tags) => {
  console.log('基础标签变化:', tags)
}

const customValidator = (value) => {
  const isNumber = /^\d+$/.test(value)
  if (!isNumber) {
    ElMessage.warning('只能添加纯数字标签')
  }
  return isNumber
}

const handleAdd = (tag) => {
  lastEvent.value = `添加标签: ${tag}`
}

const handleRemove = (tag, index) => {
  lastEvent.value = `删除标签: ${tag} (索引: ${index})`
}

const handleTagClick = (tag, index) => {
  lastEvent.value = `点击标签: ${tag} (索引: ${index})`
}

const handleFocus = () => {
  lastEvent.value = '输入框获得焦点'
}

const handleBlur = () => {
  lastEvent.value = '输入框失去焦点'
}

const focusInput = () => {
  methodRef.value?.focus()
}

const blurInput = () => {
  methodRef.value?.blur()
}

const addMethodTag = () => {
  methodRef.value?.addTag()
}

const clearTags = () => {
  methodRef.value?.clear()
}
</script>

<style lang="scss" scoped>
.zx-tags-input-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  margin-bottom: 40px;
  text-align: center;

  h1 {
    font-size: 28px;
    color: #303133;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    color: #606266;
    margin: 0;
  }
}

.demo-section {
  margin-bottom: 40px;

  h2 {
    font-size: 20px;
    color: #303133;
    margin-bottom: 10px;
    border-bottom: 2px solid #409eff;
    padding-bottom: 5px;
  }

  p {
    color: #606266;
    margin-bottom: 20px;
    line-height: 1.6;
  }
}

.demo-block {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 20px;
  background-color: #fafafa;
}

.demo-result {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  color: #409eff;
  font-size: 14px;
}

.size-demo,
.type-demo,
.limit-demo,
.state-demo {
  .size-item,
  .type-item,
  .limit-item,
  .state-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      width: 120px;
      font-weight: 500;
      color: #606266;
      flex-shrink: 0;
    }

    .zx-tags-input {
      flex: 1;
      max-width: 400px;
    }
  }
}

.demo-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.custom-tag-content {
  display: flex;
  align-items: center;
  gap: 4px;

  .tag-index {
    font-size: 12px;
    opacity: 0.7;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .zx-tags-input-demo {
    padding: 15px;
  }

  .size-demo,
  .type-demo,
  .limit-demo,
  .state-demo {
    .size-item,
    .type-item,
    .limit-item,
    .state-item {
      flex-direction: column;
      align-items: stretch;

      label {
        width: auto;
        margin-bottom: 8px;
      }

      .zx-tags-input {
        max-width: none;
      }
    }
  }

  .demo-actions {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}
</style>
