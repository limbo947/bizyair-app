> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-std-base/text-to-video';
  const payload = {
    "prompt": "深秋雨夜的京都，镜头从一条铺满落叶的石板小径开始，湿润的青石板在路灯昏黄光晕中泛出深墨绿色，每一块石板缝隙里都积着雨水，将头顶的红色枫叶倒映成扭曲的火焰形状。细雨无声落下，雨滴敲击石板激起极细密的水雾，落在枫叶上顺着叶脉滑落聚成水珠，悬在叶尖颤而不落，在路灯光下如一颗颗琥珀色的液态宝石。镜头缓缓沿石板小径向前推进，两侧是高大的枫树，树冠在头顶交织成拱形的叶廊——深红、橘红、金黄、暗紫的叶片密密层叠，雨水将每一片叶子的颜色加深饱和至近乎不真实的程度，整条小径如同穿行在燃烧的隧道之中。前方出现一座朱红色的鸟居，雨水沿鸟居立柱流淌形成细线，朱红色漆面在雨中的光泽更加饱满深沉，鸟居之后是一条蜿蜒向上的石阶，石阶两侧的石灯笼逐一亮起，暖黄色烛光透过石灯笼的方形窗格投出十字形光影在石阶上。镜头穿过鸟居沿石阶缓缓上升，视野逐渐开阔，可以看到枫树林在夜雨中的全貌——整片山坡被深红与金黄覆盖，石灯笼的暖光点缀其间，远处山顶隐约可见一座神社的飞檐轮廓在雨雾中若隐若现。一阵风过，枫叶从树冠大片脱落，在路灯光柱中翻旋飘落，与雨丝交织成一幅流动的秋色画卷，落叶铺满石阶，将朱红与金黄层层叠叠堆积在石灯笼底座旁。镜头最终停在神社飞檐的近景仰拍，雨水从瓦片边缘成排滴落，在灯光中形成晶莹的水帘，枫叶不时从画面边缘飘入又飘出，远处山坡的枫林在雨雾中成为一片朦胧的暖色光晕。全程一镜到底，镜头沿石径—鸟居—石阶—神社的空间序列匀速推进，带极轻微手持呼吸感，如同独自漫步其中的第一人称体验。",
    "duration": 5,
    "sound": true,
    "aspect_ratio": "16:9",
    "multi_shot": false,
    "shot_type": "intelligence",
    "multi_prompt": ""
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词。 |
| duration | number | 是 | 取值范围：1 ~ 15<br/>视频时长，单位秒。 |
| sound | boolean | 是 | 是否开启声音。 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1"]⟨/bz_enum_json⟩<br/>输出宽高比。 |
| multi_shot | boolean | 否 | 是否生成多镜头视频。 |
| shot_type | string | 否 | ⟨bz_enum_json⟩["customize","intelligence"]⟨/bz_enum_json⟩<br/>镜头类型。customize为自定义，intelligence为智能。 |
| multi_prompt | string | 否 | 文本长度限制：1 - 10000<br/>多镜头提示词配置，JSON格式。 |

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
      "https://storage.bizyair.cn/outputs/GqVZr9xsK7DGNxAF.mp4"
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
