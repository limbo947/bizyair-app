---
display_name: "通用视频X-图生视频-官方版"
category: "Image to Video"
manufacturer: "grok"
price: "6: 1900 金币/1次 | 10: 3150 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-video-x-official/image-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用视频X 官方版的图生视频功能在生成质量与响应速度上进行了定向优化。模型能深刻理解输入图像的构图与光影，在将其转化为动态视频时保持原图风格与主体保真，自动生成与画面高度契合的原生音频。该版本为广告行业、影视预演及跨平台内容运营团队提供了经过验证的高质量视频创作工具。
tags: ["通用视频X"]
---

# 通用视频X-图生视频-官方版

> **图生视频** | 厂商: grok | 模型: `bza-video-x-official` | 类型: `image-to-video`

通用视频X 官方版的图生视频功能在生成质量与响应速度上进行了定向优化。模型能深刻理解输入图像的构图与光影，在将其转化为动态视频时保持原图风格与主体保真，自动生成与画面高度契合的原生音频。该版本为广告行业、影视预演及跨平台内容运营团队提供了经过验证的高质量视频创作工具。

💰 **价格**: 6: 1900 金币/1次 | 10: 3150 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-video-x-official/image-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-x-official/image-to-video';
  const payload = {
    "prompt": "Cinematic top-down aerial shot. The turquoise ocean waves roll rhythmically towards the shore, crashing into fine white foam against the pristine sand. The water recedes slowly, leaving a wet glisten on the beach. Subtle camera drone movement, slowly zooming in. High dynamic range, hyper-realistic fluid physics, 4k, professional color grading.",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/X1NZeuCIxHrcKlZOGwNWn9OSCqqvHjfk.jpg"
    ],
    "resolution": "720p",
    "duration": 10,
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
| prompt | string | 是 | 文本长度限制：1 - 800<br/>视频生成提示词 |
| image_urls | array | 是 | 单文件大小上限：10.0 MB（10485760 byte）<br/>最多上传数量：1<br/>最多支持 7 项图片，每张 10 MB |
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| duration | number | 是 | ⟨bz_enum_json⟩["6","10"]⟨/bz_enum_json⟩<br/>视频时长（秒） |
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
      "https://storage.bizyair.cn/outputs/wMeaJ5D5HSaNZpQq.mp4"
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
