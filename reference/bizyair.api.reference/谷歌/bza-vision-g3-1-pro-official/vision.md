> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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
      "这是一张极其壮观且极具电影感的非洲大草原风景图。以下是对图片内容的详细描述以及一些有趣的细节观察：\n\n### 画面主要内容：\n\n1.  **整体环境与光影**：\n    *   **时间/天气**：画面呈现出日出或日落时的“黄金时刻”（Golden Hour）。阳光柔和而温暖，透过云层洒下，给整个大草原镀上了一层金黄色的光晕。\n    *   **地貌**：广袤的草原上长满了一人高的干枯黄草。中景处散落着几棵标志性的非洲金合欢树（平顶树）。背景中隐约可见连绵起伏的山脉。\n    *   **氛围**：画面中弥漫着大量的尘土（主要由奔跑的动物扬起），在阳光的照射下形成了朦胧的丁达尔效应（耶稣光），增加了画面的神秘感和史诗感。\n\n2.  **动物群落**：\n    *   **斑马**：在画面的左侧和中左侧，有一群斑马正在小跑或奔跑。它们整齐的黑白条纹在柔和的光线下非常清晰，扬起的尘土增强了动态感。\n    *   **长颈鹿**：画面中后方聚集着多只长颈鹿。它们体型各异，有成年长颈鹿也有幼崽。有些长颈鹿正聚集在树下，似乎在进食或休息。\n    *   **大象**：在画面的右侧，有一群非洲象正在缓步前行。最前面是一头巨大的成年象，紧跟其后的是一头小象，后方还有其他成年象，甚至在更远的尘土中也能看到大象的轮廓。\n    *   **羚羊**：在画面的右下方前景处，有三只羚羊（看起来像黑尾牛羚或高角羚）正处于腾空跳跃的状态，姿态非常轻盈动感。\n\n### 有趣或不寻常的细节：\n\n1.  **“完美得不真实”的构图（极大可能是AI生成或高度合成图像）**：\n    *   **不寻常之处**：在真实的野生动物摄影中，极难在同一个画面、同一个焦平面内，以如此完美的构图同时捕捉到大象、长颈鹿、斑马和跳跃羚羊这四种代表性动物，且每一种动物都展现出其最经典的姿态（斑马奔跑、羚羊腾空、长颈鹿吃树叶、大象结伴前行）。\n    *   **光影的完美性**：光线和扬尘的分布非常均匀且具有极高的艺术戏剧性，这通常是数字艺术（Digital Art）或AI图像生成的特征，旨在呈现一个“理想化”的非洲大草原乌托邦，而不是一张自然纪实照片。\n2.  **跨物种的和谐与动静结合**：\n    *   画面巧妙地结合了“动”与“静”。左侧的斑马和前景的羚羊展现出强烈的运动感（奔跑、跳跃）；而中景的长颈鹿和右侧的大象则显得相对缓慢和宁静。不同物种在同一个空间内和谐共处，没有表现出捕食或惊慌的状态（虽然斑马和羚羊在跑，但看起来更像是在迁徙或移动，而非逃命）。\n3.  **小动物的细节**：\n    *   仔细观察左侧第二只长颈鹿旁边，有一只非常小的长颈鹿幼崽；右侧大象群中也有一头被成年象保护在身侧的小象。这些细节增加了画面的温情元素。"
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
