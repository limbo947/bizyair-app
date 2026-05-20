---
display_name: "HappyHorse-1.0-参考生视频-官方版"
category: "Reference to Video"
manufacturer: "阿里"
price: "720P: 900 金币/1秒 | 1080P: 1600 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/happyhorse-1-0-official/reference-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  HappyHorse 1.0 官方版的参考生视频功能支持多图参考输入，模型可精准抽取参考素材中的角色外观、场景风格与构图特征，并在此基础上生成音画同步的新视频内容。官方版在多镜头切换中保持人物面部特征稳定，对中文意境词理解精准，适用于品牌视觉资产延续与多场景内容拓展。
tags: ["Happy Horse", "最近上新"]
---

# HappyHorse-1.0-参考生视频-官方版

> **参考生视频** | 厂商: 阿里 | 模型: `happyhorse-1-0-official` | 类型: `reference-to-video`

HappyHorse 1.0 官方版的参考生视频功能支持多图参考输入，模型可精准抽取参考素材中的角色外观、场景风格与构图特征，并在此基础上生成音画同步的新视频内容。官方版在多镜头切换中保持人物面部特征稳定，对中文意境词理解精准，适用于品牌视觉资产延续与多场景内容拓展。

💰 **价格**: 720P: 900 金币/1秒 | 1080P: 1600 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/happyhorse-1-0-official/reference-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/happyhorse-1-0-official/reference-to-video';
  const payload = {
    "media": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/NCtCYeezoCzMiujDXR3h4mw6wmUxoKxB.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/wIe3guBGJHWSn8NOFSLNZBRgEEeZEmt5.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/UcrE5rOm08H6tn0IH3qb87j1zpMhQaj3.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/VOXz6JkN8O2Lmrgq249am1fK4rP1sc5B.jpg"
    ],
    "prompt": "参考图像：图1黑人男性（短卷发、络腮胡、墨镜，保持面部特征完全一致）；图4前景黑人女性（丸子头、粉色方框墨镜，保持面部特征完全一致）。 视频开场前2-3秒，画面中央出现标题字幕： 「文字内容」：NOIR & BLOOM 「出现时机」：视频第0秒起 「出现位置」：画面垂直居中，水平居中 「出现方式」：逐字淡入，每个字母依次浮现，完整显示后停留1秒，随后整体向上轻柔消散 「文字特征」：全大写无衬线字体，字间距极宽，纯白色，字体纤细优雅，带轻微金属光泽  标题消散后，视频正式开始： 第一段——男性出场： 图1男性身穿图3白色珍珠镶嵌双排扣西装，内搭黑色高领，保留原有墨镜，从T台远端缓步走来。步伐沉稳有力，每一步落地清晰。领口珍珠与水晶在聚光灯下随动作产生细密闪光。镜头从全身正面跟拍，缓慢向前推进至上半身中景，捕捉西装领口珍珠细节的反光质感。 第二段——女性出场： 图4女性身穿原有白色针织套装，双手捧抱图2的大束白色雏菊花球，花束体积饱满，白色雏菊在T台灯光下洁白通透。她从T台侧翼入场，步伐轻盈，花束随步伐微微颠动，偶有花瓣轻轻脱落飘散在T台上。镜头以侧面中景跟拍为主，带轻微弧线运动，随后推近至她与花束的上半身特写。 第三段——交替收尾： 两人先后走至T台前端，镜头切换为正面平视，两人各占画面左右，短暂同框静止一秒，眼神直视镜头，随后镜头缓缓拉远，T台全景收尾。  T台为现代极简风格，纯黑色地面高度反光，人物倒影清晰可见。两侧聚光灯从顶部垂直打下，形成强烈的明暗对比，背景观众区域完全虚化在黑暗中。整体色调以黑、白、金为主，冷峻而高级。 音频：开场标题阶段为纯静默，字幕消散后低沉电子节拍渐入，节奏与步伐频率自然契合，偶尔穿插高跟鞋与皮鞋落地的清脆回响。 超真实，人物身份全程稳定，服装与花束细节精准还原，电影级时尚摄影风格，无变形，无多余肢体，4K质感。",
    "resolution": "1080P",
    "ratio": "16:9",
    "duration": 15,
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
| media | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：400px<br/>图片最小高度：400px<br/>最少上传数量：1<br/>最多上传数量：9<br/>上传 1-9 张参考图片；在提示词中按顺序使用 “[Image 1]、[Image 2]” 等进行指代。 |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>文本提示词；请用 “[Image 1]、[Image 2]” 等引用对应顺序的参考图。 |
| resolution | string | 否 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>生成视频分辨率，可选 720P 或 1080P；默认 1080P。 |
| ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1","4:3","3:4","4:5","5:4"]⟨/bz_enum_json⟩<br/>视频宽高比；默认 16:9。 |
| duration | number | 否 | 取值范围：3 ~ 15<br/>视频时长，单位秒，取值范围 3-15；默认 5。 |
| watermark | boolean | 否 | 是否添加 Happy Horse 水印；默认添加。 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>随机种子范围 0-2147483647；当前默认值 -1 表示由系统自动生成。 |


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
      "https://storage.bizyair.cn/outputs/QuWeP5tQZ4p553cY.mp4"
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
