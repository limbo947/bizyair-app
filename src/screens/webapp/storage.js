import AsyncStorage from '@react-native-async-storage/async-storage';

export const WEBAPP_SAVED_LIST_KEY = '@webapp_saved_list';

/** 从 AsyncStorage 加载已保存应用列表 */
export async function loadSavedApps() {
  try {
    const raw = await AsyncStorage.getItem(WEBAPP_SAVED_LIST_KEY);
    if (raw) { const list = JSON.parse(raw); return Array.isArray(list) ? list : []; }
  } catch (e) { console.error('加载应用列表失败:', e); }
  return [];
}

/** 保存应用列表到 AsyncStorage */
export async function persistSavedApps(list) {
  try { await AsyncStorage.setItem(WEBAPP_SAVED_LIST_KEY, JSON.stringify(list)); } catch (e) { console.error('保存应用列表失败:', e); }
}
