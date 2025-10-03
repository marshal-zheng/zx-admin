import { ref, Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

/**
 * Composable for form validation logic
 */
export function useFormValidation() {
  const formRef = ref<FormInstance>()
  const validationErrors = ref<Record<string, string>>({})

  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return true

    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }

  const validateField = async (prop: string): Promise<boolean> => {
    if (!formRef.value) return true

    try {
      await formRef.value.validateField(prop)
      return true
    } catch (error) {
      return false
    }
  }

  const clearValidate = (props?: string | string[]) => {
    formRef.value?.clearValidate(props)
  }

  const resetFields = () => {
    formRef.value?.resetFields()
  }

  return {
    formRef,
    validationErrors,
    validate,
    validateField,
    clearValidate,
    resetFields
  }
}
