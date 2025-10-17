import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const evaluationRoutes: AppRouteRecordRaw[] = [
  {
    path: '/evaluation',
    component: Layout,
    name: 'EvaluationManagement',
    meta: {
      title: t('router.evaluationManagement'),
      icon: 'vi-ep:edit-pen',
      alwaysShow: true
    },
    redirect: '/evaluation/task-list',
    children: [
      {
        path: 'task-list',
        component: () => import('@/views/Evaluation/TaskManagement/list.vue'),
        name: 'TaskManagement',
        meta: {
          title: t('router.taskManagement'),
          icon: 'vi-ep:list'
        }
      },
      {
        path: 'template-list',
        component: () => import('@/views/Evaluation/TemplateManagement/list.vue'),
        name: 'TemplateManagement',
        meta: {
          title: t('router.templateManagement'),
          icon: 'vi-ep:document'
        }
      },
      {
        path: 'task-wizard',
        component: () => import('@/views/Evaluation/TaskManagement/taskWizard.vue'),
        name: 'TaskWizard',
        meta: {
          title: '创建评估任务',
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation/task-list'
        }
      },
      {
        path: 'task-detail/:id',
        component: () => import('@/views/Evaluation/TaskManagement/detail.vue'),
        name: 'EvaluationDetail',
        meta: {
          title: t('router.evaluationDetail'),
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation/task-list'
        }
      },
      {
        path: 'template-detail/:id',
        component: () => import('@/views/Evaluation/TemplateManagement/detail.vue'),
        name: 'TemplateDetail',
        meta: {
          title: t('router.templateDetail'),
          noTagsView: true,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/evaluation/template-list'
        }
      }
    ]
  }
]
