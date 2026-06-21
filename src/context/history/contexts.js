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

  if (outputs.videos?.length > 0) {
    return { outputType: 'video', videoUrl: outputs.videos[0], videoUrls: outputs.videos, resultUrl: outputs.videos[0] };
  }
  if (outputs.audios?.length > 0) {
    return { outputType: 'audio', audioUrl: outputs.audios[0], resultUrl: outputs.audios[0] };
  }
  if (outputs.texts?.length > 0) {
    return { outputType: 'text', textResult: outputs.texts[0], resultUrl: null };
  }
  if (outputs.images?.length > 0) {
    return {
      outputType: 'image',
      imageUrl: outputs.images[0],
      imageUrls: outputs.images,
      resultUrl: outputs.images[0],
    };
  }
  return {};
}

export function extractWebappResult(outputs) {
  if (!Array.isArray(outputs) || outputs.length === 0) return {};
  const first = outputs[0];
  const ext = (first.output_ext || '').toLowerCase();
  const url = first.object_url || '';
  if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
    const videoUrls = outputs.filter(o => ['.mp4', '.mov', '.avi', '.webm'].includes((o.output_ext || '').toLowerCase())).map(o => o.object_url);
    return { outputType: 'video', videoUrl: url, resultUrl: url, videoUrls };
  }
  if (['.mp3', '.wav', '.ogg', '.flac', '.aac'].includes(ext)) {
    return { outputType: 'audio', audioUrl: url, resultUrl: url };
  }
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'].includes(ext)) {
    const imageUrls = outputs.filter(o => ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'].includes((o.output_ext || '').toLowerCase())).map(o => o.object_url);
    return { outputType: 'image', imageUrl: url, imageUrls, resultUrl: url };
  }
  if (url) {
    const imageUrls = outputs.map(o => o.object_url).filter(Boolean);
    return { outputType: 'image', imageUrl: url, imageUrls, resultUrl: url };
  }
  return {};
}
