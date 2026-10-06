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
 * 国际版业务码 → 用户友好提示（官方 errors-retry 全表归纳，见迁移方案 §6.1/§6.3）。
 * 非 2xx 响应由 httpClient 挂载 err.apiCode 后在此查表。
 */
const API_CODE_MESSAGES = {
  // 认证 / 密钥
  20052: 'API 密钥无效，请到 www.bizyair.ai 重新签发后填入',
  20054: 'API 密钥不存在（可能已删除或重置），请到 www.bizyair.ai 重新签发',
  20093: 'API 密钥已过期，请到 www.bizyair.ai 重新签发',
  20094: 'API Key 配额已耗尽，请检查账户或更换 Key',
  // 余额 / 内容 / 实名 / 节点
  20049: '账户余额不足，请先充值',
  20021: '内容包含禁止或敏感内容，请修改后重试',
  30019: '该模型仅限已实名认证的用户调用',
  30094: '该模型节点已下线，暂时不可调用',
  60014: '该模型节点已废弃，请改用新模型',
  // 资源不存在
  20224: '应用不存在或已被下架',
  20230: '应用不存在或已被下架',
  30009: '任务不存在或已被清理',
  30046: '任务输出尚未生成或已过期',
  // 取消 / 中断冲突
  30035: '任务正在运行，请先中断再取消',
  30036: '任务未在排队中，无法取消',
  30038: '任务未在运行中，无法中断',
  20098: '该任务无法中断',
  20100: '该任务无法取消',
  30041: '请先取消任务再中断',
  30047: '任务状态已变更，请刷新后重试',
  // 限流 / 配额
  30039: '任务排队已达上限，请稍后重试',
  30040: '任务并发已达上限，请稍后重试',
  50600: '请求过于频繁，请稍后再试',
  50601: '请求频率超限（RPM），请稍后重试',
  50602: '请求频率超限（TPM），请稍后重试',
  50603: '请求频率超限（RPD），请稍后重试',
  50604: '请求频率超限（RPH），请稍后重试',
  // 第三方节点
  30101: '第三方接口认证失败，请稍后重试',
  59009: '第三方接口限流，请稍后重试',
  50515: '第三方接口响应异常，请稍后重试',
  50516: '第三方接口元数据异常，请稍后重试',
  50517: '第三方接口超时，请稍后重试',
  // 上传 / 系统
  20087: '文件过大，请压缩后重试',
  60012: '系统繁忙，请稍后重试',
};

/**
 * 无业务码时的 HTTP 状态兜底。
 * 只覆盖 401/402：实测证明这两类存在"纯文本 body、无 code"形态（如 401 "Token is invalid"），
 * 其余状态码暂走 classifyError 通用文案，待实测回填后再扩展。
 */
const STATUS_FALLBACK = {
  401: 'API 密钥无效或已过期，请到 www.bizyair.ai 重新签发',
  402: '账户余额不足，请先充值',
};

/**
 * 获取用户友好的错误提示。
 * 查表顺序：业务码（apiCode）→ HTTP 状态兜底 → classifyError 分类通用文案，
 * 确保无业务码的 401 也能给出"重新签发"的可行动指引。
 * @param {Error|{message:string,status?:number,apiCode?:number}} err
 * @returns {string} 用户可理解的提示文案
 */
export function getUserMessage(err) {
  if (err?.apiCode && API_CODE_MESSAGES[err.apiCode]) {
    return API_CODE_MESSAGES[err.apiCode];
  }
  const status = err?.status || (typeof err?.message === 'string' ? parseStatusFromMessage(err.message) : 0);
  if (status && STATUS_FALLBACK[status]) {
    return STATUS_FALLBACK[status];
  }
  const code = classifyError(err);
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN];
}

/**
 * 密钥校验链路（ApiKeyContext.refreshUserInfo / AppHeader.handleSaveApiKey）的统一文案来源。
 * 这两条链路不经过 getUserMessage 的调用方，固定文案会掩盖 401 的真实原因（须重新签发），
 * 因此与 getUserMessage 共用同一查表逻辑；包装错误优先透出已归一化的 userMessage。
 * @param {Error|{message:string,status?:number,apiCode?:number,userMessage?:string}} err
 * @returns {string} 用户可理解的提示文案
 */
export function getAuthErrorMessage(err) {
  return err?.userMessage || getUserMessage(err);
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
    // 与 getUserMessage 共用查表逻辑，保证两条出口文案一致
    userMessage: getUserMessage(err),
    originalError: err,
  };
}
