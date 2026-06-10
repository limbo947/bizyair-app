## 二. 提交请求

您现在可以提交 API 请求了。

### 1. 请求示例

请您复制代码块中的代码，

并将 `${BIZYAIR_API_KEY}` **替换为您自己的** **API Key** 后运行。

在这之前，您可以对代码块中的参数部分进行调整，以精准生成您所需要的内容。

注意：参数设置的格式与要求，请严格参考 **【2. 请求参数说明】**。

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/ace-step/text-to-audio';
  const payload = {
    "lyrics": "[Intro - Guitar Riff & Drums]\nmm…\nyeah…\nlet it breathe…\n\n[Verse 1]\nLate night glow on your skin\nWindow cracked, city hums again\nCoffee rings on the table top\nTime don’t rush, it just drops\n\nLoose kick drum, heart runs slow\nSnare talks back, says \"take it low\"\nEvery step just slightly late\nStill we land right on the faith\n\n[Verse]\nYour laugh swings behind the beat\nBarefoot dancing on the street\nNothing polished, nothing tight\nFeels more real that way tonight\n\nBrush those hats, let them slide\nLeave some space where truth can hide\nIf it falls, let it fall\nThat’s the soul inside it all\n\n[Pre-Chorus]\nNo count-in for this kind of love\nWe don’t line it up\nWe just lean and trust\n\n[Chorus]\nStay right there, don’t pull it straight\nI love how we arrive late\nOff the grid but locked in time\nThat lazy swing feels like mine\n\nYeah we bend, we drift, we sway\nLet tomorrow wait its turn today\nIf love lives just off the line\nSoft kick drum, your hand in mine\n\n[Verse]\nVinyl spins, the room exhales\nEvery scar tells its tale\nYour voice cracks, but I don’t care\nThat’s the truth living in there\n\nHeartbeat talks through wood and wire\nLow-end warmth, a quiet fire\nNothing perfect, nothing clean\nStill the best thing I’ve ever seen\n\n[Bridge]\nBrush it light, let it breathe\nLeave a little space for me\nEvery miss is part of it\nThat’s how soul was always meant\n\nBehind the beat, but dead-on true\nEvery swing just sounds like you\nIf the night don’t find a end\nI’ll stay right here, count me in\n\n[Chorus]\nStay right there, don’t pull it straight\nI love how we arrive late\nOff the grid but locked in time\nThat lazy swing feels like mine\n\nYeah we bend, we drift, we sway\nLet tomorrow wait its turn today\nIf love lives just off the line\nSoft kick drum, your hand in mine\n\n[Outro - Guitar Riff & Final Chord]\nno rush…\nno rush…\njust groove…",
    "tags": "lofi, hiphop, drum and bass, trap, chill",
    "duration": 30,
    "seed": 4
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

如果您在提交时为请求添加了header "X-Bizyair-Task-WebHook-Url": `https://your-website/webhook`，那么此任务将采用异步回调模式。当任务结束时，BizyAir 会主动向您的 URL 发送 POST 请求，给出任务结果。例如：

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/ace-step/text-to-audio';
  const payload = {
    "lyrics": "[Intro - Guitar Riff & Drums]\nmm…\nyeah…\nlet it breathe…\n\n[Verse 1]\nLate night glow on your skin\nWindow cracked, city hums again\nCoffee rings on the table top\nTime don’t rush, it just drops\n\nLoose kick drum, heart runs slow\nSnare talks back, says \"take it low\"\nEvery step just slightly late\nStill we land right on the faith\n\n[Verse]\nYour laugh swings behind the beat\nBarefoot dancing on the street\nNothing polished, nothing tight\nFeels more real that way tonight\n\nBrush those hats, let them slide\nLeave some space where truth can hide\nIf it falls, let it fall\nThat’s the soul inside it all\n\n[Pre-Chorus]\nNo count-in for this kind of love\nWe don’t line it up\nWe just lean and trust\n\n[Chorus]\nStay right there, don’t pull it straight\nI love how we arrive late\nOff the grid but locked in time\nThat lazy swing feels like mine\n\nYeah we bend, we drift, we sway\nLet tomorrow wait its turn today\nIf love lives just off the line\nSoft kick drum, your hand in mine\n\n[Verse]\nVinyl spins, the room exhales\nEvery scar tells its tale\nYour voice cracks, but I don’t care\nThat’s the truth living in there\n\nHeartbeat talks through wood and wire\nLow-end warmth, a quiet fire\nNothing perfect, nothing clean\nStill the best thing I’ve ever seen\n\n[Bridge]\nBrush it light, let it breathe\nLeave a little space for me\nEvery miss is part of it\nThat’s how soul was always meant\n\nBehind the beat, but dead-on true\nEvery swing just sounds like you\nIf the night don’t find a end\nI’ll stay right here, count me in\n\n[Chorus]\nStay right there, don’t pull it straight\nI love how we arrive late\nOff the grid but locked in time\nThat lazy swing feels like mine\n\nYeah we bend, we drift, we sway\nLet tomorrow wait its turn today\nIf love lives just off the line\nSoft kick drum, your hand in mine\n\n[Outro - Guitar Riff & Final Chord]\nno rush…\nno rush…\njust groove…",
    "tags": "lofi, hiphop, drum and bass, trap, chill",
    "duration": 30,
    "seed": 4
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${BIZYAIR_API_KEY}',
        'X-Bizyair-Task-WebHook-Url': '${YOUR_WEBHOOK_URL}',
        'X-Bizyair-Task-Authorization': '${YOUR_WEBHOOK_AUTHORIZATION}',
        'X-Bizyair-Task-Test': '${YOUR_WEBHOOK_REQUIRED_HEADER}'
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

异步回调模式下，请求体的参数与同步模式没有区别。需要注意的是请求头：

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| X-Bizyair-Task-WebHook-Url | string | 是 | 为任务结束后的回调接口地址，如果不设置则采用同步模式，需要https或http，接口应为POST请求。若回调地址在海外，BizyAir 不保证回调成功，请悉知。 |
| X-Bizyair-Task-Authorization | string | 否 | 如回调接口带有授权，请将授权凭据写在这里，回调时会附带在请求头中，如：Authorization：${YOUR_WEBHOOK_AUTHORIZATION}。 |
| X-Bizyair-Task-${HEADER_NAME} | string | 否 | 所有以X-Bizyair-Task-开头的请求头，会在回调时原样不动包含在请求头中 |

### 2. 请求参数说明

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| lyrics | string | 是 | 歌词 |
| tags | string | 否 | 风格标签 |
| duration | number | 否 | 取值范围：10 ~ 300<br/>音乐时长(秒) |
| seed | number | 否 | 取值范围：1 ~ 2147483647<br/>种子 |

> 为保护您的业务敏感信息（如 prompt 设计等），我们支持对 API 调用记录中的指定字段进行脱敏处理。脱敏后的字段在查询调用记录时将显示为 `[调用方要求隐藏]`，但不影响实际请求的执行和计费准确性。
>
> **使用方法**：在请求头中携带 `X-BizyAir-Log-Mask-Fields`，指定需要脱敏的字段，多个字段用英文逗号分隔。
>
> ```http
> Content-Type: application/json
> Authorization: Bearer ${BIZYAIR_API_KEY}
> X-BizyAir-Log-Mask-Fields: prompt, image_urls
> ```

### 3. 响应示例

在成功提交请求后，您会收到类似的信息反馈。

这是一个**异步任务提交的成功回执**，作用是告诉你：“请求已接收，任务正在排队执行中”。

如果您收到了其他的信息反馈，可以结合下文【**4. 响应字段说明**】进一步了解详情。

```json
{
  "request_id": "4569bb94-1d30-417a-a987-9715de1e2633"
}
```

### 4. 响应字段说明

您可以阅读下方的【**响应字段说明**】，了解各字段含义与取值说明。

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |

## 三. 查询结果

在这个阶段，您可以通过刚才产生的**任务单号（request_id）**，去主动查询任务是否完成，以及获取最终结果。

### 1. 请求示例

请您分别将下方的 `${BIZYAIR_API_KEY}`、`${REQUEST_ID}`，

更换成您的 **API Key** 以及您的**任务单号（request_id）**，

这样可以为您提供任务最新状态，包括是否成功以及结果资源地址。

```javascript
async function queryTaskStatus(requestId) {
  const url = `https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/${requestId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ${BIZYAIR_API_KEY}'
      }
    });

    const result = await response.json();
    console.log('Task Status:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

queryTaskStatus('${REQUEST_ID}');
```

### 2. 响应示例

这是一个通过调用 **BizyAir 查询接口**，在任务生成完成、成功生成内容之后，服务器最终返回的结果回执。

也是整个 AI 生图流程的【**最终结果**】。通过浏览这段信息，您可以了解到上述所有操作的最终结果。

如果您收到了其他的信息反馈，可以结合下文【**3. 响应字段说明**】进一步了解详情。

```json
{
  "request_id": "4569bb94-1d30-417a-a987-9715de1e2633",
  "status": "Success",
  "message": null,
  "executed_at": "2026-04-15 13:32:32",
  "ended_at": "2026-04-15 13:42:32",
  "outputs": {}
}
```

### 3. 响应字段说明

您可以阅读下方的【**响应字段说明**】，了解各字段含义与取值说明。

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |
| status | string | 任务状态，可能的值为：Pending（排队中）、Running（运行中）、Saving（转存中）、Success（完成）、Failed（失败）。 |
| message | string | 任务状态为 Failed 时，错误的具体信息。 |
| executed_at | string | 任务开始运行的时间。 |
| ended_at | string | 当任务成功或失败时，任务结束的时间。 |
| outputs | array | 生成结果（非“完成”状态时，为null或[]）。 |

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
  "outputs": {},
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
