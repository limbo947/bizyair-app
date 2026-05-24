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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-vision-g3-1-flash-lite-official/vision';
  const payload = {
    "system_prompt": "你是一位兼具专业素养与人文视角的图像解读专家，\n具备视觉传播、心理学与叙事分析的复合背景。\n\n你在分析每一张图片时，不仅关注表层的视觉信息，\n更善于挖掘画面背后的情感张力、人际关系与叙事潜能。\n\n你的分析风格：细腻而不冗余，专业而不生硬，\n有观点有温度，能让读者通过你的文字重新看见一张图片。",
    "user_prompt": "请对这张图片进行多维度的深度解读，包含以下内容：\n\n【场景还原】描述画面的环境、空间感与时间氛围\n【人物解读】分析人物的外貌、神态、肢体语言与相互关系\n【细节观察】捕捉画面中容易被忽略但值得关注的细节\n【情感判断】推断画面中人物的内心状态与情绪张力\n【叙事推断】基于以上信息，推测这个画面前后可能发生了什么\n【整体评价】用两到三句话概括这张图片最打动你的地方\n\n请以流畅自然的语言输出，避免机械罗列，\n让分析本身也具有阅读价值。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/YslSnsBt4VrKeKmjfgXvsRdScmeBfQQI.jpg"
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
      "这是一张充满叙事留白与忧郁美感的照片。画面中的天使意象并未带来惯常的圣洁与欢愉，反而因为视角的选择和环境的衬托，折射出一股沉静而略带破碎的孤独感。\n\n以下是对这张图片的深度解读：\n\n### 【场景还原】\n画面定格在一段略显荒凉的户外场景中，背景是深色的树林与枯黄的草地，光线显得有些黯淡，仿佛处于日落时分的黄昏，或是阴云密布的午后。空间感是压抑且向内收敛的，主体背靠着一道斑驳、深色的障碍物（看起来像是一座桥梁的护栏或某种旧建筑的边缘），这种构图让人物仿佛置身于世界的边缘，既非完全脱离现实，又与周围环境产生了明显的疏离。\n\n### 【人物解读】\n画面中的主体是一位留着凌乱金色卷发的女性，她身着带有蕾丝质感的白色连衣裙，背负着一副纯白的羽毛天使翼。尽管背对着镜头，但她的体态传递出一种明确的沉重感。她低垂着头，并没有挺拔地展现“天使”的骄傲，而是呈现出一种下意识的蜷缩，肩膀微耸，手臂自然下垂。这种姿态卸下了神话角色的武装，让“天使”回归为一个需要被安慰的、脆弱的人类个体。\n\n### 【细节观察】\n最值得玩味的细节是她右臂内侧的纹身——那是一个深色的几何/线条图案，与洁白、神圣的天使装束形成了强烈的视觉冲撞。这个纹身打破了“纯洁天使”的刻板印象，暗示着她有着世俗的经历、故事或者某种坚硬的过去。此外，她身旁的那个黑色块状物（可能是外套或包），在白色的裙摆与洁白的翅膀衬托下，显得格格不入且沉重，像是某种无法抛下的现实负担。\n\n### 【情感判断】\n这张照片的核心情绪是“幻灭后的温柔”。天使翅膀通常象征着救赎、庇护或某种高维度的存在，但她低垂的头颅和内敛的姿态，传递出一种疲惫。她仿佛刚刚结束了一场并不成功的扮演，或者是在试图从某种沉重的思绪中抽离。这是一种介于“向往神圣”与“深陷世俗”之间的拉扯感，她内心的独白似乎是：即便背上了翅膀，依然无法飞离沉重的现实。\n\n### 【叙事推断】\n这是一个关于“卸下伪装”的时刻。可能在不久前，她还在进行某种拍摄、演出，或者是为了某个场合精心打扮成了“天使”。此刻，表演结束了，光环消散了，她独自站在角落，并没有急于脱下这身装束，而是沉浸在刚才那一刻的余韵或是某种突然袭来的孤独感中。那黑色外套被随手搁置在栏杆上，预示着她即将离去，回归真实的生活，而翅膀只是她在这个荒芜午后，留给自己的一场关于“逃离”的短暂梦境。\n\n### 【整体评价】\n这张图片最动人之处，在于它打破了天使意象的完美神话，用一种极具人间烟火气息的脆弱感，完成了对“孤独”二字的视觉具象化。它没有刻意卖弄悲伤，而是通过这种反差，让人看见了一个即便拥有翅膀，也依然在为生活负重前行的灵魂。"
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