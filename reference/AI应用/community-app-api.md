# BizyAir 社区应用 API 参考

> 来源：`https://bizyair.cn/community/app` 页面网络抓包，2026-06-18

## 端点总览

| 端点 | 方法 | 认证 | 用途 |
|:---|:---|:---|:---|
| `/x/v1/bizy_models/community` | GET | 无 | 社区模型/应用列表 |
| `/x/v1/webapp/{id}` | GET | 无 | 应用详情（含 input_nodes） |
| `/x/v1/dict` | GET | 无 | 字典数据（基础模型分类等） |
| `/w/v1/webapp/task/openapi/create` | POST | Bearer | 提交 WebApp 任务 |
| `/w/v1/webapp/task/openapi/detail` | GET | Bearer | 查询任务状态 |
| `/w/v1/webapp/task/openapi/outputs` | GET | Bearer | 查询任务结果 |
| `/w/v1/webapp/task/openapi/cancel` | PUT | Bearer | 取消排队中的任务 |
| `/w/v1/webapp/task/openapi/interrupt` | PUT | Bearer | 中断运行中的任务 |

API 基础地址：`https://api.bizyair.cn`

---

## 1. 社区模型/应用列表

```
GET /x/v1/bizy_models/community
```

### 请求参数（Query）

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `current` | number | 否 | 1 | 页码，从 1 开始 |
| `page_size` | number | 否 | 28 | 每页数量 |
| `keyword` | string | 否 | "" | 搜索关键词 |
| `sort` | string | 否 | "Recently" | 排序方式：`Recently`（最近）/ 其他 |
| `model_types` | string | 否 | — | 类型筛选：`Application`（AI应用）/ `Workflow`（工作流）/ `Model`（模型）等 |

### 请求示例

```
GET /x/v1/bizy_models/community?current=1&page_size=28&keyword=&sort=Recently&model_types=Application
```

### 响应结构

```json
{
  "code": 20000,
  "message": "Ok",
  "status": true,
  "data": {
    "list": [ /* 应用项数组，见下文 */ ],
    "total": 1375,
    "current": 1,
    "page_size": 28
  }
}
```

### 应用项字段

| 字段 | 类型 | 示例 | 说明 |
|:---|:---|:---|:---|
| `id` | number | 55168 | bizy_model_id，详情页 URL 中的数字 |
| `name` | string | "线稿" | 应用名称 |
| `type` | string | "Application" | 类型（Application / Workflow / Model） |
| `versions` | array | — | 版本列表（通常 1 个元素） |
| `counter` | object | {"used_count": 2} | 聚合计数 |

### versions 子项字段

| 字段 | 类型 | 示例 | 说明 |
|:---|:---|:---|:---|
| `id` | number | 56258 | 版本 ID（即 web_app_id，提交任务时使用） |
| `base_model` | string | "GPT-Image" | 基础模型分类，对应 `/x/v1/dict` 中的 base_models |
| `sign` | string | "5175bd..." | 工作流签名哈希 |
| `public` | boolean | true | 是否公开 |
| `available` | boolean | true | 是否可用 |
| `file_name` | string | "workflow.json" | 工作流文件名 |
| `bizy_model_id` | number | 55168 | 关联的模型 ID |
| `counter` | object | {"used_count": 2} | 版本级计数 |
| `cover_urls` | string[] | ["https://..."] | 封面图/视频 URL，可能是图片(.webp)或视频(.mp4) |
| `draft_id` | number | 92718 | 草稿 ID |

### counter 子字段

| 字段 | 说明 |
|:---|:---|
| `used_count` | 使用次数 |
| `forked_count` | 派生次数 |
| `liked_count` | 点赞次数 |

### 响应示例（单条）

```json
{
  "id": 55012,
  "name": "香蕉2双图生图",
  "type": "Application",
  "versions": [
    {
      "id": 56099,
      "base_model": "Nano Banana",
      "sign": "6a33d44d...",
      "public": true,
      "available": true,
      "file_name": "workflow.json",
      "bizy_model_id": 55012,
      "counter": {"used_count": 181},
      "cover_urls": ["https://storage.bizyair.cn/img/20260614/v92VY6BPkSmbP0A63ICjTsbuQ79JsRd3.webp?image_size=1728*2304&image_process=format,webp&x-oss-process=image/resize,w_600,m_lfit/format,webp"],
      "draft_id": 91388
    }
  ],
  "counter": {"used_count": 181}
}
```

---

## 2. 应用详情

```
GET /x/v1/webapp/{bizy_model_id}
```

### 路径参数

| 参数 | 类型 | 说明 |
|:---|:---|:---|
| `bizy_model_id` | number | 应用 ID，来自列表接口的 `id` 字段 |

### 响应结构

```json
{
  "code": 20000,
  "message": "Ok",
  "status": true,
  "data": {
    "name": "线稿",
    "user_id": "cm33t6tfz00et11v536frx2w2",
    "user_name": "User_frx2w2",
    "user_avatar": "https://storage.bizyair.cn/...",
    "base_model": "Other",
    "intro": "线",
    "public": true,
    "bizy_model_id": 55168,
    "original_user_id": "cm33t6tfz00et11v536frx2w2",
    "created_at": "2026-06-17",
    "updated_at": "2026-06-17",
    "cover_urls": ["https://storage.bizyair.cn/..."],
    "counter": {"used_count": 2},
    "web_app_prompt_content_tpl": "files/92/8d/...",
    "input_nodes": [ /* 输入参数定义，见下文 */ ],
    "id": 56258,
    "diff_original_web_app": true,
    "draft_id": 92718,
    "web_app_workflow_url": "https://storage.bizyair.cn/files/...",
    "source": "others"
  }
}
```

### 详情字段说明

| 字段 | 类型 | 说明 |
|:---|:---|:---|
| `name` | string | 应用名称 |
| `user_id` | string | 创建者用户 ID |
| `user_name` | string | 创建者用户名 |
| `user_avatar` | string | 创建者头像 URL |
| `base_model` | string | 基础模型分类 |
| `intro` | string | 应用简介 |
| `public` | boolean | 是否公开 |
| `bizy_model_id` | number | 模型 ID |
| `created_at` | string | 创建日期 |
| `updated_at` | string | 更新日期 |
| `cover_urls` | string[] | 封面图/视频 URL |
| `counter` | object | 使用计数 |
| `input_nodes` | array | 输入参数定义列表 |
| `id` | number | web_app_id（提交任务时使用） |
| `draft_id` | number | 草稿 ID |
| `web_app_workflow_url` | string | 工作流文件 URL |
| `source` | string | 来源 |

### input_nodes 子项字段

| 字段 | 类型 | 示例 | 说明 |
|:---|:---|:---|:---|
| `id` | number | 36461 | 节点 ID |
| `node_id` | number | 18 | 工作流节点 ID |
| `node_name` | string | "加载图像" | 节点名称 |
| `node_type` | string | "LoadImage" | 节点类型 |
| `field_name` | string | "image" | 字段名 |
| `field_type` | string | "combo" | 字段类型：combo / slider / number / hidden / string |
| `field_options` | string | '{"values":[...]}' | 字段选项（JSON 字符串） |
| `field_label` | string | "图像" | 字段标签（显示名） |
| `field_value` | any | "RGB" / 0 / "https://..." | 默认值 |
| `sort` | number | 1 | 排序序号 |
| `variable_name` | string | "18:LoadImage.image" | 变量名（提交任务时的 key） |

### field_type 类型说明

| field_type | 说明 | field_options 示例 |
|:---|:---|:---|
| `hidden` | 隐藏字段（如图片上传） | `{"values":["file1.png","file2.jpg"]}` |
| `combo` | 下拉选择 | `{"values":["RGB","red","green","blue"]}` |
| `slider` | 滑块 | `{"max":255,"min":0,"precision":0,"step":10,"step2":1}` |
| `number` | 数字输入 | `{"max":9.99,"min":0.01,"precision":2,"round":0.01,"step":0.1}` |
| `string` | 文本输入 | — |

### 错误码

| code | 说明 |
|:---|:---|
| 20000 | 成功 |
| 20224 | 应用不存在或已被下架 |
| 20015 | 参数无效 |

---

## 3. 字典数据

```
GET /x/v1/dict
```

### 响应结构

```json
{
  "code": 20000,
  "message": "Ok",
  "status": true,
  "data": {
    "tags": [ /* 官方标签 */ ],
    "base_models": [ /* 基础模型分类列表 */ ],
    "notification_types": [ /* 通知类型 */ ],
    "official_notification_types": [ /* 官方通知类型 */ ]
  }
}
```

### base_models 列表

| label | value | 说明 |
|:---|:---|:---|
| 0010 | Flux.1 D | Flux.1 开发版 |
| 0012 | Flux.1 Kontext | Flux.1 Kontext |
| 0013 | Flux.1 S | Flux.1 标准版 |
| 0020 | SDXL | Stable Diffusion XL |
| 0021 | SD 1.5 | Stable Diffusion 1.5 |
| 0022 | SD 3.5 | Stable Diffusion 3.5 |
| 0023 | Pony | Pony |
| 0024 | Illustrious | Illustrious |
| 0025 | NoobAI | NoobAI |
| 0026 | Anima | Anima |
| 0031 | Flux.2 D | Flux.2 开发版 |
| 0032 | Flux.2 Klein | Flux.2 Klein |
| 0042 | ERNIE-Image | 文心一格 |
| 0050 | Ideogram | Ideogram |
| 006 | Kolors | 可图 |
| 007 | Hunyuan 1 | 混元 1 |
| 008 | Hunyuan Video | 混元视频 |
| 009 | Wan Video | Wan 视频 |
| 0140 | Qwen-Image | 通义千问图像 |
| 0141 | Qwen-Edit | 通义千问编辑 |
| 0150 | Z-image | Z-image |
| 0160 | Ovis | Ovis |
| 0170 | LTX-2 | LTX-2 |
| 1010 | Nano Banana | 纳米香蕉 |
| 1022 | Seedream | 即梦 |
| 1025 | Seedance | 即影 |
| 1030 | Sora | Sora |
| 1040 | Veo | Veo |
| 1050 | Kling | 可灵 |
| 1060 | Hailuo | 海螺 |
| 1070 | GPT-Image | GPT 图像 |
| 1080 | Vidu | Vidu |
| 1090 | Grok | Grok |
| 1100 | Happy Horse | 快乐马 |
| 9999 | Other | 其他 |

---

## 4. 提交 WebApp 任务

```
POST /w/v1/webapp/task/openapi/create
```

### 请求头

| 头 | 值 |
|:---|:---|
| `Content-Type` | application/json |
| `Authorization` | Bearer {apiKey} |
| `X-Bizyair-Task-Async` | enable |

### 请求体

```json
{
  "web_app_id": 56258,
  "suppress_preview_output": false,
  "input_values": {
    "18:LoadImage.image": "https://example.com/image.png",
    "27:LayerColor: Levels.channel": "RGB",
    "27:LayerColor: Levels.black_point": 0,
    "27:LayerColor: Levels.white_point": 90,
    "27:LayerColor: Levels.gray_point": 0.19
  }
}
```

| 字段 | 类型 | 说明 |
|:---|:---|:---|
| `web_app_id` | number | 应用版本 ID，来自详情接口的 `data.id` |
| `suppress_preview_output` | boolean | 是否抑制预览输出 |
| `input_values` | object | 输入参数，key 为 input_nodes 中的 `variable_name` |

### 响应

```json
{
  "requestId": "xxx",
  "request_id": "xxx"
}
```

---

## 5. 查询任务状态

```
GET /w/v1/webapp/task/openapi/detail?requestId={requestId}
```

### 请求头

| 头 | 值 |
|:---|:---|
| `Authorization` | Bearer {apiKey} |

---

## 6. 查询任务结果

```
GET /w/v1/webapp/task/openapi/outputs?requestId={requestId}
```

### 请求头

| 头 | 值 |
|:---|:---|
| `Authorization` | Bearer {apiKey} |

### 响应

返回 `data.outputs` 数组，包含生成的图片/视频/音频等资源 URL。

---

## 7. 取消/中断任务

```
PUT /w/v1/webapp/task/openapi/cancel?requestId={requestId}
PUT /w/v1/webapp/task/openapi/interrupt?requestId={requestId}
```

- `cancel`：取消排队中的任务
- `interrupt`：中断运行中的任务

### 请求头

| 头 | 值 |
|:---|:---|
| `Authorization` | Bearer {apiKey} |
| `Content-Type` | application/json |

---

## 典型调用流程

```
1. GET /x/v1/bizy_models/community?model_types=Application
   → 获取应用列表，得到 bizy_model_id

2. GET /x/v1/webapp/{bizy_model_id}
   → 获取应用详情，得到 web_app_id 和 input_nodes

3. POST /w/v1/webapp/task/openapi/create
   → 提交任务（web_app_id + input_values），得到 requestId

4. GET /w/v1/webapp/task/openapi/detail?requestId=xxx
   → 轮询任务状态（Pending → Running → Success/Failed）

5. GET /w/v1/webapp/task/openapi/outputs?requestId=xxx
   → 获取任务结果（图片/视频/音频 URL）
```
