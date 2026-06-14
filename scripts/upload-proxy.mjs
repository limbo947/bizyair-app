import { createServer } from 'http';
import jsSHA from 'jssha';

const API_HOST = 'https://api.bizyair.cn';
const PORT = 3001;
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonRes(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS_HEADERS });
  res.end(JSON.stringify(body));
}

async function apiGet(url, apiKey) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!r.ok) throw new Error(`API请求失败: ${r.status}`);
  return r.json();
}

async function apiPost(url, apiKey, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`API请求失败: ${r.status}`);
  return r.json();
}

function getContentType(fileName) {
  const ext = fileName.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  const imageTypes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp' };
  const videoTypes = { mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska' };
  const audioTypes = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac', aac: 'audio/aac' };
  return imageTypes[ext] || videoTypes[ext] || audioTypes[ext] || 'application/octet-stream';
}

async function handleUpload(rawBody) {
  const { apiKey, fileName, fileData } = JSON.parse(rawBody);
  if (!apiKey || !fileName || !fileData) return { status: 400, body: { error: '缺少必要参数' } };

  console.log(`[upload] ${fileName}, base64 length=${fileData.length}`);

  const params = new URLSearchParams({ file_name: fileName, file_type: 'inputs' });
  const tokenResult = await apiGet(`${API_HOST}/x/v1/upload/token?${params}`, apiKey);
  const uploadInfo = tokenResult.data || tokenResult;
  const fileInfo = uploadInfo.file;
  const storageInfo = uploadInfo.storage;
  if (!fileInfo || !storageInfo) return { status: 502, body: { error: '获取上传凭证失败' } };

  const { object_key: objectKey, access_key_id: accessKeyId, access_key_secret: accessKeySecret, security_token: securityToken } = fileInfo;
  const { endpoint, bucket } = storageInfo;
  if (!objectKey || !accessKeyId || !accessKeySecret || !securityToken || !endpoint || !bucket) {
    return { status: 502, body: { error: '上传凭证参数不完整' } };
  }

  const uploadUrl = `https://${bucket}.${endpoint}/${objectKey}`;
  const date = new Date().toUTCString();
  const contentType = getContentType(fileName);

  const stringToSign = `PUT\n\n${contentType}\n${date}\nx-oss-security-token:${securityToken}\n/${bucket}/${objectKey}`;
  const shaObj = new jsSHA('SHA-1', 'TEXT');
  shaObj.setHMACKey(accessKeySecret, 'TEXT');
  shaObj.update(stringToSign);
  const signature = shaObj.getHMAC('B64');

  console.log(`[upload] PUT ${uploadUrl}, content-type=${contentType}`);

  const uploadResp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `OSS ${accessKeyId}:${signature}`,
      'x-oss-security-token': securityToken,
      Date: date,
      'Content-Type': contentType,
    },
    // eslint-disable-next-line no-undef -- Buffer is available in Node.js runtime
    body: Buffer.from(fileData, 'base64'),
  });

  if (!uploadResp.ok) {
    const errText = await uploadResp.text().catch(() => '');
    console.error(`[upload] OSS failed: ${uploadResp.status} - ${errText.slice(0, 300)}`);
    return { status: 502, body: { error: `OSS上传失败: ${uploadResp.status} - ${errText}` } };
  }

  console.log(`[upload] OSS PUT success, committing...`);

  const commitResult = await apiPost(`${API_HOST}/x/v1/input_resource/commit`, apiKey, { name: fileName, object_key: objectKey });
  const commitData = commitResult.data || commitResult;
  const finalUrl = commitData.url || uploadUrl;

  console.log(`[upload] done, commitUrl=${commitData.url}, ossUrl=${uploadUrl}`);
  return { status: 200, body: { url: uploadUrl } };
}

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS_HEADERS); res.end(); return; }
  if (req.method === 'POST' && req.url === '/api/upload') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const result = await handleUpload(body);
      jsonRes(res, result.status, result.body);
    } catch (err) {
      console.error(`[upload] error: ${err.message}`);
      jsonRes(res, 500, { error: err.message || '上传失败' });
    }
    return;
  }
  res.writeHead(404, CORS_HEADERS);
  res.end();
}).listen(PORT, () => {
  console.log(`[upload-proxy] http://localhost:${PORT}/api/upload`);
});
