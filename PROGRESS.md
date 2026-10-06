# PROGRESS — BizyAir 国际版迁移（第三批：模型库代码重建；第四批：收尾批）

> 第二批上半场（全量处置矩阵纯调研）已交付，记录固化于规格书 §8「2026-10-06 第二批上半场调研回填」与附录 C 61 行矩阵。本文件为第三批（代码重建）交付记录，第四批（收尾批）记录见文末「第四批（收尾批）」章节。

---

# 第四批（收尾批）——UI 显隐收敛 / 校验 / 密钥合规 / 文档收口

## 理解的目标 / 顺序 / 最大风险（2026-10-06 开工登记）
- 目标：UI 不再展示国际版不支持的选项（4 项显隐收敛）；flf 无首帧前置拦截；useModelSwitch 改用共享迁移表；存量密钥区域戳迁移（bizyair_api_region）；发行构建机制性隔离 .env 密钥；AGENTS.md 与代码现状一致；webapp create 实测结案 §8-3。
- 顺序：任务0 基线 → 1 UI 收敛 → 2 flf 校验 → 3 迁移表 → payload 断言复跑 → 4 区域戳 → 5 构建隔离+文档 → 6 webapp create → 7 增量构建+APK findstr → 8 收尾。
- 最大风险：①显隐门控不能新增模型 flag（models/ 不在白名单）——实测 vision-g/llm-chat 现仅 gemini 系使用，控件内无条件删除即达成意图；②useFormValidation 现有 flf 校验查 firstFrameUrls，但 UI 首帧上传实际写入 imageUrls（HomeScreen 接线），属存量误拦，须改为查 imageUrls（payload 侧 kling/seedance flf 读 firstFrameUrls 的断层在白名单外，记 BLOCKED）；③构建约 20-40 分钟且反向验证需跑两轮。
- 任务0 核对：冒烟 16/16 OK；eslint 0E/12W；wallet 起始 633；bizyair_api_region 于 src/scripts 零命中（doc 1 处为规格书 §3.6 自身表述，非实现）——基线成立。

---

---

# 以下为第三批交付记录（存档）

## 第三批「理解的目标 / 顺序 / 最大风险」（开工时登记）
- 目标：61 key → 49 key 全部可提交的正确配置；payloadBuilder 参数名与国际版文档一致；价格按国际价表（call/second/M Tokens 三类单位）。BLOCKED.md 16 项待裁决由领导拍板（11 下架 + Gemini 3 新替 4 + seedream-5-0 绑 pro），本批落地。
- 顺序：任务0 基线核对 → 1 models.js 拆分（纯搬迁先行）→ 2 下架/新增 → 3 映射落地 → 4 payloadBuilder → 5 pricing+homeReducer → 6 机器验证 → 7 真实提交 4 笔 → 8 收尾。
- 最大风险：①拆分与重建错误纠缠（靠拆分先行隔离）；②input/output 分列价格现有策略表达不了（按任务书：按 output 价计 + 注释 + BLOCKED.md）；③真实提交 Failed 烧预算；④具名导出漏迁崩溃（已 grep 全量清单逐一核对）。

## 任务0（2026-10-06）✅
- ① §10.1 冒烟：**16/16 OK**。
- ② eslint：**0 errors / 12 warnings**（与基线一致）。
- ③ wallet：`{"data":{"gift_balance":735}}` → **起始余额 735**（与任务书基线一致）。
- ④ models.js 具名导出清单（拆分时全部保留，拆分后已逐一断言）：
  - `export const MODELS`
  - re-export from `./pricing`（56 个名字）：O2_PRICE_TIERS, SEEDANCE_RATES, SEEDANCE_FAST_RATE, SEEDANCE_BASE_PRICES, SEEDANCE_FAST_BASE_PRICES, KLING_O3_PRO_RATES, KLING_PRO_RATES, KLING_STD_RATES, KLING_O3_4K_RATES, VIDU_Q3_PRO_PRICES, VIDU_Q3_PRO_BASE_T2V_PRICES, VIDU_Q3_PRO_BASE_I2V_PRICES, VIDU_Q3_TURBO_PRICES, VIDU_Q3_TURBO_BASE_PRICES, WAN_27_VIDEO_PRICES, WAN_27_EXTEND_PRICES, WAN_I2V_PRICES, HAILUO_23_PRICES, HAILUO_23_FAST_PRICES, HAPPYHORSE_PRICES, BZA_V3_PRO_PRICES, BZA_V3_FAST_PRICES, BZA_V3_LITE_OFFICIAL_PRICES, BZA_V3_OFFICIAL_PRICES, BZA_V3_FAST_OFFICIAL_PRICES, BZA_VIDEO_G_PRICES, Z_IMAGE_PRICES, Z_IMAGE_PIXEL_THRESHOLD, BZA_VIDEO_X_PRICES, BZA_VIDEO_X_BASE_RATE, LTX_PRICE, DREAMACTOR_PRICE, JOYCAPTION_PRICE, TTS_PRICE, BIREFNET_PRICE, ACE_STEP_PRICE, SEEDVR2_PRICES, FLUX_KLEIN_PRICE, KONTEXT_LORA_PRICE, QWEN_IMAGE_PRICE, calcByDuration, calcByResolutionDuration, calcByCombo, calcByResolution, calcO2Price, calcSeedancePrice, calcKlingPrice, calcKlingO3_4KPrice, calcBzaVideoXPrice, calcZImagePrice, calcViduQ3ProBasePrice, calcViduQ3ProOfficialPrice, calcViduQ3TurboOfficialPrice, calcFixedPrice, calcV3OfficialPrice, calcVideoGPrice
  - re-export from `./storageKeys`（8 个）：HISTORY_KEY, API_KEY_STORAGE_KEY, API_KEYS_STORAGE_KEY, ACTIVE_KEY_ID_KEY, ACTIVE_TAB_KEY, HOME_STATE_KEY, MODEL_STATES_KEY, TOTAL_COINS_KEY
  - re-export from `./uiConstants`（9 个）：VIDEO_RESOLUTIONS, VIDEO_RATIOS, SIZE_PRESETS, STATUS_LABELS, QUALITY_LABELS, TAB_HOME, TAB_WEBAPP, TAB_HISTORY, PAGE_SIZE
  - 引用方 11 个文件全部经 `../constants/models` 路径，拆分后解析到 models/index.js，接口不变

## 任务1（10a 拆分，纯搬迁）✅
- models.js（1080 行）→ src/constants/models/{image(18),video(30),llm-vision(7),audio(2),other(4)}.js + index.js 聚合（临时脚本机械拆分，逐 key 字符级比对零差异；仅 z-image-base 全局顺序按类别归组前移，类内顺序不变，ModelSelectScreen 按分类分组展示不受影响）。
- 修复拆分脚本引入的 other.js 末尾多余 `};`。
- 验证：eslint 0E/12W、expo export exit 0（bundle 2.4MB）、node 运行时断言 MODELS 61 key + 全部具名导出存在。

## 任务2+3（下架/新增 + 映射落地）✅
- 删 15 key：11 下架（seedream-4-0-official、flux-kontext-pro/max-base、bza-image-f-k-pro/max-base、wan-2-7-extend-official、wan-2-5/2-6-official、ltx-2-3、bza-chat-g3-1-pro-official、bza-vision-g3-1-pro-official）+ 4 旧 gemini（bza-chat-g3-flash、bza-chat-g3-1-flash-lite、bza-vision-g3-flash、bza-vision-g3-1-flash-lite）；modelEndpoints 的 wan-2-7-extend typo 覆盖一并删除。
- 新增 3 key：gemini-3-5/3-6/3-7-flash-official（双 mode，厂商 google，价格按 M Tokens in/out 分列）。
- modelEndpoints.js 登记全部变体/前缀/三段路径覆盖（含 seedream-5-0-pro 的 image-to-image/edit 三段路径与 layer-decomposition 注释留档）。
- modes 缩量：hailuo ×2 删 text-to-video、veo pro/fast-channel 删 image-to-video、veo lite 删 flf-to-video；"另有 X"一律未新增（含 wan-2-7 flf-to-video）。
- UI 显示名改国际版实名（Nano Banana 2 / GPT Image 2 / Kling O3 Pro / Veo 3.1 …）。
- MODEL_MANUFACTURERS 重建 49 条，与 MODELS 双向覆盖断言一致；modelIdMigrations.js 加 4 条 gemini 迁移。

## 任务4（payloadBuilder 重建）✅
- 全部 case 按矩阵"参数差异"列 + llms 实测文档重写：resolution-ratio（seed/web_search 按模型 flag 门控，channel 版不发）；width-height-quality（width/height/quality→image_size+quality）；size-only/wan-size（size→image_size "宽x高"）；width-height/qwen-image（width/height→image_size，steps 按 flag）；seedance（ref 三字段→ref_images/ref_videos/ref_audios；官方系 flf 首帧走 image_urls、channel 系 first_frame_url）；kling（flf 全改 first_frame_url，3-0 系 multi_shot/aspect_ratio/sound 必发，删 seed）；kling-o3-4k（ref_images，删 keep_original_sound/multi_prompt）；vidu（official i2v images / channel image_urls，flf first_frame_url，generate_audio 必发，删 off_peak）；wan-video（ratio→aspect_ratio、prompt_extend→prompt_optimizer、audio_url→audio_urls[]、vedit video→video_urls，删 watermark/driving_audio/reference_voice）；hailuo（first_frame_image→image_urls，删 prompt_optimizer 等）；happyhorse（first_frame→first_frame_url、media→ref_images/video_urls、reference_images→ref_images、删 watermark）；grok（official i2v 无 aspect_ratio）；veo（pro/fast-channel duration 恒 8、official 系删 negative_prompt）；dreamactor（→ref_images/ref_videos）；vision-g（user_prompt→prompt、删 detail/enable_thinking，承载 gemini 双 mode）；joycaption（image_input→image_urls，删 temperature/max_tokens 等）；tts（speed 必发）；birefnet/seedvr2/flux-klein/kontext-lora（image 单值→image_urls 数组，ace-step lyrics/tags/duration 必发）。
- 死 case 删除：flux-kontext、wan-i2v、ltx-video、llm-chat（gemini 改用 vision-g 承载双 mode——原因：白名单外 useHomeSubmit.buildParamsFromState 的 llm-chat 分支不含 imageUrls，vision 模式拿不到图片；vision-g 分支含 imageUrls 且 llm 模式下图片为空自然不发）。
- **矩阵行 18 勘误**：seedance-2-0-official flf 实测首帧字段为 `image_urls`（非矩阵所写 first_frame_url）、尾帧 `last_frame_url`；channel 系才用 first_frame_url。已按 llms 实测文档实现并记 BLOCKED.md。

## 任务5（pricing 重建 + homeReducer）✅
- pricing.js 全量替换为国际价表（2026-10-06 price_table API 快照，95 份）：图片 call 档（nano/gpt/seedream/wan-image/z-image/qwen-image）、视频 second 每秒档（seedance/kling/vidu/wan/happyhorse/grok/veo-official 系/dreamactor）、call 组合档（hailuo、veo-channel 恒 8s、gemini-omni 时长档、seedream-5-0 像素分档）；废弃常量（SEEDANCE_RATES、Z_IMAGE_PRICES、LTX_PRICE、WAN_I2V_PRICES 等）保留定义供 re-export 兼容。
- LLM input/output 分列：prices 同时记录两价，calculatePrice 估算按 output 单价（保守），已注释并记 BLOCKED.md。
- homeReducer initialState.resolution '2K'→'2k'（默认模型小写枚举）。

## 任务6（机器验证）✅
- ① node 断言（verify-models.mjs）：**ALL PASS** —— MODELS 恰好 49 key；15 个下架/旧 key 全部不存在；3 个 gemini 双 mode；MODEL_ID_MIGRATIONS 全部 target 存在；getModelInfo 兜底可用；MODEL_MANUFACTURERS 双向覆盖一致。
- ② node 断言（verify-payload.mjs）：**12/12 PASS** —— qwen-image（image_size/steps）、nano-banana-2-channel（小写 resolution、不发 web_search）、gpt-image-2-official（image_size+quality）、vidu official i2v（images）/channel t2v（style+generate_audio）、kling-3-0 flf（first_frame_url/multi_shot/sound）/t2v（aspect_ratio 必发无 seed）、seedance channel ref（ref_images/ref_videos）/flf（first_frame_url）、gemini llm（prompt/system_prompt/max_tokens，不含 user_prompt/enable_thinking/detail）/vision（image_urls）、hailuo i2v（image_urls）；旧名 width/height/size/user_prompt/first_frame_image 全部零出现。
- ③ eslint **0E/12W** + expo export **exit 0**。
- ④ §10.1 冒烟 16/16 OK（任务 0 与终验各跑一轮）。
- 行数棘轮：pricing 253=253、modelHelpers 315=315、homeReducer 109=109、payloadBuilder 290<406、modelMeta 87<99、models/ 各文件 ≤490 全部 ≤800。**modelEndpoints.js 37→139 为有意豁免**（任务 3 强制要求的映射登记唯一载体，taskApi.js 不在白名单无法扩展解析逻辑，见 BLOCKED.md）。

## 任务1（UI 显隐收敛，4 项）✅
- KlingO34KControls 删"保留原始声音"开关（keep_original_sound 国际无、payload 已不发）；HomeParamControls 同步删该 props 传递。
- LLMChatControls 删思考模式/联网搜索开关；VisionGControls 删细节程度/思考模式卡片。实现方式为控件内无条件删除而非模型 flag 门控：vision-g/llm-chat 两个 paramType 现仅剩 gemini 三键使用（models/ 不在本批白名单，无法加新 flag；payload 层对全部现存模型均不发这些字段），无条件删除即达成"国际版不支持的选项不渲染"。
- JoyCaptionControls 删 temperature/maxTokens/doSample/nameInput/customPrompt 五个 payload 不发送的输入（保留发送中的 captionType/captionLength/extraOptions）。
- vidu style 选择器加 `mode === 'text-to-video'` 条件（hasStyle 门控，与 payload 同规则）；isBase 判断不受影响（movement_amplitude 仍标记 base 系）。
- 行数全部净删：VideoParamControls -8、HomeParamControls -33、LLMControls -26、VisionParamControls -85。

## 任务2（flf 首帧前置校验）✅
- **实测发现存量误拦 bug**：flf 模式首帧上传卡写入 `state.imageUrls`（HomeScreen 接线），而 useFormValidation 原校验查 `state.firstFrameUrls`（flf 模式下恒空）→ 所有 flf 提交（含已上传首帧的）被"请上传首帧图片"误拦。已改为查 `imageUrls`（vidu flf 的 payload 亦直接读 imageUrls），错误信息挂到 imageUrls 上与上传卡内联显示一致。
- **白名单外断层记 BLOCKED**：kling-3-0 系/seedance 系/bza-video-v3 的 flf payload 读 `params.firstFrameUrls`，而 useHomeSubmit 相应分支未把 flf 模式的 imageUrls 映射过去 → 这三族经 App UI 提交 flf 时首帧到不了请求体（服务端 400 兜底）。payloadBuilder/useHomeSubmit 不在本批白名单，未动。

## 任务3（私有迁移表清理）✅
- useModelSwitch.js 删除局部 MODEL_ID_MIGRATIONS（其 `wan-2-7-offcial → wan-2-7-extend-official` 还误指下架型号），改 import `src/constants/modelIdMigrations.js` 共享注册表（与 FavoritesContext/HistoryProvider 同源）。

## 任务4（存量密钥区域戳，§3.6）✅
- ApiKeyContext：加载已存密钥时查 AsyncStorage 键 `bizyair_api_region`，非 'intl' 则批量标记 `{invalid:true, invalidReason:'国内版签发'}`（不清空，用户可手动删除）并写戳 'intl'；键名常量本地定义（storageKeys.js 不在白名单，且该键仅迁移逻辑读写）。
- ApiKeyDropdown：失效密钥在名称下方显示红字"失效（国内版签发）· 请到 www.bizyair.ai 重新签发"。
- **白名单偏差（主动申报）**：任务书写"AppHeader.js（密钥失效标记显示，如需）"，实测密钥管理入口的列表 UI 在 `ApiKeyDropdown.js`（AppHeader 子组件），逐密钥标记必须改该文件才能达成"密钥状态一目了然"；已最小改动（+14 行），在此申报。
- 新签发密钥不受影响（迁移只在无戳时执行一次；addApiKey 新对象无 invalid 字段）。

## 任务5（发行密钥隔离，§4.3）✅
- build-android.ps1 新增 [1.5/8]（架构校验后、版本递增与 prebuild 前）：断言 `EXPO_PUBLIC_BIZYAIR_API_KEY` 环境变量非空即 exit 1，随后设 `EXPO_NO_DOTENV=1`（禁用 Expo CLI/Metro 的 .env 自动加载，prebuild 与 gradle 打包两阶段均生效）。放在版本递增前是为中止运行不产生版本噪声。
- .env.example 补国际版域名（www.bizyair.ai + api/meta 双主机）、"密钥须重新签发、仅本地调试、发行构建强制隔离"注释。
- AGENTS.md：apiConfig 注释补"api/meta 双主机"、§paramType 驱动与新增模型检查清单的 models.js 路径改为 models/ 拆分目录（聚合入口 index.js）。

## 任务6（webapp create 实测，§8-3 结案）✅
- 经 `src/services/webappApi.js` 真实链路（submitWebappTask → queryWebappTaskDetail 轮询 → queryWebappTaskOutputs）：
  - 应用：Z-Image-Turbo Text-to-Image（web_app_id=56911，input_nodes 仅 text/width/height/batch_size 四节点）。
  - `create` 请求体 `{web_app_id, suppress_preview_output:false, input_values:{text,width,height,batch_size}}` → 977ms 返回 request_id `80e123b4-0a74-4aae-b79f-446f23e67e59`。
  - 状态流：Preparing（~4min 冷启动）→ Running → **Success**（总 ~12min，inference 710s）。
  - outputs：`[{object_url, output_ext:'.png', cost_time, error_type:'NOT_ERROR'}]`；object_url **无鉴权 GET 200** ✓。
  - 记账：wallet 633 → **606**，扣 **27** ≤ 50 上限 ✓。
- **实测新知**：①`webapp/{id}/detail` 与 create 的 web_app_id 用 **version id**（community 列表 `versions[0].id`，detail data.id 同值）；列表顶层 `id` 是 bizy_model_id，打 detail 端点 404。②Running/Preparing 期间 detail 仅返回状态与时间戳，outputs 仅 `{request_id,status}`；终态后 detail 含 `cost_times`、outputs 含 outputs 数组。③全链路字段的与文档一致（§8-3 风险解除）。

## 任务1-3 门禁复验 ✅
- payload 行为断言（自建 node 脚本，72 断言）：**72/72 PASS**——覆盖 gemini llm 不发 enable_thinking/detail、gemini vision image_urls、vidu official i2v images、vidu channel t2v style、vidu flf 首帧读 imageUrls、kling-3-0 flf 三必填（first_frame_url/multi_shot/sound）、kling t2v aspect_ratio、seedance official/channel flf 首帧字段分野、seedance ref、nano/gpt/qwen 图片系、hailuo i2v、旧参数名（width/height/size/user_prompt/first_frame_image/keep_original_sound/off_peak）五模型场景零出现。
- eslint 全量 **0 errors / 12 warnings**（与基线持平）；`expo export --platform web` **exit 0**。

## 任务7（增量构建 + 产物验收）✅
- **反向验证**：设 `$env:EXPO_PUBLIC_BIZYAIR_API_KEY='dummy'` 运行构建脚本 → 在 **[1.5/8] Release key isolation** 中止（exit 1），输出 "ERROR: EXPO_PUBLIC_BIZYAIR_API_KEY is set in this shell environment!"；中止点位于版本递增与 prebuild 之前，无版本噪声。清掉变量后重新构建。
- **构建过程**：第 1、2 次运行均失败于同一环境级原因——Maven Central 下载 `react-android-0.85.3-release.aar`（154MB）**Read timed out**（gradle 默认 socket 超时扛不住跨境大文件下载，非代码问题）。处置：从阿里云 central 镜像 curl 下载同一 AAR（6 秒完成），**sha1 校验与 .module 元数据一致**（`94af7601…93a4`）后播种进 `~/.gradle/caches/modules-2/` 本地缓存，并设 `GRADLE_OPTS` 调大下载超时；第 3 次运行 **BUILD SUCCESSFUL in 9m 45s**（609 tasks），未改任何构建文件、未绕过 build-android.ps1。
- **产物**：`bizyair-assistant-v1.1.16-release.apk`（36.9MB，arm64-v8a only OK），已复制到 apk/。
- **密钥隔离验收（三重）**：
  1. 任务书指定命令 `findstr /m /c:"sk-lr***"` 对 APK 直搜 → **0 命中**（exit 1）；
  2. 解包验证（§10.2-12 精神）：`assets/index.android.bundle`（Hermes 4.17MB）与 `classes.dex` 内搜 `sk-lr***` → **0 命中**；`EXPO_PUBLIC_BIZYAIR_API_KEY` 标识符亦 0 命中（metro 连变量名一并内联消除）；
  3. 阳性对照：同一 bundle 内 `bizyair_api_region`（本批新增代码字符串）与 `meta.bizyair.ai` 均可命中 → 证明搜索方法有效且 bundle 为本次构建的新产物，0 命中是真隔离而非搜不到。
- 版本提交：1.1.13 → 1.1.14（第1次失败构建）→ 1.1.15（第2次）→ **1.1.16**（成功），均为脚本自动 git commit。

## 任务8（收尾）✅
- 规格书 §8-3 结案回填 + 「第四批收尾实测回填」块；AGENTS.md 三处表述修正（双主机/paramType 驱动/检查清单路径）。
- PROGRESS.md / BLOCKED.md 定稿（BLOCKED.md 增补第四批：白名单偏差申报、白名单外断层、裁量说明、区域戳边界、构建网络故障记录；第三批记录存档并标注 §4/§6/AGENTS.md 三项已了结）。
- **终验（全部与基线持平或更好）**：eslint **0 errors / 12 warnings**；`expo export --platform web` **exit 0**；§10.1 冒烟 **16/16**；`grep -ri "sk-lr***" src scripts doc` **0 命中**；git status 本批改动全部在白名单内（ApiKeyDropdown 偏差已申报，前三批存量未提交改动未触碰）。

## 第四批花费台账
- wallet 起始 **633** → 结束 **606**，仅 webapp create 一笔扣 **27** ≤ 50 上限 ✓（模型提交 0 次）。

## 任务7（第三批·真实提交回归）✅
- 起始余额 **735**（提交前 wallet 实查）→ 结束 **633**，扣费 **102 / 110** ✓，提交 **4 / 4** 次 ✓，全部 Success：
  | # | key [mode] → 端点 | payload 要点 | request_id | 结果 |
  |:--|:--|:--|:--|:--|
  | 1 | nano-banana-2-channel [t2i] → 同名 | `{prompt, resolution:'1k'}` | `43a236a0-1874-4bdb-b983-4ae81e0a9518` | Success，jpg 无鉴权 GET **200**，扣 40 |
  | 2 | qwen3tts-custom-voice [text-to-audio] → bizyair/…/text-to-speech | `{input, voice, response_format, language, speed}` | `043edf3e-0ad4-4a59-88d0-5b92144b704c` | Success，mp3 **200**，扣 10 |
  | 3 | vidu-q3-turbo-base [t2v] → vidu-q3-turbo-channel/t2v | `{prompt, resolution:'540p', duration:1, aspect_ratio, generate_audio, style}` | `d8d65b54-031e-47f6-a4f6-31f02926ed3c` | Success，mp4 **200**，扣 50 |
  | 4 | gemini-3-5-flash-official [llm] | `{prompt, temperature, max_tokens}` | `76b3a35e-cb01-491a-9896-674dd77a56db` | Success（文本 "Hello, how can I help you today?"），扣 2 |
- 扣费与价格表精确吻合（40+10+50+2=102）；payload 全部由重建后 buildPayload 生成、端点经 MODEL_ENDPOINTS 解析，与 App 运行时同构。

## 任务8（收尾）✅
- 附录 C 16 行"待裁决"已按领导裁决改为最终处置并标"已冻结（重建落地）"；§8 追加本批实测回填；AGENTS.md 项目结构章节同步 models/ 目录。
- 密钥 grep：`sk-lr***` 于 src/scripts/doc 零命中；git status 改动全部在白名单内（详见 BLOCKED.md 豁免记录）。

## 花费台账（最终）
- 起始 735 → 结束 **633**；提交 **4/4** 次、扣费 **102/110** ✓
