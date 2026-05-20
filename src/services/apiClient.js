const jsSHA = require('jssha');
import { API_BASE, ENV_API_KEY } from '../constants/models';

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
    body: body
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OSS上传失败: ${response.status} - ${errText}`);
  }

  await commitResource(apiKey, fileName, objectKey);
  return uploadUrl;
}

export { submitImageTask, queryTaskResult, uploadImageFile, submitTask, getUploadToken, commitResource };
