> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。



## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/kling-o3-4k-base/reference-to-video';
  const payload = {
    "prompt": "将参考图片中散落的水果与面包，完整转化为二维动漫风格，生成一段治愈系的动漫食物桌面场景视频。\n\n画面风格：干净利落的黑色描边线条勾勒每一个食物轮廓，内部填充饱满平涂的色块，高光用简洁的白色几何形状点缀在受光边缘，阴影以同色系加深的平涂色块表现、边缘清晰不渐变，整体色调明亮温暖，无任何写实材质贴图与照片质感，呈现纯正的二维手绘动漫美学。\n\n内容布局：忠实还原参考图中每一种水果与面包的形态、颜色与散落布局——面包的堆叠方式、水果滚落的角度、彼此叠压的位置关系全部保留，只把视觉风格从写实照片转化为动漫语言。\n\n动态效果（幅度极小、节奏舒缓）：散落的水果产生极轻微的呼吸感弹动，每颗以各自略不同的频率缓慢鼓胀收缩；面包表面偶尔冒出一个小气泡随即消失，像刚出炉散热；切开的水果截面果汁以卡通方式缓慢渗出一小滴，在桌面留下小小的反光水渍；偶尔一颗葡萄从水果堆顶部缓缓滚落、沿桌面弹跳两下停稳，弹跳时呈动漫式弹性形变（落地微压扁、弹起略拉长）；一片面包从堆边缘慢动作滑落、翻转一圈平稳落桌，落地瞬间扬起动漫式小尘埃云和几粒面包屑。\n\n桌面与光影：木纹以简洁平行弧线表示，桌面边角有轻微高光白边；光源从画面左上方打入，所有食物受光面、背光面与投影方向统一，投影为深色平涂色块、边缘清晰。\n\n镜头：全程静止固定俯拍，不做任何推拉移动，只呈现食物自身的微动作，营造治愈静谧的动漫桌面氛围。\n\n音频：轻柔的室内环境底音，水果弹跳时有卡通弹簧音效，面包滑落有轻柔摩擦声与落地笃声，配一段轻快可爱的木琴与钢片琴旋律，音调明亮治愈。\n\n整体动漫风格统一，描边流畅、色彩填充干净，高光与阴影符合二维动漫美学，无写实材质，无人物，无文字。",
    "image_urls": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/RwrEUiU9xeMben9Zms22d1fjviQYksu6.jpg",
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260514/lAom8ttP9MUT5OSpQOC8NAsZX6bVFPE7.jpg"
    ],
    "duration": 10,
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
| X-Bizyair-Task-WebHook-Url | string | 是 | 为任务结束后的回调接口地址，如果不设置则采用同步模式，需要https或http，接口应为POST请求。若回调地址在海外，BizyAir 不保证回调成功，请悉知。 |
| X-Bizyair-Task-Authorization | string | 否 | 如回调接口带有授权，请将授权凭据写在这里，回调时会附带在请求头中，如：Authorization：${YOUR_WEBHOOK_AUTHORIZATION}。 |
| X-Bizyair-Task-${HEADER_NAME} | string | 否 | 所有以X-Bizyair-Task-开头的请求头，会在回调时原样不动包含在请求头中 |

### 2. 请求参数说明

您可以阅读以下的【**请求参数说明**】，进一步完善您提交的请求。这会使您最终的运行成功更加准确，但请严格遵守参数内容要求，以免运行失败。

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词。 |
| image_urls | array | 否 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：50.0 MB（52428800 byte）<br/>最少上传数量：0<br/>最多上传数量：7<br/>参考图片输入，最多7张。 |
| duration | number | 是 | 取值范围：3 ~ 15<br/>视频时长，单位秒。 |
| sound | boolean | 是 | 是否开启声音。 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["16:9","9:16","1:1"]⟨/bz_enum_json⟩<br/>输出宽高比。 |
| multi_shot | boolean | 否 | 是否生成多镜头视频。 |
| shot_type | string | 否 | ⟨bz_enum_json⟩["customize","intelligence"]⟨/bz_enum_json⟩<br/>镜头类型。customize为自定义，intelligence为智能。 |
| multi_prompt | string | 否 | 文本长度限制：1 - 10000<br/>多镜头提示词配置，JSON格式。 |


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
      "https://storage.bizyair.cn/outputs_examples/o9v9883OTwAU09X7.mp4"
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

### 4. Webhook 回调说明

如果您在创建任务时通过`X-BizyAir-Webhook-URL`请求头指定了 Webhook 回调地址，BizyAir 会在任务结束后，向该地址发送回调通知。

当任务成功时：

```json
{
  "request_id": "6b88a97e-76e8-480a-bae7-a6f7f37b4e97",
  "status": "Success",
  "created_at": "2026-05-22 17:14:07",
  "executed_at": "2026-05-22 17:14:07",
  "ended_at": "2026-05-22 17:14:44",
  "outputs": {
    "videos": [
      "https://storage.bizyair.cn/outputs_examples/o9v9883OTwAU09X7.mp4"
    ]
  },
  "cost_times": {
    "total_cost_time": 36815,
    "inference_duration": 36090
  }
}
```

当任务失败时：

```json
{
  "request_id": "ee8f5246-77ff-4df7-af62-7c55f311bcb2",
  "status": "Failed",
  "message": "Third-party api response error. No image generated.",
  "created_at": "2026-05-25 13:13:04",
  "executed_at": "2026-05-25 13:13:04",
  "ended_at": "2026-05-25 13:13:06",
  "outputs": {
    "texts": [
      "对不起，我不能提供生成此类内容的图像。"
    ]
  },
  "cost_times": {
    "total_cost_time": 1930
  }
}
```

您可以阅读上方的【**响应字段说明**】，了解各字段含义与取值说明。
