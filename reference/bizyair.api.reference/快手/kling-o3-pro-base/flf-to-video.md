> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-pro-base/flf-to-video';
  const payload = {
    "prompt": "以首帧画面为起始：近距离平视角度的沙漠与海滩交界处，镜头贴近地面，前景是粗粝的沙漠沙粒与细腻的海滩白沙在此处交汇融合，两种质感的沙子形成清晰的过渡边界线，沙漠一侧沙粒粗糙偏暖橘色，海滩一侧细腻洁白，浅浅的海水从右侧漫入，将海滩白沙浸湿形成深浅交替的湿沙纹路。\n极浅的景深将前景沙粒纹理放大至清晰可见每一粒的轮廓，中景的沙漠与海岸线在暖光下虚化为金色与蓝色的色块，远处天际线模糊在海天交界的光晕中。微风从海面吹来，将海滩细沙吹起一道贴地流动的沙烟，越过沙漠与海滩的交界线向沙漠一侧漂去。\n镜头继续向后向上拉远，单个沙丘的完整形态进入视野，沙丘脊线在侧光下形成极细的金色轮廓线，明暗两面对比强烈，沙丘的流线造型在大光比下如同抽象雕塑。\n镜头持续上升，更多沙丘进入视野，沙漠的全貌逐渐铺开，沙丘群连绵起伏延伸至地平线，风在沙面上吹出流动的细沙烟，整片沙漠在黄金时段的低角度阳光下呈现饱满的暖金色。\n以尾帧画面收尾：广袤的沙漠全景，沙丘连绵至天际，天空澄净，阳光金黄，风沙轻扬，与首帧那一粒发着晶体光芒的沙子形成从微观到宏观的完整叙事闭环。\n全程一镜到底，拉远过程匀速平滑，尺度从毫米级跨越至公里级，镜头运动如同上帝视角缓缓升空。\n音频：开场是几乎无声的微观世界，极轻微的空气震动底噪，随镜头拉远风声逐渐从无到有由弱到强，沙粒摩擦声在中段若有若无，沙漠全景出现时风声已成为主体，配以一段从单音符逐渐丰富为完整旋律的弦乐，与画面的尺度扩张同步生长。\n超真实，沙粒晶体光学效果微距精准，沙面纹路与沙丘造型写实，黄金时段大气光线完整，从微观到宏观的尺度过渡流畅无突兀，4K质感，无人物，无文字。",
    "first_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/Slo1mSJobwq6vhGYC8AN5KF6xvTVw5Q6.jpg"
    ],
    "duration": 5,
    "sound": true,
    "last_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/uv14rXXv8MrNudaz6j9PR1CYENl6hHxL.jpg"
    ],
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
| first_frame_image | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：1<br/>最多上传数量：1<br/>首帧图片。 |
| duration | number | 是 | 取值范围：3 ~ 15<br/>视频时长，单位秒。 |
| sound | boolean | 是 | 是否开启声音。 |
| last_frame_image | array | 否 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：0<br/>最多上传数量：1<br/>尾帧图片，选填。 |
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
      "https://storage.bizyair.cn/outputs/LIEBGbT7AEhTYMmT.mp4"
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
