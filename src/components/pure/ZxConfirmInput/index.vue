<template>
  <ZxDialog
    v-model="visible"
    :title="title || '需要确认'"
    :width="width"
    :closable="closable"
    :mask-closable="maskClosable"
    :unmount-on-close="unmountOnClose"
    :class="['zx-confirm-input', `zx-confirm-input--${tone}`]"
    :no-content-padding="true"
    custom-class="zx-confirm-input__dlg"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- GitLab 风格的内容区域 -->
    <div class="zx-confirm-input__content">
      <!-- 第一行：危险警告（加粗红色） -->
      <div class="zx-confirm-input__danger-warning">
        <slot name="danger-message">
          {{
            dangerMessage ||
            `您即将删除 ${targetName || '-'}。删除的${targetType || '-'}无法恢复！您确定要继续吗？`
          }}
        </slot>
      </div>

      <!-- 第二行：操作描述 + 输入提示 -->
      <div class="zx-confirm-input__description">
        <slot name="description">
          {{ description || '此操作可能导致数据丢失。为了防止意外操作，我们要求您确认您的意图。' }}
        </slot>
        <slot name="input-hint">
          请输入
          <strong class="zx-confirm-input__keyword">{{
            keyword || targetName || '项目名称'
          }}</strong>
          以继续，或关闭此对话框取消操作。
        </slot>
      </div>

      <!-- 输入框 -->
      <el-form :model="form" :rules="rules" ref="formRef" class="zx-confirm-input__form">
        <el-form-item prop="value" class="zx-confirm-input__form-item">
          <ZxInput
            v-model.trim="form.value"
            size="small"
            clearable
            v-bind="inputProps"
            class="zx-confirm-input__input"
            @keydown.enter="handleEnterKey"
          />
        </el-form-item>

        <slot name="extra"></slot>
      </el-form>
    </div>

    <!-- 分割线 -->
    <el-divider class="zx-confirm-input__divider" />

    <!-- Footer 操作区域 -->
    <template #footer>
      <div class="zx-confirm-input__footer">
        <slot name="footer-left"></slot>
        <div class="zx-confirm-input__actions">
          <el-button
            type="danger"
            :class="{ 'zx-confirm-input__btn--rounded': rounded }"
            :disabled="confirmDisabled || isLoading"
            :loading="isLoading"
            size="default"
            @click="tryConfirm"
            class="zx-confirm-input__confirm-btn"
          >
            {{ okText || '确认删除' }}
          </el-button>
        </div>
      </div>
    </template>
  </ZxDialog>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import { useZxConfirmInput } from './hook'

// Props 对齐 GitLab 风格
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '需要确认' },
  /** GitLab 风格：危险警告文本（第一行，红色加粗） */
  dangerMessage: { type: String, default: '' },
  /** 操作描述文本（第二行） */
  description: { type: String, default: '' },
  /** 目标名称，如项目名、用户名等 */
  targetName: { type: String, default: '' },
  /** 目标类型，如"项目"、"用户"、"文件"等 */
  targetType: { type: String, default: '项' },
  /** 要求匹配的关键字，例如项目名；留空时仅要求非空输入（当 requireKeyword 为 true） */
  keyword: { type: String, default: '' },
  /** 正则校验（与 keyword 二选一，正则优先） */
  pattern: { type: [RegExp, String], default: null },
  /** 自定义校验函数 (val) => true | string | Promise<boolean|string> */
  validator: { type: Function, default: null },
  /** 是否要求必须输入（默认是），禁用则允许直接确认 */
  requireKeyword: { type: Boolean, default: true },
  /** 确认操作的接口函数，返回 Promise，支持异步操作和 loading 状态 */
  confirmAction: { type: Function, default: null },
  /** 大小与行为 */
  width: { type: [String, Number], default: 520 },
  closable: { type: Boolean, default: true },
  maskClosable: { type: Boolean, default: false },
  unmountOnClose: { type: Boolean, default: false },
  /** 文案与输入相关 */
  placeholder: { type: String, default: '' },
  okText: { type: String, default: '确认删除' },
  cancelText: { type: String, default: '取消' },
  showCancelButton: { type: Boolean, default: true },
  okLoading: { type: Boolean, default: false },
  disabledWhenMismatch: { type: Boolean, default: true },
  caseSensitive: { type: Boolean, default: true },
  autofocus: { type: Boolean, default: true },
  maxlength: { type: Number, default: 0 },
  inputProps: { type: Object, default: () => ({}) },
  /** 按钮是否使用圆角 */
  rounded: { type: Boolean, default: false },
  /** 提示和底部区域的语气：danger|warning|info */
  tone: {
    type: String,
    default: 'danger',
    validator: (v) => ['danger', 'warning', 'info'].includes(v)
  },
  /** 是否显示内部错误消息（ElMessage），为 false 时仅抛出 error 事件 */
  showErrorMessage: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'open', 'close', 'error'])

// 使用 Hook 来管理所有逻辑
const {
  // 引用
  formRef,

  // 表单相关
  form,
  rules,
  localValid,
  isMatch,
  errorText,
  normalizedPattern,

  // 对话框状态
  visible,
  handleOpen,
  handleClose,
  handleCancel,

  // 确认操作
  internalLoading,
  isLoading,
  confirmDisabled,
  tryConfirm,

  // 键盘事件
  handleEnterKey,
  handleEscapeKey
} = useZxConfirmInput(props, emit)
</script>

<style lang="scss">
@import './index.scss';
</style>
