---
display_name: "通用视觉G.3.1.Pro-视觉-官方版"
category: "Vision"
manufacturer: "谷歌"
price: "金币：14 / 1000 * prompt_tokens + 84 / 1000 * completion_tokens"
price_url: "https://bizyair.cn/modelzoo/bza-vision-g3-1-pro-official/vision?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  G.3.1.Pro 是该系列综合能力最强的旗舰视觉语言模型，支持文本与图片的混合输入。在图文推理与视觉指令遵循方面取得代际性提升，支持 1M Token 上下文，推理强度支持 low/medium/high/max 四档调节，适合对视觉推理精度与企业级服务稳定性均有要求的正式生产环境。
tags: ["通用视觉G"]
---

# 通用视觉G.3.1.Pro-视觉-官方版

> **视觉** | 厂商: 谷歌 | 模型: `bza-vision-g3-1-pro-official` | 类型: `vision`

G.3.1.Pro 是该系列综合能力最强的旗舰视觉语言模型，支持文本与图片的混合输入。在图文推理与视觉指令遵循方面取得代际性提升，支持 1M Token 上下文，推理强度支持 low/medium/high/max 四档调节，适合对视觉推理精度与企业级服务稳定性均有要求的正式生产环境。

💰 **价格**: 金币：14 / 1000 * prompt_tokens + 84 / 1000 * completion_tokens  [查看详情](https://bizyair.cn/modelzoo/bza-vision-g3-1-pro-official/vision?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-vision-g3-1-pro-official/vision';
  const payload = {
    "system_prompt": "你是一个能分析图像的AI助手。请仔细观察图像，并根据用户的问题提供详细、准确的描述。",
    "user_prompt": "请描述这张图片的内容，并指出任何有趣或不寻常的细节。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/l2MTRmrinWx52z0fBlON2I6XICAO0YBK.png?uploads="
    ],
    "max_tokens": 32768,
    "temperature": 1,
    "detail": "high",
    "enable_thinking": false
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
| system_prompt | string | 是 | 文本长度限制：1 - 5000<br/>系统提示词。 |
| user_prompt | string | 是 | 文本长度限制：1 - 2500<br/>用户提示词。 |
| image_urls | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：900<br/>输入图片，最多900张。 |
| max_tokens | number | 是 | 取值范围：1 ~ 65536<br/>生成文本的最大长度，单位为 token。 |
| temperature | number | 是 | 取值范围：0 ~ 2<br/>步进：0.01<br/>采样温度，值越大生成结果越随机。 |
| detail | string | 是 | ⟨bz_enum_json⟩["low","medium","high"]⟨/bz_enum_json⟩<br/>图片细节级别。 |
| enable_thinking | boolean | 是 | 如果模型支持思考模式，是否开启。 |


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
      "这是一张极其壮观且极具电影感的非洲大草原风景图。以下是对图片内容的详细描述以及一些有趣的细节观察：\n\n### 画面主要内容：\n\n1.  **整体环境与光影**：\n    *   **时间/天气**：画面呈现出日出或日落时的“黄金时刻”（Golden Hour）。阳光柔和而温暖，透过云层洒下，给整个大草原镀上了一层金黄色的光晕。\n    *   **地貌**：广袤的草原上长满了一人高的干枯黄草。中景处散落着几棵标志性的非洲金合欢树（平顶树）。背景中隐约可见连绵起伏的山脉。\n    *   **氛围**：画面中弥漫着大量的尘土（主要由奔跑的动物扬起），在阳光的照射下形成了朦胧的丁达尔效应（耶稣光），增加了画面的神秘感和史诗感。\n\n2.  **动物群落**：\n    *   **斑马**：在画面的左侧和中左侧，有一群斑马正在小跑或奔跑。它们整齐的黑白条纹在柔和的光线下非常清晰，扬起的尘土增强了动态感。\n    *   **长颈鹿**：画面中后方聚集着多只长颈鹿。它们体型各异，有成年长颈鹿也有幼崽。有些长颈鹿正聚集在树下，似乎在进食或休息。\n    *   **大象**：在画面的右侧，有一群非洲象正在缓步前行。最前面是一头巨大的成年象，紧跟其后的是一头小象，后方还有其他成年象，甚至在更远的尘土中也能看到大象的轮廓。\n    *   **羚羊**：在画面的右下方前景处，有三只羚羊（看起来像黑尾牛羚或高角羚）正处于腾空跳跃的状态，姿态非常轻盈动感。\n\n### 有趣或不寻常的细节：\n\n1.  **“完美得不真实”的构图（极大可能是AI生成或高度合成图像）**：\n    *   **不寻常之处**：在真实的野生动物摄影中，极难在同一个画面、同一个焦平面内，以如此完美的构图同时捕捉到大象、长颈鹿、斑马和跳跃羚羊这四种代表性动物，且每一种动物都展现出其最经典的姿态（斑马奔跑、羚羊腾空、长颈鹿吃树叶、大象结伴前行）。\n    *   **光影的完美性**：光线和扬尘的分布非常均匀且具有极高的艺术戏剧性，这通常是数字艺术（Digital Art）或AI图像生成的特征，旨在呈现一个“理想化”的非洲大草原乌托邦，而不是一张自然纪实照片。\n2.  **跨物种的和谐与动静结合**：\n    *   画面巧妙地结合了“动”与“静”。左侧的斑马和前景的羚羊展现出强烈的运动感（奔跑、跳跃）；而中景的长颈鹿和右侧的大象则显得相对缓慢和宁静。不同物种在同一个空间内和谐共处，没有表现出捕食或惊慌的状态（虽然斑马和羚羊在跑，但看起来更像是在迁徙或移动，而非逃命）。\n3.  **小动物的细节**：\n    *   仔细观察左侧第二只长颈鹿旁边，有一只非常小的长颈鹿幼崽；右侧大象群中也有一头被成年象保护在身侧的小象。这些细节增加了画面的温情元素。"
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
