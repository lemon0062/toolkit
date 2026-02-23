<template>
  <main class="home-page">
    <div class="header-section">
      <h1 class="page-title">
        <el-icon class="title-icon"><Monitor /></el-icon>
        应用工具箱
      </h1>
      <p class="page-description">管理您的常用应用程序，一键启动所有应用</p>
    </div>

    <div class="action-section">
      <el-button 
        type="primary" 
        size="large" 
        class="launch-all-btn"
        @click="handleLaunchAll"
        :loading="isLaunching"
      >
        <el-icon><Promotion /></el-icon>
        一键启动所有应用
      </el-button>
    </div>

    <div class="apps-section">
      <div class="section-header">
        <h2>应用列表</h2>
        <el-tag type="info">共 {{ applist.length }} 个应用</el-tag>
      </div>
      
      <div class="apps-grid" v-if="applist.length > 0">
        <div 
          class="app-card" 
          v-for="app in applist" 
          :key="app.id"
          @click="handleLaunchApp(app)"
        >
          <div class="app-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="app-info">
            <h3 class="app-name">{{ app.name }}</h3>
            <p class="app-path">{{ formatPath(app.url) }}</p>
          </div>
          <div class="app-actions">
            <el-button 
              type="success" 
              size="small" 
              circle
              @click.stop="handleLaunchApp(app)"
            >
              <el-icon><VideoPlay /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      
      <el-empty 
        v-else 
        description="暂无应用"
        class="empty-state"
      >
        <el-button type="primary" @click="$router.push('/setting')">
          去添加应用
        </el-button>
      </el-empty>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { openPath } from '@tauri-apps/plugin-opener';
import { applicationManage } from '@/type/applicationManage';
import { ElMessage } from 'element-plus';
import { Monitor, Promotion, Document, VideoPlay } from '@element-plus/icons-vue';
import { applications } from '@/type';

// 响应式数据
const applist = ref<applications[]>([]);
const isLaunching = ref(false);

// 组件挂载时初始化应用列表
onMounted(async () => {
  try {
    await applicationManage.initialize();
    applist.value = await applicationManage.getApplications();
  } catch (error) {
    console.error('初始化应用列表失败:', error);
    ElMessage.error('初始化应用列表失败');
  }
});

// 一键启动所有应用
const handleLaunchAll = async () => {
  if (applist.value.length === 0) {
    ElMessage.warning('暂无应用可启动');
    return;
  }
  
  isLaunching.value = true;
  
  try {
    for (const app of applist.value) {
      await openPath(app.url);
      // 添加延迟，避免同时打开太多应用
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    ElMessage.success(`成功启动 ${applist.value.length} 个应用`);
  } catch (error) {
    console.error('打开应用失败:', error);
    ElMessage.error('打开应用失败');
  } finally {
    isLaunching.value = false;
  }
};

// 启动单个应用
const handleLaunchApp = async (app: applications) => {
  try {
    await openPath(app.url);
    ElMessage.success(`正在启动 ${app.name}`);
  } catch (error) {
    console.error(`打开应用 ${app.name} 失败:`, error);
    ElMessage.error(`打开应用 ${app.name} 失败`);
  }
};

// 格式化路径显示
const formatPath = (path: string): string => {
  if (path.length > 40) {
    return '...' + path.substring(path.length - 37);
  }
  return path;
};
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  color: #409EFF;
}

.page-description {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.action-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.launch-all-btn {
  padding: 14px 32px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.launch-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.apps-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.app-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.app-card:hover {
  background-color: #f0f9ff;
  border-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #409EFF;
  color: white;
  border-radius: 8px;
  margin-right: 16px;
  flex-shrink: 0;
}

.app-info {
  flex: 1;
  min-width: 0;
}

.app-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-path {
  font-size: 12px;
  color: #909399;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-actions {
  margin-left: 12px;
}

.empty-state {
  padding: 40px 0;
}

@media (max-width: 768px) {
  .apps-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .launch-all-btn {
    width: 100%;
  }
}
</style>