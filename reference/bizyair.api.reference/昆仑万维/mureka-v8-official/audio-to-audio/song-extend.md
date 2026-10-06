> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。



## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/mureka-v8-official/audio-to-audio/song-extend';
  const payload = {
    "extend_type": "tail",
    "extend_at": 8000,
    "lyrics": "《风经过的地方》\n\n【Verse 1】\n夜色慢慢落在窗台上\n旧照片还留着你的光\n我把没说完的话\n藏进风吹过的地方\n\n街灯拉长孤单的影子\n像回忆不肯轻易停止\n那些走散的日子\n还在心里轻轻响起\n\n【Pre-Chorus】\n如果时间能回头\n我会握紧你的手\n不让沉默替我说出口\n\n【Chorus】\n风经过的地方\n有我想你的模样\n月光落在心上\n照不亮你的方向\n\n我还站在原地望\n等一场温柔回响\n就算人海太匆忙\n也记得你来过我身旁\n\n【Verse 2】\n后来我学会一个人走\n把遗憾写进每个深秋\n",
    "audio_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260528/DueLnVnRwhYPqnRvk96412yqNWVkQcLQ.mp3"
    ]
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
| extend_type | string | 否 | ⟨bz_enum_json⟩["tail","head"]⟨/bz_enum_json⟩<br/>歌曲续写的方向 |
| extend_at | number | 是 | 取值范围：8000 ~ 420000<br/>续写开始时间，单位毫秒。如果大于歌曲的时长，则取歌曲的时长 |
| lyrics | string | 是 | 续写的歌词 |
| audio_urls | array | 是 | 支持格式：mp3、m4a<br/>最多上传数量：1<br/>要续写的歌曲 |


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
      "https://storage.bizyair.cn/outputs_examples/b4a66287-1947-4dfd-b243-9cdb2021358c.mp3"
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
      "https://storage.bizyair.cn/outputs_examples/b4a66287-1947-4dfd-b243-9cdb2021358c.mp3"
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
