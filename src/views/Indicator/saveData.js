// 指标体系管理数据保存工具
import { indicatorSystemApi } from './mock.js'

/**
 * 指标体系数据保存工具类
 */
export class IndicatorSystemDataSaver {
  constructor() {
    this.storageKey = 'indicator_system_data'
  }

  /**
   * 保存指标体系数据到本地存储
   * @param {Object} data - 指标体系数据
   * @returns {Promise<boolean>} 保存结果
   */
  async saveToLocal(data) {
    try {
      const existingData = this.getLocalData()
      const updatedData = [...existingData, { ...data, id: this.generateId() }]
      localStorage.setItem(this.storageKey, JSON.stringify(updatedData))
      return true
    } catch (error) {
      console.error('保存到本地存储失败:', error)
      return false
    }
  }

  /**
   * 从本地存储获取指标体系数据
   * @returns {Array} 指标体系数据数组
   */
  getLocalData() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('从本地存储读取数据失败:', error)
      return []
    }
  }

  /**
   * 清空本地存储的指标体系数据
   */
  clearLocalData() {
    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch (error) {
      console.error('清空本地存储失败:', error)
      return false
    }
  }

  /**
   * 同步本地数据到服务器
   * @returns {Promise<Object>} 同步结果
   */
  async syncToServer() {
    try {
      const localData = this.getLocalData()
      const results = []

      for (const item of localData) {
        const result = await indicatorSystemApi.create(item)
        results.push({
          item,
          success: result.success,
          message: result.message
        })
      }

      return {
        success: true,
        data: results,
        message: '同步完成'
      }
    } catch (error) {
      console.error('同步到服务器失败:', error)
      return {
        success: false,
        message: '同步失败'
      }
    }
  }

  /**
   * 导出指标体系数据为JSON
   * @param {Array} data - 要导出的数据
   * @returns {string} JSON字符串
   */
  exportToJSON(data) {
    try {
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('导出JSON失败:', error)
      return null
    }
  }

  /**
   * 从JSON导入指标体系数据
   * @param {string} jsonString - JSON字符串
   * @returns {Array|null} 解析后的数据数组
   */
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      return Array.isArray(data) ? data : null
    } catch (error) {
      console.error('从JSON导入失败:', error)
      return null
    }
  }

  /**
   * 验证指标体系数据格式
   * @param {Object} data - 要验证的数据
   * @returns {Object} 验证结果
   */
  validateData(data) {
    const errors = []

    if (!data.name || typeof data.name !== 'string') {
      errors.push('指标体系名称不能为空')
    }

    if (!data.category || typeof data.category !== 'string') {
      errors.push('所属分类不能为空')
    }

    if (data.description && typeof data.description !== 'string') {
      errors.push('描述必须是字符串类型')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * 生成唯一ID
   * @returns {string} 生成的ID
   */
  generateId() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `IS${timestamp}${random}`
  }

  /**
   * 批量保存指标体系数据
   * @param {Array} dataList - 指标体系数据数组
   * @returns {Promise<Object>} 保存结果
   */
  async batchSave(dataList) {
    if (!Array.isArray(dataList)) {
      return {
        success: false,
        message: '数据格式错误，必须是数组'
      }
    }

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const data of dataList) {
      const validation = this.validateData(data)
      if (!validation.valid) {
        results.push({
          data,
          success: false,
          message: validation.errors.join(', ')
        })
        errorCount++
        continue
      }

      try {
        const result = await indicatorSystemApi.create(data)
        results.push({
          data,
          success: result.success,
          message: result.message
        })

        if (result.success) {
          successCount++
        } else {
          errorCount++
        }
      } catch (error) {
        results.push({
          data,
          success: false,
          message: error.message || '保存失败'
        })
        errorCount++
      }
    }

    return {
      success: errorCount === 0,
      data: results,
      message: `批量保存完成：成功 ${successCount} 条，失败 ${errorCount} 条`
    }
  }
}

// 创建实例
export const indicatorSystemDataSaver = new IndicatorSystemDataSaver()

// 默认导出
export default indicatorSystemDataSaver
