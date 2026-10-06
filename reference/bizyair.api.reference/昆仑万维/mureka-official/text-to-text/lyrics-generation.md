> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。



## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/mureka-official/text-to-text/lyrics-generation';
  const payload = {
    "prompt": "# Title: 银盐暗房的最后下午 (The Last Silver Halide Afternoon)\n\n# Style/Genre: 现代民谣 (Contemporary Folk) / 氛围流行 (Ambient Pop). 带有雷光夏式的电影质感与林夕式的克制思辨。\n\n# Core Theme: \n这是一首关于“痕迹与告别”的诗化歌词。背景是一间在第一场冬雪前夕即将关闭的老式照相馆。探讨那些留在世间的物质痕迹（底片、药水、废弃的相框）和精神遗产，如何证明一个人的存在。整体基调清冷、内敛、充满空间感，拒绝廉价的口水话煽情。\n\n# Song Structure Requirements:\n请自动生成包含以下完整结构的歌词，并严格用标签标注：\n\n- [Verse 1] (主歌1)：素描暗房的微观环境。使用具有物理质感的词汇（如：显影液、红灯、没有被认领的二月、哭墙般的废底片），营造出时间被定格的静谧。\n- [Verse 2] (主歌2)：叙事递进。描写指尖沾上定影粉的触觉，以及窗外北方初雪将落未落的宏大背景，将微观局部拉向时空交错。\n- [Chorus] (副歌)：全曲的情感与文学核心。升华主题——“摄影是把瞬间变成不朽，也是把活人变成标本”。探讨数字时代里，我们在物质世界留下的最后道别（Farewell）。\n- [Bridge] (桥段)：节奏和视角的转变。像电影镜头突然拉远，冷眼看待那些未被取走的、已经消亡的过往，形成一种宿命般的和解。\n- [Chorus] (副歌)：情绪的克制重现，余音绕梁。\n- [Outro] (尾奏)：一两句诗意的独白，像雪落下的声音，干净利落地收尾。\n\n# Writing Constraints:\n1. 语言风格：句子长短错落，有呼吸感。严禁使用“伤心、痛苦、眼泪、爱恨”等高频俗套词汇。\n2. 意象运用：多用微观视角的折射（如：胶片的颗粒感、光线的灰尘、药水的酸味）。\n3. 韵律：不追求死板的通篇押韵，但要求每句末尾字具备朗读的沉淀感和适合人声演唱的开口度。"
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
| prompt | string | 是 | 提示词 |


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
    "texts": [
      "银盐暗房的最后下午",
      "[前奏]\n[主歌]\n显影液里的秘密，静静躺着，\n红灯下，没有被认领的二月。\n哭墙般的废底片，无声诉说，\n每一帧都是时间，定格的痕迹。\n\n[主歌]\n指尖沾上定影粉，触感冰凉，\n窗外北方初雪，将落未落。\n从微观到宏观，跨越时空，\n底片上的光影，穿越了寒风。\n\n[副歌]\n摄影是把瞬间，变成不朽，\n也是把活人，变成标本。\n在数字时代，我们留下，\n最后的道别，不朽的痕迹。\n\n[主歌]\n胶片上的颗粒，记录着岁月，\n光线中的灰尘，讲述着故事。\n药水的酸味，穿透了时光，\n在老式照相馆，定格了过往。\n\n[预副歌]\n就像电影镜头，突然拉远，\n冷眼看那些，未被取走的过往。\n宿命般的和解，无声无息，\n在冬雪前夜，留下了痕迹。\n\n[副歌]\n摄影是把瞬间，变成不朽，\n也是把活人，变成标本。\n在数字时代，我们留下，\n最后的道别，不朽的痕迹。"
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
| outputs.texts | array | 文本类输出结果。 |

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
    "texts": [
      "银盐暗房的最后下午",
      "[前奏]\n[主歌]\n显影液里的秘密，静静躺着，\n红灯下，没有被认领的二月。\n哭墙般的废底片，无声诉说，\n每一帧都是时间，定格的痕迹。\n\n[主歌]\n指尖沾上定影粉，触感冰凉，\n窗外北方初雪，将落未落。\n从微观到宏观，跨越时空，\n底片上的光影，穿越了寒风。\n\n[副歌]\n摄影是把瞬间，变成不朽，\n也是把活人，变成标本。\n在数字时代，我们留下，\n最后的道别，不朽的痕迹。\n\n[主歌]\n胶片上的颗粒，记录着岁月，\n光线中的灰尘，讲述着故事。\n药水的酸味，穿透了时光，\n在老式照相馆，定格了过往。\n\n[预副歌]\n就像电影镜头，突然拉远，\n冷眼看那些，未被取走的过往。\n宿命般的和解，无声无息，\n在冬雪前夜，留下了痕迹。\n\n[副歌]\n摄影是把瞬间，变成不朽，\n也是把活人，变成标本。\n在数字时代，我们留下，\n最后的道别，不朽的痕迹。"
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
