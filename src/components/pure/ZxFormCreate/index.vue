<template>
  <div class="zx-form-create">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      v-bind="formProps"
      @validate="handleValidate"
    >
      <template v-for="item in formItems" :key="item.field">
        <!-- 输入框 -->
        <el-form-item
          v-if="item.type === 'input'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-input
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 文本域 -->
        <el-form-item
          v-else-if="item.type === 'textarea'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-input
            v-model="formModel[item.field]"
            type="textarea"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 数字输入框 -->
        <el-form-item
          v-else-if="item.type === 'number'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-input-number
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 选择器 -->
        <el-form-item
          v-else-if="item.type === 'select'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-select
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            />
          </el-select>
        </el-form-item>

        <!-- 单选框组 -->
        <el-form-item
          v-else-if="item.type === 'radio'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-radio-group
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          >
            <el-radio
              v-for="option in item.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 复选框组 -->
        <el-form-item
          v-else-if="item.type === 'checkbox'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-checkbox-group
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          >
            <el-checkbox
              v-for="option in item.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 日期选择器 -->
        <el-form-item
          v-else-if="item.type === 'date'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-date-picker
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 时间选择器 -->
        <el-form-item
          v-else-if="item.type === 'time'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-time-picker
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 级联选择器 -->
        <el-form-item
          v-else-if="item.type === 'cascader'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-cascader
            v-model="formModel[item.field]"
            :options="item.options"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 开关 -->
        <el-form-item
          v-else-if="item.type === 'switch'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-switch
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 滑块 -->
        <el-form-item
          v-else-if="item.type === 'slider'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-slider
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 评分 -->
        <el-form-item
          v-else-if="item.type === 'rate'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-rate
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 颜色选择器 -->
        <el-form-item
          v-else-if="item.type === 'color'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-color-picker
            v-model="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          />
        </el-form-item>

        <!-- 上传 -->
        <el-form-item
          v-else-if="item.type === 'upload'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <el-upload
            v-model:file-list="formModel[item.field]"
            v-bind="item.props"
            @change="handleChange(item.field, formModel[item.field])"
          >
            <slot :name="`upload-${item.field}`">
              <el-button type="primary">点击上传</el-button>
            </slot>
          </el-upload>
        </el-form-item>

        <!-- 自定义组件插槽 -->
        <el-form-item
          v-else-if="item.type === 'slot'"
          :label="item.label"
          :prop="item.field"
          :required="item.required"
        >
          <slot :name="item.field" :item="item" :model="formModel"></slot>
        </el-form-item>
      </template>

      <!-- 表单操作按钮 -->
      <el-form-item v-if="showActions" class="zx-form-create-actions">
        <slot name="actions" :form-ref="formRef" :model="formModel">
          <el-button @click="handleReset">{{ resetText }}</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            {{ submitText }}
          </el-button>
        </slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { FieldTypeFormRules } from './form-create.js'

// 定义属性
const props = defineProps({
  // 表单配置项
  items: {
    type: Array,
    default: () => []
  },
  // 表单初始值
  modelValue: {
    type: Object,
    default: () => ({})
  },
  // 表单属性
  formProps: {
    type: Object,
    default: () => ({
      labelWidth: '100px',
      labelPosition: 'right'
    })
  },
  // 是否显示操作按钮
  showActions: {
    type: Boolean,
    default: true
  },
  // 重置按钮文本
  resetText: {
    type: String,
    default: '重置'
  },
  // 提交按钮文本
  submitText: {
    type: String,
    default: '提交'
  },
  // 提交按钮加载状态
  submitLoading: {
    type: Boolean,
    default: false
  },
  // 是否禁用表单
  disabled: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change', 'submit', 'reset', 'validate'])

// 响应式数据
const formRef = ref()
const formModel = reactive({})
const formRules = reactive({})

// 计算表单项
const formItems = computed(() => {
  return props.items.map((item) => {
    const defaultConfig = FieldTypeFormRules[item.type?.toUpperCase()]
    return {
      ...defaultConfig,
      ...item,
      props: {
        ...defaultConfig?.props,
        ...item.props,
        // 同时兼顾全局 disabled、字段自身 disabled 及 item.props.disabled
        disabled: props.disabled || item.disabled || (item.props && item.props.disabled)
      }
    }
  })
})

// 初始化/同步表单数据与规则
const initFormModel = (full = true) => {
  if (full) {
    // 全量初始化：用于首次挂载或主动重置
    Object.keys(formModel).forEach((key) => {
      delete formModel[key]
    })
    props.items.forEach((item) => {
      if (item.field) {
        formModel[item.field] =
          props.modelValue[item.field] ?? item.value ?? getDefaultValue(item.type)
      }
    })
  } else {
    // 增量同步：当 items 的 props/options 等发生变化时，不重置已有值，只为新增字段赋默认值，移除已删除字段
    const nextFields = new Set(props.items.filter((i) => i.field).map((i) => i.field))
    // 删除不存在的字段
    Object.keys(formModel).forEach((key) => {
      if (!nextFields.has(key)) {
        delete formModel[key]
      }
    })
    // 为新增字段设置默认值，已有字段保持现值
    props.items.forEach((item) => {
      if (!item.field) return
      if (!(item.field in formModel)) {
        formModel[item.field] =
          props.modelValue[item.field] ?? item.value ?? getDefaultValue(item.type)
      }
    })
  }

  // 重建验证规则（规则与 required 可能随 items 变化）
  Object.keys(formRules).forEach((key) => {
    delete formRules[key]
  })
  props.items.forEach((item) => {
    if (!item.field) return
    if (item.rules) {
      formRules[item.field] = item.rules
    } else if (item.required) {
      formRules[item.field] = [
        {
          required: true,
          message: `请${getRequiredMessage(item.type)}${item.label}`,
          trigger: getTrigger(item.type)
        }
      ]
    }
  })
}

// 获取默认值
const getDefaultValue = (type) => {
  const defaultValues = {
    input: '',
    textarea: '',
    number: 0,
    select: '',
    radio: '',
    checkbox: [],
    date: '',
    time: '',
    cascader: [],
    switch: false,
    slider: 0,
    rate: 0,
    color: '',
    upload: []
  }
  return defaultValues[type] ?? ''
}

// 获取必填提示文字
const getRequiredMessage = (type) => {
  const messages = {
    input: '输入',
    textarea: '输入',
    number: '输入',
    select: '选择',
    radio: '选择',
    checkbox: '选择',
    date: '选择',
    time: '选择',
    cascader: '选择',
    switch: '选择',
    slider: '选择',
    rate: '选择',
    color: '选择',
    upload: '上传'
  }
  return messages[type] ?? '填写'
}

// 获取验证触发方式
const getTrigger = (type) => {
  const triggers = {
    input: 'blur',
    textarea: 'blur',
    number: 'blur',
    select: 'change',
    radio: 'change',
    checkbox: 'change',
    date: 'change',
    time: 'change',
    cascader: 'change',
    switch: 'change',
    slider: 'change',
    rate: 'change',
    color: 'change',
    upload: 'change'
  }
  return triggers[type] ?? 'change'
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    Object.keys(newVal).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(formModel, key)) {
        formModel[key] = newVal[key]
      }
    })
  },
  { deep: true }
)

// 监听 formModel 变化
watch(
  formModel,
  (newVal) => {
    // 创建一个旧值的拷贝
    const updated = { ...props.modelValue }
    // 更新每个字段
    Object.keys(newVal).forEach((key) => {
      updated[key] = newVal[key]
    })
    // 将更新后的对象 emit 给父组件
    emit('update:modelValue', updated)
  },
  { deep: true }
)

// 监听 items 变化
watch(
  () => props.items,
  (newVal, oldVal) => {
    // 首次：全量初始化；后续：增量同步，避免因选项联动造成的值被重置
    initFormModel(!oldVal)
  },
  { immediate: true, deep: true }
)

// 事件处理函数
const handleChange = (field, value) => {
  emit('change', field, value, formModel)
}

const handleValidate = (prop, isValid, message) => {
  emit('validate', prop, isValid, message)
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      emit('submit', { ...formModel })
    }
  } catch (error) {
    console.warn('表单验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value.resetFields()
  initFormModel(true)
  emit('reset', { ...formModel })
}

// 暴露方法
const validate = () => {
  return formRef.value.validate()
}

const validateField = (field) => {
  return formRef.value.validateField(field)
}

const clearValidate = (fields) => {
  formRef.value.clearValidate(fields)
}

const resetFields = () => {
  formRef.value.resetFields()
  initFormModel(true)
}

const getFieldValue = (field) => {
  return formModel[field]
}

const setFieldValue = (field, value) => {
  formModel[field] = value
}

const getFormData = () => {
  return { ...formModel }
}

const setFormData = (data) => {
  Object.keys(data).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(formModel, key)) {
      formModel[key] = data[key]
    }
  })
}

defineExpose({
  validate,
  validateField,
  clearValidate,
  resetFields,
  getFieldValue,
  setFieldValue,
  getFormData,
  setFormData,
  formRef
})
</script>

<style lang="scss">
@import './index.scss';
</style>
