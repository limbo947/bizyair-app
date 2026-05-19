---
display_name: "通用视频X-文生视频-渠道版"
category: "Text to Video"
manufacturer: "grok"
price: "50金币/秒"
price_url: "https://bizyair.cn/modelzoo/bza-video-x-base/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用视频X 是一款视频与音频联合生成模型，核心依托多模态引擎，支持由文本描述直接生成带有原生音频的短视频。模型可精准捕捉用户的创意构想，输出 6 到 15 秒的动态片段，并自动匹配背景音效与电影级运镜。渠道版定价低于官方版，适合社交媒体内容创作与日常创意快速实现。
tags: ["通用视频X"]
---

# 通用视频X-文生视频-渠道版

> **文生视频** | 厂商: grok | 模型: `bza-video-x-base` | 类型: `text-to-video`

通用视频X 是一款视频与音频联合生成模型，核心依托多模态引擎，支持由文本描述直接生成带有原生音频的短视频。模型可精准捕捉用户的创意构想，输出 6 到 15 秒的动态片段，并自动匹配背景音效与电影级运镜。渠道版定价低于官方版，适合社交媒体内容创作与日常创意快速实现。

💰 **价格**: 50金币/秒  [查看详情](https://bizyair.cn/modelzoo/bza-video-x-base/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-x-base/text-to-video';
  const payload = {
    "prompt": "Extreme macro cinematography. A spherical mechanical device rotating slowly, its surface intricately inlaid with shimmering Mother-of-Pearl (Raden) and deep, polished black lacquer. As the sphere turns, the iridescent shell fragments exhibit a dreamy rainbow luster, shifting smoothly between turquoise, magenta, and gold. The interior features precision gears made of polished brass, interlocking perfectly and reflecting subtle environmental highlights. The lacquered surface has a deep, mirror-like finish with soft reflections. Slow-motion, hyper-realistic textures, 8k resolution, cinematic lighting, a masterpiece of industrial design and traditional craftsmanship.",
    "resolution": "720p",
    "duration": 6,
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

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 20000<br/>视频生成提示词 |
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| duration | number | 是 | 取值范围：6 ~ 30<br/>视频时长（秒） |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","2:3","1:1","3:2","9:16"]⟨/bz_enum_json⟩<br/>视频宽高比 |


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
      "https://storage.bizyair.cn/outputs/BKEiFV29hHf7GPtR.mp4"
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
