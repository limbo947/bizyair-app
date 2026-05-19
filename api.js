const API_BASE = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi';
const ENV_API_KEY = process.env.EXPO_PUBLIC_BIZYAIR_API_KEY || '';

const PRICE_MAP = {
  '1K': 200,
  '2K': 200,
  '4K': 250,
};

function getPrice(resolution) {
  return PRICE_MAP[resolution] || 0;
}

async function submitTextToImageTask(apiKey, prompt, resolution = '2K', aspectRatio = '4:3') {
  const url = `${API_BASE}/bza-image-b2-base/text-to-image`;
  const payload = {
    prompt: prompt,
    resolution: resolution,
    aspect_ratio: aspectRatio
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  console.log('[submit] 完整响应:', JSON.stringify(result));
  const data = result.data || result;
  const id = data.request_id || data.task_id || data.id;
  if (!id) {
    throw new Error('提交成功但未返回任务ID，完整响应: ' + JSON.stringify(result));
  }
  console.log('[submit] 提取的任务ID:', id);
  return id;
}

async function queryTaskResult(apiKey, requestId) {
  const url = `${API_BASE}/${requestId}`;
  console.log('[query] 请求URL:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  const result = await response.json();
  console.log('[query] 完整响应:', JSON.stringify(result));
  return result.data || result;
}

async function generateImage(apiKey, prompt, resolution = '2K', aspectRatio = '4:3') {
  const key = apiKey || ENV_API_KEY;
  const price = getPrice(resolution);

  const requestId = await submitTextToImageTask(key, prompt, resolution, aspectRatio);
  console.log('任务已提交，ID:', requestId);

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const result = await queryTaskResult(key, requestId);
        console.log('[poll] 当前状态:', result.status);
        
        if (result.status === 'Success') {
          clearInterval(interval);
          const images = result.outputs && result.outputs.images;
          if (!images || images.length === 0) {
            reject(new Error('任务成功但未返回图片'));
            return;
          }
          const imageUrl = images[0];
          console.log('生成成功，图片URL:', imageUrl);
          resolve({ imageUrl, price, prompt, resolution, aspectRatio });
        } else if (result.status === 'Failed') {
          clearInterval(interval);
          reject(new Error(result.message || '任务失败'));
        }
      } catch (error) {
        clearInterval(interval);
        console.error('[poll] 轮询出错:', error);
        reject(error);
      }
    }, 3000);
  });
}

export { generateImage, getPrice, ENV_API_KEY };
