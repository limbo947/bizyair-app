> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-fast-base/flf-to-video';
  const payload = {
    "prompt": "以首帧画面为起始：镜头位于草原高处俯瞰，广袤的绿色草原向远方延伸，起伏的丘陵连绵至天际，一条土路和一道溪流蜿蜒穿过草地，远处可见零星牧场建筑，蓝天白云，光影在山丘间缓慢移动。 镜头缓缓向前推进并逐渐下降至平视角度，视角从高处俯瞰过渡为身处草原之中的第一人称视角。云层阴影在草地上缓慢流动，草浪随风轻轻起伏，光线随云层移动产生明暗变化。 过渡至尾帧画面：镜头降至地面平视高度，视野中是开阔的平坦草原，远处丘陵线条更加柔缓，几个人影散落在草地中远处，天空占据画面上半部分，白云舒展，整体空间感从纵深收拢变为水平铺展的开阔感。 全程镜头运动平滑匀速，无剪切，一镜完成。草地纹理细腻真实，每一根草叶随风自然摆动，云影在地面匀速滑过。自然光照，色彩饱满但不过度饱和，保持真实草原的色彩还原。 音频：草原风声持续贯穿，由远及近，草叶沙沙声，偶尔远处鸟鸣，整体安静辽阔。 超真实，电影级画面，自然纪录片风格，4K质感，轻微空气透视效果，远景略带薄雾感，色调清新通透。",
    "resolution": "2k",
    "duration": 6,
    "first_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/oWw7UtZP4AYp7m7OleErvfvix7L5QvUU.jpg"
    ],
    "last_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/UkKBfRNK6Gds2ckgd8heSgZIKVF0KL5m.jpg"
    ],
    "generate_audio": true,
    "ratio": "16:9",
    "return_last_frame": false,
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
| prompt | string | 否 | 文本长度限制：1 - 20480<br/>视频生成提示词 |
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p","1080p","2k","4k"]⟨/bz_enum_json⟩<br/>视频分辨率。分为模型原生输出的分辨率（480p、720p、native1080p），与基于 720p 原生生成后进行超分放大的分辨率（1080p、2k、4k）。 |
| duration | number | 是 | 取值范围：4 ~ 15<br/>视频时长（秒） |
| first_frame_url | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>首帧图片 |
| last_frame_url | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>最多支持 1 项图片，每张 30 MB |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| ratio | string | 否 | ⟨bz_enum_json⟩["adaptive","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| return_last_frame | boolean | 否 | 是否返回视频尾帧图片 |
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
    "videos": [
      "https://storage.bizyair.cn/outputs/7GdwUJWBk33S7Dit.mp4"
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
