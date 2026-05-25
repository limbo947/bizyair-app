> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-4k-base/reference-to-video';
  const payload = {
    "prompt": "参考视频：@动漫风格办公桌面视频（作为整体画面风格、线条质感、色彩填充方式与动画运动节奏的参考，完整还原其二维动漫美学）；参考图片：@散乱水果与面包图片（作为画面主体内容参考，提取其中每一种水果与面包的形态、颜色与散落布局方式）。\n\n以@动漫风格办公桌面视频的画面风格为基准，将@散乱水果与面包图片中的所有食物元素完整转化为同款动漫风格，生成一段动漫食物桌面场景视频。\n画面整体呈现@参考视频的二维动漫美学——干净利落的黑色描边线条勾勒每一个食物轮廓，内部填充饱满的平涂色块，高光以简洁的白色几何形状表现，阴影用同色系加深的色块叠加，整体色调明亮温暖，无任何写实材质贴图。\n@散乱水果与面包图片中的每一种食物按原始散落布局转化为动漫版本摆放在桌面上，保留原图的凌乱随意感——面包堆叠的方式、水果滚落的角度、彼此叠压的位置关系全部忠实还原，只是视觉风格从写实照片完整转化为@参考视频的动漫语言。\n动态效果参考@参考视频的运动节奏与方式：\n桌面上散落的水果开始产生极轻微的呼吸感弹动，每颗水果以各自略微不同的频率缓慢起伏，如同在睡觉般微微鼓胀收缩。面包表面偶尔冒出一个小气泡随即消失，像刚出炉还在散热。切开的水果截面上，果汁以卡通方式缓慢渗出一小滴，在桌面形成一个小小的反光水渍。\n偶尔有一颗葡萄或小浆果从水果堆顶部缓缓滚落，沿桌面弹跳两下停稳，弹跳时产生动漫式的弹性形变——落地时微微压扁，弹起时略微拉长，符合动漫物理夸张感。\n一片面包片从面包堆边缘缓慢滑落，以慢动作翻转一圈平稳落在桌面，落地瞬间产生动漫式的小尘埃云和几粒面包屑向四周弹散。\n桌面参考@动漫办公桌面视频的材质表现——木纹以简洁的平行弧线表示，桌面边角有轻微的高光白边，整体干净不杂乱。\n光源从画面左上方打入，所有食物的受光面、背光面与投影方向保持统一，投影为动漫风格的深色平涂色块，边缘清晰不渐变。\n整体画面色调明亮欢快，水果的饱和色彩与面包的暖米色系形成丰富的色彩层次，与@动漫办公桌面视频的色彩风格和谐统一。\n全程镜头保持静止固定俯拍视角，画面内只有食物自身的微动作，参考@动漫办公桌面视频的静谧氛围，营造一种治愈系的动漫桌面生活感。\n音频：参考@动漫办公桌面视频的音效风格，轻柔的环境底音，水果弹跳时有卡通式的弹簧音效，面包滑落时有轻柔的摩擦声与落地的笃声，整体配以一段轻快可爱的木琴与钢片琴旋律，音调明亮治愈。\n动漫风格全程统一，食物形态与布局忠实还原参考图片，动态效果参考视频节奏，描边线条流畅，色彩填充干净，高光与阴影处理符合二维动漫美学，无写实材质，无人物，无文字。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/RwrEUiU9xeMben9Zms22d1fjviQYksu6.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/lAom8ttP9MUT5OSpQOC8NAsZX6bVFPE7.jpg"
    ],
    "duration": 10,
    "keep_original_sound": true,
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/0E2u5HXMk6sl0Ejvxw6Ywl4qTsMaG1RA.mp4"
    ],
    "sound": true,
    "aspect_ratio": "16:9",
    "multi_shot": true,
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
| image_urls | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：7<br/>参考图片输入，最多7张。 |
| duration | number | 是 | 取值范围：3 ~ 15<br/>视频时长，单位秒。 |
| keep_original_sound | boolean | 是 | 选择是否通过参数保留视频原始声音。 |
| video_urls | array | 是 | 支持格式：mp4、mov、webm<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：1<br/>参考视频。 |
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
      "https://storage.bizyair.cn/outputs/UYIuJj6kJb7Jzdwv.mp4"
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
