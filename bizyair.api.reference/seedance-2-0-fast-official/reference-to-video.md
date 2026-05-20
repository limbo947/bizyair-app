---
display_name: "Seedance-2.0.Fast-参考生视频-官方版"
category: "Reference to Video"
manufacturer: "字节"
price: "无参考视频 80金币/M Tokens; 有参考视频 80 * 0.6/M Tokens;"
price_url: "https://bizyair.cn/modelzoo/seedance-2-0-fast-official/reference-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  Seedance 2.0 Fast 官方版参考生视频模式支持在较低延迟下调用多模态素材进行创作，在处理高并发企业级创意任务时服务稳定性更有保障，适合规模化视频内容的批量生产场景。
tags: ["Seedance"]
---

# Seedance-2.0.Fast-参考生视频-官方版

> **参考生视频** | 厂商: 字节 | 模型: `seedance-2-0-fast-official` | 类型: `reference-to-video`

Seedance 2.0 Fast 官方版参考生视频模式支持在较低延迟下调用多模态素材进行创作，在处理高并发企业级创意任务时服务稳定性更有保障，适合规模化视频内容的批量生产场景。

💰 **价格**: 无参考视频 80金币/M Tokens; 有参考视频 80 * 0.6/M Tokens;  [查看详情](https://bizyair.cn/modelzoo/seedance-2-0-fast-official/reference-to-video?tab=price)

> 公共内容请参阅 [common.md](../common.md)

## 二. 提交请求


> _preamble — 与公共文档一致，详见 [common.md](../common.md)


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


> ### 3. 响应示例 — 与公共文档一致，详见 [common.md](../common.md)


> ### 4. 响应字段说明 — 与公共文档一致，详见 [common.md](../common.md)


## 三. 查询结果


> _preamble — 与公共文档一致，详见 [common.md](../common.md)


> ### 1. 请求示例 — 与公共文档一致，详见 [common.md](../common.md)


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
