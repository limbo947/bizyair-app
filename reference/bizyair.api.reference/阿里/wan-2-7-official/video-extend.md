> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-offcial/video-extend';
  const payload = {
    "first_clip": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/dEZhqvxPN2kNuda4tw5fJKfEO1NuNAeg.mp4"
    ],
    "last_frame": [],
    "driving_audio": [],
    "prompt": "向后延长@俯拍街景视频，保持原视频的俯拍角度、镜头高度与画面构图完全不变，从原视频最后一帧自然衔接，延续原有的街景内容与运动节奏。延长段落分三个阶段自然过渡：第一阶段——时间推移：\n延续原视频的日间街景状态，车流与人流继续正常流动，云影在街道上缓慢扫过，光线随时间缓缓变化，天色从原视频的光线状态向黄昏方向轻微过渡，街道地面在斜射光线下开始拉出长长的建筑与行人阴影。第二阶段——黄昏入夜：\n天色继续加深，路灯与建筑灯光陆续亮起，街道从自然光照过渡为人工灯光主导，车流尾灯与头灯在俯拍视角下形成流动的红白光点，行人逐渐减少，街道节奏变得更加舒缓。第三阶段——深夜静谧：\n街道进入深夜状态，车流稀疏，行人寥寥，路灯将街道切割为明亮光圈与深色阴影的交替图案，偶尔一辆车缓缓驶过，尾灯在湿润路面留下一道红色倒影随即消散，整条街道归于安静。全程镜头保持与原视频完全一致的固定俯拍机位，不做任何推拉移动，时间流逝是唯一的叙事动力，一镜延续原视频自然收尾。",
    "negative_prompt": "",
    "resolution": "1080P",
    "duration": 15,
    "prompt_extend": true,
    "watermark": false,
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
| first_clip | array | 是 | 支持格式：mp4、webm、mov<br/>单文件大小上限：100.0 MB（104857600 byte）<br/>视频最大时长：10（单位与配置一致，一般为秒）<br/>输入首段视频片，作为视频生成的起始输入 |
| last_frame | array | 否 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>可选尾帧图片，指定视频结束时的画面构图 |
| driving_audio | array | 否 | 支持格式：mp3、wav、aac、ogg、flac<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>可选驱动音频，用于控制视频中的声音生成 |
| prompt | string | 否 | 文本长度限制：1 - 2048<br/>视频生成提示词，描述期望生成的视频内容 |
| negative_prompt | string | 否 | 文本长度限制：1 - 2048<br/>反向提示词，描述不希望在视频中看到的内容 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>输出视频分辨率 |
| duration | number | 是 | 取值范围：2 ~ 15<br/>视频时长，单位秒 |
| prompt_extend | boolean | 否 | 是否开启prompt智能改写，开启后使用大模型对输入prompt进行改写 |
| watermark | boolean | 否 | 是否添加水印标识 |
| seed | number | 否 | 随机种子，-1表示自动生成 |

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
      "https://storage.bizyair.cn/outputs/37oei1GGvHylyTTP.mp4"
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
