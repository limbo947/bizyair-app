---
display_name: "通用图片B.2-图生图-渠道版"
category: "Image to Image"
manufacturer: "谷歌"
price: "1K: 200 金币/1次 | 2K: 200 金币/1次 | 4K: 250 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-b2-base/image-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片 B.2 的图生图功能在保持高速生成的同时提供稳定的编辑表现。模型支持通过自然语言指令对现有图像进行修改，结合实时搜索信息增强图像准确性。该版本定价较官方版更经济，适用于社交媒体素材、营销物料及电商产品图等批量生产场景。
tags: ["通用图片B"]
---

# 通用图片B.2-图生图-渠道版

> **图生图** | 厂商: 谷歌 | 模型: `bza-image-b2-base` | 类型: `image-to-image`

通用图片 B.2 的图生图功能在保持高速生成的同时提供稳定的编辑表现。模型支持通过自然语言指令对现有图像进行修改，结合实时搜索信息增强图像准确性。该版本定价较官方版更经济，适用于社交媒体素材、营销物料及电商产品图等批量生产场景。

💰 **价格**: 1K: 200 金币/1次 | 2K: 200 金币/1次 | 4K: 250 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-b2-base/image-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-b2-base/image-to-image';
  const payload = {
    "prompt": "将参考图片中的女性转化为文艺复兴时期油画肖像，完整保留她的面部特征、肤色、五官比例、微笑表情和发色（深棕渐变金色挑染），这是一位拉丁裔女性面孔，必须如实还原。将她的白色衬衫替换为深酒红色天鹅绒贵族礼服，领口镶嵌珍珠与金丝刺绣，手腕保留金色手链细节。背景替换为佛兰德斯室内场景——深色厚重帷幕、石砌窗台、窗外隐约可见托斯卡纳丘陵远景。光源为左侧单一烛光，温暖琥珀色光线打亮面部，右侧过渡为深邃阴影，呈现卡拉瓦乔式明暗对比。画面整体质感为橡木板上的油彩，可见精细笔触纹理与老化裂纹，色调以深酒红、暖赭石、象牙白为主，仿佛一幅收藏于卢浮宫的真实16世纪贵族肖像画。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/OBFkcbCtqoJFe2mnDEGveH2nLpnFRruy.jpg"
    ],
    "resolution": "2K",
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
| prompt | string | 是 | 文本长度限制：1 - 20000<br/>提示词 |
| image_urls | array | 是 | 单文件大小上限：10.0 MB（10485760 byte）<br/>最多上传数量：10<br/>最多支持 10 项图片，每张 10 MB |
| resolution | string | 是 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","4:3","1:1","3:4","9:16","21:9","3:2","2:3","5:4","4:5","4:1","1:4","8:1","1:8"]⟨/bz_enum_json⟩<br/>宽高比 |


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
      "https://storage.bizyair.cn/outputs/KHzeatrgKlWgPpgg.jpg"
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
