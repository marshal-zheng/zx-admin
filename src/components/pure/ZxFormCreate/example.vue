<template>
  <div class="zx-form-create-demo">
    <el-card class="demo-card">
      <template #header>
        <div class="demo-header">
          <h3>ZxFormCreate 表单创建组件</h3>
          <p>基于 Element Plus 的动态表单生成组件，支持多种表单控件类型</p>
        </div>
      </template>

      <!-- 基础用法示例 -->
      <div class="demo-section">
        <h4>基础用法</h4>
        <p>通过配置 items 数组来动态生成表单</p>

        <ZxFormCreate
          v-model="basicFormData"
          :items="basicFormItems"
          :submit-loading="basicSubmitLoading"
          @submit="handleBasicSubmit"
          @change="handleBasicChange"
        />

        <div class="form-data-display">
          <h5>表单数据：</h5>
          <pre>{{ JSON.stringify(basicFormData, null, 2) }}</pre>
        </div>
      </div>

      <el-divider />

      <!-- 复杂表单示例 -->
      <div class="demo-section">
        <h4>复杂表单示例</h4>
        <p>包含各种表单控件类型的复杂表单</p>

        <ZxFormCreate
          v-model="complexFormData"
          :items="complexFormItems"
          :form-props="complexFormProps"
          :submit-loading="complexSubmitLoading"
          @submit="handleComplexSubmit"
          @change="handleComplexChange"
        />

        <div class="form-data-display">
          <h5>表单数据：</h5>
          <pre>{{ JSON.stringify(complexFormData, null, 2) }}</pre>
        </div>
      </div>

      <el-divider />

      <!-- 自定义插槽示例 -->
      <div class="demo-section">
        <h4>自定义插槽示例</h4>
        <p>通过插槽自定义表单项和操作按钮</p>

        <ZxFormCreate
          v-model="customFormData"
          :items="customFormItems"
          :submit-loading="customSubmitLoading"
          @submit="handleCustomSubmit"
        >
          <!-- 自定义表单项 -->
          <template #customField="{ model }">
            <div class="custom-field">
              <el-input v-model="model.customField" placeholder="这是一个自定义字段">
                <template #prepend>自定义</template>
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
          </template>

          <!-- 自定义操作按钮 -->
          <template #actions="{ formRef, model }">
            <el-button @click="handleCustomReset(formRef)">自定义重置</el-button>
            <el-button type="primary" @click="handleCustomValidate(formRef)">验证表单</el-button>
            <el-button
              type="success"
              :loading="customSubmitLoading"
              @click="handleCustomSubmit(model)"
            >
              自定义提交
            </el-button>
          </template>
        </ZxFormCreate>

        <div class="form-data-display">
          <h5>表单数据：</h5>
          <pre>{{ JSON.stringify(customFormData, null, 2) }}</pre>
        </div>
      </div>

      <el-divider />

      <!-- 复杂联动示例 -->
      <div class="demo-section">
        <h4>复杂联动示例</h4>
        <p>演示字段间的复杂联动关系：地区选择、产品类型、价格计算等</p>

        <ZxFormCreate
          v-model="linkageFormData"
          :items="linkageFormItems"
          :submit-loading="linkageSubmitLoading"
          @submit="handleLinkageSubmit"
          @change="handleLinkageChange"
        />

        <div class="form-data-display">
          <h5>表单数据：</h5>
          <pre>{{ JSON.stringify(linkageFormData, null, 2) }}</pre>
        </div>

        <div class="linkage-info">
          <h5>联动说明：</h5>
          <ul>
            <li>选择不同地区会影响可选的产品类型</li>
            <li>产品类型会影响价格范围和可选的服务等级</li>
            <li>服务等级会影响最终价格计算</li>
            <li>VIP客户可享受额外折扣</li>
            <li>订单数量会影响总价计算</li>
          </ul>

          <div class="debug-info" style="margin-top: 12px; font-size: 12px; color: #666">
            <div>当前地区: {{ linkageFormData.region || '未选择' }}</div>
            <div>当前产品: {{ linkageFormData.productType || '未选择' }}</div>
            <div>当前服务: {{ linkageFormData.serviceLevel || '未选择' }}</div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 禁用状态示例 -->
      <div class="demo-section">
        <h4>禁用状态示例</h4>
        <p>演示表单的禁用状态</p>

        <el-switch v-model="isDisabled" style="margin-bottom: 20px">
          <template #active-text>禁用表单</template>
          <template #inactive-text>启用表单</template>
        </el-switch>

        <ZxFormCreate
          v-model="disabledFormData"
          :items="disabledFormItems"
          :disabled="isDisabled"
          @submit="handleDisabledSubmit"
        />
      </div>
    </el-card>

    <!-- 配置说明 -->
    <el-card class="config-card" style="margin-top: 20px">
      <template #header>
        <h4>配置说明</h4>
      </template>

      <div class="config-section">
        <h5>支持的表单控件类型：</h5>
        <ul class="control-list">
          <li><code>input</code> - 输入框</li>
          <li><code>textarea</code> - 文本域</li>
          <li><code>number</code> - 数字输入框</li>
          <li><code>select</code> - 选择器</li>
          <li><code>radio</code> - 单选框组</li>
          <li><code>checkbox</code> - 复选框组</li>
          <li><code>date</code> - 日期选择器</li>
          <li><code>time</code> - 时间选择器</li>
          <li><code>cascader</code> - 级联选择器</li>
          <li><code>switch</code> - 开关</li>
          <li><code>slider</code> - 滑块</li>
          <li><code>rate</code> - 评分</li>
          <li><code>color</code> - 颜色选择器</li>
          <li><code>upload</code> - 上传组件</li>
          <li><code>slot</code> - 自定义插槽</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import ZxFormCreate from './index.vue'

// 基础表单示例
const basicFormData = reactive({
  name: '',
  email: '',
  age: 0,
  gender: '',
  description: ''
})

const basicFormItems = [
  {
    type: 'input',
    field: 'name',
    label: '姓名',
    required: true,
    props: {
      placeholder: '请输入姓名',
      clearable: true
    }
  },
  {
    type: 'input',
    field: 'email',
    label: '邮箱',
    required: true,
    props: {
      placeholder: '请输入邮箱',
      clearable: true
    },
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ]
  },
  {
    type: 'number',
    field: 'age',
    label: '年龄',
    required: true,
    props: {
      min: 0,
      max: 120,
      placeholder: '请输入年龄'
    }
  },
  {
    type: 'radio',
    field: 'gender',
    label: '性别',
    required: true,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  },
  {
    type: 'textarea',
    field: 'description',
    label: '描述',
    props: {
      placeholder: '请输入描述信息',
      rows: 3
    }
  }
]

const basicSubmitLoading = ref(false)

// 复杂表单示例
const complexFormData = reactive({
  title: '',
  category: '',
  tags: [],
  publishDate: '',
  publishTime: '',
  region: [],
  status: false,
  priority: 3,
  rating: 0,
  color: '#409EFF'
})

const complexFormItems = [
  {
    type: 'input',
    field: 'title',
    label: '标题',
    required: true,
    props: {
      placeholder: '请输入标题',
      maxlength: 50,
      showWordLimit: true
    }
  },
  {
    type: 'select',
    field: 'category',
    label: '分类',
    required: true,
    props: {
      placeholder: '请选择分类',
      clearable: true
    },
    options: [
      { label: '技术', value: 'tech' },
      { label: '生活', value: 'life' },
      { label: '工作', value: 'work' },
      { label: '学习', value: 'study' }
    ]
  },
  {
    type: 'checkbox',
    field: 'tags',
    label: '标签',
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' },
      { label: 'Node.js', value: 'nodejs' }
    ]
  },
  {
    type: 'date',
    field: 'publishDate',
    label: '发布日期',
    props: {
      placeholder: '选择日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    type: 'time',
    field: 'publishTime',
    label: '发布时间',
    props: {
      placeholder: '选择时间',
      format: 'HH:mm:ss',
      valueFormat: 'HH:mm:ss'
    }
  },
  {
    type: 'cascader',
    field: 'region',
    label: '地区',
    options: [
      {
        value: 'beijing',
        label: '北京',
        children: [
          { value: 'haidian', label: '海淀区' },
          { value: 'chaoyang', label: '朝阳区' }
        ]
      },
      {
        value: 'shanghai',
        label: '上海',
        children: [
          { value: 'huangpu', label: '黄浦区' },
          { value: 'xuhui', label: '徐汇区' }
        ]
      }
    ]
  },
  {
    type: 'switch',
    field: 'status',
    label: '发布状态',
    props: {
      activeText: '已发布',
      inactiveText: '未发布'
    }
  },
  {
    type: 'slider',
    field: 'priority',
    label: '优先级',
    props: {
      min: 1,
      max: 5,
      showStops: true,
      showTooltip: true
    }
  },
  {
    type: 'rate',
    field: 'rating',
    label: '评分',
    props: {
      max: 5,
      allowHalf: true,
      showText: true
    }
  },
  {
    type: 'color',
    field: 'color',
    label: '主题色',
    props: {
      showAlpha: true
    }
  }
]

const complexFormProps = {
  labelWidth: '120px',
  labelPosition: 'right'
}

const complexSubmitLoading = ref(false)

// 自定义插槽示例
const customFormData = reactive({
  username: '',
  customField: '',
  remark: ''
})

const customFormItems = [
  {
    type: 'input',
    field: 'username',
    label: '用户名',
    required: true,
    props: {
      placeholder: '请输入用户名'
    }
  },
  {
    type: 'slot',
    field: 'customField',
    label: '自定义字段',
    required: true
  },
  {
    type: 'textarea',
    field: 'remark',
    label: '备注',
    props: {
      placeholder: '请输入备注信息',
      rows: 2
    }
  }
]

const customSubmitLoading = ref(false)

// 复杂联动示例
const linkageFormData = reactive({
  region: '',
  productType: '',
  serviceLevel: '',
  isVip: false,
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  totalPrice: 0,
  deliveryDate: '',
  specialRequirements: ''
})

// 使用 computed 来动态计算表单项，确保响应式更新
const linkageFormItems = computed(() => [
  {
    type: 'select',
    field: 'region',
    label: '选择地区',
    required: true,
    props: {
      placeholder: '请选择地区',
      clearable: true
    },
    options: [
      { label: '华北地区', value: 'north' },
      { label: '华东地区', value: 'east' },
      { label: '华南地区', value: 'south' },
      { label: '西部地区', value: 'west' }
    ]
  },
  {
    type: 'select',
    field: 'productType',
    label: '产品类型',
    required: true,
    props: {
      placeholder: linkageFormData.region ? '请选择产品类型' : '请先选择地区',
      clearable: true,
      disabled: !linkageFormData.region
    },
    options: linkageFormData.region
      ? (productTypesByRegion[linkageFormData.region] || []).map((p) => ({
          label: p.label,
          value: p.value
        }))
      : []
  },
  {
    type: 'select',
    field: 'serviceLevel',
    label: '服务等级',
    required: true,
    props: {
      placeholder: linkageFormData.productType ? '请选择服务等级' : '请先选择产品类型',
      clearable: true,
      disabled: !linkageFormData.productType
    },
    options: linkageFormData.productType
      ? (serviceLevelsByProduct[linkageFormData.productType] || []).map((s) => ({
          label: s.label,
          value: s.value
        }))
      : []
  },
  {
    type: 'switch',
    field: 'isVip',
    label: 'VIP客户',
    props: {
      activeText: '是',
      inactiveText: '否'
    }
  },
  {
    type: 'number',
    field: 'quantity',
    label: '订购数量',
    required: true,
    props: {
      min: 1,
      max: 1000,
      placeholder: '请输入数量'
    }
  },
  {
    type: 'number',
    field: 'unitPrice',
    label: '单价（元）',
    props: {
      precision: 2,
      disabled: true,
      placeholder: '系统自动计算'
    }
  },
  {
    type: 'number',
    field: 'discount',
    label: '折扣（%）',
    props: {
      precision: 1,
      min: 0,
      max: 50,
      disabled: true,
      placeholder: '系统自动计算'
    }
  },
  {
    type: 'number',
    field: 'totalPrice',
    label: '总价（元）',
    props: {
      precision: 2,
      disabled: true,
      placeholder: '系统自动计算'
    }
  },
  {
    type: 'date',
    field: 'deliveryDate',
    label: '期望交付日期',
    props: {
      placeholder: '选择日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      disabledDate: (time) => {
        // 不能选择今天之前的日期
        return time.getTime() < Date.now() - 8.64e7
      }
    }
  },
  {
    type: 'textarea',
    field: 'specialRequirements',
    label: '特殊要求',
    props: {
      placeholder: '请输入特殊要求',
      rows: 3,
      maxlength: 500,
      showWordLimit: true
    }
  }
])

const linkageSubmitLoading = ref(false)

// 产品类型配置（根据地区）
const productTypesByRegion = {
  north: [
    { label: '标准产品A', value: 'standard-a', basePrice: 100 },
    { label: '高级产品B', value: 'premium-b', basePrice: 200 },
    { label: '企业产品C', value: 'enterprise-c', basePrice: 500 }
  ],
  east: [
    { label: '标准产品A', value: 'standard-a', basePrice: 120 },
    { label: '高级产品B', value: 'premium-b', basePrice: 220 },
    { label: '定制产品D', value: 'custom-d', basePrice: 800 }
  ],
  south: [
    { label: '标准产品A', value: 'standard-a', basePrice: 110 },
    { label: '高级产品B', value: 'premium-b', basePrice: 210 },
    { label: '豪华产品E', value: 'luxury-e', basePrice: 1000 }
  ],
  west: [
    { label: '标准产品A', value: 'standard-a', basePrice: 90 },
    { label: '经济产品F', value: 'economy-f', basePrice: 50 }
  ]
}

// 服务等级配置（根据产品类型）
const serviceLevelsByProduct = {
  'standard-a': [
    { label: '基础服务', value: 'basic', priceMultiplier: 1.0 },
    { label: '标准服务', value: 'standard', priceMultiplier: 1.2 }
  ],
  'premium-b': [
    { label: '标准服务', value: 'standard', priceMultiplier: 1.0 },
    { label: '高级服务', value: 'premium', priceMultiplier: 1.3 },
    { label: '专业服务', value: 'professional', priceMultiplier: 1.5 }
  ],
  'enterprise-c': [
    { label: '专业服务', value: 'professional', priceMultiplier: 1.0 },
    { label: '企业服务', value: 'enterprise', priceMultiplier: 1.2 }
  ],
  'custom-d': [
    { label: '定制服务', value: 'custom', priceMultiplier: 1.0 },
    { label: '专属服务', value: 'exclusive', priceMultiplier: 1.4 }
  ],
  'luxury-e': [
    { label: '豪华服务', value: 'luxury', priceMultiplier: 1.0 },
    { label: '至尊服务', value: 'supreme', priceMultiplier: 1.6 }
  ],
  'economy-f': [{ label: '基础服务', value: 'basic', priceMultiplier: 1.0 }]
}

// 禁用状态示例
const isDisabled = ref(false)
const disabledFormData = reactive({
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000'
})

const disabledFormItems = [
  {
    type: 'input',
    field: 'name',
    label: '姓名',
    props: {
      placeholder: '请输入姓名'
    }
  },
  {
    type: 'input',
    field: 'email',
    label: '邮箱',
    props: {
      placeholder: '请输入邮箱'
    }
  },
  {
    type: 'input',
    field: 'phone',
    label: '电话',
    props: {
      placeholder: '请输入电话'
    }
  }
]

// 事件处理函数
const handleBasicSubmit = (data) => {
  basicSubmitLoading.value = true
  setTimeout(() => {
    basicSubmitLoading.value = false
    ElMessage.success('基础表单提交成功！')
    console.log('基础表单数据:', data)
  }, 1000)
}

const handleBasicChange = (field, value, model) => {
  console.log('基础表单字段变化:', { field, value, model })
}

const handleComplexSubmit = (data) => {
  complexSubmitLoading.value = true
  setTimeout(() => {
    complexSubmitLoading.value = false
    ElMessage.success('复杂表单提交成功！')
    console.log('复杂表单数据:', data)
  }, 1500)
}

const handleComplexChange = (field, value, model) => {
  console.log('复杂表单字段变化:', { field, value, model })
}

const handleCustomSubmit = (data) => {
  customSubmitLoading.value = true
  setTimeout(() => {
    customSubmitLoading.value = false
    ElMessage.success('自定义表单提交成功！')
    console.log('自定义表单数据:', data)
  }, 1000)
}

const handleCustomReset = (formRef) => {
  formRef.resetFields()
  ElMessage.info('表单已重置')
}

const handleCustomValidate = async (formRef) => {
  try {
    await formRef.validate()
    ElMessage.success('表单验证通过！')
  } catch (error) {
    ElMessage.error('表单验证失败！')
  }
}

const handleDisabledSubmit = (data) => {
  ElMessage.info('禁用状态下的表单提交')
  console.log('禁用表单数据:', data)
}

// 联动表单事件处理
const handleLinkageSubmit = (data) => {
  linkageSubmitLoading.value = true
  setTimeout(() => {
    linkageSubmitLoading.value = false
    ElMessage.success('联动表单提交成功！')
    console.log('联动表单数据:', data)
  }, 1500)
}

const handleLinkageChange = (field, value, model) => {
  console.log('联动表单字段变化:', { field, value, model })

  // 地区变化时清空相关字段并更新单价
  if (field === 'region') {
    linkageFormData.productType = ''
    linkageFormData.serviceLevel = ''
    linkageFormData.unitPrice = 0
    linkageFormData.totalPrice = 0
    linkageFormData.discount = 0
  }

  // 产品类型变化时更新单价并清空服务等级
  if (field === 'productType') {
    linkageFormData.serviceLevel = ''
    updateUnitPrice()
  }

  // 服务等级、VIP状态、数量变化时重新计算价格
  if (['serviceLevel', 'isVip', 'quantity'].includes(field)) {
    calculateTotalPrice()
  }
}

// 更新单价
const updateUnitPrice = () => {
  const { region, productType } = linkageFormData
  if (region && productType) {
    const product = productTypesByRegion[region]?.find((p) => p.value === productType)
    if (product) {
      linkageFormData.unitPrice = product.basePrice
      // 如果有服务等级，重新计算总价
      if (linkageFormData.serviceLevel) {
        calculateTotalPrice()
      }
    }
  } else {
    linkageFormData.unitPrice = 0
    linkageFormData.totalPrice = 0
    linkageFormData.discount = 0
  }
}

// 计算总价
const calculateTotalPrice = () => {
  const { productType, serviceLevel, isVip, quantity, unitPrice } = linkageFormData

  // 检查必要字段
  if (!productType || !serviceLevel || !unitPrice || !quantity || quantity <= 0) {
    linkageFormData.totalPrice = 0
    linkageFormData.discount = 0
    return
  }

  // 获取服务等级价格倍数
  const service = serviceLevelsByProduct[productType]?.find((s) => s.value === serviceLevel)
  if (!service) {
    linkageFormData.totalPrice = 0
    linkageFormData.discount = 0
    return
  }

  // 计算基础价格
  const basePrice = unitPrice * service.priceMultiplier * quantity

  // 计算折扣
  let discount = 0

  // VIP客户折扣
  if (isVip) {
    discount += 10 // VIP客户享受10%折扣
  }

  // 数量折扣
  if (quantity >= 100) {
    discount += 15 // 100件以上享受15%折扣
  } else if (quantity >= 50) {
    discount += 10 // 50件以上享受10%折扣
  } else if (quantity >= 20) {
    discount += 5 // 20件以上享受5%折扣
  }

  // 服务等级额外折扣
  if (serviceLevel === 'basic') {
    discount += 5 // 基础服务额外5%折扣
  }

  // 限制最大折扣
  discount = Math.min(discount, 50)

  // 计算最终价格
  const finalPrice = basePrice * (1 - discount / 100)

  linkageFormData.discount = Math.round(discount * 10) / 10 // 保留一位小数
  linkageFormData.totalPrice = Math.round(finalPrice * 100) / 100 // 保留两位小数
}
</script>

<style lang="scss" scoped>
.zx-form-create-demo {
  padding: 20px;
  background: var(--el-bg-color-page);

  .demo-card,
  .config-card {
    margin-bottom: 20px;
  }

  .demo-header {
    text-align: center;

    h3 {
      margin: 0 0 8px 0;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0;
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }

  .demo-section {
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 8px 0;
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0 0 20px 0;
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }

  .form-data-display {
    margin-top: 20px;
    padding: 16px;
    background: var(--el-fill-color-extra-light);
    border-radius: 6px;
    border: 1px solid var(--el-border-color-lighter);

    h5 {
      margin: 0 0 12px 0;
      color: var(--el-text-color-primary);
      font-size: 14px;
      font-weight: 600;
    }

    pre {
      margin: 0;
      padding: 12px;
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      font-size: 12px;
      color: var(--el-text-color-regular);
      overflow: auto;
      max-height: 200px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }

  .custom-field {
    width: 100%;
  }

  .linkage-info {
    margin-top: 20px;
    padding: 16px;
    background: var(--el-color-info-light-9);
    border-radius: 6px;
    border: 1px solid var(--el-color-info-light-7);

    h5 {
      margin: 0 0 12px 0;
      color: var(--el-text-color-primary);
      font-size: 14px;
      font-weight: 600;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      color: var(--el-text-color-regular);

      li {
        margin-bottom: 6px;
        line-height: 1.5;
        font-size: 13px;
      }
    }
  }

  .config-section {
    h5 {
      margin: 0 0 12px 0;
      color: var(--el-text-color-primary);
      font-size: 14px;
      font-weight: 600;
    }

    .control-list {
      margin: 0;
      padding-left: 20px;
      color: var(--el-text-color-regular);

      li {
        margin-bottom: 8px;
        line-height: 1.5;

        code {
          padding: 2px 6px;
          background: var(--el-fill-color-light);
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
