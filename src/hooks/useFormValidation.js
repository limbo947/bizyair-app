import { useMemo } from 'react';
import { ENV_API_KEY } from '../constants/models';

const NO_PROMPT_REQUIRED_TYPES = ['dreamactor', 'birefnet', 'seedvr2', 'flux-klein', 'ace-step'];

export function useFormValidation({ state, paramType, mode, apiKey }) {
  const errors = useMemo(() => {
    const result = {};

    // 提示词校验
    if (!NO_PROMPT_REQUIRED_TYPES.includes(paramType) && !state.prompt?.trim()) {
      result.prompt = '请输入提示词';
    }

    // 图生图模式需要上传图片
    if (mode === 'image-to-image' && (!state.imageUrls || state.imageUrls.length === 0)) {
      result.imageUrls = '请至少上传一张参考图片';
    }

    // 图生视频模式需要上传图片
    if (mode === 'image-to-video' && (!state.imageUrls || state.imageUrls.length === 0) && (!state.firstFrameUrls || state.firstFrameUrls.length === 0)) {
      result.imageUrls = '请至少上传一张参考图片';
    }

    // 首尾帧模式需要首帧图片
    if (mode === 'flf-to-video' && (!state.firstFrameUrls || state.firstFrameUrls.length === 0)) {
      result.firstFrameUrls = '请上传首帧图片';
    }

    // 视频编辑模式需要上传视频
    if (mode === 'video-edit' && (!state.videoUrls || state.videoUrls.length === 0)) {
      result.videoUrls = '请上传视频文件';
    }

    // 视频延长模式需要上传视频
    if (mode === 'video-extend' && (!state.firstFrameUrls || state.firstFrameUrls.length === 0) && (!state.videoUrls || state.videoUrls.length === 0)) {
      result.videoUrls = '请上传视频文件';
    }

    // DreamActor 需要同时上传人物图片和参考视频
    if (mode === 'reference-to-video' && paramType === 'dreamactor') {
      if (!state.imageUrls || state.imageUrls.length === 0 || !state.videoUrls || state.videoUrls.length === 0) {
        result.imageUrls = '请上传人物图片和参考视频';
      }
    }

    // API 密钥校验
    const ek = apiKey?.trim() || ENV_API_KEY;
    if (!ek) {
      result.apiKey = '请先输入API密钥';
    }

    return result;
  }, [
    state.prompt, state.imageUrls, state.videoUrls, state.firstFrameUrls,
    paramType, mode, apiKey,
  ]);

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}
