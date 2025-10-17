<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElCard, ElTooltip } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-wrap')

const props = defineProps({
  title: propTypes.string.def(''),
  message: propTypes.string.def(''),
  // Footer 相关配置
  showFooter: propTypes.bool.def(false), // 是否显示底部栏
  loading: propTypes.bool.def(false), // 加载状态
  isEdit: propTypes.bool.def(false), // 是否为编辑模式
  hideContinue: propTypes.bool.def(false), // 隐藏保存并继续按钮
  footerFixed: propTypes.bool.def(true), // 底部是否固定定位
  cancelText: propTypes.string.def('取消'), // 取消按钮文案
  saveText: propTypes.string.def(''), // 保存按钮文案（空则使用默认）
  continueText: propTypes.string.def('保存并继续'), // 保存并继续按钮文案
  handleBack: propTypes.func.def(undefined) // 自定义返回函数
})

const emit = defineEmits(['save', 'saveAndContinue', 'cancel'])

const router = useRouter()

// 保存按钮文案
const saveBtnText = computed(() => {
  if (props.saveText) return props.saveText
  return props.isEdit ? '更新' : '确认'
})

// 处理取消/返回
const handleCancel = () => {
  if (typeof props.handleBack === 'function') {
    props.handleBack()
  } else {
    emit('cancel')
    router.back()
  }
}

// 处理保存
const handleSave = () => {
  emit('save')
}

// 处理保存并继续
const handleSaveAndContinue = () => {
  emit('saveAndContinue')
}
</script>

<template>
  <ElCard :class="[prefixCls, showFooter ? `${prefixCls}--with-footer` : '']" shadow="never">
    <template v-if="title" #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center">
          <span class="text-16px font-700">{{ title }}</span>
          <ElTooltip v-if="message" effect="dark" placement="right">
            <template #content>
              <div class="max-w-200px">{{ message }}</div>
            </template>
            <Icon class="ml-5px" icon="vi-bi:question-circle-fill" :size="14" />
          </ElTooltip>
          <div class="flex pl-20px">
            <slot name="header"></slot>
          </div>
        </div>
        <div class="flex items-center">
          <slot name="headerRight"></slot>
        </div>
      </div>
    </template>
    <div class="h-full">
      <slot></slot>
    </div>

    <!-- Footer 部分 -->
    <div
      v-if="showFooter"
      :class="[
        `${prefixCls}-footer`,
        footerFixed ? `${prefixCls}-footer--fixed` : `${prefixCls}-footer--static`
      ]"
    >
      <div :class="`${prefixCls}-footer__left`">
        <slot name="footerLeft"></slot>
      </div>
      <div :class="`${prefixCls}-footer__right`">
        <slot name="footerRight">
          <div class="flex items-center gap-12px">
            <BaseButton :disabled="loading" @click="handleCancel">
              {{ cancelText }}
            </BaseButton>
            <BaseButton
              v-if="!hideContinue && !isEdit"
              :loading="loading"
              type="primary"
              plain
              @click="handleSaveAndContinue"
            >
              {{ continueText }}
            </BaseButton>
            <BaseButton :loading="loading" type="primary" @click="handleSave">
              {{ saveBtnText }}
            </BaseButton>
          </div>
        </slot>
      </div>
    </div>
  </ElCard>
</template>

<style lang="less" scoped>
.v-content-wrap {
  &--with-footer {
    // 当有 footer 时，给内容区域增加底部间距，避免被 fixed footer 遮挡
    :deep(.el-card__body) {
      padding-bottom: 80px;
    }
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-light);

    &--fixed {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
      box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
    }

    &--static {
      position: relative;
      margin-top: 16px;
    }

    &__left {
      flex: 0 0 auto;
      margin-right: auto;
    }

    &__right {
      flex: 0 0 auto;
      margin-left: auto;
    }
  }
}
</style>
