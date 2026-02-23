// 导入 Tauri 2.0 的对话框 API
import { open } from '@tauri-apps/plugin-dialog'
// 可选：导入文件系统工具函数（处理路径格式）
import { normalize } from '@tauri-apps/api/path'
import { ElMessage } from 'element-plus'
/**
 * 选择单个文件并获取绝对路径
 */
export const selectFile = async () => {
  try {
    // 打开文件选择对话框
    const filePath = await open({
      multiple: false, // 仅允许选择单个文件
      filters: [ // 可选：过滤文件类型
        { name: '应用程序', extensions: ['exe'] }
      ]
    })

    if (filePath) {
      // 标准化路径（适配 Windows/macOS/Linux 不同路径分隔符）
      const normalizedPath = await normalize(filePath as string)
      return normalizedPath
    } else {
      return null
    }
  } catch (error) {
    ElMessage.error('选择文件失败')
    console.error('选择文件失败：', error)
  }
}


/**
 * 选择文件夹并获取绝对路径
 */
export const selectFolder = async () => {
  try {
    // 打开文件夹选择对话框
    const folderPath = await open({
      directory: true, // 开启文件夹选择模式
      multiple: false
    })

    if (folderPath) {
      const normalizedPath = await normalize(folderPath as string)
      return normalizedPath
    } else {
      return null
    }
  } catch (error) {
    ElMessage.error('选择文件夹失败')
    console.error('选择文件夹失败：', error)
  }
}