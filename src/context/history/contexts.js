import { createContext } from 'react';

export const HistoryListContext = createContext(null);
export const HomeStateContext = createContext(null);
export const PollingContext = createContext(null);

export const DEFAULT_HOME_STATE = {
  modelId: 'bza-image-b2-base',
  mode: 'text-to-image',
  prompt: '',
  imageUrls: [],
  resolution: '2K',
  aspectRatio: '4:3',
  quality: 'medium',
  sizePreset: 0,
  customWidth: '1024',
  customHeight: '1024',
};

export const MAX_POLL_FAILS = 5;

export const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];

export function getPollingInterval(elapsedMs) {
  if (elapsedMs < 30000) return 3000;
  if (elapsedMs < 60000) return 5000;
  if (elapsedMs < 120000) return 10000;
  return 15000;
}

export function extractTaskResult(result) {
  const outputs = result.outputs;
  if (!outputs) return {};

  // 收集所有类型的产物（修复：同一任务可能包含多种类型产物）
  const taskResult = {};

  if (outputs.videos?.length > 0) {
    taskResult.videoUrl = outputs.videos[0];
    taskResult.videoUrls = outputs.videos;
  }
  if (outputs.audios?.length > 0) {
    taskResult.audioUrl = outputs.audios[0];
  }
  if (outputs.texts?.length > 0) {
    taskResult.textResult = outputs.texts[0];
  }
  if (outputs.images?.length > 0) {
    taskResult.imageUrl = outputs.images[0];
    taskResult.imageUrls = outputs.images;
  }

  // 设置主产物类型（优先级：video > audio > text > image），用于缩略图展示
  if (taskResult.videoUrl) {
    taskResult.outputType = 'video';
    taskResult.resultUrl = taskResult.videoUrl;
  } else if (taskResult.audioUrl) {
    taskResult.outputType = 'audio';
    taskResult.resultUrl = taskResult.audioUrl;
  } else if (taskResult.textResult) {
    taskResult.outputType = 'text';
    taskResult.resultUrl = null;
  } else if (taskResult.imageUrl) {
    taskResult.outputType = 'image';
    taskResult.resultUrl = taskResult.imageUrl;
  }

  return taskResult;
}

export function extractWebappResult(outputs) {
  if (!Array.isArray(outputs) || outputs.length === 0) return {};

  const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.webm'];
  const AUDIO_EXTS = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];
  const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'];

  // 收集所有类型的产物（修复：同一任务可能包含多种类型产物）
  const taskResult = {};
  const videoUrls = [];
  const audioUrls = [];
  const imageUrls = [];

  for (const o of outputs) {
    const ext = (o.output_ext || '').toLowerCase();
    const url = o.object_url || '';
    if (!url) continue;
    if (VIDEO_EXTS.includes(ext)) videoUrls.push(url);
    else if (AUDIO_EXTS.includes(ext)) audioUrls.push(url);
    else if (IMAGE_EXTS.includes(ext)) imageUrls.push(url);
    else imageUrls.push(url); // 未知扩展名默认按图片处理
  }

  if (videoUrls.length > 0) {
    taskResult.videoUrl = videoUrls[0];
    taskResult.videoUrls = videoUrls;
  }
  if (audioUrls.length > 0) {
    taskResult.audioUrl = audioUrls[0];
  }
  if (imageUrls.length > 0) {
    taskResult.imageUrl = imageUrls[0];
    taskResult.imageUrls = imageUrls;
  }

  // 主产物类型按首个产物的扩展名决定，用于缩略图展示
  const first = outputs[0];
  const firstExt = (first.output_ext || '').toLowerCase();
  if (VIDEO_EXTS.includes(firstExt) && taskResult.videoUrl) {
    taskResult.outputType = 'video';
    taskResult.resultUrl = taskResult.videoUrl;
  } else if (AUDIO_EXTS.includes(firstExt) && taskResult.audioUrl) {
    taskResult.outputType = 'audio';
    taskResult.resultUrl = taskResult.audioUrl;
  } else if (taskResult.imageUrl) {
    taskResult.outputType = 'image';
    taskResult.resultUrl = taskResult.imageUrl;
  } else if (taskResult.videoUrl) {
    taskResult.outputType = 'video';
    taskResult.resultUrl = taskResult.videoUrl;
  } else if (taskResult.audioUrl) {
    taskResult.outputType = 'audio';
    taskResult.resultUrl = taskResult.audioUrl;
  }

  return taskResult;
}
