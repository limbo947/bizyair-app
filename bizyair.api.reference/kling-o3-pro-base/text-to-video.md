---
display_name: "可灵O3.Pro-文生视频-渠道版"
category: "Text to Video"
manufacturer: "可灵"
price: "true: 900 金币/1秒 | false: 700 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/kling-o3-pro-base/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  可灵O3.Pro渠道版文生视频模型，基于O3架构，支持文本直接生成视频。画面主体清晰、运动流畅，光影自然，适配创意短视频、广告脚本可视化及影视概念动态预览场景。
tags: ["可灵"]
---

# 可灵O3.Pro-文生视频-渠道版

> **文生视频** | 厂商: 可灵 | 模型: `kling-o3-pro-base` | 类型: `text-to-video`

可灵O3.Pro渠道版文生视频模型，基于O3架构，支持文本直接生成视频。画面主体清晰、运动流畅，光影自然，适配创意短视频、广告脚本可视化及影视概念动态预览场景。

💰 **价格**: true: 900 金币/1秒 | false: 700 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/kling-o3-pro-base/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-pro-base/text-to-video';
  const payload = {
    "prompt": "一个咖啡杯在画面中间，保持咖啡液面的色彩分布与纹路走向完全不变，但整体被重新解读为一颗星球的大气层俯瞰——咖啡的深棕色区域化为星球表面的大陆与山脉，拉花的白色纹路化为云层气旋，咖啡边缘的深色圆环化为星球的大气层边界，泛着幽蓝色的大气光晕。\n镜头从静止的星球全貌俯瞰开始，缓缓向某片云层旋涡推进，云层随镜头推近开始以极缓慢的速度自转流动，旋涡中心逐渐显现出深色的风暴眼结构。\n星球边缘大气层在阳光照射下泛出金橘色轮廓光，背景从咖啡杯的桌面逐渐过渡为纯粹的深空黑，几颗星点在背景中隐约浮现。\n镜头最终缓缓拉远，星球全貌重新入画，旋转的云层与大气光晕在深空背景中形成完整的星球形象，与最初那杯咖啡的俯拍构图完美呼应。\n音频：深空低频共鸣底噪，云层流动的极轻微气流声，配以一段合成器长音，绵延不断如星际漂流。\n超真实，咖啡纹路与星球大气结构融合自然，大气光学效果精准，深空背景过渡流畅，4K质感，无人物，无文字。",
    "duration": 5,
    "sound": true,
    "aspect_ratio": "16:9",
    "multi_shot": true,
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
| duration | number | 是 | 取值范围：1 ~ 15<br/>视频时长，单位秒。 |
| sound | boolean | 是 | 是否开启声音。 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1"]⟨/bz_enum_json⟩<br/>输出宽高比。 |
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
      "https://storage.bizyair.cn/outputs/7D1WHtq4OPxGtuwN.mp4"
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
