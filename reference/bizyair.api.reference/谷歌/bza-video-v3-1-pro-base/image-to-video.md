> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-v3-1-pro-base/image-to-video';
  const payload = {
    "prompt": "参考图片为一张食物特写照片，将这张食物图片的表面纹路、色彩结构与细胞质感重新诠释为一个微观宇宙的星际全景。\n食物表面的纹路与颜色分布保持不变，但整体被重新解读为从极高空俯瞰的星系平面——食物纤维纹路化为星云气体流，细胞结构化为密集的星团与行星群，果汁液滴化为悬浮的星际尘埃云，色彩饱和度保留但叠加上星际发光效果，每个细节都在微弱地自发光。\n镜头从静止的宏观全览开始，缓缓向某个细节区域推进，仿佛穿越星际向一颗特定行星飞去，随着推进倍率增加，细节从抽象的色块逐渐显现为具体的星球表面纹理，原本是果肉纤维的结构现在是这颗星球的山脉与峡谷。\n空间中漂浮着若干颗大小不一的球形体，对应食物中的种子或气泡，被重新演绎为大小不一的行星，表面保留原始食物材质的颜色但叠加大气层的光晕效果，行星之间有细如蛛丝的引力线隐约连接。\n整个画面色调保留食物原始的饱和色彩，叠加宇宙的深空黑色背景，两种视觉语言融合为一个既熟悉又陌生的奇异空间。\n音频：深空的低频共鸣底噪，偶尔有高频的宇宙射线般的细微嗡鸣，配以一段电子合成器的环境音乐，音调悠远空旷，营造出既微观又宏观的双重尺度感。\n超真实与超抽象并存，食物材质质感与星际光学效果精准融合，尺度转换流畅，色彩饱和而不失深邃，4K质感，无人物，无文字。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/fT2UQIUlWpqFI6h2nH2S6ywv1gDzTyYL.jpg"
    ],
    "resolution": "1080p",
    "aspect_ratio": "16:9"
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
| prompt | string | 是 | 文本长度限制：1 - 8000<br/>视频提示词 |
| image_urls | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>最多支持 3 项图片，每张 30 MB |
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>画面比例 |

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
      "https://storage.bizyair.cn/outputs/UXs0ebhzrhNEa9SD.mp4"
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
