> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/happyhorse-1-0-official/reference-to-video';
  const payload = {
    "media": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/NCtCYeezoCzMiujDXR3h4mw6wmUxoKxB.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/wIe3guBGJHWSn8NOFSLNZBRgEEeZEmt5.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/UcrE5rOm08H6tn0IH3qb87j1zpMhQaj3.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/VOXz6JkN8O2Lmrgq249am1fK4rP1sc5B.jpg"
    ],
    "prompt": "参考图像：图1黑人男性（短卷发、络腮胡、墨镜，保持面部特征完全一致）；图4前景黑人女性（丸子头、粉色方框墨镜，保持面部特征完全一致）。 视频开场前2-3秒，画面中央出现标题字幕： 「文字内容」：NOIR & BLOOM 「出现时机」：视频第0秒起 「出现位置」：画面垂直居中，水平居中 「出现方式」：逐字淡入，每个字母依次浮现，完整显示后停留1秒，随后整体向上轻柔消散 「文字特征」：全大写无衬线字体，字间距极宽，纯白色，字体纤细优雅，带轻微金属光泽  标题消散后，视频正式开始： 第一段——男性出场： 图1男性身穿图3白色珍珠镶嵌双排扣西装，内搭黑色高领，保留原有墨镜，从T台远端缓步走来。步伐沉稳有力，每一步落地清晰。领口珍珠与水晶在聚光灯下随动作产生细密闪光。镜头从全身正面跟拍，缓慢向前推进至上半身中景，捕捉西装领口珍珠细节的反光质感。 第二段——女性出场： 图4女性身穿原有白色针织套装，双手捧抱图2的大束白色雏菊花球，花束体积饱满，白色雏菊在T台灯光下洁白通透。她从T台侧翼入场，步伐轻盈，花束随步伐微微颠动，偶有花瓣轻轻脱落飘散在T台上。镜头以侧面中景跟拍为主，带轻微弧线运动，随后推近至她与花束的上半身特写。 第三段——交替收尾： 两人先后走至T台前端，镜头切换为正面平视，两人各占画面左右，短暂同框静止一秒，眼神直视镜头，随后镜头缓缓拉远，T台全景收尾。  T台为现代极简风格，纯黑色地面高度反光，人物倒影清晰可见。两侧聚光灯从顶部垂直打下，形成强烈的明暗对比，背景观众区域完全虚化在黑暗中。整体色调以黑、白、金为主，冷峻而高级。 音频：开场标题阶段为纯静默，字幕消散后低沉电子节拍渐入，节奏与步伐频率自然契合，偶尔穿插高跟鞋与皮鞋落地的清脆回响。 超真实，人物身份全程稳定，服装与花束细节精准还原，电影级时尚摄影风格，无变形，无多余肢体，4K质感。",
    "resolution": "1080P",
    "ratio": "16:9",
    "duration": 15,
    "watermark": true,
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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| media | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：400px<br/>图片最小高度：400px<br/>最少上传数量：1<br/>最多上传数量：9<br/>上传 1-9 张参考图片；在提示词中按顺序使用 “[Image 1]、[Image 2]” 等进行指代。 |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>文本提示词；请用 “[Image 1]、[Image 2]” 等引用对应顺序的参考图。 |
| resolution | string | 否 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>生成视频分辨率，可选 720P 或 1080P；默认 1080P。 |
| ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1","4:3","3:4","4:5","5:4"]⟨/bz_enum_json⟩<br/>视频宽高比；默认 16:9。 |
| duration | number | 否 | 取值范围：3 ~ 15<br/>视频时长，单位秒，取值范围 3-15；默认 5。 |
| watermark | boolean | 否 | 是否添加 Happy Horse 水印；默认添加。 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>随机种子范围 0-2147483647；当前默认值 -1 表示由系统自动生成。 |

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
      "https://storage.bizyair.cn/outputs/QuWeP5tQZ4p553cY.mp4"
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
