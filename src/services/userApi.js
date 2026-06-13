import {
  USER_METADATA_URL,
  WALLET_BALANCE_URL,
} from '../constants/models';
import { request } from './httpClient';

/**
 * 获取用户信息。
 * @param {string} apiKey - API 密钥
 * @returns {Promise<object>} 用户元数据
 */
async function fetchUserInfo(apiKey) {
  const result = await request(USER_METADATA_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return result.data || result;
}

/**
 * 获取钱包余额。
 * @param {string} apiKey - API 密钥
 * @returns {Promise<object>} 钱包余额数据
 */
async function fetchWalletBalance(apiKey) {
  const result = await request(WALLET_BALANCE_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return result.data || result;
}

export {
  fetchUserInfo,
  fetchWalletBalance,
};
