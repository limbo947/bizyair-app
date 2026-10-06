/**
 * 模型 ID 迁移表 —— 存量本地数据（收藏 / 主页状态）中旧 key 到当前 key 的映射。
 * 仅"处置=映射"的模型进表；"处置=下架"的不进表（由 MODELS 过滤与 getModelInfo
 * 兜底自然淘汰），避免迁移到不存在的 key。
 * 供 FavoritesContext 与 HistoryProvider.loadHomeState 共用，防止两边各自维护漂移。
 */
export const MODEL_ID_MIGRATIONS = {
  // 存量 typo 迁移：国际版拼写已修正（旧表中 offcial 曾误迁到下架候选 extend 型号，一并修正）
  'wan-2-7-image-pro-offcial': 'wan-2-7-image-pro-official',
  'wan-2-7-offcial': 'wan-2-7-official',
  // 国际版改挂 nano-banana-2-channel（渠道版语义不变）
  'bza-image-b2-base': 'nano-banana-2-channel',
  // Gemini 新 3 替 4 旧（领导裁决，仅收藏与 homeState 数据自愈）：
  // G3 Flash → gemini-3-5、G3.1 Flash-Lite → gemini-3.6（chat / vision 同规）
  'bza-chat-g3-flash-official': 'gemini-3-5-flash-official',
  'bza-vision-g3-flash-official': 'gemini-3-5-flash-official',
  'bza-chat-g3-1-flash-lite-official': 'gemini-3-6-flash-official',
  'bza-vision-g3-1-flash-lite-official': 'gemini-3-6-flash-official',
};
