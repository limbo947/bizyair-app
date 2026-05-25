> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 8000<br/>视频提示词 |
| image_urls | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：3<br/>最多支持 3 项图片，每张 30 MB |
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>画面比例 |

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
      "https://storage.bizyair.cn/outputs/aE1EfJek3shpO7Np.mp4"
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
