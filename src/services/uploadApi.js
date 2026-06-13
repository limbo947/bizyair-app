import jsSHA from 'jssha';
import { Platform } from 'react-native';
import {
  UPLOAD_TOKEN_URL,
  COMMIT_RESOURCE_URL,
} from '../constants/models';
import { request } from './httpClient';

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
 * 上传视频文件（复用图片上传流程：获取凭证 → OSS PUT 上传 → commitResource）。
 * @param {string} apiKey - API 密钥
 * @param {object} file - 文件对象 { uri, name, type }
 * @returns {Promise<string>} 上传后的文件 URL
 */
async function uploadVideoFile(apiKey, file) {
  return uploadImageFile(apiKey, file);
}

export {
  getUploadToken,
  commitResource,
  uploadViaProxy,
  uploadDirectToOSS,
  uploadImageFile,
  uploadVideoFile,
};
