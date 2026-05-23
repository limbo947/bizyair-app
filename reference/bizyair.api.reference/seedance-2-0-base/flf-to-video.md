---
display_name: "Seedance-2.0-首尾帧-渠道版"
category: "FLF to Video"
manufacturer: "字节"
price: "480p: 600 金币/1秒 | 720p: 1200 金币/1秒 | native1080p: 3000 金币/1秒 | 1080p: 1480 金币/1秒 | 2k: 1620 金币/1秒 | 4k: 1830 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/seedance-2-0-base/flf-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  Seedance-2.0系列中首尾帧生成视频的渠道版本，允许上传首帧与尾帧图像来精准定义视频的起点与终点画面。模型能智能插值生成中间过程，自动实现平滑且符合物理逻辑的转场。
tags: ["Seedance"]
---

# Seedance-2.0-首尾帧-渠道版

> **首尾帧生视频** | 厂商: 字节 | 模型: `seedance-2-0-base` | 类型: `flf-to-video`

Seedance-2.0系列中首尾帧生成视频的渠道版本，允许上传首帧与尾帧图像来精准定义视频的起点与终点画面。模型能智能插值生成中间过程，自动实现平滑且符合物理逻辑的转场。

💰 **价格**: 480p: 600 金币/1秒 | 720p: 1200 金币/1秒 | native1080p: 3000 金币/1秒 | 1080p: 1480 金币/1秒 | 2k: 1620 金币/1秒 | 4k: 1830 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/seedance-2-0-base/flf-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-base/flf-to-video';
  const payload = {
    "prompt": "A cinematic forest video transitioning from the foreground of bright green large leaves to deep moss-covered trees in dense tropical forest, sunlight streaming through thick canopy, soft shadows on forest floor, slight motion of leaves and branches, ferns and undergrowth detailed, smooth camera movement from front to deep forest, ultra realistic textures, natural color grading, no distortions, no people, realistic depth, cinematic wide-angle, smooth seamless transition from first to last frame",
    "resolution": "2k",
    "duration": 5,
    "first_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/40Jg2BKvaiejAjSxgTb7xRq5SQ8SAdFJ.jpg"
    ],
    "last_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/cUpJarTBtboGhOnojIDUIX6DcCXPE8Xa.jpg"
    ],
    "generate_audio": true,
    "ratio": "16:9",
    "return_last_frame": false,
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
| prompt | string | 否 | 文本长度限制：1 - 20480<br/>视频生成提示词 |
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p","native1080p","1080p","2k","4k"]⟨/bz_enum_json⟩<br/>视频分辨率。分为模型原生输出的分辨率（480p、720p、native1080p），与基于 720p 原生生成后进行超分放大的分辨率（1080p、2k、4k）。 |
| duration | number | 是 | 取值范围：4 ~ 15<br/>视频时长（秒） |
| first_frame_url | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>首帧图片 |
| last_frame_url | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>最多支持 1 项图片，每张 30 MB |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| ratio | string | 否 | ⟨bz_enum_json⟩["adaptive","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| return_last_frame | boolean | 否 | 是否返回视频尾帧图片 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |


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
      "https://storage.bizyair.cn/outputs/DGWrAZXqaVO5xPFd.mp4"
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
