> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 20000<br/>提示词 |
| resolution | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| image_urls | array | 是 | 单文件大小上限：10.0 MB（10485760 byte）<br/>最多上传数量：10<br/>最多支持 10 项图片，每张 10 MB |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["1:1","16:9","9:16","4:3","3:4","3:2","2:3","5:4","4:5","21:9"]⟨/bz_enum_json⟩<br/>宽高比 |

> 为保护您的业务敏感信息（如 prompt 设计等），我们支持对 API 调用记录中的指定字段进行脱敏处理。脱敏后的字段在查询调用记录时将显示为 `[调用方要求隐藏]`，但不影响实际请求的执行和计费准确性。
>
> **使用方法**：在请求头中携带 `X-BizyAir-Log-Mask-Fields`，指定需要脱敏的字段，多个字段用英文逗号分隔。
>
> ```http
> Content-Type: application/json
> Authorization: Bearer ${BIZYAIR_API_KEY}
> X-BizyAir-Log-Mask-Fields: prompt, image_urls
> ```


## 三. 查询结果

### 2. 响应示例

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

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |
| status | string | 任务状态，可能的值为：Pending（排队中）、Running（运行中）、Saving（转存中）、Success（完成）、Failed（失败）。 |
| message | string | 任务状态为 Failed 时，错误的具体信息。 |
| executed_at | string | 任务开始运行的时间。 |
| ended_at | string | 当任务成功或失败时，任务结束的时间。 |
| outputs | array | 生成结果（非“完成”状态时，为null或[]）。 |
| outputs.images | array | 图片类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
