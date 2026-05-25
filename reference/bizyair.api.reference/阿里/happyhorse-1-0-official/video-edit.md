> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| media | array | 是 | 支持格式：mp4、mov<br/>单文件大小上限：100.0 MB（104857600 byte）<br/>图片最小幅宽：320px<br/>图片最大幅宽：2160px<br/>图片最大高度：2160px<br/>视频最小时长：3（单位与配置一致，一般为秒）<br/>视频最大时长：60（单位与配置一致，一般为秒）<br/>图片最小宽高比：1:2.5<br/>图片最大宽高比：2.5:1<br/>最少上传数量：1<br/>最多上传数量：1<br/>上传 1 个待编辑视频。 |
| reference_images | array | 否 | 支持格式：webp、png、jpeg、jpg<br/>单文件大小上限：20.0 MB（20971520 byte）<br/>图片最小幅宽：300px<br/>图片最小高度：300px<br/>图片最小宽高比：1:2.5<br/>图片最大宽高比：2.5:1<br/>最多上传数量：5<br/>可选上传 0-5 张参考图片，用于辅助视频编辑效果。 |
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>文本提示词。用来描述对视频的编辑意图，如风格转换、局部替换等。 |
| resolution | string | 否 | ⟨bz_enum_json⟩["720P","1080P"]⟨/bz_enum_json⟩<br/>生成视频分辨率，可选 720P 或 1080P；默认 1080P。 |
| audio_setting | string | 否 | ⟨bz_enum_json⟩["auto","origin"]⟨/bz_enum_json⟩<br/>auto 为模型自行控制；origin 为保留输入视频原始声音。 |
| watermark | boolean | 否 | 是否添加 Happy Horse 水印；默认添加。 |
| seed | number | 否 | 取值范围：0 ~ 2147483647<br/>随机种子范围 0-2147483647；当前默认值 -1 表示由系统自动生成。 |

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
      "https://storage.bizyair.cn/outputs/A7ctLw2Fvx40cbtX.mp4"
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
