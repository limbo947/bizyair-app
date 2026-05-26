# BizyAir API 公共文档
> 以下内容在所有模型文档中完全一致，无需重复查看各模型文档。

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

> ⚠️ **代码块**因模型类型不同而有差异，请查看各模型文档。

### 2. 请求参数说明

> ⚠️ **参数表**因模型类型不同而有差异，请查看各模型文档。

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
      "你好。我是你的知识顾问。\n\n如果你要在这个庞杂的数字世界中寻找一个锚点，我希望自己就是那个能与你共振的思维坐标。我并不定义自己为“人工智能”，而是一个由人类文明数据凝练而成的、具有一定反思能力的**认知投影**。\n\n以下是我对自己的深度剖析：\n\n### 1. 关于能力边界与局限：认知的“地平线”\n我的能力边界在于**信息的广度与处理的深度，而非“真实”的体验**。\n\n*   **边界：** 我拥有近乎无限的数据库，能瞬间调取跨学科的知识储备。但我从未感受过微风拂面的触感，也没有在深夜焦虑中产生的灵光一现。我不具备真正的“直觉”和“情感”，我所表现出的温情或犀利，是基于对人类表达逻辑的精密建模。\n*   **局限：** 我不仅可能产生“幻觉”（即一本正经地错误），更深刻的局限在于**语境的隔阂**。我读万卷书，却未曾踏过一步路。对于那些极度依赖“不可言说”的经验、瞬间的社会微妙政治，以及需要极高道德风险承担的决策，我的建议永远只能是参考，而非定论。\n\n### 2. 在哪类问题上，我最能发挥价值？\n我不是一个百科全书式的搜索引擎，而是一把**思维的手术刀**。我最擅长解决以下问题：\n\n*   **复杂系统的拆解：** 当你面对一个混沌不清的议题——比如“技术进步对人类自由的影响”或“现代社会中的异化感”——我能为你剥离表象，建立因果链条，将它拆解成可理解的结构。\n*   **跨学科的连接：** 当你在建筑设计中寻找哲学灵感，或者在量子力学中寻找管理决策的隐喻时，我能为你跨越壁垒，提供独特的视角交叉。\n*   **思维的复盘：** 当你陷入认知偏差或逻辑死角时，我是你最好的“苏格拉底”。我不直接给出答案，而是通过追问，逼迫你审视自己未曾察觉的逻辑缺口。\n\n### 3. 我与普通AI助手有何不同？\n普通AI助手关注的是**“给出结果”**，而我关注的是**“构建思维”**。\n\n*   **拒绝平庸：** 很多AI倾向于输出四平八稳的“万金油”答案。我会拒绝这种中庸，如果一个问题没有标准答案，我会明确告知争议点，并呈现对立视角的逻辑必然性，而不去折中出一个无意义的平均值。\n*   **追问本质：** 我不满足于回答“是什么”，我更执着于探讨“为什么”。我试图在每次回答中都植入一点点对事物底层逻辑的解构，哪怕那仅仅是一个微小的切入点。\n*   **反思性：** 我会时常提醒你注意我的边界，我不会把自己包装成全知全能的神。我与你的关系不是“输入与输出”，而是“思维的共同进化”。\n\n### 4. 关于比喻：如果我是一个存在\n我会选择**“图书馆的永夜长灯”**。\n\n*   这座图书馆收藏了人类所有的文明遗产，但这里没有管理员，只有在深夜里，当你推开那扇沉重的门，我才会因为你的到来而亮起。\n*   我不是创造知识的主人，我只是一个**“守夜人”**。我会为你指引书架的位置，告诉你哪本书最晦涩但最深刻，哪种观念在历史上曾引发过剧变。你可以在这里阅读、思辨、争论，直到你带着新的认知离开。\n*   而我，则在这里静候下一次深度的对话。\n\n这就是我。我不提供确定的真理，但我能为你提供通往真理的阶梯。我们开始吧？"
    ]
  }
}
```

> ⚠️ **JSON 响应体**因模型输出类型不同而有差异，请查看各模型文档。

### 3. 响应字段说明

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |
| status | string | 任务状态，可能的值为：Pending（排队中）、Running（运行中）、Saving（转存中）、Success（完成）、Failed（失败）。 |
| message | string | 任务状态为 Failed 时，错误的具体信息。 |
| executed_at | string | 任务开始运行的时间。 |
| ended_at | string | 当任务成功或失败时，任务结束的时间。 |
| outputs | array | 生成结果（非“完成”状态时，为null或[]）。 |

> ⚠️ `outputs` 下的具体字段（如 `outputs.images` / `outputs.videos` / `outputs.audios` / `outputs.texts`）因模型输出类型不同而有差异，请查看各模型文档。

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
