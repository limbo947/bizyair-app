> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/vidu-q3-pro-official/text-to-video';
  const payload = {
    "prompt": "Ultra-realistic wildlife video, close-up of a fluffy baby sea otter floating on its back in calm, rippling blue ocean water, gently rubbing its face with both front paws in slow, natural motions, half-closed sleepy eyes, relaxed expression, wet fur glistening with water droplets, soft golden sunlight reflecting on the sea surface, subtle body swaying with gentle waves, smooth continuous movement, no jitter, 4K, 60fps, National Geographic style, shallow depth of field, focus on the otter's face and paws",
    "resolution": "720P",
    "aspect_ratio": "16:9",
    "duration": 5,
    "audio": true,
    "off_peak": false,
    "seed": -1
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
| prompt | string | 是 | 文本长度限制：1 - 5000<br/>文生视频提示词，最大5000字符 |
| resolution | string | 是 | ⟨bz_enum_json⟩["540P","720P","1080P"]⟨/bz_enum_json⟩<br/>输出分辨率，默认720P |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","4:3","3:4","1:1"]⟨/bz_enum_json⟩<br/>输出视频宽高比，默认16:9 |
| duration | number | 是 | 取值范围：1 ~ 16<br/>视频时长（秒），范围1-16，默认5 |
| audio | boolean | 否 | 启用后生成带声音的视频（含对白和音效），仅q3模型支持 |
| off_peak | boolean | 否 | 开启低谷模式消耗更低积分，48小时内完成，超时自动取消并退款 |
| seed | number | 否 | 随机种子，-1表示自动随机生成 |

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
    "videos": [
      "https://storage.bizyair.cn/outputs/qyqQBcOGG5gqwIU1.mp4"
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
| outputs.videos | array | 视频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
