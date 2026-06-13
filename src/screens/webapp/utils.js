/** 判断字符串值是否为 bizyair 上传文件 URL */
export function isBizyairFileUrl(val) {
  return typeof val === 'string' && (
    val.includes('bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/') ||
    val.includes('storage.bizyair.cn/inputs/')
  );
}

/** 根据 node_type 判断媒体类型：image / video / audio / file / null */
export function getMediaType(nodeType, value) {
  if (nodeType === 'LoadImage') return 'image';
  if (nodeType === 'LoadVideo') return 'video';
  if (nodeType === 'LoadAudio') return 'audio';
  if (isBizyairFileUrl(value)) {
    const ext = value.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext)) return 'audio';
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'image';
    return 'file';
  }
  return null;
}

export function stripJsComments(str) {
  let result = '';
  let i = 0;
  while (i < str.length) {
    if (str[i] === '"' || str[i] === "'") {
      const quote = str[i];
      result += str[i]; i++;
      while (i < str.length && str[i] !== quote) {
        if (str[i] === '\\') { result += str[i]; i++; if (i < str.length) { result += str[i]; i++; } }
        else { result += str[i]; i++; }
      }
      if (i < str.length) { result += str[i]; i++; }
    } else if (str[i] === '/' && i + 1 < str.length && str[i + 1] === '/') {
      while (i < str.length && str[i] !== '\n') i++;
    } else if (str[i] === '/' && i + 1 < str.length && str[i + 1] === '*') {
      i += 2;
      while (i < str.length && !(str[i] === '*' && i + 1 < str.length && str[i + 1] === '/')) i++;
      i += 2;
    } else { result += str[i]; i++; }
  }
  return result;
}

export function extractStringifyArg(text) {
  const prefix = text.match(/JSON\.stringify\s*\(\s*/);
  if (!prefix) return null;
  const startIdx = text.indexOf(prefix[0]) + prefix[0].length;
  if (startIdx >= text.length || text[startIdx] !== '{') return null;
  let depth = 0, inString = false, stringChar = '', i = startIdx;
  while (i < text.length) {
    const ch = text[i];
    if (inString) { if (ch === '\\') { i += 2; continue; } if (ch === stringChar) inString = false; }
    else { if (ch === '"' || ch === "'") { inString = true; stringChar = ch; } else if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return text.slice(startIdx, i + 1); } }
    i++;
  }
  return null;
}

export function parseApiCode(text) {
  const jsonStr = extractStringifyArg(text);
  if (!jsonStr) return { error: '未找到 JSON.stringify 内容，请粘贴完整的示例 API 代码' };
  const cleaned = stripJsComments(jsonStr).replace(/,\s*([}\]])/g, '$1');
  let parsed;
  try { parsed = JSON.parse(cleaned); } catch (e) { return { error: 'JSON 解析失败: ' + e.message }; }
  const webAppId = parsed.web_app_id;
  if (webAppId === undefined || webAppId === null) return { error: '未找到 web_app_id 参数' };
  const inputValues = parsed.input_values;
  if (!inputValues || typeof inputValues !== 'object' || Array.isArray(inputValues)) return { error: '未找到 input_values 参数' };
  return { webAppId: Number(webAppId), inputValues };
}

export function parseFieldOptions(optStr) {
  if (!optStr || typeof optStr !== 'string') return {};
  try { return JSON.parse(optStr); } catch { return {}; }
}
