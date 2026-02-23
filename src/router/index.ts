import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import Home from '@/views/Home.vue'
import Setting from '@/views/Setting.vue'

const routes = [
  {
    path: '/',
    component: Layout, // 父路由使用布局组件
    redirect: '/home', // 默认跳转到首页
    children: [ // 子路由渲染在 Layout 的 RouterView 中
      { path: 'home', component: Home },
      { path: 'setting', component: Setting }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router