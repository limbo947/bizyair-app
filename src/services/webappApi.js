import {
  WEBAPP_API_BASE,
  WEBAPP_DETAIL_URL,
} from '../constants/models';
import { request } from './httpClient';

/**
 * 提交 WebApp 任务（异步模式）。
 * @param {string} apiKey - API 密钥
 * @param {number|string} webAppId - WebApp ID
 * @param {object} inputValues - 输入参数键值对
 * @returns {Promise<string>} requestId
 * @throws {Error} 提交失败或未返回 requestId 时抛出
 */
async function submitWebappTask(apiKey, webAppId, inputValues) {
  const url = `${WEBAPP_API_BASE}/create`;
  const result = await request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Bizyair-Task-Async': 'enable',
    },
    body: JSON.stringify({
      web_app_id: Number(webAppId),
      suppress_preview_output: false,
      input_values: inputValues,
    }),
  });

  const id = result.requestId || result.request_id;
  if (!id) {
    throw new Error('提交成功但未返回 requestId，完整响应: ' + JSON.stringify(result));
  }
  return id;
}

/**
 * 查询 WebApp 任务状态。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 任务状态详情
 */
async function queryWebappTaskDetail(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/detail?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return result.data || result;
}

/**
 * 查询 WebApp 任务结果。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 任务结果数据（含 outputs 数组）
 */
async function queryWebappTaskOutputs(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/outputs?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return result.data || result;
}

/**
 * 获取 WebApp 详情（含 input_nodes 参数信息）。
 * 公开接口，无需 API Key。
 * @param {number|string} id - bizy_model_id（社区页面 URL 中的数字）
 * @returns {Promise<object>} 应用详情数据（含 id=web_app_id, name, input_nodes 等）
 * @throws {Error} 获取失败或应用不存在时抛出
 */
async function fetchWebappDetail(id) {
  const url = `${WEBAPP_DETAIL_URL}/${id}`;
  const result = await request(url, { method: 'GET' });
  if (result.code !== 20000 || !result.data) {
    // API 返回的 message 可能是编码乱码，使用友好提示
    const errorMessages = {
      20224: '应用不存在或已被下架',
      401: '无权访问该应用',
      403: '该应用为私有应用，无法访问',
    };
    throw new Error(errorMessages[result.code] || '应用不存在或无法访问');
  }
  return result.data;
}

/**
 * 取消排队中的 WebApp 任务。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 响应数据
 */
async function cancelWebappTask(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/openapi/cancel?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  return result;
}

/**
 * 中断运行中的 WebApp 任务。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 响应数据
 */
async function interruptWebappTask(apiKey, requestId) {
  const url = `${WEBAPP_API_BASE}/openapi/interrupt?requestId=${encodeURIComponent(requestId)}`;
  const result = await request(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export {
  submitWebappTask,
  queryWebappTaskDetail,
  queryWebappTaskOutputs,
  fetchWebappDetail,
  cancelWebappTask,
  interruptWebappTask,
};
