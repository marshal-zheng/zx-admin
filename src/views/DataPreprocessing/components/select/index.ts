import { withInstall } from '@zxui/utils'
import SelectComponent from './src/select.vue'

import type { SFCWithInstall } from '@zxui/utils'

export const ZxSelect: SFCWithInstall<typeof SelectComponent> =
  withInstall(SelectComponent)
export default ZxSelect

export * from './src/select'
export type { ZxSelectInstance } from './src/instance'
