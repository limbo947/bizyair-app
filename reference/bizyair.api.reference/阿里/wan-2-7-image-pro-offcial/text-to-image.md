> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-image-pro-offcial/text-to-image';
  const payload = {
    "prompt": "A healthy border collie with black and white fur walking leisurely on the beach, paws touching the wet sand, sea breeze blowing its fur, distant seagulls, calm turquoise sea, warm sunset glow, soft shadows, photorealistic, sharp focus, natural color palette ",
    "size": "2K",
    "custom_width": 2048,
    "custom_height": 2048,
    "enable_sequential": false,
    "thinking_mode": true,
    "watermark": false,
    "color_palette": "",
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
| prompt | string | 是 | 文本长度限制：1 - 5000<br/>文本提示词。支持中英文，不超过5000字符。描述想要生成的画面内容。 |
| size | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K","Custom"]⟨/bz_enum_json⟩<br/>输出图片分辨率。1K=1024×1024，2K=2048×2048，4K=4096×4096(仅Pro)。组图模式下不支持4K。 |
| custom_width | number | 否 | 取值范围：768 ~ 4096<br/>仅当尺寸=Custom时生效。总像素和宽高比需在限制范围内。 |
| custom_height | number | 否 | 取值范围：768 ~ 4096<br/>仅当尺寸=Custom时生效。总像素和宽高比需在限制范围内。 |
| enable_sequential | boolean | 否 | 启用组图输出模式，可生成一组保持角色或主体一致性的图片。启用时仅支持1K和2K分辨率。 |
| thinking_mode | boolean | 否 | 开启后模型增强推理能力以提升出图质量，但会增加耗时。仅在关闭组图模式时生效。 |
| watermark | boolean | 否 | 是否添加"AI生成"水印标识，水印位于图片右下角。 |
| color_palette | string | 否 | 文本长度限制：1 - 4096<br/>自定义颜色主题JSON数组，需包含3-10种颜色，推荐8种。每种颜色包含hex和ratio字段，所有ratio总和必须为100.00%。仅在关闭组图模式时可用。 |
| seed | number | 否 | 随机数种子，取值范围0-2147483647，-1表示自动生成。相同seed可使生成内容保持相对稳定。 |

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
    "images": [
      "https://storage.bizyair.cn/outputs/UrUM5UosdZrCGxEl.png"
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
| outputs.images | array | 图片类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
