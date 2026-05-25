> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-6-official/image-to-video';
  const payload = {
    "img_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/3mZ4A6EGloYJOjBon47AVdIG7SMSPNdS.png?uploads="
    ],
    "prompt": "",
    "resolution": "1080P",
    "duration": 5,
    "prompt_extend": true,
    "audio": true,
    "audio_url": ""
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
| img_url | array | 是 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>输入首帧图片，输出视频宽高比将尽量与首帧图片保持一致 |
| prompt | string | 否 | 文本长度限制：1 - 1500<br/>图生视频提示词。wan2.6/2.5最大1500字符，wan2.2/wanx2.1最大800字符。使用视频特效时此参数无效 |
| resolution | string | 是 | ⟨bz_enum_json⟩["480P","720P","1080P"]⟨/bz_enum_json⟩<br/>输出视频分辨率档位，模型根据档位自动缩放至相近总像素。wan2.5-i2v默认1080P |
| duration | number | 是 | 取值范围：5 ~ 10<br/>视频时长，单位秒。wan2.5-i2v-preview可选5或10秒 |
| prompt_extend | boolean | 是 | 是否开启prompt智能改写。开启后使用大模型对输入prompt进行优化，对短提示词效果提升明显，但会增加耗时 |
| audio | boolean | 否 | 是否自动生成背景音乐或音效。true: 根据视频内容自动生成音频；false: 生成无声视频。audio参数优先级高于audio_url，当audio=false时即使传入audio_url也输出无声视频 |
| audio_url | string | 否 | 文本长度限制：1 - 2048<br/>自定义音频URL，模型将使用该音频生成视频。支持wav/mp3，时长3-30秒，不超过15MB。提供后将替代自动配音。仅wan2.6/2.5支持 |

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
      "https://storage.bizyair.cn/outputs/FnNM9mHIjXPk2oeQ.mp4"
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
