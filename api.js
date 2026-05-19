const API_BASE = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi';
const ENV_API_KEY = process.env.EXPO_PUBLIC_BIZYAIR_API_KEY || '';

const BZA_RATIOS_FULL = ['16:9','4:3','1:1','3:4','9:16','21:9','3:2','2:3','5:4','4:5','4:1','1:4','8:1','1:8'];
const BZA_RATIOS_10 = ['16:9','4:3','1:1','3:4','9:16','21:9','3:2','2:3','5:4','4:5'];
const BZA_RATIOS_10_ALT = ['1:1','16:9','9:16','4:3','3:4','3:2','2:3','5:4','4:5','21:9'];
const O2_I2I_RATIOS = ['1:1','2:3','3:2','4:5','5:4','3:4','4:3','16:9','9:16','2:1','1:2','3:1','1:3','21:9'];

const MODELS = {
  'bza-image-b2-base': {
    name: 'B.2 渠道版',
    icon: '🍌',
    manufacturer: '谷歌',
    paramType: 'resolution-ratio',
    prices: { '1K': 200, '2K': 200, '4K': 250 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_FULL,
    imageToImageRatios: BZA_RATIOS_FULL,
    maxPromptLength: 20000,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-b2-official': {
    name: 'B.2 官方版',
    icon: '🍌',
    manufacturer: '谷歌',
    paramType: 'resolution-ratio',
    prices: { '0.5K': 550, '1K': 550, '2K': 850, '4K': 1100 },
    resolutions: ['0.5K', '1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_FULL,
    imageToImageRatios: BZA_RATIOS_FULL,
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-b-pro-base': {
    name: 'B.Pro 渠道版',
    icon: '🍌',
    manufacturer: '谷歌',
    paramType: 'resolution-ratio',
    prices: { '1K': 400, '2K': 400, '4K': 500 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_10_ALT,
    imageToImageRatios: BZA_RATIOS_10_ALT,
    maxPromptLength: 20000,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-b-pro-official': {
    name: 'B.Pro 官方版',
    icon: '🍌',
    manufacturer: '谷歌',
    paramType: 'resolution-ratio',
    prices: { '1K': 700, '2K': 1000, '4K': 1300 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_10,
    imageToImageRatios: BZA_RATIOS_10,
    maxPromptLength: 20000,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'bza-image-o2-base': {
    name: 'O.2 渠道版',
    icon: '🤖',
    manufacturer: 'OpenAI',
    paramType: 'resolution-ratio',
    prices: { '1K': 100, '2K': 100, '4K': 100 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: ['1:1','2:3','3:2','4:5','5:4','3:4','4:3','16:9','9:16','21:9'],
    imageToImageRatios: O2_I2I_RATIOS,
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-o2-official': {
    name: 'O.2 官方版',
    icon: '🤖',
    manufacturer: 'OpenAI',
    paramType: 'width-height-quality',
    qualities: ['low', 'medium', 'high'],
    priceNote: '按尺寸+质量计费',
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 16,
    supportsImageToImage: true,
  },
  'seedream-5-0-official': {
    name: 'Seedream 5.0',
    icon: '🌱',
    manufacturer: '字节',
    paramType: 'size-only',
    prices: { '2K': 220, '3K': 220, '4K': 220 },
    resolutions: ['2K', '3K', '4K'],
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'wan-2-7-image-official': {
    name: '万相2.7',
    icon: '🌐',
    manufacturer: '阿里',
    paramType: 'wan-size',
    prices: { '1K': 200, '2K': 200, '4K': 200 },
    resolutions: ['1K', '2K', '4K', 'Custom'],
    maxPromptLength: 5000,
    imageField: 'images',
    maxImages: 9,
    supportsImageToImage: true,
    i2iResolutions: ['1K', '2K', 'Custom'],
  },
  'wan-2-7-image-pro-offcial': {
    name: '万相2.7 Pro',
    icon: '🌐',
    manufacturer: '阿里',
    paramType: 'wan-size',
    prices: { '1K': 500, '2K': 500, '4K': 500 },
    resolutions: ['1K', '2K', '4K', 'Custom'],
    maxPromptLength: 5000,
    imageField: 'images',
    maxImages: 9,
    supportsImageToImage: true,
    i2iResolutions: ['1K', '2K', 'Custom'],
  },
  'z-image-turbo': {
    name: 'Z-Image Turbo',
    icon: '⚡',
    manufacturer: '硅基流动',
    paramType: 'width-height',
    prices: { '1024': 5, '2048': 10 },
    maxPromptLength: 2500,
    supportsImageToImage: false,
  },
};

const SIZE_PRESETS = [
  { label: '1:1', width: 1024, height: 1024 },
  { label: '16:9', width: 1920, height: 1080 },
  { label: '9:16', width: 1080, height: 1920 },
  { label: '4:3', width: 1440, height: 1080 },
  { label: '3:4', width: 1080, height: 1440 },
  { label: '3:2', width: 1536, height: 1024 },
  { label: '2:3', width: 1024, height: 1536 },
];

function getModelInfo(modelId) {
  return MODELS[modelId] || MODELS['bza-image-b2-base'];
}

function getPrice(modelId, resolution) {
  const model = getModelInfo(modelId);
  return model.prices?.[resolution] || 0;
}

function calculatePrice(modelId, params) {
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

function getRatios(modelId, mode) {
  const model = getModelInfo(modelId);
  if (mode === 'image-to-image') return model.imageToImageRatios || [];
  return model.textToImageRatios || [];
}

function getResolutions(modelId, mode) {
  const model = getModelInfo(modelId);
  if (mode === 'image-to-image' && model.i2iResolutions) return model.i2iResolutions;
  return model.resolutions || [];
}

function buildPayload(modelId, mode, params) {
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

async function submitTask(apiKey, modelId, mode, payload) {
  const url = `${API_BASE}/${modelId}/${mode}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  const data = result.data || result;
  const id = data.request_id || data.task_id || data.id;
  if (!id) {
    throw new Error('提交成功但未返回任务ID，完整响应: ' + JSON.stringify(result));
  }
  return id;
}

async function queryTaskResult(apiKey, requestId) {
  const url = `${API_BASE}/${requestId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  const result = await response.json();
  return result.data || result;
}

async function submitImageTask(apiKey, modelId, mode, payload) {
  const key = apiKey || ENV_API_KEY;
  const requestId = await submitTask(key, modelId, mode, payload);
  return { requestId, apiKey: key };
}

async function getUploadToken(apiKey, fileName) {
  const params = new URLSearchParams({ file_name: fileName, file_type: 'inputs' });
  const url = `https://api.bizyair.cn/x/v1/upload/token?${params}`;
  const response = await fetch(url, { headers: { 'Authorization': `Bearer ${apiKey}` } });
  const raw = await response.json();
  return raw.data || raw;
}

async function commitResource(apiKey, name, objectKey) {
  const url = 'https://api.bizyair.cn/x/v1/input_resource/commit';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ name, object_key: objectKey })
  });
  const result = await response.json();
  return result.data || result;
}

async function uploadImageFile(apiKey, file) {
  const uploadInfo = await getUploadToken(apiKey, file.name);
  const fileInfo = uploadInfo.file;
  const storageInfo = uploadInfo.storage;
  const objectKey = fileInfo.object_key;
  const accessKeyId = fileInfo.access_key_id;
  const accessKeySecret = fileInfo.access_key_secret;
  const securityToken = fileInfo.security_token;
  const endpoint = storageInfo.endpoint;
  const bucket = storageInfo.bucket;

  const uploadUrl = `https://${bucket}.${endpoint}/${objectKey}`;
  const contentType = file.type || 'application/octet-stream';
  const date = new Date().toUTCString();

  const stringToSign = `PUT\n\n${contentType}\n${date}\nx-oss-date:${date}\nx-oss-security-token:${securityToken}\n/${bucket}/${objectKey}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(accessKeySecret),
    { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign));
  const signature = btoa(String.fromCharCode(...new Uint8Array(sigBytes)));
  const authorization = `OSS ${accessKeyId}:${signature}`;

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': authorization,
      'x-oss-security-token': securityToken,
      'x-oss-date': date,
      'Content-Type': contentType,
    },
    body: file
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OSS上传失败: ${response.status} - ${errText}`);
  }

  await commitResource(apiKey, file.name, objectKey);
  return uploadUrl;
}

function getActualResolution(modelId, mode, params) {
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

export { submitImageTask, queryTaskResult, uploadImageFile, buildPayload, calculatePrice, getPrice, getRatios, getResolutions, getModelInfo, getActualResolution, MODELS, SIZE_PRESETS, ENV_API_KEY };
