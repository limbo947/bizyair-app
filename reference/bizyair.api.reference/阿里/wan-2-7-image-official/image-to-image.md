> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-image-official/image-to-image';
  const payload = {
    "images": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/3mZ4A6EGloYJOjBon47AVdIG7SMSPNdS.png?uploads=",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/Sq08eTG9dQT71YSlQe3Mws4TBwh2Bycy.jpg?uploads="
    ],
    "prompt": "把图2的狗放到图1中奔跑，运动姿态不变",
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
      "https://storage.bizyair.cn/outputs/q5KXuDqen4ZxKQjH.png"
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
