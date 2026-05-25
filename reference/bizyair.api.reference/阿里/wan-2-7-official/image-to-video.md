> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-official/image-to-video';
  const payload = {
    "first_frame": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/3mZ4A6EGloYJOjBon47AVdIG7SMSPNdS.png?uploads="
    ],
    "first_clip": [],
    "last_frame": [],
    "driving_audio": "",
    "prompt": "A healthy border collie with black and white fur walking leisurely on the beach, paws touching the wet sand, sea breeze blowing its fur, distant seagulls, calm turquoise sea, warm sunset glow, soft shadows, photorealistic, sharp focus, natural color palette ",
    "negative_prompt": "",
    "resolution": "1080P",
    "duration": 5,
    "prompt_extend": true,
    "watermark": false,
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
| first_frame | array | 否 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>首帧图片，用于首帧生视频或首尾帧生视频。宽高比须在1:8~8:1之间。与首段视频(first_clip)二选一 |
| first_clip | array | 否 | 支持格式：mp4、mov<br/>单文件大小上限：100.0 MB（104857600 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：4096px<br/>图片最小高度：240px<br/>图片最大高度：4096px<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：10（单位与配置一致，一般为秒）<br/>首段视频片段，用于视频续写。支持mp4/mov，2-10秒，宽高比须在1:8~8:1之间。与首帧图片(first_frame)二选一 |
| last_frame | array | 否 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>尾帧图片，用于首尾帧生视频或视频+尾帧续写。宽高比须在1:8~8:1之间 |
| driving_audio | string | 否 | 驱动音频URL，模型将以该音频为驱动源生成视频（如口型同步、动作卡点）。支持wav/mp3，2-30秒，不超过15MB。不提供时模型自动生成背景音乐或音效 |
| prompt | string | 否 | 文本长度限制：1 - 5000<br/>图生视频提示词，最大5000字符 |
| negative_prompt | string | 否 | 文本长度限制：1 - 500<br/>描述不希望在视频画面中出现的内容，最大500字符 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>输出视频分辨率档位。视频宽高比尽量与输入素材保持一致。resolution直接影响费用 |
| duration | number | 是 | 取值范围：2 ~ 15<br/>视频时长，单位秒，可用范围2-15秒。视频续写时：输出时长=输入视频时长+续写时长，按总时长计费。duration直接影响费用 |
| prompt_extend | boolean | 是 | 是否开启prompt智能改写。开启后使用大模型对输入prompt进行优化，对短提示词效果提升明显，但会增加耗时 |
| watermark | boolean | 是 | 是否添加水印标识，水印位于视频右下角，文案固定为"AI生成" |
| seed | number | 否 | 随机种子，-1表示自动生成。取值范围[0, 2147483647] |

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
      "https://storage.bizyair.cn/outputs/zen4CUheM75oNyGo.mp4"
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
