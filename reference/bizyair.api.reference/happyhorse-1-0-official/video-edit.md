---
display_name: "HappyHorse-1.0-视频编辑-官方版"
category: "Video Edit"
manufacturer: "阿里"
price: "720P: 900 金币/1秒 | 1080P: 1600 金币/1秒"
price_url: "https://bizyair.cn/modelzoo/happyhorse-1-0-official/video-edit?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  HappyHorse 1.0 官方版的视频编辑能力在指令遵循度与效果一致性上表现优异。
  模型支持以自然语言对视频进行对象增删替换、风格迁移与音频联动修改，编辑结果在画面质感、光影层次与镜头流畅度方面保持较高水准。
  官方版为对编辑精度有较严格要求的创意团队与内容运营提供可靠支持。
tags: ["Happy Horse", "最近上新"]
---

# HappyHorse-1.0-视频编辑-官方版

> **视频编辑** | 厂商: 阿里 | 模型: `happyhorse-1-0-official` | 类型: `video-edit`

HappyHorse 1.0 官方版的视频编辑能力在指令遵循度与效果一致性上表现优异。

模型支持以自然语言对视频进行对象增删替换、风格迁移与音频联动修改，编辑结果在画面质感、光影层次与镜头流畅度方面保持较高水准。
官方版为对编辑精度有较严格要求的创意团队与内容运营提供可靠支持。

💰 **价格**: 720P: 900 金币/1秒 | 1080P: 1600 金币/1秒  [查看详情](https://bizyair.cn/modelzoo/happyhorse-1-0-official/video-edit?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/happyhorse-1-0-official/video-edit';
  const payload = {
    "media": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/MOYBmipsu9Skl5Klk7XdqiGjVupYA8yn.mp4"
    ],
    "reference_images": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/lfVSvPm5CA6jWhwBtO13oSzqiKPknJnk.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/ToYZKBFuKECnyShgxYktb8PrZQq9D7Wk.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260512/ODXpjgcQbNlW9DpUfRIr28Q9aHAYzzbo.jpg"
    ],
    "prompt": "将@视频1的整体色调替换为@图片3的风格：深邃近黑的暗色背景， 建筑灯光呈现饱和的暖金橘色，\n\n水面产生金色倒影，天空压暗至 接近纯黑，整体形成强烈的明暗对比，去除原视频中的蓝紫色调， 色温整体偏暖，保留视频原有内容与运镜不变。  完成色调替换后，向后延长@视频1，镜头以极缓慢匀速向下俯冲， 视角从当前城市夜景高度持续下降，过渡至@图片1的构图层次： 航拍超高空俯瞰角度，城市街道网格与建筑群铺满画面， 河流与桥梁光带穿城而过，车流光轨拉出流动的橘金色长线， 延续@图片3建立的暖金深黑色调，画面稳定无抖动。  镜头继续保持同方向匀速下降，从航拍高空逐渐俯冲至街道 地面平视高度，过渡至@图片2的构图层次：城市十字路口平视视角， 霓虹招牌灯光充满两侧，人群与车流在镜头前流动， 地面湿润反射出霓虹与车灯的彩色倒影，色调在暖金基调上 叠加冷蓝霓虹光，形成冷暖交织的终章氛围。  全程一镜到底，三个层次之间无剪切，镜头下降速度保持匀速 平滑，高空→航拍→街道\n\n的视角转换自然流畅， 如同一架摄影机从云端缓缓降落至城市心脏。 每个过渡阶段色调在@图片3的暖金深黑基础上 随视角变化自然演进，整体电影级调色，无人物特写，无文字。",
    "resolution": "1080P",
    "audio_setting": "auto",
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
| media | array | 是 | 支持格式：mp4、mov<br/>单文件大小上限：100.0 MB（104857600 byte）<br/>图片最小幅宽：320px<br/>图片最大幅宽：2160px<br/>图片最大高度：2160px<br/>视频最小时长：3（单位与配置一致，一般为秒）<br/>视频最大时长：60（单位与配置一致，一般为秒）<br/>图片最小宽高比：1:2.5<br/>图片最大宽高比：2.5:1<br/>最少上传数量：1<br/>最多上传数量：1<br/>上传 1 个待编辑视频。 |
| reference_images | array | 否 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：300px<br/>图片最小高度：300px<br/>图片最小宽高比：1:2.5<br/>图片最大宽高比：2.5:1<br/>最多上传数量：5<br/>可选上传 0-5 张参考图片，用于辅助视频编辑效果。 |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>文本提示词。用来描述对视频的编辑意图，如风格转换、局部替换等。 |
| resolution | string | 否 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>生成视频分辨率，可选 720P 或 1080P；默认 1080P。 |
| audio_setting | string | 否 | ⟨bz_enum_json⟩["auto","origin"]⟨/bz_enum_json⟩<br/>auto 为模型自行控制；origin 为保留输入视频原始声音。 |
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
      "https://storage.bizyair.cn/outputs/A7ctLw2Fvx40cbtX.mp4"
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
