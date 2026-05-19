---
display_name: "可灵O3.Std-首尾帧-渠道版"
category: "FLF to Video"
manufacturer: "快手"
price: "true: 800 金币/1秒 | false: 550 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/kling-o3-std-base/flf-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  可灵O3渠道版首尾帧生视频模型，依托新一代O3架构，支持首尾帧约束生成，可精准把控画面运动轨迹。帧间过渡顺滑、光影高度一致，1080P画质表现稳定，适配影视分镜推演、广告镜头定制与剧情短片创作场景。
tags: ["可灵"]
---

# 可灵O3.Std-首尾帧-渠道版

> **首尾帧生视频** | 厂商: 快手 | 模型: `kling-o3-std-base` | 类型: `flf-to-video`

可灵O3渠道版首尾帧生视频模型，依托新一代O3架构，支持首尾帧约束生成，可精准把控画面运动轨迹。帧间过渡顺滑、光影高度一致，1080P画质表现稳定，适配影视分镜推演、广告镜头定制与剧情短片创作场景。

💰 **价格**: true: 800 金币/1秒 | false: 550 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/kling-o3-std-base/flf-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-std-base/flf-to-video';
  const payload = {
    "prompt": "Vast African savanna, morning light over the wilderness, herds of wildebeest and zebras galloping at full speed, antelopes leaping and running fast, wild animal migration raising light dust, grass swaying in the wind, natural dynamic movements, documentary realistic light, panoramic follow shot, low saturation, authentic wild scenery.\"",
    "first_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/bKtikTIcktM0yZmi79gvEdGD4EOew7P3.png?uploads="
    ],
    "duration": 5,
    "sound": false,
    "last_frame_image": [],
    "multi_shot": false,
    "shot_type": "intelligence",
    "multi_prompt": ""
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词。 |
| first_frame_image | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：1<br/>首帧图片。 |
| duration | number | 是 | 取值范围：3 ~ 15<br/>视频时长，单位秒。 |
| sound | boolean | 是 | 是否开启声音。 |
| last_frame_image | array | 否 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：0<br/>最多上传数量：1<br/>尾帧图片，选填。 |
| multi_shot | boolean | 否 | 是否生成多镜头视频。 |
| shot_type | string | 否 | ⟨bz_enum_json⟩["customize","intelligence"]⟨/bz_enum_json⟩<br/>镜头类型。customize为自定义，intelligence为智能。 |
| multi_prompt | string | 否 | 文本长度限制：1 - 10000<br/>多镜头提示词配置，JSON格式。 |


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
      "https://storage.bizyair.cn/outputs/0ST06gQufR98dd5O.mp4"
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
