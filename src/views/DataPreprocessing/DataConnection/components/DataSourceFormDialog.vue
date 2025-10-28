<template>
  <ZxDialog v-bind="dialogProps" v-on="dialogEvents">
    <div class="dialog-form-container">
      <el-form
        ref="formRef"
        :model="state.data"
        :rules="formRules"
        label-width="120px"
        label-position="left"
      >
        <!-- 数据源名称 -->
        <el-form-item label="数据源名称" prop="baseName">
          <zx-input v-model="state.data.baseName" placeholder="请输入数据源名称" />
        </el-form-item>

        <!-- 数据源类型选择 -->
        <el-form-item label="数据源类型" prop="baseType">
          <SelectDataSourceType
            v-model="state.data.baseType"
            autoSelectFirst
            @change="handleDataSourceTypeChange"
          />
        </el-form-item>

        <!-- 数据库连接配置 -->
        <el-form-item label="IP地址" prop="baseIp">
          <el-input v-model="state.data.baseIp" placeholder="请输入IP地址" />
        </el-form-item>

        <el-form-item label="端口号" prop="basePort">
          <el-input v-model="state.data.basePort" placeholder="请输入端口号" />
        </el-form-item>

        <el-form-item label="数据库名称" prop="baseDataName">
          <el-input v-model="state.data.baseDataName" placeholder="请输入数据库名称" />
        </el-form-item>

        <el-form-item label="用户名" prop="baseUser">
          <el-input v-model="state.data.baseUser" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="basePassword">
          <el-input
            v-model="state.data.basePassword"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
    </div>
  </ZxDialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useDialog } from '@zxio/zxui'
import { SelectDataSourceType } from '../../components/selector'
import { dataConnectionApi } from '@/api/modules/dataPreprocessing/dataConnection'

// 定义数据源表单数据接口
interface DataSourceFormData {
  baseId?: string | number
  baseName: string
  baseIp: string
  basePort: string
  baseDataName: string
  baseUser: string
  basePassword: string
  baseType: number | null // 1 MySql数据库 2 达梦数据库
}

// 当前模式（通过 open 方法的参数自动判断）
const currentMode = ref<'create' | 'edit'>('create')

// 定义事件
const emit = defineEmits<{
  success: [data?: any]
}>()

// 表单引用
const formRef = ref()

// 表单验证规则
const formRules = computed(() => ({
  baseName: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
  baseType: [{ required: true, message: '请选择数据源类型', trigger: 'change' }],
  baseIp: [
    { required: true, message: '请输入IP地址', trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP地址格式不正确', trigger: 'blur' }
  ],
  basePort: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { pattern: /^\d+$/, message: '端口号必须为数字', trigger: 'blur' }
  ],
  baseDataName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
  baseUser: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  basePassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}))

// 使用 useDialog hook
const { state, dialogProps, dialogEvents, open, close, setLoading, updateField } =
  useDialog<DataSourceFormData>({
    // 动态标题
    title: (data) => {
      if (currentMode.value === 'edit') {
        return data.baseName ? `编辑数据源 - ${data.baseName}` : '编辑数据源'
      }
      return '新增数据源'
    },

    // 对话框配置
    width: '70%',

    // 表单配置
    formRef: formRef,
    preValidate: true,
    autoScrollToError: true,

    // 默认数据
    defaultData: () => ({
      baseName: '',
      baseIp: '',
      basePort: '',
      baseDataName: '',
      baseUser: '',
      basePassword: '',
      baseType: null
    }),

    // 数据转换（编辑时使用）
    dataTransform: (raw: DataSourceFormData) => ({
      baseId: raw.baseId,
      baseName: raw.baseName || '',
      baseIp: raw.baseIp || '',
      basePort: raw.basePort || '',
      baseDataName: raw.baseDataName || '',
      baseUser: raw.baseUser || '',
      basePassword: raw.basePassword || '',
      baseType: raw.baseType || null
    }),

    // 确认回调
    onConfirm: async (data) => {
      // 准备提交数据
      const submitData = {
        baseName: data.baseName,
        baseType: data.baseType,
        baseIp: data.baseIp,
        basePort: data.basePort,
        baseDataName: data.baseDataName,
        baseUser: data.baseUser,
        basePassword: data.basePassword
      }

      let response
      if (currentMode.value === 'create') {
        response = await dataConnectionApi.addDataSource(submitData)
      } else if (currentMode.value === 'edit' && data.baseId) {
        response = await dataConnectionApi.editDataSource(data.baseId, submitData)
      }

      // 触发成功事件，通知父组件刷新列表
      emit('success', response)
      return response
    },

    // 错误处理回调
    onConfirmError: (error: any) => {
      console.error('表单提交失败:', error)
      // 显示错误提示
      const errorMsg = error?.response?.data?.message || error?.message || '操作失败，请重试'
      ElMessage.error(errorMsg)
    }
  })

// 数据源类型变化处理
const handleDataSourceTypeChange = (value: number) => {
  updateField('baseType', value)

  // 使用 nextTick 确保响应式更新完成后再执行后续操作
  nextTick(() => {
    // 清除其他字段的验证错误
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}
// 暴露方法给父组件
defineExpose({
  open: async (dataOrId?: DataSourceFormData | string | number) => {
    if (dataOrId) {
      // 判断传入的是 baseId 还是完整数据对象
      if (typeof dataOrId === 'string' || typeof dataOrId === 'number') {
        // 传入的是 baseId，需要通过接口获取数据
        currentMode.value = 'edit'
        try {
          setLoading(true)
          const response = await dataConnectionApi.getDataSourceById(dataOrId)
          open(response)
        } catch (error) {
          console.error('获取数据源详情失败:', error)
          ElMessage.error('获取数据源详情失败')
        } finally {
          setLoading(false)
        }
      } else if (dataOrId.baseId) {
        // 传入的是完整数据对象且有 ID，表示编辑模式
        currentMode.value = 'edit'
        open(dataOrId)
      } else {
        // 传入的是数据对象但无 ID，表示新增模式
        currentMode.value = 'create'
        open(dataOrId)
      }
    } else {
      // 无数据，表示新增模式
      currentMode.value = 'create'
      open()
    }
  }
})
</script>

<style lang="less" scoped>
.dialog-form-container {
  .form-input {
    width: 100%;
  }
}
</style>
