---
display_name: "通用图片B.2-图生图-官方版"
category: "Image to Image"
manufacturer: "谷歌"
price: "0.5K: 550 金币/1次 | 1K: 550 金币/1次 | 2K: 850 金币/1次 | 4K: 1100 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-b2-official/image-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片 B.2 官方版的图生图功能提供灵活的图像编辑体验。模型支持在已有图像上进行局部修改、文字替换与场景变换，结合搜索信息增强准确性，同时保持主体一致性与文字渲染的清晰可读。该版本为需要对图像素材进行高效迭代的设计工作室与营销团队提供经过验证的工具支持。
tags: ["通用图片B"]
---

# 通用图片B.2-图生图-官方版

> **图生图** | 厂商: 谷歌 | 模型: `bza-image-b2-official` | 类型: `image-to-image`

通用图片 B.2 官方版的图生图功能提供灵活的图像编辑体验。模型支持在已有图像上进行局部修改、文字替换与场景变换，结合搜索信息增强准确性，同时保持主体一致性与文字渲染的清晰可读。该版本为需要对图像素材进行高效迭代的设计工作室与营销团队提供经过验证的工具支持。

💰 **价格**: 0.5K: 550 金币/1次 | 1K: 550 金币/1次 | 2K: 850 金币/1次 | 4K: 1100 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-b2-official/image-to-image?tab=price)

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

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |
| image_urls | array | 是 | 输入图像 |
| resolution | string | 是 | ⟨bz_enum_json⟩["0.5K","1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","4:3","1:1","3:4","9:16","21:9","3:2","2:3","5:4","4:5","4:1","1:4","8:1","1:8"]⟨/bz_enum_json⟩<br/>宽高比 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |
| web_search | boolean | 否 | 联网搜索 |


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
      "https://storage.bizyair.cn/outputs/4JECWaS3GL0QkEfu.png"
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
