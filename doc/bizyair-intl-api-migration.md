# BizyAir 国际版 API 迁移方案

> **目标**：将本应用全部 API 调用从国内版 `bizyair.cn` 切换到国际版 `www.bizyair.ai`（API 域名为 `api.bizyair.ai` / `meta.bizyair.ai`）。
>
> **调研日期**：2026-10-05
> **调研依据**：官方文档 `https://docs.bizyair.ai/cn/api-guide/*`、端点实测探测（无鉴权 curl，**按 HTTP 方法区分**）、站点 sitemap（`sitemap-model-api-1.xml`）、**CORS 预检实测**、仓库代码逐行核对；四轮独立复验（含国内版停服探测，见附录 A）。
> **修订记录**：
> - **v1**（2026-10-05）：初版。
> - **v2**（2026-10-05）：一轮审查修订——补充 OSS 直连域名 pattern、HTTP 错误状态码处理、默认模型 key 同步项、存量密钥引导、CORS 风险等待实测项。
> - **v3**（2026-10-05）：二轮独立复核修订——① 修正改动面口径（"3 文件 18 行" → 5 个必需代码文件 + .env 合计 6 个，另有 4 个配套文件，见 §1.1）；② 修正探测方法学并重写冒烟脚本（`commit` 为 POST-only，原脚本用 GET 会误报 404，见 §2、§10.1）；③ 重写错误处理链路（20052 实测形态 + `httpClient`/`errorMessages` 联合改造，见 §6）；④ 上传链路改为**优先返回 commit 的 `data.url`** 并修复 `upload-proxy.mjs` 遗留 bug（见 §3.3、§3.5）；⑤ 新增应用详情字段兼容层（§3.4）与轮询 notFound 上限（§3.9）；⑥ 重写模型处置口径并新增处置矩阵模板（§5、附录 C）——修正"-base 全系无对应"等误判；⑦ 回滚口径改为"端点 + 上传目录 + 模型库"三件套（§10.3）；⑧ 新增合规要求：国际版发行前不得内置密钥（§4.3）；⑨ 结案 CORS / `inputs_temp` / OSS `endpoint`·`bucket` / `dict.base_models` 四项"待实测"。
> - **v4**（2026-10-05）：三轮独立审查修订（18 端点重测 + sitemap 164 条抽查 + 20 组代码声明核对，全部外部事实复验通过）——① 修正 §6.4 终态识别错误表述（modelzoo 无 Canceled 分支，建议补一行防御）；② §3.9 notFound 上限补齐第三处分支（modelzoo 轮询 182-186 行）并改共享 helper 方案；③ §3.4 `sort` 项改注"现状已优雅降级，非必需"；④ §5.6 新增存量数据 id 迁移（复用 `MODEL_ID_MIGRATIONS`）；⑤ §1.1 `uploadApi.js` 行号修正（18、170-171；`commitResource` 已返回 `result.data`）；⑥ §8 新增 402/429 body 形态待实测项与 pricing 无价格源备选；⑦ §10.2 新增 Web 端浏览器矩阵；⑧ 附录 C 补 mode 级覆盖核查与迁移映射说明；⑨ §9 补排期参考与步骤顺序微调（错误链路上移）；⑩ 统一必需文件口径为 6 个（含 .env）。
> - **v5**（2026-10-05）：四轮独立审查修订（20+ 端点复测 + sitemap 全量比对 + 官方文档逐页核对 + 30+ 处代码行号复验）——① **新增国内版停服事实**（`503 Service permanent shutdown`），现状描述与 §10.3 回滚策略重写；② 新增 **800 行文件约束与拆分计划**（`models.js` 拆分、`WebappScreen.js` 净增行 ≤0，§5.6/§9）；③ 密钥口径调和为 **Dev/Release 双轨**（§1.1/§4.3）；④ 错误文案链路补齐（无 code 401 状态兜底 + `ApiKeyContext`/`AppHeader` 路径，§3.6/§3.7/§6.3）；⑤ §3.9 时长估算修正（20 次 ≈ 100-120 秒）并说明与 `MAX_POLL_FAILS` 的关系；⑥ §3.2 "不可达"表述修正；⑦ §5.3 补 **mode 级差异清单**（`wan-2-7-official`、`google-veo-3-1-*` 缺 image-to-video）；⑧ §5.3-B 补 qwen3tts mode 改名两条实现路径（推荐 `MODEL_ENDPOINTS` mode 覆盖）；⑨ §5.6 迁移表抽公共常量文件 + 下架模型规则 + `MODEL_MANUFACTURERS` 补齐；⑩ §5.8 "禁止重跑"落地位置（`resubmitTask`）；⑪ §6.3 业务码文案补齐（30038/20100/30041/20098/60014/30101/59009/50515-50517）与 JSON 字符串 body 处理；⑫ §6.4 状态枚举修正（`Canceled` 为通用状态，modelzoo 补分支升为必要修复）；⑬ §7/§2 重定向改 308，§3.1/§5.6 行号修正；⑭ §8 新增输出 URL 鉴权与 token `access_url`，§10.2 新增 3 项验证；⑮ 附录 A 追加四轮复验记录。
> - **v6**（2026-10-06）：终审修订（9 项端点独立重测全部复现 + 20 组代码声明复核 + 社区列表字段实测新发现）——① **Release 密钥隔离机制落地**（Expo 官方 `EXPO_NO_DOTENV` / `EXPO_NO_CLIENT_ENV_VARS` 开关 + 构建脚本断言 + APK 解包验收，§4.3）；② **第一批前移 18 个已确认模型映射**，消除批次断档（§9-9b）；③ 社区列表字段兼容（`page_size` 蛇形、顶层 `counter` 空、`used_count` 在 `versions[0].counter`，§3.2）；④ §6.4 轮询常量口径修正（阶梯在 `getPollingInterval`，单独改 `POLLING_INTERVAL_MS` 无效）与 Canceled 行号订正（214/254）；⑤ 存量密钥一次性区域戳迁移（§3.6）与迁移表存量条目审计（`wan-2-7-offcial` target 修正，§5.6）；⑥ §3.4 排序兜底简化（ES2019 起稳定排序为规范强制）；⑦ §8 新增旧输出 URL 可达性与账号/支付/实名可行性两项；⑧ 排期 M2 拆 M2a/M2b；⑨ §10.1 固化 401 形态与 CORS 两条回归探测，§10.2 新增密钥验收与旧输出 URL 检查；⑩ 行数/行号订正（pricing 167 / modelMeta 95、WebappScreen 948、`bza-video-v3-1` official 三款无需缩量）。
> - **v6.1**（2026-10-06，本版）：真实国际版 Key 实测回填——① **修正 OSS bucket 事实**：upload token 实测返回 `bucket=bizyair`（非官方文档所写的 `bizyair-ai`），§3.1 OSS 直连 pattern 同步修正为 `bizyair.oss-us-east-1.aliyuncs.com/inputs_temp/`，**v6 写法会导致兜底 URL 不被 `isBizyairFileUrl()` 识别**；② §8-1 结案：`user/info` 字段为 `id, nick_name, status, level, api_key, avatar, third_party_binds, email, level_display_name, language`（**无 `name`**，`nick_name` 兜底升为**必需**），`wallet` 仅返回 `gift_balance`（无 `charge_balance_amount`，与 v5"可能无赠送余额"的猜测相反）；③ §8-8 结案：token 响应稳定含 `data.access_url`（与 commit `data.url` 同域同路径），§3.3 三级兜底正式启用；④ upload token 的 `file.storage.endpoint/bucket` 与 `file.{object_key,access_key_id,access_key_secret,security_token}` 结构与现有 `uploadDirectToOSS` 用法完全兼容；⑤ `EXPO_NO_DOTENV` 等 Expo 开关经官方文档核实（见 §4.3）。

---

## 0. 结论摘要

1. **改动面**：运行时**必需修改 6 个文件、约 26 行**（口径见 §1.1），端点仍集中在 `src/constants/apiConfig.js` 一处；另有 **7 项配套改造**（错误码链路、详情字段兼容、社区列表字段兼容、上传代理 bug、轮询上限、密钥校验文案链路、存量密钥一次性迁移），外加 **Release 构建密钥隔离**（构建脚本层，§4.3）与**第一批模型映射前移**（§9-9b）。
2. **不是简单换域名**，国际版有四处结构变化：
   - 去掉 `/x`、`/w`、`/y` 路径前缀，统一为 `/v1`；
   - 拆分为 `api.` 与 `meta.` **双主机**（按职责二分）；
   - WebApp 查询类接口由**查询参数改为路径参数**；
   - **错误承载方式变化（最易漏）**：业务错误不再总是 `HTTP 200 + body.code`，而是真实 HTTP 状态码 + body.code（401/402/403/404/429）——**非 2xx 场景**会绕过现有 `result.code !== 20000` 分支（200 + code 场景仍走原分支，口径详见 §3.2）。
3. **最大工作量在模型库**：国际版 sitemap 含 **164 个端点**；项目 61 个 key 中 **16 个有同名 slug**（其中多数仍需加 `bizyair/` 前缀或改 mode/路径）、**2 个改 `-channel` 变体**、其余需按"channel 变体 / 功能等价 / 下架"逐项处置（§5.3 已确认映射，附录 C 矩阵模板）。
   **命名规律（重要）**：国内版 `-base`（渠道版）↔ 国际版 `-channel`，国内版 `-official` ↔ 国际版 `-official`。这条规律适用于 kling / vidu / hailuo / dreamactor / seedance / nano-banana / gpt-image / google-veo / grok 等族，可大幅减少"无对应"的误判。
4. **认证方式不变**：两版均为 `Authorization: Bearer <key>`；但 **API Key 必须在 `www.bizyair.ai` 重新签发**，国内版 key 在国际版无效（HTTP 401，文档码 `20052`）。密钥注入采用 **Dev/Release 双轨**：本地 `.env` 仅调试用，发行构建不注入内置密钥、由首启引导用户自带（见 §4.3 合规）。
5. **已实测结案**（原"待实测"项）：CORS 双主机放行（`Access-Control-Allow-Origin: *`，OPTIONS 204）；`file_type=inputs_temp`；OSS `bucket=bizyair` / `endpoint=oss-us-east-1.aliyuncs.com`（v6.1 真实 Key 实测，**纠正官方文档的 `bizyair-ai`**）；`dict.base_models`（35 项 `{label,value}`）与 `tags` 与现有解析兼容；`user/info` / `wallet` / upload token 响应字段均已实测（v6.1，见 §3.7 / §3.3）。
6. **顺带修复 2 个既有 bug**：`upload-proxy.mjs` 已计算 `finalUrl` 却返回 `uploadUrl`；`HistoryProvider` 把 404 视为"暂时性"且无上限，改 URL 形态时可能静默永久轮询。
7. **国内版已永久停服（v5 新增，阻断性认知）**：实测 `api.bizyair.cn/x/v1/*` 全部返回 `503 {"message":"Service permanent shutdown"}`（仅 `/y/v1/wallet` 仍 401，见附录 A）。当前线上版本（模型任务、上传、社区、字典）**已不可用**——迁移不是"可选优化"而是"恢复服务"，且**不存在回滚到国内版的生产路径**（§10.3）。

---

## 1. 现状：代码中 `bizyair.cn` / 待改引用点

### 1.1 改动总表（口径修正）

**字面出现 `bizyair.cn` 共 4 处**（`apiConfig.js:10`、`apiConfig.js:29`、`WebappScreen.js:194`、`upload-proxy.mjs:4`）+ **正则转义 1 处**（`WebappScreen.js:156` 的 `bizyair\.cn`，字面搜索匹配不到，故不要以 grep 结果作为完整性依据）。

| 文件 | 行号 | 变更内容 | 性质 |
|:---|:---|:---|:---|
| `src/constants/apiConfig.js` | 10、11-19、27-30 | 双主机 + 9 个端点常量 + OSS pattern + `UPLOAD_FILE_TYPE` | **必需** |
| `src/services/webappApi.js` | 47、64、82、103、121 | 5 处 URL 形态（查询参数 → 路径参数） | **必需** |
| `src/services/uploadApi.js` | 18、170-171 | `file_type` 走常量 + 优先返回 commit `data.url`（`commitResource` 已返回 `result.data`，无需改签名） | **必需** |
| `src/screens/webapp/WebappScreen.js` | 156、194 | 社区 URL 正则与 URL 构造 | **必需** |
| `scripts/upload-proxy.mjs` | 4、47、48、92、94-97 | 双主机 + `file_type` + 返回 commit `data.url`（修 bug） | **必需** |
| `.env` / `.env.example` | — | **本地调试**填国际版密钥；**发行构建不注入**（Dev/Release 双轨，见 §4.3）；`.env.example` 补注释 | **必需**（本地调试）/ Release 走首启引导 |
| `src/components/layout/AppHeader.js` | 64、67、75、79 | `user/info` / `wallet` 字段兜底 | 配套 |
| `src/screens/webapp/utils.js`（+ 调用方） | 新增 | 应用详情字段兼容层（§3.4） | 配套 |
| `src/services/httpClient.js` + `src/utils/errorMessages.js` | 29-36 + 映射表 | 业务码 → 用户文案（§6.3） | 配套 |
| `src/context/history/HistoryProvider.js` | 16-22、182-186、270-274、326-329 | 轮询 notFound 加上限（三处分支，§3.9） | 配套 |
| `src/context/ApiKeyContext.js` | 44-46 + 加载路径 | 密钥校验失败提示统一走错误映射（§3.6 / §6.3）+ 存量密钥一次性区域戳迁移（§3.6） | 配套 |
| `src/services/webappApi.js` + `src/screens/webapp/CommunityAppCard.js` | 166-171 + 21 | 社区列表分页字段（`page_size`）与使用次数（`versions[0].counter`）兼容（§3.2） | 配套 |
| `scripts/build-android.ps1` | prebuild 前置 | Release 密钥隔离：`EXPO_NO_DOTENV=1` + 密钥断言（§4.3） | 配套（合规） |

> **密钥双轨（v5）**：`.env` 只服务本地调试与冒烟；发行构建不注入 `EXPO_PUBLIC_BIZYAIR_API_KEY`，由首启引导用户自带 Key（三处密钥入口文案见 §4.3）。

### 1.2 文档 / 参考资料（不影响运行，可选维护）

| 路径 | 规模 |
|:---|:---|
| `reference/AI应用/` | `bizyair-api参考.md`(18 处)、`community-app-api.md`(6)、`异步查询.md`(6)、`bizyair-文件上传教程.md`(5) |
| `reference/bizyair.api.reference/` | 约 140 个文件、600+ 处，均为国内版官网 URL 镜像，迁移后参考价值下降 |
| `AGENTS.md` | 需补充"双主机职责划分"，修正"更换 API 服务只改 apiConfig.js"的表述 |
| `Design.md` | 无需改动（无域名引用） |

### 1.3 已确认不受影响的项

| 检查项 | 结论 |
|:---|:---|
| WebSocket | 全库无 `ws://` / `wss://` 及 Socket 依赖 |
| 硬编码端口 | 仅 `localhost:3001`（本地上传代理，与品牌无关） |
| CI/CD、部署配置 | 仓库内无 `.github/`，无 CI 脚本引用该域名 |
| `app.json` / `eas.json` / `package.json` | 仅含包名 `com.bizyair.assistant`、`scheme: bizyair`（品牌标识），无需改 |
| `taskApi.js` / `userApi.js` / `resultCache.js` | 无域名硬编码，纯从 `apiConfig.js` 导入，**零改动** |
| `httpClient.js` | 无域名硬编码，但**错误处理链路需改造**（§6.3），不再属于"零改动" |

---

## 2. 端点映射总表（方法敏感版）

**验证方法（v3 修正）**：无鉴权探测，但 **404 只在"方法正确"时才代表路由不存在**——
- `401` = 路由存在且需鉴权；`200` = 公开可访问；`404` + 方法正确 = 路由不存在；
- 反例：`meta/v1/input_resource/commit` 仅接受 **POST**，用 GET 探测会得到 404（假阴性）；
- 反例：`GET api/v1/modelzoo/tasks/openapi/{slug}/{mode}` 是 404，因为**查询端点是单段路径** `{request_id}`，双段路径只接受 POST（提交）。

| 场景 | 方法 | 国内版（现状） | 国际版（目标） | 实测证据 |
|:---|:---|:---|:---|:---|
| 模型任务提交 | POST | `api.bizyair.cn/x/v1/modelzoo/tasks/openapi/{slug}/{mode}` | `api.bizyair.ai/v1/modelzoo/tasks/openapi/{slug}/{mode}` | 401 + 官方 llms 文档 |
| 模型任务查询 | GET | `…/{requestId}` | `api.bizyair.ai/v1/modelzoo/tasks/openapi/{request_id}` | 401 |
| WebApp 任务提交 | POST | `…/w/v1/webapp/task/openapi/create` | `api.bizyair.ai/v1/webapp/task/openapi/create` | 401 |
| WebApp 任务状态 | GET | `…/detail?requestId={id}` | `api.bizyair.ai/v1/webapp/task/openapi/{request_id}` ⚠️ **改路径参数** | 401 |
| WebApp 任务结果 | GET | `…/outputs?requestId={id}` | `…/{request_id}/outputs` | 401 |
| 取消任务 | PUT | `…/cancel?requestId={id}` | `…/{request_id}/cancel` | 路径 401；**查询形式 404** |
| 中断任务 | PUT | `…/interrupt?requestId={id}` | `…/{request_id}/interrupt` | 同上规律 + 官方文档 |
| 应用详情 | GET | `api.bizyair.cn/x/v1/webapp/{id}` | `meta.bizyair.ai/v1/webapp/{id}/detail` ⚠️ **换主机 + 改形状** | 200，公开可访问 |
| 社区应用列表 | GET | `api.bizyair.cn/x/v1/bizy_models/community` | `meta.bizyair.ai/v1/bizy_models/community` ⚠️ **换主机** | 200（须带 `current` 等参数，否则 20015） |
| 字典 | GET | `api.bizyair.cn/x/v1/dict` | `meta.bizyair.ai/v1/dict` ⚠️ **换主机** | 200 |
| 上传凭证 | GET | `api.bizyair.cn/x/v1/upload/token` | `api.bizyair.ai/v1/upload/token` | 401 |
| 输入资源提交 | POST | `api.bizyair.cn/x/v1/input_resource/commit` | `meta.bizyair.ai/v1/input_resource/commit` ⚠️ **换主机** | api 主机 POST 404 ❌ / meta 主机 POST 401 ✅ |
| 输入资源列表 | GET | — | `meta.bizyair.ai/v1/input_resource` | 401 |
| 用户信息 | GET | `api.bizyair.cn/x/v1/user/metadata` | `meta.bizyair.ai/v1/user/info` ⚠️ **末段改名** | 401 |
| 钱包余额 | GET | `api.bizyair.cn/y/v1/wallet` | `api.bizyair.ai/v1/wallet` | 401 |
| 社区页面 URL | GET | `bizyair.cn/community/app/{id}` | `www.bizyair.ai/community/app/{id}` | `bizyair.ai` 308 → `www`，均 200 |
| OSS 直传 | PUT | `bizyair-prod.oss-cn-shanghai` | `bizyair-ai.oss-us-east-1.aliyuncs.com`（token 接口动态返回） | 官方 input-output 文档 |
| 输入文件 URL | — | `storage.bizyair.cn/inputs/` | `storage.bizyair.ai/inputs_temp/`（commit 返回） | 官方文档 |
| 输出文件 URL | — | `storage.bizyair.cn/outputs/` | `storage.bizyair.ai/outputs/`（**15 天有效期**，响应含 `expired_at`） | 官方文档 |

### 规律小结

- **⚠️ 国内版现状（v5 实测）**：`api.bizyair.cn/x/v1/*` 全部返回 `503 {"message":"Service permanent shutdown"}`（模型任务/上传/社区/字典均不可用），仅 `y/v1/wallet` 仍 401。表中"国内版"一列仅作原实现对照，**不可作为回滚目标**（§10.3）。
- **路径前缀**：`/x/v1`、`/w/v1`、`/y/v1` → 统一为 `/v1`。
- **主机按职责二分**：
  - `api.bizyair.ai` → 任务（modelzoo / webapp）、上传凭证、钱包；
  - `meta.bizyair.ai` → 用户信息、输入资源提交与列表、应用详情、社区模型、字典。
- **最易踩坑点**：`input_resource/commit` 在 `api.bizyair.ai` 上 404，**必须**走 `meta.bizyair.ai`（且必须用 POST）。
- **主机前置 Cloudflare**（响应头 `Server: cloudflare`）：跨境偶发 5xx/超时属正常波动，走既有重试策略即可。

---

## 3. 逐文件修改清单

### 3.1 `src/constants/apiConfig.js`（第 9-30 行整体替换）

```js
// ---- 服务主机与端点 ----
// 国际版按职责拆为两个主机：api（任务/上传/钱包）与 meta（用户/资源/应用详情/社区/字典）
export const API_HOST = 'https://api.bizyair.ai';
export const META_HOST = 'https://meta.bizyair.ai';
export const API_BASE = `${API_HOST}/v1/modelzoo/tasks/openapi`;
export const WEBAPP_API_BASE = `${API_HOST}/v1/webapp/task/openapi`;
export const WEBAPP_DETAIL_URL = `${META_HOST}/v1/webapp`;        // 使用时拼 /{id}/detail
export const COMMUNITY_API_BASE = `${META_HOST}/v1/bizy_models/community`;
export const DICT_API_URL = `${META_HOST}/v1/dict`;
export const UPLOAD_TOKEN_URL = `${API_HOST}/v1/upload/token`;
export const COMMIT_RESOURCE_URL = `${META_HOST}/v1/input_resource/commit`;
export const USER_METADATA_URL = `${META_HOST}/v1/user/info`;     // 名称保留以最小化改动，实为 user info
export const WALLET_BALANCE_URL = `${API_HOST}/v1/wallet`;
// 上传目录类型：国际版为 inputs_temp（国内版为 inputs）
export const UPLOAD_FILE_TYPE = 'inputs_temp';

// ---- 文件存储域名特征 ----
// 主路径：commit 接口返回的 storage 域名；后三项为 OSS 直连与国内版历史数据兜底
// 注意：该列表与 UPLOAD_FILE_TYPE 强耦合，二者必须同时调整
export const OSS_INPUT_URL_PATTERNS = [
  'storage.bizyair.ai/inputs_temp/',
  'storage.bizyair.ai/inputs/',
  'bizyair.oss-us-east-1.aliyuncs.com/inputs_temp/',
  'storage.bizyair.cn/inputs/',
  'bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/',
];
```

> **为什么保留国内版 pattern**：`isBizyairFileUrl()` 用于判断字段渲染类型（`WebappScreen.js:447`），历史记录中存的是国内版 URL，删除旧 pattern 会导致旧数据参数识别错误。
>
> **为什么仍保留 OSS 直连 pattern**：虽然 §3.3 已把主路径改为 commit 返回的 `storage.bizyair.ai/...`，但**历史版本上传结果**存的是原始 OSS URL（`uploadApi.js:171` 返回点，第 133 行为 URL 构造处；`upload-proxy.mjs:97`），且 OSS 直连兜底路径依然存在，因此不能删除。**bucket 以真实 Key 实测为准（v6.1）**：upload token 实测返回 `bucket=bizyair`、`endpoint=oss-us-east-1.aliyuncs.com`（官方文档示例写的 `bizyair-ai` 与实际不符）——直连兜底 URL 形如 `https://bizyair.oss-us-east-1.aliyuncs.com/inputs_temp/...`，pattern 必须与此一致，否则兜底 URL 不被 `isBizyairFileUrl()` 识别。

**保持不变的导出**：`ENV_API_KEY`（第 23 行）、`UPLOAD_PROXY_URL`（第 34-36 行）；超时/重试/轮询常量（第 39-42 行）**建议按 §6.4 调整取值**。

### 3.2 `src/services/webappApi.js`（5 处 URL 形态）

| 行号 | 原内容 | 建议新内容 |
|:---|:---|:---|
| 47 | `` `${WEBAPP_API_BASE}/detail?requestId=${encodeURIComponent(requestId)}` `` | `` `${WEBAPP_API_BASE}/${encodeURIComponent(requestId)}` `` |
| 64 | `` `${WEBAPP_API_BASE}/outputs?requestId=${...}` `` | `` `${WEBAPP_API_BASE}/${encodeURIComponent(requestId)}/outputs` `` |
| 82 | `` `${WEBAPP_DETAIL_URL}/${id}` `` | `` `${WEBAPP_DETAIL_URL}/${id}/detail` `` |
| 103 | `` `${WEBAPP_API_BASE}/cancel?requestId=${...}` `` | `` `${WEBAPP_API_BASE}/${encodeURIComponent(requestId)}/cancel` `` |
| 121 | `` `${WEBAPP_API_BASE}/interrupt?requestId=${...}` `` | `` `${WEBAPP_API_BASE}/${encodeURIComponent(requestId)}/interrupt` `` |

> **⚠️ 必须配套 §6.3 的错误处理改造**：国际版对"资源不存在/无权限/余额不足"返回真实 HTTP 状态码（如应用不存在返回 404 + body `{"code":20230,...}`）。
> 现有 `httpClient.js:29-36` 对非 2xx 直接抛错（消息形如 `[404] {...原始JSON}`），此时上层的 `result.code !== 20000` 分支被绕过、错误码映射失效，用户会看到原始 JSON（`webappApi.js:84` 的 20230 映射即属此列）。
> **口径修正（v5）**：并非所有分支都不可达——`fetchCommunityApps` / `fetchDict` 的 `result.code !== 20000` 分支在 **HTTP 200 + 业务码非 20000** 时仍可达（实测 community 缺参数返回 200 + `20015`），此类分支**必须保留**；本次改造只针对非 2xx 场景（见 §6.3）。

> **社区列表字段兼容（v6 实测新增）**：国际版 `bizy_models/community` 响应 `data` 键为 `list, total, current, page_size`（**蛇形 `page_size`**，代码读 `result.data.pageSize` 会静默落默认值）；列表项顶层 `counter` 为**空对象**，`used_count` 实际在 `versions[0].counter` 内。需改两处：
> - `webappApi.js` `fetchCommunityApps`（第 170 行）：`pageSize: result.data.pageSize ?? result.data.page_size ?? pageSize`；
> - `CommunityAppCard.js:21`：`item.counter?.used_count ?? item.versions?.[0]?.counter?.used_count ?? 0`（否则使用次数恒显 0）。
>
> 封面字段 `versions[0].cover_urls` 已实测存在（`storage.bizyair.ai` 直链），卡片封面兼容，无需改。

### 3.3 `src/services/uploadApi.js`

1. 第 18 行：`file_type: 'inputs'` → `file_type: UPLOAD_FILE_TYPE`（文件头 import 加入 `UPLOAD_FILE_TYPE`）。
2. 第 170-171 行：改为**优先返回 commit 返回的 `url`**（官方推荐用法），原始 OSS URL 作兜底：

```js
// 官方流程：commit 返回的 data.url（storage.bizyair.ai/inputs_temp/...）才是传给任务的输入值；
// 原始 OSS URL 保留为兜底，两者都能被 OSS_INPUT_URL_PATTERNS 识别
const committed = await commitResource(apiKey, fileName, objectKey);
return committed?.url || uploadUrl;
```

> 注：`commitResource`（第 33-40 行）现实现为 `return result.data || result`，`committed?.url` 可直接取到，**无需改其签名**。
>
> **三级兜底（v6.1 实测启用）**：upload token 响应稳定包含 `data.access_url`（实测：`https://storage.bizyair.ai/inputs_temp/...`，与 commit `data.url` 同域同路径）——正式采用 `committed?.url || uploadInfo.access_url || uploadUrl`。token 响应结构同时实测确认（v6.1）：`data.storage.{endpoint,bucket}` 与 `data.file.{object_key,access_key_id,access_key_secret,expiration,security_token}` 与现有 `uploadDirectToOSS` 用法完全兼容，无需结构改动。

### 3.4 `src/screens/webapp/WebappScreen.js`（正则 + URL + 详情字段兼容）

| 行号 | 原内容 | 建议新内容 |
|:---|:---|:---|
| 156 | `/bizyair\.cn\/community\/app\/(\d+)/` | `/bizyair\.(?:cn\|ai)\/community\/app\/(\d+)/` |
| 194 | `` `https://bizyair.cn/community/app/${item.id}` `` | `` `https://www.bizyair.ai/community/app/${item.id}` `` |

正则同时匹配两版域名，使旧教程 / 旧链接粘贴依然可用。

**同时补详情字段兼容层**（建议放在 `src/screens/webapp/utils.js`，供 `WebappScreen` 与 `CommunityAppPreview` 共用）：

| 现状用法 | 国际版实际情况 | 兼容处理 |
|:---|:---|:---|
| `WebappScreen.js:143`、`CommunityAppPreview.js:67` 按 `input_nodes[].sort` 排序 | **无 `sort` 字段** | 简化为 `(a.sort ?? 0) - (b.sort ?? 0)`（v6 简化）：ES2019 起 `Array.prototype.sort` 稳定性为规范强制，Hermes 符合；全部节点缺 `sort` 时自动保持原始顺序，无需索引兜底 |
| `WebappScreen.js:284`、`:627` 读 `appDetail.intro` | **无 `intro`**，有 `description` | `intro ?? description ?? ''` |
| `WebappScreen.js:281` 读 `appDetail.bizy_model_id` | **无该字段**（有 `ref_bizy_model_id`） | 保持 `?? null`（仅用于本地保存元数据，不影响调用）；如需填充可映射 `ref_bizy_model_id`，语义需先确认 |
| `CommunityAppPreview.js:84` 存 `detail.intro`、`:154-155` 渲染 `detail.intro` | 同上 | 同上兼容 |

> 依据：实测 `meta/v1/webapp/56783/detail` 的 `data` 键为 `name,user_id,nick_name,user_avatar,base_model,description,public,original_user_id,created_at,cover_urls,counter,input_nodes,id,source,ref_bizy_model_id`；`input_nodes[]` 键为 `id,node_id,node_name,node_type,field_name,field_type,field_options,field_label,field_value,variable_name`（与现有解析方式兼容）。
>
> **接入点（v5 补，v6 措辞同步）**：兼容层建议实现为 `normalizeAppDetail(data)`（补 `intro = description`、节点排序 `?? 0` 兜底），并在**两个 fetch 调用点**统一套用：`WebappScreen.js:162`（`applyAppDetail` 之前）与 `CommunityAppPreview.js:36-37`（`setDetail` 之前），保证保存路径（`:284` / `:84`）与渲染路径（`:627` / `:154-155`）同时生效。

### 3.5 `scripts/upload-proxy.mjs`

| 行号 | 原内容 | 建议新内容 |
|:---|:---|:---|
| 4 | `const API_HOST = 'https://api.bizyair.cn';` | `const API_HOST = 'https://api.bizyair.ai';` + 新增 `const META_HOST = 'https://meta.bizyair.ai';` |
| 47 | `file_type: 'inputs'` | `file_type: 'inputs_temp'` |
| 48 | `${API_HOST}/x/v1/upload/token` | `${API_HOST}/v1/upload/token` |
| 92 | `${API_HOST}/x/v1/input_resource/commit` | `${META_HOST}/v1/input_resource/commit`（必须 POST，脚本已是 POST ✅） |
| 97 | `body: { url: uploadUrl }` | `body: { url: finalUrl }`（**修既有 bug**：第 94 行已算出 `finalUrl = commitData.url \|\| uploadUrl` 却未使用） |

### 3.6 `.env` / `.env.example`

- 变量名 `EXPO_PUBLIC_BIZYAIR_API_KEY` **不变**；
- **密钥值必须更换**：登录 `www.bizyair.ai` → API Keys → 创建新 Key。现有密钥为国内版签发，国际版会拒绝（HTTP 401，文档码 `20052 无效的API密钥`）；
- 建议在 `.env.example` 注释中补充国际版域名与"密钥须重新签发"说明；
- **Dev/Release 双轨（v5）**：`.env` 仅本地调试与冒烟；发行构建不注入该变量（§4.3），改为首启引导用户在 `AppHeader` 输入；
- **存量密钥处理（v5 补链路）**：`ApiKeyContext` 中已保存的多密钥（AsyncStorage）迁移后全部失效，且提示分布**两条链路**，均需覆盖：
  1. `getUserMessage` 链路（首页提交 / 历史重试）——按 §6.3 增加 `20052 / 20054 / 20093` 业务码文案 + 无 code 401 的状态兜底；
  2. `ApiKeyContext.refreshUserInfo`（第 44-46 行）与 `AppHeader.handleSaveApiKey`（第 50-51 行）校验链路——当前显示固定文案"密钥验证失败/密钥保存失败"，需改为统一映射（如"密钥无效或已过期，请到 www.bizyair.ai 重新签发 API Key"）。**此链路不经过 `getUserMessage`，是存量密钥失效的主要暴露点。**
- **存量密钥一次性迁移（v6 新增）**：`ApiKeyContext` 加载已存密钥时检查区域戳（AsyncStorage 键如 `bizyair_api_region`），不存在则把所有已存密钥批量标记为"失效（国内版签发）"（或清空）并写入戳 `intl`——避免用户逐个密钥踩 401 才发现问题，配合首启引导一次性告知。

### 3.7 `src/components/layout/AppHeader.js`（建议加兜底）

| 行号 | 现状 | 实测（v6.1，真实 Key）与处置 |
|:---|:---|:---|
| 64 | `userInfo.avatar` | ✅ `avatar` 字段存在，无需改 |
| 67 | `userInfo.name` | ❌ **无 `name`**，实测为 `nick_name`——兜底 `userInfo.name ?? userInfo.nick_name` 升为**必需**（不改则昵称为空） |
| 68 | `userInfo.user_level_str` | ❌ 无该字段，实测为 `level_display_name`（另有数值 `level`）——同步兜底 |
| 75 / 79 | `walletBalance.charge_balance_amount` / `gift_balance_amount` | ❌ 实测 `/v1/wallet` **仅返回 `gift_balance`**（数值，如 `899`），无 `charge_balance_amount`——与 v5"可能无赠送余额"的猜测相反：国际版钱包只有单一余额字段。处置：主余额位显示 `charge_balance_amount ?? gift_balance ?? '--'`，赠送位字段不存在则隐藏（不显示 '--'）；单位/币种文案随 §8-2 一并确认 |

`user/info` 实测 `data` 键全量：`id, nick_name, status, level, api_key, avatar, third_party_binds, email, level_display_name, language`（v6.1）。

> **文案改造（v5 补）**：`handleSaveApiKey` 的 catch（第 50-51 行）现固定显示"密钥保存失败"，需改为透出统一错误映射（如"密钥无效或已过期，请到 www.bizyair.ai 重新签发"），与 `ApiKeyContext.refreshUserInfo`（第 44-46 行）共用同一文案来源。

### 3.8 `src/screens/webapp/WebappScreen.js` / `CommunityAppPreview.js` 详情字段

见 §3.4 后半部分（同一个兼容层，两处共用）。

### 3.9 `src/context/history/HistoryProvider.js`（轮询健壮性）

- 现状：`isTaskNotFoundError()`（第 16-22 行）把 404 与 `"code":30009` 视为"暂时性错误"，**不计失败次数、不设上限**。分支共**三处**（v4 补齐）：modelzoo `startPolling`（第 182-186 行）、webapp `startWebappPolling`（第 270-274 行）、`querySingleTask`（第 326-329 行）。
- 风险：本次改动 webapp 与 modelzoo 两侧 URL 形态，一旦拼写/形态错误，轮询会**静默永久循环**，用户看不到任何错误。
- 建议：

```js
// 任务不存在视为暂时性错误（服务端尚未就绪），但必须有上限：
// URL 形态错误会让 404 永久返回，无上限会导致静默死循环
const MAX_NOT_FOUND_RETRIES = 20;   // ≈ 100~120 秒（按现有退避：3s×10 + 5s×6 + 10s×4）
```

并在**三处** `isTaskNotFoundError` 分支统一累计 `notFoundCount`——建议抽共享 helper（如 `recordNotFound(taskId)`，计数 map 挂在 provider 内），避免三处各写一份计数逻辑漂移；超限后标记 Failed 且提示"任务不存在或接口不匹配"。同时建议 `isTaskNotFoundError` 优先读 `err.apiCode === 30009 || err.apiCode === 20011`（§6.3 挂载后可用），保留 message 正则作兜底。

> **口径说明（v5）**：notFound 是**独立计数**，与 `MAX_POLL_FAILS = 5`（`contexts.js:20`，普通网络/服务端失败的连续上限）互不影响。若希望"接口形态错误约 5 分钟内暴露"，把上限提到 60+ 或同步调整 `getPollingInterval`；若接受约 2 分钟暴露，保持 20 即可（跨境弱网瞬时波动不受影响）。另注意 §6.4（v6）的轮询阶梯口径修正：若阶梯被调整，本处"20 次 ≈ 100-120 秒"的窗口估算同步变化。

> ⚠️ 勿混淆：`stopPolling` 内有局部 `MAX_RETRIES = 5`（第 408 行），与 `apiConfig.js` 的 `MAX_RETRIES = 3` 同名异义（前者是 stopPolling 内部重查上限），本次不改但加注释区分。

### 3.10 `src/services/httpClient.js` + `src/utils/errorMessages.js`

见 §6.3（业务码映射与用户文案）。

---

## 4. 认证、请求头与合规

### 4.1 请求头（无变化）

- 认证：`Authorization: Bearer <API_KEY>`；
- `Content-Type: application/json`；
- 异步头：`X-BizyAir-Task-Async: enable` **仅对 AI 应用（webapp）接口生效**；标准模型 API（modelzoo）默认即为"提交返回 request_id + 轮询查询"模式，无需该头——与现有实现一致（`taskApi.js` 不发、`webappApi.js:24` 发）。代码拼写 `X-Bizyair-Task-Async` 与官方 `X-BizyAir-Task-Async` 大小写不同，HTTP 头不区分大小写，可选统一。

### 4.2 可选增强

- `X-Bizyair-Log-Mask-Fields: prompt,negative_prompt`（官方支持）可避免提示词以明文入库，建议在隐私敏感场景启用。

### 4.3 合规与密钥策略（v5 调和，必读）

官方 authentication 文档明确要求：**移动端不要把 Key 打包进二进制、前端不要直接放 Key**（应经自有后端中转）。因此采用 **Dev/Release 双轨**：

| 场景 | 策略 | 落地 |
|:---|:---|:---|
| 本地开发 / 冒烟 / 回归 | `.env` 填个人 Key（`EXPO_PUBLIC_BIZYAIR_API_KEY`），仅本机生效 | `.env` 不入库、不进入发行包 |
| 发行构建（APK / 生产 Web） | **不注入** 该变量；首启引导用户自带 Key | 构建脚本设 `EXPO_NO_DOTENV=1` + 密钥断言（机制见下）；`AppHeader` 空态即输入框（已存在），首页/应用页提交时提示（`useHomeSubmit.js:119-124`、`WebappScreen.js:240`、`:382`）文案统一为"请到 www.bizyair.ai 签发 API Key" |
| 后续增强（可选） | 经自有后端代理转发，密钥不下发到端 | 超出本次范围，仅记录方向 |

**Release 密钥隔离的落地机制（v6 补，官方依据已核实）**：Expo CLI 会**自动加载 `.env`** 并在打包时把 `process.env.EXPO_PUBLIC_*` 的引用**静态内联**进 bundle——只要构建机上存在 `.env`，密钥必然进入产物，不存在可"移除"的显式注入环节。三管落地：

1. **调试密钥放 `.env.local`**（官方推荐，`.gitignore` 覆盖 `.env*.local`），只存在本机、不入库、不上传构建环境；
2. **构建脚本强制隔离**：`scripts/build-android.ps1` 在 prebuild 前设置 `EXPO_NO_DOTENV=1`（官方开关，禁用 `.env` 自动加载；另有 `EXPO_NO_CLIENT_ENV_VARS=1` 可禁用内联环节），并**断言** `EXPO_PUBLIC_BIZYAIR_API_KEY` 为空，非空则中止构建；注意不可依赖 `NODE_ENV` 区分 env 文件（`expo export` 强制 `NODE_ENV=production`）；
3. **产物验收**：对 APK / 生产 bundle 解包全文搜索密钥字符串，命中数必须为 0（纳入 §10.2-12）。

> 依据：Expo 官方 *Environment variables* 文档（2026-07 更新）——`EXPO_NO_DOTENV` / `EXPO_NO_CLIENT_ENV_VARS` 为官方开关；官方同时强调 `EXPO_PUBLIC_` 变量对终端用户明文可见，敏感值本就不应放入，与 §4.3 官方 authentication 文档要求一致。

- `scripts/upload-proxy.mjs` 仅作为本地/局域网调试工具，**不得部署为公网服务**（它转发明文 Key）；
- 国内版账号的密钥/余额/实名状态与业务数据均不跨境，迁移后需按国际版规则重新注册/充值；部分模型要求实名（错误码 `30019`），提示文案需覆盖（§6.3）。

---

## 5. 模型库差异与处置（本次迁移的最大工作量）

### 5.1 量化口径（v3 修正）

- 国际版模型目录权威来源：`https://www.bizyair.ai/sitemap-model-api-1.xml`（实测 200，**164 个 slug**）。
- 项目 `MODELS` 顶层 key 实测 **61 个**。
- 与 sitemap 逐 key 匹配结果：**16 个** 可在 sitemap 命中"含同名 slug"的端点（其中 **9 个**为同名直通、**7 个**需加 `bizyair/` 前缀或改 mode/路径）；**2 个**（`kling-o3-4k`、`flux-klein-watermarker-remover`）需改为 `-channel` 变体 / `bizyair/` 前缀路径；其余 **43 个** 无同名端点，需按 §5.3/§5.4 逐项判定（其中相当一部分存在 `-channel` 变体或功能等价模型）。

> 口径说明：v2 的"17 个有对应 / 44 个无对应"来自粗粒度比对；v3 采用"同名 slug / 变体或改名 / 无对应"三分口径，避免把"可映射"误判为"需下架"。
>
> **假设声明（v6）**：sitemap 是 SEO 产物，可能滞后于真实可用模型。本方案以 `llms/modelzoo/{slug}/{mode}` 逐 mode 请求 200 作为存在性终判（§5.7），真实可调用性以 M2b 抽样提交冒烟为准——slug/mode 存在 ≠ 可提交（可能有实名/权限/区域限制）。

### 5.2 命名规律（可直接用于批量映射）

| 国内版 | 国际版 | 说明 |
|:---|:---|:---|
| `-base` 后缀（渠道版） | `-channel` 后缀 | 渠道接入版本 |
| `-official` 后缀 | `-official` 后缀 | 官方版本（拼写被修正，见下） |
| 自部署模型（无后缀） | `bizyair/{name}/{mode}` | 平台自部署（如 `bizyair/qwen-image/text-to-image`） |
| typo slug（`offcial`） | 正确拼写 | 国际版已修正，`modelEndpoints.js` 覆盖需删除 |

### 5.3 已确认映射（实测 sitemap）

**A. 同名直通（9 个）**

`seedream-4-5-official`、`wan-2-7-official`、`wan-2-7-image-official`、`wan-2-7-image-pro-official`（typo 修正后）、`seedance-2-0-official`、`seedance-2-0-fast-official`、`vidu-q3-pro-official`、`vidu-q3-turbo-official`、`happyhorse-1-0-official`

> **⚠️ mode 级差异（v5 实测，必读）**：slug 同名 ≠ 全部 mode 存在。已实测缺口：
> - `wan-2-7-official`：国际版仅 `text-to-video / flf-to-video / reference-to-video / video-edit`，**无 `image-to-video`**（项目 `models.js:562` 含该 mode，重建时需从 `modes` 移除或隐藏）；国际版另有 `flf-to-video`，可评估新增。
> - `seedance-2-0-official` / `seedance-2-0-fast-official`：3 mode 与项目一致（text-to-video / flf-to-video / reference-to-video）。
> - `vidu-q3-pro/turbo-official`：3 mode 一致；`happyhorse-1-0-official`：4 mode 一致（含 video-edit）；`seedream-4-5-official`：2 mode 一致。

**B. 需加 `bizyair/` 前缀 / 改 mode / 改路径（7 个）**

| 项目 key | 国际版 slug | 变化 |
|:---|:---|:---|
| `qwen-image` | `bizyair/qwen-image/text-to-image` | 加前缀 |
| `z-image-turbo` | `bizyair/z-image-turbo/text-to-image` | 加前缀 |
| `joycaption3` | `bizyair/joycaption3/vision` | 加前缀 |
| `ace-step` | `bizyair/ace-step/text-to-audio` | 加前缀 |
| `qwen3tts-custom-voice` | `bizyair/qwen3tts-custom-voice/text-to-speech` | 加前缀 + **mode 改名** |
| `seedvr2-upscale-image` | `bizyair/seedvr2-upscale-image/image-to-image` | 加前缀 + 改路径（mode 不变） |
| `kontext-dev-lora` | `bizyair/kontext-dev-lora/image-to-image` | 加前缀 |

> **mode 改名的实现路径（v5）**：`qwen3tts-custom-voice` 国际版 mode 为 `text-to-speech`，项目内部为 `text-to-audio`。推荐**方案 1**（零 UI 牵连）：
> 1. **`MODEL_ENDPOINTS` mode 覆盖（推荐）**：`'qwen3tts-custom-voice': { 'text-to-audio': 'bizyair/qwen3tts-custom-voice/text-to-speech' }`——内部 mode 名不变，`MODE_LABELS` / `OUTPUT_TYPE_MAP` / `getModelModes` / `payloadBuilder` 全不动；
> 2. **改 `models.js` 的 mode**：需同步改 `MODE_LABELS`（`homeReducer.js:1-13`）、`OUTPUT_TYPE_MAP` 与 `getModelModes`（`modelHelpers.js:39-97`）及首页 mode 选择器——仅在必须展示真实 mode 名时采用。

**C. `-channel` 变体映射（`-base` → `-channel`，可直接沿用渠道语义）**

| 项目 key（国内 `-base`） | 国际版 slug（实测存在） |
|:---|:---|
| `kling-o3-4k` | `kling-o3-4k-channel/reference-to-video` |
| `kling-o3-pro-base` / `kling-o3-std-base` | `kling-o3-pro-channel/*`、`kling-o3-std-channel/*` |
| `kling-3-0-pro-base` / `kling-3-0-std-base` | `kling-3-0-pro-channel/*`、`kling-3-0-std-channel/*` |
| `vidu-q3-pro-base` / `vidu-q3-turbo-base` | `vidu-q3-pro-channel/*`、`vidu-q3-turbo-channel/*` |
| `hailuo-2-3-base` / `hailuo-2-3-fast-base` | `hailuo-2-3-channel/image-to-video`、`hailuo-2-3-fast-channel/image-to-video` |
| `dreamactor-2-0-base` | `dreamactor-2-0-channel/reference-to-video` |
| `seedance-2-0-base` / `seedance-2-0-fast-base` | `seedance-2-0-channel/reference-to-video`、`seedance-2-0-fast-channel/reference-to-video` |
| `bza-image-b2-base` / `-official` | `nano-banana-2-channel/*`、`nano-banana-2-official/*` |
| `bza-image-b-pro-base` / `-official` | `nano-banana-pro-channel/*`、`nano-banana-pro-official/*` |
| `bza-image-o2-base` / `-official` | `gpt-image-2-channel/*`、`gpt-image-2-official/*` |
| `bza-video-x-base` / `-official` | `grok-imagine-channel/*`、`grok-imagine-official/*` |
| `bza-video-v3-1-pro-base` / `-fast-base` / `-official` / `-fast-official` / `-lite-official` | `google-veo-3-1-pro-channel`、`google-veo-3-1-fast-channel`、`google-veo-3-1-official`、`google-veo-3-1-fast-official`、`google-veo-3-1-lite-official`（同族已确认存在） |
| `bza-video-g-omni-flash-base` | `gemini-omni-flash-preview-channel/*`（国际版仅有 channel 变体） |

> **C 类 mode 差异（v5 实测，v6 口径订正）**：`google-veo-3-1-*` **全族无 `image-to-video`**（pro-channel = text-to-video/flf-to-video；official 另有 reference-to-video；fast-official 另有 video-extend/reference-to-video；lite-official 仅 text-to-video）。项目侧需缩量的**仅 `-base` 两款**——`bza-video-v3-1-pro-base`（`models.js:748`）与 `-fast-base`（`:758`）的 modes 含 `image-to-video`；**official 三款（`:772`、`:789`、`:806`）本就只 text-to-video + flf-to-video**，与国际版 official 系对齐，无需缩量。其余族与项目一致：`kling-3-0-*`/`kling-o3-*`（text-to-video + flf-to-video）、`vidu-q3-*-channel`（3 mode）、`seedance-2-0-*`（3 mode）、`hailuo-2-3-*`（仅 image-to-video 单 mode）、`nano-banana-2`（text-to-image + image-to-image）、`nano-banana-pro` / `gpt-image-2`（2 mode）、`grok-imagine-channel`（2 mode）。

**D. 功能等价 / 需逐项确认（不保证一一对应）**

| 项目 key | 国际版候选 | 备注 |
|:---|:---|:---|
| `birefnet-background-remover` | `bizyair/birefnet/image-to-image` | 已实测存在 |
| `flux-klein-watermarker-remover` | `bizyair/flux-klein/image-to-image/watermarker-remover` | 已实测存在 |
| `z-image-base` | `bizyair/z-image/text-to-image` | 无同名 slug，需确认参数是否等价 |
| `bza-chat-g3-flash-official`、`bza-chat-g3-1-flash-lite-official` | `gemini-3-5/3-6/3-7-flash-official/large-language-models` | flash 系已确认；**pro 系（`bza-chat-g3-1-pro-official`）未在 sitemap 命中**，需核对 |
| `bza-vision-g3-*`、`bza-vision-g3-1-pro-official` | `gemini-3-5/3-6/3-7-flash-official/vision` | 同上，需按型号核对 |
| `seedream-5-0-official`、`seedream-4-0-official` | `seedream-5-0-pro-official` / `-lite-official` 等 | 无同名 slug，需按新型号重新绑定 |

### 5.4 无对应（下架候选，需人工复判）

`wan-2-5-official`、`wan-2-6-official`、`wan-2-7-extend-official`（国际版 wan-2-7-official 无 `video-extend` mode）、`ltx-2-3`（国际版无 ltx 系）、`flux-kontext-pro-base`、`flux-kontext-max-base`、`bza-image-f-k-pro-base`、`bza-image-f-k-max-base`（**国际版 sitemap 无任何 `flux-kontext` 端点**，仅 `bizyair/kontext-dev-lora`）；`seedream-4-0-official` 已被 `seedream-4-5/5-0` 取代，按 §5.3-D 重新绑定而非直接下架。

> ⚠️ v2 把 `kling-*-base`、`hailuo-2-3-*`、`dreamactor-2-0-base`、`seedance-2-0-*` 归入"无对应"属于**误判**，这些模型在国际版均有 `-channel` 变体（见 §5.3-C）。真正无对应的是上表模型。

### 5.5 结构性变化：三段路径

国际版存在 `{owner}/{name}/{mode}/{sub}` 形式端点，例如：`seedream-5-0-pro-official/image-to-image/edit`、`seedream-5-0-pro-official/image-to-image/layer-decomposition`、`mureka-v9-official/text-to-audio/song-generation`、`bizyair/flux-klein/image-to-image/watermarker-remover`。

`taskApi.js` 的 `resolvePath()` 默认规则 `${modelId}/${mode}` 无法表达三段路径，必须在 `modelEndpoints.js` 注册表中登记（该文件已支持字符串形式覆盖，**无需改结构**）。

### 5.6 需要同步重做的文件（含拆分计划）

`src/constants/models.js`（61 个模型）、`src/constants/modelEndpoints.js`、`src/constants/pricing.js`、`src/constants/modelMeta.js`、`src/screens/home/homeReducer.js`（默认参数）、`src/utils/payloadBuilder.js`（新模型参数结构）。

> **⚠️ 800 行约束与拆分计划（v5 新增，实施前置）**：
> - 现状实测（v6 复核）：`models.js` 总行 1080 / **有效行 1061**，`WebappScreen.js` 总行 948（含末尾空行）/ **有效行约 833**，均已超项目"单文件有效代码 ≤800 行"硬约束；
> - **`models.js` 拆分先行**（纯搬迁、零行为变化，作为第 10 步的 10a）：按类别拆为 `src/constants/models/{image,video,llm-vision,audio,other}.js`，`src/constants/models/index.js` 聚合导出，保持 `MODELS` 接口与现有导入路径（`from '../constants/models'` 解析到 `index.js`）不变；随后在拆分后的文件上重建数据；
> - **`WebappScreen.js` 净增行控制 ≤0**：兼容层放 `webapp/utils.js`（新文件），调用点只允许改 1-2 行；如新增行超出需在同文件等量删减（棘轮规则）；
> - 其余重建文件（`pricing.js` 167 / `modelMeta.js` 95 有效行，v6 复核）无超限风险。

> **⚠️ 易漏：默认模型 key `bza-image-b2-base` 硬编码在 4 处**（该模型需重映射为 `nano-banana-2-channel`；另需同步 `MODEL_MANUFACTURERS` 映射表）：
>
> - `src/context/history/contexts.js:8` — `DEFAULT_HOME_STATE.modelId`
> - `src/screens/home/homeReducer.js:16` — `initialState.modelId`
> - `src/utils/modelHelpers.js:110` — `getModelInfo()` 兜底 `MODELS[modelId] || MODELS['bza-image-b2-base']`：删 key 后兜底返回 `undefined`，下游访问 `.prices` / `.category` 直接崩溃（第 108 行告警文案同样含旧 key，需一并替换）
> - `src/context/FavoritesContext.js:8` — `DEFAULT_FAVORITES`（另含 `bza-image-b-pro-official`、`bza-image-o2-official`）
> - `src/constants/modelMeta.js` — `MODEL_MANUFACTURERS` 需同步重建；**现状 60 条对 61 个 key（缺失 `wan-2-7-official`）**，重建时补齐并校验覆盖全部新 key
>
> 收藏列表加载时虽有 `MODELS[modelId]` 过滤自愈，但**已持久化的 homeState 与 `getModelInfo` 兜底逻辑不会自愈**。
>
> **存量数据迁移（v5 细化）**：`FavoritesContext.js:10-13` 已有 `MODEL_ID_MIGRATIONS` 迁移表机制（曾处理 wan-2-7 typo 迁移）。本次要点：
> 1. **抽公共常量**：迁移表移到共享文件（如 `src/constants/modelIdMigrations.js`），由 `FavoritesContext` 与 `HistoryProvider` 共同引用——它现定义在 FavoritesContext 模块内部，HistoryProvider 直接引用会造成模块耦合；
> 2. **写入规则**：处置=映射的 key 写入 `old → new`；处置=下架的 key **不进入**迁移表（由现有 `MODELS[modelId]` 过滤与 `getModelInfo` 兜底自然淘汰），避免"迁移到不存在的 key"；
> 3. **应用点**：`FavoritesContext.loadFavorites`（已有）+ `HistoryProvider.loadHomeState`（新增：读取持久化 homeState 后过一次映射表）+ `modelHelpers.getModelInfo` 兜底 key 更新；
> 4. 映射关系随附录 C 矩阵冻结后生成（矩阵"国际版 slug"列即迁移 target）；
> 5. **先审计存量条目（v6 新增）**：现有 `MODEL_ID_MIGRATIONS`（`FavoritesContext.js:10-13`）中 `'wan-2-7-offcial' → 'wan-2-7-extend-official'` 疑似既有错误——typo 名被迁到 extend 型号而非 `wan-2-7-official` 本体，且 extend 型号是 §5.4 下架候选，旧收藏会被迁到待删 key。重建迁移表时将其修正为 `wan-2-7-official`（该 key 处置为直通保留，见 §5.3-A）。

### 5.7 处置矩阵与验收方法

- 逐模型填报矩阵（模板见 **附录 C**），**先冻结矩阵、再改代码**；
- 每个国际版 slug 的验收方式：请求 `https://www.bizyair.ai/llms/modelzoo/{slug}/{mode}?lang=python` → 必须 200，并核对其中"请求 URL / 参数表 / 响应字段"与 `payloadBuilder.js` 的映射（实测该端点 200，见附录 A）。**验收分级（v6）**：**D** = 文档 200 且参数表一致；**S** = 抽样真实提交成功——slug/mode 存在 ≠ 可提交（实名/权限限制，§5.1 假设声明），主力模型（图片/视频各 Top 5）必须达到 S 级（M2b 执行）；
- **逐 mode 验收（v5）**：验收必须覆盖**每一个**待用 mode（逐个 mode 请求）；矩阵中缺失的 mode 在"处置"列标注"缩量"，并同步在 `models.js` 的 `modes` 中移除、UI 隐藏对应入口；
- **已实测 mode 缺口**（v5，须复核并落入矩阵）：`wan-2-7-official` 无 `image-to-video`；`google-veo-3-1-*` 全族无 `image-to-video`（详见 §5.3）；
- 参数差异（新增/改名/枚举变化）逐项记入矩阵"参数差异"列，作为 `payloadBuilder.js` 与 `homeReducer.js` 的改动依据。

### 5.8 下架模型的降级策略

- 历史记录：**可查看**（保留 `modelName`/结果），**禁止重跑**（重跑将命中 `404` / `60014 节点已废弃` / `20015` 等错误，见 §6.1）；
- **"禁止重跑"落地位置（v5 补）**：`HistoryProvider.resubmitTask`（第 484 行起）首行校验 `MODELS[historyItem.modelId]`，不存在则返回 `false` 并提示"该模型已下线，无法恢复参数"；`HistoryCard.handleResubmit`（第 54-74 行）失败分支文案同步；
- 收藏列表：加载时过滤失效 key（现有逻辑已支持），并为被过滤项给出一次性提示；
- 首页默认模型与 `getModelInfo` 兜底必须指向国际版有效 key（§5.6）。

---

## 6. 错误处理与状态语义（v3 重写）

### 6.1 HTTP 状态码 ↔ 业务码（官方 reference 页）

| HTTP | 业务码 | 含义 |
|:---|:---|:---|
| 200 | 20000 / 20002 | 成功 / 异步已受理 |
| 400 | 20015 / 40025 / 40039 | 参数无效 / `input_values` 缺失 / 表单字段缺失 |
| 401 | 30008 / **20052** / 20093 / 20054 | 未登录 / 密钥无效 / 密钥过期 / 密钥不存在 |
| 402 | 20049 | 余额不足 |
| 403 | 30001 / 20021 / 30019 / 30094 | 账号禁用 / 内容审核 / 需实名 / 节点下线 |
| 404 | 30009 / 20011 / 20224 / 30046 / **20230** | 任务不存在 / 记录未找到 / 应用未找到 / 输出未找到 / 资源版本未找到 |
| 429 | 50600 / 50601 / 50602 / 50603 / 50604 / 30039 / 30040 / 59006 / 20094 | 各类限流与配额 |
| 500 | 60000 / 50502 / 50503 / 50507 / 50508 / 50510 / 50511 | 服务端与 ComfyUI 内部错误 |
| 503 | 60012 / 50517 | 系统繁忙 / 第三方超时 |

> 说明（v5）：上表按官方 errors-retry 全表归纳，**具体 HTTP 状态码以实测为准**（402/403/429 形态待回填，见 §8-6）；官方另有 `30101 / 59009 / 60014 / 50515 / 50516` 等第三方节点类错误码，已归入文案表（§6.3）。

### 6.2 `20052` 实测事实（修正 v2 表述）

- 实测（无效 key 请求 `api/v1/wallet`）：**HTTP 401 + body 为纯文本字符串 `"Token is invalid"`（无业务码）**；
- 官方 authentication 文档示例：`401` + `{"code":"20052","message":"无效的API密钥"}`（注意 **code 为字符串**）；
- 结论：**不能假设 20052 一定出现在 body 中**，文案引导必须同时覆盖"有 code 的 401"与"无 code 的 401"两条路径。

### 6.3 改造方案（`httpClient.js` + `errorMessages.js`）

**① `httpClient.js` 非 2xx 分支挂载业务码**（第 29-36 行）：

```js
if (!response.ok) {
  const text = await response.text().catch(() => '');
  let apiCode; let apiMessage = text;
  try {
    const body = JSON.parse(text);
    if (body && typeof body === 'object') {
      apiCode = Number(body.code) || undefined;   // 官方示例中 code 可能是字符串
      apiMessage = body.message || text;
    } else if (typeof body === 'string') {
      apiMessage = body;                          // 如 '"Token is invalid"' 解析后是字符串，须去引号
    }
  } catch { /* 非 JSON 纯文本响应走默认值（text） */ }
  const err = new Error(`[${response.status}] ${apiMessage || response.statusText}`);
  err.status = response.status;
  err.apiCode = apiCode;
  err.apiMessage = apiMessage;
  err.code = classifyError(err);
  throw err;
}
```

**② `errorMessages.js` 增加业务码文案**（新增映射，`getUserMessage` 优先查业务码）：

```js
const API_CODE_MESSAGES = {
  // 认证 / 密钥
  20052: 'API 密钥无效，请到 www.bizyair.ai 重新签发后填入',
  20054: 'API 密钥不存在（可能已删除或重置），请到 www.bizyair.ai 重新签发',
  20093: 'API 密钥已过期，请到 www.bizyair.ai 重新签发',
  20094: 'API Key 配额已耗尽，请检查账户或更换 Key',
  // 余额 / 内容 / 实名 / 节点
  20049: '账户余额不足，请先充值',
  20021: '内容包含禁止或敏感内容，请修改后重试',
  30019: '该模型仅限已实名认证的用户调用',
  30094: '该模型节点已下线，暂时不可调用',
  60014: '该模型节点已废弃，请改用新模型',
  // 资源不存在
  20224: '应用不存在或已被下架',
  20230: '应用不存在或已被下架',
  30009: '任务不存在或已被清理',
  30046: '任务输出尚未生成或已过期',
  // 取消 / 中断冲突（v5 补齐，官方 Cancel/Interrupt 错误表）
  30035: '任务正在运行，请先中断再取消',
  30036: '任务未在排队中，无法取消',
  30038: '任务未在运行中，无法中断',
  20098: '该任务无法中断',
  20100: '该任务无法取消',
  30041: '请先取消任务再中断',
  30047: '任务状态已变更，请刷新后重试',
  // 限流 / 配额（v5 补齐）
  30039: '任务排队已达上限，请稍后重试',
  30040: '任务并发已达上限，请稍后重试',
  50600: '请求过于频繁，请稍后再试',
  50601: '请求频率超限（RPM），请稍后重试',
  50602: '请求频率超限（TPM），请稍后重试',
  50603: '请求频率超限（RPD），请稍后重试',
  50604: '请求频率超限（RPH），请稍后重试',
  // 第三方节点（v5 补齐）
  30101: '第三方接口认证失败，请稍后重试',
  59009: '第三方接口限流，请稍后重试',
  50515: '第三方接口响应异常，请稍后重试',
  50516: '第三方接口元数据异常，请稍后重试',
  50517: '第三方接口超时，请稍后重试',
  // 上传 / 系统
  20087: '文件过大，请压缩后重试',
  60012: '系统繁忙，请稍后重试',
};
```

**③ 状态码兜底（v5 新增，覆盖 §6.2 的"无 code 401"）**：`getUserMessage` 查表顺序改为 `err.apiCode` → HTTP 状态兜底 → `classifyError` 分类，确保无业务码的 401 也给出可行动文案：

```js
// 无业务码的 401（实测 body 为 "Token is invalid"）也要指向"重新签发"
const STATUS_FALLBACK = {
  401: 'API 密钥无效或已过期，请到 www.bizyair.ai 重新签发',
  402: '账户余额不足，请先充值',
};
```

> 取舍说明（v6）：`STATUS_FALLBACK` 只覆盖 401/402——这两类已被实测证明存在"无 code"形态（§6.2）；无 code 的 403/429/404 暂走 `classifyError` 通用文案，待 §8-6 实测回填后再决定是否扩展。

**④ 密钥校验链路文案（v5 新增）**：`ApiKeyContext.refreshUserInfo`（第 44-46 行）与 `AppHeader.handleSaveApiKey`（第 50-51 行）不经过 `getUserMessage`，需共用同一文案来源（例如导出 `getAuthErrorMessage(err)` 供三处调用），否则存量失效密钥在这些入口仍显示"密钥验证失败/密钥保存失败"。

- `webappApi.js:84` 的错误码分支保留（HTTP 200 + `code!==20000` 的场景仍存在，见 §3.2 口径修正），并补 `20230`；
- `HistoryProvider.isTaskNotFoundError` 改为优先读 `err.apiCode === 30009 || err.apiCode === 20011`（§3.9）。

### 6.4 状态枚举与轮询参数

- 状态枚举：`Queuing / Preparing / Running / Success / Failed / Canceled`（后三者为终态）——官方 quickstart 将它列为**通用**状态枚举（非仅 webapp）。**v5 修正（v6 行号订正）**：webapp 侧（第 214、254 行）三种终态齐全，modelzoo 侧（第 152、170 行）**只有 Success / Failed**。App 内 modelzoo 虽无取消入口（`taskApi.js` 无 cancel/interrupt），但服务端侧取消/超时、共享 Key 的他端操作均可能产生 `Canceled` 态——**补 `Canceled` 分支为必要修复**（一行改动），否则该状态会永久轮询；
- 跨境链路建议调整常量：

```js
export const REQUEST_TIMEOUT_MS = 25000;   // 原 15000，跨境 RTT 更高
```

> **⚠️ 轮询间隔口径修正（v6）**：轮询阶梯硬编码在 `contexts.js:24-29 getPollingInterval`（按耗时 3s/5s/10s/15s），`POLLING_INTERVAL_MS` 仅决定**首次**轮询延迟（`HistoryProvider.js:203`、`:291`）——单独把它 3000→4000 几乎不减少请求量。若确需降频，应同步调整阶梯（如 4s/6s/12s/15s），并注意 §3.9 的 notFound 窗口估算同步变为约 110-140 秒；否则**维持现状不改**（推荐：跨境波动下保守为先，v5 的"改 POLLING_INTERVAL_MS"建议撤回）。

- 重试策略不变：仅 GET/PUT/HEAD 自动退避重试，POST 不重试（防重复提交/重复扣费）。

---

## 7. 其他处理项

| 项 | 结论 |
|:---|:---|
| 证书 | 全链路标准 HTTPS，两个 API 主机证书有效，**无需自定义处理** |
| 重定向 | `bizyair.ai` → `www.bizyair.ai` 为 308（永久重定向，仅页面；实测社区页，v5 修正 v4 的"301"表述）；API 主机无重定向 |
| 跨域 CORS | **已实测放行**：`api.bizyair.ai` 与 `meta.bizyair.ai` 均返回 `Access-Control-Allow-Origin: *`，OPTIONS 预检 204（`Allow-Methods: GET,POST,DELETE,PUT,PATCH`、`Allow-Headers: *`）。Web 端可直连 API，**无需完整 API 代理**；上传代理仍保留（OSS PUT 签名与密钥暴露原因，且 `us-east-1` 直连延迟更高） |
| 超时/轮询 | 见 §6.4 |
| 响应结构 | `extractTaskResult()`（读 `outputs.images/videos/audios/texts` **对象**）与 `extractWebappResult()`（读 `outputs[].object_url` **数组**）恰好分别兼容国际版 modelzoo 与 webapp 两种返回格式，**无需改动** |
| 输出文件有效期 | 国际版输出 URL **默认 15 天过期**（响应含 `expired_at`）。`resultCache` 已在任务完成时本地缓存，Android 端无影响；Web 端缓存能力受限，建议历史页对超期远程结果给出"链接可能已过期"提示（可选） |
| 计费与文案 | 国际版为独立账号/钱包，`pricing.js` 需按国际版价格表重建；`addCoinsSpent` 与"金币"文案位置（v5 补）：`HomeScreen.js:607`、`HistoryCard.js:274`、`HistoryFilters.js:185`、`FavoriteModelsLayer.js:169`，与 `charge_balance_amount`/`gift_balance_amount` 语义一并按真实返回确认后调整（见 §8） |

---

## 8. 遗留待实测项（v6）

1. ~~`user/info` 与 `wallet` 响应字段名~~（**已结案，v6.1**，见 §3.7：`user/info` 无 `name` 有 `nick_name`/`level_display_name`；`wallet` 仅 `gift_balance`）；
2. 国际版**计费单位/货币**与价格表获取方式（`pricing.js` 重建依据，含 `bizyair/` 自部署模型价格）。**备选（v4 新增）**：若无公开价格接口，第一版国际版隐藏价格展示（`pricing.js` 返回 null 时 UI 降级），价格表后补，不阻塞第二批启动；
3. ~~真实 Key 下 webapp `create` 请求体字段是否与文档完全一致~~（**已结案，第四批实测**，见文末「2026-10-06 第四批收尾实测回填」：文档字段 `web_app_id`/`suppress_preview_output`/`input_values` 实测成立，全链路 Success）；
4. 取消/中断在状态冲突时的实际返回（`30035` / `30036` / `30047`）与前端提示；
5. `20230` 与 `20224` 在详情接口的具体适用分支（§3.2 已同时映射，待实测确认是否需要区分）；
6. **402 / 403 / 429 的 body 实际形态**（v4 新增）：§6.2 已证明"文档形态 ≠ 实测形态"，其余状态码同样不能假设——用低余额 Key 触发 402、并发压测触发 429，回填 §6.1 表；
7. **输出 URL 是否需鉴权（v5 新增）**：`object_url` / `access_url` 在无 `Authorization` 头时能否直接拉取（影响 `expo-image` 渲染、`resultCache` 下载与历史页回显）；若不需鉴权，确认 15 天有效期仅由 `expired_at` 控制；
8. ~~upload token 的 `access_url` 字段~~（**已结案，v6.1**：稳定返回、与 commit `data.url` 同域同路径，§3.3 三级兜底启用）；
9. **旧国内版输出 URL 可达性（v6 新增）**：`storage.bizyair.cn/outputs/...` 在停服后是否仍可访问——未本地缓存的历史结果（Web 端、缓存被清）可能已无法回显。若不可达，历史页对国内版结果统一提示"原服务已停服，结果不可回放"，并在 §10.2-8 验证；
10. **国际版账号体系可行性（v6 新增，商业前提）**：注册、充值（支付方式）、实名（错误码 `30019`）对目标用户群的可达性——非 API 层面，但决定"用户怎么办"的迁移指引，需人工走查一遍全流程。

**已结案**（无需再测）：CORS（双主机放行）、`file_type=inputs_temp`、OSS `bucket`/`endpoint`、`dict.base_models`（35 项）/`tags`（82 项）结构、community 参数要求、detail `input_nodes` 结构、三段路径存在性、终态枚举（官方 quickstart 通用枚举含 `Canceled`）、`llms/modelzoo/{slug}/{mode}` 验收端点（实测 200）、社区页重定向（308）、`-channel` 变体族与 `bizyair/` 前缀族存在性、已定位的 mode 级缺口（`wan-2-7-official` / `google-veo-3-1-*` 缺 `image-to-video`）。

**已结案（v6 追加）**：community 分页/列表项字段（`page_size` 蛇形、顶层 `counter` 为空、`used_count` 在 `versions[0].counter`，兼容处理见 §3.2-v6）；Expo Release 密钥隔离机制（官方 `EXPO_NO_DOTENV` / `EXPO_NO_CLIENT_ENV_VARS` 开关，见 §4.3-v6）。

**已结案（v6.1 追加，真实 Key 实测）**：`user/info` 与 `wallet` 响应字段（§3.7）；upload token `access_url` 与整体结构（§3.3）；OSS `bucket=bizyair`（纠正官方文档 `bizyair-ai`，§3.1）。

**已结案（2026-10-06 实施实测回填，第一批步骤 1-9b 交付验证）**：
- **§8-7 输出 URL 鉴权**：结案——`storage.bizyair.ai/outputs/*.jpeg` 无 `Authorization` 头直接 GET 返回 **200**（实测 584,631 字节，content-type `application/octet-stream`），有效期仅由 `expired_at` 控制；
- **§8-2 计费口径（部分）**：`wallet` 单位即扣费单位（赠送余额同池扣减）。实测 `seedream-4-5-official/text-to-image` 最低像素档（`image_size: 1920x1920` = 3,686,400 px，参数表下限）扣费 **60**（余额 899 → 839）；公开价格表仍未获取，`pricing.js` 暂沿用国内档（§5.6 注释"待国际价表回填"）；
- **§8-3 webapp create 请求体**：未实测（第一批未消耗 webapp 任务额度），维持待测；
- **§10.1 静态冒烟**：16/16 OK（实施前、还原断链后、交付前共三轮全过）；
- **上传链路**：`upload-proxy.mjs` 实测 `POST /api/upload`（852 字节 PNG）→ 返回 commit `data.url`：`https://storage.bizyair.ai/inputs_temp/20261005/*.png`，与 §3.5 finalUrl 修复一致；
- **真实生成**：`seedream-4-5-official/text-to-image`（prompt + `image_size: 1920x1920`）提交 `code 20000` → `request_id` → 13.6 秒 Success → `outputs.images[0]` 无鉴权可访问；
- **第一批模型映射验收（§5.7 D 级）**：19 个 key × 36 个 mode 逐项请求 `llms/modelzoo/{slug}/{mode}?lang=python` 全部 200（含 `qwen3tts-custom-voice` mode 覆盖与 `flux-klein` 三段路径）；
- **轮询健壮性反向验证（§3.9）**：故意将 `API_BASE` 改错 → 真实 404 ×20 → **127.9 秒**落 Failed（"任务不存在或接口不匹配"），无静默死循环；还原后冒烟复跑全 OK。

**已结案（2026-10-06 第二批上半场调研回填，全量矩阵见附录 C）**：
- **§8-2 价格数据源（结案）**：国际版价格表 API `https://www.bizyair.ai/api/pricing/v1/modelzoo/price_table/{slug}/{mode}` **匿名可访问**（无需网站会话；此前实测 401 的为其他路径）。`pricing_values` 整数值即 wallet 扣费单位（官网页面显示 ÷1000），三重实测吻合：`seedream-4-5-official/t2i=60`（第一批扣 60）、`nano-banana-2-channel/t2i 1k=40`（本批扣 40）、`vidu-q3-turbo-channel/t2v 540P=50`（本批扣 50）。计价单位三分：图片 call/image（按次）、**视频 second（按秒）**、LLM M Tokens（input/output 分列）——重建 `pricing.js` 必须按 `unit_name` 区分。全站 benefit 统一 RPD 60 / RPH 30 / RPM 6。97 个 slug/mode 价格已全量回填附录 C；
- **§8-2 处置矩阵（M2a/M2b 结案）**：61 行全量矩阵已冻结（附录 C）；91 次 llms 探测（68×200 / 23×404）+ 80 份参数表比对完成。新增实测缩量：`hailuo-2-3-channel/-fast-channel` 无 text-to-video、`google-veo-3-1-lite-official` 无 flf-to-video；`seedream-5-0-pro-official` 裸 i2i 404 但三段路径 `image-to-image/edit` 200；下架候选 11 key 全部附 404 负例证据；Gemini flash 系（3-5/3-6/3-7 × llm/vision）存在性确认但与国内 G3/G3.1 的型号绑定无文档依据（BLOCKED.md 待裁决）；
- **M2b 抽样真实提交（S 级）**：6 次提交（5 Success + 1 Failed），总扣费 104（839→735）：`gemini-3-5-flash-official/llm` 扣 2（request_id `3ccb085c…`）、`nano-banana-2-channel/t2i` 1k 扣 40（`fe71f130…`）、`bizyair/qwen3tts-custom-voice/text-to-speech` 扣 10（`f08096f9…`）、`vidu-q3-turbo-channel/t2v` 540p×1s 扣 50（`261d032d…`）、`bizyair/birefnet/image-to-image` 扣 2（`c9c8f7fd…`）；1 次 Failed 为 `gemini-3-6-flash-official/llm`（`6fc24713…`，error_code 50515 empty output，疑 max_tokens=64 过小被 thinking 消耗，未扣费）——重建 LLM 参数时 `max_tokens` 下限应给足；
- **payloadBuilder 参数失配清单（第三批必改）**：本批逐 mode 参数表比对发现的改名/结构差异已全部记入附录 C"参数差异"列，含**第一批已实施模型仍存在的失配**（`qwen-image`/`z-image-turbo` 现发 width/height、`seedream-4-5` 现发 size、`birefnet`/`seedvr2`/`flux-klein` 现发 image 单值等）——第一批 D 级验收仅验证了端点存在性，参数层重建时按附录 C 逐行修正；
- **枚举差异**：图片分辨率枚举国际为小写（`1k/2k/4k`，`nano-banana-2-official` 另有 `0.5k`）；vidu channel 分辨率小写 `540p/720p/1080p`；qwen3tts `response_format` 少 `pcm`；vidu duration 值域 1~16。

**已结案（2026-10-06 第三批重建实测回填，附录 C 16 项待裁决经领导裁决后代码落地）**：
- **MODELS 61→49 key**：下架 11＋旧 gemini 4 删除，新增 gemini-3-5/3-6/3-7-flash-official（各 large-language-models+vision 双 mode，paramType 复用 vision-g）；`models.js` 拆分为 `models/{image,video,llm-vision,audio,other}.js + index.js`（纯搬迁，逐 key 字符级比对零差异）；MODEL_MANUFACTURERS 重建 49 条与 MODELS 双向覆盖一致；modelIdMigrations 新增 4 条 gemini 迁移。
- **payloadBuilder 全量重建**：参数名以重建时重抓的 64 份 llms 文档为准（附录 C"参数差异"列逐行落地）。**矩阵行 18 勘误**：`seedance-2-0-official` flf 实测首帧字段为 `image_urls`（尾帧 `last_frame_url`），channel 系才用 `first_frame_url`；另实测补充：kling-3-0-std flf 有 `aspect_ratio` 必填而 pro flf 无；vidu official i2v 字段为 `images`（channel 为 `image_urls`）；google-veo-3-1 official 系分辨率实为 `720p/1080p`（价格表无 480p 档，UI 未暴露）；happyhorse 文档含 480P 但价格表仅 720P/1080P 两档。
- **pricing.js 全量重建**：95 份 price_table API 快照；call/second/M Tokens 三类单位；旧国内档常量（SEEDANCE_RATES、LTX_PRICE、WAN_I2V_PRICES 等）保留定义仅供 re-export 兼容。LLM input/output 分列：前端估算按 output 单价保守计（提交前无法预知输出 token 数）。
- **真实提交回归（4/4 Success，扣费 102/110，余额 735→633）**：`nano-banana-2-channel/t2i` 1k 扣 40（`43a236a0-1874-4bdb-b983-4ae81e0a9518`，jpg 无鉴权 200）；`bizyair/qwen3tts-custom-voice/text-to-speech` 扣 10（`043edf3e-0ad4-4a59-88d0-5b92144b704c`，mp3 200）；`vidu-q3-turbo-channel/t2v` 540p×1s 扣 50（`d8d65b54-031e-47f6-a4f6-31f02926ed3c`，mp4 200）；`gemini-3-5-flash-official/llm` 扣 2（`76b3a35e-cb01-491a-9896-674dd77a56db`，文本输出正常）——payload 全部由重建后 buildPayload 生成、端点经 MODEL_ENDPOINTS 解析，与 App 运行时同构，扣费与价格表精确吻合。
- **机器验证**：MODELS 49 key 断言、8 代表模型 payload 新旧参数名断言、eslint 0E/12W、expo export exit 0、§10.1 冒烟 16/16 全部通过；行数棘轮达标（modelEndpoints.js 37→139 为映射登记唯一载体的有意豁免，taskApi.js 不在改造白名单）。

**已结案（2026-10-06 第四批收尾实测回填）**：
- **§8-3 webapp create（结案）**：经 App 服务层真实链路（`webappApi.js` submitWebappTask → queryWebappTaskDetail 轮询 → queryWebappTaskOutputs）跑通 Z-Image-Turbo Text-to-Image（web_app_id=56911，input_nodes 仅 text/width/height/batch_size）。请求体 `{web_app_id, suppress_preview_output:false, input_values:{text,width,height,batch_size}}` 与文档一致，input_values 键 = input_nodes 的 `field_name`；977ms 返回 request_id，状态流 **Preparing（~4min 冷启动）→ Running → Success**（总 ~12min）；outputs 为 `[{object_url, output_ext:'.png', cost_time, error_type:'NOT_ERROR'}]`，object_url **无鉴权 GET 200**；扣费 **27**（wallet 633→606）。实测新知：①detail 与 create 的 web_app_id 用 **version id**（community 列表 `versions[0].id`，detail `data.id` 同值），列表顶层 `id` 是 bizy_model_id，打 detail 端点 404；②非终态期间 detail 仅含状态/时间戳、outputs 仅 `{request_id,status}`，终态后 detail 增 `cost_times`、outputs 增 outputs 数组。
- **§4.3 / §9-11 密钥隔离（落地并验收）**：`build-android.ps1` 新增 [1.5/8]——环境变量 `EXPO_PUBLIC_BIZYAIR_API_KEY` 非空即中止（反向验证实测：设 dummy 运行在版本递增与 prebuild 前退出 1），随后设 `EXPO_NO_DOTENV=1`。增量构建产物 `bizyair-assistant-v1.1.16-release.apk` 三重验收：①`findstr /m /c:"sk-lr***"` 对 APK 直搜 0 命中；②解包后 `assets/index.android.bundle`（Hermes）与 `classes.dex` 内 `sk-lr***` 与 `EXPO_PUBLIC_BIZYAIR_API_KEY` 均 0 命中（metro 连变量名一并内联消除）；③阳性对照（bundle 内可搜到 `meta.bizyair.ai` 与本批新增字符串）证明 0 命中为真隔离。构建备注：前两次运行失败于 Maven Central 下载 react-android AAR 读超时（网络环境问题，详见 BLOCKED.md 第四批 §4），缓存播种后成功，未改任何构建文件。
- **§3.6 存量密钥区域戳（落地）**：`ApiKeyContext` 加载时查 AsyncStorage 键 `bizyair_api_region`，无戳则把已存密钥批量标记 `invalid`（文案"失效（国内版签发）· 请到 www.bizyair.ai 重新签发"，ApiKeyDropdown 展示）并写戳 `intl`，一次性迁移。
- **UI 显隐收敛（BLOCKED 第三批 §4 四项全部了结）**：KlingO34K 保留原声开关、LLM/Vision 思考模式/联网搜索/详细度开关、JoyCaption temperature/maxTokens/doSample/nameInput/customPrompt 输入、vidu style 选择器（限 t2v）——控件层净删约 150 行，payload 层未动（72 项行为断言复跑全过）。
- **flf 首帧校验修正**：原校验查 `firstFrameUrls`，但 flf 模式首帧上传卡写入 `imageUrls`（且 vidu flf payload 直接读 imageUrls）→ 已改为查 `imageUrls`；kling/seedance/bza-video-v3 系 flf 的 payload→useHomeSubmit 映射断层仍在白名单外（见 BLOCKED.md 第四批）。

---

## 9. 实施步骤

> **顺序原则（v5 定稿）**：先把"未知"变"已知"，再改代码；**错误链路改造前移到端点改动之前**（否则错误路径验证测的是未改造链路）。

0. **前置**：到 `www.bizyair.ai` 签发 API Key；用官方 curl 形态手工验证 `user/info`、`wallet`、`webapp create`，回填 §8 的 1-3 项；
1. 修改 `httpClient.js` + `errorMessages.js`（业务码链路 + 状态兜底 + 校验链路文案，§6.3）；
2. 修改 `apiConfig.js`（双主机 + 全部端点 + OSS 特征 + `UPLOAD_FILE_TYPE` + §6.4 常量）；
3. 修改 `webappApi.js` 5 处 URL 形态；
4. 修改 `uploadApi.js`（`file_type` + 优先 commit `url`）；
5. 修改 `WebappScreen.js`（正则/URL）+ 新增 `normalizeAppDetail` 兼容层（`webapp/utils.js`，在 `WebappScreen.js:162` 与 `CommunityAppPreview.js:36` 两处接入；**WebappScreen 净增行 ≤0**）；
6. 修改 `upload-proxy.mjs`（双主机 + `file_type` + 用 `finalUrl` 修 bug）；
7. `AppHeader.js` 字段兜底 + 文案；
8. `HistoryProvider.js` notFound 上限（§3.9）+ modelzoo 终态补 `Canceled`（§6.4）+ `resubmitTask` 下架校验（§5.8）；
9. 执行 §10.1 静态冒烟 + §10.2 功能回归（范围按 9b 是否执行界定，见 §10.2 范围说明）；
9b. **第一批模型映射前移（v6 新增，消除批次断档）**：把 §5.3 已确认的 18 个 key（9 直通 + 7 前缀 + 2 变体）一次性落地——`MODEL_ENDPOINTS` 覆盖登记 / `models.js` key 改名与 mode 缩量（`wan-2-7-official` 移除 `image-to-video`、`bza-video-v3-1` 两款 `-base` 缩量，均为净删行不触碰 800 行棘轮）+ §5.6 四处默认 key 与 `MODEL_MANUFACTURERS` 同步 + `MODEL_ID_MIGRATIONS` 生成接入。**不做此步则第一批后 52/61 模型提交即 404**，"可立即验证"口径不成立，且用户感知是"大部分功能仍坏着"。完成后补一轮 §10.2 第 4-5 项回归（覆盖已映射模型的各 paramType 代表）作为第一批准出；
10. **模型库重建（独立任务）**：
    - **10a 拆分先行**：`models.js` → `models/` 目录（§5.6，纯搬迁、零行为变化）；
    - **10b** 填报附录 C 矩阵（含 mode 差异列）→ 冻结；
    - **10c** 生成 `modelIdMigrations.js` 并接入 `FavoritesContext` / `HistoryProvider.loadHomeState`（§5.6）；
    - **10d** 重建 `models/` / `modelEndpoints.js` / `pricing.js` / `modelMeta.js` / `homeReducer.js` / `payloadBuilder.js`；
    - **10e** 下架模型降级（§5.8）；
11. 发行构建启用密钥隔离（§4.3-v6：构建脚本 `EXPO_NO_DOTENV=1` + 密钥断言 + §10.2-12 产物验收）；同步 `AGENTS.md`（双主机职责、"更换 API 服务"表述）与 `.env.example` 注释；`reference/` 文档可选维护。

**分批（v6 调整）**：第 1-9b 步为**第一批**（端点 + 错误链路 + 已确认模型映射，交付后 ~18/61 模型可用且覆盖主力模型，可立即验证）；第 10 步为**第二批**（43 个待判定 key 处置 + 价格重建，工作量最大、单独排期与验收）。**若 9b 不执行**，第一批仅为"内部冒烟版"，不可对外发布，§10.2 回归范围须限定为 9 个同名直通模型 + 上传 + webapp 链路。

**排期参考（v6 调整）**：
- 第一批约 **1.5-2 天**（前置 §8 回填 + 步骤 1-9b，9b 约半天），跨境链路验证（弱网/超时/退避）另预留半天；
- 第二批拆 5 个里程碑：**M1 已定位 key 的 mode 差异核对**（9b 已覆盖 18 个直通/前缀/变体 key，本里程碑仅剩复核，≤0.5 天）→ **M2a 待判定 key 存在性核**（43 个 key 对照 `llms` 文档做 slug/mode 存在性比对，纯文档工作，1-1.5 天）→ **M2b 参数差异 + 抽样真实提交冒烟**（消耗国际版余额、依赖实名状态，1.5-2 天）→ **M3 矩阵冻结评审** → **M4 拆分 + 重建**（10a-10d，1.5-2 天）→ **M5 全量验收**（§5.7 逐 mode 方法）+ 下架降级（10e）。pricing 无价格源时按 §8-2 备选先隐藏价格展示；
- 排期依赖：M2a 仅需文档访问；M2b 依赖国际版 Key 与可用余额（端点已实测可用）；M4 的 10a 拆分可提前并行执行（不阻塞矩阵填报）。

---

## 10. 验证方案

### 10.1 静态冒烟（无需 API Key，**方法敏感版**）

```powershell
# 期望值：401 = 存在需鉴权；200 = 公开；404 = 仅用于"负例"（确认旧形态已失效）
$probes = @(
  @{ m='POST'; u='https://api.bizyair.ai/v1/modelzoo/tasks/openapi/probe-id'; want=401 },
  @{ m='GET';  u='https://api.bizyair.ai/v1/modelzoo/tasks/openapi/probe-id'; want=401 },
  @{ m='POST'; u='https://api.bizyair.ai/v1/webapp/task/openapi/create';      want=401 },
  @{ m='GET';  u='https://api.bizyair.ai/v1/webapp/task/openapi/probe-id';    want=401 },
  @{ m='GET';  u='https://api.bizyair.ai/v1/webapp/task/openapi/probe-id/outputs'; want=401 },
  @{ m='PUT';  u='https://api.bizyair.ai/v1/webapp/task/openapi/probe-id/cancel';  want=401 },
  @{ m='PUT';  u='https://api.bizyair.ai/v1/webapp/task/openapi/cancel?requestId=p'; want=404 },  # 负例：旧查询形态必须 404
  @{ m='GET';  u='https://api.bizyair.ai/v1/upload/token';                    want=401 },
  @{ m='GET';  u='https://api.bizyair.ai/v1/wallet';                          want=401 },
  @{ m='POST'; u='https://meta.bizyair.ai/v1/input_resource/commit';          want=401 },  # 必须 POST，GET 会 404
  @{ m='GET';  u='https://meta.bizyair.ai/v1/input_resource';                 want=401 },
  @{ m='GET';  u='https://meta.bizyair.ai/v1/user/info';                      want=401 },
  @{ m='GET';  u='https://meta.bizyair.ai/v1/webapp/56783/detail';            want=200 },  # 公开
  @{ m='GET';  u='https://meta.bizyair.ai/v1/dict';                           want=200 },  # 公开
  @{ m='GET';  u='https://meta.bizyair.ai/v1/bizy_models/community?current=1&page_size=1&keyword=&sort=Recently&model_types=Application'; want=200 },
  @{ m='GET';  u='https://meta.bizyair.ai/v1/webapp/38214/detail';                want=404 }   # 负例：应用不存在 → 404 + code 20230
)
foreach ($p in $probes) {
  $code = curl.exe -s -o NUL -w '%{http_code}' -X $p.m $p.u
  $flag = if ("$code" -eq "$($p.want)") { 'OK  ' } else { 'FAIL' }
  "$flag $code (want $($p.want))  $($p.m) $($p.u)"
}
```

> - 若返回 `000`：本地 DNS / 代理问题（国际版前置 Cloudflare，可能存在网络不可达）；
> - 若 `commit` 返回 404：检查是否误用 GET；
> - 附加静态检查：`npx eslint .`；
> - 追加两条固化已实测结论的回归探测（v6）：
>   - 带无效 Bearer：`curl.exe -s -X GET https://api.bizyair.ai/v1/wallet -H "Authorization: Bearer invalid"` → 401 且 body 为纯文本 `"Token is invalid"`（无 code，验证 §6.2 结论不漂移）；
>   - CORS 预检：`curl.exe -s -o NUL -w '%{http_code}' -X OPTIONS https://api.bizyair.ai/v1/wallet -H "Origin: http://localhost:8081" -H "Access-Control-Request-Method: GET"` → 204 且响应头 `Access-Control-Allow-Origin: *`。

### 10.2 功能回归（需要国际版 API Key）

> 范围说明（v6）：若 §9-9b 已执行，第 4-5 项覆盖 18 个已映射模型中的各 paramType 代表；若 9b 未执行，第 4-5 项仅限 9 个同名直通模型，其余跳过并在报告中注明。

1. 顶部头像与余额（`user/info` + `wallet`）——重点看字段与单位；
2. AI 应用广场：列表 + 关键词 + 基础模型筛选（`dict.base_models`）+ 分页（`bizy_models/community`）；
3. 粘贴社区 URL 导入应用（正则 + `webapp/{id}/detail`）——重点看**参数顺序**与**应用简介**是否正常（§3.4）；
4. 图片模型：提交 → `request_id` → 轮询 → 结果渲染 → 本地缓存；
5. 视频 / LLM / TTS 各跑一次；
6. 文件上传：Android 直传 OSS 与 Web 代理两条路径 → commit → 参数回填显示"已上传"（重点验证返回的是 commit `url` 且能被 `isBizyairFileUrl()` 识别）；
7. 取消（`Queuing`）与中断（`Running`）各一次，并验证错误路径（对已终态任务取消 → 应给出友好提示）；
8. **旧历史记录兼容**：旧国内版 URL 的结果仍可识别/展示；旧 running 记录在迁移后能正确落为失败或继续；**旧国内版结果 URL（`storage.bizyair.cn/outputs/`）可达性单独验证**——若已失效，历史页提示"原服务已停服，结果不可回放"（§8-9）；
9. **错误码链路**：用一张假 Key 触发 401，确认提示为"请到 www.bizyair.ai 重新签发"而非裸 JSON；**两条链路都要测**：①首页提交（`getUserMessage` 路径）；②保存/切换密钥（`ApiKeyContext` 路径，§3.6）；
9b. **下架模型重跑提示**（v5 新增）：构造一个 `MODELS` 中不存在的 `modelId` 历史记录，点击重跑 → 应提示"该模型已下线"，不恢复参数（§5.8）；
9c. **mode 缺口**（v5 新增）：逐 mode 切换一次（重点 `wan-2-7-official`、`bza-video-v3-1-*`），确认已移除/隐藏的 mode 不再出现在选择器（§5.7）；
9d. **输出 URL 有效性**（v5 新增）：在无鉴权环境直接打开 `object_url`（新开无痕窗口 / 换网络），确认可访问（§8-7）；
10. **跨境链路**：弱网/高延迟下观察超时与轮询退避（§6.4）；
11. **Web 端浏览器矩阵**（v4 新增）：Safari + Chrome 各跑一次上传与生成全流程——CORS 实测 `Allow-Headers: *`（老 Safari 可能不覆盖 `Authorization`）且响应带 `Allow-Credentials: true` + `*` 组合，需实测排除预检拦截；
12. **Release 构建密钥验收**（v6 新增）：解包 APK / 生产 bundle，全文搜索密钥字符串与 `EXPO_PUBLIC_BIZYAIR_API_KEY` 的值，命中数必须为 0（§4.3 机制的最终验收）；同时确认首启引导流程可用。

### 10.3 回滚 / 双环境并存（v5 重写）

**国内版已永久停服**（实测 `api.bizyair.cn/x/v1/*` 全部 `503 {"message":"Service permanent shutdown"}`，仅 `/y/v1/wallet` 存活），因此：

- ❌ **不存在"回滚到国内版"的生产路径**：改回端点也只能得到 503，"改回 `apiConfig.js` 即恢复"的旧假设已失效；
- ✅ 唯一有效的"回退"是**版本级回退**（保留迁移前的构建产物/tag 作为应急），但注意：即便回退到旧版本，其调用的国内版后端同样不可用——**迁移本身就是恢复服务**；
- ✅ 若需双环境并存/灰度（例如本地调试用缝合开关），让 `EXPO_PUBLIC_API_REGION=cn|intl` 覆盖**三件套**：
  1. 端点集合与 URL 模板（`apiConfig.js` + `webappApi.js` 分支）；
  2. 上传目录与 URL 特征（`UPLOAD_FILE_TYPE` + `OSS_INPUT_URL_PATTERNS`）；
  3. 模型库（`models/` / `modelEndpoints.js` / `pricing.js` / `modelMeta.js` 按区域拆分导出）；
  但 `cn` 分支在 2026-10-05 之后**没有可用后端**，仅作为本地测试用途，不应进入发行构建。

---

## 附录 A：端点探测验证记录（v3，含方法标注；四轮复验见附录 A2）

```
[2026-10-05 复测] 方法敏感：GET 打 POST-only 路由会得到 404（假阴性）

POST /v1/modelzoo/tasks/openapi/probe-id                    => 401  Token cannot be empty
POST /v1/modelzoo/tasks/openapi/{slug}/{mode}               => 401  （提交端点，双段路径）
GET  /v1/modelzoo/tasks/openapi/probe-id                    => 401  （查询端点，单段路径）
GET  /v1/modelzoo/tasks/openapi/{slug}/{mode}               => 404  ← 方法不匹配，非"路由不存在"
POST /v1/webapp/task/openapi/create                         => 401
GET  /v1/webapp/task/openapi/probe-id                       => 401
GET  /v1/webapp/task/openapi/probe-id/outputs               => 401
GET  /v1/webapp/task/openapi/probe-id/detail                => 404  ← 已无 /detail 段（改为路径参数）
PUT  /v1/webapp/task/openapi/probe-id/cancel                => 401
PUT  /v1/webapp/task/openapi/cancel?requestId=probe         => 404  ← 旧查询形态不被支持
GET  /v1/upload/token                                       => 401
GET  /v1/wallet                                             => 401
POST api  /v1/input_resource/commit                         => 404  ← 必须走 meta 主机
POST meta /v1/input_resource/commit                         => 401
GET  meta /v1/input_resource                                => 401
GET  meta /v1/user/info                                     => 401
GET  meta /v1/webapp/56783/detail                           => 200  {"code":20000,"data":{...}}
GET  meta /v1/webapp/38214/detail                           => 404  {"code":20230,"message":"Resource version not found."}
GET  meta /v1/bizy_models/community?current=1&page_size=2&keyword=&sort=Recently&model_types=Application
                                                            => 200  {"code":20000,"data":{"list":[...]}}
GET  meta /v1/bizy_models/community                         => 20015 invalid parameter: Current（必填参数）
GET  meta /v1/dict                                          => 200  data.keys = tags(82) / base_models(35) / notification_types / official_notification_types
GET  https://bizyair.ai/community/app/56783                 => 308 → www.bizyair.ai（v5 复核修正：非 301）

--- 认证 / 错误形态 ---
GET api /v1/wallet   （Authorization: Bearer <无效key>）     => 401  body: "Token is invalid"（纯文本，无 code）
官方 authentication 文档示例                                 => 401  {"code":"20052","message":"无效的API密钥"}（code 为字符串）

--- CORS 预检实测 ---
OPTIONS api /v1/wallet （Origin: http://localhost:8081）     => 204  Access-Control-Allow-Origin: *  Allow-Methods: GET,POST,DELETE,PUT,PATCH  Allow-Headers: *
GET     meta /v1/dict  （带 Origin）                         => 200  Access-Control-Allow-Origin: *
（对照）GET api.bizyair.cn/y/v1/wallet（带 Origin）          => 401  Access-Control-Allow-Origin: *（国内版同样放行）
```

## 附录 A2：四轮独立复验记录（2026-10-05，v5 新增）

```
[2026-10-05 四轮复验] 10 项端点探测与 §2 表全部吻合：
GET  api /v1/wallet                                        => 401
POST api /v1/modelzoo/tasks/openapi/probe-id               => 401
GET  api /v1/modelzoo/tasks/openapi/probe-id               => 401
PUT  api /v1/webapp/task/openapi/probe-id/cancel           => 401
PUT  api /v1/webapp/task/openapi/cancel?requestId=p        => 404（负例，旧查询形态）
POST meta /v1/input_resource/commit                        => 401
POST api  /v1/input_resource/commit                        => 404（必须 meta 主机）
GET  meta /v1/user/info                                    => 401
GET  meta /v1/webapp/56783/detail                          => 200
GET  meta /v1/dict                                         => 200

--- 国内版现状（v5 关键新发现）---
GET api.bizyair.cn/x/v1/dict                               => 503  {"message":"Service permanent shutdown"}
GET api.bizyair.cn/x/v1/user/metadata                      => 503
GET api.bizyair.cn/x/v1/webapp/56783                       => 503
GET api.bizyair.cn/x/v1/upload/token                       => 503
GET api.bizyair.cn/x/v1/modelzoo/tasks/openapi/probe-id    => 503
GET api.bizyair.cn/x/v1/bizy_models/community              => 503
GET api.bizyair.cn/y/v1/wallet                             => 401（该路径仍存活）

--- 其他复验 ---
GET  meta /v1/webapp/38214/detail                          => 404  {"code":20230,"message":"Resource version not found.","data":null}
GET  meta /v1/webapp/56783（无 /detail 段）                => 410
GET  meta /v1/bizy_models/community（无参数）              => 200  code=20015
GET  api /v1/wallet（Authorization: Bearer invalid）        => 401  body: "Token is invalid"
GET  https://www.bizyair.ai/llms/modelzoo/bizyair/qwen-image/text-to-image?lang=python        => 200
GET  https://www.bizyair.ai/llms/modelzoo/kling-o3-4k-channel/reference-to-video?lang=python  => 200
GET  https://bizyair.ai/community/app/56783                 => 308  → https://www.bizyair.ai/...
sitemap-model-api-1.xml                                     => 164 条 <loc>（与 §5 一致）
dict                                                        => data.keys: tags(82) / base_models(35) / notification_types / official_notification_types
detail input_nodes[0]                                       => id,node_id,node_name,node_type,field_name,field_type,field_options,field_label,field_value,variable_name
CORS OPTIONS api /v1/wallet                                 => 204  Allow-Origin: * / Allow-Credentials: true / Allow-Methods: GET,POST,DELETE,PUT,PATCH / Allow-Headers: *
mode 级抽查（sitemap）                                       => wan-2-7-official 无 image-to-video；google-veo-3-1-* 全族无 image-to-video；hailuo-2-3-channel 仅 image-to-video
```

## 附录 B：国际版模型清单与文档获取方式

| 用途 | 地址 |
|:---|:---|
| 全部模型 API 端点清单（sitemap） | `https://www.bizyair.ai/sitemap-model-api-1.xml`（实测 164 条） |
| 单个模型的机器可读接入文档 | `https://www.bizyair.ai/llms/modelzoo/{slug}/{mode}?lang=python` |
| API 手册（认证 / 调用 / 上传 / 错误码） | `https://docs.bizyair.ai/cn/api-guide/{authentication,api-quickstart,invoke-ai-apps,input-output,errors-retry,reference}.md` |
| 文档索引 | `https://docs.bizyair.ai/llms.txt` |

> 提示：`reference/bizyair.api.reference/bizyair_models_doc_urls.json` 中的国内版文档 URL 形如
> `https://bizyair.cn/llms/modelzoo/{slug}/{mode}`，可批量替换主机为 `https://www.bizyair.ai` 后用于校验 slug 是否存在。

## 附录 C：模型处置矩阵（v6.2 全量冻结稿，2026-10-06 第二批上半场调研产出）

> **本表即全量真相**：61 行 = `models.js` 全部顶层 key（按文件顺序），含第一批已实施 19 行。作为第三批代码重建（§9 步骤 10a-10d）的冻结依据。
>
> **验收分级（§5.7）**：**D** = `llms/modelzoo/{slug}/{mode}?lang=python` 返回 200 且参数表已比对；**S** = 真实提交成功（附 `request_id`）。复现命令：
> - D 级：`curl -s -o /dev/null -w "%{http_code}" "https://www.bizyair.ai/llms/modelzoo/{slug}/{mode}?lang=python"`
> - S 级：`curl -s -H "Authorization: Bearer $KEY" "https://api.bizyair.ai/v1/modelzoo/tasks/openapi/{request_id}"`
>
> **价格口径（2026-10-06 结案）**：国际版价格表 API `https://www.bizyair.ai/api/pricing/v1/modelzoo/price_table/{slug}/{mode}` **匿名可访问**（此前 401 的为其他路径）；`pricing_values` 整数值 = wallet 扣费单位（三重实测吻合：seedream-4-5=60/第一批扣 60、nano-banana-2-channel 1k=40/本批扣 40、vidu-turbo-channel 540P=50/本批扣 50）；官网价格页显示值 = 该整数 ÷1000。单位三分类：**call/image=按次、second=按秒、M Tokens=每百万 token（input/output 分列）**。全站 benefit 统一 RPD 60 / RPH 30 / RPM 6。价格列未标单位者默认按次。
>
> **处置口径**：`已实施`＝第一批 9b 已落地（端点覆盖/改名/缩量已进 src）；`直通`＝slug 同名；`变体映射`＝`-base`→`-channel` 或 `bizyair/` 前缀（§5.2/§5.3-C，高置信自主裁定）；`映射`＝功能等价（llms 参数表与现条目同源）；`缩量映射`＝映射但有 mode 需从 `models.js` 移除；`待裁决`＝低置信/下架/绑定不明，逐条汇总于 BLOCKED.md（本批不落码）。
>
> **mode 差异列说明**：仅列与项目 `models.js` 该 key `modes` 的差异（"缺 X"＝国际版无此 mode 需缩量；"另有 X"＝国际版多出可评估新增）；"无"＝完全一致。参数差异列空缺以"无"表示请求参数表与 payloadBuilder 现有映射同源；凡列出者均为重建 `payloadBuilder.js`/`models.js` 时的必改项（`!*`＝国际版必填）。

| # | 项目 key | 国内端点 | 国际版 slug/mode | 处置 | mode 差异 | 参数差异 | 国际价格 | 验收 | 备注 |
|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|
| 1 | `nano-banana-2-channel` | 同名（第一批改名） | `nano-banana-2-channel/{t2i,i2i}` | 已实施 | 无 | 无（resolution 枚举国际为小写 `1k/2k/4k`，models.js 现为大写，重建时改 UI 枚举） | t2i/i2i：1k=40 2k=50 4k=60（call） | **S**：request_id `fe71f130-f86f-4eec-bea3-e2ad68582d71`（1k 扣 40，输出 `storage.bizyair.ai/outputs/dc2f4973-….jpg`）；D：t2i/i2i llms 200 | 默认模型；本批 S 级 |
| 2 | `bza-image-b2-official` | `bza-image-b2-official/{mode}` | `nano-banana-2-official/{t2i,i2i}` | 变体映射 | 无 | 无（另多 `system_prompt` 可选；resolution 枚举含 `0.5k` 同小写） | 0.5k=40 1k=60 2k=80 4k=110（call） | D：`llms/.../nano-banana-2-official/text-to-image`→200；`…/image-to-image`→200 | |
| 3 | `bza-image-b-pro-base` | 同名 | `nano-banana-pro-channel/{t2i,i2i}` | 变体映射 | 无 | 文档仅 `prompt/aspect_ratio/resolution(/image_urls)`，较国内精简（seed/web_search 等勿发） | 1k=80 2k=80 4k=100（call） | D：t2i→200；i2i→200 | DEFAULT_FAVORITES 含旧 key，随映射迁移 |
| 4 | `bza-image-b-pro-official` | 同名 | `nano-banana-pro-official/{t2i,i2i}` | 变体映射 | 无 | 无（多 `system_prompt/web_search` 可选） | 1k=100 2k=120 4k=180（call） | D：t2i→200；i2i→200 | |
| 5 | `bza-image-o2-base` | 同名 | `gpt-image-2-channel/{t2i,i2i}` | 变体映射 | 无 | 无 | 1k/2k/4k 均 30（call） | D：t2i→200；i2i→200 | |
| 6 | `bza-image-o2-official` | 同名 | `gpt-image-2-official/{t2i,i2i}` | 变体映射 | 无 | **width/height/quality→`image_size`+`quality`**（宽高改枚举档，按 Quality×Pixels 计价） | quality×pixels：low=8~16 medium=70~130 high=275~500（call）；i2i 多图另收 50/image | D：t2i→200；i2i→200 | `width-height-quality` paramType 需重做 |
| 7 | `seedream-5-0-official` | 同名 | 候选：`seedream-5-0-pro-official` 或 `-lite-official` | **已冻结（重建落地）** | pro：i2i 裸路径不存在，需三段 `image-to-image/edit`；lite：t2i+i2i 全齐 | `size`→`image_size`（按 Pixels 分档） | pro t2i：≤2.61M px=80、>2.61M=160；edit 多图另收 3/image；lite：45/次 | D：pro t2i→200；pro `image-to-image/edit`→200；pro 裸 i2i→**404**；lite t2i/i2i→200 | 绑 pro（领导裁决）；t2i 直通、i2i 三段路径 edit 已登记 modelEndpoints，layer-decomposition 仅注释留档不暴露 UI |
| 8 | `seedream-4-0-official` | 同名 | —（sitemap 无同名，llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：`llms/.../seedream-4-0-official/text-to-image`→404；`…/image-to-image`→404 | 被 4-5/5-0 取代；已从 models 与相关引用删除 |
| 9 | `seedream-4-5-official` | 同名 | 同名直通 | 已实施 | 无 | `size`→`image_size`（按 Pixels 计价） | 60/次 | **S**（第一批）：request_id `755cf225-…`（扣 60）；D：t2i/i2i llms 200 | 第一批 S 级 |
| 10 | `flux-kontext-pro-base` | 同名 | —（llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：t2i→404；i2i→404 | sitemap 无任何 flux-kontext 端点；已删除 |
| 11 | `flux-kontext-max-base` | 同名 | —（llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：t2i→404；i2i→404 | 同上 |
| 12 | `bza-image-f-k-pro-base` | 同名 | —（llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：t2i→404；i2i→404 | 同上 |
| 13 | `bza-image-f-k-max-base` | 同名 | —（llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：t2i→404；i2i→404 | 同上 |
| 14 | `wan-2-7-image-official` | 同名 | 同名直通 | 已实施 | 无 | **`size`→`image_size`(!*)**；`thinking_mode`→`enable_thinking`；新增 `num_images`；`custom_width/height`、`enable_sequential`、`watermark`、`color_palette`、`bbox_list` 国际文档均无 | 48/image | D：t2i→200；i2i→200（第一批 D 级） | payloadBuilder `wan-size` case 需按此重写 |
| 15 | `wan-2-7-image-pro-official` | 同名 | 同名直通 | 已实施 | 无 | 同第 14 行 | 85/image | D：t2i→200；i2i→200（第一批） | |
| 16 | `z-image-turbo` | `z-image-turbo/text-to-image` | `bizyair/z-image-turbo/text-to-image` | 已实施（前缀） | 无 | **width/height→`image_size`**；`batch_size`/`steps` 国际文档无 | 5/次（call） | D：llms 200（第一批） | 现发 width/height 会参数失配 |
| 17 | `qwen-image` | 同名 | `bizyair/qwen-image/text-to-image` | 已实施（前缀） | 无 | **width/height→`image_size`**；`steps`!*；`guidance_scale`/`negative_prompt`/`seed` 同 | 20/次 | D：llms 200（第一批） | 同上 |
| 18 | `seedance-2-0-official` | 同名 | 同名直通 | 已实施 | 无 | ref mode：`image_urls/video_urls/audio_urls`→**`ref_images/ref_videos/ref_audios`**；flf `first_frame_url/last_frame_url` 同（string[]）；flf 的 prompt 为 Optional | 480P=160 720P=350 1080P=720 4K=1350（flf 4K=1700）／秒；ref 另有无参考视频差价（Input 表） | D：t2v/flf/ref→200×3（第一批） | 按秒计价，pricing 重建注意 unit=second |
| 19 | `seedance-2-0-fast-official` | 同名 | 同名直通 | 已实施 | 无 | 同第 18 行 ref 改名 | 480P=140 720P=280／秒；ref 无参考视频 140/280、有 85/185 | D：×3 200（第一批） | |
| 20 | `seedance-2-0-base` | 同名 | `seedance-2-0-channel/{t2v,flf,ref}` | 变体映射 | 无 | `ratio`→`aspect_ratio`（ratioField 改）；ref 三字段改名同第 18 行；国际分辨率枚举含 `native1080P/native4K` 与国内一致多 `2K/4K` | 480P=140 720P=300 1080P=350 native1080P=600 2K=375 4K=400 native4K=1250／秒；ref 差价见表 | D：t2v→200；flf→200；ref→200 | |
| 21 | `seedance-2-0-fast-base` | 同名 | `seedance-2-0-fast-channel/{t2v,flf,ref}` | 变体映射 | 无 | 同第 20 行 | 480P=140 720P=250 1080P=325 2K=350 4K=400／秒 | D：×3 200 | |
| 22 | `kling-o3-pro-base` | 同名 | `kling-o3-pro-channel/{t2v,flf}` | 变体映射 | 无 | flf：`first_frame_image/last_frame_image`→**`first_frame_url/last_frame_url`**（string[]）；文档无 `seed`（国内不发即兼容） | sound=false=130 true=150／秒 | D：t2v→200；flf→200 | |
| 23 | `kling-o3-std-base` | 同名 | `kling-o3-std-channel/{t2v,flf}` | 变体映射 | 无 | 同第 22 行 | false=130 true=150／秒（与 pro 同价） | D：×2 200 | |
| 24 | `kling-3-0-pro-base` | 同名 | `kling-3-0-pro-channel/{t2v,flf}` | 变体映射 | 无 | 同第 22 行 flf 改名；**`multi_shot`!*、`aspect_ratio`!*、`sound`!* 必填**；`flfUsesImageUrls`(image_urls) 国际不用、改 `first_frame_url`；文档无 `seed`（models.js supportsSeed 重建时移除） | false=150 true=210／秒 | D：×2 200 | |
| 25 | `kling-3-0-std-base` | 同名 | `kling-3-0-std-channel/{t2v,flf}` | 变体映射 | 无 | 同第 24 行 | false=110 true=150／秒 | D：×2 200 | |
| 26 | `kling-o3-4k` | `kling-o3-4k-base/ref-to-video`（覆盖） | `kling-o3-4k-channel/reference-to-video` | 已实施（变体） | 无 | `image_urls/video_urls`→`ref_images`；`keep_original_sound`/`multi_prompt` 国际文档无；`sound`/`aspect_ratio`/`shot_type`/`multi_shot` 可选同 | 663／秒（sound 无差价） | D：llms 200（第一批） | |
| 27 | `vidu-q3-pro-official` | 同名 | 同名直通 | 已实施 | 无 | i2v：**`image`→`images`(!*)**；flf：`first_frame_image`→`first_frame_url`(!*)；`audio`→`generate_audio`；新增 `audio_type`（i2v）；`is_rec` 同 | 540P=90 720P=160 1080P=180／秒 | D：×3 200（第一批） | |
| 28 | `vidu-q3-turbo-official` | 同名 | 同名直通 | 已实施 | 无 | 同第 27 行 | 540P=55 720P=85 1080P=100／秒 | D：×3 200（第一批） | |
| 29 | `vidu-q3-pro-base` | 同名 | `vidu-q3-pro-channel/{t2v,i2v,flf}` | 变体映射 | 无 | i2v：`image`→**`image_urls`(!*)**；flf：`first_frame_image`→`first_frame_url`(!*)；`audio`→`generate_audio`(!*)；`style`!*、`movement_amplitude`!*（flf）；`off_peak`/`is_rec`/`seed` 国际文档无；resolution 枚举小写 `540p/720p/1080p` | 540P=70 720P=140 1080P=160／秒 | D：×3 200 | |
| 30 | `vidu-q3-turbo-base` | 同名 | `vidu-q3-turbo-channel/{t2v,i2v,flf}` | 变体映射 | 无 | 同第 29 行；duration 1~16 | 540P=50 720P=80 1080P=90／秒 | **S**：request_id `261d032d-8932-454e-ba97-ed7fe0714eab`（540p×1s 扣 50，输出 `…/outputs/bf0d590d-….mp4`）；D：×3 200 | -channel 视频族本批 S 级代表 |
| 31 | `wan-2-7-official` | 同名 | 同名直通 | 已实施 | 缺 `image-to-video`（第一批已从 modes 移除）；**另有 `flf-to-video` 可评估新增** | `ratio`→`aspect_ratio`；`prompt_extend`→`prompt_optimizer`；`audio_url`→`audio_urls`（string[]）；vedit：**`video`→`video_urls`(!*)**；`watermark` 国际文档无 | 720P=125 1080P=215／秒（3 mode 同价） | D：t2v/ref/vedit→200×3（第一批） | |
| 32 | `wan-2-7-extend-official` | `wan-2-7-offcial/video-extend`（typo 覆盖） | —（国际 `wan-2-7-official` 无 video-extend，llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：`llms/.../wan-2-7-extend-official/video-extend`→404 | 已删除；modelEndpoints 的 offcial typo 覆盖一并删除 |
| 33 | `wan-2-5-official` | 同名 | —（llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：`…/wan-2-5-official/image-to-video`→404 | 已删除 |
| 34 | `wan-2-6-official` | 同名 | —（llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：`…/wan-2-6-official/image-to-video`→404 | 已删除 |
| 35 | `hailuo-2-3-base` | 同名 | `hailuo-2-3-channel/{i2v}` | 变体映射 | **缺 `text-to-video`**（llms 404，仅 i2v）→缩量 | i2v：`first_frame_image`→**`image_urls`(!*)**；`prompt_optimizer/fast_pretreatment/aigc_watermark` 国际文档无 | 768P/6s=350 768P/10s=700 1080P/6s=600（call） | D：t2v→**404**；i2v→200 | 最低档 350 > 本批剩余预算，未提交（非缺陷） |
| 36 | `hailuo-2-3-fast-base` | 同名 | `hailuo-2-3-fast-channel/{i2v}` | 变体映射 | **缺 `text-to-video`**→缩量 | 同第 35 行 | 768P/6s=240 768P/10s=400 1080P/6s=400（call） | D：t2v→**404**；i2i→200（i2v） | |
| 37 | `happyhorse-1-0-official` | 同名 | 同名直通 | 已实施 | 无（4 mode 齐；国际另有 `happy-horse-1-1-official` 新版可评估） | `ratio`→`aspect_ratio`；i2v：`first_frame`→**`first_frame_url`(!*)**；ref：`media`→**`ref_images`(!*)**；vedit：`media`→**`video_urls`(!*)**+`ref_images`；`audio_setting` 同 | 720P=180 1080P=280／秒（4 mode 同价） | D：×4 200（第一批） | |
| 38 | `ltx-2-3` | 同名 | —（llms 404，国际无 ltx 系） | **已冻结（重建落地）**：下架 | — | — | — | D：t2v→404；i2v→404 | 已删除 |
| 39 | `bza-video-x-official` | 同名 | `grok-imagine-official/{t2v,i2v,vedit}` | 变体映射 | 无（3 mode 齐；国际另有 `reference-to-video`/`video-extend` 可评估新增） | 无 | 80／秒（3 mode 同价） | D：×3 200 | |
| 40 | `bza-video-x-base` | 同名 | `grok-imagine-channel/{t2v,i2v}` | 变体映射 | 无 | 无（i2v `image_urls` 为 Optional、`aspect_ratio`!*） | 60／秒 | D：×2 200 | |
| 41 | `bza-video-v3-1-pro-base` | 同名 | `google-veo-3-1-pro-channel/{t2v,flf}` | 变体映射 | **缺 `image-to-video`**→缩量 | flf：`first_frame_image`→`first_frame_url`（`usesFlfUrlFields` 需为 true）；channel 系文档无 `generate_audio/seed/negative_prompt` | 720P=180 1080P=250 4K=300／秒 | D：i2v→**404**；t2v/flf→200 | |
| 42 | `bza-video-v3-1-fast-base` | 同名 | `google-veo-3-1-fast-channel/{t2v,flf}` | 变体映射 | **缺 `image-to-video`**→缩量 | 同第 41 行 | 720P/1080P/4K 均 300／秒 | D：i2v→**404**；t2v/flf→200 | |
| 43 | `bza-video-v3-1-official` | 同名 | `google-veo-3-1-official/{t2v,flf}` | 变体映射 | 无；国际另有 `reference-to-video` 可评估新增 | 无（`generate_audio/seed`、`usesFlfUrlFields` 均同） | 720P 170(false)/350(true)、1080P 同、4K 350/500／秒 | D：×2 200 | |
| 44 | `bza-video-v3-1-fast-official` | 同名 | `google-veo-3-1-fast-official/{t2v,flf}` | 变体映射 | 无；另有 `reference-to-video`/`video-extend` 可评估 | 无 | 720P 70/90、1080P 90/100、4K 215/250／秒 | D：×2 200 | |
| 45 | `bza-video-v3-1-lite-official` | 同名 | `google-veo-3-1-lite-official/{t2v}` | 变体映射 | **缺 `flf-to-video`**（llms 404）→缩量（modes 仅留 text-to-video） | 无 | 720P 25(false)/42(true)、1080P 42/70／秒 | D：flf→**404**；t2v→200 | |
| 46 | `bza-video-g-omni-flash-base` | 同名 | `gemini-omni-flash-preview-channel/{t2v,i2v}` | 变体映射 | 无；另有 `video-edit` 可评估新增 | 无（`duration` String 数字档 4/6/8/10） | 720P/1080P：4/6/8s=350、10s=420；4K：4s=500 6s=600 8s=700 10s=800（call） | D：×2 200 | |
| 47 | `dreamactor-2-0-base` | 同名 | `dreamactor-2-0-channel/reference-to-video` | 变体映射 | 无 | **`video_urls`→`ref_videos`(!*)、`image_urls`→`ref_images`(!*)**；无 prompt 参数（同国内） | 80／秒 | D：llms 200 | |
| 48 | `bza-chat-g3-1-pro-official` | 同名 | —（llms 404，国际 Gemini 无 pro 系） | **已冻结（重建落地）**：下架 | — | — | — | D：`…/bza-chat-g3-1-pro-official/large-language-models`→404 | 已删除 |
| 49 | `bza-chat-g3-1-flash-lite-official` | 同名 | 候选：`gemini-3-6-flash-official` 或 `gemini-3-7-flash-official`（`/large-language-models`） | **已冻结（重建落地）**：删旧 key，新增 `gemini-3-6-flash-official` 替换 | 无 | **`user_prompt`→`prompt`**；`enable_thinking/enable_search` 国际文档无；`system_prompt/temperature/max_tokens` 同 | 3-6：in=1500 out=7500；3-7：in=1650 out=8500（M Tokens） | D：gemini-3-5/3-6/3-7 三型号 llm 均 200 | 领导裁决 3 新替 4 旧；modelIdMigrations 迁移至 gemini-3-6-flash-official |
| 50 | `bza-chat-g3-flash-official` | 同名 | 候选：`gemini-3-5-flash-official/large-language-models` | **已冻结（重建落地）**：删旧 key，新增 `gemini-3-5-flash-official` 替换 | 无 | 同第 49 行 | 3-5：in=1500 out=9000（M Tokens） | D：llms 200；**S**：request_id `3ccb085c-…`（调研批）；**S**（重建批）：`76b3a35e-cb01-491a-9896-674dd77a56db`（新 key 提交 Success 扣 2） | modelIdMigrations 迁移至 gemini-3-5-flash-official |
| 51 | `bza-vision-g3-1-pro-official` | 同名 | —（llms 404） | **已冻结（重建落地）**：下架 | — | — | — | D：`…/bza-vision-g3-1-pro-official/vision`→404 | 已删除 |
| 52 | `bza-vision-g3-1-flash-lite-official` | 同名 | 候选：`gemini-3-6/3-7-flash-official/vision` | **已冻结（重建落地）**：删旧 key，新增 `gemini-3-6-flash-official` 替换 | 无 | **`user_prompt`→`prompt`**；`detail/enable_thinking` 国际文档无；`image_urls`!* 同 | 3-6：1500/7500；3-7：1650/8500（M Tokens） | D：gemini-3-5/3-6/3-7 vision 均 200 | modelIdMigrations 迁移至 gemini-3-6-flash-official |
| 53 | `bza-vision-g3-flash-official` | 同名 | 候选：`gemini-3-5-flash-official/vision` | **已冻结（重建落地）**：删旧 key，新增 `gemini-3-5-flash-official` 替换 | 无 | 同第 52 行 | 3-5：1500/9000（M Tokens） | D：llms 200 | modelIdMigrations 迁移至 gemini-3-5-flash-official |
| 54 | `joycaption3` | 同名 | `bizyair/joycaption3/vision` | 已实施（前缀） | 无 | **`image_input`→`image_urls`(!*)**；`caption_type`!*；`caption_length/extra_options` 同；国际无 `temperature/max_tokens/do_sample/name_input/custom_prompt` | 1/次（call） | D：llms 200（第一批） | |
| 55 | `qwen3tts-custom-voice` | 同名 | `bizyair/qwen3tts-custom-voice/text-to-speech` | 已实施（前缀+mode 覆盖） | 内部 mode `text-to-audio`→国际 `text-to-speech`（覆盖已生效） | 同源（`input/voice/response_format/instructions/language/speed/max_tokens`）；`voice`!*、`speed`!*；`response_format` 枚举国际少 `pcm` | 10/次（call） | D：llms 200（第一批）；**S**：request_id `f08096f9-6b33-46a3-9a4a-5e7db4840f31`（扣 10，输出 `…/outputs/63d3af99-….mp3`） | 本批 S 级 |
| 56 | `birefnet-background-remover` | 同名 | `bizyair/birefnet/image-to-image` | 映射（§5.3-D 实测存在） | 无 | **`image`（单值）→`image_urls`（string[]，!*）**；`outputmask`!* 同 | 2/次（call） | D：llms 200；**S**：request_id `c9c8f7fd-5926-4e9a-983d-e48e51d61e3a`（扣 2，输出 PNG） | 本批 S 级 |
| 57 | `ace-step` | 同名 | `bizyair/ace-step/text-to-audio` | 已实施（前缀） | 无 | `lyrics`!*、`tags`!*（国内可选→国际必填）、`duration`!*、`seed` 同 | 0（免费）／秒 | D：llms 200（第一批） | 免费模型 |
| 58 | `seedvr2-upscale-image` | 同名 | `bizyair/seedvr2-upscale-image/image-to-image` | 已实施（前缀） | 无 | **`image`（单值）→`image_urls`(!*)**；`resolution`!*（数值档同 720/1080/1440/2160）；新增 `seed` | 720=1 1080=2 1440=4 2160=8（call） | D：llms 200（第一批） | |
| 59 | `z-image-base` | 同名 | `bizyair/z-image/text-to-image` | 映射（§5.3-D 实测存在） | 无 | **width/height→`image_size`**；`steps`!*；`negative_prompt/seed/guidance_scale` 同；`batch_size` 无 | 8 = MP×steps/28（按像素×步数计价） | D：llms 200 | |
| 60 | `flux-klein-watermarker-remover` | `flux-klein-watermarker-remover/image-to-image` | `bizyair/flux-klein/image-to-image/watermarker-remover` | 已实施（三段路径） | 无 | **`image`（单值）→`image_urls`(!*)** | 10/次（call） | D：llms 200（第一批） | |
| 61 | `kontext-dev-lora` | 同名 | `bizyair/kontext-dev-lora/image-to-image` | 已实施（前缀） | 无 | **`images`→`image_urls`(!*)**；`prompt`!*；新增 `loras`（object[]）；`seed` 同 | 30/次（call） | D：llms 200（第一批） | |

**矩阵统计**：61 行＝已实施 19＋变体/前缀映射 19＋映射 2（行 56/59）＋缩量映射 5（行 35/36/41/42/45）＋待裁决 16（**已于第三批按领导裁决全部落定并标"已冻结（重建落地）"：下架 11、Gemini 3 新替 4、seedream-5-0 绑 pro；重建后 MODELS 收敛为 49 key**）。S 级证据 6 个（行 1/9/30/50/55/56）＋重建批新增 4 个 S 级（行 1/30/50 复现 + 行 55 复现，request_id 见 §8 第三批回填）；其余映射行全部 D 级（llms URL+HTTP 码）。
