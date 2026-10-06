// 音频模型（TTS / 音乐）—— MODELS 按 800 行约束拆分（§5.6）
// 参数/枚举/价格对齐国际版 llms 文档与价格表（附录 C 矩阵冻结稿，2026-10-06）
import { TTS_PRICE, ACE_STEP_PRICE, calcFixedPrice } from '../pricing';

export const AUDIO_MODELS = {
  'qwen3tts-custom-voice': {
    name: 'Qwen3 TTS',
    icon: { name: 'mic-outline', color: '#6C5CE7' },
    manufacturer: 'siliconflow',
    category: 'text-to-audio',
    paramType: 'tts',
    modes: ['text-to-audio'],
    outputType: 'audio',
    priceCalculator: calcFixedPrice(TTS_PRICE),
    voices: ['vivian', 'serena', 'uncle_fu', 'dylan', 'eric', 'ryan', 'aiden', 'ono_anna', 'sohee'],
    // 国际版 response_format 枚举无 pcm
    formats: ['wav', 'mp3', 'flac', 'aac', 'opus'],
    languages: ['Auto', 'Chinese', 'English', 'Japanese', 'Korean', 'German', 'French', 'Russian', 'Portuguese', 'Spanish', 'Italian'],
    maxInputLength: 2500,
    speedRange: [0.5, 2],
    defaultSpeed: 1,
    defaultVoice: 'eric',
    defaultFormat: 'mp3',
    defaultLanguage: 'Auto',
    maxTokens: 4096,
  },
  'ace-step': {
    name: 'ACE Step',
    icon: { name: 'musical-notes-outline', color: '#6C5CE7' },
    manufacturer: 'siliconflow',
    category: 'text-to-audio',
    paramType: 'ace-step',
    modes: ['text-to-audio'],
    outputType: 'audio',
    priceCalculator: calcFixedPrice(ACE_STEP_PRICE),
    maxLyricsLength: 5000,
    maxTagsLength: 500,
    durationRange: [1, 300],
    defaultDuration: 30,
    supportsSeed: true,
    noPromptRequired: true,
  },
};
