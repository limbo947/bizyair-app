---
display_name: "万相2.7.Pro-文生图-官方版"
category: "Text to Image"
manufacturer: "阿里"
price: "500 金币/1次"
price_url: "https://bizyair.cn/modelzoo/wan-2-7-image-pro-offcial/text-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  万相2.7专业图像官方版文生图模型，采用高阶渲染架构，文本理解力与画面塑造力全面升级。人物比例精准、场景细节丰富，光影氛围高级，兼容写实、国风、二次元等全品类风格，适合商业视觉设计、插画原画、影视概念图等专业创作。
tags: ["万相图片"]
---

# 万相2.7.Pro-文生图-官方版

> **文生图** | 厂商: 阿里 | 模型: `wan-2-7-image-pro-offcial` | 类型: `text-to-image`

万相2.7专业图像官方版文生图模型，采用高阶渲染架构，文本理解力与画面塑造力全面升级。人物比例精准、场景细节丰富，光影氛围高级，兼容写实、国风、二次元等全品类风格，适合商业视觉设计、插画原画、影视概念图等专业创作。

💰 **价格**: 500 金币/1次  [查看详情](https://bizyair.cn/modelzoo/wan-2-7-image-pro-offcial/text-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-image-pro-offcial/text-to-image';
  const payload = {
    "prompt": "A healthy border collie with black and white fur walking leisurely on the beach, paws touching the wet sand, sea breeze blowing its fur, distant seagulls, calm turquoise sea, warm sunset glow, soft shadows, photorealistic, sharp focus, natural color palette ",
    "size": "2K",
    "custom_width": 2048,
    "custom_height": 2048,
    "enable_sequential": false,
    "thinking_mode": true,
    "watermark": false,
    "color_palette": "",
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
| prompt | string | 是 | 文本长度限制：1 - 5000<br/>文本提示词。支持中英文，不超过5000字符。描述想要生成的画面内容。 |
| size | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K","Custom"]⟨/bz_enum_json⟩<br/>输出图片分辨率。1K=1024×1024，2K=2048×2048，4K=4096×4096(仅Pro)。组图模式下不支持4K。 |
| custom_width | number | 否 | 取值范围：768 ~ 4096<br/>仅当尺寸=Custom时生效。总像素和宽高比需在限制范围内。 |
| custom_height | number | 否 | 取值范围：768 ~ 4096<br/>仅当尺寸=Custom时生效。总像素和宽高比需在限制范围内。 |
| enable_sequential | boolean | 否 | 启用组图输出模式，可生成一组保持角色或主体一致性的图片。启用时仅支持1K和2K分辨率。 |
| thinking_mode | boolean | 否 | 开启后模型增强推理能力以提升出图质量，但会增加耗时。仅在关闭组图模式时生效。 |
| watermark | boolean | 否 | 是否添加"AI生成"水印标识，水印位于图片右下角。 |
| color_palette | string | 否 | 文本长度限制：1 - 4096<br/>自定义颜色主题JSON数组，需包含3-10种颜色，推荐8种。每种颜色包含hex和ratio字段，所有ratio总和必须为100.00%。仅在关闭组图模式时可用。 |
| seed | number | 否 | 随机数种子，取值范围0-2147483647，-1表示自动生成。相同seed可使生成内容保持相对稳定。 |


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
      "https://storage.bizyair.cn/outputs/UrUM5UosdZrCGxEl.png"
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
