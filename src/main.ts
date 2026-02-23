import { createApp } from 'vue'
import App from './App.vue'
// 引入 Element Plus 核心库
import ElementPlus from 'element-plus'
// 引入全局样式 - 基础样式
import 'element-plus/dist/index.css'
// 引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入图标库（可选）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index.ts'
import { initStore } from './utils/store'

const app = createApp(App)

// 全局注册 Element Plus
app.use(ElementPlus)

// 全局注册所有图标（可选）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局注册路由
app.use(router)

// 初始化全局store
initStore().catch(error => {
  console.error('应用启动时初始化store失败:', error)
})

app.mount('#app')