---
display_name: "通义Z-Image.Turbo-文生图-官方版"
category: "Text to Image"
manufacturer: "硅基流动"
price: "总像素数<=1024x1024，5金币/张；总像素数>1024x1024，10金币/张；"
price_url: "https://bizyair.cn/modelzoo/z-image-turbo/text-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  阿里推出的Z-Image-Turbo极速文生图像模型，以低延迟推理与照片级真实感为核心优势，光影、纹理细节还原精准，中英双语指令理解能力突出，支持多元风格生成，构图稳定，适配广告设计、内容创作、产品原型等场景，为专业创作者提供高效的图像生成解决方案。
tags: ["自部署开源模型"]
---

# 通义Z-Image.Turbo-文生图-官方版

> **文生图** | 厂商: 硅基流动 | 模型: `z-image-turbo` | 类型: `text-to-image`

阿里推出的Z-Image-Turbo极速文生图像模型，以低延迟推理与照片级真实感为核心优势，光影、纹理细节还原精准，中英双语指令理解能力突出，支持多元风格生成，构图稳定，适配广告设计、内容创作、产品原型等场景，为专业创作者提供高效的图像生成解决方案。

💰 **价格**: 总像素数<=1024x1024，5金币/张；总像素数>1024x1024，10金币/张；  [查看详情](https://bizyair.cn/modelzoo/z-image-turbo/text-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/z-image-turbo/text-to-image';
  const payload = {
    "prompt": "This is a high-quality photograph of a bright red Ford Bronco SUV with a modern design. The vehicle is positioned in the center of the image, facing slightly to the left, with a three-quarter view of the front and right side. The SUV features a black grille with the Ford logo in the center, angular LED headlights with a sleek design, and a black front bumper with a license plate that reads \"BIZYAIR.\" The vehicle‘s side mirrors and door handles are black, and the wheels have a black design with silver accents. The background is a gradient of pink and white, creating a vibrant and dynamic atmosphere. The lighting highlights the shiny finish of the red paint, giving the vehicle a polished appearance. The surface on which the SUV is placed appears to be smooth and reflective, adding to the modern aesthetic. The overall composition of the image emphasizes the sleek and stylish design of the Ford Bronco, with a focus on its bold color and contemporary features.",
    "negative_prompt": "",
    "batch_size": 1,
    "seed": -1,
    "height": 1024,
    "width": 1024
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
| negative_prompt | string | 否 | 文本长度限制：1 - 2500<br/>负向提示词 |
| batch_size | number | 是 | 取值范围：1 ~ 4<br/>生成数量 |
| seed | number | 否 | 取值范围：1 ~ 2147483647<br/>种子 |
| height | number | 否 | 取值范围：256 ~ 2048<br/>图片高度 |
| width | number | 否 | 取值范围：256 ~ 2048<br/>图像宽度 |


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
      "https://storage.bizyair.cn/outputs/3t2fo7ejznai6_e44c85972874a95e5f46b1a99e163751_image_aa1b00a2_00001_.png"
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
