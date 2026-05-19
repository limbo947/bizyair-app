---
display_name: "通用视频V.3.1.Pro-首尾帧-渠道版"
category: "FLF to Video"
manufacturer: "谷歌"
price: "720p: 800 金币/1次 | 1080p: 1000 金币/1次 | 4k: 1400 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-video-v3-1-pro-base/flf-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  V.3.1.Pro 首尾帧生视频（First-Last-Frame）模式支持图片输入，画面细节与运动一致性较强，适合对视频质量有一定要求的生产场景。综合调用成本低于官方版。
tags: ["通用视频V"]
---

# 通用视频V.3.1.Pro-首尾帧-渠道版

> **首尾帧生视频** | 厂商: 谷歌 | 模型: `bza-video-v3-1-pro-base` | 类型: `flf-to-video`

V.3.1.Pro 首尾帧生视频（First-Last-Frame）模式支持图片输入，画面细节与运动一致性较强，适合对视频质量有一定要求的生产场景。综合调用成本低于官方版。

💰 **价格**: 720p: 800 金币/1次 | 1080p: 1000 金币/1次 | 4k: 1400 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-video-v3-1-pro-base/flf-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-v3-1-pro-base/flf-to-video';
  const payload = {
    "prompt": "以首帧画面为起始：一根金黄色的长法棍面包平放在木质砧板上，面包表面烤痕清晰，酥脆外壳在暖光下泛出诱人的焦糖色光泽，面包两端的截面可见蓬松的白色内芯，整体静置在温暖的厨房环境中。\n镜头缓缓向前推进靠近面包，就在推近至面包正面中景的瞬间，面包开始发生变化——表面的烤痕纹路开始缓慢流动，像液体一样蠕动重组，面包外壳从两端向中央收缩，整根长面包在砧板上缓慢弯曲，两端向上翘起，中段向下弯折，开始呈现弧形。\n弯折继续进行，长面包的两端继续向彼此靠拢，整体轮廓从长条形过渡为U形，再继续收拢为一个圆形轮廓，面包表面的金黄色外壳质感在这个过程中逐渐变化——从粗糙酥脆的法棍外壳慢慢过渡为细腻光滑的曲奇饼干表面，颜色从深焦糖棕向均匀的浅金黄过渡，表面开始出现细密的曲奇压纹与裂纹。\n面团在完成圆形轮廓之后，顶部受到一股无形的轻柔力量向内挤压——圆形顶端缓缓凹陷形成一个V形缺口，两侧同步向外微微鼓起，整体轮廓从圆形演变为完整的爱心形状，边缘定型，表面纹理完全固化为曲奇饼干质感。\n爱心曲奇定型的瞬间，表面撒落几粒细砂糖晶体，在暖光下闪烁，砧板旁边飘落几片面粉如雪花般缓缓沉降，整个画面安静温暖。\n以尾帧画面收尾：一块完整的爱心形曲奇饼干静置在木质砧板上，表面金黄均匀，压纹清晰，边缘微微焦脆，砧板上残留少许面粉与细砂糖，暖光打亮饼干表面，与首帧同一场景同一光线，完成从长面包到爱心曲奇的完整蜕变。\n全程一镜到底，镜头从缓慢推进到静止记录蜕变过程，面包到曲奇的形态变化以面团流动与烘焙质感转变为桥梁自然过渡，无任何突兀剪切，整体节奏温柔缓慢如同看一场烘焙魔法。\n音频：开场是温暖的厨房环境音，烤箱余温的细微嗡鸣，面团蜕变过程中有极轻微的面团延展声与细碎的酥皮重组声，爱心定型瞬间是一声轻柔的叮的一声如计时器完成，砂糖落下时有细碎的沙沙声，整体配以一段轻快温柔的木琴小曲贯穿始终。\n超真实，面包与曲奇材质质感还原精准，面团流动物理效果自然，烘焙食物光影细腻温暖，形态蜕变过渡流畅无穿帮，4K质感，无人物，无文字。",
    "first_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/FOhofD0RZS6FSFUYNVImBUqJB9CNWT6A.jpg"
    ],
    "last_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/tTKxOgKGEZbAmozuhjempYNETacX2Fju.jpg"
    ],
    "aspect_ratio": "16:9",
    "resolution": "1080p"
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
| prompt | string | 是 | 文本长度限制：1 - 8000<br/>视频提示词 |
| first_frame_image | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>首帧图片 |
| last_frame_image | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>尾帧图片 |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>画面比例 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>视频分辨率 |


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
      "https://bizyair-dev.oss-cn-shanghai.aliyuncs.com/outputs/Fc1uNPA3xoN1pePn.mp4"
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
