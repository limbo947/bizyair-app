import { getModelInfo } from './modelHelpers';

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

    default:
      payload.prompt = params.prompt;
      payload.resolution = params.resolution;
      if (params.aspectRatio) payload.aspect_ratio = params.aspectRatio;
      if (mode === 'image-to-image' && model.imageField) payload[model.imageField] = params.imageUrls;
  }

  return payload;
}
