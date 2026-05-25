> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["1:1","16:9","9:16","4:3","3:4","3:2","2:3","5:4","4:5","21:9"]⟨/bz_enum_json⟩<br/>宽高比 |
| resolution | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| prompt | string | 是 | 文本长度限制：1 - 20000<br/>提示词 |

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
      "https://storage.bizyair.cn/outputs/iPvWUDrG9Sac3fdt.jpg"
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
