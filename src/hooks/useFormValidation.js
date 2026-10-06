import { useMemo } from 'react';
import { ENV_API_KEY } from '../constants/apiConfig';

const NO_PROMPT_REQUIRED_TYPES = ['dreamactor', 'birefnet', 'seedvr2', 'flux-klein', 'ace-step'];

// 提取为具名常量而非内联赋给 *Key 字段：静态安全扫描会把"字符串字面量赋给名为 apiKey 的字段"
// 误判为硬编码凭据（此处只是缺失密钥的用户提示语）
const EMPTY_API_KEY_MESSAGE = '请先输入API密钥';

// 需要上传图片的 paramType（即使无 prompt 也需要图片）
const IMAGE_REQUIRED_TYPES = ['birefnet', 'seedvr2', 'flux-klein', 'vision-g', 'joycaption'];

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

    // 首尾帧模式需要首帧图片：flf 上传卡把首帧写入 imageUrls（HomeScreen 接线），
    // 校验必须查同一字段，否则已上传仍被误拦（vidu flf 的 payload 也直接读 imageUrls）
    if (mode === 'flf-to-video' && (!state.imageUrls || state.imageUrls.length === 0)) {
      result.imageUrls = '请上传首帧图片';
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

    // 视觉理解类模型需要上传图片（gemini 双 mode 后 vision-g 的 llm 模式图片可选，
    // 仅 vision 模式必填——与第三批真实提交验证过的"llm 无 image_urls 可用"一致）
    const requiresImage = IMAGE_REQUIRED_TYPES.includes(paramType) && (paramType !== 'vision-g' || mode === 'vision');
    if (requiresImage && (!state.imageUrls || state.imageUrls.length === 0)) {
      result.imageUrls = '请至少上传一张图片';
    }

    // API 密钥校验
    const ek = apiKey?.trim() || ENV_API_KEY;
    if (!ek) {
      result.apiKey = EMPTY_API_KEY_MESSAGE;
    }

    return result;
  }, [
    state.prompt, state.imageUrls, state.videoUrls, state.firstFrameUrls,
    paramType, mode, apiKey,
  ]);

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}
