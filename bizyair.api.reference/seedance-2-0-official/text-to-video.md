---
display_name: "Seedance-2.0-文生视频-官方版"
category: "Text to Video"
manufacturer: "字节"
price: "98金币/M Tokens"
price_url: "https://bizyair.cn/modelzoo/seedance-2-0-official/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  字节跳动官方主推的文本生成视频版本，针对全场景通用生成质量做了深度调优，在复杂长文本脚本的遵循度上更加精准，音画同步的原生双耳音频体验也达到专业监制水准。模型能自主规划故事分镜，并在多角色、多情节交互的叙事中维持高度的主体一致性，是专业影视公司与广告团队交付高质量成片的重要工具之一。
tags: ["Seedance"]
---

# Seedance-2.0-文生视频-官方版

> **文生视频** | 厂商: 字节 | 模型: `seedance-2-0-official` | 类型: `text-to-video`

字节跳动官方主推的文本生成视频版本，针对全场景通用生成质量做了深度调优，在复杂长文本脚本的遵循度上更加精准，音画同步的原生双耳音频体验也达到专业监制水准。模型能自主规划故事分镜，并在多角色、多情节交互的叙事中维持高度的主体一致性，是专业影视公司与广告团队交付高质量成片的重要工具之一。

💰 **价格**: 98金币/M Tokens  [查看详情](https://bizyair.cn/modelzoo/seedance-2-0-official/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-official/text-to-video';
  const payload = {
    "seed": -1,
    "aspect_ratio": "16:9",
    "generate_audio": true,
    "duration": "8",
    "resolution": "1080p",
    "prompt": "深夜的撒哈拉沙漠腹地，镜头从沙丘表面的细沙纹理开始，微风吹过沙面形成流动的细沙瀑布，沙粒在月光下如碎银闪烁。 镜头极缓慢地向上仰起，越过沙丘弧线，视野逐渐打开——一片壮阔的星空铺满整个画面上方。银河主体横贯天际，核心部分呈现浓烈的金橘色与深紫色混合，数亿颗星点密集到几乎连成光带，用肉眼可见的方式缓慢旋转移动，呈现延时摄影的星轨效果。 前景保留一列连绵起伏的沙丘剪影，丘脊线条流畅优雅，月光从右侧斜打，沙丘明暗两面形成极强对比——受光面为冷银白，背光面为深靛蓝，两者交界处是一条极细的金色轮廓线。 画面中央偏左，一棵孤独的枯死骆驼刺树剪影，枝杈向四面伸展，星空透过枝条空隙可见，形成天然的画框层次。远处地平线上隐约有一队骆驼剪影极缓慢地移动，小如尘埃，衬托出空间的辽阔。 流星不定时划过天际，每隔十几秒出现一道，长尾在星空中拖出短暂的白色光迹随即消散。偶有一颗特别明亮的流星在银河核心处划过，瞬间将整片天空照亮半秒。 镜头运动全程极缓，如同大地本身在呼吸，最终以银河完整横跨画面的仰拍全景定格收尾。 整体色调以深靛蓝、冷银、暖金橘为主，画面极暗，星光为唯一主要光源。 音频：绝对的沙漠寂静为底——几乎无声，只有极轻微的风沙摩擦声，偶尔一声不知名的夜间虫鸣，配以一段极简单音符竖琴旋律，音符之间间隔漫长，与星空的辽阔感共鸣。 超真实，天文摄影级星空细节，沙粒纹理精细可数，延时星轨运动自然流畅，一镜到底，无剪切，电影级画面，轻微胶片颗粒感，4K质感，无人物，无文字。"
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
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["auto","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| duration | string | 否 | ⟨bz_enum_json⟩["auto","4","5","6","7","8","9","10","11","12","13","14","15"]⟨/bz_enum_json⟩<br/>视频时长（秒） |
| resolution | string | 否 | ⟨bz_enum_json⟩["480p","720p","1080p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| prompt | string | 是 | 文本长度限制：1 - 20480<br/>视频生成提示词 |


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
      "https://storage.bizyair.cn/outputs/2qD6jKHxjlryySAr.mp4"
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
