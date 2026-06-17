import {
  WEBAPP_API_BASE,
  WEBAPP_DETAIL_URL,
  COMMUNITY_API_BASE,
  DICT_API_URL,
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
  const url = `${WEBAPP_API_BASE}/cancel?requestId=${encodeURIComponent(requestId)}`;
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
  const url = `${WEBAPP_API_BASE}/interrupt?requestId=${encodeURIComponent(requestId)}`;
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
 * 获取社区应用列表（公开接口，无需 API Key）。
 * @param {object} [opts]
 * @param {number} [opts.current=1] - 页码，从 1 开始
 * @param {number} [opts.pageSize=28] - 每页数量
 * @param {string} [opts.keyword=''] - 搜索关键词
 * @param {string} [opts.sort='Recently'] - 排序：Recently / Most Used / Most Forked / Most Liked
 * @param {string} [opts.modelTypes='Application'] - 类型筛选
 * @param {string} [opts.baseModel] - 基础模型筛选（如 "GPT-Image"）
 * @returns {Promise<{list: Array, total: number, current: number, pageSize: number}>}
 * @throws {Error} 获取失败时抛出
 */
async function fetchCommunityApps({
  current = 1,
  pageSize = 28,
  keyword = '',
  sort = 'Recently',
  modelTypes = 'Application',
  baseModel,
} = {}) {
  const params = new URLSearchParams({
    current: String(current),
    page_size: String(pageSize),
    keyword,
    sort,
    model_types: modelTypes,
  });
  if (baseModel) params.append('base_models', baseModel);

  const url = `${COMMUNITY_API_BASE}?${params}`;
  const result = await request(url, { method: 'GET' });
  if (result.code !== 20000 || !result.data) {
    throw new Error(result.message || '获取应用列表失败');
  }
  return {
    list: result.data.list || [],
    total: result.data.total || 0,
    current: result.data.current || current,
    pageSize: result.data.pageSize || pageSize,
  };
}

/**
 * 获取字典数据（含基础模型分类列表）。
 * 公开接口，无需 API Key。
 * @returns {Promise<{baseModels: Array<{label: string, value: string}>, tags: Array}>}
 */
async function fetchDict() {
  const result = await request(DICT_API_URL, { method: 'GET' });
  if (result.code !== 20000 || !result.data) {
    throw new Error(result.message || '获取字典数据失败');
  }
  return {
    baseModels: result.data.base_models || [],
    tags: result.data.tags || [],
  };
}

export {
  submitWebappTask,
  queryWebappTaskDetail,
  queryWebappTaskOutputs,
  fetchWebappDetail,
  cancelWebappTask,
  interruptWebappTask,
  fetchCommunityApps,
  fetchDict,
};
