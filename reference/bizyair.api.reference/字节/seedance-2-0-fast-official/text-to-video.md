> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-fast-official/text-to-video';
  const payload = {
    "prompt": "北极深冬，镜头从极地海面冰层的裂缝特写开始，冰面纹理如白色大理石，裂缝深处透出幽蓝色的冰川内光，海水在裂缝底部黑暗涌动。镜头缓缓向后拉远，一座巨型冰川全貌逐渐进入视野——高度相当于二十层楼，表面呈现深浅不一的蓝白色层次，千万年压缩的气泡在冰体内部形成乳白色纹路，冰川正面悬崖如刀削般垂直，底部被海浪长年侵蚀形成深邃的拱形海蚀洞，洞内透出神秘的幽蓝光芒。沉默持续数秒后，冰川顶部边缘突然出现一道细微裂缝并迅速延伸——巨大的冰川前壁开始崩塌，数千吨冰体以极其缓慢的速度向前倾倒，像一座大厦在倒塌，整个过程以慢动作呈现。冰体在空中解体成无数大小不一的冰块，每一块冰在阳光折射下都闪烁着蓝白色光芒，冰晶碎片如钻石雨向四周迸射。冰川入水瞬间，镜头切换至水线角度——半水下半水上的分割视角，水上是冰块砸落激起的巨浪与冰晶飞溅，水下是冰川沉入海中的庞大蓝色轮廓，气泡从冰体各处涌出形成银色气泡瀑布向上升腾，海水被激荡成深浅交织的蓝绿色漩涡。巨浪平息后，镜头缓缓升至高空俯瞰——原来冰川所在位置只剩下漂散的碎冰群，在极地蓝黑色海面上缓慢漂移，夕阳从地平线斜射，将每一块浮冰染成橘金色，整片海面如同碎裂的镜子反射着最后的余晖。极地天空从冰蓝色过渡至深橘色，极光隐约在高空边缘泛出淡绿色光带，与夕阳余晖形成冷暖交织的壮观天象。全程一镜到底，镜头从微观冰裂纹到宏观极地全景的完整叙事，无剪切。冰体物理崩裂效果超真实，水花飞溅与气泡运动符合真实流体力学，冰川内部蓝色光感精准还原。音频：开场极地寂静，只有微风与远处海浪低鸣，崩塌前一秒出现冰体内部深沉的低频震裂声，崩塌瞬间是雷鸣般的巨响与冰块碎裂的高频脆响交织，入水后是深沉的水下轰鸣与气泡涌动声，最终平息为极地风声与浮冰碰撞的细碎叮响，配以一段大提琴独奏，音符如冰裂般缓慢深沉。超真实，BBC自然纪录片级别画质，冰川材质光学透射效果精准，水体物理模拟电影级，慢动作崩塌过程帧率丝滑，4K质感，无人物，无文字。",
    "resolution": "720p",
    "duration": "8",
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
      "https://storage.bizyair.cn/outputs/6JL6mlwzuViLkvA8.mp4"
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
