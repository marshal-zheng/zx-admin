<template>
  <div class="zx-icon-example">
    <div class="example-header">
      <h2>ZxIcon 图标组件演示</h2>
      <p>基于 Element Plus Icons 和 iconfont 的图标组件</p>
    </div>

    <div class="demo-section">
      <h3>基础用法</h3>
      <div class="icon-row">
        <ZxIcon icon="Search" :size="20" />
        <ZxIcon icon="Edit" :size="24" color="#409EFF" />
        <ZxIcon icon="Delete" :size="28" color="#F56C6C" />
        <ZxIcon icon="Plus" :size="32" color="#67C23A" />
      </div>
    </div>

    <div class="demo-section">
      <h3>不同尺寸</h3>
      <div class="icon-row">
        <ZxIcon icon="Star" :size="16" />
        <ZxIcon icon="Star" :size="20" />
        <ZxIcon icon="Star" :size="24" />
        <ZxIcon icon="Star" :size="32" />
        <ZxIcon icon="Star" :size="40" />
      </div>
    </div>

    <div class="demo-section">
      <h3>悬停效果</h3>
      <div class="icon-row">
        <ZxIcon icon="Star" :size="32" color="#909399" hover-color="#F56C6C" />
        <ZxIcon icon="StarFilled" :size="32" color="#909399" hover-color="#E6A23C" />
        <ZxIcon icon="Like" :size="32" color="#909399" hover-color="#409EFF" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Tooltip 功能</h3>
      <div class="icon-row">
        <ZxIcon icon="Edit" :size="24" tooltip="编辑" />
        <ZxIcon icon="Delete" :size="24" tooltip="删除" color="#F56C6C" />
        <ZxIcon icon="Download" :size="24" tooltip="下载文件" tooltip-placement="bottom" />
        <ZxIcon icon="Share" :size="24" tooltip="分享" tooltip-trigger="click" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Popover 功能</h3>
      <div class="icon-row">
        <ZxIcon
          icon="QuestionFilled"
          :size="24"
          popover-title="帮助信息"
          tooltip="这是一个帮助按钮"
        />
        <ZxIcon icon="Setting" :size="24" popover-title="设置选项" tooltip-trigger="click">
          <template #popoverContent>
            <div style="padding: 10px">
              <p>这里是详细的设置说明</p>
              <el-button size="small" type="primary">确认</el-button>
            </div>
          </template>
        </ZxIcon>
        <ZxIcon
          icon="InfoFilled"
          :size="24"
          popover-title="详细信息"
          tooltip="点击查看详情"
          tooltip-trigger="click"
          tooltip-placement="left"
        >
          <template #popoverContent>
            <div>
              <p><strong>版本:</strong> 1.0.0</p>
              <p><strong>作者:</strong> ZX Team</p>
              <p><strong>更新时间:</strong> 2024-01-01</p>
            </div>
          </template>
        </ZxIcon>
      </div>
    </div>

    <div class="demo-section">
      <h3>优化的 Popover 交互</h3>
      <p style="margin-bottom: 20px; color: #666">鼠标可以移动到 popover 内容区域进行复制等操作</p>
      <div class="icon-row">
        <ZxIcon
          icon="CopyDocument"
          :size="24"
          popover-title="可复制内容"
          tooltip="悬停查看可复制的内容"
        >
          <template #popoverContent>
            <div style="max-width: 300px; padding: 10px">
              <p><strong>API Key:</strong></p>
              <code
                style="
                  display: block;
                  padding: 4px 8px;
                  margin: 8px 0;
                  background: #f5f5f5;
                  border-radius: 4px;
                  user-select: all;
                "
              >
                sk-1234567890abcdef1234567890abcdef
              </code>
              <p style="font-size: 12px; color: #666">鼠标移动到此区域可以选择和复制内容</p>
            </div>
          </template>
        </ZxIcon>
        <ZxIcon
          icon="Document"
          :size="24"
          popover-title="持久化 Popover"
          tooltip="点击查看持久化内容"
          tooltip-trigger="click"
          :popover-persistent="true"
        >
          <template #popoverContent>
            <div style="max-width: 250px; padding: 15px">
              <p><strong>持久化模式</strong></p>
              <p>这个 popover 需要点击外部区域才会关闭，方便进行复制操作。</p>
              <div style="padding: 8px; margin-top: 10px; background: #f0f9ff; border-radius: 4px">
                <code style="font-size: 12px; user-select: all"> 这段文字可以被选中和复制 </code>
              </div>
            </div>
          </template>
        </ZxIcon>
      </div>
    </div>

    <div class="demo-section">
      <h3>禁用状态</h3>
      <div class="icon-row">
        <ZxIcon icon="Edit" :size="24" disabled tooltip="当前不可编辑" />
        <ZxIcon icon="Delete" :size="24" disabled color="#F56C6C" />
        <ZxIcon icon="Plus" :size="24" disabled hover-color="#67C23A" />
      </div>
    </div>

    <div class="demo-section">
      <h3>跟随系统主题</h3>
      <p style="margin-bottom: 20px; color: #666"
        >不设置 color 属性时，图标会自动跟随 Element Plus 主题色</p
      >
      <div class="icon-row">
        <ZxIcon icon="User" :size="24" />
        <ZxIcon icon="Home" :size="24" />
        <ZxIcon icon="Document" :size="24" />
        <ZxIcon icon="Setting" :size="24" hover-color="var(--el-color-primary)" />
      </div>
    </div>

    <div class="demo-section">
      <h3>事件处理</h3>
      <div class="icon-row">
        <ZxIcon
          icon="Plus"
          :size="24"
          tooltip="点击添加"
          @click="handleAdd"
          style="cursor: pointer"
        />
        <ZxIcon
          icon="Refresh"
          :size="24"
          tooltip="点击刷新"
          @click="handleRefresh"
          style="cursor: pointer"
        />
        <ZxIcon
          icon="Bell"
          :size="24"
          tooltip="通知"
          @click="handleNotification"
          style="cursor: pointer"
        />
      </div>
      <p style="margin-top: 10px; color: #666">点击图标查看控制台输出</p>
    </div>

    <div class="demo-section">
      <h3>Element Plus 常用图标</h3>
      <div class="icon-grid">
        <div class="icon-item" v-for="iconName in commonIcons" :key="iconName">
          <ZxIcon :icon="iconName" :size="24" />
          <span>{{ iconName }}</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>iconfont 图标演示</h3>
      <p style="margin-bottom: 20px; color: #666">使用 type="iconfont" 来显示 iconfont 图标</p>

      <div class="demo-section">
        <h4>基础用法</h4>
        <div class="icon-row">
          <ZxIcon type="iconfont" icon="icon_environment" :size="20" />
          <ZxIcon type="iconfont" icon="icon_task_center" :size="24" color="#409EFF" />
          <ZxIcon type="iconfont" icon="icon_file_ms" :size="28" color="#F56C6C" />
          <ZxIcon type="iconfont" icon="icon_download" :size="32" color="#67C23A" />
        </div>
      </div>

      <div class="demo-section">
        <h4>悬停效果</h4>
        <div class="icon-row">
          <ZxIcon
            type="iconfont"
            icon="icon_environment"
            :size="32"
            color="#909399"
            hover-color="#F56C6C"
          />
          <ZxIcon
            type="iconfont"
            icon="icon_task_center"
            :size="32"
            color="#909399"
            hover-color="#E6A23C"
          />
          <ZxIcon
            type="iconfont"
            icon="icon_download"
            :size="32"
            color="#909399"
            hover-color="#409EFF"
          />
        </div>
      </div>

      <div class="demo-section">
        <h4>常用 iconfont 图标</h4>
        <div class="icon-grid">
          <div class="icon-item" v-for="iconName in iconfontIcons" :key="iconName">
            <ZxIcon type="iconfont" :icon="iconName" :size="24" />
            <span>{{ iconName }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>SVG 图标演示</h3>
      <p style="margin-bottom: 20px; color: #666">使用 svg-icon: 前缀来显示本地 SVG 图标</p>

      <div class="demo-section">
        <h4>基础用法</h4>
        <div class="icon-row">
          <ZxIcon icon="svg-icon:barchart" :size="20" />
          <ZxIcon icon="svg-icon:home" :size="24" color="#409EFF" />
          <ZxIcon icon="svg-icon:setting" :size="28" color="#F56C6C" />
          <ZxIcon icon="svg-icon:heart" :size="32" color="#67C23A" />
        </div>
      </div>

      <div class="demo-section">
        <h4>不同尺寸</h4>
        <div class="icon-row">
          <ZxIcon icon="svg-icon:star" :size="16" />
          <ZxIcon icon="svg-icon:star" :size="20" />
          <ZxIcon icon="svg-icon:star" :size="24" />
          <ZxIcon icon="svg-icon:star" :size="32" />
          <ZxIcon icon="svg-icon:star" :size="40" />
        </div>
      </div>

      <div class="demo-section">
        <h4>悬停效果</h4>
        <div class="icon-row">
          <ZxIcon icon="svg-icon:heart" :size="32" color="#909399" hover-color="#F56C6C" />
          <ZxIcon icon="svg-icon:star" :size="32" color="#909399" hover-color="#E6A23C" />
          <ZxIcon icon="svg-icon:user" :size="32" color="#909399" hover-color="#409EFF" />
        </div>
      </div>

      <div class="demo-section">
        <h4>Tooltip 功能</h4>
        <div class="icon-row">
          <ZxIcon icon="svg-icon:edit" :size="24" tooltip="编辑" />
          <ZxIcon icon="svg-icon:delete" :size="24" tooltip="删除" color="#F56C6C" />
          <ZxIcon icon="svg-icon:search" :size="24" tooltip="搜索" tooltip-placement="bottom" />
          <ZxIcon icon="svg-icon:setting" :size="24" tooltip="设置" tooltip-trigger="click" />
        </div>
      </div>

      <div class="demo-section">
        <h4>禁用状态</h4>
        <div class="icon-row">
          <ZxIcon icon="svg-icon:edit" :size="24" disabled tooltip="当前不可编辑" />
          <ZxIcon icon="svg-icon:delete" :size="24" disabled color="#F56C6C" />
          <ZxIcon icon="svg-icon:heart" :size="24" disabled hover-color="#67C23A" />
        </div>
      </div>

      <div class="demo-section">
        <h4>常用 SVG 图标</h4>
        <div class="icon-grid">
          <div class="icon-item" v-for="iconName in svgIcons" :key="iconName">
            <ZxIcon :icon="`svg-icon:${iconName}`" :size="24" />
            <span>{{ iconName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconDemo',
  data() {
    return {
      // Element Plus 常用图标
      commonIcons: [
        'Search',
        'Edit',
        'Delete',
        'Plus',
        'Minus',
        'Star',
        'StarFilled',
        'Like',
        'Share',
        'Download',
        'Upload',
        'Setting',
        'User',
        'Home',
        'Document',
        'Folder',
        'FolderOpened',
        'Picture',
        'VideoCamera',
        'Headset',
        'Phone',
        'Message',
        'ChatDotRound',
        'Bell',
        'Warning',
        'InfoFilled',
        'SuccessFilled',
        'CircleClose',
        'Check',
        'Close',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Refresh',
        'More',
        'MoreFilled',
        'Grid',
        'Menu',
        'List'
      ],
      // iconfont 常用图标
      iconfontIcons: [
        'icon_environment',
        'icon_task_center',
        'icon_file_ms',
        'icon_download',
        'icon_upload',
        'icon_setting',
        'icon_user',
        'icon_home',
        'icon_search',
        'icon_edit',
        'icon_delete',
        'icon_add',
        'icon_minus',
        'icon_star',
        'icon_like',
        'icon_share',
        'icon_folder',
        'icon_document',
        'icon_picture',
        'icon_video',
        'icon_music',
        'icon_phone',
        'icon_message',
        'icon_bell',
        'icon_warning',
        'icon_info',
        'icon_success',
        'icon_error',
        'icon_close',
        'icon_check',
        'icon_arrow_left',
        'icon_arrow_right',
        'icon_arrow_up',
        'icon_arrow_down',
        'icon_refresh',
        'icon_more',
        'icon_grid',
        'icon_menu',
        'icon_list',
        'icon_calendar',
        'icon_clock',
        'icon_location',
        'icon_lock',
        'icon_unlock',
        'icon_eye',
        'icon_eye_close',
        'icon_copy',
        'icon_cut',
        'icon_paste',
        'icon_save',
        'icon_print',
        'icon_export',
        'icon_import'
      ],
      // SVG 常用图标
      svgIcons: ['user', 'home', 'setting', 'heart', 'star', 'barchart', 'search', 'edit', 'delete']
    }
  },
  methods: {
    handleAdd() {
      console.log('添加操作被触发')
      this.$message?.success('添加操作')
    },
    handleRefresh() {
      console.log('刷新操作被触发')
      this.$message?.info('刷新操作')
    },
    handleNotification() {
      console.log('通知操作被触发')
      this.$message?.warning('新通知')
    }
  }
}
</script>

<style lang="scss" scoped>
.zx-icon-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .icon-item {
    background-color: red;
  }

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

  h4 {
    color: #606266;
    margin: 15px 0 10px;
    font-size: 16px;
    font-weight: 500;
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

  .icon-row {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    background-color: red;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      transform: translateY(-2px);
    }

    span {
      margin-top: 8px;
      font-size: 12px;
      color: #606266;
      text-align: center;
      word-break: break-all;
      line-height: 1.2;
    }
  }
}
</style>
