import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'

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
      tableName: 'users',
      tableComment: '用户信息表',
      rowCount: 1500,
      createTime: '2024-01-01 10:00:00'
    },
    {
      tableName: 'orders',
      tableComment: '订单信息表',
      rowCount: 8500,
      createTime: '2024-01-02 11:30:00'
    },
    {
      tableName: 'products',
      tableComment: '商品信息表',
      rowCount: 320,
      createTime: '2024-01-03 09:15:00'
    },
    {
      tableName: 'categories',
      tableComment: '商品分类表',
      rowCount: 25,
      createTime: '2024-01-04 14:20:00'
    },
    {
      tableName: 'order_items',
      tableComment: '订单明细表',
      rowCount: 15600,
      createTime: '2024-01-05 16:45:00'
    },
    {
      tableName: 'customers',
      tableComment: '客户信息表',
      rowCount: 2800,
      createTime: '2024-01-06 08:30:00'
    },
    {
      tableName: 'suppliers',
      tableComment: '供应商信息表',
      rowCount: 150,
      createTime: '2024-01-07 13:10:00'
    },
    {
      tableName: 'inventory',
      tableComment: '库存管理表',
      rowCount: 5200,
      createTime: '2024-01-08 10:45:00'
    },
    {
      tableName: 'payments',
      tableComment: '支付记录表',
      rowCount: 12300,
      createTime: '2024-01-09 15:20:00'
    },
    {
      tableName: 'reviews',
      tableComment: '商品评价表',
      rowCount: 3400,
      createTime: '2024-01-10 12:00:00'
    },
    {
      tableName: 'coupons',
      tableComment: '优惠券表',
      rowCount: 680,
      createTime: '2024-01-11 09:30:00'
    },
    {
      tableName: 'shipping',
      tableComment: '物流信息表',
      rowCount: 7800,
      createTime: '2024-01-12 14:15:00'
    },
    {
      tableName: 'user_profiles',
      tableComment: '用户详细资料表',
      rowCount: 1450,
      createTime: '2024-01-13 11:40:00'
    },
    {
      tableName: 'product_images',
      tableComment: '商品图片表',
      rowCount: 2100,
      createTime: '2024-01-14 16:25:00'
    },
    {
      tableName: 'order_status_log',
      tableComment: '订单状态变更日志表',
      rowCount: 18900,
      createTime: '2024-01-15 08:50:00'
    },
    {
      tableName: 'shopping_cart',
      tableComment: '购物车表',
      rowCount: 4200,
      createTime: '2024-01-16 13:35:00'
    },
    {
      tableName: 'wishlists',
      tableComment: '心愿单表',
      rowCount: 890,
      createTime: '2024-01-17 10:20:00'
    },
    {
      tableName: 'notifications',
      tableComment: '系统通知表',
      rowCount: 6700,
      createTime: '2024-01-18 15:05:00'
    },
    {
      tableName: 'audit_logs',
      tableComment: '操作审计日志表',
      rowCount: 25600,
      createTime: '2024-01-19 09:10:00'
    },
    {
      tableName: 'system_config',
      tableComment: '系统配置表',
      rowCount: 45,
      createTime: '2024-01-20 12:55:00'
    }
  ],
  '2': [
    {
      tableName: 'test_users',
      tableComment: '测试用户表',
      rowCount: 100,
      createTime: '2024-01-01 10:00:00'
    },
    {
      tableName: 'test_orders',
      tableComment: '测试订单表',
      rowCount: 500,
      createTime: '2024-01-02 11:30:00'
    },
    {
      tableName: 'test_products',
      tableComment: '测试商品表',
      rowCount: 50,
      createTime: '2024-01-03 09:15:00'
    }
  ],
  '3': [
    {
      tableName: 'dm_users',
      tableComment: '达梦用户表',
      rowCount: 200,
      createTime: '2024-01-01 10:00:00'
    },
    {
      tableName: 'dm_logs',
      tableComment: '达梦日志表',
      rowCount: 5000,
      createTime: '2024-01-02 11:30:00'
    },
    {
      tableName: 'dm_config',
      tableComment: '达梦配置表',
      rowCount: 10,
      createTime: '2024-01-03 09:15:00'
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
      const dataSource = dataSourceList.find((item) => item.baseId === baseId)

      if (!dataSource) {
        return {
          code: '404',
          success: false,
          msg: '数据源不存在',
          data: null
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
    response: ({ query }) => {
      const { baseId } = query
      const dataSource = dataSourceList.find((item) => item.baseId === baseId)

      if (!dataSource) {
        return {
          code: '404',
          success: false,
          msg: '数据源不存在',
          data: null
        }
      }

      // 模拟文件下载
      return {
        code: SUCCESS_CODE,
        success: true,
        msg: 'SUCCESS',
        data: {
          downloadUrl: `/download/datasource_${baseId}.json`,
          filename: `datasource_${dataSource.baseName}.json`
        }
      }
    }
  },

  // 导入数据源
  {
    url: '/api/zhpgxt/zhpgBase/import/:baseDataName',
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
        data: {
          records: [
            { id: 1, name: 'admin', type: 'user' },
            { id: 2, name: 'user1', type: 'user' },
            { id: 3, name: 'user2', type: 'user' },
            { id: 4, name: 'manager', type: 'admin' },
            { id: 5, name: 'guest', type: 'guest' }
          ],
          total: 100,
          size: 10,
          current: 1,
          pages: 10
        }
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
  }
]
