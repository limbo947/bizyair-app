> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-fast-base/reference-to-video';
  const payload = {
    "prompt": "参考图像：一位佩戴首饰的女性（项链、耳环、配饰），必须保持人物身份一致，包括脸型、五官、发型以及所有首饰完全不改变。 该女性身穿剪裁考究的高领连衣长裙，面料质感厚实挺括，整体造型端庄大气，符合高级时装编辑风格。 该女性在城市街道上自信地行走，姿态优雅从容，步伐自然流畅，微风轻拂发丝和裙摆，服装与首饰随动作自然摆动并产生真实反光。 色彩处理：选择性色彩（Selective Color）风格。整个画面环境——街道、建筑、天空、行人、车辆——全部为黑白灰单色调。唯独该女性保持完整彩色，包括肤色、发色、服装颜色、首饰光泽全部为鲜明色彩。通过黑白与彩色的强烈对比，使女性人物成为画面唯一视觉焦点。 镜头运动：正面全身跟拍为主，镜头随人物匀速后退，保持人物始终居中构图完整，带电影手持质感和自然呼吸感，偶尔缓慢推近至上半身展示首饰细节与色彩反差，再平滑拉回全身。 灯光为阴天柔和漫射光，均匀照亮人物，首饰产生细腻高光，黑白背景中的光影层次丰富，呈现银盐胶片般的黑白质感。 背景为城市老街道，浅景深虚化，黑白色调下可见模糊的建筑轮廓、路灯、行人剪影，营造复古电影氛围。 音频：安静的城市环境音（远处回声、微风）+ 缓慢钢琴旋律或弦乐 + 清晰的高跟鞋脚步声回响在街道上。 超真实，无变形，无多余肢体，人物身份与服装全程稳定一致，电影级画面，轻微胶片颗粒感，自然运动模糊，高级艺术摄影风格。",
    "resolution": "2k",
    "duration": 5,
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/gXBu4orjhEdaI4zCgpdeUtSxlK1GnApR.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/eWoOoU3Wjacfrx5m20HFiybmANes9EAt.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/LnpdPLawlRygIgWiQfKmPMugcjWTR1Sc.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/DvxR1TEdjbfxEazDHxHEFrXYsAYA1w8X.jpg"
    ],
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/PkXE131sZwr1sWV1IPfy86cqsz2zAbVj.mp4"
    ],
    "audio_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260511/EHXjgQDsaB1bwAuyHR6yaiRPThIXVuxW.mp3"
    ],
    "generate_audio": true,
    "ratio": "16:9",
    "return_last_frame": false,
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
| prompt | string | 是 | 文本长度限制：1 - 20480<br/>文本长度限制: 1 - 20480 视频生成提示词 |
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p","1080p","2k","4k"]⟨/bz_enum_json⟩<br/>视频分辨率。分为模型原生输出的分辨率（480p、720p、native1080p），与基于 720p 原生生成后进行超分放大的分辨率（1080p、2k、4k）。 |
| duration | number | 是 | 取值范围：4 ~ 15<br/>视频时长（秒） |
| image_urls | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>图片最大总像素：36000000<br/>图片最小宽高比：2:5<br/>图片最大宽高比：5:2<br/>最多上传数量：9<br/>最多支持 9 项图片，每张 30 MB 参考图片（0-9张） |
| video_urls | array | 否 | 单文件大小上限：50.0 MB（52428800 byte）<br/>图片最大总像素：2086876<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>最多支持 3 项视频，每个 50 MB 参考视频（0-3个，用于多模态参考/视频编辑/视频续写）。单个视频时长 [2, 15] s，最多传入 3 个参考视频，所有视频总时长不超过 15s。 |
| audio_urls | array | 否 | 单文件大小上限：50.0 MB（52428800 byte）<br/>视频最小时长：2（单位与配置一致，一般为秒）<br/>视频最大时长：15（单位与配置一致，一般为秒）<br/>最多上传数量：3<br/>最多支持 3 项音频，每个 50 MB 参考音频（0-3个，需至少包含1个参考视频或图片）。单个音频时长 [2, 15] s，最多传入 3 段参考音频，所有音频总时长不超过 15 s。 |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| ratio | string | 否 | ⟨bz_enum_json⟩["adaptive","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
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
      "https://storage.bizyair.cn/outputs/zj9aKnZXWHMyUzMx.mp4"
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
