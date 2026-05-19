---
display_name: "万相2.7.Pro-图生图-官方版"
category: "Image to Image"
manufacturer: "阿里"
price: "500 金币/1次"
price_url: "https://bizyair.cn/modelzoo/wan-2-7-image-pro-official/image-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  万相2.7专业图像官方版图生图模型，具备高阶图像重构与智能风格重塑能力。精准保留原图构图主体与核心语义，细节渲染、光影质感全面升级，风格迁移过渡自然，适用于商业图片精修、原画迭代创作、人像风格改造及专业视觉素材二次设计。
tags: ["万相图片"]
---

# 万相2.7.Pro-图生图-官方版

> **图生图** | 厂商: 阿里 | 模型: `wan-2-7-image-pro-official` | 类型: `image-to-image`

万相2.7专业图像官方版图生图模型，具备高阶图像重构与智能风格重塑能力。精准保留原图构图主体与核心语义，细节渲染、光影质感全面升级，风格迁移过渡自然，适用于商业图片精修、原画迭代创作、人像风格改造及专业视觉素材二次设计。

💰 **价格**: 500 金币/1次  [查看详情](https://bizyair.cn/modelzoo/wan-2-7-image-pro-official/image-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-image-pro-official/image-to-image';
  const payload = {
    "images": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/3mZ4A6EGloYJOjBon47AVdIG7SMSPNdS.png?uploads="
    ],
    "prompt": "A healthy border collie with black and white fur walking leisurely on the beach, paws touching the wet sand, sea breeze blowing its fur, distant seagulls, calm turquoise sea, warm sunset glow, soft shadows, photorealistic, sharp focus, natural color palette ",
    "size": "2K",
    "custom_width": 2048,
    "custom_height": 2048,
    "enable_sequential": false,
    "bbox_list": "",
    "watermark": false,
    "color_palette": ""
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
| images | array | 是 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>最少上传数量：1<br/>最多上传数量：9<br/>输入参考图片，最多9张。按顺序对应提示词中的图1、图2...。单张图片最多支持2个框选区域。 |
| prompt | string | 否 | 文本长度限制：1 - 5000<br/>编辑指令提示词，描述对图片的编辑操作。支持中英文，不超过5000字符。可引用图序号如"图1""图2"。 |
| size | string | 是 | ⟨bz_enum_json⟩["1K","2K","Custom"]⟨/bz_enum_json⟩<br/>输出图片分辨率。图像编辑场景支持1K和2K，不支持4K。有图片输入时输出宽高比跟随最后一张图片。 |
| custom_width | number | 否 | 取值范围：768 ~ 2048<br/>仅当尺寸=Custom时生效。图像编辑场景总像素上限2048×2048，宽高比范围1:8至8:1。 |
| custom_height | number | 否 | 取值范围：768 ~ 2048<br/>仅当尺寸=Custom时生效。图像编辑场景总像素上限2048×2048，宽高比范围1:8至8:1。 |
| enable_sequential | boolean | 否 | 启用组图输出模式，可参考输入图片风格生成一致性组图。启用时仅支持1K和2K分辨率。 |
| bbox_list | string | 否 | 文本长度限制：1 - 4096<br/>交互式编辑框选区域，JSON数组格式。列表长度必须与输入图片数量一致，无框选的图片对应位置传[]。坐标格式[x1,y1,x2,y2]为原图绝对像素坐标，单张图片最多2个框。 |
| watermark | boolean | 否 | 是否添加"AI生成"水印标识，水印位于图片右下角。 |
| color_palette | string | 否 | 文本长度限制：1 - 4096<br/>自定义颜色主题JSON数组，需包含3-10种颜色，推荐8种。每种颜色包含hex和ratio字段，所有ratio总和必须为100.00%。仅在关闭组图模式时可用。 |


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
      "https://storage.bizyair.cn/outputs/GjdErmlnRdAvf4Lg.png"
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
