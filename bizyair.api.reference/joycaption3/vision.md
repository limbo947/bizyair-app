---
display_name: "JoyCaption3-图像描述-官方版"
category: "Vision"
manufacturer: "硅基流动"
price: "6金币/次"
price_url: "https://bizyair.cn/modelzoo/joycaption3/vision?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  JoyCaption3视觉语言模型可精准捕捉画面构图、光影质感与主体细节，生成贴合逻辑的专业描述文案。模型泛化性强，兼容多类图像风格，语义提取表现突出。可高效用于AI绘图提示词生成、素材标注、画面解读等场景，为专业创作者提供可靠的视觉语义支撑。
tags: ["自部署开源模型"]
---

# JoyCaption3-图像描述-官方版

> **视觉** | 厂商: 硅基流动 | 模型: `joycaption3` | 类型: `vision`

JoyCaption3视觉语言模型可精准捕捉画面构图、光影质感与主体细节，生成贴合逻辑的专业描述文案。模型泛化性强，兼容多类图像风格，语义提取表现突出。可高效用于AI绘图提示词生成、素材标注、画面解读等场景，为专业创作者提供可靠的视觉语义支撑。

💰 **价格**: 6金币/次  [查看详情](https://bizyair.cn/modelzoo/joycaption3/vision?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/joycaption3/vision';
  const payload = {
    "image_input": [
      "https://bizy-air.oss-cn-beijing.aliyuncs.com/examples_asset/car.png"
    ],
    "do_sample": false,
    "temperature": 0.5,
    "max_tokens": 256,
    "caption_type": "Descriptive",
    "caption_length": "any",
    "extra_options": "If there is a person/character in the image you must refer to them as {name}.",
    "name_input": "Jack",
    "custom_prompt": ""
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
| image_input | array | 是 | 最少上传数量：1<br/>最多上传数量：1<br/>图片 |
| do_sample | boolean | 否 | 启用随机性 |
| temperature | number | 否 | 取值范围：0 ~ 2<br/>步进：0.01<br/>温度 |
| max_tokens | number | 否 | 取值范围：16 ~ 512<br/>步进：16<br/>最大词元数 |
| caption_type | string | 否 | ⟨bz_enum_json⟩["Descriptive","Descriptive (Informal)","Training Prompt","MidJourney","Booru tag list","Booru-like tag list","Art Critic","Product Listing","Social Media Post"]⟨/bz_enum_json⟩<br/>描述类型 |
| caption_length | string | 否 | ⟨bz_enum_json⟩["any","very short","short","medium-length","long","very long","20","30","40","50","60","70","80","90","100","110","120","130","140","150","160","170","180","190","200","210","220","230","240","250","260"]⟨/bz_enum_json⟩<br/>描述长度 |
| extra_options | string | 否 | 文本长度限制：1 - 2500<br/>额外选项 |
| name_input | string | 否 | 文本长度限制：1 - 2500<br/>name输入 |
| custom_prompt | string | 否 | 文本长度限制：1 - 2500<br/>自定义prompt |


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
    "texts": [
      "This is a high-quality photograph of a bright red Ford Bronco SUV with a modern design. The vehicle is positioned in the center of the image, facing slightly to the left, with a three-quarter view of the front and right side. The SUV features a black grille with the Ford logo in the center, angular LED headlights with a sleek design, and a black front bumper with a license plate that reads \"BIZYAIR.\" The vehicle's side mirrors and door handles are black, and the wheels have a black design with silver accents. The background is a gradient of pink and white, creating a vibrant and dynamic atmosphere. The lighting highlights the shiny finish of the red paint, giving the vehicle a polished appearance. The surface on which the SUV is placed appears to be smooth and reflective, adding to the modern aesthetic. The overall composition of the image emphasizes the sleek and stylish design of the Ford Bronco, with a focus on its bold color and contemporary features."
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
| outputs.texts | array | 文本类输出结果。 |
