---
display_name: "通用图片O.2-图生图-官方版"
category: "Image to Image"
manufacturer: "OpenAI"
price: ">2560*1440, high: 3486 金币/1次 | <=2560*1440 且 >1920*1080 , high: 2149 金币/1次 | <=1920*1080, high: 1120 金币/1次 | >2560*1440, medium: 966 金币/1次 | >1920*1080 且 <=2560*1440, medium: 630 金币/1次 | <=1920*1080, medium: 378 金币/1次 | >2560*1440 , low: 224 金币/1次 | >1920*1080 且 <=2560*1440, low: 182 金币/1次 | <=1920*1080, low: 161 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-o2-official/image-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片O.2 官方版的图生图功能在编辑表现与整体品质上达到该系列的较高水准。模型支持以文本指令对现有图像进行局部或全局修改，并能跨参考图像进行风格迁移与场景合成。官方版为有高标准要求的设计团队与品牌运营提供稳定的工具支持。
tags: ["通用图片O", "最近上新"]
---

# 通用图片O.2-图生图-官方版

> **图生图** | 厂商: OpenAI | 模型: `bza-image-o2-official` | 类型: `image-to-image`

通用图片O.2 官方版的图生图功能在编辑表现与整体品质上达到该系列的较高水准。模型支持以文本指令对现有图像进行局部或全局修改，并能跨参考图像进行风格迁移与场景合成。官方版为有高标准要求的设计团队与品牌运营提供稳定的工具支持。

💰 **价格**: >2560*1440, high: 3486 金币/1次 | <=2560*1440 且 >1920*1080 , high: 2149 金币/1次 | <=1920*1080, high: 1120 金币/1次 | >2560*1440, medium: 966 金币/1次 | >1920*1080 且 <=2560*1440, medium: 630 金币/1次 | <=1920*1080, medium: 378 金币/1次 | >2560*1440 , low: 224 金币/1次 | >1920*1080 且 <=2560*1440, low: 182 金币/1次 | <=1920*1080, low: 161 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-o2-official/image-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-o2-official/image-to-image';
  const payload = {
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/x3D7l8Auj8ote5AuGlPbpF6HhoyG2bEl.jpg"
    ],
    "prompt": "Background: A 1990s Chinese living room, old television set with a lace cover, patterned wallpaper, wooden chairs, a calender on the wall. Tech: Point-and-shoot camera flash, high contrast, red-eye effect, slight timestamp in orange font at the bottom right corner (1995/10/12). Low resolution, film grain texture.",
    "width": 1280,
    "height": 720,
    "quality": "medium"
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
| image_urls | array | 是 | 最多上传数量：16<br/>输入图像 |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |
| width | number | 是 | 取值范围：480 ~ 3840<br/>步进：16<br/>具体尺寸必须满足两个维度均为 16 的倍数，最大边长为 3840 像素，宽高比小于等于 3:1，总像素数介于 655,360 和 8,294,400 之间。 |
| height | number | 是 | 取值范围：480 ~ 3840<br/>步进：16<br/>具体尺寸必须满足两个维度均为 16 的倍数，最大边长为 3840 像素，宽高比小于等于 3:1，总像素数介于 655,360 和 8,294,400 之间。 |
| quality | string | 是 | ⟨bz_enum_json⟩["high","low","medium"]⟨/bz_enum_json⟩<br/>图片质量 |


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
      "https://storage.bizyair.cn/outputs/dOWYJLziMilfPIxU.png"
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
