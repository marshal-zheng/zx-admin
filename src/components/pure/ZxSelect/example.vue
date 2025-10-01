<template>
  <div class="zx-select-example">
    <div class="example-header">
      <h2>ZxSelect 选择器组件演示</h2>
      <p>基于 Element Plus Select 的扩展选择器组件</p>
    </div>

    <div class="demo-section">
      <h3>基础用法</h3>
      <div class="demo-content">
        <ZxSelect
          v-model="selectValue"
          :options="selectOptions"
          placeholder="请选择选项"
          style="width: 200px"
        />
        <p>选择值: {{ selectValue }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h3>多选模式</h3>
      <div class="demo-content">
        <ZxSelect
          v-model="multiSelectValue"
          :options="selectOptions"
          placeholder="请选择多个选项"
          multiple
          style="width: 300px"
        />
        <p>选择值: {{ multiSelectValue }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h3>可搜索</h3>
      <div class="demo-content">
        <ZxSelect
          v-model="searchSelectValue"
          :options="largeOptions"
          placeholder="可搜索选择器"
          filterable
          style="width: 250px"
        />
        <p>选择值: {{ searchSelectValue }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h3>禁用状态</h3>
      <div class="demo-content">
        <ZxSelect
          v-model="disabledValue"
          :options="selectOptions"
          placeholder="禁用状态"
          disabled
          style="width: 200px"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>自定义选项模板</h3>
      <div class="demo-content">
        <ZxSelect
          v-model="customSelectValue"
          :options="customOptions"
          placeholder="自定义选项模板"
          style="width: 250px"
        >
          <template #option="{ option }">
            <div class="custom-option">
              <span class="option-label">{{ option.label }}</span>
              <span class="option-desc">{{ option.description }}</span>
            </div>
          </template>
        </ZxSelect>
        <p>选择值: {{ customSelectValue }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZxSelectExample',
  data() {
    return {
      selectValue: '',
      multiSelectValue: [],
      searchSelectValue: '',
      disabledValue: '',
      customSelectValue: '',
      selectOptions: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
        { label: '选项4', value: 'option4' },
        { label: '选项5', value: 'option5' }
      ],
      largeOptions: [
        { label: 'Apple 苹果', value: 'apple' },
        { label: 'Banana 香蕉', value: 'banana' },
        { label: 'Cherry 樱桃', value: 'cherry' },
        { label: 'Date 枣子', value: 'date' },
        { label: 'Elderberry 接骨木果', value: 'elderberry' },
        { label: 'Fig 无花果', value: 'fig' },
        { label: 'Grape 葡萄', value: 'grape' },
        { label: 'Honeydew 蜜瓜', value: 'honeydew' },
        { label: 'Kiwi 猕猴桃', value: 'kiwi' },
        { label: 'Lemon 柠檬', value: 'lemon' }
      ],
      customOptions: [
        { label: '北京', value: 'beijing', description: '中国首都' },
        { label: '上海', value: 'shanghai', description: '经济中心' },
        { label: '广州', value: 'guangzhou', description: '南方门户' },
        { label: '深圳', value: 'shenzhen', description: '科技之都' },
        { label: '杭州', value: 'hangzhou', description: '人间天堂' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.zx-select-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .example-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      color: #303133;
      margin-bottom: 10px;
      font-size: 28px;
    }

    p {
      color: #606266;
      font-size: 16px;
    }
  }

  h3 {
    color: #606266;
    margin: 20px 0 15px;
    font-size: 18px;
    font-weight: 600;
  }

  .demo-section {
    margin-bottom: 30px;
    padding: 25px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    background-color: #fafafa;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .demo-content {
    display: flex;
    flex-direction: column;
    gap: 15px;

    p {
      color: #606266;
      font-size: 14px;
      margin: 0;
    }
  }

  .custom-option {
    display: flex;
    flex-direction: column;

    .option-label {
      font-weight: 500;
      color: #303133;
    }

    .option-desc {
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }
  }
}
</style>
