import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const evaluationResultRoutes: AppRouteRecordRaw[] = [
  {
    path: '/evaluation-result',
    component: Layout,
    name: 'EvaluationResult',
    meta: {
      title: '评估结果生成',
      icon: 'vi-ep:data-line',
      alwaysShow: true
    },
    redirect: '/evaluation-result/task-list',
    children: [
      {
        path: 'task-list',
        component: () => import('@/views/EvaluationResult/TaskManagement/list.vue'),
        name: 'EvaluationResultTaskManagement',
        meta: {
          title: '评估结果管理',
          icon: 'vi-ep:list'
        }
      },
      {
        path: 'template-list',
        component: () => import('@/views/EvaluationResult/TemplateManagement/list.vue'),
        name: 'EvaluationResultTemplate',
        meta: {
          title: '报告模板管理',
          icon: 'vi-ep:document-copy'
        }
      }
    ]
  }
]