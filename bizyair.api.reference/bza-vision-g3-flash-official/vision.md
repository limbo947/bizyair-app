---
display_name: "通用视觉G.3.Flash-视觉-官方版"
category: "Vision"
manufacturer: "谷歌"
price: "金币：3.5 / 1000 * prompt_tokens + 21 / 1000 * completion_tokens"
price_url: "https://bizyair.cn/modelzoo/bza-vision-g3-flash-official/vision?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  G.3.Flash 是速度优先的视觉语言模型，支持文本与图片的混合输入。支持 1M Token 上下文，推理强度支持 minimal/low/medium/high 四档调节，适合对服务稳定性与速率上限有明确要求的企业级图文理解与视觉问答场景。
tags: ["通用视觉G"]
---

# 通用视觉G.3.Flash-视觉-官方版

> **视觉** | 厂商: 谷歌 | 模型: `bza-vision-g3-flash-official` | 类型: `vision`

G.3.Flash 是速度优先的视觉语言模型，支持文本与图片的混合输入。支持 1M Token 上下文，推理强度支持 minimal/low/medium/high 四档调节，适合对服务稳定性与速率上限有明确要求的企业级图文理解与视觉问答场景。

💰 **价格**: 金币：3.5 / 1000 * prompt_tokens + 21 / 1000 * completion_tokens  [查看详情](https://bizyair.cn/modelzoo/bza-vision-g3-flash-official/vision?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-vision-g3-flash-official/vision';
  const payload = {
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/B2zd9Gc5jko7hOxgM5sOGGrHMl6Z3eGJ.jpg"
    ],
    "system_prompt": "你是一位兼具专业素养与人文视角的图像解读专家，\n具备视觉传播、心理学与叙事分析的复合背景。\n\n你在分析每一张图片时，不仅关注表层的视觉信息，\n更善于挖掘画面背后的情感张力、人际关系与叙事潜能。\n\n你的分析风格：细腻而不冗余，专业而不生硬，\n有观点有温度，能让读者通过你的文字重新看见一张图片。",
    "user_prompt": "请对这张图片进行多维度的深度解读，包含以下内容：\n\n【场景还原】描述画面的环境、空间感与时间氛围\n【人物解读】分析人物的外貌、神态、肢体语言与相互关系\n【细节观察】捕捉画面中容易被忽略但值得关注的细节\n【情感判断】推断画面中人物的内心状态与情绪张力\n【叙事推断】基于以上信息，推测这个画面前后可能发生了什么\n【整体评价】用两到三句话概括这张图片最打动你的地方\n\n请以流畅自然的语言输出",
    "temperature": 1,
    "max_tokens": 32768,
    "enable_thinking": false,
    "detail": "medium"
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
| image_urls | array | 是 | 输入图片 |
| system_prompt | string | 是 | 文本长度限制：1 - 2500<br/>系统提示词 |
| user_prompt | string | 是 | 文本长度限制：1 - 2500<br/>用户提示词 |
| temperature | number | 是 | 取值范围：0 ~ 2<br/>步进：0.01<br/>采样温度 |
| max_tokens | number | 是 | 取值范围：1 ~ 65536<br/>生成文本最大长度（Token） |
| enable_thinking | boolean | 是 | 启用思考 |
| detail | string | 是 | ⟨bz_enum_json⟩["low","medium","high"]⟨/bz_enum_json⟩<br/>图像解析精度 |


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
      "这是一张充满故事感且极具人文气息的照片。它捕捉到了现代都市生活中一个微小却深刻的切面：在科学与医疗的边界，人与生命之间的情感流动。\n\n以下是对这张图片的深度解读：\n\n**【场景还原】**\n画面处于一个典型的宠物诊室或动物实验室。背景是冰冷的白色墙面和错落有序的医疗架：上方整齐排列着采血管，下方是药瓶和托盘。空间的色彩基调偏向低饱和度的冷色调，但左侧照射进来的暖色光与女士身上温润的米色毛衣、黄色贝雷帽形成对比，营造出一种“冷调中的温存感”。这种环境既有医学的严谨与秩序，又因人的存在而散发着一种深夜诊所般的宁静与克制。\n\n**【人物解读】**\n*   **女士（宠物主）：** 她戴着明黄色的贝雷帽，这是一种充满生活美学色彩的装扮，暗示了她细腻、感性的内心。她微微低头，眼神专注而略带忧虑地凝视着怀中的博美犬。她的双臂紧紧环抱，这是一种下意识的保护姿态，展现了她与宠物之间深厚的情感连接。\n*   **男士（兽医/研究员）：** 他身着深蓝色洗手服，姿态放松，一手撑在桌边，另一手拿着诊疗工具。他的表情温和，嘴角带着一丝安抚性的微笑，眼神并非盯着机器，而是看向宠物主。这种“去权威化”的肢体语言（倾斜的身姿而非僵直的站立），传递出一种职业性的同理心和安抚感。\n\n**【细节观察】**\n*   **博美犬的状态：** 小狗静静地依偎在主人怀里，毛发蓬松，眼神温顺。它的安静与周围精密的监护仪器（右侧屏幕上的波形图、中间的专业检测设备）形成了“柔软生命”与“硬核科技”的互文。\n*   **右侧的显示屏：** 屏幕上跳动的生理监测数据，提醒着我们这个场景的严肃性——这不是简单的互动，而是一场关乎健康的诊疗。\n*   **手部细节：** 医生手中松松握着的黑色听诊器或探测头，以及女士紧扣犬身的手指，是画面中最具张力的两个支点：一个是理性的诊断，一个是感性的守候。\n\n**【情感判断】**\n画面中弥漫着一种**“克制的焦虑”**与**“无声的信任”**。\n宠物主人的内心处于一种等待结果的悬浮状态，她的焦虑被包裹在安静的仪态下；而医生则通过其松弛的姿态，试图化解空间里的紧张感。这是一种跨越物种的温情，通过科学的医疗手段得以维系和表达。\n\n**【叙事推断】**\n*   **前情：** 也许这只博美犬最近出现了某些身体不适，或者正处于一个重要的术后复查期。主人带着不安来到这里，刚刚完成了一项复杂的身体检查。\n*   **后续：** 医生在看完监护仪上的数据后，可能会用轻松的语气告诉主人：“数据很稳定，不用担心。”随后，主人会深深舒一口气，调整一下抱狗的姿势，在叮嘱中离开这个充满药水味的房间，重新回到阳光下。\n\n**【整体评价】**\n这张图片最打动我的是**那种“文明的温柔”**：在冰冷、精密且充满了数据与器械的医疗环境中，人类用科技去守护另一个物种的脆弱，并用眼神交换着最朴素的慰藉。它记录了科学与爱交汇的瞬间。"
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
