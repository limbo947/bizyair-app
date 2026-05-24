import { getModelInfo } from './modelHelpers';

/**
 * 根据模型ID和模式，将前端 camelCase 参数映射为 API snake_case 请求体。
 * @param {string} modelId - 模型ID，用于查找 paramType
 * @param {string} mode - 当前模式（如 'text-to-image', 'flf-to-video', 'language' 等）
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
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'width-height-quality':
      payload.prompt = params.prompt;
      payload.width = params.width;
      payload.height = params.height;
      payload.quality = params.quality;
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'size-only':
      payload.prompt = params.prompt;
      payload.size = params.resolution;
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'flux-kontext':
      payload.prompt = params.prompt;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'wan-size':
      payload.prompt = params.prompt;
      payload.size = params.resolution;
      if (params.resolution === 'Custom') {
        payload.custom_width = parseInt(params.customWidth) || 2048;
        payload.custom_height = parseInt(params.customHeight) || 2048;
      }
      if (mode === 'image-to-image') payload[model.imageField] = params.imageUrls;
      break;

    case 'width-height':
      payload.prompt = params.prompt;
      payload.width = params.width;
      payload.height = params.height;
      payload.batch_size = 1;
      break;

    case 'seedance-video':
      payload.prompt = params.prompt;
      const ratioField = model.ratioField || 'aspect_ratio';
      payload[ratioField] = params.aspectRatio || (ratioField === 'ratio' ? 'adaptive' : 'auto');
      payload.resolution = params.resolution || '720p';
      if (model.durationType === 'number') {
        payload.duration = parseInt(params.duration) || 5;
      } else {
        payload.duration = params.duration || '5';
      }
      if (model.supportsAudio) payload.generate_audio = params.generateAudio || false;
      if (params.seed) payload.seed = params.seed;
      if (params.webSearch !== undefined) payload.web_search = params.webSearch;
      if (params.returnLastFrame !== undefined) payload.return_last_frame = params.returnLastFrame;
      if (mode === 'flf-to-video') {
        if (params.firstFrameUrls?.length) payload.first_frame_url = params.firstFrameUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_url = params.lastFrameUrls;
      }
      if (mode === 'reference-to-video') {
        if (params.imageUrls?.length) payload.image_urls = params.imageUrls;
        if (params.videoUrls?.length) payload.video_urls = params.videoUrls;
        if (params.audioUrls?.length) payload.audio_urls = params.audioUrls;
      }
      break;

    case 'kling-video':
      payload.prompt = params.prompt;
      payload.duration = params.duration || 5;
      payload.sound = params.sound !== undefined ? params.sound : false;
      if (mode !== 'flf-to-video' && params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (model.supportsMultiShot) {
        if (params.multiShot) payload.multi_shot = params.multiShot;
        if (params.shotType) payload.shot_type = params.shotType;
        if (params.multiPrompt) payload.multi_prompt = params.multiPrompt;
      }
      if (params.seed !== undefined && params.seed !== null) payload.seed = params.seed;
      if (mode === 'flf-to-video') {
        if (params.firstFrameUrls?.length) payload.first_frame_image = params.firstFrameUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_image = params.lastFrameUrls;
      }
      break;

    case 'kling-o3-4k':
      payload.prompt = params.prompt;
      payload.duration = params.duration || 5;
      payload.sound = params.sound !== undefined ? params.sound : false;
      payload.keep_original_sound = params.keepOriginalSound !== undefined ? params.keepOriginalSound : false;
      if (params.imageUrls?.length) payload.image_urls = params.imageUrls;
      if (params.videoUrls?.length) payload.video_urls = params.videoUrls;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (params.multiShot) payload.multi_shot = params.multiShot;
      if (params.shotType) payload.shot_type = params.shotType;
      if (params.multiPrompt) payload.multi_prompt = params.multiPrompt;
      break;

    case 'vidu-video':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720P';
      payload.aspect_ratio = params.aspectRatio || '16:9';
      payload.duration = params.duration || 5;
      if (model.supportsAudio) payload.audio = params.audio !== undefined ? params.audio : false;
      if (model.supportsStyle) payload.style = params.style || 'general';
      if (model.supportsMovementAmplitude) payload.movement_amplitude = params.movementAmplitude || 'auto';
      if (params.isRec) payload.is_rec = params.isRec;
      if (params.offPeak) payload.off_peak = params.offPeak;
      if (params.seed) payload.seed = params.seed;
      if (mode === 'image-to-video') {
        if (params.imageUrls?.length) payload.image = params.imageUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_image = params.lastFrameUrls;
      }
      if (mode === 'flf-to-video') {
        if (params.imageUrls?.length) payload.image = params.imageUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_image = params.lastFrameUrls;
      }
      break;

    case 'wan-video':
      if (params.prompt) payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720P';
      payload.duration = params.duration || 5;
      if (params.aspectRatio && (mode !== 'video-edit' || params.aspectRatio !== 'default')) {
        payload.ratio = params.aspectRatio;
      }
      if (model.supportsPromptExtend) payload.prompt_extend = params.promptExtend !== undefined ? params.promptExtend : true;
      if (model.supportsWatermark) payload.watermark = params.watermark !== undefined ? params.watermark : true;
      if (params.negativePrompt) payload.negative_prompt = params.negativePrompt;
      if (params.audioUrl) payload.audio_url = params.audioUrl;
      if (params.seed !== undefined && params.seed !== null) payload.seed = params.seed;
      if (mode !== 'video-edit') {
        if (params.firstFrameUrls?.length) payload.first_frame = params.firstFrameUrls;
        if (params.firstClipUrls?.length) payload.first_clip = params.firstClipUrls;
        if (params.lastFrameUrls?.length) payload.last_frame = params.lastFrameUrls;
      }
      if (mode === 'video-edit') {
        if (params.videoUrls?.length) payload.video = params.videoUrls;
        if (params.audioSetting) payload.audio_setting = params.audioSetting;
        if (params.refImages?.length) payload.ref_images = params.refImages;
        if (params.firstFrameUrls?.length) payload.first_frame = params.firstFrameUrls;
      }
      if (mode === 'reference-to-video') {
        if (params.refImages?.length) payload.ref_images = params.refImages;
        if (params.refVideos?.length) payload.ref_videos = params.refVideos;
        if (params.referenceVoice) payload.reference_voice = params.referenceVoice;
      }
      if (mode === 'video-extend') {
        if (params.firstClipUrls?.length) payload.first_clip = params.firstClipUrls;
        if (params.drivingAudio) payload.driving_audio = params.drivingAudio;
        if (params.lastFrameUrls?.length) payload.last_frame = params.lastFrameUrls;
      }
      break;

    case 'wan-i2v':
      payload.resolution = params.resolution || '720P';
      payload.duration = params.duration || 5;
      payload.prompt_extend = params.promptExtend !== undefined ? params.promptExtend : true;
      if (params.prompt) payload.prompt = params.prompt;
      if (params.imageUrls?.length) payload.img_url = params.imageUrls;
      if (params.audio !== undefined) payload.audio = params.audio;
      if (params.audioUrl) payload.audio_url = params.audioUrl;
      break;

    case 'hailuo-video':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '768P';
      payload.duration = params.duration || 6;
      if (model.supportsPromptOptimizer && params.promptOptimizer !== undefined) payload.prompt_optimizer = params.promptOptimizer;
      if (model.supportsFastPretreatment && params.fastPretreatment !== undefined) payload.fast_pretreatment = params.fastPretreatment;
      if (model.supportsWatermark && params.aigcWatermark !== undefined) payload.aigc_watermark = params.aigcWatermark;
      if (mode === 'image-to-video' && params.imageUrls?.length) {
        payload.first_frame_image = params.imageUrls;
      }
      break;

    case 'happyhorse-video':
      payload.prompt = params.prompt;
      if (params.resolution) payload.resolution = params.resolution;
      if (params.aspectRatio) payload.ratio = params.aspectRatio;
      if (params.duration) payload.duration = params.duration;
      if (model.supportsWatermark) payload.watermark = params.watermark !== undefined ? params.watermark : true;
      if (params.seed) payload.seed = params.seed;
      if (mode === 'image-to-video' && params.imageUrls?.length) {
        payload.first_frame = params.imageUrls;
      }
      if (mode === 'reference-to-video' && params.mediaUrls?.length) {
        payload.media = params.mediaUrls;
      }
      if (mode === 'video-edit') {
        if (params.mediaUrls?.length) payload.media = params.mediaUrls;
        if (params.referenceImages?.length) payload.reference_images = params.referenceImages;
        if (params.audioSetting) payload.audio_setting = params.audioSetting;
      }
      break;

    case 'ltx-video':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '1080P';
      payload.duration = 5;
      if (params.display) payload.display = params.display;
      if (params.seed !== undefined && params.seed !== null) payload.seed = params.seed;
      if (mode === 'image-to-video' && params.imageUrls?.length) {
        payload.image = params.imageUrls;
      }
      break;

    case 'bza-video-x':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720p';
      payload.duration = params.duration || 6;
      payload.aspect_ratio = params.aspectRatio || '16:9';
      if (mode === 'image-to-video' && params.imageUrls?.length) {
        payload.image_urls = params.imageUrls;
      }
      if (mode === 'video-edit' && params.videoUrls?.length) {
        payload.video_urls = params.videoUrls;
      }
      break;

    case 'bza-video-v3':
      payload.prompt = params.prompt;
      payload.resolution = params.resolution || '720p';
      payload.aspect_ratio = params.aspectRatio || '16:9';
      if (mode === 'image-to-video' && params.imageUrls?.length) {
        payload.image_urls = params.imageUrls;
      }
      if (mode === 'flf-to-video') {
        if (params.firstFrameUrls?.length) payload.first_frame_image = params.firstFrameUrls;
        if (params.lastFrameUrls?.length) payload.last_frame_image = params.lastFrameUrls;
      }
      break;

    case 'dreamactor':
      if (params.videoUrls?.length) payload.video_urls = params.videoUrls;
      if (params.imageUrls?.length) payload.image_urls = params.imageUrls;
      break;

    case 'llm-chat':
      payload.system_prompt = params.systemPrompt || '';
      payload.user_prompt = params.userPrompt || '';
      if (params.enableThinking !== undefined) payload.enable_thinking = params.enableThinking;
      else payload.enable_thinking = true;
      if (params.temperature !== undefined) payload.temperature = params.temperature;
      else payload.temperature = 0.7;
      if (params.maxTokens !== undefined) payload.max_tokens = params.maxTokens;
      else payload.max_tokens = 4096;
      if (params.enableSearch !== undefined) payload.enable_search = params.enableSearch;
      break;

    case 'vision-g':
      payload.system_prompt = params.systemPrompt || '';
      payload.user_prompt = params.userPrompt || '';
      if (params.imageUrls?.length) payload.image_urls = params.imageUrls;
      if (params.maxTokens !== undefined) payload.max_tokens = params.maxTokens;
      else payload.max_tokens = 4096;
      if (params.temperature !== undefined) payload.temperature = params.temperature;
      else payload.temperature = 0.7;
      payload.detail = params.detail || 'medium';
      if (params.enableThinking !== undefined) payload.enable_thinking = params.enableThinking;
      break;

    case 'joycaption':
      if (params.imageUrls?.length) payload.image_input = params.imageUrls;
      if (params.captionType) payload.caption_type = params.captionType;
      if (params.captionLength) payload.caption_length = params.captionLength;
      if (params.temperature !== undefined) payload.temperature = params.temperature;
      if (params.maxTokens !== undefined) payload.max_tokens = params.maxTokens;
      if (params.doSample !== undefined) payload.do_sample = params.doSample;
      if (params.extraOptions) payload.extra_options = params.extraOptions;
      if (params.nameInput) payload.name_input = params.nameInput;
      if (params.customPrompt) payload.custom_prompt = params.customPrompt;
      break;

    case 'tts':
      payload.input = params.input || '';
      payload.voice = params.voice || 'vivian';
      if (params.responseFormat) payload.response_format = params.responseFormat;
      if (params.instructions) payload.instructions = params.instructions;
      if (params.language) payload.language = params.language;
      if (params.speed !== undefined) payload.speed = params.speed;
      if (params.maxTokens !== undefined) payload.max_tokens = params.maxTokens;
      break;

    default:
      payload.prompt = params.prompt;
      payload.resolution = params.resolution;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (mode === 'image-to-image' && model.imageField) payload[model.imageField] = params.imageUrls;
  }

  return payload;
}
