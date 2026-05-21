import jsSHA from 'jssha';
import {
  API_BASE,
  UPLOAD_TOKEN_URL,
  COMMIT_RESOURCE_URL,
  ENV_API_KEY,
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} from '../constants/models';

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
       err.message === 'Network request failed');

    if (isRetryable) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries)));
      return request(url, { ...options, retries: retries + 1 });
    }

    throw err;
  }
}

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

async function submitImageTask(apiKey, modelId, mode, payload) {
  const key = apiKey || ENV_API_KEY;
  const requestId = await submitTask(key, modelId, mode, payload);
  return { requestId, apiKey: key };
}

async function getUploadToken(apiKey, fileName) {
  const params = new URLSearchParams({ file_name: fileName, file_type: 'inputs' });
  const url = `${UPLOAD_TOKEN_URL}?${params}`;
  const raw = await request(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return raw.data || raw;
}

async function commitResource(apiKey, name, objectKey) {
  const result = await request(COMMIT_RESOURCE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ name, object_key: objectKey }),
  });
  return result.data || result;
}

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

  const stringToSign = `PUT\n\n${contentType}\n${date}\nx-oss-date:${date}\nx-oss-security-token:${securityToken}\n/${bucket}/${objectKey}`;

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
      'Authorization': authorization,
      'x-oss-security-token': securityToken,
      'x-oss-date': date,
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

export {
  submitImageTask,
  queryTaskResult,
  uploadImageFile,
  submitTask,
  getUploadToken,
  commitResource,
  request,
};