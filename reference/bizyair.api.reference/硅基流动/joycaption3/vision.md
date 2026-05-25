> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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

> 为保护您的业务敏感信息（如 prompt 设计等），我们支持对 API 调用记录中的指定字段进行脱敏处理。脱敏后的字段在查询调用记录时将显示为 `[调用方要求隐藏]`，但不影响实际请求的执行和计费准确性。
>
> **使用方法**：在请求头中携带 `X-BizyAir-Log-Mask-Fields`，指定需要脱敏的字段，多个字段用英文逗号分隔。
>
> ```http
> Content-Type: application/json
> Authorization: Bearer ${BIZYAIR_API_KEY}
> X-BizyAir-Log-Mask-Fields: prompt, image_urls
> ```


## 三. 查询结果

### 2. 响应示例

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

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |
| status | string | 任务状态，可能的值为：Pending（排队中）、Running（运行中）、Saving（转存中）、Success（完成）、Failed（失败）。 |
| message | string | 任务状态为 Failed 时，错误的具体信息。 |
| executed_at | string | 任务开始运行的时间。 |
| ended_at | string | 当任务成功或失败时，任务结束的时间。 |
| outputs | array | 生成结果（非“完成”状态时，为null或[]）。 |
| outputs.texts | array | 文本类输出结果。 |
