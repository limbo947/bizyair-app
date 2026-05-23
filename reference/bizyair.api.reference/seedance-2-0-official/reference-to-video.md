---
display_name: "Seedance-2.0-参考生视频-官方版"
category: "Reference to Video"
manufacturer: "字节"
price: "无参考视频 98金币/M Tokens; 有参考视频 98 * 0.6/M Tokens;"
price_url: "https://bizyair.cn/modelzoo/seedance-2-0-official/reference-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  Seedance 2.0系列中官方推荐的组合参考模式。该版本在提取多模态素材（人物形象、场景画风、剪辑节奏、口播音频）的特征时具有更强的鲁棒性和抗干扰能力。它不仅能无损复刻素材质感生成新内容，还能在指定的素材基础上无缝延伸视频时长，实现跨场景的视听语言平移，助力维持IP视觉资产的一致性。
tags: ["Seedance"]
---

# Seedance-2.0-参考生视频-官方版

> **参考生视频** | 厂商: 字节 | 模型: `seedance-2-0-official` | 类型: `reference-to-video`

Seedance 2.0系列中官方推荐的组合参考模式。该版本在提取多模态素材（人物形象、场景画风、剪辑节奏、口播音频）的特征时具有更强的鲁棒性和抗干扰能力。它不仅能无损复刻素材质感生成新内容，还能在指定的素材基础上无缝延伸视频时长，实现跨场景的视听语言平移，助力维持IP视觉资产的一致性。

💰 **价格**: 无参考视频 98金币/M Tokens; 有参考视频 98 * 0.6/M Tokens;  [查看详情](https://bizyair.cn/modelzoo/seedance-2-0-official/reference-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-official/reference-to-video';
  const payload = {
    "prompt": "参考图像：大猩猩、狗、牛三张动物图片，保持每个动物的外观特征完全一致，包括毛色、体型、斑纹、面部特征不可改变。 清晨的非洲大草原边缘，金色阳光低角度洒入。三只动物在同一片开阔草地上，以一种超现实但自然的方式共处：大猩猩坐在一棵孤树下，单手撑地，姿态沉稳地注视远方；狗在草地上小跑，耳朵随风轻扬，尾巴自然摆动；牛在不远处低头缓慢吃草，偶尔抬头甩动耳朵驱赶飞虫。 三只动物各自有独立的自然动作，互不干扰但共享同一空间，营造一种宁静和谐的超现实共处感。 镜头运动参考视频：缓慢的横向摇移（pan），从左侧大猩猩开始，匀速扫过中间的狗，最终停留在右侧的牛，全程平滑无剪切。随后镜头缓慢推近至中景，捕捉三者共处的全景画面。 灯光为清晨黄金时段自然光，低角度暖光，动物毛发边缘产生柔和轮廓光，草地上拉出长长的影子。 背景为开阔非洲草原，远处可见稀疏的金合欢树剪影，地平线清晰，天空从金橙色渐变为浅蓝色。 音频参考：清晨草原环境音——远处鸟鸣、微风吹过草丛的沙沙声、偶尔的牛叫声、狗的轻微喘息声，整体安静祥和，配以轻柔的非洲手鼓或木琴旋律。 超真实，动物毛发纹理细腻，皮肤质感真实，眼睛有光泽反射，动物运动符合各自物种的真实运动规律，无变形，无多余肢体，自然纪录片画质，电影级色彩调度。",
    "aspect_ratio": "16:9",
    "duration": "10",
    "generate_audio": true,
    "resolution": "1080p",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/gv0iMp9QUFrN3avdMUNgxHCmXcgymYpU.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/MiYzWWZeIxrspf9OlFM2PwZR5HZQYetE.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/a1eCOlWL8Zoa0CkfKytoIJ5m3nCavwcA.jpg"
    ],
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/dDjUdhhFnAicvuDSj3u5OEwLUZEPWcbG.mp4"
    ],
    "audio_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/HeKxW6VzwQududKUBZvqKAUQRMSWaNLH.mp3"
    ],
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
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["auto","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| duration | string | 否 | ⟨bz_enum_json⟩["auto","4","5","6","7","8","9","10","11","12","13","14","15"]⟨/bz_enum_json⟩<br/>视频时长（秒） |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| resolution | string | 否 | ⟨bz_enum_json⟩["480p","720p","1080p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| image_urls | array | 否 | 支持格式：jpeg、png、webp<br/>单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：9<br/>用于指导视频生成的参考图像。请在提示中分别使用 @Image1、@Image2 等引用它们。支持的格式：JPEG、PNG、WebP。每张图像最大 30 MB。最多可添加 9 张图像。所有格式的文件总数不得超过 12 个。 |
| video_urls | array | 否 | 支持格式：mp4、mov<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>图片最大总像素：927408<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>提供参考视频以指导视频生成。请在提示中分别使用 @Video1、@Video2 等引用这些参考视频。支持的格式：MP4、MOV。最多可上传 3 个视频，总时长必须在 2 到 15 秒之间，总大小不超过 50 MB。每个视频的分辨率必须在 480p (640x640) 到 720p (834x1112) 之间 |
| audio_urls | array | 否 | 支持格式：mp3、wav<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>用于指导视频生成的参考音频。请在提示中分别用 @Audio1、@Audio2 等方式引用它们。支持的格式：MP3、WAV。最多可上传 3 个文件，总时长不得超过 15 秒。每个文件最大 15 MB。如果提供音频，则至少需要一张参考图像或视频。 |
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
      "https://storage.bizyair.cn/outputs/YpSYCWur2Tl6rl1S.mp4"
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
