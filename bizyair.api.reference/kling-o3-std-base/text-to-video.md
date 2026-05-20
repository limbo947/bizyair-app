---
display_name: "可灵O3.Std-文生视频-渠道版"
category: "Text to Video"
manufacturer: "快手"
price: "true: 800 金币/1秒 | false: 550 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/kling-o3-std-base/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  可灵O3渠道版文生视频模型，基于O3架构，支持文本直接生成视频。画面主体清晰、运动流畅，光影自然，适配创意短视频、广告脚本可视化及影视概念动态预览场景。
tags: ["可灵"]
---

# 可灵O3.Std-文生视频-渠道版

> **文生视频** | 厂商: 快手 | 模型: `kling-o3-std-base` | 类型: `text-to-video`

可灵O3渠道版文生视频模型，基于O3架构，支持文本直接生成视频。画面主体清晰、运动流畅，光影自然，适配创意短视频、广告脚本可视化及影视概念动态预览场景。

💰 **价格**: true: 800 金币/1秒 | false: 550 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/kling-o3-std-base/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-std-base/text-to-video';
  const payload = {
    "prompt": "深秋雨夜的京都，镜头从一条铺满落叶的石板小径开始，湿润的青石板在路灯昏黄光晕中泛出深墨绿色，每一块石板缝隙里都积着雨水，将头顶的红色枫叶倒映成扭曲的火焰形状。细雨无声落下，雨滴敲击石板激起极细密的水雾，落在枫叶上顺着叶脉滑落聚成水珠，悬在叶尖颤而不落，在路灯光下如一颗颗琥珀色的液态宝石。镜头缓缓沿石板小径向前推进，两侧是高大的枫树，树冠在头顶交织成拱形的叶廊——深红、橘红、金黄、暗紫的叶片密密层叠，雨水将每一片叶子的颜色加深饱和至近乎不真实的程度，整条小径如同穿行在燃烧的隧道之中。前方出现一座朱红色的鸟居，雨水沿鸟居立柱流淌形成细线，朱红色漆面在雨中的光泽更加饱满深沉，鸟居之后是一条蜿蜒向上的石阶，石阶两侧的石灯笼逐一亮起，暖黄色烛光透过石灯笼的方形窗格投出十字形光影在石阶上。镜头穿过鸟居沿石阶缓缓上升，视野逐渐开阔，可以看到枫树林在夜雨中的全貌——整片山坡被深红与金黄覆盖，石灯笼的暖光点缀其间，远处山顶隐约可见一座神社的飞檐轮廓在雨雾中若隐若现。一阵风过，枫叶从树冠大片脱落，在路灯光柱中翻旋飘落，与雨丝交织成一幅流动的秋色画卷，落叶铺满石阶，将朱红与金黄层层叠叠堆积在石灯笼底座旁。镜头最终停在神社飞檐的近景仰拍，雨水从瓦片边缘成排滴落，在灯光中形成晶莹的水帘，枫叶不时从画面边缘飘入又飘出，远处山坡的枫林在雨雾中成为一片朦胧的暖色光晕。全程一镜到底，镜头沿石径—鸟居—石阶—神社的空间序列匀速推进，带极轻微手持呼吸感，如同独自漫步其中的第一人称体验。",
    "duration": 5,
    "sound": true,
    "aspect_ratio": "16:9",
    "multi_shot": false,
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
| duration | number | 是 | 取值范围：1 ~ 15<br/>视频时长，单位秒。 |
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
      "https://storage.bizyair.cn/outputs/GqVZr9xsK7DGNxAF.mp4"
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
