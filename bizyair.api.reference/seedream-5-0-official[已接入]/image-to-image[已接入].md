---
display_name: "Seedream 5.0-图生图-官方版"
category: "Image to Image"
manufacturer: "字节"
price: "220 金币/1次"
price_url: "https://bizyair.cn/modelzoo/seedream-5-0-official/image-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  Seedream 5.0 图生图模式支持图片输入，首次引入多轮图文编辑能力，可在生成结果基础上通过自然语言持续进行局部修改，无需重新生成。对参考图中主体特征、风格与布局具备较强的保留与迁移能力，支持多参考图输入，原生 4K 分辨率输出，适合需要反复调整与精准控制的专业图像编辑场景。
tags: ["Seedream"]
---

# Seedream 5.0-图生图-官方版

> **图生图** | 厂商: 字节 | 模型: `seedream-5-0-official` | 类型: `image-to-image`

Seedream 5.0 图生图模式支持图片输入，首次引入多轮图文编辑能力，可在生成结果基础上通过自然语言持续进行局部修改，无需重新生成。对参考图中主体特征、风格与布局具备较强的保留与迁移能力，支持多参考图输入，原生 4K 分辨率输出，适合需要反复调整与精准控制的专业图像编辑场景。

💰 **价格**: 220 金币/1次  [查看详情](https://bizyair.cn/modelzoo/seedream-5-0-official/image-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedream-5-0-official/image-to-image';
  const payload = {
    "prompt": "参考图片中的钢铁侠手办，保持手办外观、配色、材质完全一致，\n强调手办与真实物体之间的尺寸反差与荒诞喜剧感。\n泡面危机：\n钢铁侠手办站在泡面碗边缘俯视翻腾热汤，蒸汽笼罩全身，\n面条如巨浪，深夜厨房昏黄灯光，蒸汽体积光效果，暖黄色调。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/4L2RI5A09KLrerd7abz9vKVUoRHZyZdL.jpg"
    ],
    "size": "3K"
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
| image_urls | array | 是 | 支持格式：jpeg、jpg、png、webp、bmp、tiff、gif、heic、heif<br/>单文件大小上限：30.0 MB（31457280 byte）<br/>图片最大总像素：36000000<br/>最多上传数量：14<br/>输入图片 |
| size | string | 否 | ⟨bz_enum_json⟩["2K","3K","4K"]⟨/bz_enum_json⟩<br/>指定生成图像的分辨率，并在prompt中用自然语言描述图片宽高比、图片形状或图片用途，最终由模型判断生成图片的大小。 |


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
      "https://storage.bizyair.cn/outputs/oXRhgJpwJOsKgiHb.jpeg"
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
