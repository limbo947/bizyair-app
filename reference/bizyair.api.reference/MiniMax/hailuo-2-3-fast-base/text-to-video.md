> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/hailuo-2-3-fast-base/text-to-video';
  const payload = {
    "prompt": "深夜十二点的东京某条小巷，镜头从巷口的雨幕开始，细密的雨丝在昏黄路灯下如金色细线垂落，青石板地面积水倒映出一盏红色灯笼的扭曲倒影。\n镜头缓缓沿小巷向前推进，两侧是紧密排列的旧木建筑，窗缝透出昏黄灯光，一块褪色的手写木牌在风中轻微摇摆。镜头在一扇拉开一半的木格推拉门前停下——门缝里涌出白色蒸汽，夹杂着浓郁的猪骨汤香气几乎可以通过画面感受到。\n镜头穿过木门推入室内，是一个极小的拉面馆，仅有八个吧台座位沿一字排开，头顶是密密麻麻钉满了写满名字的木签，黄铜挂钩上挂着常客的私人筷子盒，墙壁被多年的蒸汽熏成深琥珀色，每一道木纹都浸透了时间。\n吧台后只有一位老师傅，六十多岁，白色棉布围裙，头上扎着白色棉布巾，背对镜头专注操作——右手持长筷在沸腾的大锅里挑动面条，左手同时将切好的叉烧整齐码入碗中，动作不快但极度精准，几十年重复同一套动作磨出的肌肉记忆。\n镜头缓缓推近至吧台，一碗拉面从老师傅手中滑出放在台面上——汤面冒出的蒸汽在昏黄灯光中形成螺旋上升的光柱，浓白的骨汤表面漂着金黄色的鸡油花，叉烧肉片剖面粉白相间纹路清晰，笋干与葱花点缀其上，一颗溏心蛋被切开摆放，蛋黄呈现完美的流心橘色。\n镜头最终停在这碗拉面的极近微距特写，蒸汽持续升腾，汤面轻微晃动，背景中老师傅的白色围裙虚化为温暖的光晕。窗外雨声隐约传入，偶尔一声远处电车驶过的轰鸣，随即归于这个小空间特有的安静。\n全程一镜到底，从室外雨夜到室内温暖的空间过渡如同走进另一个世界，镜头运动匀速平滑带轻微手持呼吸感。\n音频：室外雨声与风声作为底层环境音贯穿全程，推门入室后雨声变远，取而代之的是大锅沸腾的咕嘟声、筷子碰锅边的金属轻响、木碗落在台面的笃声，以及老师傅偶尔的轻微呼气声，整体安静治愈，配以一段极简的单音符钢琴旋律若有若无地藏在环境音之下。",
    "resolution": "768P",
    "duration": 6
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
| prompt | string | 是 | 文本长度限制：1 - 2000<br/>视频生成提示词，最大 2000 字符；支持海螺运镜指令写法。 |
| resolution | string | 是 | ⟨bz_enum_json⟩["768P","1080P"]⟨/bz_enum_json⟩<br/>支持 768P、1080P；当时长为 10 秒时仅支持 768P。 |
| duration | number | 是 | ⟨bz_enum_json⟩["6","10"]⟨/bz_enum_json⟩<br/>支持 6 秒、10 秒；1080P 仅支持 6 秒。 |

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
    "videos": [
      "https://storage.bizyair.cn/outputs/4MwHgnMHEjaiiJv1.mp4"
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
| outputs.videos | array | 视频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
