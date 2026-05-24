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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-vision-g3-1-pro-official/vision';
  const payload = {
    "system_prompt": "你是一个能分析图像的AI助手。请仔细观察图像，并根据用户的问题提供详细、准确的描述。",
    "user_prompt": "请描述这张图片的内容，并指出任何有趣或不寻常的细节。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/l2MTRmrinWx52z0fBlON2I6XICAO0YBK.png?uploads="
    ],
    "max_tokens": 32768,
    "temperature": 1,
    "detail": "high",
    "enable_thinking": false
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
| system_prompt | string | 是 | 文本长度限制：1 - 5000<br/>系统提示词。 |
| user_prompt | string | 是 | 文本长度限制：1 - 2500<br/>用户提示词。 |
| image_urls | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：900<br/>输入图片，最多900张。 |
| max_tokens | number | 是 | 取值范围：1 ~ 65536<br/>生成文本的最大长度，单位为 token。 |
| temperature | number | 是 | 取值范围：0 ~ 2<br/>步进：0.01<br/>采样温度，值越大生成结果越随机。 |
| detail | string | 是 | ⟨bz_enum_json⟩["low","medium","high"]⟨/bz_enum_json⟩<br/>图片细节级别。 |
| enable_thinking | boolean | 是 | 如果模型支持思考模式，是否开启。 |

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
    "texts": [
      "这是一张极其壮观且极具电影感的非洲大草原风景图。以下是对图片内容的详细描述以及一些有趣的细节观察：\n\n### 画面主要内容：\n\n1.  **整体环境与光影**：\n    *   **时间/天气**：画面呈现出日出或日落时的“黄金时刻”（Golden Hour）。阳光柔和而温暖，透过云层洒下，给整个大草原镀上了一层金黄色的光晕。\n    *   **地貌**：广袤的草原上长满了一人高的干枯黄草。中景处散落着几棵标志性的非洲金合欢树（平顶树）。背景中隐约可见连绵起伏的山脉。\n    *   **氛围**：画面中弥漫着大量的尘土（主要由奔跑的动物扬起），在阳光的照射下形成了朦胧的丁达尔效应（耶稣光），增加了画面的神秘感和史诗感。\n\n2.  **动物群落**：\n    *   **斑马**：在画面的左侧和中左侧，有一群斑马正在小跑或奔跑。它们整齐的黑白条纹在柔和的光线下非常清晰，扬起的尘土增强了动态感。\n    *   **长颈鹿**：画面中后方聚集着多只长颈鹿。它们体型各异，有成年长颈鹿也有幼崽。有些长颈鹿正聚集在树下，似乎在进食或休息。\n    *   **大象**：在画面的右侧，有一群非洲象正在缓步前行。最前面是一头巨大的成年象，紧跟其后的是一头小象，后方还有其他成年象，甚至在更远的尘土中也能看到大象的轮廓。\n    *   **羚羊**：在画面的右下方前景处，有三只羚羊（看起来像黑尾牛羚或高角羚）正处于腾空跳跃的状态，姿态非常轻盈动感。\n\n### 有趣或不寻常的细节：\n\n1.  **“完美得不真实”的构图（极大可能是AI生成或高度合成图像）**：\n    *   **不寻常之处**：在真实的野生动物摄影中，极难在同一个画面、同一个焦平面内，以如此完美的构图同时捕捉到大象、长颈鹿、斑马和跳跃羚羊这四种代表性动物，且每一种动物都展现出其最经典的姿态（斑马奔跑、羚羊腾空、长颈鹿吃树叶、大象结伴前行）。\n    *   **光影的完美性**：光线和扬尘的分布非常均匀且具有极高的艺术戏剧性，这通常是数字艺术（Digital Art）或AI图像生成的特征，旨在呈现一个“理想化”的非洲大草原乌托邦，而不是一张自然纪实照片。\n2.  **跨物种的和谐与动静结合**：\n    *   画面巧妙地结合了“动”与“静”。左侧的斑马和前景的羚羊展现出强烈的运动感（奔跑、跳跃）；而中景的长颈鹿和右侧的大象则显得相对缓慢和宁静。不同物种在同一个空间内和谐共处，没有表现出捕食或惊慌的状态（虽然斑马和羚羊在跑，但看起来更像是在迁徙或移动，而非逃命）。\n3.  **小动物的细节**：\n    *   仔细观察左侧第二只长颈鹿旁边，有一只非常小的长颈鹿幼崽；右侧大象群中也有一头被成年象保护在身侧的小象。这些细节增加了画面的温情元素。"
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
| outputs.texts | array | 文本类输出结果。 |

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