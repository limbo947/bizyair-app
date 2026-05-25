> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/seedance-2-0-official/flf-to-video';
  const payload = {
    "prompt": "以首帧画面为起始：一条小蛇盘踞在地面上，蛇身纹路清晰，鳞片在光线下泛出细腻光泽，蛇头微微抬起，细长的舌尖轻轻吐动，眼神幽深。镜头从低角度贴近地面平视，与蛇保持同一高度。 镜头缓缓向上拉起，就在上升过程中，蛇身开始发生变化——盘绕的蛇身从底部开始逐渐拉伸立起，蛇鳞纹路在拉伸中渐渐演变为丝绸织物的光泽，盘绕的形态化为旗袍裙摆的层叠弧线，由下至上蛇的形态完整蜕变为一位身着深色旗袍的女性身影。 女性的旗袍上隐约可见蛇鳞纹路演化而来的暗花刺绣图案，领口与袖口镶金边，裙摆随风轻扬，她面容平静，眼神与最初那条蛇一样幽深。她站在某个高处——悬崖边缘或山顶，背后是开阔天空。 镜头继续向上仰拍，女性身影在风中站立片刻，裙摆与发丝被风吹起，随后她的轮廓开始向上逐渐消散——不是消失，而是身体边缘化为细密的光粒子与丝绸碎片，随风向天空飘散，如同一缕烟雾被天空吸收。 镜头持续上仰追随消散的轨迹，最终以尾帧画面收尾：纯粹的天空，云层悠缓流动，女性的最后一缕痕迹融入云间，归于虚无。 整个蜕变过程流畅丝滑，蛇到旗袍的材质过渡以鳞片纹路为桥梁自然衔接，消散过程唯美不突兀，如一场梦境的结尾。镜头运动从贴地平视到垂直仰望，一镜到底无剪切。 音频：开场是安静的自然环境音与风声，蜕变过程中有极轻微的丝绸摩擦声与风铃般的高频音，消散阶段配以一段古筝单音旋律，音符稀疏悠远，最终随人影消散归于天空的风声与寂静。 超真实，蛇鳞与丝绸材质过渡精准细腻，粒子消散效果电影级，人物身形优雅稳定无变形，光影全程统一，4K质感。",
    "aspect_ratio": "16:9",
    "resolution": "1080p",
    "duration": "10",
    "first_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/kgHRRLoElX8HmADOXUVDlRBE7HwqQMaJ.jpg"
    ],
    "last_frame_url": [
      "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260513/hYw8tMvAhsuda175IiwrComKoAvQpq9g.jpg"
    ],
    "generate_audio": true,
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
| prompt | string | 是 | 文本长度限制：1 - 20480<br/>视频生成提示词 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["auto","16:9","4:3","1:1","3:4","9:16","21:9"]⟨/bz_enum_json⟩<br/>视频宽高比 |
| resolution | string | 否 | ⟨bz_enum_json⟩["480p","720p","1080p"]⟨/bz_enum_json⟩<br/>视频分辨率 |
| duration | string | 否 | ⟨bz_enum_json⟩["auto","4","5","6","7","8","9","10","11","12","13","14","15"]⟨/bz_enum_json⟩<br/>视频时长（秒） |
| first_frame_url | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>首帧图片 |
| last_frame_url | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>最多支持 1 项图片，每张 30 MB |
| generate_audio | boolean | 否 | 是否生成视频音频 |
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
      "https://storage.bizyair.cn/outputs/vcjXewCwIQRzvo4u.mp4"
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
