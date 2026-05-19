---
display_name: "可灵3.0.Std-首尾帧-渠道版"
category: "FLF to Video"
manufacturer: "快手"
price: "true: 1050 金币/1秒 | false: 700 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/kling-3-0-std-base/flf-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  可灵3.0.Std渠道版首尾帧生视频模式，基于MVL架构，支持通过指定起始帧与结束帧约束画面运动轨迹，模型自动补全中间过渡内容，帧间衔接自然，原生支持同步音频输出，最大时长15秒。综合调用成本低于官方版。
tags: ["可灵"]
---

# 可灵3.0.Std-首尾帧-渠道版

> **首尾帧生视频** | 厂商: 快手 | 模型: `kling-3-0-std-base` | 类型: `flf-to-video`

可灵3.0.Std渠道版首尾帧生视频模式，基于MVL架构，支持通过指定起始帧与结束帧约束画面运动轨迹，模型自动补全中间过渡内容，帧间衔接自然，原生支持同步音频输出，最大时长15秒。综合调用成本低于官方版。

💰 **价格**: true: 1050 金币/1秒 | false: 700 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/kling-3-0-std-base/flf-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-3-0-std-base/flf-to-video';
  const payload = {
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/g3EVN3avGpLcUutcrk1JBqvjwkDyAHM6.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/3qiIHHwf6lenWMackP8dRQbUcMeqGuLq.jpg"
    ],
    "prompt": "Cinematic aerial shot. Initially, a lone motorcyclist speeds across a vast golden desert, leaving a trail of dust. The camera then smoothly pulls back and ascends rapidly, expanding the field of view. As the camera rises, the rider shrinks and eventually vanishes into the intricate patterns of the endless dunes. The final frame is a distant, high-altitude top-down view of the pristine, empty desert with no signs of human presence. High dynamic range, realistic sand physics, 4k resolution.",
    "aspect_ratio": "9:16",
    "duration": 5,
    "sound": true,
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
| image_urls | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：2<br/>上传首帧图片（必填，作为视频起始帧）；第二张为末帧图片（可选，作为视频结束帧） |
| prompt | string | 否 | 文本长度限制：1 - 2048<br/>视频生成提示词 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1"]⟨/bz_enum_json⟩<br/>缺失时将自动填充默认值：16:9<br/>视频宽高比。当上传首帧图片时，系统将自动适配图片比例，此参数可选。 |
| duration | number | 是 | 取值范围：3 ~ 15<br/>视频时长，单位秒，范围3-15秒 |
| sound | boolean | 否 | 是否开启声音效果 |
| seed | number | 否 | 随机种子，-1表示自动生成 |


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
      "https://storage.bizyair.cn/outputs/OwnkrOVh33sleFlt.mp4"
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
