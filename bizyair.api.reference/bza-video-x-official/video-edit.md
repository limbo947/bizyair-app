---
display_name: "通用视频X-视频编辑-官方版"
category: "Video Edit"
manufacturer: "grok"
price: "450 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/bza-video-x-official/video-edit?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用视频X 官方版的视频编辑能力在指令遵循度、效果一致性及整体表现上均有良好表现。模型支持以自然语言对视频进行对象增删替换、场景氛围转换及多风格迁移，让创作者无需传统剪辑软件即可快速获得成品级的修改结果。
tags: ["通用视频X"]
---

# 通用视频X-视频编辑-官方版

> **视频编辑** | 厂商: grok | 模型: `bza-video-x-official` | 类型: `video-edit`

通用视频X 官方版的视频编辑能力在指令遵循度、效果一致性及整体表现上均有良好表现。模型支持以自然语言对视频进行对象增删替换、场景氛围转换及多风格迁移，让创作者无需传统剪辑软件即可快速获得成品级的修改结果。

💰 **价格**: 450 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/bza-video-x-official/video-edit?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-x-official/video-edit';
  const payload = {
    "prompt": "Transform the modern city street into an ethereal fantasy realm. Preserve the architectural structure while infusing skyscraper surfaces with glowing violet and golden magical patterns. Enhance the sunset sky with vibrant auroras and distant swirling nebulae. Add drifting golden stardust and translucent floating crystals into the air. The color palette should feature a dreamy contrast of deep magenta and radiant gold. Cinematic soft lighting, surreal atmosphere, hyper-realistic magical details, 4k resolution.",
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/soUkM8jWaQWVNUVLiAXKKDdFVWqJ0HAR.mp4"
    ],
    "resolution": "720p"
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
| prompt | string | 是 | 文本长度限制：1 - 800<br/>提示词。 |
| video_urls | array | 是 | 单文件大小上限：50.0 MB（52428800 byte）<br/>最多上传数量：1<br/>参考视频。 |
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p"]⟨/bz_enum_json⟩<br/>分辨率 |


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
      "https://storage.bizyair.cn/outputs/lc7JQQnLX56iDFTY.mp4"
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
