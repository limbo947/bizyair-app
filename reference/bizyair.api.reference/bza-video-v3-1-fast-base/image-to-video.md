---
display_name: "通用视频V.3.1.Fast-图生视频-渠道版"
category: "Image to Video"
manufacturer: "谷歌"
price: "720p: 200 金币/1次 | 1080p: 250 金币/1次 | 4k: 500 金币/1次"
price_url: "https://bizyair.cn/modelzoo/bza-video-v3-1-fast-base/image-to-video?tab=price"
benefit:
  rpd: 200
  rph: 60
  rpm: -1
description: |
  V.3.1.Fast 图生视频模式支持图片输入，将静态图像生成为运动自然的视频片段，速度优先，适合高频视频生产场景。综合调用成本低于官方版。
tags: ["通用视频V"]
---

# 通用视频V.3.1.Fast-图生视频-渠道版

> **图生视频** | 厂商: 谷歌 | 模型: `bza-video-v3-1-fast-base` | 类型: `image-to-video`

V.3.1.Fast 图生视频模式支持图片输入，将静态图像生成为运动自然的视频片段，速度优先，适合高频视频生产场景。综合调用成本低于官方版。

💰 **价格**: 720p: 200 金币/1次 | 1080p: 250 金币/1次 | 4k: 500 金币/1次  [查看详情](https://bizyair.cn/modelzoo/bza-video-v3-1-fast-base/image-to-video?tab=price)

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
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-video-v3-1-fast-base/image-to-video';
  const payload = {
    "prompt": "参考图片为一张现代城市街道照片，保持所有建筑的位置、轮廓、立面细节与原始构图完全不变。\n将地面街道替换为浑浊的洪水水面，水位高度达到建筑一层顶部，一层橱窗与门洞完全淹没于水下，透过浑浊水面隐约可见水下沉没的车辆轮廓、漂散的杂物与路灯的扭曲倒影。水面上漂浮着木板、塑料瓶、报纸等城市废弃物，随水流缓慢漂移。\n建筑从二层以上完整保留原始外观，但为墙面增加洪水痕迹——水位线以下的外墙覆满藻类与污泥的水渍痕迹，部分窗玻璃已破碎，窗帘从破碎窗口飘出在风中摆动。\n天空替换为暴雨刚过的末世天光——厚重的铅灰云层开始缓慢裂开，一道强烈的白色光柱从云隙间垂直照射在水面，将浑浊水面照出刺眼的银白色反光，光柱边缘城市则笼罩在阴沉暗影中，冷暖光线的强烈对比营造出末世的戏剧张力。\n水面产生缓慢流动效果，偶有涟漪从画面边缘扩散，水中倒映的建筑倒影随水波轻微扭曲晃动。远处一只孤独的白色鸟类从水面掠过。\n镜头保持与参考图片完全相同的角度与焦距，仅画面内容发生改变，不做任何运镜移动，静默记录这座沉没的城市。\n音频：洪水过后的死寂，偶尔的水流声与漂浮物碰撞声，远处有风声掠过水面，那只鸟的一声鸣叫随即消失，配以极简钢琴单音，稀疏得几乎感知不到旋律。\n超真实，洪水物理流体效果电影级，建筑材质与水面反射精准，末世大气光线完整，4K质感，无人物，无文字。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/IPF4jv8hltHD1tAXnAItU4qSbU2HNMgj.jpg"
    ],
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
| image_urls | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：3<br/>最多支持 3 项图片，每张 30 MB |
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
      "https://storage.bizyair.cn/outputs/aE1EfJek3shpO7Np.mp4"
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
