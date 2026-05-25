> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-b2-official/image-to-image';
  const payload = {
    "prompt": "内容： 基于输入图像中城堡和修道院的复杂石头结构。将建筑群渲染为一个高密度、多层次的防御堡垒。在石头上增加几代人留下的自然磨损、青苔和风化质感。将山脉渲染为覆盖着郁郁葱葱、不规则生长的森林和崎岖岩石的风景。\n\n环境： 避免理想化的日落。天空应呈现戏剧性的积云层，云层厚重且层次丰富，捕捉混乱的、斑驳的日光和深邃的阴影（非均匀的自然光）。山脚下是平静但有真实纹理的湖泊，反射着复杂的天空和山脉。\n\n细节： 在城堡建筑的复杂窗户中增加柔和、真实的灯光。山脉上有一条蜿蜒、崎岖的古老碎石小径。在湖边增加一些非现代、具有生活气息的小型木质帆船（例如，传统渔船或货船）。\n\n构图： 严格保持与输入照片相同的建筑构图和整体布局。\n\n应用轻微的胶片颗粒感。在图像边缘增加极细微的、自然的物理瑕疵，如轻微的漏光或划痕。在图像的角落（例如右下角）增加一个小巧、不显眼、具有特定年代感的数字时间戳",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/faVQcj0qCx8SO56bHyqjINDg1liU9zxw.jpg"
    ],
    "resolution": "2K",
    "aspect_ratio": "16:9",
    "seed": -1,
    "web_search": true
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
| image_urls | array | 是 | 输入图像 |
| resolution | string | 是 | ⟨bz_enum_json⟩["0.5K","1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","4:3","1:1","3:4","9:16","21:9","3:2","2:3","5:4","4:5","4:1","1:4","8:1","1:8"]⟨/bz_enum_json⟩<br/>宽高比 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |
| web_search | boolean | 否 | 联网搜索 |

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
      "https://storage.bizyair.cn/outputs/4JECWaS3GL0QkEfu.png"
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
