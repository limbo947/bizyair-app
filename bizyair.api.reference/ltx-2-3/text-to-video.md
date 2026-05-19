---
display_name: "LTX2.3-文生视频-官方版"
category: "Text to Video"
manufacturer: "硅基流动"
price: "300 金币/1次"
price_url: "https://bizyair.cn/modelzoo/ltx-2-3/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  LTX2.3官方版是Lightricks重磅升级的文生视频大模型，采用先进DiT架构，具备220亿参数体量。支持纯文本、图文联动、音频驱动多方式生成视频，原生适配竖屏比例，画面最高支持4K分辨率与高帧率输出，人物动作流畅自然，画面细节还原度高，指令遵循能力强，适合AI短视频、创意剧情等各类创作场景。
tags: ["自部署开源模型"]
---

# LTX2.3-文生视频-官方版

> **文生视频** | 厂商: 硅基流动 | 模型: `ltx-2-3` | 类型: `text-to-video`

LTX2.3官方版是Lightricks重磅升级的文生视频大模型，采用先进DiT架构，具备220亿参数体量。支持纯文本、图文联动、音频驱动多方式生成视频，原生适配竖屏比例，画面最高支持4K分辨率与高帧率输出，人物动作流畅自然，画面细节还原度高，指令遵循能力强，适合AI短视频、创意剧情等各类创作场景。

💰 **价格**: 300 金币/1次  [查看详情](https://bizyair.cn/modelzoo/ltx-2-3/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/ltx-2-3/text-to-video';
  const payload = {
    "seed": -1,
    "display": "horizontal",
    "resolution": "1080P",
    "duration": 5,
    "prompt": "Slow gentle camera movement, seawater flowing softly with slight ripples, schools of small tropical fish swimming freely, swinging tails naturally, corals swaying slightly with current, smooth dynamic motion, realistic underwater quiet atmosphere, no rigid static effect, low saturation, authentic muted natural color grading."
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
| seed | number | 否 | 取值范围：1 ~ 2147483647<br/>种子 |
| display | string | 否 | ⟨bz_enum_json⟩["horizontal","vertical"]⟨/bz_enum_json⟩<br/>展示方式 |
| resolution | string | 是 | ⟨bz_enum_json⟩["1080P"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| duration | number | 是 | 取值范围：5 ~ 5<br/>视频时长 |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |


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
      "https://storage.bizyair.cn/outputs/38u3vfcpy9wxs_9ae34515b02c29afc353dc09490c78b6_video_LTX_2.3_i2v_574b52ee_00001_.mp4"
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
