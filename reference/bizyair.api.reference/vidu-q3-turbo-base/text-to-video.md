---
display_name: "Vidu Q3.Turbo-文生视频-渠道版"
category: "Text to Video"
manufacturer: "生数科技"
price: "540P: 200 金币/1秒 | 720P: 300 金币/1秒 | 1080P: 350 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/vidu-q3-turbo-base/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  生数科技Q3.Turbo渠道版文生视频模型，精准理解文本描述快速生成连贯动态画面。生成速度大幅提升且画面保持稳定，人物场景无畸变、主体不漂移。主打高效出片，适合批量创作、短视频快速出稿和创意灵感试做场景。
tags: ["Vidu"]
---

# Vidu Q3.Turbo-文生视频-渠道版

> **文生视频** | 厂商: 生数科技 | 模型: `vidu-q3-turbo-base` | 类型: `text-to-video`

生数科技Q3.Turbo渠道版文生视频模型，精准理解文本描述快速生成连贯动态画面。生成速度大幅提升且画面保持稳定，人物场景无畸变、主体不漂移。主打高效出片，适合批量创作、短视频快速出稿和创意灵感试做场景。

💰 **价格**: 540P: 200 金币/1秒 | 720P: 300 金币/1秒 | 1080P: 350 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/vidu-q3-turbo-base/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/vidu-q3-turbo-base/text-to-video';
  const payload = {
    "prompt": "A serene mountain lake at sunrise, calm reflective water, mist rising from the lake, detailed pine trees on the shore, soft warm sunlight illuminating the mountains, gentle ripples on the water surface, birds flying in the distance, cinematic wide-angle view, ultra-realistic textures, natural color grading, no distortions, high detail, smooth motion",
    "resolution": "720P",
    "aspect_ratio": "16:9",
    "duration": 5,
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

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 5000<br/>文生视频提示词，最大5000字符 |
| resolution | string | 是 | ⟨bz_enum_json⟩["540P","720P","1080P"]⟨/bz_enum_json⟩<br/>输出分辨率，默认720P |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","4:3","3:4","1:1"]⟨/bz_enum_json⟩<br/>输出视频宽高比，默认16:9 |
| duration | number | 是 | 取值范围：1 ~ 16<br/>视频时长（秒），范围1-16，默认5 |
| audio | boolean | 否 | 启用后生成带声音的视频（含对白和音效），仅q3模型支持 |
| seed | number | 否 | 随机种子，-1表示自动随机生成 |


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
      "https://storage.bizyair.cn/outputs/EvGICHYRmfJ1vpzL.mp4"
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
