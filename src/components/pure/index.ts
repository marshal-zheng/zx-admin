// Pure 组件统一导出
import ZxPureRouterView from './ZxPureRouterView'
import ZxSelect from './ZxSelect'
import ZxTooltipOrPopover from './ZxTooltipOrPopover'
import ZxSearch from './ZxSearch'
import ZxIcon from './ZxIcon'
import ZxEmpty from './ZxEmpty'
import ZxGridList from './ZxGridList'
import ZxList from './ZxList'
import ZXExportDrawer from './ZxExportDrawer'
import ZxSplitBox from './ZxSplitBox'
import ZxButton from './ZxButton'
import ZxDialog from './ZxDialog'
import ZxConfirmInput from './ZxConfirmInput'
import ZxFloatingPanel from './ZxFloatingPanel'
import ZxDrawer from './ZxDrawer'
import ZxExpandToggle from './ZxExpandToggle'
import ZxInput from './ZxInput'
import ZxUpload from './ZxUpload'

// 所有组件列表
const components = [
  ZxPureRouterView,
  ZxSelect,
  ZxTooltipOrPopover,
  ZxSearch,
  ZxIcon,
  ZxEmpty,
  ZxGridList,
  ZxList,
  ZXExportDrawer,
  ZxSplitBox,
  ZxButton,
  ZxDialog,
  ZxConfirmInput,
  ZxFloatingPanel,
  ZxDrawer,
  ZxExpandToggle,
  ZxInput,
  ZxUpload
]

// 统一的全局注册方法
const install = function (app) {
  components.forEach((component) => {
    if (component.install) {
      component.install(app)
    } else {
      app.component(component.name || component.__name, component)
    }
  })
}

// 导出所有组件
export {
  ZxPureRouterView,
  ZxSelect,
  ZxTooltipOrPopover,
  ZxSearch,
  ZxIcon,
  ZxEmpty,
  ZxGridList,
  ZxList,
  ZXExportDrawer,
  ZxSplitBox,
  ZxButton,
  ZxDialog,
  ZxConfirmInput,
  ZxFloatingPanel,
  ZxDrawer,
  ZxExpandToggle,
  ZxInput,
  ZxUpload,
  install
}

// 默认导出包含install方法的对象
export default {
  ZxPureRouterView,
  ZxSelect,
  ZxTooltipOrPopover,
  ZxSearch,
  ZxIcon,
  ZxEmpty,
  ZxGridList,
  ZxList,
  ZXExportDrawer,
  ZxSplitBox,
  ZxButton,
  ZxDialog,
  ZxConfirmInput,
  ZxFloatingPanel,
  ZxDrawer,
  ZxExpandToggle,
  ZxUpload,
  install
}
