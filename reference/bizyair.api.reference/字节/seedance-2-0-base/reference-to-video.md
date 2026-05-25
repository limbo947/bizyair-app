> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-base/reference-to-video';
  const payload = {
    "prompt": "参考图像：大猩猩、狗、牛三张动物图片，保持每个动物的外观特征完全一致，包括毛色、体型、斑纹、面部特征不可改变。 清晨的非洲大草原边缘，金色阳光低角度洒入。三只动物在同一片开阔草地上，以一种超现实但自然的方式共处：大猩猩坐在一棵孤树下，单手撑地，姿态沉稳地注视远方；狗在草地上小跑，耳朵随风轻扬，尾巴自然摆动；牛在不远处低头缓慢吃草，偶尔抬头甩动耳朵驱赶飞虫。 三只动物各自有独立的自然动作，互不干扰但共享同一空间，营造一种宁静和谐的超现实共处感。 镜头运动参考视频：缓慢的横向摇移（pan），从左侧大猩猩开始，匀速扫过中间的狗，最终停留在右侧的牛，全程平滑无剪切。随后镜头缓慢推近至中景，捕捉三者共处的全景画面。 灯光为清晨黄金时段自然光，低角度暖光，动物毛发边缘产生柔和轮廓光，草地上拉出长长的影子。 背景为开阔非洲草原，远处可见稀疏的金合欢树剪影，地平线清晰，天空从金橙色渐变为浅蓝色。 音频参考：清晨草原环境音——远处鸟鸣、微风吹过草丛的沙沙声、偶尔的牛叫声、狗的轻微喘息声，整体安静祥和，配以轻柔的非洲手鼓或木琴旋律。 超真实，动物毛发纹理细腻，皮肤质感真实，眼睛有光泽反射，动物运动符合各自物种的真实运动规律，无变形，无多余肢体，自然纪录片画质，电影级色彩调度。",
    "resolution": "2k",
    "duration": 8,
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/gv0iMp9QUFrN3avdMUNgxHCmXcgymYpU.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/MiYzWWZeIxrspf9OlFM2PwZR5HZQYetE.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/a1eCOlWL8Zoa0CkfKytoIJ5m3nCavwcA.jpg"
    ],
    "video_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/dDjUdhhFnAicvuDSj3u5OEwLUZEPWcbG.mp4"
    ],
    "audio_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/HeKxW6VzwQududKUBZvqKAUQRMSWaNLH.mp3"
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
| resolution | string | 是 | ⟨bz_enum_json⟩["480p","720p","native1080p","1080p","2k","4k"]⟨/bz_enum_json⟩<br/>视频分辨率。分为模型原生输出的分辨率（480p、720p、native1080p），与基于 720p 原生生成后进行超分放大的分辨率（1080p、2k、4k）。 |
| duration | number | 是 | 取值范围：4 ~ 15<br/>视频时长（秒） |
| image_urls | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：9<br/>最多支持 9 项图片，每张 30 MB 参考图片（0-9张） |
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
      "https://storage.bizyair.cn/outputs/e29hKdZ1qQ6cJoCm.mp4"
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
