import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'
import datasetsMock from './datasets.mock'

const timeout = 1000

// 数据源类型映射
const dataSourceTypeMap = {
  1: 'MySQL数据库',
  2: '达梦数据库'
}

// 基础数据源数据
const baseDataSources = [
  {
    baseId: '1',
    baseName: '生产环境MySQL',
    baseIp: '192.168.1.100',
    basePort: '3306',
    baseDataName: 'production_db',
    baseUser: 'admin',
    basePassword: '123456',
    baseType: 1,
    isLocalhost: 0,
    createTime: '2024-01-15 10:30:00'
  },
  {
    baseId: '2',
    baseName: '测试环境MySQL',
    baseIp: '192.168.1.101',
    basePort: '3306',
    baseDataName: 'test_db',
    baseUser: 'test_user',
    basePassword: 'test123',
    baseType: 1,
    isLocalhost: 0,
    createTime: '2024-01-14 14:20:00'
  },
  {
    baseId: '3',
    baseName: '本地达梦数据库',
    baseIp: 'localhost',
    basePort: '5236',
    baseDataName: 'local_dm',
    baseUser: 'dm_user',
    basePassword: 'dm123',
    baseType: 2,
    isLocalhost: 1,
    createTime: '2024-01-13 09:15:00'
  },
  {
    baseId: '4',
    baseName: '开发环境MySQL',
    baseIp: '192.168.1.102',
    basePort: '3306',
    baseDataName: 'dev_db',
    baseUser: 'dev_user',
    basePassword: 'dev123',
    baseType: 1,
    isLocalhost: 0,
    createTime: '2024-01-12 16:45:00'
  },
  {
    baseId: '5',
    baseName: '备份达梦数据库',
    baseIp: '192.168.1.200',
    basePort: '5236',
    baseDataName: 'backup_dm',
    baseUser: 'backup_user',
    basePassword: 'backup123',
    baseType: 2,
    isLocalhost: 0,
    createTime: '2024-01-11 11:30:00'
  },
  {
    baseId: '6',
    baseName: '数据仓库MySQL',
    baseIp: '192.168.1.150',
    basePort: '3306',
    baseDataName: 'warehouse_db',
    baseUser: 'warehouse_user',
    basePassword: 'warehouse123',
    baseType: 1,
    isLocalhost: 0,
    createTime: '2024-01-10 08:45:00'
  },
  {
    baseId: '7',
    baseName: '分析库达梦',
    baseIp: '192.168.1.151',
    basePort: '5236',
    baseDataName: 'analytics_dm',
    baseUser: 'analytics_user',
    basePassword: 'analytics123',
    baseType: 2,
    isLocalhost: 0,
    createTime: '2024-01-09 15:20:00'
  },
  {
    baseId: '8',
    baseName: '日志数据库MySQL',
    baseIp: '192.168.1.103',
    basePort: '3306',
    baseDataName: 'log_db',
    baseUser: 'log_user',
    basePassword: 'log123',
    baseType: 1,
    isLocalhost: 0,
    createTime: '2024-01-08 12:10:00'
  }
]

// 数据源列表（可变）
let dataSourceList = [...baseDataSources]

// 模拟表数据
const mockTables = {
  '1': [
    {
      TABLE_NAME: 'users',
      TABLE_COMMENT: '用户信息表',
      TABLE_ROWS: 1500,
      CREATE_TIME: '2024-01-01 10:00:00'
    },
    {
      TABLE_NAME: 'orders',
      TABLE_COMMENT: '订单信息表',
      TABLE_ROWS: 8500,
      CREATE_TIME: '2024-01-02 11:30:00'
    },
    {
      TABLE_NAME: 'products',
      TABLE_COMMENT: '商品信息表',
      TABLE_ROWS: 320,
      CREATE_TIME: '2024-01-03 09:15:00'
    },
    {
      TABLE_NAME: 'categories',
      TABLE_COMMENT: '商品分类表',
      TABLE_ROWS: 25,
      CREATE_TIME: '2024-01-04 14:20:00'
    },
    {
      TABLE_NAME: 'order_items',
      TABLE_COMMENT: '订单明细表',
      TABLE_ROWS: 15600,
      CREATE_TIME: '2024-01-05 16:45:00'
    },
    {
      TABLE_NAME: 'customers',
      TABLE_COMMENT: '客户信息表',
      TABLE_ROWS: 2800,
      CREATE_TIME: '2024-01-06 08:30:00'
    },
    {
      TABLE_NAME: 'suppliers',
      TABLE_COMMENT: '供应商信息表',
      TABLE_ROWS: 150,
      CREATE_TIME: '2024-01-07 13:10:00'
    },
    {
      TABLE_NAME: 'inventory',
      TABLE_COMMENT: '库存管理表',
      TABLE_ROWS: 5200,
      CREATE_TIME: '2024-01-08 10:45:00'
    },
    {
      TABLE_NAME: 'payments',
      TABLE_COMMENT: '支付记录表',
      TABLE_ROWS: 12300,
      CREATE_TIME: '2024-01-09 15:20:00'
    },
    {
      TABLE_NAME: 'reviews',
      TABLE_COMMENT: '商品评价表',
      TABLE_ROWS: 3400,
      CREATE_TIME: '2024-01-10 12:00:00'
    },
    {
      TABLE_NAME: 'coupons',
      TABLE_COMMENT: '优惠券表',
      TABLE_ROWS: 680,
      CREATE_TIME: '2024-01-11 09:30:00'
    },
    {
      TABLE_NAME: 'shipping',
      TABLE_COMMENT: '物流信息表',
      TABLE_ROWS: 7800,
      CREATE_TIME: '2024-01-12 14:15:00'
    },
    {
      TABLE_NAME: 'user_profiles',
      TABLE_COMMENT: '用户详细资料表',
      TABLE_ROWS: 1450,
      CREATE_TIME: '2024-01-13 11:40:00'
    },
    {
      TABLE_NAME: 'product_images',
      TABLE_COMMENT: '商品图片表',
      TABLE_ROWS: 2100,
      CREATE_TIME: '2024-01-14 16:25:00'
    },
    {
      TABLE_NAME: 'order_status_log',
      TABLE_COMMENT: '订单状态变更日志表',
      TABLE_ROWS: 18900,
      CREATE_TIME: '2024-01-15 08:50:00'
    },
    {
      TABLE_NAME: 'shopping_cart',
      TABLE_COMMENT: '购物车表',
      TABLE_ROWS: 4200,
      CREATE_TIME: '2024-01-16 13:35:00'
    },
    {
      TABLE_NAME: 'wishlists',
      TABLE_COMMENT: '心愿单表',
      TABLE_ROWS: 890,
      CREATE_TIME: '2024-01-17 10:20:00'
    },
    {
      TABLE_NAME: 'notifications',
      TABLE_COMMENT: '系统通知表',
      TABLE_ROWS: 6700,
      CREATE_TIME: '2024-01-18 15:05:00'
    },
    {
      TABLE_NAME: 'audit_logs',
      TABLE_COMMENT: '操作审计日志表',
      TABLE_ROWS: 25600,
      CREATE_TIME: '2024-01-19 09:10:00'
    },
    {
      TABLE_NAME: 'system_config',
      TABLE_COMMENT: '系统配置表',
      TABLE_ROWS: 45,
      CREATE_TIME: '2024-01-20 12:55:00'
    }
  ],
  '2': [
    {
      TABLE_NAME: 'test_users',
      TABLE_COMMENT: '测试用户表',
      TABLE_ROWS: 100,
      CREATE_TIME: '2024-01-01 10:00:00'
    },
    {
      TABLE_NAME: 'test_orders',
      TABLE_COMMENT: '测试订单表',
      TABLE_ROWS: 500,
      CREATE_TIME: '2024-01-02 11:30:00'
    },
    {
      TABLE_NAME: 'test_products',
      TABLE_COMMENT: '测试商品表',
      TABLE_ROWS: 50,
      CREATE_TIME: '2024-01-03 09:15:00'
    }
  ],
  '3': [
    {
      TABLE_NAME: 'dm_users',
      TABLE_COMMENT: '达梦用户表',
      TABLE_ROWS: 200,
      CREATE_TIME: '2024-01-01 10:00:00'
    },
    {
      TABLE_NAME: 'dm_logs',
      TABLE_COMMENT: '达梦日志表',
      TABLE_ROWS: 5000,
      CREATE_TIME: '2024-01-02 11:30:00'
    },
    {
      TABLE_NAME: 'dm_config',
      TABLE_COMMENT: '达梦配置表',
      TABLE_ROWS: 10,
      CREATE_TIME: '2024-01-03 09:15:00'
    }
  ]
}

// 模拟表字段数据
const mockTableFields = {
  users: [
    { name: 'id', comment: '用户ID', type: 'int(11)' },
    { name: 'username', comment: '用户名', type: 'varchar(50)' },
    { name: 'email', comment: '邮箱', type: 'varchar(100)' },
    { name: 'created_at', comment: '创建时间', type: 'datetime' },
    { name: 'status', comment: '状态', type: 'tinyint(1)' }
  ],
  orders: [
    { name: 'id', comment: '订单ID', type: 'int(11)' },
    { name: 'user_id', comment: '用户ID', type: 'int(11)' },
    { name: 'total_amount', comment: '总金额', type: 'decimal(10,2)' },
    { name: 'order_date', comment: '订单日期', type: 'datetime' },
    { name: 'status', comment: '订单状态', type: 'varchar(20)' }
  ],
  products: [
    { name: 'id', comment: '商品ID', type: 'int(11)' },
    { name: 'name', comment: '商品名称', type: 'varchar(100)' },
    { name: 'price', comment: '价格', type: 'decimal(10,2)' },
    { name: 'category_id', comment: '分类ID', type: 'int(11)' },
    { name: 'stock', comment: '库存', type: 'int(11)' },
    { name: 'created_at', comment: '创建时间', type: 'datetime' }
  ],
  categories: [
    { name: 'id', comment: '分类ID', type: 'int(11)' },
    { name: 'name', comment: '分类名称', type: 'varchar(50)' },
    { name: 'description', comment: '描述', type: 'varchar(200)' },
    { name: 'created_at', comment: '创建时间', type: 'datetime' }
  ],
  customers: [
    { name: 'id', comment: '客户ID', type: 'int(11)' },
    { name: 'name', comment: '客户姓名', type: 'varchar(50)' },
    { name: 'phone', comment: '电话', type: 'varchar(20)' },
    { name: 'address', comment: '地址', type: 'varchar(200)' },
    { name: 'created_at', comment: '创建时间', type: 'datetime' }
  ],
  test_users: [
    { name: 'id', comment: '用户ID', type: 'int(11)' },
    { name: 'username', comment: '用户名', type: 'varchar(50)' },
    { name: 'email', comment: '邮箱', type: 'varchar(100)' },
    { name: 'created_at', comment: '创建时间', type: 'datetime' },
    { name: 'status', comment: '状态', type: 'tinyint(1)' }
  ],
  test_orders: [
    { name: 'id', comment: '订单ID', type: 'int(11)' },
    { name: 'user_id', comment: '用户ID', type: 'int(11)' },
    { name: 'total_amount', comment: '总金额', type: 'decimal(10,2)' },
    { name: 'order_date', comment: '订单日期', type: 'datetime' },
    { name: 'status', comment: '订单状态', type: 'varchar(20)' }
  ],
  dm_users: [
    { name: 'id', comment: '用户ID', type: 'int(11)' },
    { name: 'username', comment: '用户名', type: 'varchar(50)' },
    { name: 'email', comment: '邮箱', type: 'varchar(100)' },
    { name: 'created_at', comment: '创建时间', type: 'datetime' },
    { name: 'status', comment: '状态', type: 'tinyint(1)' }
  ],
  dm_logs: [
    { name: 'id', comment: '日志ID', type: 'int(11)' },
    { name: 'level', comment: '日志级别', type: 'varchar(10)' },
    { name: 'message', comment: '日志消息', type: 'varchar(500)' },
    { name: 'created_at', comment: '创建时间', type: 'datetime' }
  ]
}

// 根据数据源 ID 生成表数据的 mock 数据
const mockTableData = {
  '1': {
    users: [
      {
        id: 1,
        username: 'prod_admin',
        email: 'admin@prod.com',
        created_at: '2024-01-01 10:00:00',
        status: 1
      },
      {
        id: 2,
        username: 'prod_user1',
        email: 'user1@prod.com',
        created_at: '2024-01-02 11:00:00',
        status: 1
      },
      {
        id: 3,
        username: 'prod_user2',
        email: 'user2@prod.com',
        created_at: '2024-01-03 12:00:00',
        status: 0
      },
      {
        id: 4,
        username: 'prod_manager',
        email: 'manager@prod.com',
        created_at: '2024-01-04 13:00:00',
        status: 1
      },
      {
        id: 5,
        username: 'prod_guest',
        email: 'guest@prod.com',
        created_at: '2024-01-05 14:00:00',
        status: 0
      }
    ],
    orders: [
      {
        id: 1,
        user_id: 1,
        total_amount: 2999.99,
        order_date: '2024-01-15 14:30:00',
        status: 'completed'
      },
      {
        id: 2,
        user_id: 2,
        total_amount: 1599.5,
        order_date: '2024-01-16 09:15:00',
        status: 'pending'
      },
      {
        id: 3,
        user_id: 1,
        total_amount: 899.99,
        order_date: '2024-01-17 16:45:00',
        status: 'shipped'
      },
      {
        id: 4,
        user_id: 3,
        total_amount: 1999.99,
        order_date: '2024-01-18 10:20:00',
        status: 'processing'
      },
      {
        id: 5,
        user_id: 2,
        total_amount: 799.99,
        order_date: '2024-01-19 15:30:00',
        status: 'completed'
      }
    ],
    products: [
      {
        id: 1,
        name: '高端笔记本电脑',
        price: 8999.0,
        category_id: 1,
        stock: 50,
        created_at: '2024-01-01 09:00:00'
      },
      {
        id: 2,
        name: '专业无线鼠标',
        price: 199.0,
        category_id: 2,
        stock: 200,
        created_at: '2024-01-02 10:00:00'
      },
      {
        id: 3,
        name: '机械键盘Pro',
        price: 599.0,
        category_id: 2,
        stock: 80,
        created_at: '2024-01-03 11:00:00'
      },
      {
        id: 4,
        name: '4K显示器',
        price: 2299.0,
        category_id: 1,
        stock: 30,
        created_at: '2024-01-04 12:00:00'
      }
    ],
    categories: [
      {
        id: 1,
        name: '电脑硬件',
        description: '高端电脑硬件设备',
        created_at: '2024-01-01 08:00:00'
      },
      { id: 2, name: '外设配件', description: '专业外设配件', created_at: '2024-01-02 08:00:00' },
      { id: 3, name: '办公用品', description: '高端办公用品', created_at: '2024-01-03 08:00:00' }
    ],
    customers: [
      {
        id: 1,
        name: '张三',
        phone: '13800138001',
        address: '北京市朝阳区CBD',
        created_at: '2024-01-01 09:00:00'
      },
      {
        id: 2,
        name: '李四',
        phone: '13800138002',
        address: '上海市浦东新区陆家嘴',
        created_at: '2024-01-02 09:00:00'
      },
      {
        id: 3,
        name: '王五',
        phone: '13800138003',
        address: '广州市天河区珠江新城',
        created_at: '2024-01-03 09:00:00'
      }
    ]
  },
  '2': {
    test_users: [
      {
        id: 1,
        username: 'test_admin',
        email: 'admin@test.com',
        created_at: '2024-01-01 10:00:00',
        status: 1
      },
      {
        id: 2,
        username: 'test_user1',
        email: 'user1@test.com',
        created_at: '2024-01-02 11:00:00',
        status: 1
      },
      {
        id: 3,
        username: 'test_user2',
        email: 'user2@test.com',
        created_at: '2024-01-03 12:00:00',
        status: 0
      }
    ],
    test_orders: [
      {
        id: 1,
        user_id: 1,
        total_amount: 100.0,
        order_date: '2024-01-15 14:30:00',
        status: 'test_completed'
      },
      {
        id: 2,
        user_id: 2,
        total_amount: 200.0,
        order_date: '2024-01-16 09:15:00',
        status: 'test_pending'
      },
      {
        id: 3,
        user_id: 3,
        total_amount: 150.0,
        order_date: '2024-01-17 16:45:00',
        status: 'test_cancelled'
      }
    ],
    test_products: [
      {
        id: 1,
        name: '测试商品A',
        price: 99.0,
        category_id: 1,
        stock: 10,
        created_at: '2024-01-01 09:00:00'
      },
      {
        id: 2,
        name: '测试商品B',
        price: 199.0,
        category_id: 2,
        stock: 20,
        created_at: '2024-01-02 10:00:00'
      }
    ]
  },
  '3': {
    dm_users: [
      {
        id: 1,
        username: 'dm_admin',
        email: 'admin@dm.com',
        created_at: '2024-01-01 10:00:00',
        status: 1
      },
      {
        id: 2,
        username: 'dm_user1',
        email: 'user1@dm.com',
        created_at: '2024-01-02 11:00:00',
        status: 1
      },
      {
        id: 3,
        username: 'dm_user2',
        email: 'user2@dm.com',
        created_at: '2024-01-03 12:00:00',
        status: 0
      }
    ],
    dm_logs: [
      { id: 1, level: 'INFO', message: '达梦数据库启动成功', created_at: '2024-01-01 10:00:00' },
      { id: 2, level: 'ERROR', message: '连接超时', created_at: '2024-01-02 11:00:00' },
      { id: 3, level: 'WARN', message: '内存使用率过高', created_at: '2024-01-03 12:00:00' },
      { id: 4, level: 'INFO', message: '备份任务完成', created_at: '2024-01-04 13:00:00' }
    ],
    dm_config: [
      {
        id: 1,
        config_key: 'max_connections',
        config_value: '1000',
        description: '最大连接数',
        created_at: '2024-01-01 08:00:00'
      },
      {
        id: 2,
        config_key: 'buffer_size',
        config_value: '256MB',
        description: '缓冲区大小',
        created_at: '2024-01-02 08:00:00'
      }
    ]
  }
}

export default [
  ...datasetsMock,
  // 分页查询数据源列表
  {
    url: '/api/zhpgxt/zhpgBase',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageNumber = 1, pageSize = 10, baseName = '', baseType = '' } = query

      // 过滤数据
      let filteredData = [...dataSourceList]

      if (baseName) {
        filteredData = filteredData.filter((item) =>
          item.baseName.toLowerCase().includes(baseName.toLowerCase())
        )
      }

      if (baseType) {
        filteredData = filteredData.filter(
          (item) => item.baseType.toString() === baseType.toString()
        )
      }

      // 分页
      const start = (pageNumber - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = filteredData.slice(start, end)

      // 隐藏密码
      const maskedRecords = records.map((item) => ({
        ...item,
        basePassword: '*'.repeat(item.basePassword.length)
      }))

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {
          records: maskedRecords,
          total: filteredData.length,
          size: parseInt(pageSize),
          current: parseInt(pageNumber),
          pages: Math.ceil(filteredData.length / pageSize)
        }
      }
    }
  },

  // 新增数据源
  {
    url: '/api/zhpgxt/zhpgBase',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const newDataSource = {
        baseId: (dataSourceList.length + 1).toString(),
        ...body,
        createTime: new Date()
          .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
          .replace(/\//g, '-')
      }

      dataSourceList.unshift(newDataSource)

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {}
      }
    }
  },

  // 查询单个数据源
  {
    url: '/api/zhpgxt/zhpgBase/:baseId',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { baseId } = query
      let dataSource = dataSourceList.find((item) => item.baseId === baseId)

      // 如果找不到指定的数据源，返回第一个数据源作为默认值
      if (!dataSource) {
        dataSource = dataSourceList[0] || {
          baseId: '1',
          baseName: '默认数据源',
          baseIp: 'localhost',
          basePort: '3306',
          baseDataName: 'default_db',
          baseUser: 'admin',
          basePassword: '123456',
          baseType: 1,
          isLocalhost: 1,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      }

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: dataSource
      }
    }
  },

  // 编辑数据源
  {
    url: '/api/zhpgxt/zhpgBase/:baseId',
    method: 'put',
    timeout,
    response: ({ query, body }) => {
      const { baseId } = query
      const index = dataSourceList.findIndex((item) => item.baseId === baseId)

      if (index === -1) {
        return {
          code: '404',
          success: false,
          msg: '数据源不存在',
          data: null
        }
      }

      dataSourceList[index] = {
        ...dataSourceList[index],
        ...body
      }

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {}
      }
    }
  },

  // 删除数据源
  {
    url: '/api/zhpgxt/zhpgBase/:baseId',
    method: 'delete',
    timeout,
    response: ({ query }) => {
      const { baseId } = query
      const index = dataSourceList.findIndex((item) => item.baseId === baseId)

      if (index === -1) {
        return {
          code: '404',
          success: false,
          msg: '数据源不存在',
          data: null
        }
      }

      dataSourceList.splice(index, 1)

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {}
      }
    }
  },

  // 导出数据源
  {
    url: '/api/zhpgxt/zhpgBase/export/:baseId',
    method: 'get',
    timeout,
    rawResponse: async (req, res) => {
      try {
        // 从URL中提取baseId
        const url = req.url || ''
        const baseIdMatch = url.match(/\/export\/([^?]+)/)
        const baseId = baseIdMatch ? baseIdMatch[1] : ''

        const dataSource = dataSourceList.find((item) => item.baseId === baseId)

        if (!dataSource) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            code: '404',
            success: false,
            msg: '数据源不存在',
            data: null
          }))
          return
        }

        // 设置Content-Disposition响应头
        const filename = `datasource_${dataSource.baseName}.json`
        const encodedFilename = encodeURIComponent(filename)
        res.statusCode = 200
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`)
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

        // 返回模拟的JSON数据作为Blob
        const mockData = {
          baseId: dataSource.baseId,
          baseName: dataSource.baseName,
          baseIp: dataSource.baseIp,
          basePort: dataSource.basePort,
          baseDataName: dataSource.baseDataName,
          baseType: dataSource.baseType,
          isLocalhost: dataSource.isLocalhost,
          createTime: dataSource.createTime,
          exportTime: new Date().toISOString(),
          tables: mockTables[baseId] || [],
          data: mockTableData[baseId] || {}
        }

        res.end(JSON.stringify(mockData, null, 2))
      } catch (error) {
        console.error('导出数据源失败:', error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          code: '500',
          success: false,
          msg: '导出失败',
          data: null
        }))
      }
    }
  },

  // 导入数据源
  {
    url: '/api/zhpgxt/zhpgBase/importData/:baseDataName',
    method: 'post',
    timeout,
    response: ({ query, body }) => {
      const { baseDataName } = query

      // 模拟文件导入处理
      const newDataSource = {
        baseId: (dataSourceList.length + 1).toString(),
        baseName: `导入_${baseDataName}`,
        baseIp: '192.168.1.999',
        basePort: '3306',
        baseDataName: baseDataName,
        baseUser: 'imported_user',
        basePassword: 'imported123',
        baseType: 1,
        isLocalhost: 0,
        createTime: new Date()
          .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
          .replace(/\//g, '-')
      }

      dataSourceList.unshift(newDataSource)

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {}
      }
    }
  },

  // 分页查询数据源表
  {
    url: '/api/zhpgxt/zhpgBase/getTableNameList/:baseId',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { pageNumber = 1, pageSize = 10 } = query

      // 直接使用固定的 mock 数据
      const tables = mockTables['1']

      // 分页
      const start = (pageNumber - 1) * pageSize
      const end = start + parseInt(pageSize)
      const records = tables.slice(start, end)

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {
          records,
          total: tables.length,
          size: parseInt(pageSize),
          current: parseInt(pageNumber),
          pages: Math.ceil(tables.length / pageSize)
        }
      }
    }
  },

  // 查询数据源表的所有数据行（支持分页）
  {
    url: '/api/zhpgxt/zhpgBase/getTableAllList',
    method: 'post',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: [
          {
            id: 1,
            name: '张三',
            type: '员工',
            age: 25,
            department: '技术部',
            email: 'zhangsan@company.com',
            phone: '13800138001',
            status: '在职',
            salary: 8000,
            createTime: '2023-01-15'
          },
          {
            id: 2,
            name: '李四',
            type: '经理',
            age: 30,
            department: '销售部',
            email: 'lisi@company.com',
            phone: '13800138002',
            status: '在职',
            salary: 12000,
            createTime: '2022-08-20'
          },
          {
            id: 3,
            name: '王五',
            type: '主管',
            age: 28,
            department: '人事部',
            email: 'wangwu@company.com',
            phone: '13800138003',
            status: '在职',
            salary: 10000,
            createTime: '2023-03-10'
          },
          {
            id: 4,
            name: '赵六',
            type: '员工',
            age: 32,
            department: '财务部',
            email: 'zhaoliu@company.com',
            phone: '13800138004',
            status: '离职',
            salary: 7500,
            createTime: '2022-12-05'
          },
          {
            id: 5,
            name: '钱七',
            type: '开发',
            age: 27,
            department: '技术部',
            email: 'qianqi@company.com',
            phone: '13800138005',
            status: '在职',
            salary: 9500,
            createTime: '2023-06-01'
          }
        ]
      }
    }
  },

  // 查询数据源表字段
  {
    url: '/api/zhpgxt/zhpgBase/getTableField',
    method: 'post',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: [
          { name: 'id', comment: '主键ID', type: 'int(11)' },
          { name: 'name', comment: '名称', type: 'varchar(100)' },
          { name: 'status', comment: '状态', type: 'tinyint(1)' },
          { name: 'created_at', comment: '创建时间', type: 'datetime' },
          { name: 'updated_at', comment: '更新时间', type: 'datetime' }
        ]
      }
    }
  },

  // 根据表名获取表字段信息
  {
    url: '/api/zhpgxt/zhpgCreateTable/getTableField/:tableName',
    method: 'get',
    timeout,
    response: ({ url }) => {
      // 从 URL 中提取表名
      const tableName = url.split('/').pop()
      
      // 根据表名返回对应的字段信息，这里提供一个通用的字段结构
      const tableFields = mockTableFields[tableName] || [
        { name: 'id', comment: '主键ID', type: 'int(11)' },
        { name: 'name', comment: '姓名', type: 'varchar(50)' },
        { name: 'age', comment: '年龄', type: 'int(11)' },
        { name: 'email', comment: '邮箱', type: 'varchar(100)' },
        { name: 'department', comment: '部门', type: 'varchar(50)' },
        { name: 'salary', comment: '薪资', type: 'decimal(10,2)' },
        { name: 'create_time', comment: '创建时间', type: 'date' },
        { name: 'status', comment: '状态', type: 'varchar(20)' }
      ]

      return {
        success: true,
        code: '200',
        msg: 'SUCCESS',
        data: tableFields
      }
    }
  },

  // 获取创建表列表
  {
    url: '/api/zhpgxt/zhpgCreateTable',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { current = 1, size = 10, createTableName = '' } = query

      // 模拟创建表数据
      const mockCreateTables = [
        {
          CREATE_TIME: '2025-01-15 10:30:00',
          createType: 1, // 自建表
          createTableId: 'CT001',
          createTableName: '用户信息表',
          handType: 1, // 已处理
          TABLE_COMMENT: '存储系统用户基本信息'
        },
        {
          CREATE_TIME: '2025-01-14 14:20:00',
          createType: 2, // 其他库导入表
          createTableId: 'CT002',
          createTableName: '订单数据表',
          handType: 0, // 未处理
          TABLE_COMMENT: '电商订单详细信息记录'
        },
        {
          CREATE_TIME: '2025-01-13 09:15:00',
          createType: 3, // 文件导入表
          createTableId: 'CT003',
          createTableName: '商品库存表',
          handType: 1, // 已处理
          TABLE_COMMENT: '商品库存管理数据'
        },
        {
          CREATE_TIME: '2025-01-12 16:45:00',
          createType: 1, // 自建表
          createTableId: 'CT004',
          createTableName: '客户关系表',
          handType: 0, // 未处理
          TABLE_COMMENT: '客户关系管理信息'
        },
        {
          CREATE_TIME: '2025-01-11 11:30:00',
          createType: 2, // 其他库导入表
          createTableId: 'CT005',
          createTableName: '财务报表',
          handType: 1, // 已处理
          TABLE_COMMENT: '企业财务数据统计'
        },
        {
          CREATE_TIME: '2025-01-10 08:45:00',
          createType: 3, // 文件导入表
          createTableId: 'CT006',
          createTableName: '员工档案表',
          handType: 0, // 未处理
          TABLE_COMMENT: '公司员工基本档案信息'
        },
        {
          CREATE_TIME: '2025-01-09 15:20:00',
          createType: 1, // 自建表
          createTableId: 'CT007',
          createTableName: '产品分类表',
          handType: 1, // 已处理
          TABLE_COMMENT: '产品分类层级结构'
        },
        {
          CREATE_TIME: '2025-01-08 12:10:00',
          createType: 2, // 其他库导入表
          createTableId: 'CT008',
          createTableName: '销售数据表',
          handType: 0, // 未处理
          TABLE_COMMENT: '销售业绩统计数据'
        },
        {
          CREATE_TIME: '2025-01-07 13:25:00',
          createType: 3, // 文件导入表
          createTableId: 'CT009',
          createTableName: '供应商信息表',
          handType: 1, // 已处理
          TABLE_COMMENT: '供应商基本信息管理'
        },
        {
          CREATE_TIME: '2025-01-06 10:50:00',
          createType: 1, // 自建表
          createTableId: 'CT010',
          createTableName: '物流跟踪表',
          handType: 0, // 未处理
          TABLE_COMMENT: '物流配送跟踪信息'
        },
        {
          CREATE_TIME: '2025-01-05 14:35:00',
          createType: 2, // 其他库导入表
          createTableId: 'CT011',
          createTableName: '营销活动表',
          handType: 1, // 已处理
          TABLE_COMMENT: '营销活动策划执行数据'
        },
        {
          CREATE_TIME: '2025-01-04 09:40:00',
          createType: 3, // 文件导入表
          createTableId: 'CT012',
          createTableName: '设备维护表',
          handType: 0, // 未处理
          TABLE_COMMENT: '设备维护保养记录'
        },
        {
          CREATE_TIME: '2025-01-03 16:15:00',
          createType: 1, // 自建表
          createTableId: 'CT013',
          createTableName: '会员积分表',
          handType: 1, // 已处理
          TABLE_COMMENT: '会员积分变动记录'
        },
        {
          CREATE_TIME: '2025-01-02 11:20:00',
          createType: 2, // 其他库导入表
          createTableId: 'CT014',
          createTableName: '审计日志表',
          handType: 0, // 未处理
          TABLE_COMMENT: '系统操作审计日志'
        },
        {
          CREATE_TIME: '2025-01-01 08:30:00',
          createType: 3, // 文件导入表
          createTableId: 'CT015',
          createTableName: '配置参数表',
          handType: 1, // 已处理
          TABLE_COMMENT: '系统配置参数管理'
        },
        {
          CREATE_TIME: '2024-12-31 17:45:00',
          createType: 1, // 自建表
          createTableId: 'CT016',
          createTableName: '权限管理表',
          handType: 0, // 未处理
          TABLE_COMMENT: '用户权限分配管理'
        },
        {
          CREATE_TIME: '2024-12-30 13:10:00',
          createType: 2, // 其他库导入表
          createTableId: 'CT017',
          createTableName: '数据字典表',
          handType: 1, // 已处理
          TABLE_COMMENT: '系统数据字典配置'
        },
        {
          CREATE_TIME: '2024-12-29 10:25:00',
          createType: 3, // 文件导入表
          createTableId: 'CT018',
          createTableName: '报表模板表',
          handType: 0, // 未处理
          TABLE_COMMENT: '报表模板配置信息'
        },
        {
          CREATE_TIME: '2024-12-28 15:55:00',
          createType: 1, // 自建表
          createTableId: 'CT019',
          createTableName: '消息通知表',
          handType: 1, // 已处理
          TABLE_COMMENT: '系统消息通知记录'
        },
        {
          CREATE_TIME: '2024-12-27 12:40:00',
          createType: 2, // 其他库导入表
          createTableId: 'CT020',
          createTableName: '备份恢复表',
          handType: 0, // 未处理
          TABLE_COMMENT: '数据备份恢复记录'
        }
      ]

      // 根据搜索条件过滤数据
      let filteredData = mockCreateTables
      if (createTableName) {
        filteredData = mockCreateTables.filter((item) =>
          item.createTableName?.includes(createTableName)
        )
      }

      // 分页处理
      const pageNum = parseInt(current)
      const pageSize = parseInt(size)
      const total = filteredData.length
      const pages = Math.ceil(total / pageSize)
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = startIndex + pageSize
      const records = filteredData.slice(startIndex, endIndex)

      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {
          records,
          total,
          size: pageSize,
          current: pageNum,
          pages
        }
      }
    }
  },

  // 迁移到本地主机
  {
    url: '/api/zhpgxt/zhpgCreateTable/migrationToLocalHost',
    method: 'post',
    timeout,
    response: ({ body }) => {
      // 模拟表导入处理
      const { id, tableName, targetDatabase } = body || {}

      // 模拟导入成功的响应
      return {
        code: SUCCESS_CODE,
        success: true,
        msg: '表导入成功',
        data: {
          importId: Mock.Random.id(),
          sourceBaseId: id,
          sourceTableName: tableName,
          targetDatabase: targetDatabase || 'localhost',
          importTime: new Date()
            .toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
            .replace(/\//g, '-'),
          status: 'success',
          message: `表 ${tableName} 已成功导入到本地数据库`
        }
      }
    }
  },

  // 根据表名查询表数据
  {
    url: '/api/zhpgxt/zhpgCreateTable/selectTable/:tableName',
    method: 'get',
    timeout,
    response: ({ query, url }) => {
      // 从 URL 中提取表名
      const tableName = url.split('/').pop()
      const { current = 1, size = 20, keyword = '', id } = query
      
      console.log('selectTable 接口接收到的参数:', { tableName, id, current, size, keyword })

      // 模拟表数据结构 - 使用英文字段名
      const generateTableData = (tableName, count) => {
        return Array.from({ length: count }, (_, index) => ({
          id: index + 1,
          name: `用户${index + 1}`,
          age: Math.floor(Math.random() * 40) + 20,
          email: `user${index + 1}@example.com`,
          department: ['技术部', '市场部', '人事部', '财务部'][Math.floor(Math.random() * 4)],
          salary: Math.floor(Math.random() * 50000) + 50000,
          create_time: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: Math.random() > 0.5 ? '正常' : '禁用'
        }))
      }

      // 生成模拟数据
      const allData = generateTableData(tableName, 100)

      // 根据关键字筛选
      const filteredData = keyword
        ? allData.filter((item) =>
            Object.values(item).some((value) =>
              String(value).toLowerCase().includes(keyword.toLowerCase())
            )
          )
        : allData

      // 分页
      const startIndex = (current - 1) * size
      const endIndex = startIndex + size
      const pageData = filteredData.slice(startIndex, endIndex)

      return {
        success: true,
        code: 200,
        msg: "SUCCESS",
        data: pageData
      }
    }
  },

  // 数据转换接口 - 脏数据检测
  {
    url: '/api/zhpgxt/zhpgCreateTable/selectTable/:tableName',
    method: 'post',
    timeout,
    response: ({ body, url }) => {
      const tableName = url.split('/').pop()
      const { zsjSelectDataList } = body || {}
      
      console.log('脏数据检测请求:', { tableName, zsjSelectDataList })
      
      // 模拟检测结果
      const detectionResults = zsjSelectDataList?.map(config => ({
        field: config.name,
        type: config.type,
        regexp: config.regexp,
        issueCount: Math.floor(Math.random() * 10), // 随机问题数量
        issues: [
          { rowIndex: 1, value: 'test', reason: '格式不匹配' },
          { rowIndex: 3, value: null, reason: '空值' }
        ]
      })) || []
      
      return {
        success: true,
        code: '200',
        msg: 'SUCCESS',
        data: {
          totalIssues: detectionResults.reduce((sum, result) => sum + result.issueCount, 0),
          results: detectionResults
        }
      }
    }
  },

  // 数据转换接口 - 缺失值填充
  {
    url: '/api/zhpgxt/zhpgCreateTable/dataConversion/missingValueFill/:tableName',
    method: 'post',
    timeout,
    response: ({ body, url }) => {
      const tableName = url.split('/').pop()
      const { qszSelectDataList } = body || {}
      
      console.log('缺失值填充请求:', { tableName, qszSelectDataList })
      
      // 模拟填充结果
      const fillResults = qszSelectDataList?.map(config => ({
        field: config.name,
        value: config.value,
        filledCount: Math.floor(Math.random() * 20) // 随机填充数量
      })) || []
      
      return {
        success: true,
        code: '200',
        msg: 'SUCCESS',
        data: {
          totalFilled: fillResults.reduce((sum, result) => sum + result.filledCount, 0),
          results: fillResults
        }
      }
    }
  },

  // 数据转换接口 - 野值剔除
  {
    url: '/api/zhpgxt/zhpgCreateTable/dataConversion/outlierRemoval/:tableName',
    method: 'post',
    timeout,
    response: ({ body, url }) => {
      const tableName = url.split('/').pop()
      const { fields, minValue, maxValue } = body || {}
      
      console.log('野值剔除请求:', { tableName, fields, minValue, maxValue })
      
      // 模拟剔除结果
      const removalResults = fields?.map(field => ({
        field: field,
        minValue: minValue,
        maxValue: maxValue,
        removedCount: Math.floor(Math.random() * 5) // 随机剔除数量
      })) || []
      
      return {
        success: true,
        code: '200',
        msg: 'SUCCESS',
        data: {
          totalRemoved: removalResults.reduce((sum, result) => sum + result.removedCount, 0),
          results: removalResults
        }
      }
    }
  }
]
