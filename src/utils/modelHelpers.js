import { MODELS } from '../constants/models';

export function getModelInfo(modelId) {
  return MODELS[modelId] || MODELS['bza-image-b2-base'];
}

export function getPrice(modelId, resolution) {
  const model = getModelInfo(modelId);
  return model.prices?.[resolution] || 0;
}

export function calculatePrice(modelId, params) {
  const model = getModelInfo(modelId);

  if (model.prices && model.paramType !== 'width-height-quality' && model.paramType !== 'width-height') {
    const res = params.resolution === 'Custom' ? '2K' : params.resolution;
    return model.prices[res] || Object.values(model.prices)[0] || 0;
  }

  if (modelId === 'bza-image-o2-official') {
    const w = params.width || 1024;
    const h = params.height || 1024;
    const q = params.quality || 'medium';
    const pixels = w * h;
    const O2_PRICES = {
      high: [
        { max: 1920 * 1080, price: 1120 },
        { max: 2560 * 1440, price: 2149 },
        { max: Infinity, price: 3486 },
      ],
      medium: [
        { max: 1920 * 1080, price: 378 },
        { max: 2560 * 1440, price: 630 },
        { max: Infinity, price: 966 },
      ],
      low: [
        { max: 1920 * 1080, price: 161 },
        { max: 2560 * 1440, price: 182 },
        { max: Infinity, price: 224 },
      ],
    };
    const tiers = O2_PRICES[q] || O2_PRICES.medium;
    const tier = tiers.find((t) => pixels <= t.max);
    return tier ? tier.price : tiers[tiers.length - 1].price;
  }

  if (modelId === 'z-image-turbo') {
    const w = params.width || 1024;
    const h = params.height || 1024;
    return w * h <= 1024 * 1024 ? 5 : 10;
  }

  return 0;
}

export function getRatios(modelId, mode) {
  const model = getModelInfo(modelId);
  if (mode === 'image-to-image') return model.imageToImageRatios || [];
  return model.textToImageRatios || [];
}

export function getResolutions(modelId, mode) {
  const model = getModelInfo(modelId);
  if (mode === 'image-to-image' && model.i2iResolutions) return model.i2iResolutions;
  return model.resolutions || [];
}

export function getActualResolution(modelId, mode, params) {
  const model = getModelInfo(modelId);
  const RES_BASE = { '0.5K': 512, '1K': 1024, '2K': 2048, '3K': 3072, '4K': 4096 };

  switch (model.paramType) {
    case 'resolution-ratio': {
      const base = RES_BASE[params.resolution] || 1024;
      if (!params.aspectRatio) return `${base}×${base}`;
      const parts = params.aspectRatio.split(':').map(Number);
      if (parts.length !== 2 || parts[0] === 0 || parts[1] === 0) return `${base}×${base}`;
      const [rw, rh] = parts;
      if (rw >= rh) {
        const w = base;
        const h = Math.round(base * rh / rw);
        return `${w}×${h}`;
      }
      const h = base;
      const w = Math.round(base * rw / rh);
      return `${w}×${h}`;
    }
    case 'width-height-quality':
      return `${params.width || 1024}×${params.height || 1024}`;
    case 'size-only': {
      const base = RES_BASE[params.resolution] || 2048;
      return `~${base}`;
    }
    case 'wan-size': {
      if (params.resolution === 'Custom') {
        return `${parseInt(params.customWidth) || 2048}×${parseInt(params.customHeight) || 2048}`;
      }
      const base = RES_BASE[params.resolution] || 2048;
      return `${base}×${base}`;
    }
    case 'width-height':
      return `${params.width || 1024}×${params.height || 1024}`;
    default:
      return params.resolution || '';
  }
}
