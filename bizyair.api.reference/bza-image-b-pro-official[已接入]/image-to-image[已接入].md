---
display_name: "通用图片B.Pro-图生图-官方版"
category: "Image to Image"
manufacturer: "谷歌"
price: "1K: 700 金币/1次 | 2K: 1000 金币/1次 | 4K: 1300 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-b-pro-official/image-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片 B.Pro 官方版的图生图功能在编辑表现与整体品质上达到该系列的较高水准。模型支持以文本指令对现有图像进行局部或全局修改，支持上传 14 张参考图像，可提供镜头角度、焦段、色彩分级和场景光照等专业控制。
tags: ["通用图片B"]
---

# 通用图片B.Pro-图生图-官方版

> **图生图** | 厂商: 谷歌 | 模型: `bza-image-b-pro-official` | 类型: `image-to-image`

通用图片 B.Pro 官方版的图生图功能在编辑表现与整体品质上达到该系列的较高水准。模型支持以文本指令对现有图像进行局部或全局修改，支持上传 14 张参考图像，可提供镜头角度、焦段、色彩分级和场景光照等专业控制。

💰 **价格**: 1K: 700 金币/1次 | 2K: 1000 金币/1次 | 4K: 1300 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-b-pro-official/image-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-b-pro-official/image-to-image';
  const payload = {
    "prompt": "Transform the reference image into classic Marvel Comics illustration style.Fully preserve the original subject features, structure, proportion, composition, overall layout and core details; do not change subject type, shape, inherent attributes and original morphological characteristics. Apply traditional vintage Marvel comic book rendering: bold thick ink outline lines to define all edges, contours and structural forms; dynamic cross-hatching for shadow and dark areas; classic Ben-Day dot halftone pattern overlay on mid-tone areas.Adopt flat color block layering + clear large-area shadow partitioning; use bold graphic stroke texture for texture parts, highlight areas retain pure blank white. Unify the whole picture with Marvel classic bold primary color palette, with distinct light and shadow contrast, strong layering and retro comic texture.Background unified into dramatic atmospheric scene layout, add comic dynamic speed lines / radial effect lines appropriately to enhance sense of motion. Refer to Jack Kirby & John Romita Sr. classic retro Marvel comic style, add printing halftone grain texture, dynamic visual composition, dramatic cinematic lighting, high saturation and strong color impact.No text, no logo, no watermark, no extra redundant elements, pure comic illustration effect.",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/HIuFRGseCdF0nOtsrSPb5zLfk1tKZH14.jpg"
    ],
    "resolution": "2K",
    "aspect_ratio": "16:9",
    "temperature": 0.95,
    "top_p": 0.95,
    "max_tokens": 1,
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
| prompt | string | 是 | 文本长度限制：1 - 20000<br/>提示词 |
| image_urls | array | 是 | 单文件大小上限：10.0 MB（10485760 byte）<br/>最多上传数量：14<br/>输入图片 |
| resolution | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","4:3","1:1","3:4","9:16","21:9","3:2","2:3","5:4","4:5"]⟨/bz_enum_json⟩<br/>宽高比 |
| temperature | number | 否 | 取值范围：0 ~ 2<br/>步进：0.01<br/>温度 |
| top_p | number | 否 | 取值范围：0 ~ 1<br/>步进：0.01<br/>核采样 |
| max_tokens | number | 否 | 取值范围：1 ~ 32768<br/>最大输出token |
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
    "images": [
      "https://storage.bizyair.cn/outputs/55b34ed2-8c07-41cf-a4d0-621ed40c87cf.png"
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
