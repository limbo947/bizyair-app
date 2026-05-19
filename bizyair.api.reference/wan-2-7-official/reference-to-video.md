---
display_name: "万相2.7-参考生视频-官方版"
category: "Reference to Video"
manufacturer: "阿里"
price: "720P: 600 金币/1秒 | 1080P: 1000 金币/1秒 | 480p: 300 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/wan-2-7-official/reference-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  万相2.7官方版参考生视频模型，升级主体特征锁定与动态渲染能力，画面流畅度与角色一致性大幅提升。适配专业剧情创作、数字人短片、商业创意视频等高质感制作场景。
tags: ["万相视频"]
---

# 万相2.7-参考生视频-官方版

> **参考生视频** | 厂商: 阿里 | 模型: `wan-2-7-official` | 类型: `reference-to-video`

万相2.7官方版参考生视频模型，升级主体特征锁定与动态渲染能力，画面流畅度与角色一致性大幅提升。适配专业剧情创作、数字人短片、商业创意视频等高质感制作场景。

💰 **价格**: 720P: 600 金币/1秒 | 1080P: 1000 金币/1秒 | 480p: 300 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/wan-2-7-official/reference-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/wan-2-7-official/reference-to-video';
  const payload = {
    "ref_images": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/3mZ4A6EGloYJOjBon47AVdIG7SMSPNdS.png?uploads="
    ],
    "ref_videos": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/Q8iP6ajjppur0pyXu0d2QM8s5wR3oMWD.mp4"
    ],
    "first_frame": [],
    "reference_voice": [],
    "prompt": "明白，不涉及人物，纯粹把动漫风格套用到你上传的图片场景上。帮你写：\n\n参考视频：@动漫风格小屋桌面视频（作为整体画风、线条质感、色彩填充方式、光影处理与动画运动节奏的完整参考）；参考图片：@上传的场景图片（作为画面内容、空间构图与物件布局的参考）。\n\n将@上传的场景图片中的所有内容完整转化为与@动漫风格小屋桌面视频高度一致的二维动漫场景，生成一段风格统一的动漫场景视频。\n风格转化方式：\n以@动漫视频的线条语言为标准，将@场景图片中的所有物件、材质与空间结构重新绘制——每一个物体以干净利落的黑色描边轮廓勾勒，内部以平涂色块填充，高光以简洁的白色几何形状点缀在受光边缘，阴影以同色系加深的色块叠加表现，不使用任何写实材质贴图或照片质感，整体呈现手绘动漫的二维美学。\n@场景图片中的空间布局、物件位置与构图比例完整保留，只改变视觉风格，不改变任何内容的位置关系与场景结构。\n动态效果：\n场景中的所有元素根据其物理属性产生与@动漫视频节奏一致的自然微动作——轻质物体如叶片、窗帘、纸张产生极缓慢的飘动；固定物体如桌面、墙壁保持静止但表面光影随环境光缓慢变化；液体类物件如饮品、水面产生动漫式的轻微液面晃动；光源物件如灯、窗外光线产生极轻微的亮度呼吸感脉冲。\n所有动态幅度极小，节奏舒缓，与@动漫视频的治愈静谧氛围完全一致，不出现任何突兀的快速运动。\n光影处理：\n光源方向与@场景图片保持一致，所有物件的受光面、背光面与投影方向统一，投影以动漫风格的深色平涂色块表现，边缘清晰利落不渐变，整体光影简洁明确符合二维动漫美学。\n色彩处理：\n@场景图片的原始色调作为色彩基准，在转化过程中将所有颜色调整为@动漫视频的色彩风格——饱和度适度提升，色块边界清晰，整体色调明亮温暖，与@动漫视频的色彩氛围和谐统一。\n镜头保持与@场景图片构图完全一致的固定机位，不做任何推拉移动，只呈现场景内物件的自然微动作，营造动漫定格画面缓缓复苏的治愈感。\n音频：参考@动漫视频的音效风格，轻柔的室内环境底音，物件微动作产生的细碎自然声，配以一段轻快温柔的钢片琴或木琴旋律，音调明亮治愈，与画面节奏自然契合。\n动漫风格全程与@参考视频统一，场景内容忠实还原@上传图片的空间结构与物件布局，描边线条流畅，色彩填充干净，光影处理符合二维动漫美学，无写实材质，无人物，无文字。",
    "negative_prompt": "",
    "resolution": "1080P",
    "ratio": "16:9",
    "duration": 5,
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
| ref_images | array | 否 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>图片最小宽高比：1:8<br/>图片最大宽高比：8:1<br/>最少上传数量：0<br/>最多上传数量：5<br/>参考图片输入，提供主体角色或场景参考。按顺序对应提示词中的"图1"、"图2"等。参考图片+参考视频合计不超过5个，每张图仅包含单一角色。 |
| ref_videos | array | 否 | 支持格式：mp4、mov<br/>单文件大小上限：100.0 MB（104857600 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：4096px<br/>图片最小高度：240px<br/>图片最大高度：4096px<br/>视频最小时长：1（单位与配置一致，一般为秒）<br/>视频最大时长：30（单位与配置一致，一般为秒）<br/>图片最小宽高比：1:8<br/>图片最大宽高比：8:1<br/>最少上传数量：0<br/>最多上传数量：5<br/>参考视频输入，提供主体角色或音色参考。按顺序对应提示词中的"视频1"、"视频2"等。参考图片+参考视频合计不超过5个，每个视频仅包含单一角色。 |
| first_frame | array | 否 | 支持格式：jpeg、jpg、png、bmp、webp<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：240px<br/>图片最大幅宽：8000px<br/>图片最小高度：240px<br/>图片最大高度：8000px<br/>图片最小宽高比：1:8<br/>图片最大宽高比：8:1<br/>可选首帧图像。传入后模型会参考首帧构图，ratio参数将被忽略。 |
| reference_voice | array | 否 | 支持格式：wav、mp3<br/>单文件大小上限：15.0 MB（15728640 byte）<br/>视频最小时长：1（单位与配置一致，一般为秒）<br/>视频最大时长：10（单位与配置一致，一般为秒）<br/>可选参考音色音频。仅参考音色，与说话内容无关。建议音频语种与提示词语种一致。若参考视频含音频但未指定此参数，默认使用视频原声。 |
| prompt | string | 是 | 文本长度限制：1 - 5000<br/>文本提示词，描述生成视频的期望内容。参考图片通过"图1"、"图2"指代，参考视频通过"视频1"、"视频2"指代，顺序与上传顺序一致。支持中英文，不超过5000字符。 |
| negative_prompt | string | 否 | 文本长度限制：1 - 500<br/>描述不希望出现在视频画面中的内容。不超过500字符。 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>生成视频的分辨率档位，直接影响费用。 |
| ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1","4:3","3:4"]⟨/bz_enum_json⟩<br/>生成视频的宽高比。传入首帧图像时此参数会被忽略，以首帧图像宽高比为准。 |
| duration | number | 是 | 取值范围：2 ~ 15<br/>生成视频时长，单位秒。含参考视频时取值2-10，不含参考视频时取值2-15。直接影响费用。 |
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
      "https://storage.bizyair.cn/outputs/vixUaNgjzuKhuVEV.mp4"
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
