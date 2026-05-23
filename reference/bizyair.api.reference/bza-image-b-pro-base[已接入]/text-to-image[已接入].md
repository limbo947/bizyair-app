---
display_name: "通用图片B.Pro-文生图-渠道版"
category: "Text to Image"
manufacturer: "谷歌"
price: "1K: 400 金币/1次 | 2K: 400 金币/1次 | 4K: 500 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-b-pro-base/text-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片 B.Pro 是一款专业级图像生成模型，支持最高 4K 分辨率图像生成，渠道版定价较官方版更低，适合对画质有要求的日常创作场景。
tags: ["通用图片B"]
---

# 通用图片B.Pro-文生图-渠道版

> **文生图** | 厂商: 谷歌 | 模型: `bza-image-b-pro-base` | 类型: `text-to-image`

通用图片 B.Pro 是一款专业级图像生成模型，支持最高 4K 分辨率图像生成，渠道版定价较官方版更低，适合对画质有要求的日常创作场景。

💰 **价格**: 1K: 400 金币/1次 | 2K: 400 金币/1次 | 4K: 500 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-b-pro-base/text-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-b-pro-base/text-to-image';
  const payload = {
    "aspect_ratio": "5:4",
    "resolution": "2K",
    "prompt": "{   \"label\": \"underwater-ancient-city\",   \"tags\": [\"underwater\", \"ruins\", \"cinematic\", \"photorealistic\"],   \"task\": \"generate_image\",   \"Style\": [     \"cinematic-underwater-photography\",     \"national-geographic-documentary\",     \"moody-atmospheric-realism\"   ],   \"Subject\": [     \"ancient sunken city ruins\",     \"massive stone archways covered in coral\",     \"crumbling columns with bioluminescent algae\",     \"schools of fish weaving through broken doorways\",     \"rays of light piercing the water surface from above\"   ],   \"Environment\": {     \"setting\": \"deep ocean floor, 40 meters depth\",     \"atmosphere\": \"murky blue-green water with floating particles\",     \"depth_haze\": \"gradual fade to darkness beyond 20 meters\",     \"water_clarity\": \"slightly turbid with suspended sediment\"   },   \"Lighting\": {     \"primary\": \"god rays from surface, diffused and scattered\",     \"secondary\": \"soft bioluminescent glow from coral and algae\",     \"color_temperature\": \"cool teal-blue #0a4d6e dominant\",     \"accent\": \"warm amber patches from ancient torch sconces still burning\",     \"shadows\": \"deep and dramatic, mystery-enhancing\"   },   \"ColorRestriction\": {     \"palette\": [\"deep teal #0a4d6e\", \"murky green #2d5a3d\", \"warm amber #c8762a\", \"soft white #e8f4f8\"],     \"restriction\": \"no bright saturated colors, all hues muted by water depth\"   },   \"Camera\": {     \"lens\": \"16mm ultra-wide\",     \"aperture\": \"f/4.0\",     \"iso\": \"3200\",     \"shutter\": \"1/60s\",     \"angle\": \"low angle looking up through the archway toward the light\",     \"composition\": \"rule of thirds, ruins frame left and right, light source upper center\"   },   \"Atmosphere\": {     \"mood\": \"awe, mystery, ancient grandeur, solitude\",     \"cues\": [\"lost civilization\", \"time forgotten\", \"nature reclaiming\"]   },   \"NegativePrompt\": [     \"people\", \"text\", \"watermark\", \"cartoon\", \"oversaturated\",     \"bright colors\", \"surface photography\", \"modern objects\"   ] }"
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
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["1:1","16:9","9:16","4:3","3:4","3:2","2:3","5:4","4:5","21:9"]⟨/bz_enum_json⟩<br/>宽高比 |
| resolution | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| prompt | string | 是 | 文本长度限制：1 - 20000<br/>提示词 |


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
      "https://storage.bizyair.cn/outputs/iPvWUDrG9Sac3fdt.jpg"
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
