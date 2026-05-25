> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/hailuo-2-3-fast-base/image-to-video';
  const payload = {
    "first_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/5j4Fh7Uh5mBUVn8ngT9Th7Wn64aNVHys.jpg"
    ],
    "prompt": "史诗级太空科幻大战。视频起始于输入图像中静止的行星排列。下一秒，平静被彻底打破：左侧的太阳猛烈爆发，向右喷射出一道席卷整个星系的巨大日冕物质抛射（耀斑巨浪）。各大行星纷纷觉醒天体能量进行反击：木星巨大的风暴红斑化为刺眼的等离子光束向前轰鸣射出；土星的星环开始高速旋转，化作无数片锋利的光能飞刃向四周切割；地球表面升起一道幽蓝色的脉冲磁场护盾，抵御袭来的能量。整个星系陷入引力扭曲与绚丽的能量交火。镜头采用动态的太空穿梭视角，在刺眼的光芒与星尘碎片中快速推进。超现实宇宙物理特效，8K超清。",
    "resolution": "768P",
    "duration": 6
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
| first_frame_image | array | 是 | 支持格式：jpg、jpeg、png、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：300px<br/>图片最小高度：300px<br/>图片最小宽高比：2:5<br/>图片最大宽高比：5:2<br/>最少上传数量：1<br/>最多上传数量：1<br/>支持 JPG/JPEG/PNG/WebP，文件小于 20MB，图片短边需大于 300px，长宽比需在 2:5 到 5:2 之间。 |
| prompt | string | 是 | 文本长度限制：1 - 2000<br/>视频生成提示词，最大 2000 字符；支持海螺运镜指令写法。 |
| resolution | string | 是 | ⟨bz_enum_json⟩["768P","1080P"]⟨/bz_enum_json⟩<br/>支持 768P、1080P；当时长为 10 秒时仅支持 768P。 |
| duration | number | 是 | ⟨bz_enum_json⟩["6","10"]⟨/bz_enum_json⟩<br/>支持 6 秒、10 秒；1080P 仅支持 6 秒。 |

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
    "videos": [
      "https://storage.bizyair.cn/outputs/JwnWENot3BYzTkaL.mp4"
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
| outputs.videos | array | 视频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
