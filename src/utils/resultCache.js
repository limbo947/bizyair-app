import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

const CACHE_DIR = 'bizyair_results';

/**
 * 从远程 URL 提取文件扩展名
 */
function getExt(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.(png|jpg|jpeg|webp|gif|mp4|mov|mp3|wav|ogg|flac|aac|txt|json)$/i);
    return match ? match[1].toLowerCase() : 'bin';
  } catch {
    return 'bin';
  }
}

/**
 * 生成缓存文件路径
 * 格式: {document}/bizyair_results/{historyId}_{index}.{ext}
 */
function cachePath(historyId, index, ext) {
  return new File(Paths.document, `${CACHE_DIR}/${historyId}_${index}.${ext}`);
}

/**
 * 获取缓存目录的 File 对象
 */
function cacheDir() {
  return new File(Paths.document, CACHE_DIR);
}

/**
 * 确保缓存目录存在
 */
async function ensureCacheDir() {
  const dir = cacheDir();
  if (!(await dir.exists())) {
    await dir.create();
  }
}

/**
 * 下载单个远程文件到本地缓存
 * @param {string} url - 远程 URL
 * @param {string} historyId - 历史记录 ID
 * @param {number} index - 文件序号
 * @returns {string|null} 本地文件 URI，失败返回 null
 */
export async function cacheRemoteFile(url, historyId, index) {
  if (!url || Platform.OS === 'web') return null;

  try {
    const ext = getExt(url);
    const dest = cachePath(historyId, index, ext);

    // 已缓存则直接返回
    if (await dest.exists()) return dest.uri;

    await ensureCacheDir();
    const downloaded = await File.downloadFileAsync(url, dest);
    return downloaded?.uri || null;
  } catch (err) {
    console.warn(`[resultCache] 缓存失败 ${url}:`, err?.message || err);
    return null;
  }
}

/**
 * 批量缓存任务结果的所有媒体文件
 * @param {object} taskResult - extractTaskResult 的返回值
 * @param {string} historyId - 历史记录 ID
 * @returns {object} 本地路径映射 { localImageUrl, localImageUrls, localVideoUrl, localAudioUrl }
 */
export async function cacheTaskResults(taskResult, historyId) {
  if (!taskResult || Platform.OS === 'web') return {};

  const result = {};

  // 图片
  if (taskResult.imageUrls?.length > 0) {
    const paths = await Promise.all(
      taskResult.imageUrls.map((url, i) => cacheRemoteFile(url, historyId, i))
    );
    result.localImageUrls = paths.filter(Boolean);
    if (paths[0]) result.localImageUrl = paths[0];
  } else if (taskResult.imageUrl) {
    const local = await cacheRemoteFile(taskResult.imageUrl, historyId, 0);
    if (local) {
      result.localImageUrl = local;
      result.localImageUrls = [local];
    }
  }

  // 视频
  if (taskResult.videoUrls?.length > 0) {
    const paths = await Promise.all(
      taskResult.videoUrls.map((url, i) => cacheRemoteFile(url, historyId, i))
    );
    result.localVideoUrls = paths.filter(Boolean);
    if (paths[0]) result.localVideoUrl = paths[0];
  } else if (taskResult.videoUrl) {
    const local = await cacheRemoteFile(taskResult.videoUrl, historyId, 0);
    if (local) result.localVideoUrl = local;
  }

  // 音频
  if (taskResult.audioUrl) {
    const local = await cacheRemoteFile(taskResult.audioUrl, historyId, 0);
    if (local) result.localAudioUrl = local;
  }

  return result;
}

/**
 * 获取已缓存的本地路径（不触发下载）
 * @param {string} historyId - 历史记录 ID
 * @param {string} url - 远程 URL
 * @param {number} index - 文件序号
 * @returns {string|null} 本地 URI 或 null
 */
export async function getCachedPath(historyId, index, ext) {
  if (Platform.OS === 'web') return null;
  try {
    const file = cachePath(historyId, index, ext);
    if (await file.exists()) return file.uri;
  } catch { /* ignore */ }
  return null;
}

/**
 * 删除指定历史记录的缓存文件
 * @param {string} historyId - 历史记录 ID
 */
export async function deleteCachedFiles(historyId) {
  if (Platform.OS === 'web') return;
  try {
    const dir = cacheDir();
    if (!(await dir.exists())) return;
    const files = await dir.list();
    for (const name of files) {
      if (name.startsWith(`${historyId}_`)) {
        await new File(Paths.document, `${CACHE_DIR}/${name}`).delete();
      }
    }
  } catch (err) {
    console.warn('[resultCache] 删除缓存失败:', err?.message || err);
  }
}

/**
 * 优先返回本地路径，fallback 远程 URL
 * @param {string|null} localPath - 本地路径
 * @param {string} remoteUrl - 远程 URL
 * @returns {string} 可用的 URL
 */
export function resolveUrl(localPath, remoteUrl) {
  return localPath || remoteUrl;
}
