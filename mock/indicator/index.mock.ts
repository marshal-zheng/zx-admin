// 指标体系相关 mock 接口
// 导出为数组，便于在 index.js 中统一聚合
import { SUCCESS_CODE } from '@/constants'
import { fireAccidentGraphData } from './graph.mock'

export default [
  // ========== 算子管理接口 ==========
  // 获取算子列表
  {
    url: '/api/zhpgxt/zhpgOperator',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟算子数据
      const allOperators = [
        {
          id: '1',
          operatorName: '数据清洗算子',
          operatorDesc: '用于清洗和预处理原始数据，去除噪声和异常值',
          operatorType: 1,
          algorithmType: 'Java',
          algorithmUrl: 'http://example.com/algorithm/data-clean',
          createTime: '2024-01-15 10:30:00',
          zhpgOperatorPars: [
            {
              id: '1-out-1',
              operatorNamePar: '清洗后数据',
              operatorDescPar: '经过清洗处理的数据集',
              operatorId: '1',
              parType: 1
            }
          ],
          zhpgOperatorParsInput: [
            {
              id: '1-in-1',
              operatorNamePar: '原始数据',
              operatorDescPar: '待清洗的原始数据集',
              operatorId: '1',
              parType: 2
            }
          ]
        },
        {
          id: '2',
          operatorName: '统计分析算子',
          operatorDesc: '对数据进行统计分析，包括均值、方差、分布等计算',
          operatorType: 2,
          algorithmType: 'Python',
          algorithmUrl: 'http://example.com/algorithm/statistics',
          createTime: '2024-01-16 14:20:00',
          zhpgOperatorPars: [
            {
              id: '2-out-1',
              operatorNamePar: '统计结果',
              operatorDescPar: '包含各种统计指标的分析结果',
              operatorId: '2',
              parType: 1
            }
          ],
          zhpgOperatorParsInput: [
            {
              id: '2-in-1',
              operatorNamePar: '数据集',
              operatorDescPar: '需要进行统计分析的数据集',
              operatorId: '2',
              parType: 2
            }
          ]
        },
        {
          id: '3',
          operatorName: '机器学习模型',
          operatorDesc: '基于神经网络的深度学习模型，用于复杂模式识别',
          operatorType: 3,
          algorithmType: 'Python',
          algorithmUrl: 'http://example.com/algorithm/ml-model',
          createTime: '2024-01-17 09:15:00',
          zhpgOperatorPars: [
            {
              id: '3-out-1',
              operatorNamePar: '预测结果',
              operatorDescPar: '模型预测的结果数据',
              operatorId: '3',
              parType: 1
            },
            {
              id: '3-out-2',
              operatorNamePar: '置信度',
              operatorDescPar: '预测结果的置信度分数',
              operatorId: '3',
              parType: 1
            }
          ],
          zhpgOperatorParsInput: [
            {
              id: '3-in-1',
              operatorNamePar: '训练数据',
              operatorDescPar: '用于模型训练的数据集',
              operatorId: '3',
              parType: 2
            },
            {
              id: '3-in-2',
              operatorNamePar: '测试数据',
              operatorDescPar: '用于模型测试的数据集',
              operatorId: '3',
              parType: 2
            }
          ]
        },
        {
          id: '4',
          operatorName: '报告生成器',
          operatorDesc: '将分析结果生成可视化报告和图表',
          operatorType: 4,
          algorithmType: 'Java',
          algorithmUrl: 'http://example.com/algorithm/report-gen',
          createTime: '2024-01-18 16:45:00',
          zhpgOperatorPars: [
            {
              id: '4-out-1',
              operatorNamePar: '分析报告',
              operatorDescPar: '包含图表和说明的完整报告',
              operatorId: '4',
              parType: 1
            }
          ],
          zhpgOperatorParsInput: [
            {
              id: '4-in-1',
              operatorNamePar: '分析数据',
              operatorDescPar: '需要生成报告的分析数据',
              operatorId: '4',
              parType: 2
            }
          ]
        },
        {
          id: '5',
          operatorName: '数据转换器',
          operatorDesc: '在不同数据格式之间进行转换和适配',
          operatorType: 1,
          algorithmType: 'Java',
          algorithmUrl: 'http://example.com/algorithm/data-transform',
          createTime: '2024-01-19 11:30:00',
          zhpgOperatorPars: [
            {
              id: '5-out-1',
              operatorNamePar: '转换后数据',
              operatorDescPar: '格式转换后的数据',
              operatorId: '5',
              parType: 1
            }
          ],
          zhpgOperatorParsInput: [
            {
              id: '5-in-1',
              operatorNamePar: '源数据',
              operatorDescPar: '需要转换格式的原始数据',
              operatorId: '5',
              parType: 2
            }
          ]
        }
      ]

      // 根据关键词过滤
      let filteredOperators = allOperators
      if (keyword) {
        filteredOperators = allOperators.filter(
          (item) => item.operatorName.includes(keyword) || item.operatorDesc.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredOperators.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredOperators.slice(start, end)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages: Math.ceil(total / pageSize)
        }
      }
    }
  },

  // 创建算子
  {
    url: '/api/zhpgxt/zhpgOperator',
    method: 'post',
    response: ({ body }) => {
      return {
        code: SUCCESS_CODE,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 更新算子
  {
    url: '/api/zhpgxt/zhpgOperator/:id',
    method: 'put',
    response: ({ params, body }) => {
      return {
        code: SUCCESS_CODE,
        message: '更新成功',
        data: {
          id: params?.id,
          ...body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除算子
  {
    url: '/api/zhpgxt/zhpgOperator/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取算子详情
  {
    url: '/api/zhpgxt/zhpgOperator/:id',
    method: 'get',
    response: ({ params }) => {
      const mockOperator = {
        id: params?.id,
        operatorName: '数据清洗算子',
        operatorDesc: '用于清洗和预处理原始数据，去除噪声和异常值',
        operatorType: 1,
        algorithmType: 'Java',
        algorithmUrl: 'http://example.com/algorithm/data-clean',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 14:20:00',
        zhpgOperatorPars: [
          {
            id: '1-out-1',
            operatorNamePar: '清洗后数据',
            operatorDescPar: '经过清洗处理的数据集',
            operatorId: params?.id,
            parType: 1
          }
        ],
        zhpgOperatorParsInput: [
          {
            id: '1-in-1',
            operatorNamePar: '原始数据',
            operatorDescPar: '待清洗的原始数据集',
            operatorId: params?.id,
            parType: 2
          }
        ]
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: mockOperator
      }
    }
  },

  // ========== 计算模型管理接口 ==========
  // 获取计算模型列表
  {
    url: '/api/zhpgxt/zhpgOperatorModel',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟计算模型数据
      const allModels = [
        {
          id: '1',
          oprModelName: '线性回归模型',
          oprModelDesc:
            '用于预测连续数值的线性回归算法，适用于简单的预测场景，具有良好的解释性和快速的训练速度',
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          oprModelName: '决策树模型',
          oprModelDesc:
            '基于树形结构的分类和回归算法，能够处理非线性关系，具有良好的可解释性，适合特征选择和规则提取',
          createTime: '2024-01-16 14:20:00'
        },
        {
          id: '3',
          oprModelName: '随机森林模型',
          oprModelDesc:
            '集成学习算法，通过构建多个决策树并投票决定最终结果，具有较高的准确性和鲁棒性，能有效防止过拟合',
          createTime: '2024-01-17 09:15:00'
        },
        {
          id: '4',
          oprModelName: '支持向量机模型',
          oprModelDesc:
            '基于最大边界原理的分类算法，通过核函数处理非线性问题，在高维数据和小样本情况下表现优异',
          createTime: '2024-01-18 16:45:00'
        },
        {
          id: '5',
          oprModelName: '神经网络模型',
          oprModelDesc:
            '深度学习算法，通过多层神经元模拟人脑处理信息的方式，能够学习复杂的非线性模式，适用于图像、文本等复杂数据',
          createTime: '2024-01-19 11:30:00'
        },
        {
          id: '6',
          oprModelName: '朴素贝叶斯模型',
          oprModelDesc:
            '基于贝叶斯定理的概率分类算法，假设特征间相互独立，计算简单高效，特别适用于文本分类和垃圾邮件过滤',
          createTime: '2024-01-20 08:45:00'
        },
        {
          id: '7',
          oprModelName: 'K-均值聚类模型',
          oprModelDesc:
            '无监督学习算法，将数据分为K个簇，使簇内数据相似度最高，簇间差异最大，适用于市场细分和客户分群',
          createTime: '2024-01-21 13:20:00'
        },
        {
          id: '8',
          oprModelName: '时间序列预测模型',
          oprModelDesc:
            'ARIMA等时间序列分析方法，专门处理时序数据的趋势、季节性和周期性，适用于销售预测和股价分析',
          createTime: '2024-01-22 15:10:00'
        },
        {
          id: '9',
          oprModelName: '关联规则挖掘模型',
          oprModelDesc:
            'Apriori等关联分析算法，发现数据项之间的关联关系，常用于购物篮分析和推荐系统',
          createTime: '2024-01-23 09:30:00'
        },
        {
          id: '10',
          oprModelName: 'XGBoost梯度提升模型',
          oprModelDesc:
            '优化的梯度提升算法，具有高效的并行处理能力和优异的预测性能，在各种机器学习竞赛中表现突出',
          createTime: '2024-01-24 12:15:00'
        }
      ]

      // 根据关键词过滤
      let filteredModels = allModels
      if (keyword) {
        filteredModels = allModels.filter(
          (item) => item.oprModelName.includes(keyword) || item.oprModelDesc.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredModels.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredModels.slice(start, end)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages: Math.ceil(total / pageSize)
        }
      }
    }
  },

  // 创建计算模型
  {
    url: '/api/zhpgxt/zhpgOperatorModel',
    method: 'post',
    response: ({ body }) => {
      return {
        code: SUCCESS_CODE,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 更新计算模型
  {
    url: '/api/zhpgxt/zhpgOperatorModel/:id',
    method: 'put',
    response: ({ params, body }) => {
      return {
        code: SUCCESS_CODE,
        message: '更新成功',
        data: {
          id: params?.id,
          ...body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除计算模型
  {
    url: '/api/zhpgxt/zhpgOperatorModel/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取计算模型详情
  {
    url: '/api/zhpgxt/zhpgOperatorModel/:id',
    method: 'get',
    response: ({ params }) => {
      const mockModel = {
        id: params?.id,
        oprModelName: '线性回归模型',
        oprModelDesc:
          '用于预测连续数值的线性回归算法，适用于简单的预测场景，具有良好的解释性和快速的训练速度',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 14:20:00'
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: mockModel
      }
    }
  },

  // ========== 分类管理接口 ==========
  // 获取分类列表
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟分类数据
      const allCategories = [
        {
          id: '1',
          clazzName: '综合评估分类',
          clazzDescr: '用于综合性评估的指标分类，涵盖多个维度的评估指标',
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          clazzName: '性能评估分类',
          clazzDescr: '专注于系统性能评估的指标分类，包括响应时间、吞吐量等',
          createTime: '2024-01-16 14:20:00'
        },
        {
          id: '3',
          clazzName: '安全评估分类',
          clazzDescr: '安全相关的评估指标分类，涵盖安全漏洞、威胁检测等',
          createTime: '2024-01-17 09:15:00'
        },
        {
          id: '4',
          clazzName: '质量评估分类',
          clazzDescr: '软件质量评估相关的指标分类，包括代码质量、测试覆盖率等',
          createTime: '2024-01-18 16:45:00'
        },
        {
          id: '5',
          clazzName: '用户体验分类',
          clazzDescr: '用户体验相关的评估指标分类，关注用户满意度和操作便捷性',
          createTime: '2024-01-19 11:30:00'
        }
      ]

      // 根据关键词过滤
      let filteredCategories = allCategories
      if (keyword) {
        filteredCategories = allCategories.filter(
          (item) => item.clazzName.includes(keyword) || item.clazzDescr.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredCategories.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredCategories.slice(start, end)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages: Math.ceil(total / pageSize)
        }
      }
    }
  },

  // 创建分类
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz',
    method: 'post',
    response: ({ body }) => {
      return {
        code: SUCCESS_CODE,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 更新分类
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz/:id',
    method: 'put',
    response: ({ params, body }) => {
      return {
        code: SUCCESS_CODE,
        message: '更新成功',
        data: {
          id: params?.id,
          ...body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除分类
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功'
      }
    }
  },

  // 获取单个分类详情
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemClazz/:id',
    method: 'get',
    response: ({ params }) => {
      // 根据ID返回对应的分类数据
      const allCategories = {
        '1': {
          id: '1',
          clazzName: '综合评估分类',
          clazzDescr: '用于综合性评估的指标分类，涵盖多个维度的评估指标',
          createTime: '2024-01-15 10:30:00',
          updateTime: '2024-01-15 14:20:00'
        },
        '2': {
          id: '2',
          clazzName: '性能评估分类',
          clazzDescr: '专注于系统性能评估的指标分类，包括响应时间、吞吐量等',
          createTime: '2024-01-16 14:20:00',
          updateTime: '2024-01-16 16:30:00'
        },
        '3': {
          id: '3',
          clazzName: '安全评估分类',
          clazzDescr: '安全相关的评估指标分类，涵盖安全漏洞、威胁检测等',
          createTime: '2024-01-17 09:15:00',
          updateTime: '2024-01-17 11:25:00'
        },
        '4': {
          id: '4',
          clazzName: '质量评估分类',
          clazzDescr: '软件质量评估相关的指标分类，包括代码质量、测试覆盖率等',
          createTime: '2024-01-18 16:45:00',
          updateTime: '2024-01-18 18:50:00'
        },
        '5': {
          id: '5',
          clazzName: '用户体验分类',
          clazzDescr: '用户体验相关的评估指标分类，关注用户满意度和操作便捷性',
          createTime: '2024-01-19 11:30:00',
          updateTime: '2024-01-19 13:40:00'
        }
      }
      console.log('params', params)

      // 保护性获取参数，避免 params 未定义导致报错
      const idParam = params?.id ? String(params?.id) : '1'

      const mockCategory = allCategories[idParam] || {
        id: idParam,
        clazzName: '默认分类',
        clazzDescr: '默认分类描述',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 14:20:00'
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: mockCategory
      }
    }
  },

  // ========== 模版管理接口 ==========
  // 获取模版列表
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '' } = query

      // 模拟模版数据
      const allTemplates = [
        {
          evaluaId: '1',
          evaluaName: '综合评估模版',
          evaluaExpplain: '用于综合性评估的指标体系模版，涵盖多个维度的评估指标',
          clazzId: '1',
          clazzName: '综合评估分类',
          createTime: '2024-01-15 10:30:00'
        },
        {
          evaluaId: '2',
          evaluaName: '性能评估模版',
          evaluaExpplain: '专注于系统性能评估的指标体系模版，包括响应时间、吞吐量等',
          clazzId: '2',
          clazzName: '性能评估分类',
          createTime: '2024-01-16 14:20:00'
        },
        {
          evaluaId: '3',
          evaluaName: '安全评估模版',
          evaluaExpplain: '安全相关的评估指标体系模版，涵盖安全漏洞、威胁检测等',
          clazzId: '3',
          clazzName: '安全评估分类',
          createTime: '2024-01-17 09:15:00'
        },
        {
          evaluaId: '4',
          evaluaName: '质量评估模版',
          evaluaExpplain: '软件质量评估相关的指标体系模版，包括代码质量、测试覆盖率等',
          clazzId: '4',
          clazzName: '质量评估分类',
          createTime: '2024-01-18 16:45:00'
        },
        {
          evaluaId: '5',
          evaluaName: '用户体验模版',
          evaluaExpplain: '用户体验相关的评估指标体系模版，关注用户满意度和操作便捷性',
          clazzId: '5',
          clazzName: '用户体验分类',
          createTime: '2024-01-19 11:30:00'
        }
      ]

      // 根据关键词过滤
      let filteredTemplates = allTemplates
      if (keyword) {
        filteredTemplates = allTemplates.filter(
          (item) => item.evaluaName.includes(keyword) || item.evaluaExpplain.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredTemplates.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredTemplates.slice(start, end)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages: Math.ceil(total / pageSize)
        }
      }
    }
  },

  // 创建模版
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate',
    method: 'post',
    response: ({ body }) => {
      return {
        code: SUCCESS_CODE,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 更新模版
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate/:id',
    method: 'put',
    response: ({ params, body }) => {
      return {
        code: SUCCESS_CODE,
        message: '更新成功',
        data: {
          id: params?.id,
          ...body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除模版
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取模版详情
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTemplate/:id',
    method: 'get',
    response: ({ params, query }) => {
      const templateId = params?.id ?? query?.id

      if (!templateId) {
        console.warn(
          '[mock] /api/zhpgxt/zhpgEvaluaSystemTemplate/:id 请求缺少路径参数 id',
          params,
          query
        )
        return {
          success: false,
          code: 400,
          msg: '缺少模版ID',
          data: null
        }
      }

      const id = String(templateId)

      // 模拟模版详情数据
      const templateDetail = {
        evaluaId: id,
        evaluaName: '综合评估模版',
        evaluaExpplain: '用于综合性评估的指标体系模版，涵盖多个维度的评估指标',
        clazzId: '1',
        clazzName: '综合评估分类',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-20 14:20:00'
      }

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: templateDetail
      }
    }
  },

  // ========== 体系管理接口 ==========
  // 获取体系列表
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword = '', categoryId = '', evaluaTemplate = '' } = query

      // 模拟体系数据 - 包含两条测试数据
      const allSystems = [
        {
          id: '1',
          categoryId: '1',
          categoryName: '综合评估分类',
          name: '油料库火灾损毁评估体系',
          description: '涵盖泄漏扩散、危害影响、应急响应、处置效果等多维度的综合评估体系',
          evaluaTemplate: 1,
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          categoryId: '2',
          categoryName: '安全评估分类',
          name: '化工厂安全风险评估体系',
          description: '针对化工厂生产过程中的安全风险进行全面评估，包括设备安全、人员安全、环境安全等方面',
          evaluaTemplate: 0,
          createTime: '2024-02-20 14:25:00'
        }
      ]

      // 根据分类过滤
      let filteredSystems = allSystems
      if (categoryId) {
        filteredSystems = filteredSystems.filter((item) => item.categoryId === categoryId)
      }

      // 按是否为模版过滤
      if (evaluaTemplate !== '') {
        const needTemplate = evaluaTemplate === 1 || evaluaTemplate === '1'
        filteredSystems = filteredSystems.filter(
          (item) => (item.evaluaTemplate === 1) === needTemplate
        )
      }

      // 根据关键词过滤
      if (keyword) {
        filteredSystems = filteredSystems.filter(
          (item) => item.name.includes(keyword) || item.description.includes(keyword)
        )
      }

      // 分页处理
      const total = filteredSystems.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const pageRecords = filteredSystems.slice(start, end)

      // 适配后端字段：evalua* 与 clazz*，同时保留旧字段以兼容旧页面
      const records = pageRecords.map((item) => ({
        // 新字段
        evaluaId: item.id,
        clazzId: item.categoryId,
        clazzName: item.categoryName,
        evaluaName: item.name,
        evaluaExpplain: item.description,
        evaluaTemplate: item.evaluaTemplate ?? 0,
        createTime: item.createTime,
        // 旧字段兼容
        id: item.id,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        name: item.name,
        description: item.description
      }))

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(pageSize),
          current: parseInt(page),
          pages: Math.ceil(total / pageSize)
        }
      }
    }
  },

  // 创建体系
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem',
    method: 'post',
    response: ({ body }) => {
      return {
        code: SUCCESS_CODE,
        message: '创建成功',
        data: {
          id: Date.now().toString(),
          ...body,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 获取体系详情
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem/:id',
    method: 'get',
    response: ({ params, query }) => {
      const systemId = params?.id ?? query?.id ?? '1'

      const id = String(systemId)

      // 模拟详细的体系数据，包含图数据
      const systemDetails = {
        '1': {
          evaluaId: '1',
          clazzId: '1',
          clazzName: '综合评估分类',
          evaluaName: '油料库火灾损毁评估体系',
          evaluaExpplain: '涵盖泄漏扩散、危害影响、应急响应、处置效果等多维度的综合评估体系',
          evaluaTemplate: 1,
          strings: '火灾事故,应急响应,损失评估',
          reEvaluaSystemTags: [
            { id: '1', tagName: '火灾事故' },
            { id: '2', tagName: '应急响应' },
            { id: '21', tagName: '损失评估' }
          ],
          createTime: '2024-01-15 10:30:00',
          detailContent: JSON.stringify(fireAccidentGraphData)
        },
        '2': {
          evaluaId: '2',
          clazzId: '2',
          clazzName: '性能评估分类',
          evaluaName: '系统性能评估体系',
          evaluaExpplain: '专注于系统响应时间、吞吐量、资源利用率等性能指标的评估体系',
          evaluaTemplate: 0,
          strings: '质量保证',
          reEvaluaSystemTags: [{ id: '3', tagName: '质量保证' }],
          createTime: '2024-01-16 14:20:00',
          detailContent: JSON.stringify({
            nodes: [
              {
                id: '2663477489012345678',
                type: 'root-node',
                x: 836,
                y: 120,
                properties: {
                  content: { id: '2663477489012345679', label: '系统性能评估' },
                  weight: 100,
                  otherData: {},
                  parentNodeId: null,
                  level: 1
                }
              }
            ],
            edges: []
          })
        }
      }

      const systemData = systemDetails[id] || {
        evaluaId: id,
        clazzId: '',
        clazzName: '',
        evaluaName: '未知体系',
        evaluaExpplain: '',
        evaluaTemplate: 0,
        strings: '',
        reEvaluaSystemTags: [],
        createTime: new Date().toLocaleString('zh-CN'),
        detailContent: JSON.stringify({ nodes: [], edges: [] })
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: systemData
      }
    }
  },

  // 更新体系
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem/:id',
    method: 'put',
    response: ({ params, body }) => {
      const isSetTemplate = body && (body.evaluaTemplate === 1 || body.evaluaTemplate === '1')
      if (isSetTemplate) {
        return {
          code: SUCCESS_CODE,
          message: '设为模版成功',
          data: {
            id: params?.id,
            evaluaTemplate: 1,
            updateTime: new Date().toLocaleString('zh-CN')
          }
        }
      }
      return {
        code: SUCCESS_CODE,
        message: '更新成功',
        data: {
          id: params?.id,
          ...body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除体系
  {
    url: '/api/zhpgxt/zhpgEvaluaSystem/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        code: SUCCESS_CODE,
        message: '删除成功',
        data: null
      }
    }
  },

  // 获取指标体系设计选项
  {
    url: '/api/indicator/system/options',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            label: '综合效能评估指标体系',
            value: 'comprehensive_performance_indicators',
            description: '涵盖系统性能、可靠性、安全性等多维度指标',
            indicatorCount: 25
          },
          {
            label: '安全风险评估指标体系',
            value: 'security_risk_indicators',
            description: '专注于安全漏洞、威胁检测、防护能力评估',
            indicatorCount: 18
          },
          {
            label: '性能效率评估指标体系',
            value: 'performance_efficiency_indicators',
            description: '重点评估系统响应时间、吞吐量、资源利用率',
            indicatorCount: 15
          },
          {
            label: '质量保证评估指标体系',
            value: 'quality_assurance_indicators',
            description: '评估软件质量、代码质量、测试覆盖率等',
            indicatorCount: 22
          },
          {
            label: '用户体验评估指标体系',
            value: 'user_experience_indicators',
            description: '关注用户满意度、界面友好性、操作便捷性',
            indicatorCount: 12
          },
          {
            label: '成本效益评估指标体系',
            value: 'cost_benefit_indicators',
            description: '分析投入产出比、运维成本、ROI等经济指标',
            indicatorCount: 10
          },
          {
            label: '可维护性评估指标体系',
            value: 'maintainability_indicators',
            description: '评估代码可读性、模块化程度、文档完整性',
            indicatorCount: 16
          },
          {
            label: '可扩展性评估指标体系',
            value: 'scalability_indicators',
            description: '评估系统扩展能力、负载承受能力、架构弹性',
            indicatorCount: 14
          }
        ]
      }
    }
  },

  // 根据ID获取指标体系详情
  {
    url: '/api/indicator/system/:id',
    method: 'get',
    response: ({ params }) => {
      const id = params?.id
      const systemDetails = {
        comprehensive_performance_indicators: {
          id: 'comprehensive_performance_indicators',
          name: '综合效能评估指标体系',
          description: '涵盖系统性能、可靠性、安全性等多维度指标',
          version: '2.1.0',
          createTime: '2024-01-10 09:30:00',
          updateTime: '2024-01-15 14:20:00',
          status: 'active',
          categories: [
            {
              name: '性能指标',
              indicators: ['响应时间', '吞吐量', 'CPU利用率', '内存使用率', '磁盘I/O']
            },
            {
              name: '可靠性指标',
              indicators: ['可用性', '故障恢复时间', '平均故障间隔时间', '数据完整性']
            },
            {
              name: '安全性指标',
              indicators: ['访问控制', '数据加密', '审计日志', '漏洞扫描结果']
            }
          ]
        },
        security_risk_indicators: {
          id: 'security_risk_indicators',
          name: '安全风险评估指标体系',
          description: '专注于安全漏洞、威胁检测、防护能力评估',
          version: '1.8.0',
          createTime: '2024-01-08 11:15:00',
          updateTime: '2024-01-12 16:45:00',
          status: 'active',
          categories: [
            {
              name: '威胁检测',
              indicators: ['恶意代码检测率', '异常行为识别', '入侵检测准确率']
            },
            {
              name: '防护能力',
              indicators: ['防火墙有效性', '访问控制强度', '数据加密级别']
            }
          ]
        }
      }

      const systemDetail =
        systemDetails[id] || systemDetails['comprehensive_performance_indicators']

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: systemDetail
      }
    }
  },

  // 获取指标体系列表
  {
    url: '/api/indicator/system/list',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page || query.pageNumber || query.current) || 1
      const size = parseInt(query.size || query.pageSize || query.limit) || 10

      const mockData = [
        {
          id: 'comprehensive_performance_indicators',
          name: '综合效能评估指标体系',
          description: '涵盖系统性能、可靠性、安全性等多维度指标',
          version: '2.1.0',
          status: 'active',
          indicatorCount: 25,
          createTime: '2024-01-10 09:30:00',
          updateTime: '2024-01-15 14:20:00'
        },
        {
          id: 'security_risk_indicators',
          name: '安全风险评估指标体系',
          description: '专注于安全漏洞、威胁检测、防护能力评估',
          version: '1.8.0',
          status: 'active',
          indicatorCount: 18,
          createTime: '2024-01-08 11:15:00',
          updateTime: '2024-01-12 16:45:00'
        },
        {
          id: 'performance_efficiency_indicators',
          name: '性能效率评估指标体系',
          description: '重点评估系统响应时间、吞吐量、资源利用率',
          version: '1.5.2',
          status: 'active',
          indicatorCount: 15,
          createTime: '2024-01-05 14:20:00',
          updateTime: '2024-01-10 10:30:00'
        },
        {
          id: 'quality_assurance_indicators',
          name: '质量保证评估指标体系',
          description: '评估软件质量、代码质量、测试覆盖率等',
          version: '2.0.1',
          status: 'draft',
          indicatorCount: 22,
          createTime: '2024-01-03 16:45:00',
          updateTime: '2024-01-08 09:15:00'
        },
        {
          id: 'user_experience_indicators',
          name: '用户体验评估指标体系',
          description: '关注用户满意度、界面友好性、操作便捷性',
          version: '1.3.0',
          status: 'active',
          indicatorCount: 12,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-05 15:30:00'
        }
      ]

      const total = mockData.length
      const start = (page - 1) * size
      const end = start + size
      const records = mockData.slice(start, end)
      const pages = Math.ceil(total / size)

      return {
        success: true,
        code: '200',
        msg: 'SUCCESS',
        data: {
          current: page,
          pages,
          records,
          size,
          total
        }
      }
    }
  },

  // 获取计算模型列表
  {
    url: '/api/indicator/calculation-model/list',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page || query.pageNumber || query.current) || 1
      const size = parseInt(query.size || query.pageSize || query.limit) || 10

      const mockData = [
        {
          id: 'weighted_sum_model',
          name: '加权求和模型',
          description: '基于权重的线性加权计算模型',
          type: 'linear',
          complexity: 'low',
          accuracy: 85,
          createTime: '2024-01-10 09:30:00'
        },
        {
          id: 'fuzzy_comprehensive_model',
          name: '模糊综合评价模型',
          description: '处理不确定性和模糊信息的评价模型',
          type: 'fuzzy',
          complexity: 'medium',
          accuracy: 92,
          createTime: '2024-01-08 14:20:00'
        },
        {
          id: 'neural_network_model',
          name: '神经网络评价模型',
          description: '基于机器学习的智能评价模型',
          type: 'ml',
          complexity: 'high',
          accuracy: 96,
          createTime: '2024-01-05 11:15:00'
        }
      ]

      const total = mockData.length
      const start = (page - 1) * size
      const end = start + size
      const records = mockData.slice(start, end)
      const pages = Math.ceil(total / size)

      return {
        success: true,
        code: 200,
        msg: 'SUCCESS',
        data: {
          current: page,
          pages,
          records,
          size,
          total
        }
      }
    }
  },

  // 获取指标体系结构数据（用于DAG画布）
  {
    url: '/api/indicator/system/:id/structure',
    method: 'get',
    response: ({ params }) => {
      const id = params?.id

      // 模拟DAG结构数据
      const structureData = {
        nodes: [
          {
            id: 'root',
            label: '综合评估',
            type: 'root',
            level: 0,
            weight: 1.0,
            position: { x: 400, y: 50 }
          },
          {
            id: 'performance',
            label: '性能指标',
            type: 'category',
            level: 1,
            weight: 0.4,
            position: { x: 200, y: 150 }
          },
          {
            id: 'reliability',
            label: '可靠性指标',
            type: 'category',
            level: 1,
            weight: 0.3,
            position: { x: 400, y: 150 }
          },
          {
            id: 'security',
            label: '安全性指标',
            type: 'category',
            level: 1,
            weight: 0.3,
            position: { x: 600, y: 150 }
          },
          {
            id: 'response_time',
            label: '响应时间',
            type: 'indicator',
            level: 2,
            weight: 0.5,
            unit: 'ms',
            position: { x: 100, y: 250 }
          },
          {
            id: 'throughput',
            label: '吞吐量',
            type: 'indicator',
            level: 2,
            weight: 0.5,
            unit: 'req/s',
            position: { x: 300, y: 250 }
          }
        ],
        edges: [
          { source: 'root', target: 'performance' },
          { source: 'root', target: 'reliability' },
          { source: 'root', target: 'security' },
          { source: 'performance', target: 'response_time' },
          { source: 'performance', target: 'throughput' }
        ]
      }

      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: structureData
      }
    }
  },

  // 获取评估算法列表
  {
    url: '/api/indicator/algorithm/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            id: 'weighted_sum',
            name: '加权求和算法',
            description: '基于权重的线性加权计算,适用于大多数评估场景',
            category: '经典算法',
            complexity: 'low',
            accuracy: 85,
            createTime: '2024-01-10 09:30:00'
          },
          {
            id: 'fuzzy_comprehensive',
            name: '模糊综合评价算法',
            description: '处理不确定性和模糊信息的评价方法',
            category: '模糊算法',
            complexity: 'medium',
            accuracy: 92,
            createTime: '2024-01-08 14:20:00'
          },
          {
            id: 'neural_network',
            name: '神经网络评价算法',
            description: '基于机器学习的智能评价算法,可以自动学习复杂的评价模式',
            category: 'AI算法',
            complexity: 'high',
            accuracy: 96,
            createTime: '2024-01-05 11:15:00'
          },
          {
            id: 'ahp',
            name: '层次分析法(AHP)',
            description: '通过两两比较确定权重的系统化方法,适合专家评估',
            category: '经典算法',
            complexity: 'medium',
            accuracy: 88,
            createTime: '2024-01-03 16:45:00'
          },
          {
            id: 'topsis',
            name: 'TOPSIS法',
            description: '基于理想解的评价方法,适用于多目标决策',
            category: '经典算法',
            complexity: 'low',
            accuracy: 83,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 'grey_relational',
            name: '灰色关联分析',
            description: '处理小样本不确定性的评价方法',
            category: '灰色系统',
            complexity: 'medium',
            accuracy: 87,
            createTime: '2023-12-28 13:20:00'
          }
        ]
      }
    }
  },

  // 获取评估任务模板列表
  {
    url: '/api/indicator/task-template/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            id: 'template1',
            name: '综合评估模板',
            description: '适用于全面的系统评估',
            algorithm: 'weighted_sum',
            metricSystemId: 'comprehensive_performance_indicators',
            createTime: '2024-01-10 09:30:00'
          },
          {
            id: 'template2',
            name: '性能评估模板',
            description: '专注于系统性能指标的评估',
            algorithm: 'fuzzy_comprehensive',
            metricSystemId: 'performance_efficiency_indicators',
            createTime: '2024-01-08 14:20:00'
          },
          {
            id: 'template3',
            name: '安全评估模板',
            description: '针对安全风险的专项评估',
            algorithm: 'ahp',
            metricSystemId: 'security_risk_indicators',
            createTime: '2024-01-05 11:15:00'
          }
        ]
      }
    }
  },

  // 获取仪表板模板列表
  {
    url: '/api/indicator/dashboard-template/list',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '获取成功',
        data: [
          {
            id: 'dashboard1',
            name: '标准仪表板',
            description: '包含常用的图表和指标展示',
            preview: '',
            createTime: '2024-01-10 09:30:00'
          },
          {
            id: 'dashboard2',
            name: '高级仪表板',
            description: '包含更多高级图表和交互功能',
            preview: '',
            createTime: '2024-01-08 14:20:00'
          },
          {
            id: 'dashboard3',
            name: '简洁仪表板',
            description: '简洁的设计,突出核心指标',
            preview: '',
            createTime: '2024-01-05 11:15:00'
          }
        ]
      }
    }
  },

  // ========== 指标体系标签管理接口 ==========
  // 获取指标体系标签列表
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTag',
    method: 'get',
    response: ({ query }) => {
      const { current = 1, size = 10 } = query

      // 模拟标签数据
      const allTags = [
        { id: '1', tagName: '性能评估', createTime: '2024-01-15 10:30:00' },
        { id: '2', tagName: '安全测评', createTime: '2024-01-16 14:20:00' },
        { id: '3', tagName: '质量保证', createTime: '2024-01-17 09:15:00' },
        { id: '4', tagName: '用户体验', createTime: '2024-01-18 16:45:00' },
        { id: '5', tagName: '可靠性', createTime: '2024-01-19 11:30:00' },
        { id: '6', tagName: '可维护性', createTime: '2024-01-20 08:45:00' },
        { id: '7', tagName: '可扩展性', createTime: '2024-01-21 13:20:00' },
        { id: '8', tagName: '兼容性', createTime: '2024-01-22 15:10:00' },
        { id: '9', tagName: '易用性', createTime: '2024-01-23 09:30:00' },
        { id: '10', tagName: '效率', createTime: '2024-01-24 12:15:00' },
        { id: '11', tagName: '成本效益', createTime: '2024-01-25 10:00:00' },
        { id: '12', tagName: '功能完整性', createTime: '2024-01-26 14:30:00' },
        { id: '13', tagName: '规范性', createTime: '2024-01-27 16:20:00' },
        { id: '14', tagName: '可测试性', createTime: '2024-01-28 11:45:00' },
        { id: '15', tagName: '可移植性', createTime: '2024-01-29 09:00:00' },
        { id: '16', tagName: '互操作性', createTime: '2024-01-30 13:15:00' },
        { id: '17', tagName: '资源利用率', createTime: '2024-01-31 10:30:00' },
        { id: '18', tagName: '响应时间', createTime: '2024-02-01 15:20:00' },
        { id: '19', tagName: '吞吐量', createTime: '2024-02-02 11:10:00' },
        { id: '20', tagName: '并发处理', createTime: '2024-02-03 14:00:00' }
      ]

      // 分页处理
      const total = allTags.length
      const start = (current - 1) * size
      const end = start + parseInt(size)
      const records = allTags.slice(start, end)

      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: parseInt(size),
          current: parseInt(current),
          pages: Math.ceil(total / size)
        }
      }
    }
  },

  // 创建指标体系标签
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTag',
    method: 'post',
    response: ({ body }) => {
      return {
        success: true,
        code: SUCCESS_CODE,
        msg: 'SUCCESS',
        data: {
          id: Date.now().toString(),
          tagName: body.tagName,
          createTime: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },

  // 删除指标体系标签
  {
    url: '/api/zhpgxt/zhpgEvaluaSystemTag/:id',
    method: 'delete',
    response: ({ params }) => {
      return {
        success: true,
        code: SUCCESS_CODE,
        msg: '删除成功',
        data: null
      }
    }
  }
]
