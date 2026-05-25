> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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
      "https://storage.bizyair.cn/outputs/j8pT4NsVFqnHTN6B.mp4"
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
