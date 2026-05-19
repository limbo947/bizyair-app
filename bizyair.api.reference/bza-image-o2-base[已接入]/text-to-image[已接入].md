---
display_name: "通用图片O.2-文生图-渠道版"
category: "Text to Image"
manufacturer: "OpenAI"
price: "1K: 100 金币/1次 | 2K: 100 金币/1次 | 4K: 100 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-image-o2-base/text-to-image?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  通用图片O.2 是一个具备"思考"能力的图像生成模型，基于视觉推理架构，可在生成前进行语义规划与逻辑自检，确保画面符合物理逻辑与用户指令。模型原生支持输出 2K 级分辨率，文字渲染准确率大幅提升，支持多种宽高比选择。渠道版定价较官方版更低，适用于日常平面视觉、营销物料等创作场景。
tags: ["通用图片O", "最近上新"]
---

# 通用图片O.2-文生图-渠道版

> **文生图** | 厂商: OpenAI | 模型: `bza-image-o2-base` | 类型: `text-to-image`

通用图片O.2 是一个具备"思考"能力的图像生成模型，基于视觉推理架构，可在生成前进行语义规划与逻辑自检，确保画面符合物理逻辑与用户指令。模型原生支持输出 2K 级分辨率，文字渲染准确率大幅提升，支持多种宽高比选择。渠道版定价较官方版更低，适用于日常平面视觉、营销物料等创作场景。

💰 **价格**: 1K: 100 金币/1次 | 2K: 100 金币/1次 | 4K: 100 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-image-o2-base/text-to-image?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-o2-base/text-to-image';
  const payload = {
    "prompt": "在一座建于悬崖边的未来主义玻璃图书馆中，室内与室外同时可见。图书馆内部采用透明曲面玻璃结构、巨型悬空书架、螺旋楼梯和漂浮阅读平台。画面中央是一位年轻女性，穿着半透明丝绸礼服，礼服上带有极其复杂的刺绣、珠片和金属丝纹理。她坐在一张由透明玻璃与胡桃木构成的桌前，正在翻阅一本古老羊皮书。她的左手戴着多枚不同材质的戒指，右手轻触书页，指尖动作自然，手部结构准确。  她身旁蹲着一只长毛缅因猫，毛发层次分明，每一根毛都清晰可见，眼睛中准确反射窗外景色。桌面上摆放着透明水晶杯，杯中有半杯红酒，玻璃折射与液体折射真实；旁边有一枚金属怀表，表盘数字清晰可辨；还有几张微微卷曲的纸张，纸张边缘有自然纤维细节。  背景外部是黄昏时分的海岸悬崖。远处可见波涛翻涌的海面、飞翔的海鸥、缓慢移动的帆船和天边的晚霞。太阳接近地平线，暖橙色夕阳透过玻璃窗，在室内投射出复杂的彩色折射、反射和阴影。玻璃幕墙同时反射室内和室外环境。  画面左后方有一个机器人侍者，金属表面带有拉丝不锈钢质感和细微指纹痕迹，正端着银质托盘。右后方有一位老人坐在悬浮座椅上阅读报纸，面部皱纹、眼镜反光和报纸文字清晰自然。  室内包含多种材质并准确渲染：  透明玻璃（折射、反射、边缘高光） 金属（拉丝、镜面反射） 丝绸（柔软高光） 木材（天然纹理） 皮肤（次表面散射） 毛发（细丝层次） 纸张（纤维质感） 液体（真实透光）  摄影参数： 85mm 镜头，f/2.0，全画幅相机，HDR，电影级布光，前景、中景、远景层次丰富，景深自然，主体清晰，背景略微虚化但细节仍然完整。",
    "aspect_ratio": "3:2",
    "resolution": "2K"
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
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["1:1","2:3","3:2","4:5","5:4","3:4","4:3","16:9","9:16","21:9"]⟨/bz_enum_json⟩<br/>比例 |
| resolution | string | 否 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |


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
      "https://storage.bizyair.cn/outputs/UygKE2xbiixbRnVV.png"
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
