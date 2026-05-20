---
display_name: "通用视频V.3.1.Fast-首尾帧-渠道版"
category: "FLF to Video"
manufacturer: "谷歌"
price: "720p: 200 金币/1次 | 1080p: 250 金币/1次 | 4k: 500 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-video-v3-1-fast-base/flf-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  V.3.1.Fast 首尾帧生视频（First-Last-Frame）模式支持图片输入，通过指定起始帧与结束帧生成过渡自然的视频片段，速度优先，适合高频视频生产场景。综合调用成本低于官方版。
tags: ["通用视频V"]
---

# 通用视频V.3.1.Fast-首尾帧-渠道版

> **首尾帧生视频** | 厂商: 谷歌 | 模型: `bza-video-v3-1-fast-base` | 类型: `flf-to-video`

V.3.1.Fast 首尾帧生视频（First-Last-Frame）模式支持图片输入，通过指定起始帧与结束帧生成过渡自然的视频片段，速度优先，适合高频视频生产场景。综合调用成本低于官方版。

💰 **价格**: 720p: 200 金币/1次 | 1080p: 250 金币/1次 | 4k: 500 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-video-v3-1-fast-base/flf-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-v3-1-fast-base/flf-to-video';
  const payload = {
    "prompt": "以首帧画面为起始：一片开阔宁静的草原，绿草在微风中轻轻起伏，天空湛蓝，阳光均匀洒落，一切平静如初。\n就在镜头推进的第三秒，草原正中央的地面突然开始轻微颤抖——草叶剧烈抖动，泥土从地面裂缝向四周迸射，一个巨大的圆形裂口从草地中央炸开，露出深不见底的黑色空洞，边缘的草皮向内卷曲塌陷。\n空洞中喷射而出的不是泥土和岩石，而是数以千计的五彩气球——红的黄的蓝的绿的，密密麻麻争先恐后地从地洞里涌出，每一只气球都拖着细长的金色丝带，瞬间将整片草原上空填满，气球群遮蔽了半边天空，阳光透过气球形成五彩斑斓的彩色光影打在草地上。\n气球还没散尽，地洞里又冒出一群穿着正装燕尾服的企鹅，它们迈着一本正经的步伐从洞口鱼贯而出，每只企鹅手里都夹着一个黑色公文包，昂首阔步地走向草原四面八方，完全无视漫天飞舞的气球，神情严肃得像是赶着去开一场极其重要的商务会议。\n企鹅队伍走到一半，天空中突然出现一条巨大的鲸鱼——不是飞的，而是游的，像在海里一样悠然自得地在云层间穿梭，尾鳍拍打云朵溅起白色水雾，几只小鱼跟在鲸鱼身后在天空中列队游弋，鱼鳞在阳光下反射出七彩光芒。\n地面上一只企鹅停下脚步，抬头看了一眼天上的鲸鱼，若无其事地打开公文包取出一把雨伞撑开，继续大步向前走，完全无视这一切。\n天空鲸鱼游过草原上空时，从腹部缓缓落下无数朵蒲公英，蒲公英绒毛在气球与阳光之间漂浮旋转，每一朵落地的瞬间都绽放出一小圈彩色光晕，草原表面因此覆满了会发光的蒲公英，整片草原开始像星空一样在白昼中闪烁。\n所有的混乱在某个瞬间突然安静下来——气球飘散至天际消失，企鹅们集体走入地平线消失不见，天空鲸鱼游入云层深处再也看不见，蒲公英的发光一朵一朵熄灭，草地恢复平静，地洞悄无声息地从边缘向中央愈合，最后一道裂缝闭合，草皮重新长好，风继续轻轻吹过。\n以尾帧画面收尾：同一片草原，绿草在微风中轻轻起伏，天空湛蓝，阳光均匀洒落，一切平静如初。仿佛什么都没有发生过。唯一不同的是草地正中央，有一个被踩出来的企鹅脚印形状的浅坑，以及一根落在草叶上还没飘走的金色气球丝带。\n全程一镜到底，镜头保持平稳中景，静静记录这一切的发生与消失，不追随任何单一元素，像一个目击者一样站在原地。\n音频：开场草原风声，地面颤抖时出现低频震动音，气球涌出时是密集的橡胶摩擦与碰撞声，企鹅出场配以荒诞感十足的进行曲铜管旋律，鲸鱼出现时切换为深海般的低频鸣唱与气泡声，最终归零回到草原风声，进行曲旋律在远处若有若无地消散。\n超真实背景下的超荒诞内容，草原植被与光影全程写实，企鹅西装材质精准，气球物理飘动自然，天空鲸鱼水下游动动态完整移植至空中，蒲公英发光粒子效果细腻，首尾画面与中间荒诞内容形成极强反差，4K质感，无文字。",
    "first_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/sIap3VowYxFZEwVXguzcHyunhrHJJbZw.jpg"
    ],
    "last_frame_image": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/ntzBVTOE8503qsFln1m1jWeKnpw6jIHO.jpg"
    ],
    "aspect_ratio": "16:9",
    "resolution": "1080p"
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
| prompt | string | 是 | 文本长度限制：1 - 8000<br/>视频提示词 |
| first_frame_image | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>首帧图片 |
| last_frame_image | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>尾帧图片 |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>画面比例 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>视频分辨率 |


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
      "https://storage.bizyair.cn/outputs/1RdSgKlq6t4u1ZVN.mp4"
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
