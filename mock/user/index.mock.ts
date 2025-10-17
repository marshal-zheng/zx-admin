import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

const List: {
  username: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
  realName?: string
  department?: string
  phone?: string
}[] = [
  {
    username: 'admin',
    password: 'admin',
    role: '系统管理员',
    roleId: '1',
    permissions: ['*.*.*'],
    realName: '系统管理员',
    department: '信息技术部',
    phone: '13800138000'
  },
  {
    username: 'safety_expert',
    password: '123456',
    role: '安全评估专家',
    roleId: '2',
    permissions: [
      'evaluation:create',
      'evaluation:edit',
      'evaluation:delete',
      'evaluation:view',
      'analysis:view',
      'report:create',
      'report:edit'
    ],
    realName: '张安全',
    department: '安全评估部',
    phone: '13800138001'
  },
  {
    username: 'emergency_expert',
    password: '123456',
    role: '应急响应专家',
    roleId: '3',
    permissions: [
      'emergency:create',
      'emergency:edit',
      'emergency:view',
      'response:manage',
      'analysis:view',
      'report:view'
    ],
    realName: '李应急',
    department: '应急管理部',
    phone: '13800138002'
  },
  {
    username: 'risk_analyst',
    password: '123456',
    role: '风险分析师',
    roleId: '4',
    permissions: [
      'risk:analyze',
      'risk:view',
      'evaluation:view',
      'analysis:create',
      'analysis:edit',
      'analysis:view'
    ],
    realName: '王评估',
    department: '风险分析部',
    phone: '13800138003'
  },
  {
    username: 'fire_expert',
    password: '123456',
    role: '消防专家',
    roleId: '5',
    permissions: [
      'fire:evaluate',
      'fire:view',
      'equipment:check',
      'response:view',
      'report:view'
    ],
    realName: '陈消防',
    department: '消防安全部',
    phone: '13800138004'
  },
  {
    username: 'env_expert',
    password: '123456',
    role: '环境影响专家',
    roleId: '6',
    permissions: [
      'environment:evaluate',
      'environment:view',
      'pollution:assess',
      'analysis:view',
      'report:create'
    ],
    realName: '刘环保',
    department: '环境保护部',
    phone: '13800138005'
  },
  {
    username: 'auditor',
    password: '123456',
    role: '质量审核员',
    roleId: '7',
    permissions: [
      'audit:review',
      'audit:approve',
      'evaluation:view',
      'report:review',
      'report:approve'
    ],
    realName: '赵审核',
    department: '质量控制部',
    phone: '13800138006'
  },
  {
    username: 'operator',
    password: '123456',
    role: '系统操作员',
    roleId: '8',
    permissions: [
      'data:input',
      'data:view',
      'evaluation:view',
      'report:view'
    ],
    realName: '孙操作',
    department: '数据管理部',
    phone: '13800138007'
  }
]

export default [
  // 列表接口
  {
    url: '/mock/user/list',
    method: 'get',
    response: ({ query }) => {
      const { username, pageIndex, pageSize } = query

      const mockList = List.filter((item) => {
        if (username && item.username.indexOf(username) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )

      return {
        code: SUCCESS_CODE,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },
  // 登录接口
  {
    url: '/mock/user/login',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const data = body
      let hasUser = false
      for (const user of List) {
        if (user.username === data.username && user.password === data.password) {
          hasUser = true
          return {
            code: SUCCESS_CODE,
            data: user
          }
        }
      }
      if (!hasUser) {
        return {
          code: 500,
          message: '账号或密码错误'
        }
      }
    }
  },
  // 退出接口
  {
    url: '/mock/user/loginOut',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: null
      }
    }
  }
]
