> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-fast-base/text-to-video';
  const payload = {
    "prompt": "一座废弃的巨型太空站漂浮在深空中，站体表面布满锈蚀痕迹与陨石撞击坑，残留的舱段缓慢旋转，断裂的金属桁架间偶尔闪烁微弱的红色警示灯。 镜头匀速向前推进，穿过太空站破损的外壳裂口，进入内部。走廊一片寂静，墙壁上的应急灯带发出断断续续的冷绿色光，照亮漂浮在零重力中的碎片——破碎的玻璃面板、飘散的文件、一只悬停在半空中的咖啡杯。 镜头继续向前滑行穿过走廊，推入中央控制室。数十块全息屏幕仍在自动运行，投射出跳动的数据流和星图，蓝色光芒映满整个房间，在金属墙面上形成流动的光影。控制台上一个倒计时正在归零，数字从红色渐变为白色。 镜头缓缓上摇，透过控制室穹顶的透明舱盖，一颗巨大的蓝色星球占据了整个视野，大气层边缘泛着金色光弧，星球表面风暴云带缓慢旋转。 整体氛围安静、孤寂、宏大。电影级画面，超真实材质与光影，金属表面反射环境光，零重力漂浮物运动轨迹自然，镜头运动全程平滑无剪切，一镜到底。轻微镜头光晕与色差，胶片颗粒感，冷色调为主偶尔暖色点缀。 音频：低沉的太空站机械嗡鸣声 + 金属轻微吱嘎声 + 偶尔的电子短路噼啪声 + 深沉悠远的弦乐渐入。",
    "resolution": "2k",
    "duration": 8,
    "generate_audio": true,
    "ratio": "16:9",
    "web_search": true,
    "return_last_frame": false,
    "seed": 0
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
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p","1080p","2k","4k"]⟨/bz_enum_json⟩<br/>视频分辨率。分为模型原生输出的分辨率（480p、720p），与基于 720p 原生生成后进行超分放大的分辨率（1080p、2k、4k）。 |
| duration | number | 是 | 取值范围：4 ~ 15<br/>视频时长（秒） |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| ratio | string | 否 | ⟨bz_enum_json⟩["adaptive","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| web_search | boolean | 否 | 启用联网搜索增强 |
| return_last_frame | boolean | 否 | 是否返回视频尾帧图片 |
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
      "https://storage.bizyair.cn/outputs/1WUbdsKJg8gsL3Wa.mp4"
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
