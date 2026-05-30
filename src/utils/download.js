import { Platform, Alert } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export async function triggerDownload(url, filename) {
  if (Platform.OS === 'web') {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename || 'download';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return;
  }

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要存储权限才能保存文件');
      return;
    }
    const destination = new File(Paths.cache, filename || 'download');
    const downloadedFile = await File.downloadFileAsync(url, destination);
    await MediaLibrary.createAssetAsync(downloadedFile.uri);
    Alert.alert('下载成功', '文件已保存到相册');
  } catch (err) {
    Alert.alert('下载失败', err.message || '请检查网络连接');
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
    return;
  }

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要存储权限才能保存图片');
      return;
    }
    for (let i = 0; i < urls.length; i++) {
      const filename = `bizyair_image_${i + 1}.jpg`;
      const dest = new File(Paths.cache, filename);
      const downloadedFile = await File.downloadFileAsync(urls[i], dest);
      await MediaLibrary.createAssetAsync(downloadedFile.uri);
      if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 300));
    }
    Alert.alert('下载成功', `${urls.length} 张图片已保存到相册`);
  } catch (err) {
    Alert.alert('下载失败', err.message || '请检查网络连接');
  }
}
