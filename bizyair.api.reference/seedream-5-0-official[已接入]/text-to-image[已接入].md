---
display_name: "Seedream 5.0-文生图-官方版"
category: "Text to Image"
manufacturer: "字节"
price: "220 金币/1次"
price_url: "https://bizyair.cn/modelzoo/seedream-5-0-official/text-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  Seedream 5.0 是字节跳动 Seed 团队发布的新一代图像创作模型，定位知识推理与智能编辑，为 Seedream 系列首个引入实时联网检索能力的版本。文生图模式下具备更深的世界知识理解，可处理需要实时信息的创作任务，对复杂提示词的语义理解与空间逻辑推理能力进一步提升，支持原生 4K 分辨率输出，适合信息图、知识推理类配图与电商设计场景。
tags: ["Seedream"]
---

# Seedream 5.0-文生图-官方版

> **文生图** | 厂商: 字节 | 模型: `seedream-5-0-official` | 类型: `text-to-image`

Seedream 5.0 是字节跳动 Seed 团队发布的新一代图像创作模型，定位知识推理与智能编辑，为 Seedream 系列首个引入实时联网检索能力的版本。文生图模式下具备更深的世界知识理解，可处理需要实时信息的创作任务，对复杂提示词的语义理解与空间逻辑推理能力进一步提升，支持原生 4K 分辨率输出，适合信息图、知识推理类配图与电商设计场景。

💰 **价格**: 220 金币/1次  [查看详情](https://bizyair.cn/modelzoo/seedream-5-0-official/text-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedream-5-0-official/text-to-image';
  const payload = {
    "prompt": "Cinematic wide shot of a nearly empty subway station at  midnight, a lone exhausted office worker in a wrinkled  suit sitting slumped on a metal bench, briefcase between  his feet, tie loosened, eyes half-closed. The departure  board above shows \"LAST TRAIN — 23:58 — DEPARTED\".  Flickering fluorescent lights cast cold blue-white light  on empty platforms, a single crumpled coffee cup rolling  slowly across the floor. Deep shadows in tunnel mouth.  Leica M11, cinematic color grade, desaturated blue-grey  palette, film grain, ultra-realistic, no text visible  except departure board. ",
    "size": "2K"
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |
| size | string | 否 | ⟨bz_enum_json⟩["2K","3K","4K"]⟨/bz_enum_json⟩<br/>指定生成图像的分辨率，并在prompt中用自然语言描述图片宽高比、图片形状或图片用途，最终由模型判断生成图片的大小。 |


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
    "images": [
      "https://storage.bizyair.cn/outputs/d7bpPxKsYrKGp2qU.jpeg"
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
| outputs.images | array | 图片类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
