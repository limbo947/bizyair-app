> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-b-pro-official/text-to-image';
  const payload = {
    "prompt": "{   \"label\": \"golden-era-horse-racing\",   \"tags\": [\"horse-racing\", \"1950s\", \"cinematic\", \"photorealistic\", \"vintage\"],   \"task\": \"generate_image\",   \"Style\": [     \"1950s-kodachrome-film-photography\",     \"life-magazine-editorial\",     \"vintage-sports-documentary\"   ],   \"Subject\": [     \"six thoroughbred racehorses mid-gallop at full speed\",     \"jockeys in vibrant silk racing silks crouched low\",     \"dirt and mud flying dramatically from hooves\",     \"lead horse neck stretched forward at finish line\",     \"motion blur on legs conveying explosive speed\"   ],   \"Environment\": {     \"setting\": \"classic horse racing track, 1950s American grandstand\",     \"ground\": \"dirt track, churned and flying in mid-air\",     \"background\": \"packed grandstand crowd in period-appropriate clothing\",     \"weather\": \"bright sunny afternoon, slight heat shimmer on track\"   },   \"Lighting\": {     \"primary\": \"harsh midday sun from upper left, casting sharp shadows\",     \"color_temperature\": \"warm golden Kodachrome #e8c97a dominant\",     \"shadows\": \"sharp and dramatic under horses and hooves\",     \"highlight\": \"bright glint on jockey helmets and horse coats\",     \"film_character\": \"slight overexposure typical of 1950s color film\"   },   \"ColorRestriction\": {     \"palette\": [       \"kodachrome gold #e8c97a\",       \"sky blue #5b8fc9\",       \"racing green #2d6a2d\",       \"dirt brown #8b6343\",       \"vivid jockey red #cc2200\"     ],     \"restriction\": \"colors rich and slightly oversaturated in Kodachrome style, not digital-clean\"   },   \"Camera\": {     \"lens\": \"135mm telephoto\",     \"aperture\": \"f/5.6\",     \"shutter\": \"1/1000s to freeze motion with slight blur on extremities\",     \"angle\": \"low ground level side view, horses filling entire frame\",     \"composition\": \"lead horse at golden ratio right, pack stretching left\",     \"film_stock\": \"Kodachrome 64, fine grain visible\"   },   \"PostProcessing\": {     \"grain\": \"fine Kodachrome film grain throughout\",     \"vignette\": \"subtle darkening at corners\",     \"color_shift\": \"slight yellow-green in shadows typical of aged Kodachrome\",     \"scan_artifacts\": \"very subtle horizontal scan lines suggesting scanned print\"   },   \"Atmosphere\": {     \"mood\": \"excitement, power, speed, golden era glamour\",     \"era\": \"1950s America, post-war optimism\",     \"cues\": [\"kentucky derby grandeur\", \"sport of kings\", \"thundering hooves\"]   },   \"NegativePrompt\": [     \"modern clothing\", \"digital look\", \"clean sharp colors\",     \"HDR\", \"people standing still\", \"text\", \"watermark\",     \"contemporary equipment\", \"oversaturated digital palette\"   ] }",
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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 20000<br/>提示词 |
| resolution | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","4:3","1:1","3:4","9:16","21:9","3:2","2:3","5:4","4:5"]⟨/bz_enum_json⟩<br/>宽高比 |
| temperature | number | 否 | 取值范围：0 ~ 2<br/>步进：0.01<br/>温度 |
| top_p | number | 否 | 取值范围：0 ~ 1<br/>步进：0.01<br/>Top-P 采样 |
| max_tokens | number | 否 | 取值范围：1 ~ 32768<br/>最大输出token |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |

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
      "https://storage.bizyair.cn/outputs/4d6924bd-0db7-4618-9e32-5ee6ca85f2d6.png"
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
