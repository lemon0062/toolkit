<template>
  <main>
    <el-row>
      <el-col :span="24">
        <h1>设置</h1>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button class="add-btn" type="primary" @click="handleClick">添加应用程序</el-button>
      </el-col>
      <el-col :span="24">
        <el-table :data="applist" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="url" label="URL" />
          <el-table-column prop="action" label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { selectFile } from '@/utils/File'
import { ElMessage } from 'element-plus'
import { applicationManage } from '@/type/applicationManage'
import { applications } from '@/type'

// 存储选中的绝对路径
const selectedPath = ref<string | null>(null)
const applist = ref<applications[]>([])

// 初始化应用列表
const initializeAppList = async () => {
  try {
    // 初始化应用管理器
    await applicationManage.initialize()
    // 获取应用列表
    applist.value = await applicationManage.getApplications()
  } catch (error) {
    console.error('初始化应用列表失败:', error)
    ElMessage.error('初始化应用列表失败')
  }
}

// 组件挂载时初始化应用列表
initializeAppList()

// 处理选择应用程序按钮点击事件
const handleClick = async () => {
  const path = await selectFile()
  if (path) {
    selectedPath.value = path

    // 使用 addApplication 方法，现在只需要提供 name 和 url
    const appName = path.split('\\').pop()?.split('.')[0] || '新应用'
    await applicationManage.addApplication({
      name: appName,
      url: path
    })

    // 获取更新后的应用列表
    applist.value = await applicationManage.getApplications()

    console.log(selectedPath.value)
    ElMessage.success(`应用程序路径：${path}`)
  }
}

// 处理删除应用程序按钮点击事件
const handleDelete = async (row: applications) => {
  try {
    await applicationManage.deleteApplicationById(row.id)
    // 更新应用列表
    applist.value = await applicationManage.getApplications()
    ElMessage.success('应用程序删除成功')
  } catch (error) {
    console.error('删除应用程序失败:', error)
    ElMessage.error('删除应用程序失败')
  }
}



</script>

<style scoped>
.add-btn {
  margin-bottom: 10px;
}
</style>
