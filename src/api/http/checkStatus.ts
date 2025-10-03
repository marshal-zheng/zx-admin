/**
 * HTTP状态码检查和错误处理
 * 适配Element Plus消息组件
 */
// import { useRouter } from 'vue-router' // 暂时未使用
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 检查HTTP状态码并处理错误
 * @param {number} status - HTTP状态码
 * @param {string} msg - 错误消息
 * @param {number} code - 业务错误码
 * @param {string} errorMessageMode - 错误消息显示模式
 */
export default function checkStatus(
  status,
  msg,
  _code,
  errorMessageMode = 'message',
  showErrorMessage = true
) {
  // const router = useRouter()
  let errMessage = ''

  console.log('status', status)

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    case 401: {
      // 未授权，清除token并跳转登录
      localStorage.removeItem('token')
      ElMessage.error('登录已过期，请重新登录')
      // 可以在这里添加路由跳转到登录页
      // router.push('/login')
      return // 401 状态码不显示错误消息
    }
    case 403:
      errMessage = msg || '禁止访问'
      // 可以跳转到无权限页面
      // router.push('/403')
      break
    case 404:
      errMessage = msg || '请求的资源不存在'
      break
    case 405:
      errMessage = msg || '请求方法不被允许'
      break
    case 408:
      errMessage = msg || '请求超时'
      break
    case 500:
      errMessage = msg || '服务器内部错误'
      break
    case 501:
      errMessage = msg || '服务未实现'
      break
    case 502:
      errMessage = msg || '网关错误'
      break
    case 503:
      errMessage = msg || '服务不可用'
      break
    case 504:
      errMessage = msg || '网关超时'
      break
    case 505:
      errMessage = msg || 'HTTP版本不受支持'
      break
    default:
      errMessage = msg || `连接错误 ${status}`
  }

  if (errMessage && showErrorMessage) {
    if (errorMessageMode === 'modal') {
      ElMessageBox.alert(errMessage, '错误', {
        type: 'error'
      })
    } else if (errorMessageMode === 'message') {
      ElMessage.error(errMessage)
    }
  }
}
