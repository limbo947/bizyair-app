import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

function getMediaLibrary() {
  if (Platform.OS === 'web') return null;
  return require('expo-media-library');
}

export async function triggerDownload(url, filename) {
  if (Platform.OS === 'web') {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename || 'download';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return { success: true };
  }

  const MediaLibrary = getMediaLibrary();
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    return { success: false, errorType: 'permission' };
  }
  try {
    const destination = new File(Paths.cache, filename || 'download');
    const downloadedFile = await File.downloadFileAsync(url, destination);
    await MediaLibrary.createAssetAsync(downloadedFile.uri);
    return { success: true };
  } catch (err) {
    return { success: false, errorType: 'network', message: err.message || '请检查网络连接' };
  }
}

export async function triggerBatchDownload(urls) {
  if (Platform.OS === 'web') {
    for (let i = 0; i < urls.length; i++) {
      const anchor = document.createElement('a');
      anchor.href = urls[i];
      anchor.download = `bizyair_image_${i + 1}.jpg`;
      anchor.target = '_blank';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 300));
    }
    return { success: true };
  }

  const MediaLibrary = getMediaLibrary();
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    return { success: false, errorType: 'permission' };
  }
  try {
    for (let i = 0; i < urls.length; i++) {
      const filename = `bizyair_image_${i + 1}.jpg`;
      const dest = new File(Paths.cache, filename);
      const downloadedFile = await File.downloadFileAsync(urls[i], dest);
      await MediaLibrary.createAssetAsync(downloadedFile.uri);
      if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 300));
    }
    return { success: true, count: urls.length };
  } catch (err) {
    return { success: false, errorType: 'network', message: err.message || '请检查网络连接' };
  }
}
