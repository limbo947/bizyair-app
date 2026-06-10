import jsSHA from 'jssha';
import { Platform } from 'react-native';
import {
  API_BASE,
  WEBAPP_API_BASE,
  WEBAPP_DETAIL_URL,
  UPLOAD_TOKEN_URL,
  COMMIT_RESOURCE_URL,
  USER_METADATA_URL,
  WALLET_BALANCE_URL,
  ENV_API_KEY,
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  MODELS,
} from '../constants/models';

/**
 * 带超时和重试的请求封装。
 * @param {string} url - 请求URL
 * @param {object} [options] - fetch 选项
 * @param {number} [options.retries=0] - 当前重试次数（内部使用）
 * @returns {Promise<object>} 解析后的 JSON 响应
 * @throws {Error} 超时、服务端错误或达到最大重试次数时抛出
 */
async function request(url, options = {}) {
  const { retries = 0, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`[${response.status}] ${body || response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络连接后重试');
    }

    const isRetryable =
      retries < MAX_RETRIES &&
      (err.message.includes('超时') ||
       err.message.startsWith('[5') ||
       err.message === 'Network request failed' ||
       err.message === 'Failed to fetch' ||
       err.message === 'fetch failed' ||
       (err.name === 'TypeError' && err.message.includes('fetch')));

    if (isRetryable) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries)));
      return request(url, { ...options, retries: retries + 1 });
    }

    throw err;
  }
}

/**
 * 提交任务到 BizyAir API。
 * @param {string} apiKey - API 密钥
 * @param {string} modelId - 模型ID
 * @param {string} mode - 调用模式
 * @param {object} payload - 请求体
 * @returns {Promise<string>} 任务ID（request_id / task_id / id）
 * @throws {Error} 提交失败或未返回任务ID时抛出
 */
async function submitTask(apiKey, modelId, mode, payload) {
  const model = MODELS[modelId];
  const path = model?.endpoint || `${modelId}/${mode}`;
  const url = `${API_BASE}/${path}`;
  const result = await request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = result.data || result;
  const id = data.request_id || data.task_id || data.id;
  if (!id) {
    throw new Error('提交成功但未返回任务ID，完整响应: ' + JSON.stringify(result));
  }
  return id;
}

/**
 * 查询任务结果。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 任务结果数据
 */
async function queryTaskResult(apiKey, requestId) {
  const url = `${API_BASE}/${requestId}`;
  const result = await request(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return result.data || result;
}

/**
 * 通用任务提交函数（涵盖图片/视频/LLM/TTS/Vision 等所有类型）。
 * @param {string} apiKey - API 密钥（为空时使用 ENV_API_KEY）
 * @param {string} modelId - 模型ID
 * @param {string} mode - 调用模式
 * @param {object} payload - 请求体
 * @returns {Promise<{requestId: string, apiKey: string}>} 任务ID和实际使用的API密钥
 */
async function submitTaskWithKey(apiKey, modelId, mode, payload) {
  const key = apiKey || ENV_API_KEY;
  const requestId = await submitTask(key, modelId, mode, payload);
  return { requestId, apiKey: key };
}

// 保留别名以兼容外部调用
const submitImageTask = submitTaskWithKey;

/**
 * 获取文件上传凭证。
 * @param {string} apiKey - API 密钥
 * @param {string} fileName - 文件名
 * @returns {Promise<object>} 上传凭证信息（含 file 和 storage 字段）
 */
async function getUploadToken(apiKey, fileName) {
  const params = new URLSearchParams({ file_name: fileName, file_type: 'inputs' });
  const url = `${UPLOAD_TOKEN_URL}?${params}`;
  const raw = await request(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return raw.data || raw;
}

/**
 * 提交上传资源到服务端确认。
 * @param {string} apiKey - API 密钥
 * @param {string} name - 文件名
 * @param {string} objectKey - OSS 对象键
 * @returns {Promise<object>} 确认结果
 */
async function commitResource(apiKey, name, objectKey) {
  const result = await request(COMMIT_RESOURCE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ name, object_key: objectKey }),
  });
  return result.data || result;
}

/**
 * 上传图片文件到 OSS 并提交确认。流程：获取凭证 → OSS PUT 上传 → commitResource。
 * @param {string} apiKey - API 密钥
 * @param {object} file - 文件对象 { uri, name, type }
 * @returns {Promise<string>} 上传后的文件 URL
 * @throws {Error} 获取凭证失败、OSS上传失败或确认失败时抛出
 */
async function uploadViaProxy(apiKey, file) {
  const fileName = file.name || 'upload.jpg';
  let fileBase64;

  if (file.base64) {
    fileBase64 = file.base64;
  } else if (file.rawFile instanceof Blob || file.rawFile instanceof File) {
    const buf = await file.rawFile.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    }
    fileBase64 = btoa(binary);
  } else if (file.uri) {
    const resp = await fetch(file.uri);
    if (!resp.ok) throw new Error(`读取文件失败: ${resp.status}`);
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    }
    fileBase64 = btoa(binary);
  } else if (file instanceof Blob || file instanceof File) {
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    }
    fileBase64 = btoa(binary);
  } else {
    throw new Error('上传失败: 无法读取文件内容');
  }

  if (!fileBase64) {
    throw new Error('上传失败: 文件内容为空');
  }

  const proxyUrl = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_UPLOAD_PROXY_URL) || 'http://localhost:3001';
  const resp = await fetch(`${proxyUrl}/api/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, fileName, fileData: fileBase64 }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`上传代理请求失败: ${resp.status} - ${text.slice(0, 200)}`);
  }
  const ct = resp.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    throw new Error('上传代理返回非JSON响应，请确保代理服务器已启动: node scripts/upload-proxy.mjs');
  }
  const result = await resp.json();
  if (result.error) throw new Error(result.error);
  return result.url;
}

async function uploadDirectToOSS(apiKey, file) {
  const fileName = file.name || 'upload.jpg';
  const uploadInfo = await getUploadToken(apiKey, fileName);
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

  const stringToSign = `PUT\n\n${contentType}\n${date}\nx-oss-security-token:${securityToken}\n/${bucket}/${objectKey}`;
  const shaObj = new jsSHA('SHA-1', 'TEXT');
  shaObj.setHMACKey(accessKeySecret, 'TEXT');
  shaObj.update(stringToSign);
  const signature = shaObj.getHMAC('B64');
  const authorization = `OSS ${accessKeyId}:${signature}`;

  let body;
  if (file.uri) {
    const fetchResponse = await fetch(file.uri);
    body = await fetchResponse.arrayBuffer();
  } else if (file instanceof ArrayBuffer || ArrayBuffer.isView(file)) {
    body = file;
  } else {
    body = file;
  }

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: authorization,
      'x-oss-security-token': securityToken,
      Date: date,
      'Content-Type': contentType,
    },
    body,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OSS上传失败: ${response.status} - ${errText}`);
  }

  await commitResource(apiKey, fileName, objectKey);
  return uploadUrl;
}

async function uploadImageFile(apiKey, file) {
  if (Platform.OS === 'web') {
    return uploadViaProxy(apiKey, file);
  }
  return uploadDirectToOSS(apiKey, file);
}

/**
 * 获取用户信息。
 * @param {string} apiKey - API 密钥
 * @returns {Promise<object>} 用户元数据
 */
async function fetchUserInfo(apiKey) {
  const result = await request(USER_METADATA_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return result.data || result;
}

/**
 * 获取钱包余额。
 * @param {string} apiKey - API 密钥
 * @returns {Promise<object>} 钱包余额数据
 */
async function fetchWalletBalance(apiKey) {
  const result = await request(WALLET_BALANCE_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return result.data || result;
}

const submitVideoTask = submitTaskWithKey;
const submitLLMTask = submitTaskWithKey;
const submitTTSTask = submitTaskWithKey;
const submitVisionTask = submitTaskWithKey;

/**
 * 上传视频文件（复用图片上传流程：获取凭证 → OSS PUT 上传 → commitResource）。
 * @param {string} apiKey - API 密钥
 * @param {object} file - 文件对象 { uri, name, type }
 * @returns {Promise<string>} 上传后的文件 URL
 */
async function uploadVideoFile(apiKey, file) {
  return uploadImageFile(apiKey, file);
}

/**
 * 提交 WebApp 任务（异步模式）。
 * @param {string} apiKey - API 密钥
 * @param {number|string} webAppId - WebApp ID
 * @param {object} inputValues - 输入参数键值对
 * @returns {Promise<string>} requestId
 * @throws {Error} 提交失败或未返回 requestId 时抛出
 */
async function submitWebappTask(apiKey, webAppId, inputValues) {
  const url = `${WEBAPP_API_BASE}/create`;
  const result = await request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Bizyair-Task-Async': 'enable',
    },
    body: JSON.stringify({
      web_app_id: Number(webAppId),
      suppress_preview_output: false,
      input_values: inputValues,
    }),
  });

  const id = result.requestId || result.request_id;
  if (!id) {
    throw new Error('提交成功但未返回 requestId，完整响应: ' + JSON.stringify(result));
  }
  return id;
}

/**
 * 查询 WebApp 任务状态。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 任务状态详情
 */
async function queryWebappTaskDetail(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/detail?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return result.data || result;
}

/**
 * 查询 WebApp 任务结果。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 任务结果数据（含 outputs 数组）
 */
async function queryWebappTaskOutputs(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/outputs?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return result.data || result;
}

/**
 * 获取 WebApp 详情（含 input_nodes 参数信息）。
 * 公开接口，无需 API Key。
 * @param {number|string} id - bizy_model_id（社区页面 URL 中的数字）
 * @returns {Promise<object>} 应用详情数据（含 id=web_app_id, name, input_nodes 等）
 * @throws {Error} 获取失败或应用不存在时抛出
 */
async function fetchWebappDetail(id) {
  const url = `${WEBAPP_DETAIL_URL}/${id}`;
  const result = await request(url, { method: 'GET' });
  if (result.code !== 20000 || !result.data) {
    // API 返回的 message 可能是编码乱码，使用友好提示
    const errorMessages = {
      20224: '应用不存在或已被下架',
      401: '无权访问该应用',
      403: '该应用为私有应用，无法访问',
    };
    throw new Error(errorMessages[result.code] || '应用不存在或无法访问');
  }
  return result.data;
}

/**
 * 取消排队中的 WebApp 任务。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 响应数据
 */
async function cancelWebappTask(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/openapi/cancel?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  return result;
}

/**
 * 中断运行中的 WebApp 任务。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 响应数据
 */
async function interruptWebappTask(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/openapi/interrupt?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export {
  submitImageTask,
  submitVideoTask,
  submitLLMTask,
  submitTTSTask,
  submitVisionTask,
  queryTaskResult,
  uploadImageFile,
  uploadVideoFile,
  submitTask,
  getUploadToken,
  commitResource,
  request,
  fetchUserInfo,
  fetchWalletBalance,
  submitWebappTask,
  queryWebappTaskDetail,
  queryWebappTaskOutputs,
  fetchWebappDetail,
  cancelWebappTask,
  interruptWebappTask,
};