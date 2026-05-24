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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-fast-official/reference-to-video';
  const payload = {
    "prompt": "前10秒——黑白超现实漂浮世界： 画面以完全去饱和的黑白灰色调呈现，一片介于云层与星际之间的虚空空间，参考@天空视频与@红橙星际视频的空间结构与光影层次，但色彩全部抽离为黑白。 一头长着@翅膀图片中翅膀形态的猪，从画面左侧缓缓漂入——翅膀不扑闪，而是像昆虫标本一样张开固定，整个身体以极缓慢的速度在空中做不规则的微幅漂移，像失重的气球，又像被琥珀凝固的昆虫标本突然获得了生命。猪的身体表面隐约透出细密的昆虫翅脉纹路。 一只长着同款翅膀的狗从画面右上方漂入，姿态同样慵懒悬浮，四肢自然垂落，耳朵随微风极轻微地飘动，翅膀维持展开状态几乎不动，偶尔以极慢的频率扇动一次，产生涟漪般的空气扰动。 两者在画面中央区域相遇，互相以非常缓慢的速度绕对方旋转漂移，像两颗行星彼此引力牵引，既不靠近也不远离，维持一种奇异的平衡感。 空间中漂浮着大量与猪和狗等比例的奇异物体——巨型眼球、倒置的树、融化的时钟轮廓、几何晶体碎片，全部同样以极慢速度在背景中漂移，营造达利式超现实空间感。 镜头运动：极缓慢的环绕运镜，以两只动物为中心做宽幅弧线推进，如同摄影机本身也在失重漂浮。  第10秒——魔幻色彩转场： 从第9秒开始，画面边缘出现极细微的彩色光晕渗入，颜色参考@彩色画面图片的色彩基调，从四角向中心缓慢蔓延，如同黑白照片被彩色液体浸染。 第10秒整，色彩以一次无声的爆发瞬间涌遍全画——不是闪白，而是饱和度从零骤升至过饱和，参考@彩色画面图片的色调，整个空间被染成浓烈的魔幻色彩，猪和狗的翅膀在彩色光线下呈现出此前黑白状态下看不见的彩虹光泽与昆虫翅膀的金属光晕。 背景星际空间参考@红橙星际视频的橙红色调被完整激活，与@彩色画面图片的色彩叠加，形成从暖橙到冷紫的宏大色彩空间。 色彩转场后镜头缓缓向后拉远，两只动物在越来越宏大的彩色星际背景中变得越来越渺小，最终以星际全景收尾。 音频：多人声部低沉叠加的人声哼鸣，无任何歌词与语言，纯粹的共鸣泛音层层叠加，如同远处传来的古老吟唱回响，声音厚重绵长带有空间混响，前10秒音量极低隐约飘渺，色彩转场瞬间音量自然涌现增强，随后缓缓淡出消散在星际空间的寂静中，整体营造出神秘、古老、跨越时空的魔幻氛围。",
    "resolution": "720p",
    "duration": "15",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/IkOUUhABvgoGhusKndQejyQciMEXrthF.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/U2esT5DF8tmcDm0Ye8vUohYreA6X8kSh.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/JvSCC025w6t3HRfrDeaZYQQ4ROlhI8tl.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/Y8gvL8pODd7UYax3J5I4Z5qEMVPATlDR.jpg"
    ],
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/PVdgi4gffls1lDAjXWS3C8vHLLbewZv6.mp4",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/1G4kU0tbKyLJJ7RvEBjDMEeKXaweg7OZ.mp4"
    ],
    "audio_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/v7PpVDDB2WDdPnppXLZqvPs2USaJVAef.mp3"
    ],
    "generate_audio": true,
    "aspect_ratio": "16:9",
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
| prompt | string | 是 | 文本长度限制：1 - 20480<br/>文本长度限制: 1 - 20480 视频生成提示词 |
| resolution | string | 否 | ⟨bz_enum_json⟩["480p","720p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| duration | string | 否 | ⟨bz_enum_json⟩["auto","4","5","6","7","8","9","10","11","12","13","14","15"]⟨/bz_enum_json⟩<br/>视频时长（秒） |
| image_urls | array | 否 | 支持格式：jpeg、png、jpg、webp<br/>单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：9<br/>用于指导视频生成的参考图像。请在提示中分别使用 @Image1、@Image2 等引用它们。支持的格式：JPEG、PNG、WebP。每张图像最大 30 MB。最多可添加 9 张图像。所有格式的文件总数不得超过 12 个。 |
| video_urls | array | 否 | 支持格式：mp4、mov<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>图片最大总像素：927408<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>提供参考视频以指导视频生成。请在提示中分别使用 @Video1、@Video2 等引用这些参考视频。支持的格式：MP4、MOV。最多可上传 3 个视频，总时长必须在 2 到 15 秒之间，总大小不超过 50 MB。每个视频的分辨率必须在 480p (640x640) 到 720p (834x1112) 之间 |
| audio_urls | array | 否 | 支持格式：mp3、wav<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>用于指导视频生成的参考音频。请在提示中分别用 @Audio1、@Audio2 等方式引用它们。支持的格式：MP3、WAV。最多可上传 3 个文件，总时长不得超过 15 秒。每个文件最大 15 MB。如果提供音频，则至少需要一张参考图像或视频。 |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["auto","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |

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
      "https://storage.bizyair.cn/outputs/UwLYJtPs8VshncPV.mp4"
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