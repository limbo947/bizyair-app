import {
  API_BASE,
  ENV_API_KEY,
} from '../constants/models';
import { request } from './httpClient';

/**
 * 提交任务到 BizyAir API。
 * @param {string} apiKey - API 密钥
 * @param {string} modelId - 模型ID
 * @param {string} mode - 调用模式
 * @param {object} payload - 请求体
 * @returns {Promise<string>} 任务ID（request_id / task_id / id）
 * @throws {Error} 提交失败或未返回任务ID时抛出
 */
async function submitTask(apiKey, modelId, mode, payload) {
  const url = `${API_BASE}/${modelId}/${mode}`;
  const result = await request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = result.data || result;
  const id = data.request_id || data.task_id || data.id;
  if (!id) {
    throw new Error('提交成功但未返回任务ID，完整响应: ' + JSON.stringify(result));
  }
  return id;
}

/**
 * 查询任务结果。
 * @param {string} apiKey - API 密钥
 * @param {string} requestId - 任务ID
 * @returns {Promise<object>} 任务结果数据
 */
async function queryTaskResult(apiKey, requestId) {
  const url = `${API_BASE}/${requestId}`;
  const result = await request(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return result.data || result;
}

/**
 * 通用任务提交函数（涵盖图片/视频/LLM/TTS/Vision 等所有类型）。
 * @param {string} apiKey - API 密钥（为空时使用 ENV_API_KEY）
 * @param {string} modelId - 模型ID
 * @param {string} mode - 调用模式
 * @param {object} payload - 请求体
 * @returns {Promise<{requestId: string, apiKey: string}>} 任务ID和实际使用的API密钥
 */
async function submitTaskWithKey(apiKey, modelId, mode, payload) {
  const key = apiKey || ENV_API_KEY;
  const requestId = await submitTask(key, modelId, mode, payload);
  return { requestId, apiKey: key };
}

// 保留别名以兼容外部调用
const submitImageTask = submitTaskWithKey;
const submitVideoTask = submitTaskWithKey;
const submitLLMTask = submitTaskWithKey;
const submitTTSTask = submitTaskWithKey;
const submitVisionTask = submitTaskWithKey;

export {
  submitTask,
  submitTaskWithKey,
  queryTaskResult,
  submitImageTask,
  submitVideoTask,
  submitLLMTask,
  submitTTSTask,
  submitVisionTask,
};
