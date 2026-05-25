> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/hailuo-2-3-base/text-to-video';
  const payload = {
    "prompt": "喜马拉雅山脉某座高峰的山顶棱线，镜头从山脊岩石的极近特写开始，灰黑色花岗岩表面覆着薄薄一层冰晶，在清晨第一缕阳光下泛出细碎的钻石光芒，风将岩石表面的细雪粒吹成一道流动的白色雪烟。\n镜头缓缓向后拉远，山脊全貌逐渐呈现——山顶棱线如刀锋般锐利划过画面，棱线以下是铺天盖地的云海，数万平方公里的云层在山腰处翻涌流动，如同一片慢动作的白色大洋，远处数座山峰的峰顶如孤岛般从云海中探出，彼此呼应。\n太阳从东方地平线升起，第一道光线以极低角度横扫云海表面，将云层上方染成炽烈的橘金色，云层阴影处则是深邃的蓝紫色，两种极端色彩在云海表面形成壮阔的冷暖分界线，并随着太阳角度的缓慢变化而持续移动演变。\n一股强劲山风袭来，云海表面被吹出涟漪状的波纹，如同海浪打在礁石上，云雾碎片被风卷上山脊，从棱线边缘飞速越过，在背风面瞬间消散。\n镜头最终升至极高空俯瞰，喜马拉雅山脉如一道巨龙脊背从云海中延伸至地平线尽头，与天际交汇处泛出淡金色的大气层弧光，地球曲率隐约可见。\n全程一镜到底，极缓慢的运镜，自然纪录片级别的宏大叙事。\n音频：极高海拔的风声为主体，低频厚重持续，偶尔被短促的强阵风打断，远处无任何人声与机械声，只有风与云的世界，配以极简的弦乐长音，单一音符绵延不断如同山脉本身的呼吸。\n超真实，气象级云海流体模拟，岩石冰晶材质精准，大气光学效果电影级，4K质感，无人物，无文字。",
    "resolution": "768P",
    "duration": 6,
    "prompt_optimizer": true,
    "fast_pretreatment": false,
    "aigc_watermark": false
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
| prompt_optimizer | boolean | 否 | 是否自动优化 prompt，默认开启。 |
| fast_pretreatment | boolean | 否 | 是否缩短提示词优化耗时，默认关闭。 |
| aigc_watermark | boolean | 否 | 是否在视频中添加 AI 生成水印，默认关闭。 |

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
      "https://storage.bizyair.cn/outputs/clW32AUJ3aTqVJDP.mp4"
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
