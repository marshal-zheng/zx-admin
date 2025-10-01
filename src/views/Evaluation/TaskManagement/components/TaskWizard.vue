<template>
  <ZxDrawer
    v-model="visible"
    title="创建评估任务"
    :width="960"
    :footer="false"
    :unmount-on-close="true"
    :mask-closable="false"
    class="task-wizard-drawer"
  >
    <div class="task-wizard">
      <header class="task-wizard__progress">
        <div class="task-wizard__progress-info">
          <div class="task-wizard__progress-title">{{ activeStep.title }}</div>
          <p class="task-wizard__progress-desc">{{ activeStep.description }}</p>
        </div>
        <el-steps :active="currentStep" align-center class="task-wizard__steps">
          <el-step
            v-for="(step, index) in steps"
            :key="step.title"
            :title="step.title"
            :description="step.description"
            :icon="step.icon"
          />
        </el-steps>
      </header>

      <div class="task-wizard__body">
        <el-form
          ref="formRef"
          :model="wizardData"
          :rules="formRules"
          label-position="top"
          class="task-wizard__form dialog-form-container"
        >
          <!-- Step 1 -->
          <section v-show="currentStep === 0" class="task-stage">
            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">01</span>
                <div>
                  <h3 class="task-section__title">基本信息</h3>
                  <p class="task-section__desc">完善任务名称与描述，确保团队容易识别。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-form-item prop="name" label="任务名称">
                  <el-input
                    v-model="wizardData.name"
                    placeholder="请输入任务名称"
                    maxlength="60"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item prop="description" label="任务描述">
                  <el-input
                    v-model="wizardData.description"
                    type="textarea"
                    :rows="3"
                    maxlength="200"
                    show-word-limit
                    placeholder="可选，建议说明任务目标与适用范围"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">02</span>
                <div>
                  <h3 class="task-section__title">创建方式</h3>
                  <p class="task-section__desc">选择最贴合场景的起步路径，可随时切换。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-form-item prop="createType" label="请选择创建方式" class="task-option-group">
                  <el-radio-group v-model="wizardData.createType">
                    <el-radio-button value="blank" class="task-option" :label="'blank'">
                      <div class="task-option__content">
                        <strong>从空白创建</strong>
                        <p>从零开始配置评估任务，完全自定义流程。</p>
                      </div>
                    </el-radio-button>
                    <el-radio-button value="template" class="task-option" :label="'template'">
                      <div class="task-option__content">
                        <strong>从任务模板创建</strong>
                        <p>复用成熟模板，快速落地并保持规范。</p>
                      </div>
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  v-if="wizardData.createType === 'template'"
                  prop="templateId"
                  label="任务模板"
                >
                  <ZxSelect
                    v-model="wizardData.templateId"
                    placeholder="请选择任务模板"
                    :loading="templatesLoading"
                    :options="templates"
                    label-key="name"
                    value-key="id"
                    allow-search
                    style="width: 100%"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">03</span>
                <div>
                  <h3 class="task-section__title">评估算法</h3>
                  <p class="task-section__desc">为任务挑选符合业务复杂度的评估方法。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-form-item prop="algorithm" label="请选择评估算法" class="task-algorithm">
                  <div v-if="algorithmsLoading" class="task-placeholder">
                    <el-skeleton :rows="3" animated />
                  </div>
                  <div v-else-if="algorithms.length === 0" class="task-placeholder">
                    <el-empty description="暂无可用算法" />
                  </div>
                  <el-radio-group
                    v-else
                    v-model="wizardData.algorithm"
                    class="task-algorithm__group"
                  >
                    <label
                      v-for="algorithm in algorithms"
                      :key="algorithm.id"
                      class="task-card"
                      :class="{ 'task-card--active': wizardData.algorithm === algorithm.id }"
                    >
                      <el-radio :value="algorithm.id">
                        <div class="task-card__content">
                          <div class="task-card__title">{{ algorithm.name }}</div>
                          <p class="task-card__desc">{{ algorithm.description }}</p>
                          <div class="task-card__meta">
                            <el-tag v-if="algorithm.category" size="small" effect="plain">{{
                              algorithm.category
                            }}</el-tag>
                            <el-tag
                              v-if="algorithm.complexity"
                              :type="getComplexityType(algorithm.complexity)"
                              size="small"
                              effect="plain"
                            >
                              {{ getComplexityText(algorithm.complexity) }}
                            </el-tag>
                          </div>
                        </div>
                      </el-radio>
                    </label>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </section>

          <!-- Step 2 -->
          <section v-show="currentStep === 1" class="task-stage">
            <el-alert
              title="指标体系配置"
              description="选择基础指标体系模板，后续可在任务内进行微调，原模板不会被修改。"
              type="info"
              :closable="false"
              show-icon
            />

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">01</span>
                <div>
                  <h3 class="task-section__title">指标体系模板</h3>
                  <p class="task-section__desc">锁定结构化指标体系，保证评估维度统一。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-form-item prop="metricSystemId" label="请选择指标体系模板">
                  <SelectMetricSystem
                    v-model="wizardData.metricSystemId"
                    placeholder="请选择指标体系模板"
                    @change="handleMetricSystemChange"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">02</span>
                <div>
                  <h3 class="task-section__title">数据映射配置</h3>
                  <p class="task-section__desc"
                    >为每个关键指标绑定数据源，确保后续可自动拉取数据。</p
                  >
                </div>
                <ZxButton
                  type="primary"
                  size="small"
                  :disabled="!wizardData.metricSystemId"
                  @click="openDataMapping"
                  >配置数据映射</ZxButton
                >
              </header>
              <div class="task-section__body">
                <el-alert
                  title="提示"
                  description="数据映射完成前，任务无法立即运行。建议先完成映射再启动任务。"
                  type="warning"
                  :closable="false"
                  show-icon
                  class="task-inline-alert"
                />

                <div v-if="wizardData.dataMapping.length > 0" class="task-mapping-summary">
                  <div class="task-mapping-summary__title">已配置映射</div>
                  <ul class="task-mapping-summary__list">
                    <li v-for="item in wizardData.dataMapping" :key="item.id">
                      <span class="task-mapping-summary__name">{{ item.indicatorName }}</span>
                      <el-tag size="small" type="success">{{ item.sourceName }}</el-tag>
                    </li>
                  </ul>
                </div>
                <div v-else class="task-placeholder">
                  <el-empty
                    :description="
                      wizardData.metricSystemId ? '尚未配置数据映射' : '请先选择指标体系模板'
                    "
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- Step 3 -->
          <section v-show="currentStep === 2" class="task-stage">
            <el-alert
              title="仪表板配置"
              description="选择结果展示模板，或留空使用自定义布局。"
              type="info"
              :closable="false"
              show-icon
            />

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">01</span>
                <div>
                  <h3 class="task-section__title">仪表板模板</h3>
                  <p class="task-section__desc">统一结果呈现方式，方便管理层快速理解。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-form-item
                  prop="dashboardTemplateId"
                  label="请选择仪表板模板"
                  class="task-dashboard"
                >
                  <div v-if="dashboardLoading" class="task-placeholder">
                    <el-skeleton :rows="2" animated />
                  </div>
                  <el-radio-group
                    v-else
                    v-model="wizardData.dashboardTemplateId"
                    class="task-dashboard__group"
                  >
                    <label
                      class="task-card"
                      :class="{ 'task-card--active': wizardData.dashboardTemplateId === 'blank' }"
                    >
                      <el-radio value="blank">
                        <div class="task-card__content">
                          <div class="task-card__title">空白画布</div>
                          <p class="task-card__desc">自由拖拽组件，完全自定义结果呈现。</p>
                        </div>
                      </el-radio>
                    </label>
                    <label
                      v-for="template in dashboardTemplates"
                      :key="template.id"
                      class="task-card"
                      :class="{
                        'task-card--active': wizardData.dashboardTemplateId === template.id
                      }"
                    >
                      <el-radio :value="template.id">
                        <div class="task-card__content">
                          <div class="task-card__title">{{ template.name }}</div>
                          <p class="task-card__desc">{{
                            template.description || '包含常用指标与图表布局。'
                          }}</p>
                        </div>
                      </el-radio>
                    </label>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </section>

          <!-- Step 4 -->
          <section v-show="currentStep === 3" class="task-stage">
            <el-alert
              title="配置审查"
              description="请再次确认关键信息，如需修改可返回对应步骤调整。"
              type="success"
              :closable="false"
              show-icon
            />

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">01</span>
                <div>
                  <h3 class="task-section__title">任务概览</h3>
                  <p class="task-section__desc">确保任务名称、创建方式与算法组合合理。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-descriptions :column="2" size="small" border>
                  <el-descriptions-item label="任务名称">{{
                    wizardData.name
                  }}</el-descriptions-item>
                  <el-descriptions-item label="创建方式">
                    {{ wizardData.createType === 'blank' ? '从空白创建' : '从模板创建' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="评估算法">{{ algorithmName }}</el-descriptions-item>
                  <el-descriptions-item label="任务模板">
                    {{
                      (selectedTemplate && selectedTemplate.name) ||
                      (wizardData.createType === 'template' ? '未选择' : '—')
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item label="描述" :span="2">
                    {{ wizardData.description || '未填写' }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">02</span>
                <div>
                  <h3 class="task-section__title">指标体系与数据</h3>
                  <p class="task-section__desc">确认指标体系及数据映射状态，保证数据来源可靠。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-descriptions :column="2" size="small" border>
                  <el-descriptions-item label="指标体系">
                    {{ metricSystemName || '未选择' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="映射状态">
                    <el-tag
                      :type="wizardData.dataMapping.length > 0 ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ wizardData.dataMapping.length > 0 ? '已完成' : '待配置' }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">03</span>
                <div>
                  <h3 class="task-section__title">结果展示</h3>
                  <p class="task-section__desc">确认仪表板模板，保持跨任务的视觉一致性。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-descriptions :column="1" size="small" border>
                  <el-descriptions-item label="仪表板模板">
                    {{ dashboardTemplateName }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>

            <div class="task-section">
              <header class="task-section__header">
                <span class="task-section__badge">04</span>
                <div>
                  <h3 class="task-section__title">提交方式</h3>
                  <p class="task-section__desc">草稿用于团队协作，运行会立刻进入排队执行。</p>
                </div>
              </header>
              <div class="task-section__body">
                <el-form-item prop="saveType" label="请选择后续动作" class="task-submit-options">
                  <el-radio-group v-model="wizardData.saveType">
                    <el-radio value="draft">
                      <div class="task-submit-options__item">
                        <el-icon class="task-submit-options__icon"><InfoFilled /></el-icon>
                        <div>
                          <div class="task-submit-options__title">保存为草稿</div>
                          <div class="task-submit-options__desc">保留全部设置，稍后继续完善。</div>
                        </div>
                      </div>
                    </el-radio>
                    <el-radio value="run" :disabled="wizardData.dataMapping.length === 0">
                      <div class="task-submit-options__item">
                        <el-icon
                          class="task-submit-options__icon task-submit-options__icon--success"
                        >
                          <CircleCheckFilled />
                        </el-icon>
                        <div>
                          <div class="task-submit-options__title">运行任务</div>
                          <div class="task-submit-options__desc">
                            立即触发评估流程
                            <el-text
                              v-if="wizardData.dataMapping.length === 0"
                              type="warning"
                              size="small"
                              class="task-submit-options__warning"
                              >需先完成数据映射</el-text
                            >
                          </div>
                        </div>
                      </div>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </section>
        </el-form>
      </div>

      <footer class="task-wizard__footer">
        <div class="task-wizard__progress-text"
          >步骤 {{ currentStep + 1 }} / {{ steps.length }}</div
        >
        <div class="task-wizard__actions">
          <ZxButton type="default" @click="handleCancel">取消</ZxButton>
          <ZxButton v-if="currentStep > 0" type="default" @click="handlePrev">上一步</ZxButton>
          <ZxButton v-if="currentStep < steps.length - 1" type="primary" @click="handleNext"
            >下一步</ZxButton
          >
          <ZxButton
            v-else
            type="primary"
            :loading="saving"
            :disabled="saving"
            @click="handleFinish"
          >
            完成
          </ZxButton>
        </div>
      </footer>
    </div>
  </ZxDrawer>

  <el-dialog
    v-model="showSuccessDialog"
    title="任务创建成功"
    width="420px"
    :close-on-click-modal="false"
  >
    <div class="task-success">
      <div class="task-success__icon">
        <el-icon color="#52c41a" :size="36">
          <CircleCheckFilled />
        </el-icon>
      </div>
      <h3 class="task-success__title">任务已成功创建并开始运行</h3>
      <p class="task-success__subtitle">任务 ID：{{ createdTaskId }}</p>
      <p class="task-success__desc">可在任务详情中查看运行进度与最新结果。</p>
    </div>
    <template #footer>
      <div class="task-success__footer">
        <ZxButton type="default" @click="closeSuccessDialog">关闭</ZxButton>
        <ZxButton type="primary" @click="goToTaskDetail">查看详情</ZxButton>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { InfoFilled, CircleCheckFilled } from '@element-plus/icons-vue'
import { ZxButton } from '@/components/pure'
import ZxDrawer from '@/components/pure/ZxDrawer/index.vue'
import ZxSelect from '@/components/pure/ZxSelect/index.vue'
import SelectMetricSystem from './selector/SelectMetricSystem.vue'
import ZXR from '@/api/http'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const router = useRouter()

const steps = [
  { title: '设置与方法选择', description: '填写基础信息并选择评估算法', icon: undefined },
  { title: '配置指标体系与数据', description: '选择指标体系并完成数据映射', icon: undefined },
  { title: '配置结果展示', description: '定义仪表板模板与呈现方式', icon: undefined },
  { title: '审查与启动', description: '核对所有配置并确认提交', icon: undefined }
]

const defaultWizardState = () => ({
  name: '',
  description: '',
  createType: 'blank',
  templateId: '',
  algorithm: '',
  metricSystemId: '',
  dataMapping: [],
  dashboardTemplateId: '',
  layoutConfig: {},
  saveType: 'draft'
})

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const currentStep = ref(0)
const saving = ref(false)
const showSuccessDialog = ref(false)
const createdTaskId = ref('')

const wizardData = reactive(defaultWizardState())

const templatesLoading = ref(false)
const algorithmsLoading = ref(false)
const dashboardLoading = ref(false)
const templates = ref([])
const algorithms = ref([])
const dashboardTemplates = ref([])
const selectedMetricSystem = ref(null)

const fallbackTemplates = [
  { id: 'template-basic', name: '综合评估模板' },
  { id: 'template-performance', name: '性能评估模板' },
  { id: 'template-security', name: '安全评估模板' }
]

const fallbackAlgorithms = [
  {
    id: 'weighted_sum',
    name: '加权求和算法',
    description: '基于权重的线性加权，适用于大部分通用场景。',
    category: '经典算法',
    complexity: 'low'
  },
  {
    id: 'fuzzy_comprehensive',
    name: '模糊综合评价算法',
    description: '处理不确定性与模糊信息的综合评价方法。',
    category: '模糊算法',
    complexity: 'medium'
  },
  {
    id: 'neural_network',
    name: '神经网络评价算法',
    description: '利用机器学习模型实现的智能评分方案。',
    category: 'AI算法',
    complexity: 'high'
  },
  {
    id: 'ahp',
    name: '层次分析法 (AHP)',
    description: '通过层次拆解与权重计算的系统化决策方法。',
    category: '经典算法',
    complexity: 'medium'
  }
]

const fallbackDashboards = [
  {
    id: 'dashboard-standard',
    name: '标准仪表板',
    description: '包含总览指标、趋势图与风险矩阵，适合通用评估场景。'
  },
  {
    id: 'dashboard-executive',
    name: '管理驾驶舱',
    description: '聚焦核心 KPI 与告警信息，便于高层快速决策。'
  }
]

const dataLoaded = ref(false)

const loadData = async () => {
  if (dataLoaded.value) return
  dataLoaded.value = true

  templatesLoading.value = true
  algorithmsLoading.value = true
  dashboardLoading.value = true

  try {
    const [templateRes, algorithmRes, dashboardRes] = await Promise.allSettled([
      ZXR.get('/api/evaluation/templates'),
      ZXR.get('/api/evaluation/algorithms'),
      ZXR.get('/api/evaluation/dashboards')
    ])

    if (templateRes.status === 'fulfilled' && Array.isArray(templateRes.value.data)) {
      templates.value = templateRes.value.data
    } else {
      templates.value = fallbackTemplates
    }

    if (algorithmRes.status === 'fulfilled' && Array.isArray(algorithmRes.value.data)) {
      algorithms.value = algorithmRes.value.data
    } else {
      algorithms.value = fallbackAlgorithms
    }

    if (dashboardRes.status === 'fulfilled' && Array.isArray(dashboardRes.value.data)) {
      dashboardTemplates.value = dashboardRes.value.data
    } else {
      dashboardTemplates.value = fallbackDashboards
    }
  } catch (error) {
    console.error('加载向导数据失败:', error)
    templates.value = fallbackTemplates
    algorithms.value = fallbackAlgorithms
    dashboardTemplates.value = fallbackDashboards
    ElMessage.warning('部分配置数据加载失败，已为您切换到默认选项')
  } finally {
    templatesLoading.value = false
    algorithmsLoading.value = false
    dashboardLoading.value = false
  }
}

watch(visible, (isVisible) => {
  if (isVisible) {
    loadData()
  } else {
    nextTick(() => resetWizard())
  }
})

watch(
  () => wizardData.createType,
  (type) => {
    if (type !== 'template') {
      wizardData.templateId = ''
      nextTick(() => formRef.value?.clearValidate('templateId'))
    }
  }
)

watch(currentStep, () => {
  nextTick(() => formRef.value?.clearValidate())
})

const activeStep = computed(() => steps[currentStep.value])

const algorithmDict = computed(() => {
  return algorithms.value.reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
})

const dashboardDict = computed(() => {
  return dashboardTemplates.value.reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
})

const selectedTemplate = computed(() => {
  return templates.value.find((item) => item.id === wizardData.templateId) || null
})

const algorithmName = computed(() => {
  return algorithmDict.value[wizardData.algorithm]?.name || '未选择'
})

const dashboardTemplateName = computed(() => {
  if (!wizardData.dashboardTemplateId) return '未选择'
  if (wizardData.dashboardTemplateId === 'blank') return '空白画布'
  return dashboardDict.value[wizardData.dashboardTemplateId]?.name || '未选择'
})

const metricSystemName = computed(() => {
  if (selectedMetricSystem.value && selectedMetricSystem.value.name) {
    return selectedMetricSystem.value.name
  }
  return wizardData.metricSystemId
})

const formRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  createType: [{ required: true, message: '请选择创建方式', trigger: 'change' }],
  templateId: [
    {
      validator: (_, value, callback) => {
        if (wizardData.createType === 'template' && !value) {
          callback(new Error('请选择任务模板'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  algorithm: [{ required: true, message: '请选择评估算法', trigger: 'change' }],
  metricSystemId: [{ required: true, message: '请选择指标体系模板', trigger: 'change' }],
  dashboardTemplateId: [{ required: true, message: '请选择仪表板模板', trigger: 'change' }],
  saveType: [{ required: true, message: '请选择操作方式', trigger: 'change' }]
}

const getComplexityType = (complexity) => {
  const map = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  }
  return map[complexity] || 'info'
}

const getComplexityText = (complexity) => {
  const map = {
    low: '简单',
    medium: '适中',
    high: '复杂'
  }
  return map[complexity] || '未知'
}

const fieldsForStep = (step) => {
  if (step === 0) {
    const fields = ['name', 'createType', 'algorithm']
    if (wizardData.createType === 'template') {
      fields.push('templateId')
    }
    return fields
  }
  if (step === 1) {
    return ['metricSystemId']
  }
  if (step === 2) {
    return ['dashboardTemplateId']
  }
  if (step === 3) {
    return ['saveType']
  }
  return []
}

const validateCurrentStep = async () => {
  const fields = fieldsForStep(currentStep.value)
  if (!fields.length) return true
  try {
    await formRef.value?.validateField(fields)
    return true
  } catch (error) {
    return false
  }
}

const handleNext = async () => {
  if (await validateCurrentStep()) {
    currentStep.value = Math.min(currentStep.value + 1, steps.length - 1)
  }
}

const handlePrev = () => {
  currentStep.value = Math.max(currentStep.value - 1, 0)
}

const handleFinish = async () => {
  if (!(await validateCurrentStep())) return

  try {
    saving.value = true
    await formRef.value?.validate()

    await new Promise((resolve) => setTimeout(resolve, 600))

    if (wizardData.saveType === 'run') {
      createdTaskId.value = `task_${Date.now()}`
      showSuccessDialog.value = true
    } else {
      ElMessage.success('任务已保存为草稿')
      emit('success')
      closeDrawer()
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  closeDrawer()
}

const closeDrawer = () => {
  visible.value = false
}

const resetWizard = () => {
  Object.assign(wizardData, defaultWizardState())
  currentStep.value = 0
  createdTaskId.value = ''
  showSuccessDialog.value = false
  selectedMetricSystem.value = null
  formRef.value?.clearValidate()
}

const handleMetricSystemChange = (value) => {
  if (value && typeof value === 'object') {
    selectedMetricSystem.value = value
  } else {
    selectedMetricSystem.value = null
  }
  wizardData.dataMapping = []
}

const openDataMapping = () => {
  if (!wizardData.metricSystemId) {
    ElMessage.warning('请先选择指标体系模板')
    return
  }
  ElMessage.info('数据映射配置功能开发中，可根据需求接入对应配置面板')
}

const closeSuccessDialog = () => {
  showSuccessDialog.value = false
  closeDrawer()
  emit('success')
}

const goToTaskDetail = () => {
  if (!createdTaskId.value) {
    closeSuccessDialog()
    return
  }
  showSuccessDialog.value = false
  emit('success')
  closeDrawer()
  router.push({ name: 'EvaluationDetail', params: { id: createdTaskId.value } })
}
</script>

<style scoped lang="less">
:deep(.el-drawer__body) {
  padding: 0;
}

.task-wizard-drawer {
  --task-border-color: var(--el-border-color-lighter);
  --task-section-bg: var(--app-background-color-card-default, #fff);
}

.task-wizard {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--el-fill-color-extra-light);
}

.task-wizard__progress {
  padding: 20px 32px 16px;
  background-color: var(--app-background-color-card-default, #fff);
  border-bottom: 1px solid var(--task-border-color);
}

.task-wizard__progress-info {
  margin-bottom: 16px;
}

.task-wizard__progress-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.task-wizard__progress-desc {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.task-wizard__steps {
  :deep(.el-step__title) {
    font-weight: 600;
  }

  :deep(.el-step__description) {
    line-height: 18px;
    white-space: nowrap;
  }
}

.task-wizard__body {
  padding: 24px 32px 0;
  overflow: auto;
  flex: 1;
}

.task-wizard__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-stage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-section {
  display: flex;
  padding: 24px;
  background: var(--task-section-bg);
  border: 1px solid var(--task-border-color);
  border-radius: 12px;
  box-shadow: 0 8px 16px -12px rgb(15 23 42 / 20%);
  flex-direction: column;
  gap: 18px;
}

.task-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.task-section__badge {
  display: inline-flex;
  width: 36px;
  height: 36px;
  margin-right: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}

.task-section__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.task-section__desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.task-section__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.task-option-group {
  :deep(.el-radio-group) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  }

  :deep(.el-radio-button__inner) {
    width: 100%;
    padding: 0;
    border: 0;
  }
}

.task-option {
  width: 100%;

  :deep(.el-radio-button__inner) {
    padding: 18px;
    text-align: left;
    background: var(--app-background-color-card-default, #fff);
    border: 1px solid var(--task-border-color);
    border-radius: 10px;
    transition: all 0.25s ease;
  }

  :deep(.is-active .el-radio-button__inner),
  :deep(.el-radio-button.is-active .el-radio-button__inner) {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
  }
}

.task-option__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--el-text-color-regular);

  strong {
    font-size: 15px;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.task-algorithm__group {
  display: flex;
  flex-direction: column;
  gap: 12px;

  :deep(.el-radio) {
    display: block;
    margin: 0;
  }

  :deep(.el-radio__label) {
    width: 100%;
  }
}

.task-card {
  padding: 16px;
  cursor: pointer;
  background: var(--app-background-color-card-default, #fff);
  border: 1px solid var(--task-border-color);
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    box-shadow: 0 10px 20px -18px rgb(15 23 42 / 60%);
  }

  &--active {
    border-color: var(--el-color-primary);
    box-shadow:
      0 0 0 1px var(--el-color-primary) inset,
      0 12px 24px -18px rgb(64 158 255 / 65%);
  }

  :deep(.el-radio__input) {
    display: none;
  }
}

.task-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.task-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.task-card__meta {
  display: flex;
  gap: 8px;
}

.task-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 160px;
  background: var(--el-fill-color-lighter);
  border-radius: 10px;
}

.task-inline-alert {
  margin-bottom: 12px;
}

.task-mapping-summary {
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--task-border-color);
  border-radius: 10px;
}

.task-mapping-summary__title {
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.task-mapping-summary__list {
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
  flex-direction: column;
  gap: 8px;
}

.task-mapping-summary__name {
  margin-right: 8px;
  color: var(--el-text-color-regular);
}

.task-dashboard__group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.task-submit-options {
  :deep(.el-radio) {
    display: block;
    padding: 14px 16px;
    margin-bottom: 12px;
    border: 1px solid var(--task-border-color);
    border-radius: 12px;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  :deep(.el-radio.is-checked) {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
  }

  :deep(.el-radio__input) {
    display: none;
  }
}

.task-submit-options__item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.task-submit-options__icon {
  margin-top: 2px;
  color: var(--el-text-color-secondary);

  &--success {
    color: var(--el-color-success);
  }
}

.task-submit-options__title {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.task-submit-options__desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.task-submit-options__warning {
  margin-left: 6px;
}

.task-wizard__footer {
  display: flex;
  padding: 16px 32px;
  background-color: var(--app-background-color-card-default, #fff);
  border-top: 1px solid var(--task-border-color);
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.task-wizard__progress-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.task-wizard__actions {
  display: flex;
  gap: 12px;
}

.task-success {
  text-align: center;
}

.task-success__icon {
  display: flex;
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  background: rgb(82 196 26 / 8%);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}

.task-success__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.task-success__subtitle {
  margin: 0 0 4px;
  color: var(--el-text-color-regular);
}

.task-success__desc {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.task-success__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (width <= 960px) {
  .task-wizard__body {
    padding: 20px;
  }

  .task-section {
    padding: 18px;
  }

  .task-section__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-dashboard__group {
    grid-template-columns: 1fr;
  }
}
</style>
