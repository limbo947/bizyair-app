## 一. 开始使用

欢迎使用 Bizyair API，基于这份说明，您可以轻松调用 Bizyair 标准模型API。

### 1. 注册用户

请登陆或注册您的bizyair账号，并确保拥有一定的金币，以免运行扣费失败。

请注意，**标准模型API只能使用金币。**

### 2. 获取您的 API Key

每位用户都拥有Bizyair所提供的一个独特的 48 位 **API Key**，

您可以将光标移动至右上角用户头像处，点击【API密钥】获取您的专属密钥，

**请妥善保存您的 API Key**，它将参与接下来的每一步操作。

## 二. 提交请求

您现在可以提交 API 请求了。

### 1. 请求示例

请您复制代码块中的代码，

并将 `${BIZYAIR_API_KEY}` **替换为您自己的** **API Key** 后运行。

在这之前，您可以对代码块中的参数部分进行调整，以精准生成您所需要的内容。

注意：参数设置的格式与要求，请严格参考 **【2. 请求参数说明】**。

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/z-image-turbo/text-to-image';
  const payload = {
    "prompt": "This is a high-quality photograph of a bright red Ford Bronco SUV with a modern design. The vehicle is positioned in the center of the image, facing slightly to the left, with a three-quarter view of the front and right side. The SUV features a black grille with the Ford logo in the center, angular LED headlights with a sleek design, and a black front bumper with a license plate that reads \"BIZYAIR.\" The vehicle‘s side mirrors and door handles are black, and the wheels have a black design with silver accents. The background is a gradient of pink and white, creating a vibrant and dynamic atmosphere. The lighting highlights the shiny finish of the red paint, giving the vehicle a polished appearance. The surface on which the SUV is placed appears to be smooth and reflective, adding to the modern aesthetic. The overall composition of the image emphasizes the sleek and stylish design of the Ford Bronco, with a focus on its bold color and contemporary features.",
    "negative_prompt": "",
    "batch_size": 1,
    "seed": -1,
    "height": 1024,
    "width": 1024
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

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |
| negative_prompt | string | 否 | 文本长度限制：1 - 2500<br/>负向提示词 |
| batch_size | number | 是 | 取值范围：1 ~ 4<br/>生成数量 |
| seed | number | 否 | 取值范围：1 ~ 2147483647<br/>种子 |
| height | number | 否 | 取值范围：256 ~ 2048<br/>图片高度 |
| width | number | 否 | 取值范围：256 ~ 2048<br/>图像宽度 |

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
  "outputs": {
    "images": [
      "https://storage.bizyair.cn/outputs/3t2fo7ejznai6_e44c85972874a95e5f46b1a99e163751_image_aa1b00a2_00001_.png"
    ]
  }
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
| outputs.images | array | 图片类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |

## 四. 文件上传

这项操作用于资源上传，支持上传图片、音频、视频等资源至 BizyAir 服务器。

上传后的文件将可以作为输入资源使用到您运行的任务当中。

### 1. 获取上传凭证与参数
调用获取上传凭证接口，服务端会返回本次上传所需的 OSS 信息与临时 STS 凭证。

```javascript
async function getUploadToken() {
  const params = new URLSearchParams({
    file_name: 'example.webp',
    file_type: 'inputs'
  });
  const url = `https://api.bizyair.cn/x/v1/upload/token?${params}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ${BIZYAIR_API_KEY}'
      }
    });
    const result = await response.json();
    console.log('Upload Token:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

getUploadToken();
```

### 2. 使用 阿里云 OSS 简单上传

使用上一步返回的 `endpoint`、`bucket`、`region`、`object_key` 与 STS 凭证将本地文件上传到 OSS。更详细信息参考：[阿里云 OSS 简单上传](https://help.aliyun.com/zh/oss/user-guide/simple-upload)、[BizyAir 上传教程](https://docs.bizyair.cn/api/upload-tutorial.html#oss)。

```javascript
const OSS = require('ali-oss');

async function uploadToOSS(region, bucket, accessKeyId, accessKeySecret, securityToken, objectKey, filePath) {
  const client = new OSS({
    region: region,
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    stsToken: securityToken,
    bucket: bucket
  });
  return await client.put(objectKey, filePath);
}
```

注意：

- 有些 SDK 需要去掉 `region` 的 `oss-` 前缀，如 `oss-cn-shanghai` → `cn-shanghai`。
- 建议同时设置 `region` 与 `endpoint`，以返回的 `endpoint` 为准。

### 3. 提交输入资源
当 OSS 上传成功后，提交本次输入资源，便于后续任务直接引用。

```javascript
async function commitResource() {
  const url = 'https://api.bizyair.cn/x/v1/input_resource/commit';
  const payload = {
    name: 'example.webp',
    object_key: 'inputs/20250911/abc123.webp'
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
    console.log('Commit Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

commitResource();
```

### 4. 查询 inputs 列表（可选）

这项操作可以查询您的查询 inputs 列表，

您可以这样校验上传的内容。

```javascript
async function listInputs() {
  const params = new URLSearchParams({ current: '1', page_size: '20' });
  const url = `https://api.bizyair.cn/x/v1/input_resource?${params}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ${BIZYAIR_API_KEY}'
      }
    });
    const result = await response.json();
    console.log('Inputs List:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

listInputs();
```