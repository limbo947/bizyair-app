import { getModelInfo } from './modelHelpers';

/**
 * 根据模型ID和模式，将前端 camelCase 参数映射为 API snake_case 请求体。
 * 参数名以国际版 llms 文档为准（附录 C 矩阵冻结稿）；仅发送各模型文档声明的字段，
 * 可选参数按 model 的 supports* flag 与 mode 门控，避免枚举外字段被服务端拒绝。
 * @param {string} modelId - 模型ID，用于查找 paramType
 * @param {string} mode - 当前模式（如 'text-to-image', 'flf-to-video', 'vision' 等）
 * @param {object} params - 前端参数对象（camelCase 命名）
 * @returns {object} API 请求体（snake_case 命名）
 */
export function buildPayload(modelId, mode, params) {
  const model = getModelInfo(modelId);
  const payload = {};

  switch (model.paramType) {
    case 'resolution-ratio':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (model.supportsSeed && params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      if (model.supportsWebSearch && params.webSearch !== undefined) payload.web_search = params.webSearch;
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'width-height-quality':
      // GPT Image 2 官方版：宽高改 image_size 枚举档（"宽x高"），quality 必填
      payload.prompt = params.prompt;
      payload.image_size = `${params.width || 1024}x${params.height || 1024}`;
      payload.quality = params.quality || 'medium';
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'size-only':
      // Seedream 系：size 改 image_size（像素字符串），档位映射为方形容积
      payload.prompt = params.prompt;
      payload.image_size = sizeOnlyImageSize(params.resolution);
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'wan-size':
      // 万相2.7 图像：custom_width/height、watermark、color_palette 等国际文档已无
      payload.prompt = params.prompt;
      payload.image_size = sizeOnlyImageSize(params.resolution);
      if (model.supportsThinkingMode) payload.enable_thinking = params.thinkingMode !== undefined ? params.thinkingMode : (model.defaultThinkingMode !== undefined ? model.defaultThinkingMode : true);
      if (model.supportsSeed && params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'width-height':
      // Z-Image 系：width/height 改 image_size；steps 仅 Z-Image Base 必填
      payload.prompt = params.prompt;
      payload.image_size = `${parseInt(params.width) || 1024}x${parseInt(params.height) || 1024}`;
      if (params.negativePrompt) payload.negative_prompt = params.negativePrompt;
      if (params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      if (model.stepsRange) payload.steps = parseInt(params.steps) || model.defaultSteps;
      if (model.guidanceScaleRange && params.guidanceScale !== undefined && params.guidanceScale !== '') payload.guidance_scale = parseFloat(params.guidanceScale);
      break;

    case 'qwen-image':
      payload.prompt = params.prompt;
      payload.image_size = `${params.width || 1280}x${params.height || 1280}`;
      if (params.negativePrompt) payload.negative_prompt = params.negativePrompt;
      if (params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      payload.steps = parseInt(params.steps) || model.defaultSteps;
      if (params.guidanceScale !== undefined && params.guidanceScale !== '') payload.guidance_scale = parseFloat(params.guidanceScale);
      break;

    case 'seedance-video': {
      payload.prompt = params.prompt;
      const ratioField = model.ratioField || 'aspect_ratio';
      payload[ratioField] = params.aspectRatio || model.defaultAspectRatio || '16:9';
      payload.resolution = params.resolution || model.defaultResolution || '720p';
      payload.duration = parseInt(params.duration) || 5;
      if (model.supportsAudio) payload.generate_audio = params.generateAudio || false;
      if (model.supportsWebSearch && params.webSearch !== undefined) payload.web_search = params.webSearch;
      if (model.supportsReturnLastFrame && params.returnLastFrame !== undefined) payload.return_last_frame = params.returnLastFrame;
      if (model.supportsSeed && params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      if (mode === 'flf-to-video') {
        // 官方系首帧字段为 image_urls（尾帧 last_frame_url）；channel 系用 first_frame_url
        if (model.flfFirstFrameUsesImageUrls) {
          if (params.firstFrameUrls?.length) payload.image_urls = params.firstFrameUrls;
        } else if (params.firstFrameUrls?.length) {
          payload.first_frame_url = params.firstFrameUrls;
        }
        if (params.lastFrameUrls?.length) payload.last_frame_url = params.lastFrameUrls;
      }
      if (mode === 'reference-to-video') {
        if (params.imageUrls?.length) payload.ref_images = params.imageUrls;
        if (params.videoUrls?.length) payload.ref_videos = params.videoUrls;
      }
      break;
    }

    case 'kling-video':
      payload.prompt = params.prompt;
      payload.duration = params.duration || 5;
      payload.sound = params.sound !== undefined ? params.sound : false;
      if (mode === 'text-to-video') {
        if (model.aspectRatioRequired || params.aspectRatio) payload.aspect_ratio = params.aspectRatio || '16:9';
      } else if (mode === 'flf-to-video' && model.flfAspectRatio) {
        payload.aspect_ratio = params.aspectRatio || '16:9';
      }
      if (model.supportsMultiShot && (model.multiShotRequired || params.multiShot)) payload.multi_shot = params.multiShot || false;
      if (model.supportsShotType && params.shotType) payload.shot_type = params.shotType;
      if (mode === 'flf-to-video') {
        if (params.firstFrameUrls?.length) payload.first_frame_url = params.firstFrameUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_url = params.lastFrameUrls;
      }
      break;

    case 'kling-o3-4k':
      payload.prompt = params.prompt;
      payload.duration = params.duration || 5;
      payload.sound = params.sound !== undefined ? params.sound : false;
      if (params.imageUrls?.length) payload.ref_images = params.imageUrls;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (params.multiShot) payload.multi_shot = params.multiShot;
      if (params.shotType) payload.shot_type = params.shotType;
      break;

    case 'vidu-video':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720p';
      payload.duration = parseInt(params.duration) || 5;
      // aspect_ratio 仅 t2v 声明（官方系可选、渠道系必填）
      if (mode === 'text-to-video') payload.aspect_ratio = params.aspectRatio || '16:9';
      if (model.supportsAudio) payload.generate_audio = params.generateAudio !== undefined ? params.generateAudio : false;
      if (model.supportsStyle && mode === 'text-to-video') payload.style = params.style || 'general';
      if (model.supportsMovementAmplitude && mode === 'flf-to-video') payload.movement_amplitude = params.movementAmplitude || 'auto';
      if (model.supportsIsRec && params.isRec) payload.is_rec = params.isRec;
      if (model.supportsSeed && params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed) || -1;
      if (mode === 'image-to-video') {
        // 官方系字段为 images，渠道系为 image_urls
        payload[model.i2vUsesImagesField ? 'images' : 'image_urls'] = params.imageUrls;
      }
      if (mode === 'flf-to-video') {
        if (params.imageUrls?.length) payload.first_frame_url = params.imageUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_url = params.lastFrameUrls;
      }
      break;

    case 'wan-video':
      if (params.prompt) payload.prompt = params.prompt;
      payload.resolution = params.resolution || model.defaultResolution || '1080P';
      payload.duration = params.duration || model.defaultDuration || 5;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (model.supportsPromptExtend) payload.prompt_optimizer = params.promptExtend !== undefined ? params.promptExtend : (model.defaultPromptExtend !== undefined ? model.defaultPromptExtend : true);
      if (params.negativePrompt) payload.negative_prompt = params.negativePrompt;
      if (params.seed !== undefined && params.seed !== null && params.seed !== '') payload.seed = params.seed;
      if (mode === 'text-to-video' && params.audioUrl) payload.audio_urls = [params.audioUrl];
      if (mode === 'reference-to-video') {
        if (params.refImages?.length) payload.ref_images = params.refImages;
        if (params.refVideos?.length) payload.ref_videos = params.refVideos;
      }
      if (mode === 'video-edit') {
        if (params.videoUrls?.length) payload.video_urls = params.videoUrls;
        if (params.refImages?.length) payload.ref_images = params.refImages;
        if (model.supportsAudioSetting) payload.audio_setting = params.audioSetting || model.defaultAudioSetting || 'auto';
      }
      break;

    case 'hailuo-video':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '768P';
      payload.duration = params.duration || 6;
      if (mode === 'image-to-video' && params.imageUrls?.length) payload.image_urls = params.imageUrls;
      break;

    case 'happyhorse-video':
      if (params.prompt) payload.prompt = params.prompt;
      payload.resolution = params.resolution || model.defaultResolution || '1080P';
      if (mode !== 'video-edit') payload.duration = parseInt(params.duration) || 5;
      if ((mode === 'text-to-video' || mode === 'reference-to-video') && params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (model.supportsSeed && params.seed !== undefined && params.seed !== null && params.seed !== '') payload.seed = parseInt(params.seed);
      if (mode === 'image-to-video' && params.imageUrls?.length) payload.first_frame_url = params.imageUrls;
      if (mode === 'reference-to-video' && params.imageUrls?.length) payload.ref_images = params.imageUrls;
      if (mode === 'video-edit') {
        if (params.videoUrls?.length) payload.video_urls = params.videoUrls;
        if (params.refImages?.length) payload.ref_images = params.refImages;
        if (model.supportsAudioSetting) payload.audio_setting = params.audioSetting || model.defaultAudioSetting || 'auto';
      }
      break;

    case 'bza-video-x':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720p';
      if (mode !== 'video-edit') payload.duration = parseInt(params.duration) || 6;
      // official 的 i2v 无 aspect_ratio；channel 全 mode 必填
      if (mode !== 'image-to-video' || model.aspectRatioRequired) payload.aspect_ratio = params.aspectRatio || '16:9';
      if (mode === 'image-to-video' && params.imageUrls?.length) payload.image_urls = params.imageUrls;
      if (mode === 'video-edit' && params.videoUrls?.length) payload.video_urls = params.videoUrls;
      break;

    case 'bza-video-v3':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720p';
      payload.aspect_ratio = params.aspectRatio || '16:9';
      if (model.durationOptions) payload.duration = parseInt(params.duration) || model.durationOptions[0];
      if (model.supportsAudio) payload.generate_audio = params.generateAudio || false;
      if (model.supportsSeed && params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      if (mode === 'flf-to-video') {
        if (params.firstFrameUrls?.length) payload.first_frame_url = params.firstFrameUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_url = params.lastFrameUrls;
      }
      break;

    case 'bza-video-g':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720p';
      payload.duration = String(params.duration || 4);
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (mode === 'image-to-video' && params.imageUrls?.length) payload.image_urls = params.imageUrls;
      break;

    case 'dreamactor':
      if (params.videoUrls?.length) payload.ref_videos = params.videoUrls;
      if (params.imageUrls?.length) payload.ref_images = params.imageUrls;
      break;

    case 'vision-g':
      // Gemini flash 系（llm + vision 双 mode）：user_prompt 改 prompt，
      // detail / enable_thinking 国际文档已无；vision 模式补必填 image_urls
      payload.prompt = params.userPrompt || params.prompt || '';
      if (params.systemPrompt) payload.system_prompt = params.systemPrompt;
      if (params.imageUrls?.length) payload.image_urls = params.imageUrls;
      payload.temperature = params.temperature !== undefined ? params.temperature : 1;
      payload.max_tokens = Math.min(params.maxTokens !== undefined ? params.maxTokens : 32768, model.maxTokens || 65536);
      break;

    case 'joycaption':
      if (params.imageUrls?.length) payload.image_urls = params.imageUrls;
      if (params.captionType) payload.caption_type = params.captionType;
      if (params.captionLength) payload.caption_length = params.captionLength;
      if (params.extraOptions) payload.extra_options = params.extraOptions;
      break;

    case 'tts':
      payload.input = params.input || '';
      payload.voice = params.voice || 'vivian';
      if (params.responseFormat) payload.response_format = params.responseFormat;
      if (params.instructions) payload.instructions = params.instructions;
      if (params.language) payload.language = params.language;
      payload.speed = params.speed !== undefined ? params.speed : 1;
      if (params.maxTokens !== undefined) payload.max_tokens = params.maxTokens;
      break;

    case 'birefnet':
      payload.image_urls = params.imageUrls;
      payload.outputmask = params.outputmask !== undefined ? params.outputmask : false;
      break;

    case 'ace-step':
      payload.lyrics = params.lyrics || '';
      payload.tags = params.tags || '';
      payload.duration = parseInt(params.duration) || 30;
      if (params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      break;

    case 'seedvr2':
      payload.image_urls = params.imageUrls;
      payload.resolution = parseInt(params.resolution) || 1080;
      if (model.supportsSeed && params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      break;

    case 'flux-klein':
      payload.image_urls = params.imageUrls;
      break;

    case 'kontext-lora':
      payload.image_urls = params.imageUrls;
      payload.prompt = params.prompt;
      if (params.seed !== undefined && params.seed !== '') payload.seed = parseInt(params.seed);
      break;

    default:
      payload.prompt = params.prompt;
      payload.resolution = params.resolution;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (mode === 'image-to-image' && model.imageField) payload[model.imageField] = params.imageUrls;
  }

  return payload;
}

/** 档位分辨率映射为 image_size 方形字符串（"1024x1024"），size-only / wan-size 共用 */
function sizeOnlyImageSize(resolution) {
  const base = { '1K': 1024, '2K': 2048, '4K': 4096 }[resolution] || 2048;
  return `${base}x${base}`;
}
