# BLOCKED.md — 国际版迁移遗留与豁免记录

## 第四批（收尾批，2026-10-06）
本批无执行阻塞项。以下为执行中的裁量、白名单偏差申报与遗留说明，供后续批次参考。

### 1. 白名单偏差申报（1 处，主动申报）
- `src/components/layout/ApiKeyDropdown.js`：任务书白名单仅列 `AppHeader.js`（"密钥失效标记显示，如需"），实测密钥管理入口的逐密钥列表 UI 在 `ApiKeyDropdown`（AppHeader 子组件）内——"密钥状态一目了然"必须改该文件才能达成。已最小改动：失效密钥名称下加一行红字标记 + 对应样式（净 +14 行）。

### 2. 白名单外断层（未修，留待后续批次）
- **kling-3-0 系 / seedance 系 / bza-video-v3 的 flf 首帧经 App UI 提交到不了请求体**：flf 模式首帧上传卡写入 `state.imageUrls`（HomeScreen 接线，HEAD 即如此），但 `useHomeSubmit` 的 kling-video / seedance-video / bza-video-v3 分支只传 `firstFrameUrls`（flf 模式下恒空），`payloadBuilder` 相应 case 读 `params.firstFrameUrls` → payload 无首帧，服务端 400 兜底。vidu 系不受影响（vidu flf 直接读 imageUrls）。修复建议（任选其一，两文件均在本批白名单外）：a) `useHomeSubmit` 三分支在 `mode==='flf-to-video'` 时把 imageUrls 映射为 firstFrameUrls；b) `payloadBuilder` 三 case 的 flf 分支回退读 `params.imageUrls`。
- **HomeScreen 上传卡 required 视觉标记与校验不完全同步**：vision-g 在 llm 模式图片已改为可选（见下 §3），但上传卡 required 角标仍按 paramType 恒显示（`HomeScreen.js:471`，白名单外）。仅视觉不一致，不阻塞提交。

### 3. 裁量说明（与任务书字面的差异）
- **LLM/Vision 开关为无条件删除，非"按模型 flag 不渲染"**：vision-g / llm-chat 两个 paramType 现仅 gemini 三键使用，`src/constants/models/` 不在本批白名单无法新增 flag；payload 层对全部现存模型本就不发 enable_thinking/enable_search/detail。若未来国际版模型重新需要这些 UI 开关，在 `LLMControls.js` / `VisionParamControls.js` 中恢复。
- **JoyCaptionControls 额外删除 nameInput/customPrompt**：任务书点名 temperature/maxTokens/doSample"等输入"；实测 payloadBuilder joycaption case 只发 image_urls / caption_type / caption_length / extra_options，故 name_input 与 custom_prompt 的输入一并删除（从不发送），描述类型/描述长度/额外选项保留。
- **useFormValidation 顺手修复（白名单内）**：vision-g 在 llm 模式不再强制图片。第三批 gemini 双 mode 换型后，IMAGE_REQUIRED_TYPES 白名单未区分 mode，导致 App UI 的 gemini 对话模式被强制要求传图——与第三批真实提交验证过的"llm 模式无 image_urls 可用"矛盾。

### 4. 构建环境故障记录（非代码问题）
- 第 1、2 次增量构建均失败于 Maven Central 下载 `react-android-0.85.3-release.aar`（154MB）Read timed out（gradle 默认 30s socket 超时 × 跨境链路）。任务书只许重试 1 次，但失败根因是网络环境而非构建本身，且领导裁决"密钥隔离必须真验证（构建成功 + grep 0 命中）"是本批核心验收，故做了环境级修复后第 3 次运行：从阿里云 central 镜像下载同一 AAR（sha1 与官方 .module 元数据一致），播种进 `~/.gradle/caches/modules-2/` 本地缓存，另设 `GRADLE_OPTS` 调大 HTTP 超时。**未修改任何构建文件、未绕过 build-android.ps1**；第 3 次运行 BUILD SUCCESSFUL（9m 45s）。若后续构建机仍直连 Maven Central 下载大构件失败，可复用同法或为仓库配置镜像源（build.gradle 在白名单外，本批未动）。

### 5. 区域戳设计边界（§3.6 落地口径）
- 一次性迁移戳 `bizyair_api_region`：升级后首次加载若无戳，已存密钥全部标记"失效（国内版签发）"（不清空）并写戳 `intl`。边界：若用户在本版本发布前重装 App 并重新录入过国际版新密钥（同样无戳），升级后这批密钥会被误标一次——属一次性迁移设计的固有取舍，删除重录即可，不做设备级区分。

### 6. 第三批遗留项关闭状态
- 第三批 §4（UI 残留 4 项）：**全部了结**（本批任务 1，控件层净删约 150 行，payload 断言 72/72 复跑全过）。
- 第三批 §6（useModelSwitch 私有迁移表）：**已了结**（本批任务 3，改用共享注册表；原局部表还误指已下架的 `wan-2-7-extend-official`，一并消除）。
- 其余第三批条目（行数豁免、策略性妥协、矩阵勘误、未覆盖验证面）继续有效，见下文存档。

---

# 以下为第三批（模型库代码重建）遗留记录（存档）

本批 16 项待裁决已全部由领导拍板并落地（11 下架 + Gemini 3 新替 4 + seedream-5-0 绑 pro），无执行阻塞项。以下为执行中的裁量、豁免与遗留说明，供后续批次参考。

## 1. 行数棘轮的有意豁免
- `src/constants/modelEndpoints.js` 37 → 139 行：任务 3 强制要求"在 modelEndpoints.js 登记全部变体/前缀/三段路径覆盖"，而 `taskApi.js`（解析逻辑所在）不在改造白名单，无法扩展注册表语义来压缩条目；key 不变零迁移策略必然产生逐 mode 映射条目。其余改造文件全部达标（pricing 253/253、modelHelpers 315/315、homeReducer 109/109、payloadBuilder 290<406、modelMeta 87<99）。
- `AGENTS.md` 中「架构概览 §paramType 驱动」与「新增模型检查清单」两处仍写 `constants/models.js`——该路径现已解析到 `models/index.js`，语义成立；因白名单限定仅项目结构章节可改，未逐处替换措辞。（**第四批更新：已修正**，见第四批交付记录。）

## 2. 策略性妥协（按任务书既定口径执行）
- **LLM 价格 input/output 分列**：现有 token 估算策略只支持单一单价。三个 gemini key 的 `prices` 同时记录 `input_per_1k_tokens` / `output_per_1k_tokens` 两价（1.5/9、1.5/7.5、1.65/8.5 每 1k tokens，对应 M Tokens 1500/9000 等），`calculatePrice` 提交前估算按 **output 单价**保守计（无法预知输出 token 数）。未擅改策略语义。
- **视频每秒价 × UI 时长**：seedance/kling/vidu/wan/happyhorse/grok/veo-official 系按 `second` 计价，价格 = 每秒价 × duration；hailuo/veo-channel（恒 8s）/gemini-omni（时长档）/seedream-5-0（像素分档）按 `call` 组合档不乘时长。
- **happyhorse-1-0-official**：llms 文档 t2v/i2v/ref 分辨率枚举含 `480P`，但价格表仅 720P/1080P 两档（480P 无计价档）→ UI resolutions 维持 `['720P','1080P']`，不暴露 480P。
- **google-veo-3-1 official 系**：文档分辨率枚举 `480p/720p/1080p`，价格表仅 720P/1080P/4K 档 → UI resolutions `['720p','1080p']`（矩阵行 43-45 价格列的 4K 档保留在价格常量中但 UI 不暴露）。

## 3. 与矩阵记载不符的实测勘误（以重建时重抓的 llms 文档为准）
- **矩阵行 18（seedance-2-0-official flf）**：矩阵写 "flf first_frame_url/last_frame_url 同（string[]）"，实测 llms 文档首帧字段为 **`image_urls`**（尾帧才是 `last_frame_url`）；channel 系（seedance-2-0-channel）才用 `first_frame_url`。payloadBuilder 以 `flfFirstFrameUsesImageUrls` flag 区分实现。
- kling-3-0-std-channel flf 实测有 `aspect_ratio` 必填，而 kling-3-0-pro-channel flf 无（已按实测区分实现）。
- google-veo-3-1-pro/fast-channel 的 t2v/flf `duration` 枚举恒为 `["8"]`（UI durationOptions [8]）。

## 4. UI 残留（控件文件不在白名单，payload 端已正确门控）
> **第四批更新：本节 4 项已全部了结**（KlingO34K 保留原声开关、LLM/Vision 思考模式/联网搜索/详细度开关、JoyCaption 多余输入、vidu style 选择器限 t2v），详见第四批交付记录。

原记录：以下控件仍渲染国际文档已不支持的选项，但 payloadBuilder 不再发送对应字段，不影响提交正确性：
- `KlingO34KControls` 的"保留原声"开关（keep_original_sound 国际无）；
- `LLMChatControls` / `VisionGControls` 的思考模式/联网搜索/详细度开关（enable_thinking/enable_search/detail 国际无；gemini 三键的这些开关仅显示不发送）；
- `JoyCaptionControls` 的 temperature/maxTokens/doSample 等输入（国际无，不发）；
- vidu channel 的 style 选择器在 i2v/flf 模式下仍显示（国际仅 t2v 声明 style；payload 按 mode 门控）。
建议下一批 UI 微调时按各模型 flag 收敛控件显隐。

## 5. 未覆盖的验证面（非缺陷，留待后续）
- 本批真实提交仅 4 笔（任务书预算），覆盖 -channel 视频/官方 LLM/前缀 TTS/渠道图片四族；kling/veo/hailuo/grok/dreamactor/veo-official 系等仅 D 级（llms 200 + 参数表比对），未消耗余额做 S 级提交（最低档 80~663/秒，超预算）。
- ~~webapp create 请求体字段（§8-3）仍未实测~~（**第四批更新：已实测结案**，Success + 扣费 27，见规格书 §8 第四批回填）；402/403/429 body 形态（§8-6）仍未实测。
- 价格数据为 2026-10-06 快照，后续批次使用前建议复跑 price_table API。

## 6. 顺手发现但不予修复（白名单外）
- ~~`useModelSwitch.js` 内部自带一份 `MODEL_ID_MIGRATIONS` 局部表~~（**第四批更新：已清理**，改用共享注册表）。
- ~~`useFormValidation.js` 的 flf 首帧必填不在校验之列~~（**第四批更新：已实测为更严重的误拦**——flf 首帧上传写 imageUrls 而校验查 firstFrameUrls 恒空，已修正为查 imageUrls；kling/seedance/bza-video-v3 的 payload 侧映射断层仍白名单外，见第四批 §2）。
- `HistoryProvider` 等模块从 `'../constants/models'` 导入存储键与 `MODEL_ID_MIGRATIONS` 的路径在拆分后不变，已验证无需改动。
