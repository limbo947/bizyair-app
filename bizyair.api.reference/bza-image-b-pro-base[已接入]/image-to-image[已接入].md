---
display_name: "通用图片B.Pro-图生图-渠道版"
category: "Image to Image"
manufacturer: "谷歌"
price: "1K: 400 金币/1次 | 2K: 400 金币/1次 | 4K: 500 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-b-pro-base/image-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片 B.Pro 的图生图功能支持上传已有图像并通过文本指令进行编辑修改，在精准的多语言文本渲染方面有良好表现。该版本价格低于官方版，适用于产品摄影、品牌视觉设计等需要兼顾精度与效率的图像编辑任务。
tags: ["通用图片B"]
---

# 通用图片B.Pro-图生图-渠道版

> **图生图** | 厂商: 谷歌 | 模型: `bza-image-b-pro-base` | 类型: `image-to-image`

通用图片 B.Pro 的图生图功能支持上传已有图像并通过文本指令进行编辑修改，在精准的多语言文本渲染方面有良好表现。该版本价格低于官方版，适用于产品摄影、品牌视觉设计等需要兼顾精度与效率的图像编辑任务。

💰 **价格**: 1K: 400 金币/1次 | 2K: 400 金币/1次 | 4K: 500 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-b-pro-base/image-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-b-pro-base/image-to-image';
  const payload = {
    "prompt": "{   \"label\": \"city-reclaimed-by-nature\",   \"tags\": [\"post-apocalyptic\", \"nature-reclaimed\", \"overgrown-ruins\", \"cinematic\"],   \"task\": \"edit_image\",   \"inputs\": [     {       \"type\": \"reference_image\",       \"path\": \"https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/a9beN1mQJxYkjDFqus3jEiMAZ0ztoICn.jpg\",       \"role\": \"base_structure\",       \"preserve\": [\"building layout\", \"street grid\", \"architectural silhouette\", \"composition\"]     }   ],   \"EditInstructions\": {     \"keep\": \"overall city composition, building positions, sky proportion, camera angle\",     \"transform\": [       \"replace all glass and concrete surfaces with moss, vines and crumbling stone\",       \"overgrow every road and sidewalk with dense tropical vegetation\",       \"collapse upper floors of buildings into dramatic broken silhouettes\",       \"fill windows with hanging plants and tree branches growing outward\",       \"replace vehicles with rusted overgrown shells consumed by plant life\",       \"add massive trees growing through building floors and rooftops\"     ],     \"add\": [       \"deer or wildlife walking through overgrown streets\",       \"hanging vines draping from every ledge and beam\",       \"wildflowers carpeting every flat surface\",       \"birds nesting in broken window frames\"     ]   },   \"Style\": [     \"post-apocalyptic-photorealism\",     \"national-geographic-nature-documentary\",     \"I-am-legend-visual-reference\"   ],   \"Lighting\": {     \"primary\": \"golden hour sunlight breaking through forest canopy formed by city trees\",     \"color_temperature\": \"warm amber #d4884a mixed with deep green #1a4a1a\",     \"shadows\": \"dappled light through leaves, organic and soft\",     \"atmosphere\": \"misty morning haze at street level\"   },   \"ColorRestriction\": {     \"palette\": [\"deep forest green #1a4a1a\", \"warm amber #d4884a\", \"stone grey #6b6b5a\", \"rust brown #8b4513\"],     \"restriction\": \"desaturate all man-made materials, saturate all organic plant life\"   },   \"Camera\": {     \"lens\": \"same as reference image\",     \"aperture\": \"f/5.6\",     \"angle\": \"maintain exact same angle as input image\",     \"composition\": \"preserve original framing exactly\"   },   \"Atmosphere\": {     \"mood\": \"haunting beauty, nature triumphant, melancholy wonder\",     \"time_elapsed\": \"200 years after human abandonment\",     \"cues\": [\"silent world\", \"nature always wins\", \"urban jungle\"]   },   \"NegativePrompt\": [     \"people\", \"text\", \"watermark\", \"cartoon\",     \"clean surfaces\", \"modern intact buildings\",     \"artificial lighting\", \"neon signs\"   ] }",
    "resolution": "2K",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/a9beN1mQJxYkjDFqus3jEiMAZ0ztoICn.jpg"
    ],
    "aspect_ratio": "16:9"
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
| resolution | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| image_urls | array | 是 | 单文件大小上限：10.0 MB（10485760 byte）<br/>最多上传数量：10<br/>最多支持 10 项图片，每张 10 MB |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["1:1","16:9","9:16","4:3","3:4","3:2","2:3","5:4","4:5","21:9"]⟨/bz_enum_json⟩<br/>宽高比 |


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
      "https://storage.bizyair.cn/outputs/NutFs8vXOVTrBxUq.jpg"
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
