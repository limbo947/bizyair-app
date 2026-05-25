> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-o2-base/image-to-image';
  const payload = {
    "prompt": "在保持原图人物面部身份完全一致的前提下，将其转换为一个复杂的超现实空间场景。  人物仍然是主角，但场景发生在一个“无限镜面结构的旧美术馆”中。空间由多个不规则镜面组成，这些镜面彼此反射，但每一层反射都出现轻微时间延迟，导致同一人物在不同镜面中呈现出不同的微表情与姿态变化，但必须保持同一身份一致性。  主体人物站在画面中心，但在空间中同时存在至少5个“逻辑一致但动作不同”的镜像版本：  一个正在看向镜头 一个侧身背对 一个正在抬手触碰镜面 一个坐在远处楼梯上 一个半透明漂浮在镜面内部  所有镜像必须共享同一服装与面部特征，但动作不能重复。  环境要求：  建筑结构类似巴洛克与现代极简混合，但不能明显风格割裂 空间必须有明确透视逻辑，不能崩塌 镜面必须正确反射光源与人物，但允许轻微不现实延迟效果 地面是湿润石材，有真实反射，但不能过度模糊  光影要求：  单一主光源来自画面左上方，但镜面反射会产生额外次级光源 人物面部必须保持可读性，不允许被光污染完全遮挡 整体氛围偏冷色调，但人物肤色必须自然  额外约束：  不能出现额外“陌生人物” 不能改变原人物身份特征 所有镜像必须服从同一物理空间逻辑 不允许画面破碎或多余肢体 不允许风格卡通化或插画化，必须写实摄影级  细节增强：  镜面上有轻微划痕与时间氧化痕迹 空气中有微尘在光束中可见 深景区域轻微景深虚化，但主体必须清晰",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/HWO2kL3D0EABQdvWJKfMggXM5qeUEX8H.jpg"
    ],
    "resolution": "2K",
    "aspect_ratio": "1:1"
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |
| image_urls | array | 是 | 图像 |
| resolution | string | 否 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["1:1","2:3","3:2","4:5","5:4","3:4","4:3","16:9","9:16","2:1","1:2","3:1","1:3","21:9"]⟨/bz_enum_json⟩<br/>比例 |

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
    "images": [
      "https://storage.bizyair.cn/outputs/qHVL0rWbMzeBF2ZS.png"
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
| outputs.images | array | 图片类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
