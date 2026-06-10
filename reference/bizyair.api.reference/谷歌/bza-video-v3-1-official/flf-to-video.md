> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。



## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-v3-1-official/flf-to-video';
  const payload = {
    "first_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260607/4QYulgFr80u5jnPGZZnYafAKh0RyyMdm.jpg"
    ],
    "last_frame_url": [],
    "prompt": "The pigeon blinks its intelligent dark eye, tilting its head slightly toward the camera. It suddenly spreads its wings and launches into the air with a sharp flap, scattering a few loose feathers into the foreground. The camera fast-pans upward, tracking the bird as it soars into the bright, sunny sky above a bustling city square.",
    "negative_prompt": "",
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "duration": 4,
    "generate_audio": true,
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
| X-Bizyair-Task-WebHook-Url | string | 是 | 为任务结束后的回调接口地址，如果不设置则采用同步模式，需要https或http，接口应为POST请求。若回调地址在海外，BizyAir 不保证回调成功，请悉知。 |
| X-Bizyair-Task-Authorization | string | 否 | 如回调接口带有授权，请将授权凭据写在这里，回调时会附带在请求头中，如：Authorization：${YOUR_WEBHOOK_AUTHORIZATION}。 |
| X-Bizyair-Task-${HEADER_NAME} | string | 否 | 所有以X-Bizyair-Task-开头的请求头，会在回调时原样不动包含在请求头中 |

### 2. 请求参数说明

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| first_frame_url | array | 是 | 首帧图片 |
| last_frame_url | array | 否 | 尾帧图片 |
| prompt | string | 是 | 提示词 |
| negative_prompt | string | 否 | 反向提示词 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>宽高比 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>分辨率 |
| duration | number | 是 | ⟨bz_enum_json⟩["4","6","8"]⟨/bz_enum_json⟩<br/>视频时长 |
| generate_audio | boolean | 是 | 音频 |
| seed | number | 否 | 种子 |


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
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/outputs/5710e835-e1a1-41a1-9f21-e5f352be7850.mp4"
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
    "videos": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/outputs/5710e835-e1a1-41a1-9f21-e5f352be7850.mp4"
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
