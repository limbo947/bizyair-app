---
display_name: "海螺2.3.Fast-图生视频-渠道版"
category: "Image to Video"
manufacturer: "MiniMax"
price: "768P, 6s: 1080 金币/1次 | 768P, 10s: 1800 金币/1次 | 1080P, 6s: 1850 金币/1次"
price_url: "https://bizyair.cn/modelzoo/hailuo-2-3-fast-base/image-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  海螺 2.3 极速渠道版图生视频模型，适配短视频创作者与广告行业。兼顾超快生成速率与基础画面质感，原生动态过渡自然，主体形态稳定不畸变，可快速产出合规影像素材，满足日常轻量化创意视频批量制作需求。
tags: ["海螺"]
---

# 海螺2.3.Fast-图生视频-渠道版

> **图生视频** | 厂商: MiniMax | 模型: `hailuo-2-3-fast-base` | 类型: `image-to-video`

海螺 2.3 极速渠道版图生视频模型，适配短视频创作者与广告行业。兼顾超快生成速率与基础画面质感，原生动态过渡自然，主体形态稳定不畸变，可快速产出合规影像素材，满足日常轻量化创意视频批量制作需求。

💰 **价格**: 768P, 6s: 1080 金币/1次 | 768P, 10s: 1800 金币/1次 | 1080P, 6s: 1850 金币/1次  [查看详情](https://bizyair.cn/modelzoo/hailuo-2-3-fast-base/image-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/hailuo-2-3-fast-base/image-to-video';
  const payload = {
    "first_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/5j4Fh7Uh5mBUVn8ngT9Th7Wn64aNVHys.jpg"
    ],
    "prompt": "史诗级太空科幻大战。视频起始于输入图像中静止的行星排列。下一秒，平静被彻底打破：左侧的太阳猛烈爆发，向右喷射出一道席卷整个星系的巨大日冕物质抛射（耀斑巨浪）。各大行星纷纷觉醒天体能量进行反击：木星巨大的风暴红斑化为刺眼的等离子光束向前轰鸣射出；土星的星环开始高速旋转，化作无数片锋利的光能飞刃向四周切割；地球表面升起一道幽蓝色的脉冲磁场护盾，抵御袭来的能量。整个星系陷入引力扭曲与绚丽的能量交火。镜头采用动态的太空穿梭视角，在刺眼的光芒与星尘碎片中快速推进。超现实宇宙物理特效，8K超清。",
    "resolution": "768P",
    "duration": 6
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
| first_frame_image | array | 是 | 支持格式：jpg、jpeg、png、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：300px<br/>图片最小高度：300px<br/>图片最小宽高比：2:5<br/>图片最大宽高比：5:2<br/>最少上传数量：1<br/>最多上传数量：1<br/>支持 JPG/JPEG/PNG/WebP，文件小于 20MB，图片短边需大于 300px，长宽比需在 2:5 到 5:2 之间。 |
| prompt | string | 是 | 文本长度限制：1 - 2000<br/>视频生成提示词，最大 2000 字符；支持海螺运镜指令写法。 |
| resolution | string | 是 | ⟨bz_enum_json⟩["768P","1080P"]⟨/bz_enum_json⟩<br/>支持 768P、1080P；当时长为 10 秒时仅支持 768P。 |
| duration | number | 是 | ⟨bz_enum_json⟩["6","10"]⟨/bz_enum_json⟩<br/>支持 6 秒、10 秒；1080P 仅支持 6 秒。 |


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
      "https://storage.bizyair.cn/outputs/JwnWENot3BYzTkaL.mp4"
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
