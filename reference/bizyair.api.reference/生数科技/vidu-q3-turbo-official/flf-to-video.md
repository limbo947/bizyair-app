> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/vidu-q3-turbo-official/flf-to-video';
  const payload = {
    "image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/GMIvc7pzv48XHWvYk9dGuKzZCOofHBcK.jpg"
    ],
    "last_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/D2kleIBBqnILmRizuSeZtftwhhvXHc7x.jpg?uploads="
    ],
    "prompt": "Main Prompt: Soft, airy wildlife video, close-up shot of a fluffy baby sea otter floating calmly on its back in clear pale blue ocean water. The otter slowly rubs its face with both paws, eyes half-closed with a gentle sleepy expression. Soft cool daylight illuminates the scene, casting crisp natural light on the otter’s fine wet fur and subtle rippling water surface. Smooth, gentle floating motion with slow natural wave movement. Photorealistic, ultra-detailed fur texture, fluid 60fps motion, light and airy color palette, soft natural contrast, clean fresh aesthetic, shallow depth of field, 8K resolution, professional wildlife videography.  Negative Prompt: Oversaturated colors, heavy contrast, warm golden filter, strong tint, dense color grading, distorted motion, jittery video, deformed otter, extra limbs, bad anatomy, unnatural movements, blurry, underexposed, cartoonish, low resolution, pixelated, text, watermark, artifacts, stiff motion, static image, unrealistic lighting, muddy fur texture",
    "resolution": "720P",
    "aspect_ratio": "16:9",
    "duration": 5,
    "is_rec": false,
    "audio": true,
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
| image | array | 是 | 支持格式：png、jpeg、jpg、webp<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>输入首帧图片，作为视频生成的起始帧 |
| last_frame_image | array | 是 | 支持格式：png、jpeg、jpg、webp<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>输入尾帧图片，作为视频生成的结束帧。首帧与尾帧宽高比须在0.8~1.25之间 |
| prompt | string | 否 | 文本长度限制：1 - 5000<br/>视频生成提示词，最大5000字符。启用推荐提示词(is_rec)时手动输入的提示词将被忽略 |
| resolution | string | 是 | ⟨bz_enum_json⟩["540P","720P","1080P"]⟨/bz_enum_json⟩<br/>输出分辨率，viduq3-turbo默认720P |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","4:3","3:4","1:1"]⟨/bz_enum_json⟩<br/>输出视频宽高比，不设置时由输入图片决定 |
| duration | number | 是 | 取值范围：1 ~ 16<br/>视频时长，单位秒，viduq3-pro/turbo可用范围1-16秒 |
| is_rec | boolean | 否 | 是否使用推荐提示词。启用后系统自动生成推荐提示词，每个任务额外消耗10 credits |
| audio | boolean | 是 | 是否启用音视频同步生成。true: 输出含对白和音效的视频；false: 输出无声视频。仅q3模型支持 |
| seed | number | 否 | 随机种子，-1表示自动生成 |

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
      "https://storage.bizyair.cn/outputs/2VTFdIUNlB0Zj01j.mp4"
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
