// Backward-compatible entry point — re-exports everything from domain modules.
// The `request` function lives in httpClient.js to avoid circular dependencies.

export { request } from './httpClient';

export {
  submitTask,
  submitTaskWithKey,
  queryTaskResult,
  submitImageTask,
  submitVideoTask,
  submitLLMTask,
  submitTTSTask,
  submitVisionTask,
} from './taskApi';

export {
  getUploadToken,
  commitResource,
  uploadViaProxy,
  uploadDirectToOSS,
  uploadImageFile,
  uploadVideoFile,
} from './uploadApi';

export {
  fetchUserInfo,
  fetchWalletBalance,
} from './userApi';

export {
  submitWebappTask,
  queryWebappTaskDetail,
  queryWebappTaskOutputs,
  fetchWebappDetail,
  cancelWebappTask,
  interruptWebappTask,
  fetchCommunityApps,
  fetchDict,
} from './webappApi';
