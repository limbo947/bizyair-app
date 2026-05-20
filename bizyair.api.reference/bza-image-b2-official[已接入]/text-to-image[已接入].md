---
display_name: "通用图片B.2-文生图-官方版"
category: "Text to Image"
manufacturer: "谷歌"
price: "0.5K: 550 金币/1次 | 1K: 550 金币/1次 | 2K: 850 金币/1次 | 4K: 1100 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-b2-official/text-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片 B.2 官方版通过官方平台上线，立足于新一代创作工具。模型在文字渲染、世界知识整合、角色一致性与指令遵循方面实现了显著提升，能将信息图表、多语言菜单及动态插画等创意直接生成具备工业级排版与色彩精度的成品。该版本为需要在品质与效率之间取得平衡的创意团队提供稳定支持。
tags: ["通用图片B"]
---

# 通用图片B.2-文生图-官方版

> **文生图** | 厂商: 谷歌 | 模型: `bza-image-b2-official` | 类型: `text-to-image`

通用图片 B.2 官方版通过官方平台上线，立足于新一代创作工具。模型在文字渲染、世界知识整合、角色一致性与指令遵循方面实现了显著提升，能将信息图表、多语言菜单及动态插画等创意直接生成具备工业级排版与色彩精度的成品。该版本为需要在品质与效率之间取得平衡的创意团队提供稳定支持。

💰 **价格**: 0.5K: 550 金币/1次 | 1K: 550 金币/1次 | 2K: 850 金币/1次 | 4K: 1100 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-b2-official/text-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-b2-official/text-to-image';
  const payload = {
    "prompt": "A breathtaking fantasy ancient city floating among clouds at twilight,  massive stone temples and pagodas built on a series of interconnected  floating islands, waterfalls cascading off the island edges dissolving  into mist far below, ancient stone bridges connecting islands with  ornate carved railings. Giant ancient trees growing from the stone  platforms with glowing bioluminescent leaves in soft teal and gold.  Thousands of paper lanterns drifting upward from the city into the  purple sky. Stone architecture blending Chinese Tang Dynasty and  Cambodian Angkor Wat styles, moss and vines reclaiming every surface.  Sky: deep twilight gradient from burnt amber at horizon to deep  violet #2a1a4e at zenith, three moons of different sizes visible,  dramatic volumetric god rays piercing through cloud layers and  illuminating the floating city from below. Distant storm clouds  on the horizon with silent lightning.  Camera: ultra-wide 14mm, low angle looking upward at the city  from below the lowest island, epic scale conveyed by tiny  architectural details visible despite distance.  Color palette: deep violet #2a1a4e, warm amber #d4884a,  teal bioluminescence #1a9a8a, ancient stone grey #8a7a6a,  lantern gold #e8c832.  Cinematic fantasy concept art, photorealistic lighting,  ultra-detailed stone texture, volumetric atmosphere,  epic scale, 8K, no people, no text, no watermark.",
    "resolution": "2K",
    "aspect_ratio": "16:9",
    "seed": -1,
    "web_search": true
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |
| resolution | string | 是 | ⟨bz_enum_json⟩["0.5K","1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","4:3","1:1","3:4","9:16","21:9","3:2","2:3","5:4","4:5","4:1","1:4","8:1","1:8"]⟨/bz_enum_json⟩<br/>宽高比 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |
| web_search | boolean | 否 | 联网搜索 |


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
    "images": [
      "https://storage.bizyair.cn/outputs/B9D08dn7catbfsVR.png"
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
| outputs.images | array | 图片类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
