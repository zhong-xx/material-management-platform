import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: 'message/:type',
        component: () => import('@/components/Message.vue'),
        props: true
      },
      {
        path: 'addMaterial/:type',
        components: {
          default: () => import('@/components/Message.vue'),
          add: () => import('@/components/OperationMessage.vue')
        },
        props: {
          default: true,
          add: true
        }
      },
      {
        path: 'modifyMaterial/:type/:id',
        components: {
          default: () => import('@/components/Message.vue'),
          modify: () => import('@/components/OperationMessage.vue')
        },
        props: {
          default: true,
          modify: true
        }
      },
      {
        path: '/',
        redirect: '/message/居住类'
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
