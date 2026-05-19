---
display_name: "Seedance-2.0.Fast-首尾帧-官方版"
category: "FLF to Video"
manufacturer: "字节"
price: "80金币/M Tokens"
price_url: "https://bizyair.cn/modelzoo/seedance-2-0-fast-official/flf-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  Seedance 2.0 Fast 官方版首尾帧模式在推理速度优化的基础上维持了色彩管理与构图逻辑的稳定性，可快速生成用于广告片段、片头或转场的视频内容，确保首帧与尾帧的精准对应与画面质感。
tags: ["Seedance"]
---

# Seedance-2.0.Fast-首尾帧-官方版

> **首尾帧生视频** | 厂商: 字节 | 模型: `seedance-2-0-fast-official` | 类型: `flf-to-video`

Seedance 2.0 Fast 官方版首尾帧模式在推理速度优化的基础上维持了色彩管理与构图逻辑的稳定性，可快速生成用于广告片段、片头或转场的视频内容，确保首帧与尾帧的精准对应与画面质感。

💰 **价格**: 80金币/M Tokens  [查看详情](https://bizyair.cn/modelzoo/seedance-2-0-fast-official/flf-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-fast-official/flf-to-video';
  const payload = {
    "prompt": "以首帧画面为起始：一辆真实汽车停在开阔的绿色草坪上，自然光照，草坪纹理清晰，汽车漆面反射周围环境，画面写实稳定。 镜头缓缓向前推进靠近汽车，就在镜头推近至车身中景的瞬间，汽车突然被一股无形的力量从草坪上猛然抛起——四轮离地，车身在空中翻转上升，草坪上留下四个轮胎压痕和被气流掀起的草叶碎片向四周散开。 汽车在空中持续上升，镜头跟随向上仰拍，车身在上升过程中开始发生奇异的变化：车身漆面逐渐从真实质感向玩具质感过渡，细节开始简化，真实的金属光泽慢慢转变为哑光塑料感，车窗从透明玻璃变为实心印刷图案，轮胎从真实橡胶纹理变为光滑的小比例模型轮胎。 整个缩小与材质转变过程在空中完成，汽车在最高点时已完全变为一个精致的小比例汽车模型，体积缩小至手掌大小。 模型开始缓缓下落，镜头跟随向下，落点从草坪变为一张干净的桌面或手掌，模型轻轻落下，完美停稳。 以尾帧画面收尾：汽车小模型静止停放，精致小巧，周围环境清晰，与首帧的真实汽车形成完整的现实到微缩的叙事闭环。 镜头运动全程跟随汽车运动轨迹，推进—仰拍上升—俯拍下落，流畅无剪切，一镜到底。汽车材质变化过渡自然，不突兀，如同魔法般丝滑。 超真实，物理运动轨迹自然，草叶飞散与空气扰动细节真实，材质过渡电影级，无变形穿帮，4K画质。",
    "resolution": "720p",
    "duration": "10",
    "first_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/pDiehws5Ckt4ShSZf78Lpx4R0xXMRbwj.jpg"
    ],
    "last_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/oVgEVpD9nVccw3tuy6EluvTO3Pze4rd4.jpg"
    ],
    "generate_audio": true,
    "aspect_ratio": "16:9",
    "seed": -1
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
| prompt | string | 是 | 文本长度限制：1 - 20480<br/>视频生成提示词 |
| resolution | string | 否 | ⟨bz_enum_json⟩["480p","720p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| duration | string | 否 | ⟨bz_enum_json⟩["auto","4","5","6","7","8","9","10","11","12","13","14","15"]⟨/bz_enum_json⟩<br/>视频时长（秒） |
| first_frame_url | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>首帧图片 |
| last_frame_url | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>最多支持 1 项图片，每张 30 MB |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["auto","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |


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
      "https://storage.bizyair.cn/outputs/j8pT4NsVFqnHTN6B.mp4"
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
