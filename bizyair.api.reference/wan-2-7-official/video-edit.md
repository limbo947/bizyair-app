---
display_name: "万相2.7-视频编辑-官方版"
category: "Video Edit"
manufacturer: "阿里"
price: "720P: 600 金币/1秒 | 1080P: 1000 金币/1秒 | 480p: 300 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/wan-2-7-official/video-edit?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  万相2.7官方版视频编辑模型，拥有高阶智能改写与精细化画面编辑能力，动态衔接质感出众。适配商业视频精修、剧情镜头优化、专业创意剪辑等高端创作场景。
tags: ["万相视频"]
---

# 万相2.7-视频编辑-官方版

> **视频编辑** | 厂商: 阿里 | 模型: `wan-2-7-official` | 类型: `video-edit`

万相2.7官方版视频编辑模型，拥有高阶智能改写与精细化画面编辑能力，动态衔接质感出众。适配商业视频精修、剧情镜头优化、专业创意剪辑等高端创作场景。

💰 **价格**: 720P: 600 金币/1秒 | 1080P: 1000 金币/1秒 | 480p: 300 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/wan-2-7-official/video-edit?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-official/video-edit';
  const payload = {
    "video": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/8q0suHWLH9dfLt8plAGnpRBbiQbXOfNu.mp4"
    ],
    "ref_images": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/ga0k1FCjzSRAZl7xpeYdxSL80fKFOfsE.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/4wnQ7eFZXA2RV7jFvCeCNr6CRNgd9jxU.jpg"
    ],
    "first_frame": [],
    "prompt": "保持@俯拍街景视频的所有内容与镜头角度完全不变，在画面中新增食物雨效果。\n将@两张食物图片中的食物以原始写实外观从画面顶部持续落下，大小不一，从鸟瞰视角俯看呈现食物顶面的自然形态。食物以随机的密度与间隔从画面各处上方落入，速度参考自然降雨的节奏，有快有慢，偶尔一颗砸在地面弹起，偶尔几个扎堆密集落下。\n食物落地后自然停留在街道、屋顶与人行道上逐渐积累，越到视频后段地面食物堆积越多，行人与车辆照常移动对食物雨完全无视，营造荒诞超现实感。\n光影方向与原视频保持一致，落下的食物产生与街景相符的投影。\n音频在原视频基础上叠加食物撞击地面的声音——密集的噗噗声与偶尔的脆响，节奏与食物落下密度同步。\n超真实，食物外观忠实还原参考图片，落下物理轨迹自然，与街景融合无合成感，4K质感，无新增文字。",
    "negative_prompt": "",
    "resolution": "1080P",
    "ratio": "default",
    "duration": 5,
    "audio_setting": "auto",
    "prompt_extend": true,
    "watermark": false,
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
| video | array | 是 | 支持格式：mp4、mov<br/>单文件大小上限：100.0 MB（104857600 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：4096px<br/>图片最小高度：240px<br/>图片最大高度：4096px<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：10（单位与配置一致，一般为秒）<br/>图片最小宽高比：1:8<br/>图片最大宽高比：8:1<br/>待编辑的视频，有且仅有1个。支持mp4/mov格式，时长2-10秒，不超过100MB。 |
| ref_images | array | 否 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>图片最小宽高比：1:8<br/>图片最大宽高比：8:1<br/>最少上传数量：0<br/>最多上传数量：4<br/>参考图片输入，最多4张。提示词中通过"图片"指代参考图。参考图可以是主体角色或道具，用于局部替换等编辑操作。 |
| first_frame | array | 否 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>图片最小宽高比：1:8<br/>图片最大宽高比：8:1<br/>可选首帧图像，用于更精细地约束编辑后的首帧表现。传入后ratio参数将被忽略。 |
| prompt | string | 否 | 文本长度限制：1 - 5000<br/>编辑指令提示词。纯指令编辑时描述风格转换等；参考图编辑时描述替换/修改操作。不超过5000字符。 |
| negative_prompt | string | 否 | 文本长度限制：1 - 500<br/>描述不希望出现在视频画面中的内容，不超过500字符。 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>输出视频的分辨率档位，直接影响费用。 |
| ratio | string | 否 | ⟨bz_enum_json⟩["default","16:9","9:16","1:1","4:3","3:4"]⟨/bz_enum_json⟩<br/>视频宽高比。"default"表示跟随输入视频的宽高比，不向API传此参数。选择其他值则显式指定输出比例。 |
| duration | number | 否 | 取值范围：0 ~ 10<br/>输出视频时长，单位秒。0表示保持输入视频时长（不传此参数）；2-10表示从0秒起截断到指定长度。直接影响费用。 |
| audio_setting | string | 是 | ⟨bz_enum_json⟩["auto","origin"]⟨/bz_enum_json⟩<br/>auto：模型根据提示词智能判断，可能重新生成音频或保留原声；origin：强制保留输入视频原声。 |
| prompt_extend | boolean | 否 | 是否开启prompt智能改写。开启后使用大模型对输入prompt进行智能改写，对较短的prompt生成效果提升明显，但会增加耗时。 |
| watermark | boolean | 否 | 是否添加"AI生成"水印标识，水印位于视频右下角。 |
| seed | number | 否 | 随机种子，取值范围[0, 2147483647]。设为-1表示不传此参数，由服务端随机生成。即使使用相同seed，也不能保证每次结果完全一致。 |


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
      "https://storage.bizyair.cn/outputs/stsL5T9Ez5fMQh4V.mp4"
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
