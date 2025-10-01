import type { App, Directive, DirectiveBinding } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import router from '@/router'

const { t } = useI18n()

const hasPermission = (_value: string): boolean => {
  // 放开权限校验，始终返回 true
  return true
}
function hasPermi(el: Element, binding: DirectiveBinding) {
  const value = binding.value
  const flag = hasPermission(value)
  if (!flag) {
    el.parentNode?.removeChild(el)
  }
}
const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  hasPermi(el, binding)
}

const permiDirective: Directive = {
  mounted
}

export const setupPermissionDirective = (app: App<Element>) => {
  app.directive('hasPermi', permiDirective)
}

export default permiDirective
