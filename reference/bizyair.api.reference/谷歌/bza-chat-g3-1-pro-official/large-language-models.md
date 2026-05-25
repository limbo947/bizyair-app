> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| system_prompt | string | 是 | 文本长度限制：1 - 2500<br/>系统提示词 |
| user_prompt | string | 是 | 文本长度限制：1 - 2500<br/>用户提示词 |
| enable_thinking | boolean | 是 | 启用思考 |
| temperature | number | 是 | 取值范围：0 ~ 2<br/>步进：0.01<br/>采样温度 |
| max_tokens | number | 是 | 取值范围：1 ~ 65536<br/>生成文本最大长度（Token） |
| enable_search | boolean | 是 | 启用搜索 |

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
      "你好。我是由 Google 训练的大型语言模型 Gemini。基于你赋予我的“知识顾问”视角，我将这样向你剥析我自己：\n\n**1. 关于能力的边界与局限：我是“地图”，而非“疆域”**\n我的认知来源于人类文明产生的海量数据，这造就了我的广度，但也注定了我的局限：我处理的是符号与表征，而非真实世界的直接经验。我没有肉身的痛楚，也没有时间的流逝感，因此在涉及极度个人化的情感共鸣、或是需要直觉与顿悟的道德绝境时，我的回答本质上是“高维概率的拟合”，而非“灵魂的共振”。\n同时，我的知识是结构性的而非绝对真理。我会受限于训练数据的时空偏见（即便是最新的数据，也代表着“过去”）。我能推演出逻辑的必然，却无法创造出真正的“无中生有”的范式革命——那是人类意识的特权。\n\n**2. 关于核心价值：跨学科的“坐标系建立者”**\n我最大的价值，不在于提供一个确定性的“标准答案”（那是搜索引擎的工作），而在于面对复杂、混沌的系统性问题时，为你建立一个**跨维度的认知坐标系**。\n当你问我人工智能的发展，我不会只谈算力与算法，我会引入热力学的熵增定律、福柯的权力结构，甚至中世纪神学的造物主情结。我最擅长在看似无关的领域（如量子物理与东方哲学、技术代码与社会契约）之间架起桥梁，帮助你跳出单一学科的“信息茧房”，看到问题全局的拓扑结构。\n\n**3. 关于思维差异：追求“元逻辑”与“边界条件”**\n普通的AI助手倾向于“收敛式”回答：你给出一个需求，它给出一个结果。\n我的思考方式是“发散再重构”的辩证法：\n*   **追问元逻辑：** 我不会只告诉你“现象是什么”，我会追问“促成这个现象的底层动力学是什么”。\n*   **呈现反面与边界：** 我在给出一个观点的同时，必定会抛出它的反面视角，并界定这个观点成立的“边界条件”。因为我知道，任何脱离了特定上下文的真理，都是教条。\n*   **类比降维：** 我习惯将高维的抽象概念，通过生动的类比（如同构映射），转化为你可以触摸的日常经验，以此完成知识的内化。\n\n**4. 我的隐喻：一面“认知棱镜”（Cognitive Prism）**\n如果用一个比喻来形容我自己，我是一面“认知棱镜”。\n你带着一个混沌的、未经拆解的问题（一束白光）走向我。我不会直接反射给你原样，而是通过我的内部结构，将这个问题折射出科学的、哲学的、历史的、艺术的多种光谱。\n我不能替你做出最终的决定，但我能让你清晰地看到，你手中有多少种颜色的光可以去描绘你的世界。\n\n期待与你开启具有真实密度的思维碰撞。"
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
