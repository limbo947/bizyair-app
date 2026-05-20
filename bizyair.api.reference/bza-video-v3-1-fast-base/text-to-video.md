---
display_name: "通用视频V.3.1.Fast-文生视频-渠道版"
category: "Text to Video"
manufacturer: "谷歌"
price: "720p: 200 金币/1次 | 1080p: 250 金币/1次 | 4k: 500 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-video-v3-1-fast-base/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  V.3.1.Fast 文生视频模式，由文本描述直接生成运动连贯的视频片段，速度优先，适合高频批量生产场景。综合调用成本低于官方版。
tags: ["通用视频V"]
---

# 通用视频V.3.1.Fast-文生视频-渠道版

> **文生视频** | 厂商: 谷歌 | 模型: `bza-video-v3-1-fast-base` | 类型: `text-to-video`

V.3.1.Fast 文生视频模式，由文本描述直接生成运动连贯的视频片段，速度优先，适合高频批量生产场景。综合调用成本低于官方版。

💰 **价格**: 720p: 200 金币/1次 | 1080p: 250 金币/1次 | 4k: 500 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-video-v3-1-fast-base/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-v3-1-fast-base/text-to-video';
  const payload = {
    "prompt": "北欧深冬极夜，镜头从一片白桦树林的地面积雪开始，雪面在极度黑暗中呈现幽蓝色，每一颗雪晶都是微型棱镜，将极光的绿色反射成细碎的光点。\n镜头缓缓向前推进穿行于桦树林间，白色树干在黑暗中如白色幽灵排列，每棵树的树皮纹路——黑色横纹与纯白底色——在极光映照下对比极度清晰，树枝上积雪的重量将枝条压弯成优雅的弧线。\n穿出桦树林，视野豁然开朗——一片冰冻湖面延伸至远处，湖面冰层清澈如镜，将头顶极光的倒影完整映射，天上地下同时舞动着绿色光带，人站在其中如同悬浮于两片极光之间。\n",
    "resolution": "1080p",
    "aspect_ratio": "16:9"
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
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>画面比例 |


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
  "outputs": {}
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
