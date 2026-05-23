---
display_name: "通用视频V.3.1.Pro-文生视频-渠道版"
category: "Text to Video"
manufacturer: "谷歌"
price: "720p: 800 金币/1次 | 1080p: 1000 金币/1次 | 4k: 1400 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-video-v3-1-pro-base/text-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  V.3.1.Pro 文生视频模式，由文本描述直接生成画面细节与运动一致性较强的视频片段，适合对视频质量有一定要求的生产场景。综合调用成本低于官方版。
tags: ["通用视频V"]
---

# 通用视频V.3.1.Pro-文生视频-渠道版

> **文生视频** | 厂商: 谷歌 | 模型: `bza-video-v3-1-pro-base` | 类型: `text-to-video`

V.3.1.Pro 文生视频模式，由文本描述直接生成画面细节与运动一致性较强的视频片段，适合对视频质量有一定要求的生产场景。综合调用成本低于官方版。

💰 **价格**: 720p: 800 金币/1次 | 1080p: 1000 金币/1次 | 4k: 1400 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-video-v3-1-pro-base/text-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-v3-1-pro-base/text-to-video';
  const payload = {
    "prompt": "黄昏时分的威尼斯大运河，镜头从一座古老石桥的拱洞内侧开始，桥洞框住对岸的巴洛克式建筑立面，建筑外墙的赭红与暗金色在暴风雨前特有的滤镜天光下显得异常饱和。一艘贡多拉从桥洞下无声滑过，船夫的黑色剪影倒映在墨绿色运河水面，水波将倒影拉成扭曲的光带。\n镜头穿过桥洞推入大运河主干道，两岸密密麻麻的文艺复兴建筑在阴沉天光下压迫感十足，家家户户开始收起晾晒的彩色衣物，窗板被从内侧关上，整座城市在暴风雨来临前安静地屏住呼吸。\n天空参考透纳油画的暴风雨色调——硫磺黄与铅灰色交织的云层低压翻涌，云层底部泛出诡异的绿色光晕，远处已有闪电在云层内部无声引爆，瞬间将整片天空照亮为硫磺白。\n第一滴雨落在运河水面，随即第二滴第三滴，运河表面被密集雨点打出无数细小涟漪，如沸腾的水面，贡多拉在雨中继续无声滑行，船夫戴上黑色宽檐帽低头前行。\n镜头缓缓升至屋顶平台高度，俯瞰整座威尼斯在暴雨中的全景——密密麻麻的红瓦屋顶在雨水冲刷下颜色加深，运河网络如迷宫般在城市中蜿蜒，远处亚得里亚海的海平线在暴雨帘幕后若隐若现。\n全程一镜到底，镜头运动平滑匀速。\n音频：暴风雨来临前的沉闷风声，远处雷鸣低沉滚动，第一声雨点敲击石板地面的清脆声，随后雨声密集成片，运河水声与雨声融为一体，配以一段大提琴独奏，音调沉郁悠长。\n超真实，威尼斯建筑历史细节精准，水面光学反射电影级，暴风雨大气效果完整，4K质感，无文字。",
    "resolution": "1080p",
    "aspect_ratio": "16:9"
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
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>画面比例 |


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
      "https://storage.bizyair.cn/outputs/yn1xNN8LcJpXHHJV.mp4"
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
