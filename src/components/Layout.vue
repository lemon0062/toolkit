<template>
  <div class="layout-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <el-icon size="32">
          <HelpFilled />
        </el-icon>
      </div>
      <!-- 导航菜单，使用 RouterLink 实现跳转 -->
      <el-menu default-active="/home" class="sidebar-menu" router :collapse="!collapseValue">
        <el-menu-item index="/home">
          <el-icon>
            <House />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <el-icon>
            <Setting />
          </el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-switch-container">
        <el-switch size="large" v-model="collapseValue" @change="toggleCollapse" class="sidebar-switch" :active-action-icon="Fold"
          :inactive-action-icon="Expand" inline-prompt />
        <el-switch size="large" v-model="themeValue" @change="toggleTheme" :active-action-icon="MoonNight" :inactive-action-icon="Sunrise"
          inline-prompt />
      </div>
    </div>
    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 路由视图：渲染匹配的页面组件 -->
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入 Element Plus 图标
import { House, Setting, HelpFilled, Expand, Fold, Sunrise, MoonNight } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { getStoreValue, setStoreValue } from '../utils/store'

const collapseValue = ref(false)
const themeValue = ref(false)

const toggleCollapse = () => {
  if (collapseValue.value) {
    setStoreValue('collapse', true)
  } else {
    setStoreValue('collapse', false)
  }
}

const toggleTheme = () => {
  if (themeValue.value) {
    console.log('切换为暗黑模式')
    document.documentElement.classList.add('dark')
    setStoreValue('dark', true)
  } else {
    console.log('切换为默认模式')
    document.documentElement.classList.remove('dark')
    setStoreValue('dark', false)
  }
}

onMounted(async () => {
  try {
    // 从 store 中获取 num 值
    const storedDark = await getStoreValue<boolean>('dark', false);
    themeValue.value = storedDark ?? false;
    if (themeValue.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // 从 store 中获取 collapse 值
    const storedCollapse = await getStoreValue<boolean>('collapse', false);
    collapseValue.value = storedCollapse ?? true;
  } catch (error) {
    console.error('主题初始化失败:', error);
  }
});
</script>

<style scoped>
/* 整体布局容器 */
.layout-container {
  display: flex;
  width: 100%;
  height: 95vh;
}

/* 左侧导航栏 */
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
}

.sidebar-switch-container {
  display: flex;
  flex-direction: column;
  margin-top: auto;
}

/* 右侧内容区 */
.main-content {
  flex: 1;
  /* 占满剩余宽度 */
  padding: 12px;
  overflow: auto;
}

.el-menu--horizontal {
  --el-menu-horizontal-height: 100%;
}
</style>