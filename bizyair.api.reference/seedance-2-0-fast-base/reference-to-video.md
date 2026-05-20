---
display_name: "Seedance-2.0.Fast-参考生视频-渠道版"
category: "Reference to Video"
manufacturer: "字节"
price: "480p / 无参考视频, 模型原生直出的分辨率。: 500 金币/1秒 | 720p / 无参考视频, 模型原生直出的分辨率。: 1000 金币/1秒 | 1080p / 无参考视频, 基于 720p 原生生成后进行画质放大。: 1280 金币/1秒 | 2k / 无参考视频, 基于 720p 原生生成后进行画质放大。: 1420 金币/1秒 | 4k / 无参考视频, 基于 720p 原生生成后进行画质放大。: 1630 金币/1秒 | 480p / 有参考视频, 模型原生直出的分辨率。
计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 300 金币/1秒 | 720p / 有参考视频, 模型原生直出的分辨率。
计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 600 金币/1秒 | 1080p / 有参考视频, 基于 720p 原生生成后进行画质放大。
基础计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 基础: 600  附加: 280 金币/1秒 | 2k / 有参考视频, 基于 720p 原生生成后进行画质放大。
基础计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 基础: 600  附加: 420 金币/1秒 | 4k / 有参考视频, 基于 720p 原生生成后进行画质放大。
基础计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 基础: 600  附加: 630 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/seedance-2-0-fast-base/reference-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  Seedance 2.0 Fast 参考生视频模式压缩了多模态联合推理开销，可在较短时间内组合图像、视频与音频资产进行创作，在保证品牌视觉元素对齐与音画同步的前提下实现批量化内容生产。综合调用成本低于官方版。
tags: ["Seedance"]
---

# Seedance-2.0.Fast-参考生视频-渠道版

> **参考生视频** | 厂商: 字节 | 模型: `seedance-2-0-fast-base` | 类型: `reference-to-video`

Seedance 2.0 Fast 参考生视频模式压缩了多模态联合推理开销，可在较短时间内组合图像、视频与音频资产进行创作，在保证品牌视觉元素对齐与音画同步的前提下实现批量化内容生产。综合调用成本低于官方版。

💰 **价格**: 480p / 无参考视频, 模型原生直出的分辨率。: 500 金币/1秒 | 720p / 无参考视频, 模型原生直出的分辨率。: 1000 金币/1秒 | 1080p / 无参考视频, 基于 720p 原生生成后进行画质放大。: 1280 金币/1秒 | 2k / 无参考视频, 基于 720p 原生生成后进行画质放大。: 1420 金币/1秒 | 4k / 无参考视频, 基于 720p 原生生成后进行画质放大。: 1630 金币/1秒 | 480p / 有参考视频, 模型原生直出的分辨率。
计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 300 金币/1秒 | 720p / 有参考视频, 模型原生直出的分辨率。
计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 600 金币/1秒 | 1080p / 有参考视频, 基于 720p 原生生成后进行画质放大。
基础计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 基础: 600  附加: 280 金币/1秒 | 2k / 有参考视频, 基于 720p 原生生成后进行画质放大。
基础计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 基础: 600  附加: 420 金币/1秒 | 4k / 有参考视频, 基于 720p 原生生成后进行画质放大。
基础计费秒数 = 取 [输入视频时长 + 生成视频时长] 与 [最低计费时长] 中的最大值；: 基础: 600  附加: 630 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/seedance-2-0-fast-base/reference-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-fast-base/reference-to-video';
  const payload = {
    "prompt": "参考图像：一位佩戴首饰的女性（项链、耳环、配饰），必须保持人物身份一致，包括脸型、五官、发型以及所有首饰完全不改变。 该女性身穿剪裁考究的高领连衣长裙，面料质感厚实挺括，整体造型端庄大气，符合高级时装编辑风格。 该女性在城市街道上自信地行走，姿态优雅从容，步伐自然流畅，微风轻拂发丝和裙摆，服装与首饰随动作自然摆动并产生真实反光。 色彩处理：选择性色彩（Selective Color）风格。整个画面环境——街道、建筑、天空、行人、车辆——全部为黑白灰单色调。唯独该女性保持完整彩色，包括肤色、发色、服装颜色、首饰光泽全部为鲜明色彩。通过黑白与彩色的强烈对比，使女性人物成为画面唯一视觉焦点。 镜头运动：正面全身跟拍为主，镜头随人物匀速后退，保持人物始终居中构图完整，带电影手持质感和自然呼吸感，偶尔缓慢推近至上半身展示首饰细节与色彩反差，再平滑拉回全身。 灯光为阴天柔和漫射光，均匀照亮人物，首饰产生细腻高光，黑白背景中的光影层次丰富，呈现银盐胶片般的黑白质感。 背景为城市老街道，浅景深虚化，黑白色调下可见模糊的建筑轮廓、路灯、行人剪影，营造复古电影氛围。 音频：安静的城市环境音（远处回声、微风）+ 缓慢钢琴旋律或弦乐 + 清晰的高跟鞋脚步声回响在街道上。 超真实，无变形，无多余肢体，人物身份与服装全程稳定一致，电影级画面，轻微胶片颗粒感，自然运动模糊，高级艺术摄影风格。",
    "resolution": "2k",
    "duration": 5,
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/gXBu4orjhEdaI4zCgpdeUtSxlK1GnApR.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/eWoOoU3Wjacfrx5m20HFiybmANes9EAt.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/LnpdPLawlRygIgWiQfKmPMugcjWTR1Sc.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/DvxR1TEdjbfxEazDHxHEFrXYsAYA1w8X.jpg"
    ],
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/PkXE131sZwr1sWV1IPfy86cqsz2zAbVj.mp4"
    ],
    "audio_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/EHXjgQDsaB1bwAuyHR6yaiRPThIXVuxW.mp3"
    ],
    "generate_audio": true,
    "ratio": "16:9",
    "return_last_frame": false,
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
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p","1080p","2k","4k"]⟨/bz_enum_json⟩<br/>视频分辨率。分为模型原生输出的分辨率（480p、720p、native1080p），与基于 720p 原生生成后进行超分放大的分辨率（1080p、2k、4k）。 |
| duration | number | 是 | 取值范围：4 ~ 15<br/>视频时长（秒） |
| image_urls | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>图片最大总像素：36000000<br/>图片最小宽高比：2:5<br/>图片最大宽高比：5:2<br/>最多上传数量：9<br/>最多支持 9 项图片，每张 30 MB 参考图片（0-9张） |
| video_urls | array | 否 | 单文件大小上限：50.0 MB（52428800 byte）<br/>图片最大总像素：2086876<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>最多支持 3 项视频，每个 50 MB 参考视频（0-3个，用于多模态参考/视频编辑/视频续写）。单个视频时长 [2, 15] s，最多传入 3 个参考视频，所有视频总时长不超过 15s。 |
| audio_urls | array | 否 | 单文件大小上限：50.0 MB（52428800 byte）<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>最多支持 3 项音频，每个 50 MB 参考音频（0-3个，需至少包含1个参考视频或图片）。单个音频时长 [2, 15] s，最多传入 3 段参考音频，所有音频总时长不超过 15 s。 |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| ratio | string | 否 | ⟨bz_enum_json⟩["adaptive","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| return_last_frame | boolean | 否 | 是否返回视频尾帧图片 |
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
      "https://storage.bizyair.cn/outputs/zj9aKnZXWHMyUzMx.mp4"
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
