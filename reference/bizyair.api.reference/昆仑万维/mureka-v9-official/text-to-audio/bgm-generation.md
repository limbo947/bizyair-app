> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。



## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/mureka-v9-official/text-to-audio/bgm-generation';
  const payload = {
    "prompt": "# Title/Mood: 银盐暗房的最后下午 (The Last Silver Halide Afternoon) - Instrumental\n\n# Genre/Style: Ambient Neo-Classical (氛围新古典) / Cinematic Minimalist (电影感极简主义) / Post-Rock Minimal (后摇极简)\n\n# Instrumentation (乐器编制):\n- Primary: Upright Piano (立式钢琴，带有微弱的机械踩踏声与琴键颗粒感)\n- Atmosphere: Cinematic Ambient Pad (电影感氛围铺底), Soft Sub-Bass (低沉内敛的低音)\n- Texture: Warm Vinyl Crackle (温暖的黑胶唱片刮擦声/底噪，模拟暗房药水与时间的沙沙声)\n- Accent: Solo Cello (一把克制、低沉的大提琴，在曲目中后段切入)\n\n# Tempo & Rhythm: \nSlow tempo (约 65-70 BPM), Rubato (自由速度，有呼吸感与停顿感), No heavy drums (无重打击乐，仅用微弱的氛围环境音或极轻的马林巴/木琴点缀节奏).\n\n# Track Structure & Audio Journey (曲目结构与听觉走向):\n- [Intro]: Starts with warm vinyl crackle and a single, isolated piano note, establishing a cold, quiet darkroom atmosphere (开场由黑胶底噪和孤立的钢琴单音切入，营造冷清的暗房感).\n- [Development]: A melancholic, minimalist piano melody slowly untangles. Ambient pads gradually layer in, like winter fog rising outside the window (忧郁、极简的钢琴旋律缓缓展开，氛围音色像窗外的冬雾一样蔓延开来).\n- [Climax/Bridge]: The solo cello joins, swelling with restrained emotion. The dynamic d",
    "instrumental_urls": [],
    "n": 1
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
| X-Bizyair-Task-WebHook-Url | string | 是 | 为任务结束后的回调接口地址，如果不设置则采用同步模式，需要https或http，接口应为POST请求。若回调地址在海外，BizyAir 不保证回调成功，请悉知。 |
| X-Bizyair-Task-Authorization | string | 否 | 如回调接口带有授权，请将授权凭据写在这里，回调时会附带在请求头中，如：Authorization：${YOUR_WEBHOOK_AUTHORIZATION}。 |
| X-Bizyair-Task-${HEADER_NAME} | string | 否 | 所有以X-Bizyair-Task-开头的请求头，会在回调时原样不动包含在请求头中 |

### 2. 请求参数说明

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 否 | 文本长度限制：1 - 1024<br/>通过输入提示词控制音乐生成，最大1024个字符。 |
| instrumental_urls | array | 否 | 支持格式：mp3、m4a<br/>视频最大时长：30（单位与配置一致，一般为秒）<br/>最多上传数量：1<br/>通过参考音乐控制音乐生成 |
| n | number | 是 | 取值范围：1 ~ 3<br/>生成歌曲数量 |


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
    "audios": [
      "https://storage.bizyair.cn/outputs_examples/a9b9612a-636b-424c-9a37-5b2ead9e3f2d.mp3"
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
| outputs.audios | array | 音频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |

### 4. Webhook 回调说明

如果您在创建任务时通过`X-BizyAir-Webhook-URL`请求头指定了 Webhook 回调地址，BizyAir 会在任务结束后，向该地址发送回调通知。

当任务成功时：

```json
{
  "request_id": "6b88a97e-76e8-480a-bae7-a6f7f37b4e97",
  "status": "Success",
  "created_at": "2026-05-22 17:14:07",
  "executed_at": "2026-05-22 17:14:07",
  "ended_at": "2026-05-22 17:14:44",
  "outputs": {
    "audios": [
      "https://storage.bizyair.cn/outputs_examples/a9b9612a-636b-424c-9a37-5b2ead9e3f2d.mp3"
    ]
  },
  "cost_times": {
    "total_cost_time": 36815,
    "inference_duration": 36090
  }
}
```

当任务失败时：

```json
{
  "request_id": "ee8f5246-77ff-4df7-af62-7c55f311bcb2",
  "status": "Failed",
  "message": "Third-party api response error. No image generated.",
  "created_at": "2026-05-25 13:13:04",
  "executed_at": "2026-05-25 13:13:04",
  "ended_at": "2026-05-25 13:13:06",
  "outputs": {
    "texts": [
      "对不起，我不能提供生成此类内容的图像。"
    ]
  },
  "cost_times": {
    "total_cost_time": 1930
  }
}
```

您可以阅读上方的【**响应字段说明**】，了解各字段含义与取值说明。
