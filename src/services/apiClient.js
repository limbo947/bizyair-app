import jsSHA from 'jssha';
import {
  API_BASE,
  UPLOAD_TOKEN_URL,
  COMMIT_RESOURCE_URL,
  USER_METADATA_URL,
  WALLET_BALANCE_URL,
  ENV_API_KEY,
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
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
  const url = `${API_BASE}/${modelId}/${mode}`;
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
async function uploadImageFile(apiKey, file) {
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

  // 使用 x-oss-date 时，Date 位置留空（OSS V1 签名规范）
  const stringToSign = `PUT\n\n${contentType}\n\nx-oss-date:${date}\nx-oss-security-token:${securityToken}\n/${bucket}/${objectKey}`;

  const shaObj = new jsSHA('SHA-1', 'TEXT');
  shaObj.setHMACKey(accessKeySecret, 'TEXT');
  shaObj.update(stringToSign);
  const signature = shaObj.getHMAC('B64');
  const authorization = `OSS ${accessKeyId}:${signature}`;

  let body;
  if (file.uri) {
    const fileFetchController = new AbortController();
    const fileFetchTimeout = setTimeout(() => fileFetchController.abort(), REQUEST_TIMEOUT_MS);
    try {
      const fetchResponse = await fetch(file.uri, { signal: fileFetchController.signal });
      body = await fetchResponse.arrayBuffer();
    } finally {
      clearTimeout(fileFetchTimeout);
    }
  } else if (file instanceof ArrayBuffer || ArrayBuffer.isView(file)) {
    body = file;
  } else {
    body = file;
  }

  const uploadController = new AbortController();
  const uploadTimeout = setTimeout(() => uploadController.abort(), REQUEST_TIMEOUT_MS * 4);
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authorization,
        'x-oss-security-token': securityToken,
        'x-oss-date': date,
        'Content-Type': contentType,
      },
      body,
      signal: uploadController.signal,
    });

    clearTimeout(uploadTimeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OSS上传失败: ${response.status} - ${errText}`);
    }
  } catch (err) {
    clearTimeout(uploadTimeout);
    if (err.name === 'AbortError') {
      throw new Error('OSS上传超时，请检查网络连接后重试');
    }
    throw err;
  }

  await commitResource(apiKey, fileName, objectKey);
  return uploadUrl;
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
};