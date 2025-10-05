import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

// 模拟数据集列表数据
const mockDatasets = [
  {
    createTableId: '1',
    tableName: 'user_dataset',
    tableComment: '用户数据集',
    dataSourceId: '1',
    dataSourceName: '生产环境MySQL',
    rowCount: 1500,
    columnCount: 8,
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:20:00',
    status: 'active'
  },
  {
    createTableId: '2',
    tableName: 'order_dataset',
    tableComment: '订单数据集',
    dataSourceId: '1',
    dataSourceName: '生产环境MySQL',
    rowCount: 8500,
    columnCount: 12,
    createTime: '2024-01-16 11:15:00',
    updateTime: '2024-01-21 09:30:00',
    status: 'active'
  },
  {
    createTableId: '3',
    tableName: 'product_dataset',
    tableComment: '商品数据集',
    dataSourceId: '2',
    dataSourceName: '测试环境MySQL',
    rowCount: 320,
    columnCount: 6,
    createTime: '2024-01-17 09:45:00',
    updateTime: '2024-01-22 16:10:00',
    status: 'active'
  },
  {
    createTableId: '4',
    tableName: 'analytics_dataset',
    tableComment: '分析数据集',
    dataSourceId: '3',
    dataSourceName: '本地达梦数据库',
    rowCount: 25600,
    columnCount: 15,
    createTime: '2024-01-18 14:20:00',
    updateTime: '2024-01-23 11:45:00',
    status: 'processing'
  },
  {
    createTableId: '5',
    tableName: 'log_dataset',
    tableComment: '日志数据集',
    dataSourceId: '4',
    dataSourceName: '开发环境MySQL',
    rowCount: 45000,
    columnCount: 10,
    createTime: '2024-01-19 16:30:00',
    updateTime: '2024-01-24 08:15:00',
    status: 'active'
  }
]

// 模拟数据集详细数据
const mockDatasetData = {
  '1': [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      age: 28,
      department: '技术部',
      salary: 15000,
      join_date: '2023-01-15',
      status: 'active'
    },
    {
      id: 2,
      username: 'user001',
      email: 'user001@example.com',
      age: 25,
      department: '产品部',
      salary: 12000,
      join_date: '2023-03-20',
      status: 'active'
    },
    {
      id: 3,
      username: 'user002',
      email: 'user002@example.com',
      age: 30,
      department: '运营部',
      salary: 13000,
      join_date: '2023-02-10',
      status: 'inactive'
    },
    {
      id: 4,
      username: 'manager',
      email: 'manager@example.com',
      age: 35,
      department: '管理部',
      salary: 20000,
      join_date: '2022-12-01',
      status: 'active'
    },
    {
      id: 5,
      username: 'developer',
      email: 'dev@example.com',
      age: 27,
      department: '技术部',
      salary: 14000,
      join_date: '2023-04-15',
      status: 'active'
    }
  ],
  '2': [
    {
      order_id: 1001,
      customer_name: '张三',
      product_name: '笔记本电脑',
      quantity: 1,
      unit_price: 8999.0,
      total_amount: 8999.0,
      order_date: '2024-01-15',
      status: 'completed',
      payment_method: '支付宝',
      shipping_address: '北京市朝阳区',
      contact_phone: '13800138001',
      remark: '加急处理'
    },
    {
      order_id: 1002,
      customer_name: '李四',
      product_name: '无线鼠标',
      quantity: 2,
      unit_price: 199.0,
      total_amount: 398.0,
      order_date: '2024-01-16',
      status: 'pending',
      payment_method: '微信支付',
      shipping_address: '上海市浦东新区',
      contact_phone: '13800138002',
      remark: ''
    },
    {
      order_id: 1003,
      customer_name: '王五',
      product_name: '机械键盘',
      quantity: 1,
      unit_price: 599.0,
      total_amount: 599.0,
      order_date: '2024-01-17',
      status: 'shipped',
      payment_method: '银行卡',
      shipping_address: '广州市天河区',
      contact_phone: '13800138003',
      remark: '包装要求精美'
    }
  ],
  '3': [
    {
      product_id: 'P001',
      product_name: '高端笔记本电脑',
      category: '电脑硬件',
      brand: 'TechBrand',
      price: 8999.0,
      stock: 50
    },
    {
      product_id: 'P002',
      product_name: '专业无线鼠标',
      category: '外设配件',
      brand: 'MouseTech',
      price: 199.0,
      stock: 200
    },
    {
      product_id: 'P003',
      product_name: '机械键盘Pro',
      category: '外设配件',
      brand: 'KeyboardPro',
      price: 599.0,
      stock: 80
    }
  ]
}

// 模拟数据集字段信息
const mockDatasetFields = {
  '1': [
    { name: 'id', comment: '用户ID', type: 'int(11)', nullable: false },
    { name: 'username', comment: '用户名', type: 'varchar(50)', nullable: false },
    { name: 'email', comment: '邮箱', type: 'varchar(100)', nullable: false },
    { name: 'age', comment: '年龄', type: 'int(3)', nullable: true },
    { name: 'department', comment: '部门', type: 'varchar(50)', nullable: true },
    { name: 'salary', comment: '薪资', type: 'decimal(10,2)', nullable: true },
    { name: 'join_date', comment: '入职日期', type: 'date', nullable: true },
    { name: 'status', comment: '状态', type: 'varchar(20)', nullable: false }
  ],
  '2': [
    { name: 'order_id', comment: '订单ID', type: 'int(11)', nullable: false },
    { name: 'customer_name', comment: '客户姓名', type: 'varchar(50)', nullable: false },
    { name: 'product_name', comment: '商品名称', type: 'varchar(100)', nullable: false },
    { name: 'quantity', comment: '数量', type: 'int(11)', nullable: false },
    { name: 'unit_price', comment: '单价', type: 'decimal(10,2)', nullable: false },
    { name: 'total_amount', comment: '总金额', type: 'decimal(10,2)', nullable: false },
    { name: 'order_date', comment: '订单日期', type: 'date', nullable: false },
    { name: 'status', comment: '订单状态', type: 'varchar(20)', nullable: false },
    { name: 'payment_method', comment: '支付方式', type: 'varchar(20)', nullable: true },
    { name: 'shipping_address', comment: '收货地址', type: 'varchar(200)', nullable: true },
    { name: 'contact_phone', comment: '联系电话', type: 'varchar(20)', nullable: true },
    { name: 'remark', comment: '备注', type: 'varchar(500)', nullable: true }
  ],
  '3': [
    { name: 'product_id', comment: '商品ID', type: 'varchar(20)', nullable: false },
    { name: 'product_name', comment: '商品名称', type: 'varchar(100)', nullable: false },
    { name: 'category', comment: '商品分类', type: 'varchar(50)', nullable: false },
    { name: 'brand', comment: '品牌', type: 'varchar(50)', nullable: true },
    { name: 'price', comment: '价格', type: 'decimal(10,2)', nullable: false },
    { name: 'stock', comment: '库存', type: 'int(11)', nullable: false }
  ]
}

export default [

  // 根据创建表ID查询数据集数据
  // 根据创建表ID查询数据集详情
  {
    url: '/api/zhpgxt/zhpgCreateTable/:createTableId',
    method: 'get',
    timeout,
    response: ({ url }) => {
      const createTableId = url.split('/')[4]
      
      // 根据ID选择对应的数据集，如果找不到就使用第一个
      let dataset = mockDatasets.find((item) => item.createTableId === String(createTableId))
      if (!dataset) {
        dataset = mockDatasets[0] // 默认使用第一个数据集
      }

      // 获取对应的字段信息，如果找不到就使用第一个
      let fields = mockDatasetFields[createTableId] || mockDatasetFields['1']

      return {
        code: SUCCESS_CODE,
        message: '查询成功',
        data: {
          createTableId: dataset.createTableId,
          tableName: dataset.tableName,
          tableComment: dataset.tableComment,
          dataSourceId: dataset.dataSourceId,
          dataSourceName: dataset.dataSourceName,
          rowCount: dataset.rowCount,
          columnCount: dataset.columnCount,
          createTime: dataset.createTime,
          updateTime: dataset.updateTime,
          status: dataset.status,
          createTableRowDtos: fields.map(field => ({
            name: field.name,
            type: field.type,
            extent: field.type.includes('(') ? field.type.match(/\(([^)]+)\)/)?.[1] || '255' : '255',
            comment: field.comment
          }))
        }
      }
    }
  },



  // 获取数据集字段信息
  {
    url: '/api/zhpgxt/zhpgCreateTable/:createTableId/fields',
    method: 'get',
    timeout,
    response: ({ url }) => {
      const createTableId = url.split('/')[4]
      const fields = mockDatasetFields[createTableId] || []
      return {
        code: SUCCESS_CODE,
        data: fields
      }
    }
  },

  // 删除数据集
  {
    url: '/api/zhpgxt/zhpgCreateTable/:createTableId',
    method: 'delete',
    timeout,
    response: ({ url }) => {
      const createTableId = url.split('/')[4]
      console.log(`删除数据集: ${createTableId}`)
      return {
        code: SUCCESS_CODE,
        data: null,
        message: '数据集删除成功'
      }
    }
  },

  // 迁移数据集到本地数据库
  {
    url: '/api/zhpgxt/zhpgCreateTable/:createTableId/migration',
    method: 'post',
    timeout,
    response: ({ url }) => {
      const createTableId = url.split('/')[4]
      console.log('迁移数据集到本地数据库:', createTableId)
      
      return {
        code: SUCCESS_CODE,
        data: {
          success: true,
          message: '数据集迁移成功'
        }
      }
    }
  },
  // 创建表
  {
    url: '/api/zhpgxt/zhpgCreateTable',
    method: 'post',
    timeout,
    response: ({ body }) => {
      console.log('=== Mock 接收到的完整 body ===', body)
      console.log('=== Mock body 的类型 ===', typeof body)
      console.log('=== Mock body 的 keys ===', body ? Object.keys(body) : 'body is null')
      console.log('=== Mock body.createTableRowDtos ===', body?.createTableRowDtos)
      
      // 容错处理：检查必要字段
      if (!body || !body.tableName || !body.tableComment) {
        return {
          code: 400,
          message: '缺少必要参数：tableName 或 tableComment'
        }
      }
      
      // 容错处理：检查字段数据
      const fields = body.createTableRowDtos || body.fields || []
      if (!Array.isArray(fields)) {
        return {
          code: 400,
          message: '字段数据格式错误'
        }
      }
      
      // 生成新的表ID
      const newCreateTableId = String(mockDatasets.length + 1)
      
      // 创建新的数据集记录
      const newDataset = {
        createTableId: newCreateTableId,
        tableName: body.tableName,
        tableComment: body.tableComment,
        dataSourceId: '1',
        dataSourceName: '生产环境MySQL',
        rowCount: 0,
        columnCount: fields.length,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'active'
      }
      
      // 添加到模拟数据中
      mockDatasets.push(newDataset)
      
      // 添加字段信息 - 兼容不同的字段格式
      mockDatasetFields[newCreateTableId] = fields.map(field => {
        // 兼容 createTableRowDtos 格式
        if (field.name && field.type) {
          return {
            name: field.name,
            comment: field.comment || '',
            type: field.type + (field.extent ? `(${field.extent})` : ''),
            nullable: true
          }
        }
        // 兼容 fields 格式
        if (field.fieldName && field.fieldType) {
          return {
            name: field.fieldName,
            comment: field.fieldComment || '',
            type: field.fieldType + (field.fieldLength ? `(${field.fieldLength})` : ''),
            nullable: true
          }
        }
        // 默认格式
        return {
          name: field.name || field.fieldName || 'unknown',
          comment: field.comment || field.fieldComment || '',
          type: field.type || field.fieldType || 'varchar',
          nullable: true
        }
      })
      
      // 初始化空数据
      mockDatasetData[newCreateTableId] = []
      
      return {
        code: SUCCESS_CODE,
        data: {
          createTableId: newCreateTableId,
          tableName: body.tableName,
          message: '表创建成功'
        }
      }
    }
  }
]