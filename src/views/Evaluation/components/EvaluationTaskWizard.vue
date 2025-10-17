<template>
  <ContentWrap
    class="m-evaluation-task-wizard"
    show-footer
    :loading="saving"
    :footer-fixed="true"
    title="创建评估方案"
  >
    <template #headerRight>
      <div class="flex items-center gap-4">
        <ElTag type="primary" effect="light" round size="large">
          第 {{ currentStep + 1 }} 步 / 共 {{ steps.length }} 步
        </ElTag>
        <ElProgress
          :percentage="progressPercentage"
          :stroke-width="8"
          :show-text="false"
          class="w-[240px]"
        />
      </div>
    </template>

    <template #footerLeft>
      <ElText size="small" type="info"> 在每一步完成后点击"下一步"，系统会自动保存当前进度 </ElText>
    </template>

    <template #footerRight>
      <div class="flex flex-wrap items-center gap-3">
        <ElButton size="large" :disabled="saving" @click="handleCancel">取消</ElButton>
        <ElButton v-if="currentStep > 0" size="large" :disabled="saving" @click="handlePrev">
          <Icon icon="ep:arrow-left" class="mr-[4px]" />
          上一步
        </ElButton>
        <ElButton
          v-if="currentStep < steps.length - 1"
          type="primary"
          size="large"
          :disabled="saving"
          @click="handleNext"
        >
          下一步
          <Icon icon="ep:arrow-right" class="ml-[4px]" />
        </ElButton>
        <ElButton
          v-if="currentStep === steps.length - 1"
          type="primary"
          size="large"
          :loading="saving"
          @click="handleFinish"
        >
          <Icon icon="ep:check" class="mr-[4px]" />
          完成
        </ElButton>
      </div>
    </template>

    <div class="flex min-h-0 flex-1 gap-6 xl:flex-row flex-col h-full">
      <aside class="flex flex-col xl:w-56 xl:shrink-0">
        <ElCard
          shadow="never"
          class="bg-[var(--el-bg-color)] h-full"
          :body-style="{ padding: '16px', height: '100%' }"
        >
          <div class="flex flex-col justify-around py-3 h-full">
            <ElSteps
              :active="currentStep"
              direction="vertical"
              finish-status="success"
              space="160px"
            >
              <ElStep
                v-for="(step, index) in steps"
                :key="index"
                :title="step.title"
                :description="step.description"
              />
            </ElSteps>
          </div>
        </ElCard>
      </aside>

      <div class="flex min-h-0 flex-1 flex-col">
        <ElForm
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-position="top"
          class="flex flex-1 min-h-0 flex-col gap-6"
        >
          <section v-if="currentStep === 0" class="flex flex-col gap-6">
            <div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(22rem,1fr))]">
              <ElCard
                shadow="never"
                class="border border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)]"
              >
                <template #header>
                  <div class="flex items-center gap-3">
                    <ElTag type="primary" size="large" round effect="dark" class="shrink-0">
                      01
                    </ElTag>
                    <div class="flex flex-col gap-1">
                      <ElText tag="b" size="large">基本信息</ElText>
                      <ElText size="small" type="info">完善任务名称与描述，确保团队容易识别</ElText>
                    </div>
                  </div>
                </template>

                <ElFormItem prop="name" label="方案名称" required class="mb-0">
                  <ElInput
                    v-model="formData.name"
                    placeholder="请输入方案名称"
                    maxlength="60"
                    show-word-limit
                    size="large"
                    clearable
                  />
                </ElFormItem>
                <ElFormItem prop="description" label="方案描述" class="mb-0 [grid-column:1/-1]">
                  <ElInput
                    v-model="formData.description"
                    type="textarea"
                    :rows="5"
                    maxlength="200"
                    show-word-limit
                    placeholder="可选，建议说明方案目标与适用范围"
                  />
                </ElFormItem>
              </ElCard>

              <ElCard
                shadow="never"
                class="border border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)]"
              >
                <template #header>
                  <div class="flex items-center gap-3">
                    <ElTag type="primary" size="large" round effect="dark" class="shrink-0">
                      02
                    </ElTag>
                    <div class="flex flex-col gap-1">
                      <ElText tag="b" size="large">评估算法</ElText>
                      <ElText size="small" type="info">选择符合业务需求的评估计算方法</ElText>
                    </div>
                  </div>
                </template>

                <ElFormItem prop="algorithmId" label="请选择评估算法" required class="mb-0">
                  <EvaluationAlgorithmSelector
                    v-model="formData.algorithmId"
                    placeholder="请选择评估算法"
                    @change="handleAlgorithmChange"
                  />
                </ElFormItem>
              </ElCard>
            </div>
          </section>

          <section v-if="currentStep === 1" class="flex flex-col gap-6 flex-1 min-h-0">
            <!-- <ElAlert
              title="指标体系配置"
              type="info"
              :closable="false"
              show-icon
              class="rounded-xl border border-[var(--el-border-color-lighter)] bg-[var(--el-color-primary-light-9)]"
            >
              <template #default>
                选择基础指标体系模板，后续可在任务内进行微调，原模板不会被修改
              </template>
            </ElAlert> -->

            <ZxSplitBox
              :size="400"
              :min="300"
              :max="800"
              direction="horizontal"
              expand-direction="left"
              class="flex-1 min-h-0"
            >
              <template #first>
                <ElCard
                  shadow="never"
                  class="border border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)] h-full"
                  :body-style="{
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }"
                >
                  <template #header>
                    <div class="flex items-center gap-3">
                      <ElTag type="primary" size="large" round effect="dark" class="shrink-0">
                        01
                      </ElTag>
                      <div class="flex flex-col gap-1">
                        <ElText tag="b" size="large">指标体系</ElText>
                        <ElText size="small" type="info"
                          >选择结构化指标体系，保证评估维度统一</ElText
                        >
                      </div>
                    </div>
                  </template>

                  <ElFormItem label="请选择体系标签" class="mb-0">
                    <IndicatorSystemTagSelector
                      v-model="formData.systemTagId"
                      placeholder="请选择体系标签（可选）"
                      @change="handleSystemTagChange"
                      @clear="handleSystemTagClear"
                    />
                  </ElFormItem>

                  <ElFormItem prop="metricSystemId" label="请选择指标体系" required class="mb-0">
                    <IndicatorSystemSelector
                      v-model="formData.metricSystemId"
                      :tag-id="formData.systemTagId"
                      placeholder="请选择指标体系"
                      @change="handleMetricSystemChange"
                    />
                  </ElFormItem>
                </ElCard>
              </template>

              <template #second>
                <ElCard
                  shadow="never"
                  class="indicator-wrapper border border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)] h-full"
                  :body-style="{
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }"
                >
                  <template #header>
                    <div class="flex items-center gap-3">
                      <ElTag type="primary" size="large" round effect="dark" class="shrink-0">
                        02
                      </ElTag>
                      <div class="flex flex-col gap-1">
                        <ElText tag="b" size="large">指标体系图</ElText>
                        <ElText size="small" type="info">查看和编辑指标体系结构</ElText>
                      </div>
                    </div>
                  </template>

                  <div
                    v-if="!formData.metricSystemId"
                    class="flex flex-1 items-center justify-center"
                  >
                    <ElEmpty description="请先选择指标体系" :image-size="120" />
                  </div>
                  <div v-else class="flex-1 h-full">
                    <IndicatorDesign
                      :key="`step1-${formData.metricSystemId}`"
                      :graph-data="getGraphData"
                      :is-show-side-nav="true"
                      :is-editable="true"
                      :algo-type="2"
                      :show-save-btn="false"
                      :useFlexView="false"
                    />
                  </div>
                </ElCard>
              </template>
            </ZxSplitBox>
          </section>

          <section v-if="currentStep === 2" class="flex flex-col gap-6 flex-1 min-h-0">
            <ElCard
              shadow="never"
              class="border border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)] h-full"
              :body-style="{
                display: 'flex',
                flexDirection: 'column'
              }"
            >
              <template #header>
                <div class="flex items-center gap-3">
                  <ElTag type="primary" size="large" round effect="dark" class="shrink-0">
                    01
                  </ElTag>
                  <div class="flex flex-col gap-1">
                    <ElText tag="b" size="large">选择仪表盘</ElText>
                    <ElText size="small" type="info">选择用于展示评估结果的仪表盘模板</ElText>
                  </div>
                </div>
              </template>

              <div class="flex-1 min-h-0">
                <DashboardSelector v-model="formData.dashboardId" @change="handleDashboardChange" />
              </div>
            </ElCard>
          </section>

          <section v-if="currentStep === 3" class="flex flex-col gap-6 flex-1 min-h-0">
            <ElAlert title="配置审查" type="success" :closable="false" show-icon>
              <template #default>
                请确认以下配置信息，确认无误后点击"完成"按钮创建评估方案
              </template>
            </ElAlert>

            <ZxSplitBox
              :size="400"
              :min="300"
              :max="600"
              direction="horizontal"
              expand-direction="left"
              class="flex-1 min-h-0"
            >
              <template #first>
                <ElCard
                  shadow="never"
                  class="config-review-card h-full"
                  :body-style="{
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    overflow: 'auto'
                  }"
                >
                  <template #header>
                    <div class="flex items-center gap-2">
                      <Icon icon="ep:info-filled" :size="18" class="text-primary" />
                      <ElText tag="b" size="large">基本信息</ElText>
                    </div>
                  </template>
                  <ElDescriptions :column="1" border size="large">
                    <ElDescriptionsItem
                      label="方案名称"
                      label-align="right"
                      label-class-name="!w-28"
                    >
                      <ElText tag="b">{{ formData.name || '-' }}</ElText>
                    </ElDescriptionsItem>
                    <ElDescriptionsItem
                      label="评估算法"
                      label-align="right"
                      label-class-name="!w-28"
                    >
                      <ElText>{{ getAlgorithmName() }}</ElText>
                    </ElDescriptionsItem>
                    <ElDescriptionsItem
                      label="选择仪表盘"
                      label-align="right"
                      label-class-name="!w-28"
                    >
                      <ElText>{{ getDashboardName() }}</ElText>
                    </ElDescriptionsItem>
                    <ElDescriptionsItem
                      label="方案描述"
                      label-align="right"
                      label-class-name="!w-28"
                    >
                      <ElText type="info" class="whitespace-pre-wrap">{{
                        formData.description || '无'
                      }}</ElText>
                    </ElDescriptionsItem>
                  </ElDescriptions>
                </ElCard>
              </template>

              <template #second>
                <ElCard
                  shadow="never"
                  class="indicator-wrapper border border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)] h-full"
                  :body-style="{
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }"
                >
                  <template #header>
                    <div class="flex items-center gap-3">
                      <ElTag type="success" size="large" round effect="dark" class="shrink-0">
                        <div class="flex items-center gap-1">
                          <Icon icon="ep:view" />
                          <span>只读</span>
                        </div>
                      </ElTag>
                      <div class="flex flex-col gap-1">
                        <ElText tag="b" size="large">指标体系图</ElText>
                        <ElText size="small" type="info">查看指标体系结构（预览模式）</ElText>
                      </div>
                    </div>
                  </template>

                  <div
                    v-if="!formData.metricSystemId"
                    class="flex flex-1 items-center justify-center"
                  >
                    <ElEmpty description="暂无指标体系数据" :image-size="120" />
                  </div>
                  <div v-else class="flex-1 h-full">
                    <IndicatorDesign
                      :key="`step3-${formData.metricSystemId}`"
                      :graph-data="getGraphData"
                      :is-show-side-nav="false"
                      :is-show-toolbar="false"
                      :is-editable="false"
                      :algo-type="2"
                      :show-save-btn="false"
                      :useFlexView="false"
                    />
                  </div>
                </ElCard>
              </template>
            </ZxSplitBox>
          </section>
        </ElForm>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup>
import { Icon } from '@/components/Icon'
import { ContentWrap } from '@/components/ContentWrap'
import EvaluationAlgorithmSelector from '@/components/business/Selector/EvaluationAlgorithmSelector.vue'
import IndicatorSystemSelector from '@/components/business/Selector/IndicatorSystemSelector.vue'
import IndicatorSystemTagSelector from '@/components/business/Selector/IndicatorSystemTagSelector.vue'
import IndicatorDesign from '@/views/Indicator/components/Design.vue'
import DashboardSelector from './DashboardSelector.vue'
import { createEvaluationTaskJob } from '@/api/modules/evaluation'
import { systemApi } from '@/api/modules/indicator/system'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'EvaluationTaskWizard' })

const props = defineProps({
  taskId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['cancel', 'success'])

// 步骤配置
const steps = [
  { title: '基本信息与算法', description: '填写方案信息并选择评估算法' },
  { title: '指标体系与数据', description: '选择指标体系并完成数据映射' },
  { title: '选择仪表盘', description: '选择评估结果展示仪表盘' },
  { title: '审查与提交', description: '核对所有配置并确认提交' }
]

// 表单引用和状态
const formRef = ref()
const currentStep = ref(0)
const activeStep = computed(() => steps[currentStep.value] || { title: '', description: '' })
const progressPercentage = computed(() => {
  if (!steps.length) return 0
  return Math.round(((currentStep.value + 1) / steps.length) * 100)
})
const saving = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  description: '',
  algorithmId: '',
  systemTagId: '',
  metricSystemId: '',
  dashboardId: ''
})

// 缓存的数据
const cachedData = reactive({
  algorithmName: '', // 评估算法名称
  systemName: '', // 指标体系名称
  graphData: null, // 图数据
  dashboardName: '', // 仪表盘名称
  dashboardConfig: null // 仪表盘完整配置
})

// 表单验证规则
const formRules = computed(() => {
  const rules = {
    name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
    algorithmId: [{ required: true, message: '请选择评估算法', trigger: 'change' }]
  }

  if (currentStep.value === 1) {
    rules.metricSystemId = [{ required: true, message: '请选择指标体系', trigger: 'change' }]
  }

  return rules
})

// 算法变更
const handleAlgorithmChange = (value, option) => {
  console.log('算法变更:', value, option)
  // 保存算法名称
  if (option && option.label) {
    cachedData.algorithmName = option.label
  } else {
    // 如果没有名称，使用ID作为名称
    cachedData.algorithmName = value || ''
  }
}

// 体系标签变更
const handleSystemTagChange = (value) => {
  console.log('体系标签变更:', value)
}

// 体系标签清空
const handleSystemTagClear = () => {
  console.log('体系标签已清空')
  formData.systemTagId = ''
}

// 指标体系变更
const handleMetricSystemChange = (value, option) => {
  console.log('指标体系变更:', value, option)
  // 保存指标体系名称
  if (option && option.name) {
    cachedData.systemName = option.name
  } else {
    // 如果没有名称，使用ID作为名称
    cachedData.systemName = value || ''
  }
  // 清空图数据缓存，以便重新加载新的指标体系数据
  cachedData.graphData = null
  console.log('已清空图数据缓存，将重新加载')
}

// 仪表盘变更
const handleDashboardChange = (value, option) => {
  console.log('仪表盘变更:', value, option)
  // 保存仪表盘名称和完整配置
  if (option) {
    cachedData.dashboardName = option.schemeName || ''
    // 保存完整的仪表盘对象，用于后续提交
    cachedData.dashboardConfig = option
  } else {
    // 如果没有名称，使用ID作为名称
    cachedData.dashboardName = value || ''
    cachedData.dashboardConfig = null
  }
}

// 加载指标体系图数据
const loadIndicatorSystemGraph = async () => {
  if (!formData.metricSystemId) {
    cachedData.graphData = null
    return { nodes: [], edges: [] }
  }

  try {
    console.log('加载指标体系图数据，体系ID:', formData.metricSystemId)

    // 调用API获取指标体系详情
    const detail = await systemApi.getSystemDetail(formData.metricSystemId)
    console.log('API返回详情:', detail)

    if (detail?.detailContent) {
      try {
        // detailContent 是 JSON 字符串，需要解析
        const graphData = JSON.parse(detail.detailContent)
        // 缓存图数据
        cachedData.graphData = graphData
        return graphData
      } catch (parseError) {
        cachedData.graphData = null
        return { nodes: [], edges: [] }
      }
    }

    console.warn('⚠️ 指标体系详情中没有 detailContent 数据')
    cachedData.graphData = null
    return { nodes: [], edges: [] }
  } catch (error) {
    console.error('❌ 加载指标体系图数据失败:', error)
    ElMessage.error('加载指标体系图数据失败')
    cachedData.graphData = null
    return { nodes: [], edges: [] }
  }
}

// 获取图数据的计算属性 - 使用缓存避免重复加载
const getGraphData = computed(() => {
  // 返回一个函数，该函数返回缓存的数据或加载新数据
  return async () => {
    // 如果有缓存且体系ID未变，直接返回缓存
    if (cachedData.graphData) {
      console.log('使用缓存的图数据')
      return cachedData.graphData
    }
    // 否则加载新数据
    return await loadIndicatorSystemGraph()
  }
})

// 获取算法名称
const getAlgorithmName = () => {
  return cachedData.algorithmName || formData.algorithmId || '-'
}

// 获取指标体系名称
const getMetricSystemName = () => {
  return cachedData.systemName || formData.metricSystemId || '-'
}

// 获取仪表盘名称
const getDashboardName = () => {
  return cachedData.dashboardName || formData.dashboardId || '-'
}

// 取消
const handleCancel = () => {
  emit('cancel')
}

// 上一步
const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 下一步
const handleNext = async () => {
  try {
    // 根据当前步骤，只验证当前步骤的字段
    const fieldsToValidate = []

    if (currentStep.value === 0) {
      // 第一步：验证基本信息和算法
      fieldsToValidate.push('name', 'algorithmId')
    } else if (currentStep.value === 1) {
      // 第二步：验证指标体系
      fieldsToValidate.push('metricSystemId')
    } else if (currentStep.value === 2) {
      // 第三步：验证仪表盘
      if (!formData.dashboardId) {
        ElMessage.warning('请选择仪表盘')
        return
      }
    }

    // 只验证当前步骤的字段
    if (fieldsToValidate.length > 0) {
      await Promise.all(fieldsToValidate.map((field) => formRef.value?.validateField(field)))
    }

    if (currentStep.value < steps.length - 1) {
      currentStep.value++
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 完成
const handleFinish = async () => {
  try {
    await formRef.value?.validate()

    // 验证仪表盘是否已选择
    if (!formData.dashboardId) {
      ElMessage.warning('请选择仪表盘')
      return
    }

    saving.value = true

    // 构建提交数据
    const submitData = {
      taskId: props.taskId, // 评估任务ID
      taskJobName: formData.name, // 方案名称
      scheme: formData.name, // 方案名称
      taskTemplate: formData.description || '', // 描述
      methodId: formData.algorithmId, // 评估算法id
      systemName: cachedData.systemName || formData.metricSystemId, // 体系名称
      detailContent: cachedData.graphData ? JSON.stringify(cachedData.graphData) : '', // 图数据
      dashboardId: formData.dashboardId, // 仪表盘ID
      schemeResult: cachedData.dashboardConfig || null // 仪表盘配置数据
    }

    console.log('提交评估任务数据:', submitData)
    console.log('当前任务ID:', props.taskId)

    // 调用API创建评估任务作业
    const result = await createEvaluationTaskJob(submitData)

    ElMessage.success('评估方案创建成功')
    emit('success', result)
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error?.message || '创建评估方案失败，请重试')
  } finally {
    saving.value = false
  }
}

// 暴露方法
defineExpose({
  formData,
  currentStep
})
</script>
<style lang="less">
.m-evaluation-task-wizard.v-content-wrap {
  height: calc(100vh - 165px);

  .el-card__body {
    height: 100%;
  }

  .indicator-wrapper.el-card {
    .el-card__body {
      padding-bottom: 40px;
    }
  }

  // 配置审查卡片样式
  .config-review-card {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-color: var(--el-color-primary-light-7);
    }

    .el-card__header {
      background-color: var(--el-fill-color-blank);
      border-bottom: 1px solid var(--el-border-color-lighter);
      padding: 16px 20px;
    }

    .el-card__body {
      padding: 0;
    }

    .el-descriptions {
      &.el-descriptions--large {
        :deep(.el-descriptions__body) {
          .el-descriptions__table {
            .el-descriptions__cell {
              padding: 16px 20px;
            }

            .el-descriptions__label {
              font-weight: 500;
              color: var(--el-text-color-regular);
              background-color: var(--el-fill-color-light);
            }

            .el-descriptions__content {
              color: var(--el-text-color-primary);
            }
          }
        }
      }
    }
  }

  // 步骤卡片优化
  .el-steps--vertical {
    .el-step__title {
      font-size: 16px;
      font-weight: 500;
    }

    .el-step__description {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  // Alert 样式优化
  .el-alert {
    border-radius: 8px;

    &.el-alert--success {
      background-color: var(--el-color-success-light-9);
      border: 1px solid var(--el-color-success-light-7);

      .el-alert__title {
        color: var(--el-color-success);
        font-weight: 500;
      }

      .el-alert__description {
        color: var(--el-text-color-regular);
      }
    }
  }

  // 表单项优化
  .el-form-item {
    .el-form-item__label {
      font-weight: 500;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
