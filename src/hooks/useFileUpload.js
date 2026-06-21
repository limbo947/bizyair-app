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
 * @param {function} options.setUploadField - 设置当前上传字段 (field | null)
 * @param {string} options.field - 当前上传对应的字段名
 * @param {function} options.setUrls - 设置URL列表（函数式更新）
 * @param {number} [options.maxRetries=2] - 上传失败最大重试次数
 */
async function pickAndUpload({ mimeType, uploadFn, apiKey, setShowApiKeyInput, setError, setUploadField, field, setUrls, maxRetries = 2 }) {
  const ek = apiKey.trim() || ENV_API_KEY;
  if (!ek) {
    setShowApiKeyInput(true);
    setError('请先配置API密钥');
    return;
  }
  setUploadField(field);
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
      setUploadField(null);
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
    setUploadField(null);
  }
}

/**
 * 文件上传 hook，封装图片/视频选择和上传逻辑。
 * @param {object} options
 * @param {string} options.apiKey - 当前 API 密钥
 * @param {function} options.setShowApiKeyInput - 设置API密钥输入框显示状态
 * @param {function} options.setError - 设置错误信息
 * @param {function} options.setUploadField - 设置当前上传字段 (field | null)
 * @param {function} options.setImageUrls - 设置图片URL列表
 * @param {function} options.setLastFrameUrls - 设置尾帧URL列表
 * @param {function} options.setVideoUrls - 设置视频URL列表
 */
export function useFileUpload({
  apiKey,
  setShowApiKeyInput,
  setError,
  setUploadField,
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
      setUploadField,
      field: 'imageUrls',
      setUrls: setImageUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setUploadField, setImageUrls]);

  const handleLastFrameSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'image/*',
      uploadFn: uploadImageFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setUploadField,
      field: 'lastFrameUrls',
      setUrls: setLastFrameUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setUploadField, setLastFrameUrls]);

  const handleVideoSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'video/*',
      uploadFn: uploadVideoFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setUploadField,
      field: 'videoUrls',
      setUrls: setVideoUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setUploadField, setVideoUrls]);

  const handleRefImageSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'image/*',
      uploadFn: uploadImageFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setUploadField,
      field: 'refImages',
      setUrls: setRefImages,
    });
  }, [apiKey, setShowApiKeyInput, setError, setUploadField, setRefImages]);

  const handleFirstClipSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'video/*',
      uploadFn: uploadVideoFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setUploadField,
      field: 'firstClipUrls',
      setUrls: setFirstClipUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setUploadField, setFirstClipUrls]);

  const handleFirstFrameSelect = useCallback(async () => {
    await pickAndUpload({
      mimeType: 'image/*',
      uploadFn: uploadImageFile,
      apiKey,
      setShowApiKeyInput,
      setError,
      setUploadField,
      field: 'firstFrameUrls',
      setUrls: setFirstFrameUrls,
    });
  }, [apiKey, setShowApiKeyInput, setError, setUploadField, setFirstFrameUrls]);

  return { handleFileSelect, handleLastFrameSelect, handleVideoSelect, handleRefImageSelect, handleFirstClipSelect, handleFirstFrameSelect };
}