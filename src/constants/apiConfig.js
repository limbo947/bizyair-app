/**
 * API 集中配置 —— 更换 API 服务时只需修改本文件。
 *
 * 所有服务地址、端点、默认密钥、超时/重试/轮询参数统一在此定义；
 * services/ 层与各引用方一律从本文件导入（models.js 不再转发，
 * 避免配置散落导致换服务时漏改）。
 */

// ---- 服务主机与端点 ----
// 国际版按职责拆为两个主机：api（任务/上传/钱包）与 meta（用户/资源/应用详情/社区/字典）
export const API_HOST = 'https://api.bizyair.ai';
export const META_HOST = 'https://meta.bizyair.ai';
export const API_BASE = `${API_HOST}/v1/modelzoo/tasks/openapi`;
export const WEBAPP_API_BASE = `${API_HOST}/v1/webapp/task/openapi`;
export const WEBAPP_DETAIL_URL = `${META_HOST}/v1/webapp`;        // 使用时拼 /{id}/detail
export const COMMUNITY_API_BASE = `${META_HOST}/v1/bizy_models/community`;
export const DICT_API_URL = `${META_HOST}/v1/dict`;
export const UPLOAD_TOKEN_URL = `${API_HOST}/v1/upload/token`;
export const COMMIT_RESOURCE_URL = `${META_HOST}/v1/input_resource/commit`;
export const USER_METADATA_URL = `${META_HOST}/v1/user/info`;     // 名称保留以最小化改动，实为 user info
export const WALLET_BALANCE_URL = `${API_HOST}/v1/wallet`;
// 上传目录类型：国际版为 inputs_temp（国内版为 inputs）
export const UPLOAD_FILE_TYPE = 'inputs_temp';

// ---- 密钥 ----
// 环境变量注入的默认密钥（.env 中 EXPO_PUBLIC_BIZYAIR_API_KEY），运行时可被用户密钥覆盖
export const ENV_API_KEY = process.env.EXPO_PUBLIC_BIZYAIR_API_KEY || '';

// ---- 文件存储域名特征 ----
// 主路径：commit 接口返回的 storage 域名；后三项为 OSS 直连与国内版历史数据兜底
// 注意：该列表与 UPLOAD_FILE_TYPE 强耦合，二者必须同时调整
// OSS 直连 bucket 以真实 Key 实测为准（bizyair，非官方文档所写的 bizyair-ai）
export const OSS_INPUT_URL_PATTERNS = [
  'storage.bizyair.ai/inputs_temp/',
  'storage.bizyair.ai/inputs/',
  'bizyair.oss-us-east-1.aliyuncs.com/inputs_temp/',
  'storage.bizyair.cn/inputs/',
  'bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/',
];

// ---- 上传中转代理 ----
// 本地调试 OSS 直传用的 Node 中转服务（scripts/upload-proxy.mjs），可用环境变量覆盖
export const UPLOAD_PROXY_URL =
  (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_UPLOAD_PROXY_URL) ||
  'http://localhost:3001';

// ---- 请求超时 / 重试 / 轮询 ----
// 跨境链路 RTT 更高，超时从 15000 放宽到 25000（迁移方案 §6.4）
export const REQUEST_TIMEOUT_MS = 25000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const POLLING_INTERVAL_MS = 3000;
