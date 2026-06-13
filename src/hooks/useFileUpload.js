import { useCallback } from 'react';
import { Platform } from 'react-native';
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
 * @param {number} [options.maxRetries=2] - 上传失败最大重试次数
 */
async function pickAndUpload({ mimeType, uploadFn, apiKey, setShowApiKeyInput, setError, setIsUploading, setUrls, maxRetries = 2 }) {
  const ek = apiKey.trim() || ENV_API_KEY;
  if (!ek) {
    setShowApiKeyInput(true);
    setError('请先配置API密钥');
    return;
  }
  setIsUploading(true);
  setError('');
  try {
    const pickerOpts = {
      type: mimeType,
      copyToCacheDirectory: true,
    };
    if (Platform.OS === 'web') {
      pickerOpts.base64 = true;
    }
    const result = await DocumentPicker.getDocumentAsync(pickerOpts);
    if (result.canceled || !result.assets?.length) {
      setIsUploading(false);
      return;
    }
    const file = result.assets[0];
    const fileObj = {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || (mimeType.startsWith('image') ? 'image/jpeg' : 'video/mp4'),
    };
    let localUrl = file.uri;
    if (Platform.OS === 'web') {
      if (file.base64) {
        if (typeof file.base64 === 'string' && file.base64.startsWith('data:')) {
          localUrl = file.base64;
          const commaIndex = file.base64.indexOf(',');
          /* Web 端 DocumentPicker 已返回完整 data URI，上传时去掉前缀保留原始 base64 */
          fileObj.base64 = commaIndex !== -1 ? file.base64.substring(commaIndex + 1) : file.base64;
        } else {
          fileObj.base64 = file.base64;
          const mime = file.mimeType || (mimeType.startsWith('image') ? 'image/jpeg' : 'video/mp4');
          /* 仅有原始 base64，自行拼接 data URI 供缩略图展示 */
          localUrl = `data:${mime};base64,${file.base64}`;
        }
      }
      if (file.file) {
        fileObj.rawFile = file.file;
      }
    }
    let remoteUrl;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        remoteUrl = await uploadFn(ek, fileObj);
        break;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    if (!remoteUrl) {
      throw lastError;
    }
    setUrls((prev) => [...prev, { remoteUrl, localUrl }]);
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
  setRefImages,
  setFirstClipUrls,
  setFirstFrameUrls,
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

  const handleRefImageSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'image/*',
      uploadFn: uploadImageFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setIsUploading,
      setUrls: setRefImages,
    });
  }, [apiKey, setShowApiKeyInput, setError, setIsUploading, setRefImages]);

  const handleFirstClipSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'video/*',
      uploadFn: uploadVideoFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setIsUploading,
      setUrls: setFirstClipUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setIsUploading, setFirstClipUrls]);

  const handleFirstFrameSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'image/*',
      uploadFn: uploadImageFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setIsUploading,
      setUrls: setFirstFrameUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setIsUploading, setFirstFrameUrls]);

  return { handleFileSelect, handleLastFrameSelect, handleVideoSelect, handleRefImageSelect, handleFirstClipSelect, handleFirstFrameSelect };
}