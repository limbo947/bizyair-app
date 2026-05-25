> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

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

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| prompt | string | 是 | 文本长度限制：1 - 8000<br/>视频提示词 |
| first_frame_image | array | 是 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>首帧图片 |
| last_frame_image | array | 否 | 单文件大小上限：30.0 MB（31457280 byte）<br/>最多上传数量：1<br/>尾帧图片 |
| aspect_ratio | string | 是 | ⟨bz_enum_json⟩["16:9","9:16"]⟨/bz_enum_json⟩<br/>画面比例 |
| resolution | string | 是 | ⟨bz_enum_json⟩["720p","1080p","4k"]⟨/bz_enum_json⟩<br/>视频分辨率 |

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
      "https://storage.bizyair.cn/outputs/1RdSgKlq6t4u1ZVN.mp4"
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
