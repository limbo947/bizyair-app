---
display_name: "HappyHorse-1.0-图生视频-官方版-基于首帧"
category: "Image to Video"
manufacturer: "阿里"
price: "720P: 900 金币/1秒 | 1080P: 1600 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/happyhorse-1-0-official/image-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  HappyHorse 1.0 官方版能将静态图像转化为带有原生音频的动态短片，支持多画幅自适应与 1080P 超分输出，在角色一致性与动作自然度上表现稳定。官方版为广告行业、电商产品视频及影视预演等专业场景提供经过验证的视频创作工具。
tags: ["Happy Horse", "最近上新"]
---

# HappyHorse-1.0-图生视频-官方版-基于首帧

> **图生视频** | 厂商: 阿里 | 模型: `happyhorse-1-0-official` | 类型: `image-to-video`

HappyHorse 1.0 官方版能将静态图像转化为带有原生音频的动态短片，支持多画幅自适应与 1080P 超分输出，在角色一致性与动作自然度上表现稳定。官方版为广告行业、电商产品视频及影视预演等专业场景提供经过验证的视频创作工具。

💰 **价格**: 720P: 900 金币/1秒 | 1080P: 1600 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/happyhorse-1-0-official/image-to-video?tab=price)

> 公共内容请参阅 [common.md](../common.md)

## 二. 提交请求


> _preamble — 与公共文档一致，详见 [common.md](../common.md)


### 1. 请求示例

请您复制代码块中的代码，

并将 `${BIZYAIR_API_KEY}` **替换为您自己的** **API Key** 后运行。

在这之前，您可以对代码块中的参数部分进行调整，以精准生成您所需要的内容。

注意：参数设置的格式与要求，请严格参考 **【2. 请求参数说明】**。

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/happyhorse-1-0-official/image-to-video';
  const payload = {
    "first_frame": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/NKoU0Mcb8pqcNn0mwNogQLY8A8w4xviK.jpg"
    ],
    "prompt": "以首帧画面为起始：镜头贴近地面，以极浅的景深特写野草穗头，前景草茎清晰可见每一根细小芒刺，背景完全虚化为粉紫色渐变天空，一轮粉红色的夕阳悬浮在草茎之间，被细茎剪成碎片状光斑，整体色调为玫瑰粉、灰紫、暖褐的混合。 微风徐来，草穗开始以极细腻的幅度轻轻摇摆，前景与背景的草茎摆动节奏略有差异，形成自然的层次感与韵律感。 镜头极缓慢地向右侧平移，同时以几乎察觉不到的速度向后拉远，景深随之略微收深，更多的草穗从虚焦中逐渐浮现为半清晰状态，天空占比缓缓增大。 夕阳在草茎之间的位置随镜头移动而缓慢漂移，始终若隐若现地藏在草穗背后，时而被完全遮挡，时而透出完整的粉红圆形，光晕在草茎边缘产生柔和的逆光光晕与细微的镜头耀斑。 天空色彩在视频过程中发生极缓慢的渐变——粉紫色向更深的紫蓝色轻微过渡，暗示夕阳正在缓慢西沉，光线亮度整体微弱降低，地平线处保留最后一道橘粉色余晖。 全程一镜到底，镜头运动如同摄影师俯身屏息拍摄，极轻微的手持呼吸感，无任何突兀抖动。草穗纹理超精细，每根芒刺清晰可见，逆光下草茎半透明质感真实还原。 音频：傍晚旷野的安静环境音——微风吹过草丛的细碎沙沙声为主，偶尔远处一两声虫鸣，整体几乎无声，配以一段极简的单音钢琴旋律，音符稀疏悠长，与草穗摆动的节奏自然呼应。 超真实，胶片摄影质感，参考自然系电影摄影风格，浅景深控制精准，色调保持原图的玫瑰粉与灰紫基调不过度饱和，轻微胶片颗粒感，4K质感，静谧诗意。",
    "resolution": "1080P",
    "duration": 10,
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

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| first_frame | array | 是 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：10.0 MB（10485760 byte）<br/>最少上传数量：1<br/>最多上传数量：1<br/>上传 1 张首帧图片；支持 JPEG/JPG/PNG/WEBP，单张不超过 10MB。 |
| prompt | string | 否 | 文本长度限制：1 - 2500<br/>文本提示词，可选；用于补充描述期望生成的视频内容。 |
| resolution | string | 否 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>生成视频分辨率，可选 720P 或 1080P；默认 1080P。 |
| duration | number | 否 | 取值范围：3 ~ 15<br/>视频时长，单位秒，取值范围 3-15；默认 5。 |
| watermark | boolean | 否 | 是否添加 Happy Horse 水印；默认添加。 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>随机种子范围 0-2147483647；当前默认值 -1 表示由系统自动生成。 |


> ### 3. 响应示例 — 与公共文档一致，详见 [common.md](../common.md)


> ### 4. 响应字段说明 — 与公共文档一致，详见 [common.md](../common.md)


## 三. 查询结果


> _preamble — 与公共文档一致，详见 [common.md](../common.md)


> ### 1. 请求示例 — 与公共文档一致，详见 [common.md](../common.md)


### 2. 响应示例

这是一个通过调用 **BizyAir 查询接口**，在任务生成完成、成功生成内容之后，服务器最终返回的结果回执。

也是整个 AI 生图流程的【**最终结果**】。通过浏览这段信息，您可以了解到上述所有操作的最终结果。

如果您收到了其他的信息反馈，可以结合下文【**3. 响应字段说明**】进一步了解详情。

```json
{
  "request_id": "4569bb94-1d30-417a-a987-9715de1e2633",
  "status": "Success",
  "message": null,
  "executed_at": "2026-04-15 13:32:32",
  "ended_at": "2026-04-15 13:42:32",
  "outputs": {
    "videos": [
      "https://storage.bizyair.cn/outputs/ZC0ma4GMV728Idci.mp4"
    ]
  }
}
```


### 3. 响应字段说明

您可以阅读下方的【**响应字段说明**】，了解各字段含义与取值说明。

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| request_id | string | 请求ID，用于后续查询任务状态。 |
| status | string | 任务状态，可能的值为：Pending（排队中）、Running（运行中）、Saving（转存中）、Success（完成）、Failed（失败）。 |
| message | string | 任务状态为 Failed 时，错误的具体信息。 |
| executed_at | string | 任务开始运行的时间。 |
| ended_at | string | 当任务成功或失败时，任务结束的时间。 |
| outputs | array | 生成结果（非“完成”状态时，为null或[]）。 |
| outputs.videos | array | 视频类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
