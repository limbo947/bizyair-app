> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-official/text-to-video';
  const payload = {
    "seed": -1,
    "aspect_ratio": "16:9",
    "generate_audio": true,
    "duration": "8",
    "resolution": "1080p",
    "prompt": "深夜的撒哈拉沙漠腹地，镜头从沙丘表面的细沙纹理开始，微风吹过沙面形成流动的细沙瀑布，沙粒在月光下如碎银闪烁。 镜头极缓慢地向上仰起，越过沙丘弧线，视野逐渐打开——一片壮阔的星空铺满整个画面上方。银河主体横贯天际，核心部分呈现浓烈的金橘色与深紫色混合，数亿颗星点密集到几乎连成光带，用肉眼可见的方式缓慢旋转移动，呈现延时摄影的星轨效果。 前景保留一列连绵起伏的沙丘剪影，丘脊线条流畅优雅，月光从右侧斜打，沙丘明暗两面形成极强对比——受光面为冷银白，背光面为深靛蓝，两者交界处是一条极细的金色轮廓线。 画面中央偏左，一棵孤独的枯死骆驼刺树剪影，枝杈向四面伸展，星空透过枝条空隙可见，形成天然的画框层次。远处地平线上隐约有一队骆驼剪影极缓慢地移动，小如尘埃，衬托出空间的辽阔。 流星不定时划过天际，每隔十几秒出现一道，长尾在星空中拖出短暂的白色光迹随即消散。偶有一颗特别明亮的流星在银河核心处划过，瞬间将整片天空照亮半秒。 镜头运动全程极缓，如同大地本身在呼吸，最终以银河完整横跨画面的仰拍全景定格收尾。 整体色调以深靛蓝、冷银、暖金橘为主，画面极暗，星光为唯一主要光源。 音频：绝对的沙漠寂静为底——几乎无声，只有极轻微的风沙摩擦声，偶尔一声不知名的夜间虫鸣，配以一段极简单音符竖琴旋律，音符之间间隔漫长，与星空的辽阔感共鸣。 超真实，天文摄影级星空细节，沙粒纹理精细可数，延时星轨运动自然流畅，一镜到底，无剪切，电影级画面，轻微胶片颗粒感，4K质感，无人物，无文字。"
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
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>输入范围值: 0 - 2147483647 种子整数，用于控制生成内容的随机性。 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["auto","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| generate_audio | boolean | 否 | 是否生成视频音频 |
| duration | string | 否 | ⟨bz_enum_json⟩["auto","4","5","6","7","8","9","10","11","12","13","14","15"]⟨/bz_enum_json⟩<br/>视频时长（秒） |
| resolution | string | 否 | ⟨bz_enum_json⟩["480p","720p","1080p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| prompt | string | 是 | 文本长度限制：1 - 20480<br/>视频生成提示词 |

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
      "https://storage.bizyair.cn/outputs/2qD6jKHxjlryySAr.mp4"
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
