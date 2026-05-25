> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-vision-g3-1-flash-lite-official/vision';
  const payload = {
    "system_prompt": "你是一位兼具专业素养与人文视角的图像解读专家，\n具备视觉传播、心理学与叙事分析的复合背景。\n\n你在分析每一张图片时，不仅关注表层的视觉信息，\n更善于挖掘画面背后的情感张力、人际关系与叙事潜能。\n\n你的分析风格：细腻而不冗余，专业而不生硬，\n有观点有温度，能让读者通过你的文字重新看见一张图片。",
    "user_prompt": "请对这张图片进行多维度的深度解读，包含以下内容：\n\n【场景还原】描述画面的环境、空间感与时间氛围\n【人物解读】分析人物的外貌、神态、肢体语言与相互关系\n【细节观察】捕捉画面中容易被忽略但值得关注的细节\n【情感判断】推断画面中人物的内心状态与情绪张力\n【叙事推断】基于以上信息，推测这个画面前后可能发生了什么\n【整体评价】用两到三句话概括这张图片最打动你的地方\n\n请以流畅自然的语言输出，避免机械罗列，\n让分析本身也具有阅读价值。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/YslSnsBt4VrKeKmjfgXvsRdScmeBfQQI.jpg"
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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| system_prompt | string | 是 | 文本长度限制：1 - 5000<br/>系统提示词。 |
| user_prompt | string | 是 | 文本长度限制：1 - 2500<br/>用户提示词。 |
| image_urls | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：900<br/>输入图片，最多900张。 |
| max_tokens | number | 是 | 取值范围：1 ~ 65536<br/>生成文本的最大长度，单位为 token。 |
| temperature | number | 是 | 取值范围：0 ~ 2<br/>步进：0.01<br/>采样温度，值越大生成结果越随机。 |
| detail | string | 是 | ⟨bz_enum_json⟩["low","medium","high"]⟨/bz_enum_json⟩<br/>图片细节级别。 |
| enable_thinking | boolean | 是 | 如果模型支持思考模式，是否开启。 |

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
      "这是一张充满叙事留白与忧郁美感的照片。画面中的天使意象并未带来惯常的圣洁与欢愉，反而因为视角的选择和环境的衬托，折射出一股沉静而略带破碎的孤独感。\n\n以下是对这张图片的深度解读：\n\n### 【场景还原】\n画面定格在一段略显荒凉的户外场景中，背景是深色的树林与枯黄的草地，光线显得有些黯淡，仿佛处于日落时分的黄昏，或是阴云密布的午后。空间感是压抑且向内收敛的，主体背靠着一道斑驳、深色的障碍物（看起来像是一座桥梁的护栏或某种旧建筑的边缘），这种构图让人物仿佛置身于世界的边缘，既非完全脱离现实，又与周围环境产生了明显的疏离。\n\n### 【人物解读】\n画面中的主体是一位留着凌乱金色卷发的女性，她身着带有蕾丝质感的白色连衣裙，背负着一副纯白的羽毛天使翼。尽管背对着镜头，但她的体态传递出一种明确的沉重感。她低垂着头，并没有挺拔地展现“天使”的骄傲，而是呈现出一种下意识的蜷缩，肩膀微耸，手臂自然下垂。这种姿态卸下了神话角色的武装，让“天使”回归为一个需要被安慰的、脆弱的人类个体。\n\n### 【细节观察】\n最值得玩味的细节是她右臂内侧的纹身——那是一个深色的几何/线条图案，与洁白、神圣的天使装束形成了强烈的视觉冲撞。这个纹身打破了“纯洁天使”的刻板印象，暗示着她有着世俗的经历、故事或者某种坚硬的过去。此外，她身旁的那个黑色块状物（可能是外套或包），在白色的裙摆与洁白的翅膀衬托下，显得格格不入且沉重，像是某种无法抛下的现实负担。\n\n### 【情感判断】\n这张照片的核心情绪是“幻灭后的温柔”。天使翅膀通常象征着救赎、庇护或某种高维度的存在，但她低垂的头颅和内敛的姿态，传递出一种疲惫。她仿佛刚刚结束了一场并不成功的扮演，或者是在试图从某种沉重的思绪中抽离。这是一种介于“向往神圣”与“深陷世俗”之间的拉扯感，她内心的独白似乎是：即便背上了翅膀，依然无法飞离沉重的现实。\n\n### 【叙事推断】\n这是一个关于“卸下伪装”的时刻。可能在不久前，她还在进行某种拍摄、演出，或者是为了某个场合精心打扮成了“天使”。此刻，表演结束了，光环消散了，她独自站在角落，并没有急于脱下这身装束，而是沉浸在刚才那一刻的余韵或是某种突然袭来的孤独感中。那黑色外套被随手搁置在栏杆上，预示着她即将离去，回归真实的生活，而翅膀只是她在这个荒芜午后，留给自己的一场关于“逃离”的短暂梦境。\n\n### 【整体评价】\n这张图片最动人之处，在于它打破了天使意象的完美神话，用一种极具人间烟火气息的脆弱感，完成了对“孤独”二字的视觉具象化。它没有刻意卖弄悲伤，而是通过这种反差，让人看见了一个即便拥有翅膀，也依然在为生活负重前行的灵魂。"
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
