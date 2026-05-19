---
display_name: "海螺2.3-图生视频-渠道版"
category: "Image to Video"
manufacturer: "MiniMax"
price: "768P, 6s: 1600 金币/1次 | 768P, 10s: 3200 金币/1次 | 1080P, 6s: 2800 金币/1次"
price_url: "https://bizyair.cn/modelzoo/hailuo-2-3-base/image-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  海螺 2.3 渠道版图生视频模型面向设计工作室与新媒体从业者，依托时空生成架构实现静态图片动态化。主体结构稳定无畸变，画面运动过渡自然，色彩光影还原度高，兼顾生成速度与基础画质，适配日常创意短视频、产品动态素材制作。
tags: ["海螺"]
---

# 海螺2.3-图生视频-渠道版

> **图生视频** | 厂商: MiniMax | 模型: `hailuo-2-3-base` | 类型: `image-to-video`

海螺 2.3 渠道版图生视频模型面向设计工作室与新媒体从业者，依托时空生成架构实现静态图片动态化。主体结构稳定无畸变，画面运动过渡自然，色彩光影还原度高，兼顾生成速度与基础画质，适配日常创意短视频、产品动态素材制作。

💰 **价格**: 768P, 6s: 1600 金币/1次 | 768P, 10s: 3200 金币/1次 | 1080P, 6s: 2800 金币/1次  [查看详情](https://bizyair.cn/modelzoo/hailuo-2-3-base/image-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/hailuo-2-3-base/image-to-video';
  const payload = {
    "first_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/sNGRKduU5kOMAjKeVwqxVSnte2TwPDzU.jpg"
    ],
    "prompt": "参考图片为一张黑白老照片，保持照片中所有人物的位置、服装、神态与构图完全不变，将这张静止的黑白照片还原为真实流动的历史影像。\n为照片中每一个静止的人物赋予自然的微动作——人群开始轻微走动，衣摆随风轻微飘动，帽沿在微风中轻颤，远处有人抬手擦拭额头，一个孩子转头看向镜头方向，马车上的马轻轻甩动尾巴，地面上的落叶被风卷动。所有动作幅度极小，符合那个年代的人物动态节奏，绝不夸张。\n画面保持黑白灰色调，呈现1930年代新闻纪录片的胶片质感——轻微的画面抖动如手持摄影机，边缘有轻微的暗角晕染，偶尔出现细微的竖向划痕如老胶片磨损，帧率略低于正常呈现出早期电影的轻微顿挫感。\n镜头保持完全静止，如同摄影师架好三脚架后原地记录，不做任何推拉移动，只让画面中的时间重新流动起来。\n音频：1930年代街头环境音还原——马蹄声与车轮声，人群嘈杂的模糊交谈声，远处有留声机传出的爵士乐，偶尔一声汽车喇叭，整体带有老胶片录音的轻微失真与沙沙底噪。\n超真实，人物动作自然不突兀，黑白胶片质感精准还原，历史氛围完整，老照片与真实影像之间的边界彻底消融，4K输出但保持老胶片视觉质感，无新增人物，无文字。",
    "resolution": "768P",
    "duration": 10,
    "prompt_optimizer": true,
    "fast_pretreatment": false,
    "aigc_watermark": false
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
| first_frame_image | array | 是 | 支持格式：jpg、jpeg、png、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：300px<br/>图片最小高度：300px<br/>图片最小宽高比：2:5<br/>图片最大宽高比：5:2<br/>最少上传数量：1<br/>最多上传数量：1<br/>支持 JPG/JPEG/PNG/WebP，文件小于 20MB，图片短边需大于 300px，长宽比需在 2:5 到 5:2 之间。 |
| prompt | string | 是 | 文本长度限制：1 - 2000<br/>视频生成提示词，最大 2000 字符；支持海螺运镜指令写法。 |
| resolution | string | 是 | ⟨bz_enum_json⟩["768P","1080P"]⟨/bz_enum_json⟩<br/>支持 768P、1080P；当时长为 10 秒时仅支持 768P。 |
| duration | number | 是 | ⟨bz_enum_json⟩["6","10"]⟨/bz_enum_json⟩<br/>支持 6 秒、10 秒；1080P 仅支持 6 秒。 |
| prompt_optimizer | boolean | 否 | 是否自动优化 prompt，默认开启。 |
| fast_pretreatment | boolean | 否 | 是否缩短提示词优化耗时，默认关闭。 |
| aigc_watermark | boolean | 否 | 是否在视频中添加 AI 生成水印，默认关闭。 |


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
      "https://storage.bizyair.cn/outputs/x9JzFfCMDEBDgLXH.mp4"
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
