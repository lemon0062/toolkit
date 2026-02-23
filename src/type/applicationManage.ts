/**
 * 应用管理模块
 * 
 * 提供应用程序的增删改查功能，支持本地存储持久化
 * 使用单例模式确保全局只有一个应用管理实例
 * 
 * @author sleeep
 * @since 1.0.0
 */

import { applications } from "."
import { getStoreValue, setStoreValue } from "@/utils/store"

/**
 * 应用管理类 - 单例模式
 * 负责管理应用程序的增删改查操作，支持本地存储持久化
 */
class ApplicationManage {
    /**
     * 类的唯一实例
     * @static
     * @private
     * @type {ApplicationManage}
     */
    private static instance: ApplicationManage

    /**
     * 应用列表
     * @private
     * @type {applications[]}
     */
    private applist: applications[] = []
    
    /**
     * 初始化状态标志
     * @private
     * @type {boolean}
     */
    private initialized: boolean = false

    /**
     * 私有构造函数，防止外部直接实例化
     * @private
     */
    private constructor() {}
    
    /**
     * 获取类的唯一实例（单例模式）
     * @static
     * @public
     * @returns {ApplicationManage} 应用管理类的唯一实例
     */
    public static getInstance(): ApplicationManage {
        if (!ApplicationManage.instance) {
            ApplicationManage.instance = new ApplicationManage()
        }
        return ApplicationManage.instance
    }

    /**
     * 初始化应用管理器，从本地存储加载应用列表
     * @public
     * @async
     * @returns {Promise<void>}
     * @description 如果已经初始化过，则直接返回；否则从存储中加载数据
     */
    public async initialize(): Promise<void> {
        if (this.initialized) return;
        
        try {
            // 从存储中获取应用列表，如果不存在则使用空数组
            const storedList = await getStoreValue<applications[]>('applicationsList', []);
            this.applist = storedList || [];
            this.initialized = true;
        } catch (error) {
            console.error('初始化应用列表失败:', error);
            // 初始化失败时使用空列表
            this.applist = [];
            this.initialized = true;
        }
    }

    /**
     * 确保应用管理器已初始化
     * @private
     * @async
     * @returns {Promise<void>}
     * @description 在执行任何操作前调用，确保数据已加载
     */
    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
    }

    /**
     * 添加新应用或更新已存在的应用
     * @param application 要添加的应用对象（不需要提供ID）
     * @returns {Promise<number>} 返回应用的ID（新增或更新后的ID）
     */
    public async addApplication(application: Omit<applications, 'id'>): Promise<number> {
        await this.ensureInitialized();
        
        // 检查是否已存在相同名称的应用
        const existingAppIndex = this.applist.findIndex(app => app.name === application.name);
        
        if (existingAppIndex !== -1) {
            // 如果已存在相同名称的应用，更新该应用（保留原ID）
            const existingId = this.applist[existingAppIndex].id;
            this.applist[existingAppIndex] = {
                ...application,
                id: existingId
            };
            
            // 保存到存储
            await this.saveToStore();
            
            // 返回已存在应用的ID
            return existingId;
        } else {
            // 如果不存在相同名称的应用，创建新应用
            const newId = this.generateUniqueId();
            const newApplication: applications = {
                ...application,
                id: newId
            };
            
            // 添加到列表
            this.applist.push(newApplication);
            
            // 保存到存储
            await this.saveToStore();
            
            // 返回新ID
            return newId;
        }
    }

    /**
     * 获取所有应用的列表
     * @public
     * @async
     * @returns {Promise<applications[]>} 应用列表的副本
     * @description 返回应用列表的副本以防止外部修改，确保数据完整性
     */
    public async getApplications(): Promise<applications[]> {
        await this.ensureInitialized();
        // 使用扩展运算符创建数组副本，防止外部修改原始数据
        return [...this.applist];
    }

    /**
     * 根据ID删除指定的应用对象
     * @param id 要删除的应用ID
     * @returns {Promise<boolean>} 删除成功返回true，未找到对应ID返回false
     */
    public async deleteApplicationById(id: number): Promise<boolean> {
        await this.ensureInitialized();
        
        // 查找要删除的应用的索引
        const indexToDelete = this.applist.findIndex(app => app.id === id);
        
        // 如果找到了对应ID的应用
        if (indexToDelete !== -1) {
            // 从数组中删除该应用
            this.applist.splice(indexToDelete, 1);
            // 保存更新后的列表到存储
            await this.saveToStore();
            return true;
        }
        
        // 未找到对应ID的应用
        return false;
    }

    /**
     * 根据ID获取指定的应用对象
     * @param id 要获取的应用ID
     * @returns {Promise<applications | null>} 找到返回应用对象，未找到返回null
     */
    public async getApplicationById(id: number): Promise<applications | null> {
        await this.ensureInitialized();
        
        // 查找对应ID的应用
        const application = this.applist.find(app => app.id === id);
        
        // 返回找到的应用或null
        return application || null;
    }

    /**
     * 根据名称获取指定的应用对象
     * @param name 要获取的应用名称
     * @returns {Promise<applications | null>} 找到返回应用对象，未找到返回null
     */
    public async getApplicationByName(name: string): Promise<applications | null> {
        await this.ensureInitialized();
        
        // 查找对应名称的应用
        const application = this.applist.find(app => app.name === name);
        
        // 返回找到的应用或null
        return application || null;
    }

    /**
     * 根据名称删除指定的应用对象
     * @param name 要删除的应用名称
     * @returns {Promise<boolean>} 删除成功返回true，未找到对应名称返回false
     */
    public async deleteApplicationByName(name: string): Promise<boolean> {
        await this.ensureInitialized();
        
        // 查找要删除的应用的索引
        const indexToDelete = this.applist.findIndex(app => app.name === name);
        
        // 如果找到了对应名称的应用
        if (indexToDelete !== -1) {
            // 从数组中删除该应用
            this.applist.splice(indexToDelete, 1);
            // 保存更新后的列表到存储
            await this.saveToStore();
            return true;
        }
        
        // 未找到对应名称的应用
        return false;
    }

    /**
     * 生成新的唯一ID
     * @private
     * @returns {number} 新的唯一ID
     */
    private generateUniqueId(): number {
        // 如果列表为空，返回1
        if (this.applist.length === 0) {
            return 1;
        }
        
        // 找到当前最大的ID值
        const maxId = Math.max(...this.applist.map(app => app.id));
        
        // 返回最大ID+1作为新ID
        return maxId + 1;
    }

    /**
     * 将应用列表保存到本地存储
     * @private
     * @async
     * @returns {Promise<void>}
     * @description 使用 Tauri 的 store 插件将当前应用列表持久化到本地
     * @throws {Error} 当保存失败时抛出错误
     */
    private async saveToStore(): Promise<void> {
        try {
            // 将应用列表保存到存储中，键名为 'applicationsList'
            await setStoreValue('applicationsList', this.applist);
        } catch (error) {
            // 保存失败时记录错误信息到控制台
            console.error('保存应用列表失败:', error);
        }
    }
}

/**
 * 应用管理器的单例实例
 * 导出供其他模块使用
 * @type {ApplicationManage}
 */
export const applicationManage = ApplicationManage.getInstance()