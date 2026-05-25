> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/qwen3tts-custom-voice/text-to-audio';
  const payload = {
    "input": "深夜十二点，城市终于安静下来。\n路灯把影子拉得很长，风吹过来，带着一点凉意。\n其实也没什么大事，只是突然想起来，\n有些话说出口和没说出口，最后都一样消失了。\n还好还有今晚这杯咖啡，还是热的。",
    "voice": "eric",
    "response_format": "mp3",
    "instructions": "语速平缓偏慢，情绪克制而温柔，\n带有一丝深夜独处的淡淡感慨，\n不悲伤，不煽情，像一个人对自己说话的语气。",
    "language": "Auto",
    "speed": 1,
    "max_tokens": 1024
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${BIZYAIR_API_KEY}'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

submitTask();
```

### 2. 请求参数说明

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| input | string | 是 | 文本长度限制：1 - 2500<br/>文本输入 |
| voice | string | 是 | ⟨bz_enum_json⟩["vivian","serena","uncle_fu","dylan","eric","ryan","aiden","ono_anna","sohee"]⟨/bz_enum_json⟩<br/>音色 |
| response_format | string | 否 | ⟨bz_enum_json⟩["wav","mp3","flac","pcm","aac","opus"]⟨/bz_enum_json⟩<br/>返回格式 |
| instructions | string | 否 | 文本长度限制：1 - 2500<br/>语调情感 |
| language | string | 否 | ⟨bz_enum_json⟩["Auto","Chinese","English","Japanese","Korean","German","French","Russian","Portuguese","Spanish","Italian"]⟨/bz_enum_json⟩<br/>语言 |
| speed | number | 否 | 取值范围：0.5 ~ 2<br/>步进：0.1<br/>语速 |
| max_tokens | number | 否 | 最大值：1024<br/>最大输出长度 |

> 为保护您的业务敏感信息（如 prompt 设计等），我们支持对 API 调用记录中的指定字段进行脱敏处理。脱敏后的字段在查询调用记录时将显示为 `[调用方要求隐藏]`，但不影响实际请求的执行和计费准确性。
>
> **使用方法**：在请求头中携带 `X-BizyAir-Log-Mask-Fields`，指定需要脱敏的字段，多个字段用英文逗号分隔。
>
> ```http
> Content-Type: application/json
> Authorization: Bearer ${BIZYAIR_API_KEY}
> X-BizyAir-Log-Mask-Fields: prompt, image_urls
> ```


## 三. 查询结果

### 2. 响应示例

```json
{
  "request_id": "4569bb94-1d30-417a-a987-9715de1e2633",
  "status": "Success",
  "message": null,
  "executed_at": "2026-04-15 13:32:32",
  "ended_at": "2026-04-15 13:42:32",
  "outputs": {
    "audios": [
      "https://s3.6scloud.com/s5000-wan/audio_outputs/speech-90c12807e3e8cd4e.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=r11p2rCn7Q3nyP5H5IP9%2F20260514%2Fcn-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260514T132209Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=3c0baaef9be013e55dbd571c12d761257c95219ba2b14b7fdd96ffa0ef8bdda8"
    ]
  }
}
```

### 3. 响应字段说明

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |
| status | string | 任务状态，可能的值为：Pending（排队中）、Running（运行中）、Saving（转存中）、Success（完成）、Failed（失败）。 |
| message | string | 任务状态为 Failed 时，错误的具体信息。 |
| executed_at | string | 任务开始运行的时间。 |
| ended_at | string | 当任务成功或失败时，任务结束的时间。 |
| outputs | array | 生成结果（非“完成”状态时，为null或[]）。 |
| outputs.audios | array | 音频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
