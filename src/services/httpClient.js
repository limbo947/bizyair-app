import {
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} from '../constants/models';

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
       err.message === 'Network request failed' ||
       err.message === 'Failed to fetch' ||
       err.message === 'fetch failed' ||
       (err.name === 'TypeError' && err.message.includes('fetch')));

    if (isRetryable) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries)));
      return request(url, { ...options, retries: retries + 1 });
    }

    throw err;
  }
}

export { request };
