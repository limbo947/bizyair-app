> 本文档仅包含该模型的**特有章节**。
> 公共章节（开始使用、提交请求-响应示例/响应字段说明、查询结果-请求示例、文件上传等）请参见 [common.md](common.md)。


## 二. 提交请求

### 1. 请求示例

```javascript
async function submitTask() {
  const url = 'https://api.bizyair.cn/x/v1/modelzoo/tasks/openapi/bza-image-o2-base/text-to-image';
  const payload = {
    "prompt": "在一座建于悬崖边的未来主义玻璃图书馆中，室内与室外同时可见。图书馆内部采用透明曲面玻璃结构、巨型悬空书架、螺旋楼梯和漂浮阅读平台。画面中央是一位年轻女性，穿着半透明丝绸礼服，礼服上带有极其复杂的刺绣、珠片和金属丝纹理。她坐在一张由透明玻璃与胡桃木构成的桌前，正在翻阅一本古老羊皮书。她的左手戴着多枚不同材质的戒指，右手轻触书页，指尖动作自然，手部结构准确。  她身旁蹲着一只长毛缅因猫，毛发层次分明，每一根毛都清晰可见，眼睛中准确反射窗外景色。桌面上摆放着透明水晶杯，杯中有半杯红酒，玻璃折射与液体折射真实；旁边有一枚金属怀表，表盘数字清晰可辨；还有几张微微卷曲的纸张，纸张边缘有自然纤维细节。  背景外部是黄昏时分的海岸悬崖。远处可见波涛翻涌的海面、飞翔的海鸥、缓慢移动的帆船和天边的晚霞。太阳接近地平线，暖橙色夕阳透过玻璃窗，在室内投射出复杂的彩色折射、反射和阴影。玻璃幕墙同时反射室内和室外环境。  画面左后方有一个机器人侍者，金属表面带有拉丝不锈钢质感和细微指纹痕迹，正端着银质托盘。右后方有一位老人坐在悬浮座椅上阅读报纸，面部皱纹、眼镜反光和报纸文字清晰自然。  室内包含多种材质并准确渲染：  透明玻璃（折射、反射、边缘高光） 金属（拉丝、镜面反射） 丝绸（柔软高光） 木材（天然纹理） 皮肤（次表面散射） 毛发（细丝层次） 纸张（纤维质感） 液体（真实透光）  摄影参数： 85mm 镜头，f/2.0，全画幅相机，HDR，电影级布光，前景、中景、远景层次丰富，景深自然，主体清晰，背景略微虚化但细节仍然完整。",
    "aspect_ratio": "3:2",
    "resolution": "2K"
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
| prompt | string | 是 | 文本长度限制：1 - 2500<br/>提示词 |
| aspect_ratio | string | 否 | ⟨bz_enum_json⟩["1:1","2:3","3:2","4:5","5:4","3:4","4:3","16:9","9:16","21:9"]⟨/bz_enum_json⟩<br/>比例 |
| resolution | string | 否 | ⟨bz_enum_json⟩["1K","2K","4K"]⟨/bz_enum_json⟩<br/>分辨率 |

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
    "images": [
      "https://storage.bizyair.cn/outputs/UygKE2xbiixbRnVV.png"
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
| outputs.images | array | 图片类输出结果，URL 实际上是文件的下载链接（CDN 地址）。 |
