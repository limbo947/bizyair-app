---
display_name: "可灵O3.4K-参考生视频-渠道版"
category: "Reference to Video"
manufacturer: "快手"
price: "true: 700 金币/1秒 | false: 550 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/kling-o3-4k-base/reference-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  可灵O3渠道版参考图生视频模型，支持上传参考图锁定角色/物体视觉身份，跨镜头保持外观与特征一致。搭载Omni架构，输出1080P与原生音频同步，帧间连贯、光影自然，适配角色IP创作、广告短片与影视分镜，满足主体一致性强的快速出片需求。
tags: ["可灵"]
---

# 可灵O3.4K-参考生视频-渠道版

> **参考生视频** | 厂商: 快手 | 模型: `kling-o3-4k-base` | 类型: `reference-to-video`

可灵O3渠道版参考图生视频模型，支持上传参考图锁定角色/物体视觉身份，跨镜头保持外观与特征一致。搭载Omni架构，输出1080P与原生音频同步，帧间连贯、光影自然，适配角色IP创作、广告短片与影视分镜，满足主体一致性强的快速出片需求。

💰 **价格**: true: 700 金币/1秒 | false: 550 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/kling-o3-4k-base/reference-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-4k-base/reference-to-video';
  const payload = {
    "prompt": "参考视频：@动漫风格办公桌面视频（作为整体画面风格、线条质感、色彩填充方式与动画运动节奏的参考，完整还原其二维动漫美学）；参考图片：@散乱水果与面包图片（作为画面主体内容参考，提取其中每一种水果与面包的形态、颜色与散落布局方式）。\n\n以@动漫风格办公桌面视频的画面风格为基准，将@散乱水果与面包图片中的所有食物元素完整转化为同款动漫风格，生成一段动漫食物桌面场景视频。\n画面整体呈现@参考视频的二维动漫美学——干净利落的黑色描边线条勾勒每一个食物轮廓，内部填充饱满的平涂色块，高光以简洁的白色几何形状表现，阴影用同色系加深的色块叠加，整体色调明亮温暖，无任何写实材质贴图。\n@散乱水果与面包图片中的每一种食物按原始散落布局转化为动漫版本摆放在桌面上，保留原图的凌乱随意感——面包堆叠的方式、水果滚落的角度、彼此叠压的位置关系全部忠实还原，只是视觉风格从写实照片完整转化为@参考视频的动漫语言。\n动态效果参考@参考视频的运动节奏与方式：\n桌面上散落的水果开始产生极轻微的呼吸感弹动，每颗水果以各自略微不同的频率缓慢起伏，如同在睡觉般微微鼓胀收缩。面包表面偶尔冒出一个小气泡随即消失，像刚出炉还在散热。切开的水果截面上，果汁以卡通方式缓慢渗出一小滴，在桌面形成一个小小的反光水渍。\n偶尔有一颗葡萄或小浆果从水果堆顶部缓缓滚落，沿桌面弹跳两下停稳，弹跳时产生动漫式的弹性形变——落地时微微压扁，弹起时略微拉长，符合动漫物理夸张感。\n一片面包片从面包堆边缘缓慢滑落，以慢动作翻转一圈平稳落在桌面，落地瞬间产生动漫式的小尘埃云和几粒面包屑向四周弹散。\n桌面参考@动漫办公桌面视频的材质表现——木纹以简洁的平行弧线表示，桌面边角有轻微的高光白边，整体干净不杂乱。\n光源从画面左上方打入，所有食物的受光面、背光面与投影方向保持统一，投影为动漫风格的深色平涂色块，边缘清晰不渐变。\n整体画面色调明亮欢快，水果的饱和色彩与面包的暖米色系形成丰富的色彩层次，与@动漫办公桌面视频的色彩风格和谐统一。\n全程镜头保持静止固定俯拍视角，画面内只有食物自身的微动作，参考@动漫办公桌面视频的静谧氛围，营造一种治愈系的动漫桌面生活感。\n音频：参考@动漫办公桌面视频的音效风格，轻柔的环境底音，水果弹跳时有卡通式的弹簧音效，面包滑落时有轻柔的摩擦声与落地的笃声，整体配以一段轻快可爱的木琴与钢片琴旋律，音调明亮治愈。\n动漫风格全程统一，食物形态与布局忠实还原参考图片，动态效果参考视频节奏，描边线条流畅，色彩填充干净，高光与阴影处理符合二维动漫美学，无写实材质，无人物，无文字。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/RwrEUiU9xeMben9Zms22d1fjviQYksu6.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/lAom8ttP9MUT5OSpQOC8NAsZX6bVFPE7.jpg"
    ],
    "duration": 10,
    "keep_original_sound": true,
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/0E2u5HXMk6sl0Ejvxw6Ywl4qTsMaG1RA.mp4"
    ],
    "sound": true,
    "aspect_ratio": "16:9",
    "multi_shot": true,
    "shot_type": "intelligence",
    "multi_prompt": ""
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词。 |
| image_urls | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：7<br/>参考图片输入，最多7张。 |
| duration | number | 是 | 取值范围：3 ~ 15<br/>视频时长，单位秒。 |
| keep_original_sound | boolean | 是 | 选择是否通过参数保留视频原始声音。 |
| video_urls | array | 是 | 支持格式：mp4、mov、webm<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：1<br/>参考视频。 |
| sound | boolean | 是 | 是否开启声音。 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1"]⟨/bz_enum_json⟩<br/>输出宽高比。 |
| multi_shot | boolean | 否 | 是否生成多镜头视频。 |
| shot_type | string | 否 | ⟨bz_enum_json⟩["customize","intelligence"]⟨/bz_enum_json⟩<br/>镜头类型。customize为自定义，intelligence为智能。 |
| multi_prompt | string | 否 | 文本长度限制：1 - 10000<br/>多镜头提示词配置，JSON格式。 |


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
      "https://storage.bizyair.cn/outputs/UYIuJj6kJb7Jzdwv.mp4"
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
