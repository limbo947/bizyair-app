import {
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} from '../constants/models';
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
      const body = await response.text().catch(() => '');
      // 抛出带状态码和错误码的错误，便于上层转换用户友好提示
      const err = new Error(`[${response.status}] ${body || response.statusText}`);
      err.status = response.status;
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

    const isRetryable =
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
