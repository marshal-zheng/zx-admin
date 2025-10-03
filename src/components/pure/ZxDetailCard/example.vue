<template>
  <div class="zx-detail-card-demo">
    <h1>ZxDetailCard 详情卡片组件</h1>
    <p>用于展示详细信息的卡片组件，支持标题、描述列表、标签展示和展开收起功能。</p>

    <!-- 基础用法 -->
    <div class="demo-section">
      <h2>基础用法</h2>
      <p>最简单的用法，展示标题和描述信息。</p>
      <div class="demo-container">
        <ZxDetailCard title="基础详情卡片" :description="basicDescription">
          <template #titlePrefix>
            <ZxIcon icon="InfoFilled" color="#409eff" />
          </template>
        </ZxDetailCard>
      </div>
    </div>

    <!-- 带标签的用法 -->
    <div class="demo-section">
      <h2>带标签展示</h2>
      <p>支持在描述中展示标签列表。</p>
      <div class="demo-container">
        <ZxDetailCard title="项目详情" :description="tagDescription">
          <template #titleRight>
            <el-button type="primary" size="small">编辑</el-button>
          </template>
        </ZxDetailCard>
      </div>
    </div>

    <!-- 展开收起功能 -->
    <div class="demo-section">
      <h2>展开收起功能</h2>
      <p>当描述项较多时，可以设置简单展示数量，超出部分可展开查看。</p>
      <div class="demo-container">
        <ZxDetailCard
          title="完整信息展示"
          :description="fullDescription"
          :simple-show-count="4"
          @expand="handleExpand"
          @collapse="handleCollapse"
        >
          <template #titlePrefix>
            <ZxIcon icon="Document" color="#67c23a" />
          </template>
          <template #titleAppend>
            <el-tag size="small" type="success">已完成</el-tag>
          </template>
        </ZxDetailCard>
      </div>
    </div>

    <!-- 自定义插槽 -->
    <div class="demo-section">
      <h2>自定义插槽</h2>
      <p>支持通过插槽自定义特定字段的展示内容。</p>
      <div class="demo-container">
        <ZxDetailCard title="自定义展示" :description="customDescription">
          <template #status="{ value }">
            <el-tag :type="getStatusType(value)" size="small">
              {{ value }}
            </el-tag>
          </template>
          <template #progress="{ value }">
            <el-progress :percentage="value" :width="100" />
          </template>
        </ZxDetailCard>
      </div>
    </div>

    <!-- 响应式布局 -->
    <div class="demo-section">
      <h2>响应式布局</h2>
      <p>在不同屏幕尺寸下自动调整布局。</p>
      <div class="demo-container">
        <ZxDetailCard title="响应式展示" :description="responsiveDescription" />
      </div>
    </div>

    <!-- 自定义样式 -->
    <div class="demo-section">
      <h2>自定义样式</h2>
      <p>支持自定义内边距和圆角样式。</p>
      <div class="demo-container">
        <div class="demo-row">
          <div class="demo-item">
            <h4>自定义内边距</h4>
            <ZxDetailCard title="自定义内边距卡片" :description="basicDescription" padding="30px" />
          </div>
          <div class="demo-item">
            <h4>启用圆角</h4>
            <ZxDetailCard
              title="圆角卡片"
              :description="basicDescription"
              :enable-border-radius="true"
              style="border: 1px solid var(--el-border-color)"
            />
          </div>
        </div>
        <div class="demo-item">
          <h4>组合样式</h4>
          <ZxDetailCard
            title="组合样式卡片"
            :description="basicDescription"
            padding="40px"
            :enable-border-radius="true"
            style="
              background: var(--el-fill-color-lighter);
              border: 1px solid var(--el-border-color);
            "
          />
        </div>
        <div class="demo-item">
          <h4>自定义圆角大小</h4>
          <ZxDetailCard
            title="大圆角卡片"
            :description="basicDescription"
            :enable-border-radius="true"
            style="
              --zx-detail-card-border-radius: 16px;

              border: 1px solid var(--el-border-color);
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ZxDetailCard from './index.vue'
import ZxIcon from '../ZxIcon/index.vue'

// 基础描述数据
const basicDescription = ref([
  {
    key: 'name',
    locale: '名称',
    value: '示例项目'
  },
  {
    key: 'type',
    locale: '类型',
    value: 'Web应用'
  },
  {
    key: 'createTime',
    locale: '创建时间',
    value: '2024-01-15 10:30:00'
  },
  {
    key: 'description',
    locale: '描述',
    value: '这是一个示例项目的详细描述信息，用于展示详情卡片组件的基础功能。'
  }
])

// 带标签的描述数据
const tagDescription = ref([
  {
    key: 'name',
    locale: '项目名称',
    value: '评估系统前端'
  },
  {
    key: 'technologies',
    locale: '技术栈',
    value: ['Vue3', 'Element Plus', 'Vite', 'SCSS']
  },
  {
    key: 'team',
    locale: '团队成员',
    value: ['张三', '李四', '王五']
  },
  {
    key: 'status',
    locale: '状态',
    value: '开发中'
  }
])

// 完整描述数据（用于展开收起）
const fullDescription = ref([
  {
    key: 'id',
    locale: 'ID',
    value: 'PROJ-2024-001'
  },
  {
    key: 'name',
    locale: '项目名称',
    value: '企业评估管理系统'
  },
  {
    key: 'type',
    locale: '项目类型',
    value: 'Web应用系统'
  },
  {
    key: 'priority',
    locale: '优先级',
    value: '高'
  },
  {
    key: 'startDate',
    locale: '开始日期',
    value: '2024-01-01'
  },
  {
    key: 'endDate',
    locale: '结束日期',
    value: '2024-06-30'
  },
  {
    key: 'budget',
    locale: '预算',
    value: '100万元'
  },
  {
    key: 'manager',
    locale: '项目经理',
    value: '张经理'
  },
  {
    key: 'department',
    locale: '所属部门',
    value: '技术研发部'
  }
])

// 自定义插槽数据
const customDescription = ref([
  {
    key: 'name',
    locale: '任务名称',
    value: '系统开发'
  },
  {
    key: 'status',
    locale: '状态',
    value: '进行中'
  },
  {
    key: 'progress',
    locale: '进度',
    value: 75
  },
  {
    key: 'assignee',
    locale: '负责人',
    value: '开发团队'
  }
])

// 响应式布局数据
const responsiveDescription = ref([
  {
    key: 'field1',
    locale: '字段一',
    value: '值一',
    width: '25%'
  },
  {
    key: 'field2',
    locale: '字段二',
    value: '值二',
    width: '25%'
  },
  {
    key: 'field3',
    locale: '字段三',
    value: '值三',
    width: '50%'
  },
  {
    key: 'field4',
    locale: '长字段名称',
    value: '这是一个比较长的值，用于测试文本溢出和提示功能',
    tooltipPosition: 'top'
  }
])

// 事件处理
function handleExpand() {
  ElMessage.success('详情已展开')
}

function handleCollapse() {
  ElMessage.info('详情已收起')
}

// 获取状态类型
function getStatusType(status) {
  const typeMap = {
    进行中: 'warning',
    已完成: 'success',
    已暂停: 'info',
    已取消: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
.zx-detail-card-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: #303133;
    margin-bottom: 10px;
  }

  > p {
    color: #606266;
    margin-bottom: 30px;
    line-height: 1.6;
  }

  .demo-section {
    margin-bottom: 40px;

    h2 {
      color: #409eff;
      font-size: 18px;
      margin-bottom: 8px;
      border-left: 3px solid #409eff;
      padding-left: 10px;
    }

    > p {
      color: #606266;
      margin-bottom: 15px;
      font-size: 14px;
      line-height: 1.5;
    }

    .demo-container {
      padding: 20px;
      border: 1px solid #ebeef5;
      border-radius: 8px;
      background-color: #fafafa;
    }

    .demo-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;

      .demo-item {
        flex: 1;
      }
    }

    .demo-item {
      h4 {
        color: #606266;
        font-size: 14px;
        margin-bottom: 10px;
        font-weight: 500;
      }
    }
  }
}
</style>
