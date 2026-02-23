import { Store } from '@tauri-apps/plugin-store';

let storeInstance: Store | null = null;

/**
 * 初始化全局store
 */
export const initStore = async (): Promise<Store> => {
  if (storeInstance) return storeInstance;
  
  try {
    storeInstance = await Store.load('app-store.json', {
      defaults: {
        dark: false,
        collapse: true
      },
      overrideDefaults: true
    });
    // console.log('全局Store初始化成功');
    return storeInstance;
  } catch (error) {
    console.error('Store初始化失败:', error);
    throw error;
  }
};

/**
 * 获取store实例
 */
export const getStore = async (): Promise<Store> => {
  if (!storeInstance) {
    return await initStore();
  }
  return storeInstance;
};

/**
 * 获取存储值
 */
export const getStoreValue = async <T = any>(key: string, defaultValue?: T): Promise<T | undefined> => {
  const store = await getStore();
  const value = await store.get<T>(key);
  return value !== undefined ? value : defaultValue;
};

/**
 * 设置存储值
 */
export const setStoreValue = async <T = any>(key: string, value: T): Promise<void> => {
  const store = await getStore();
  await store.set(key, value);
};

/**
 * 删除存储值
 */
export const deleteStoreValue = async (key: string): Promise<void> => {
  const store = await getStore();
  await store.delete(key);
};

/**
 * 清空所有存储值
 */
export const clearStore = async (): Promise<void> => {
  const store = await getStore();
  await store.clear();
};