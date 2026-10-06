import {
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} from '../constants/apiConfig';
import { classifyError, ERROR_CODES } from '../utils/errorMessages';

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
      const text = await response.text().catch(() => '');
      // 国际版把业务错误改挂在真实 HTTP 状态码上（401/402/404/429 等），
      // 业务码不再保证经 200+body.code 路径到达上层，须在此解析挂载供文案层查表
      let apiCode;
      let apiMessage = text;
      try {
        const body = JSON.parse(text);
        if (body && typeof body === 'object') {
          // 官方文档示例中 code 可能是字符串（如 "20052"），统一转数值
          apiCode = Number(body.code) || undefined;
          apiMessage = body.message || text;
        } else if (typeof body === 'string') {
          // JSON.parse('"Token is invalid"') 得到字符串，用于去引号
          apiMessage = body;
        }
      } catch {
        // 非 JSON 纯文本响应（如 401 的 "Token is invalid"）保留原文
      }
      // 抛出带状态码和错误码的错误，便于上层转换用户友好提示
      const err = new Error(`[${response.status}] ${apiMessage || response.statusText}`);
      err.status = response.status;
      err.apiCode = apiCode;
      err.apiMessage = apiMessage;
      err.code = classifyError(err);
      throw err;
    }

    const result = await response.json();
    return result;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      const timeoutErr = new Error('请求超时，请检查网络连接后重试');
      timeoutErr.code = ERROR_CODES.TIMEOUT;
      throw timeoutErr;
    }

    // 如果已分类（来自 !response.ok 分支），保留 code
    if (!err.code) {
      err.code = classifyError(err);
    }

    // 仅对幂等方法自动重试：POST（任务提交等）在超时/5xx 时服务端可能已受理，
    // 自动重试会造成重复提交与重复扣费，因此直接抛出由上层或用户决定是否重发
    const method = (fetchOptions.method || 'GET').toUpperCase();
    const isRetryableMethod = method === 'GET' || method === 'PUT' || method === 'HEAD';
    const isRetryable =
      isRetryableMethod &&
      retries < MAX_RETRIES &&
      (err.code === ERROR_CODES.TIMEOUT ||
       err.code === ERROR_CODES.SERVER ||
       err.code === ERROR_CODES.NETWORK ||
       err.code === ERROR_CODES.RATE_LIMIT);

    if (isRetryable) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries)));
      return request(url, { ...options, retries: retries + 1 });
    }

    throw err;
  }
}

export { request };
