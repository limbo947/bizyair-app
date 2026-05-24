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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/happyhorse-1-0-official/text-to-video';
  const payload = {
    "prompt": "深海发光生物，拖着细长的生物荧光尾迹，无声漂过镜头前方，随即消失在黑暗中。镜头开始极缓慢地向前推进。一座巨大的深海热泉烟囱群逐渐从黑暗中浮现——高达数十米的黑色岩柱从海床耸立而起，顶部喷涌着滚烫的黑色热液，与冰冷的海水相遇后急速扩散，形成翻腾的黑色烟雾柱，在微弱的蓝色环境光中缓慢上升蔓延。烟囱底部密密麻麻附着着雪白的管虫群落，随着热液水流轻微摆动，像一片倒置的麦田。几只通体透明的虾在烟囱壁上缓慢爬行，内脏隐约可见。一条细长的银色鱼从镜头前方无声游过，身体两侧的发光器官发出规律性的冷白色脉冲。镜头继续推进，绕过最高的烟囱缓缓侧移，视野之外的黑暗深处，一个巨大的轮廓正在极其缓慢地移动——体型庞大，边缘模糊，看不清形态，只有轮廓边缘偶尔透出隐约的生物荧光纹路，随即再度沉入黑暗，消失不见。镜头停在热泉群的全景，俯仰之间尽是黑暗与微光的交织。海床上薄薄一层白色细菌席绵延至视野尽头，几朵巨大的深海水母无声漂过中景，伞盖边缘的触须拖出长长的荧光丝线。一切都在极度缓慢地运动，安静得像另一个宇宙。全程一镜到底，镜头运动极缓，如同潜水艇在深海中无声巡游。水体折射与散射效果真实，微粒悬浮物在镜头光线中清晰可见，生物荧光在完全黑暗背景下发光效果细腻真实，热液烟雾的流体动力学自然准确。音频：几乎无声的深海底噪为基底，极低频的压力感嗡鸣，偶尔热液喷涌的细微水流声，远处不明生物低沉绵长的声波震动，以及一段极简的单音符弦乐，音符与音符之间间隔极长，营造出深不见底的孤寂感。超真实，BBC深海纪录片画质，参考《蓝色星球II》深海章节视觉风格，生物细节极度精准，水体光学效果电影级，色调以极深的靛蓝与墨黑为主，荧光生物的冷蓝白绿色为唯一光源，4K质感。",
    "resolution": "1080P",
    "ratio": "16:9",
    "duration": 5,
    "watermark": true,
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

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>视频生成提示词 |
| resolution | string | 否 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>生成视频分辨率，可选 720P 或 1080P；默认 1080P。 |
| ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1","4:3","3:4","4:5","5:4"]⟨/bz_enum_json⟩<br/>视频宽高比；默认 16:9。 |
| duration | number | 否 | 取值范围：3 ~ 15<br/>视频时长，单位秒，取值范围 3-15；默认 5。 |
| watermark | boolean | 否 | 是否添加 Happy Horse 水印；默认添加。 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>随机种子范围 0-2147483647；当前默认值 -1 表示由系统自动生成。 |

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
    "videos": [
      "https://storage.bizyair.cn/outputs/ccUYLMHWFYIR7gyZ.mp4"
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
| outputs.videos | array | 视频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |

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