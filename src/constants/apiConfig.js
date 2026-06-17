export const API_HOST = 'https://api.bizyair.cn';
export const API_BASE = `${API_HOST}/x/v1/modelzoo/tasks/openapi`;
export const WEBAPP_API_BASE = `${API_HOST}/w/v1/webapp/task/openapi`;
export const WEBAPP_DETAIL_URL = `${API_HOST}/x/v1/webapp`;
export const COMMUNITY_API_BASE = `${API_HOST}/x/v1/bizy_models/community`;
export const DICT_API_URL = `${API_HOST}/x/v1/dict`;
export const UPLOAD_TOKEN_URL = `${API_HOST}/x/v1/upload/token`;
export const COMMIT_RESOURCE_URL = `${API_HOST}/x/v1/input_resource/commit`;
export const USER_METADATA_URL = `${API_HOST}/x/v1/user/metadata`;
export const WALLET_BALANCE_URL = `${API_HOST}/y/v1/wallet`;
export const ENV_API_KEY = process.env.EXPO_PUBLIC_BIZYAIR_API_KEY || '';

export const REQUEST_TIMEOUT_MS = 15000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const POLLING_INTERVAL_MS = 3000;
export const TAB_FADE_OUT_MS = 120;
export const TAB_FADE_IN_MS = 180;
