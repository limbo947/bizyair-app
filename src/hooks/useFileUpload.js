import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { uploadImageFile, uploadVideoFile } from '../services/apiClient';
import { ENV_API_KEY } from '../constants/models';

/**
 * 通用文件选择+上传逻辑。
 * @param {object} options
 * @param {string} options.mimeType - 文件 MIME 类型过滤器，如 'image/*' 或 'video/*'
 * @param {function} options.uploadFn - 上传函数 (apiKey, fileObj) => Promise<string>
 * @param {string} options.apiKey - 当前 API 密钥
 * @param {function} options.setShowApiKeyInput - 设置API密钥输入框显示状态
 * @param {function} options.setError - 设置错误信息
 * @param {function} options.setIsUploading - 设置上传中状态
 * @param {function} options.setUrls - 设置URL列表（函数式更新）
 */
async function pickAndUpload({ mimeType, uploadFn, apiKey, setShowApiKeyInput, setError, setIsUploading, setUrls }) {
  const ek = apiKey.trim() || ENV_API_KEY;
  if (!ek) {
    setShowApiKeyInput(true);
    setError('请先配置API密钥');
    return;
  }
  setIsUploading(true);
  setError('');
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: mimeType,
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) {
      setIsUploading(false);
      return;
    }
    const file = result.assets[0];
    const uploadResult = await uploadFn(ek, {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || (mimeType.startsWith('image') ? 'image/jpeg' : 'video/mp4'),
    });
    setUrls((prev) => [...prev, uploadResult]);
  } catch (err) {
    setError(err.message || '上传失败');
  } finally {
    setIsUploading(false);
  }
}

/**
 * 文件上传 hook，封装图片/视频选择和上传逻辑。
 * @param {object} options
 * @param {string} options.apiKey - 当前 API 密钥
 * @param {function} options.setShowApiKeyInput - 设置API密钥输入框显示状态
 * @param {function} options.setError - 设置错误信息
 * @param {function} options.setIsUploading - 设置上传中状态
 * @param {function} options.setImageUrls - 设置图片URL列表
 * @param {function} options.setLastFrameUrls - 设置尾帧URL列表
 * @param {function} options.setVideoUrls - 设置视频URL列表
 */
export function useFileUpload({
  apiKey,
  setShowApiKeyInput,
  setError,
  setIsUploading,
  setImageUrls,
  setLastFrameUrls,
  setVideoUrls,
}) {
  const handleFileSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'image/*',
      uploadFn: uploadImageFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setIsUploading,
      setUrls: setImageUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setIsUploading, setImageUrls]);

  const handleLastFrameSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'image/*',
      uploadFn: uploadImageFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setIsUploading,
      setUrls: setLastFrameUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setIsUploading, setLastFrameUrls]);

  const handleVideoSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'video/*',
      uploadFn: uploadVideoFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setIsUploading,
      setUrls: setVideoUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setIsUploading, setVideoUrls]);

  return { handleFileSelect, handleLastFrameSelect, handleVideoSelect };
}
