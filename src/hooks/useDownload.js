import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { triggerDownload, triggerBatchDownload } from '../utils/download';

export function useDownload(showToast) {
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadingRef = useRef(new Set());

  const handleDownload = useCallback(async (url, filename, { silent = false } = {}) => {
    if (downloadingRef.current.has(url)) return { skipped: true };
    downloadingRef.current.add(url);
    const result = await triggerDownload(url, filename);
    if (!silent) {
      if (result.errorType === 'permission') {
        Alert.alert('权限不足', '需要存储权限才能保存文件');
      } else if (result.success) {
        showToast('文件已保存到相册', 'success');
      } else {
        showToast(result.message || '下载失败，请检查网络连接', 'error');
      }
    }
    setTimeout(() => downloadingRef.current.delete(url), 2000);
    return result;
  }, [showToast]);

  const handleBatchDownload = useCallback(async (urls) => {
    if (isDownloading || urls.length === 0) return;
    setIsDownloading(true);
    const result = await triggerBatchDownload(urls);
    if (result.errorType === 'permission') {
      Alert.alert('权限不足', '需要存储权限才能保存文件');
    } else if (result.success) {
      showToast(`${urls.length} 个文件已保存到相册`, 'success');
    } else {
      showToast(result.message || '下载失败，请检查网络连接', 'error');
    }
    setIsDownloading(false);
  }, [isDownloading, showToast]);

  return { handleDownload, handleBatchDownload, isDownloading };
}
