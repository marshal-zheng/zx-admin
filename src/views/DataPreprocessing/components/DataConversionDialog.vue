<template>
  <ZxDialog v-bind="dialogProps" v-on="dialogEvents">
    <div class="data-conversion-container">
      <el-form
        ref="formRef"
        :model="state.data"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
      <!-- 转换类型选择 -->
      <el-form-item label="转换类型" prop="conversionType">
        <DataConversionTypeSelector
          v-model="state.data.conversionType"
          @change="handleConversionTypeChange"
        />
      </el-form-item>

      <!-- 脏数据检测 -->
      <template v-if="state.data.conversionType === DataConversionType.DIRTY_DATA_DETECTION">
        <!-- 检测字段多选 -->
        <el-form-item label="检测字段" prop="selectedFields">
          <DetectionFieldSelector
            v-model="state.data.selectedFields"
            :table-name="currentTableName"
          />
        </el-form-item>

        <!-- 检测配置 -->
        <el-form-item label="检测配置">
          <DataGrid
            v-model="detectionConfigList"
            :columns="detectionColumns"
            :show-add-button="false"
            :show-actions="false"
          />
        </el-form-item>
      </template>

      <!-- 缺失值填充 -->
      <template v-if="state.data.conversionType === DataConversionType.MISSING_VALUE_FILL">
        <el-form-item label="检测字段" prop="selectedFields">
          <DetectionFieldSelector
            v-model="state.data.selectedFields"
            :table-name="currentTableName"
          />
        </el-form-item>

        <el-form-item label="填充配置">
          <DataGrid
            v-model="fillConfigList"
            :columns="fillColumns"
            :show-add-button="false"
            :show-actions="false"
          />
        </el-form-item>
      </template>

      <!-- 野值剔除 -->
      <template v-if="state.data.conversionType === DataConversionType.OUTLIER_REMOVAL">
        <el-form-item label="检测字段" prop="selectedFields">
          <DetectionFieldSelector
            v-model="state.data.selectedFields"
            :table-name="currentTableName"
          />
        </el-form-item>

        <el-form-item label="剔除配置">
          <DataGrid
            v-model="outlierConfigList"
            :columns="outlierColumns"
            :show-add-button="false"
            :show-actions="false"
          />
        </el-form-item>
      </template>
    </el-form>
    </div>
  </ZxDialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, h, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElInput, type FormInstance, type FormRules } from 'element-plus'
import { useDialog } from '@zxio/zxui'
import { DataConversionTypeSelector, DetectionMethodSelector, DetectionFieldSelector } from './selector'
import { DataConversionType, DetectionMethod } from './model'
import { datasetsApi } from '@/api/modules/dataPreprocessing/datasets'
import { DataGrid } from '@/components/DataGrid'

defineOptions({
  name: 'DataConversionDialog'
})

// 路由
const router = useRouter()

// 接口定义
interface TableField {
  name: string
  comment: string
  type: string
}

interface DetectionConfig {
  fieldName: string
  fieldLabel: string
  method: DetectionMethod
  regexp?: string
}

interface FillConfig {
  fieldName: string
  fieldLabel: string
  fillValue: string
}

interface OutlierConfig {
  fieldName: string
  fieldLabel: string
  minValue?: number
  maxValue?: number
}

interface FormData {
  conversionType: DataConversionType
  selectedFields: string[]
}

// Props & Emits
const emit = defineEmits<{
  success: []
}>()

// 当前操作的表名
const currentTableName = ref('')

// 响应式数据
const formRef = ref<FormInstance>()

// 检测配置列表 (DataGrid 使用)
const detectionConfigList = ref<DetectionConfig[]>([])

// 填充配置列表 (DataGrid 使用)
const fillConfigList = ref<FillConfig[]>([])

// 野值剔除配置列表 (DataGrid 使用)
const outlierConfigList = ref<OutlierConfig[]>([])

// 表单验证规则
const formRules: FormRules = {
  conversionType: [
    { required: true, message: '请选择转换类型', trigger: 'change' }
  ],
  selectedFields: [
    { required: true, message: '请选择检测字段', trigger: 'change' }
  ]
}

// 检测配置列定义
const detectionColumns = computed(() => [
  {
    key: 'fieldLabel',
    dataKey: 'fieldLabel',
    title: '检测字段',
    type: 'text' as const,
    width: 200
  },
  {
    key: 'detection',
    dataKey: 'method',
    title: '检测方式',
    type: 'custom' as const,
    cellRenderer: defineComponent({
      props: ['modelValue', 'row', 'column', 'rowIndex'],
      emits: ['update:modelValue'],
      setup(props, { emit }) {
        const handleMethodChange = (value: DetectionMethod) => {
          emit('update:modelValue', value)
          // 如果切换到空值检测，清空正则表达式
          if (value === DetectionMethod.IS_NOT_NULL) {
            props.row.regexp = ''
          }
        }

        const handleRegexpChange = (value: string) => {
          props.row.regexp = value
        }

        return () => {
          const children = [
            h(DetectionMethodSelector, {
              modelValue: props.row.method,
              'onUpdate:modelValue': handleMethodChange,
              allowClear: false,
              placeholder: '请选择检测方式',
              style: { width: '160px', flexShrink: 0 }
            })
          ]

          if (props.row.method === DetectionMethod.FORMAT_ERROR) {
            children.push(
              h(ElInput, {
                modelValue: props.row.regexp,
                'onUpdate:modelValue': handleRegexpChange,
                placeholder: '请输入正则表达式',
                style: { flex: 1, minWidth: '250px' }
              })
            )
          }

          return h('div', {
            style: { display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }
          }, children)
        }
      }
    })
  }
])

// 填充配置列定义
const fillColumns = computed(() => [
  {
    key: 'fieldLabel',
    dataKey: 'fieldLabel',
    title: '检测字段',
    type: 'text' as const,
    width: 200
  },
  {
    key: 'fillValue',
    dataKey: 'fillValue',
    title: '填充值',
    type: 'input' as const,
    placeholder: '请输入填充值'
  }
])

// 野值剔除配置列定义
const outlierColumns = computed(() => [
  {
    key: 'fieldLabel',
    dataKey: 'fieldLabel',
    title: '检测字段',
    type: 'text' as const,
  },
  {
    key: 'minValue',
    dataKey: 'minValue',
    title: '最小值',
    type: 'number' as const,
    placeholder: '请输入最小值',
  },
  {
    key: 'maxValue',
    dataKey: 'maxValue',
    title: '最大值',
    type: 'number' as const,
    placeholder: '请输入最大值',
  }
])

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open, close, setLoading } = useDialog<FormData>({
  // 对话框标题
  title: '数据转换',

  // 对话框配置
  width: '60%',

  // 表单配置
  formRef: formRef as any,
  preValidate: true,
  autoScrollToError: true,

  // 默认数据
  defaultData: () => ({
    conversionType: DataConversionType.DIRTY_DATA_DETECTION,
    selectedFields: []
  }),

  // 确认回调
  onConfirm: async (data) => {
    // 构造提交数据
    let submitData: any = {}
    
    
    if (data.conversionType === DataConversionType.DIRTY_DATA_DETECTION) {
      // 从 detectionConfigList 中构建检测配置列表
      const zsjSelectDataList = detectionConfigList.value
        .filter(config => config.method)
        .map(config => {
          const item: any = {
            name: config.fieldName,
            type: config.method
          }
          // 只有格式错误检测才包含 regexp 字段
          if (config.method === DetectionMethod.FORMAT_ERROR) {
            item.regexp = config.regexp || ''
          }
          return item
        })
      
      
      if (zsjSelectDataList.length === 0) {
        throw new Error('请为每个检测字段配置检测方式')
      }
      
      // 验证格式错误检测必须填写正则表达式
      const missingRegexp = zsjSelectDataList.find(
        item => item.type === DetectionMethod.FORMAT_ERROR && !item.regexp
      )
      if (missingRegexp) {
        throw new Error('格式错误检测必须填写正则表达式')
      }
      
      submitData = { zsjSelectDataList }
    } else if (data.conversionType === DataConversionType.MISSING_VALUE_FILL) {
      // 从 fillConfigList 中构建填充配置列表
      const qszSelectDataList = fillConfigList.value
        .filter(config => config.fillValue)
        .map(config => ({
          name: config.fieldName,
          value: config.fillValue
        }))
      
      if (qszSelectDataList.length === 0) {
        throw new Error('请为每个检测字段配置填充值')
      }
      
      submitData = { qszSelectDataList }
    } else if (data.conversionType === DataConversionType.OUTLIER_REMOVAL) {
      // 从 outlierConfigList 中构建野值剔除配置列表
      const yztcSelectDataList = outlierConfigList.value.map(config => ({
        name: config.fieldName,
        min: config.minValue?.toString() || '',
        max: config.maxValue?.toString() || ''
      }))
      
      if (yztcSelectDataList.length === 0) {
        throw new Error('请选择检测字段')
      }
      
      submitData = { yztcSelectDataList }
    }
    
    console.log('提交数据转换请求:', submitData)
    
    // 根据转换类型调用不同的API
    let apiResponse: any
    if (data.conversionType === DataConversionType.DIRTY_DATA_DETECTION) {
      apiResponse = await datasetsApi.dirtyDataDetection(currentTableName.value, submitData)
    } else if (data.conversionType === DataConversionType.MISSING_VALUE_FILL) {
      apiResponse = await datasetsApi.missingValueFill(currentTableName.value, submitData)
    } else if (data.conversionType === DataConversionType.OUTLIER_REMOVAL) {
      apiResponse = await datasetsApi.outlierRemoval(currentTableName.value, submitData)
    }
    
    console.log('数据转换响应:', apiResponse)
    
    ElMessage.success('数据转换成功')
    emit('success')
    
    // 重置配置
    resetConfigs()
    
    // 跳转到数据转换列表页的"转换后"标签页
    router.push({
      name: 'DataConversion',
      query: { tab: 'after-conversion' }
    })
    
    return apiResponse
  },

  // 错误处理回调
  onConfirmError: (error: any) => {
    console.error('数据转换失败:', error)
    const errorMsg = error?.response?.data?.message || error?.message || '数据转换失败'
    ElMessage.error(errorMsg)
  }
})

// 计算属性
const getFieldLabel = (fieldName: string) => {
  // 直接返回字段名，因为现在字段选项由 DetectionFieldSelector 内部管理
  return fieldName
}

// 监听选中字段变化，自动更新检测配置列表
watch(
  () => state.data.selectedFields,
  (newFields) => {
    console.log('字段选择变化:', newFields)
    if (state.data.conversionType === DataConversionType.DIRTY_DATA_DETECTION) {
      // 根据选中的字段生成检测配置列表
      detectionConfigList.value = newFields.map(field => {
        const existingConfig = detectionConfigList.value.find(c => c.fieldName === field)
        return {
          fieldName: field,
          fieldLabel: getFieldLabel(field),
          // 默认选择第一个检测方式（空值检测）
          method: existingConfig?.method || DetectionMethod.IS_NOT_NULL,
          regexp: existingConfig?.regexp || ''
        }
      })
      console.log('检测配置列表已更新:', detectionConfigList.value)
    }
  },
  { deep: true }
)

// 监听选中字段变化，自动更新填充配置列表
watch(
  () => state.data.selectedFields,
  (newFields) => {
    if (state.data.conversionType === DataConversionType.MISSING_VALUE_FILL) {
      // 根据选中的字段生成填充配置列表
      fillConfigList.value = newFields.map(field => {
        const existingConfig = fillConfigList.value.find(c => c.fieldName === field)
        return {
          fieldName: field,
          fieldLabel: getFieldLabel(field),
          fillValue: existingConfig?.fillValue || ''
        }
      })
      console.log('填充配置列表已更新:', fillConfigList.value)
    }
  },
  { deep: true }
)

// 监听选中字段变化，自动更新野值剔除配置列表
watch(
  () => state.data.selectedFields,
  (newFields) => {
    if (state.data.conversionType === DataConversionType.OUTLIER_REMOVAL) {
      // 根据选中的字段生成野值剔除配置列表
      outlierConfigList.value = newFields.map(field => {
        const existingConfig = outlierConfigList.value.find(c => c.fieldName === field)
        return {
          fieldName: field,
          fieldLabel: getFieldLabel(field),
          minValue: existingConfig?.minValue,
          maxValue: existingConfig?.maxValue
        }
      })
      console.log('野值剔除配置列表已更新:', outlierConfigList.value)
    }
  },
  { deep: true }
)

// 方法定义
const handleConversionTypeChange = () => {
  // 切换类型时清空选中字段
  state.data.selectedFields = []
  // 重置配置
  resetConfigs()
}

const resetConfigs = () => {
  // 重置检测配置列表
  detectionConfigList.value = []
  
  // 重置填充配置列表
  fillConfigList.value = []
  
  // 重置野值剔除配置列表
  outlierConfigList.value = []
}

// 暴露方法
defineExpose({
  open: (tableName: string) => {
    currentTableName.value = tableName
    
    // 打开对话框
    open()
  }
})
</script>