---
display_name: "万相2.5-图生视频-官方版"
category: "Image to Video"
manufacturer: "阿里"
price: "480P: 300 金币/1秒 | 720P: 600 金币/1秒 | 1080P: 1000 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/wan-2-5-official/image-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  阿里通义万相推出的图生视频官方模型，原生支持音画同步，精准保留原图核心构图与细节，支持复杂运镜控制与 1080P 高清输出，画面动态过渡自然，主体稳定性较强，可生成 10 秒完整叙事片段，适配电影级预告片、商业广告片、高品质动态海报等专业创作场景。
tags: ["万相视频"]
---

# 万相2.5-图生视频-官方版

> **图生视频** | 厂商: 阿里 | 模型: `wan-2-5-official` | 类型: `image-to-video`

阿里通义万相推出的图生视频官方模型，原生支持音画同步，精准保留原图核心构图与细节，支持复杂运镜控制与 1080P 高清输出，画面动态过渡自然，主体稳定性较强，可生成 10 秒完整叙事片段，适配电影级预告片、商业广告片、高品质动态海报等专业创作场景。

💰 **价格**: 480P: 300 金币/1秒 | 720P: 600 金币/1秒 | 1080P: 1000 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/wan-2-5-official/image-to-video?tab=price)

> 公共内容请参阅 [common.md](../common.md)

## 二. 提交请求


> _preamble — 与公共文档一致，详见 [common.md](../common.md)


### 1. 请求示例

请您复制代码块中的代码，

并将 `${BIZYAIR_API_KEY}` **替换为您自己的** **API Key** 后运行。

在这之前，您可以对代码块中的参数部分进行调整，以精准生成您所需要的内容。

注意：参数设置的格式与要求，请严格参考 **【2. 请求参数说明】**。

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-5-official/image-to-video';
  const payload = {
    "img_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/3mZ4A6EGloYJOjBon47AVdIG7SMSPNdS.png?uploads="
    ],
    "prompt": "A healthy border collie with black and white fur walking leisurely on the beach, paws touching the wet sand, sea breeze blowing its fur, distant seagulls, calm turquoise sea, warm sunset glow, soft shadows, photorealistic, sharp focus, natural color palette ",
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

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| img_url | array | 是 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>输入首帧图片，输出视频宽高比将尽量与首帧图片保持一致 |
| prompt | string | 否 | 文本长度限制：1 - 1500<br/>图生视频提示词。wan2.6/2.5最大1500字符，wan2.2/wanx2.1最大800字符。使用视频特效时此参数无效 |
| resolution | string | 是 | ⟨bz_enum_json⟩["480P","720P","1080P"]⟨/bz_enum_json⟩<br/>输出视频分辨率档位，模型根据档位自动缩放至相近总像素。wan2.5-i2v默认1080P |
| duration | number | 是 | 取值范围：5 ~ 10<br/>视频时长，单位秒。wan2.5-i2v-preview可选5或10秒 |
| prompt_extend | boolean | 是 | 是否开启prompt智能改写。开启后使用大模型对输入prompt进行优化，对短提示词效果提升明显，但会增加耗时 |
| audio | boolean | 否 | 是否自动生成背景音乐或音效。true: 根据视频内容自动生成音频；false: 生成无声视频。audio参数优先级高于audio_url，当audio=false时即使传入audio_url也输出无声视频 |
| audio_url | string | 否 | 自定义音频URL，模型将使用该音频生成视频。支持wav/mp3，时长3-30秒，不超过15MB。提供后将替代自动配音。仅wan2.6/2.5支持 |


> ### 3. 响应示例 — 与公共文档一致，详见 [common.md](../common.md)


> ### 4. 响应字段说明 — 与公共文档一致，详见 [common.md](../common.md)


## 三. 查询结果


> _preamble — 与公共文档一致，详见 [common.md](../common.md)


> ### 1. 请求示例 — 与公共文档一致，详见 [common.md](../common.md)


### 2. 响应示例

这是一个通过调用 **BizyAir 查询接口**，在任务生成完成、成功生成内容之后，服务器最终返回的结果回执。

也是整个 AI 生图流程的【**最终结果**】。通过浏览这段信息，您可以了解到上述所有操作的最终结果。

如果您收到了其他的信息反馈，可以结合下文【**3. 响应字段说明**】进一步了解详情。

```json
{
  "request_id": "4569bb94-1d30-417a-a987-9715de1e2633",
  "status": "Success",
  "message": null,
  "executed_at": "2026-04-15 13:32:32",
  "ended_at": "2026-04-15 13:42:32",
  "outputs": {
    "videos": [
      "https://storage.bizyair.cn/outputs/msUwrXHHEMLijRsy.mp4"
    ]
  }
}
```


### 3. 响应字段说明

您可以阅读下方的【**响应字段说明**】，了解各字段含义与取值说明。

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |
| status | string | 任务状态，可能的值为：Pending（排队中）、Running（运行中）、Saving（转存中）、Success（完成）、Failed（失败）。 |
| message | string | 任务状态为 Failed 时，错误的具体信息。 |
| executed_at | string | 任务开始运行的时间。 |
| ended_at | string | 当任务成功或失败时，任务结束的时间。 |
| outputs | array | 生成结果（非“完成”状态时，为null或[]）。 |
| outputs.videos | array | 视频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
