/**
 * API 集中配置 —— 更换 API 服务时只需修改本文件。
 *
 * 所有服务地址、端点、默认密钥、超时/重试/轮询参数统一在此定义；
 * services/ 层与各引用方一律从本文件导入（models.js 不再转发，
 * 避免配置散落导致换服务时漏改）。
 */

// ---- 服务主机与端点 ----
export const API_HOST = 'https://api.bizyair.cn';
export const API_BASE = `${API_HOST}/x/v1/modelzoo/tasks/openapi`;
export const WEBAPP_API_BASE = `${API_HOST}/w/v1/webapp/task/openapi`;
export const WEBAPP_DETAIL_URL = `${API_HOST}/x/v1/webapp`;
export const COMMUNITY_API_BASE = `${API_HOST}/x/v1/bizy_models/community`;
export const DICT_API_URL = `${API_HOST}/x/v1/dict`;
export const UPLOAD_TOKEN_URL = `${API_HOST}/x/v1/upload/token`;
export const COMMIT_RESOURCE_URL = `${API_HOST}/x/v1/input_resource/commit`;
export const USER_METADATA_URL = `${API_HOST}/x/v1/user/metadata`;
export const WALLET_BALANCE_URL = `${API_HOST}/y/v1/wallet`;

// ---- 密钥 ----
// 环境变量注入的默认密钥（.env 中 EXPO_PUBLIC_BIZYAIR_API_KEY），运行时可被用户密钥覆盖
export const ENV_API_KEY = process.env.EXPO_PUBLIC_BIZYAIR_API_KEY || '';

// ---- 文件存储域名特征 ----
// 识别"bizyair 上传文件 URL"的路径特征（OSS 直传域名与中转存储域名）
export const OSS_INPUT_URL_PATTERNS = [
  'bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/',
  'storage.bizyair.cn/inputs/',
];

// ---- 上传中转代理 ----
// 本地调试 OSS 直传用的 Node 中转服务（scripts/upload-proxy.mjs），可用环境变量覆盖
export const UPLOAD_PROXY_URL =
  (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_UPLOAD_PROXY_URL) ||
  'http://localhost:3001';

// ---- 请求超时 / 重试 / 轮询 ----
export const REQUEST_TIMEOUT_MS = 15000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const POLLING_INTERVAL_MS = 3000;
