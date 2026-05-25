> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/happyhorse-1-0-official/text-to-video';
  const payload = {
    "prompt": "深海发光生物，拖着细长的生物荧光尾迹，无声漂过镜头前方，随即消失在黑暗中。镜头开始极缓慢地向前推进。一座巨大的深海热泉烟囱群逐渐从黑暗中浮现——高达数十米的黑色岩柱从海床耸立而起，顶部喷涌着滚烫的黑色热液，与冰冷的海水相遇后急速扩散，形成翻腾的黑色烟雾柱，在微弱的蓝色环境光中缓慢上升蔓延。烟囱底部密密麻麻附着着雪白的管虫群落，随着热液水流轻微摆动，像一片倒置的麦田。几只通体透明的虾在烟囱壁上缓慢爬行，内脏隐约可见。一条细长的银色鱼从镜头前方无声游过，身体两侧的发光器官发出规律性的冷白色脉冲。镜头继续推进，绕过最高的烟囱缓缓侧移，视野之外的黑暗深处，一个巨大的轮廓正在极其缓慢地移动——体型庞大，边缘模糊，看不清形态，只有轮廓边缘偶尔透出隐约的生物荧光纹路，随即再度沉入黑暗，消失不见。镜头停在热泉群的全景，俯仰之间尽是黑暗与微光的交织。海床上薄薄一层白色细菌席绵延至视野尽头，几朵巨大的深海水母无声漂过中景，伞盖边缘的触须拖出长长的荧光丝线。一切都在极度缓慢地运动，安静得像另一个宇宙。全程一镜到底，镜头运动极缓，如同潜水艇在深海中无声巡游。水体折射与散射效果真实，微粒悬浮物在镜头光线中清晰可见，生物荧光在完全黑暗背景下发光效果细腻真实，热液烟雾的流体动力学自然准确。音频：几乎无声的深海底噪为基底，极低频的压力感嗡鸣，偶尔热液喷涌的细微水流声，远处不明生物低沉绵长的声波震动，以及一段极简的单音符弦乐，音符与音符之间间隔极长，营造出深不见底的孤寂感。超真实，BBC深海纪录片画质，参考《蓝色星球II》深海章节视觉风格，生物细节极度精准，水体光学效果电影级，色调以极深的靛蓝与墨黑为主，荧光生物的冷蓝白绿色为唯一光源，4K质感。",
    "resolution": "1080P",
    "ratio": "16:9",
    "duration": 5,
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>视频生成提示词 |
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
      "https://storage.bizyair.cn/outputs/ccUYLMHWFYIR7gyZ.mp4"
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
