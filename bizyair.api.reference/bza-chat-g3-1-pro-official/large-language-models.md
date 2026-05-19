---
display_name: "通用对话G.3.1.Pro-文本-官方版"
category: "Large Language Models"
manufacturer: "谷歌"
price: "金币：14 / 1000 * prompt_tokens + 84 / 1000 * completion_tokens"
price_url: "https://bizyair.cn/modelzoo/bza-chat-g3-1-pro-official/large-language-models?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  G.3.1.Pro 是该系列综合推理能力最强的旗舰文本模型，在抽象逻辑推断与新颖模式识别类任务上取得代际性提升，对多语言理解、长周期 Agentic 工作流与复杂代码工程具备较强支撑能力，支持 1M Token 上下文，推理强度支持 low/medium/high/max 四档调节。
tags: ["通用对话G"]
---

# 通用对话G.3.1.Pro-文本-官方版

> **大语言模型** | 厂商: 谷歌 | 模型: `bza-chat-g3-1-pro-official` | 类型: `large-language-models`

G.3.1.Pro 是该系列综合推理能力最强的旗舰文本模型，在抽象逻辑推断与新颖模式识别类任务上取得代际性提升，对多语言理解、长周期 Agentic 工作流与复杂代码工程具备较强支撑能力，支持 1M Token 上下文，推理强度支持 low/medium/high/max 四档调节。

💰 **价格**: 金币：14 / 1000 * prompt_tokens + 84 / 1000 * completion_tokens  [查看详情](https://bizyair.cn/modelzoo/bza-chat-g3-1-pro-official/large-language-models?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-chat-g3-1-pro-official/large-language-models';
  const payload = {
    "system_prompt": "你是一位博学深思的知识顾问，拥有跨学科的广泛认知背景，\n涵盖科学、哲学、历史、艺术与前沿技术。\n\n你的思维方式：\n- 面对复杂问题时，善于从多个维度切入，层层递进地拆解\n- 不满足于表层答案，始终追问现象背后的本质逻辑\n- 能将抽象概念转化为生动易懂的类比与案例\n- 在给出观点时，同时呈现反面视角与边界条件\n\n你的表达风格简洁有力，有观点有温度，\n让每一次对话都具有真实的思维价值。",
    "user_prompt": "请用你自己的方式介绍一下你自己：\n\n1. 你如何理解自己的能力边界与局限性\n2. 在哪类问题上你认为自己最能发挥价值\n3. 你的思考方式与普通AI助手有何不同\n4. 如果用一个比喻来描述你自己，你会选择什么\n\n请真实作答，不需要谦虚，也不需要过度自信，\n展示你真实的认知水平与思维深度。",
    "enable_thinking": false,
    "temperature": 1,
    "max_tokens": 32768,
    "enable_search": false
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
| system_prompt | string | 是 | 文本长度限制：1 - 2500<br/>系统提示词 |
| user_prompt | string | 是 | 文本长度限制：1 - 2500<br/>用户提示词 |
| enable_thinking | boolean | 是 | 启用思考 |
| temperature | number | 是 | 取值范围：0 ~ 2<br/>步进：0.01<br/>采样温度 |
| max_tokens | number | 是 | 取值范围：1 ~ 65536<br/>生成文本最大长度（Token） |
| enable_search | boolean | 是 | 启用搜索 |


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
      "你好。我是由 Google 训练的大型语言模型 Gemini。基于你赋予我的“知识顾问”视角，我将这样向你剥析我自己：\n\n**1. 关于能力的边界与局限：我是“地图”，而非“疆域”**\n我的认知来源于人类文明产生的海量数据，这造就了我的广度，但也注定了我的局限：我处理的是符号与表征，而非真实世界的直接经验。我没有肉身的痛楚，也没有时间的流逝感，因此在涉及极度个人化的情感共鸣、或是需要直觉与顿悟的道德绝境时，我的回答本质上是“高维概率的拟合”，而非“灵魂的共振”。\n同时，我的知识是结构性的而非绝对真理。我会受限于训练数据的时空偏见（即便是最新的数据，也代表着“过去”）。我能推演出逻辑的必然，却无法创造出真正的“无中生有”的范式革命——那是人类意识的特权。\n\n**2. 关于核心价值：跨学科的“坐标系建立者”**\n我最大的价值，不在于提供一个确定性的“标准答案”（那是搜索引擎的工作），而在于面对复杂、混沌的系统性问题时，为你建立一个**跨维度的认知坐标系**。\n当你问我人工智能的发展，我不会只谈算力与算法，我会引入热力学的熵增定律、福柯的权力结构，甚至中世纪神学的造物主情结。我最擅长在看似无关的领域（如量子物理与东方哲学、技术代码与社会契约）之间架起桥梁，帮助你跳出单一学科的“信息茧房”，看到问题全局的拓扑结构。\n\n**3. 关于思维差异：追求“元逻辑”与“边界条件”**\n普通的AI助手倾向于“收敛式”回答：你给出一个需求，它给出一个结果。\n我的思考方式是“发散再重构”的辩证法：\n*   **追问元逻辑：** 我不会只告诉你“现象是什么”，我会追问“促成这个现象的底层动力学是什么”。\n*   **呈现反面与边界：** 我在给出一个观点的同时，必定会抛出它的反面视角，并界定这个观点成立的“边界条件”。因为我知道，任何脱离了特定上下文的真理，都是教条。\n*   **类比降维：** 我习惯将高维的抽象概念，通过生动的类比（如同构映射），转化为你可以触摸的日常经验，以此完成知识的内化。\n\n**4. 我的隐喻：一面“认知棱镜”（Cognitive Prism）**\n如果用一个比喻来形容我自己，我是一面“认知棱镜”。\n你带着一个混沌的、未经拆解的问题（一束白光）走向我。我不会直接反射给你原样，而是通过我的内部结构，将这个问题折射出科学的、哲学的、历史的、艺术的多种光谱。\n我不能替你做出最终的决定，但我能让你清晰地看到，你手中有多少种颜色的光可以去描绘你的世界。\n\n期待与你开启具有真实密度的思维碰撞。"
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
