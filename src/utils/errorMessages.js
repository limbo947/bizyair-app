/**
 * 用户友好的错误信息映射。
 * 将技术化的异常 message 转换为用户可理解的提示。
 */

/**
 * 错误码枚举
 */
export const ERROR_CODES = {
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  AUTH: 'AUTH',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  QUOTA: 'QUOTA',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER: 'SERVER',
  UPLOAD: 'UPLOAD',
  UNKNOWN: 'UNKNOWN',
};

/**
 * 错误码 → 用户友好提示映射
 */
const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK]: '网络连接失败，请检查网络后重试',
  [ERROR_CODES.TIMEOUT]: '请求超时，请稍后重试',
  [ERROR_CODES.AUTH]: 'API 密钥无效，请重新配置',
  [ERROR_CODES.AUTH_EXPIRED]: 'API 密钥已失效，请重新配置',
  [ERROR_CODES.QUOTA]: '余额不足，请充值后再试',
  [ERROR_CODES.NOT_FOUND]: '请求的资源不存在，请检查模型或参数',
  [ERROR_CODES.RATE_LIMIT]: '请求过于频繁，请稍后再试',
  [ERROR_CODES.SERVER]: '服务器暂时不可用，请稍后重试',
  [ERROR_CODES.UPLOAD]: '文件上传失败，请重试',
  [ERROR_CODES.UNKNOWN]: '操作失败，请稍后重试',
};

/**
 * 从原始错误中识别错误码
 * @param {Error|{message:string,status?:number,name?:string}} err
 * @returns {string} ERROR_CODES 之一
 */
export function classifyError(err) {
  if (!err) return ERROR_CODES.UNKNOWN;

  const msg = (err.message || '').toLowerCase();
  const status = err.status || (typeof err.message === 'string' ? parseStatusFromMessage(err.message) : 0);

  // 网络层错误
  if (err.name === 'AbortError' || msg.includes('超时') || msg.includes('timeout')) {
    return ERROR_CODES.TIMEOUT;
  }
  if (msg.includes('network request failed') || msg.includes('failed to fetch') || msg.includes('fetch failed') || (err.name === 'TypeError' && msg.includes('fetch'))) {
    return ERROR_CODES.NETWORK;
  }

  // HTTP 状态码分类
  if (status === 401) return ERROR_CODES.AUTH;
  if (status === 403) return ERROR_CODES.AUTH_EXPIRED;
  if (status === 402) return ERROR_CODES.QUOTA;
  if (status === 404) return ERROR_CODES.NOT_FOUND;
  if (status === 429) return ERROR_CODES.RATE_LIMIT;
  if (status >= 500) return ERROR_CODES.SERVER;

  // 上传相关
  if (msg.includes('上传') || msg.includes('upload')) {
    return ERROR_CODES.UPLOAD;
  }

  return ERROR_CODES.UNKNOWN;
}

/**
 * 从消息文本中解析 HTTP 状态码（格式：[401] xxx）
 */
function parseStatusFromMessage(message) {
  const match = message.match(/^\[(\d{3})\]/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * 获取用户友好的错误提示
 * @param {Error|{message:string}} err
 * @returns {string} 用户可理解的提示文案
 */
export function getUserMessage(err) {
  const code = classifyError(err);
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN];
}

/**
 * 创建带 code 和 userMessage 的错误对象
 * @param {Error|{message:string}} err
 * @returns {{code: string, message: string, userMessage: string, originalError: *}}
 */
export function normalizeError(err) {
  const code = classifyError(err);
  return {
    code,
    message: err?.message || '',
    userMessage: ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN],
    originalError: err,
  };
}
