# BizyAir App 优化修复计划

> 生成日期：2026-06-01
> 涉及问题：#1-6, #9-13, #15-18, #20-21, #24, #27, #33-34, #37-39
> 共计 24 项，按优先级分 P0 / P1 / P2 三级

---

## 优先级定义

| 级别 | 含义 | 标准 |
|:---|:---|:---|
| P0 | 必须立即修复 | 功能性 Bug、严重性能瓶颈、数据安全风险 |
| P1 | 近期修复 | 体验明显受损、代码可维护性差、UI 严重不一致 |
| P2 | 中期优化 | 体验细节、长期架构改进、非关键功能缺失 |

---

## P0 — 必须立即修复（7 项）

### #1 localStorage 在 Native 端不可用

- **类别**：操作体验 / 功能性 Bug
- **文件**：
  - `src/components/VisionParamControls.js`（L121-123）
  - `src/components/LLMControls.js`（L89-93）
- **问题**：使用 `localStorage` 保存自定义预设，在 Android/iOS 端不存在此对象，导致运行时崩溃
- **修复方案**：
  1. 替换为 `AsyncStorage`，与项目其他持久化逻辑保持一致
  2. 由于 `AsyncStorage` 是异步操作，需将 `localStorage.getItem/setItem` 改为 `AsyncStorage.getItem/setItem`，配合 `useEffect` 初始化加载
  3. 预设保存改为异步函数，加载时显示 loading 状态
- **预期效果**：修复自定义预设功能在 Native 端的崩溃问题
- **验证方式**：在 Android 设备上添加/删除自定义预设，确认无崩溃且预设持久化

---

### #16 HomeScreen 单字段变化触发全组件 re-render

- **类别**：性能
- **文件**：`src/screens/HomeScreen.js`
- **问题**：`useReducer` 管理 60+ 字段的单一状态对象，任何单字段变化（如输入一个字符）都触发整个 HomeScreen 及所有子组件 re-render
- **修复方案**：
  - **阶段一（本次）**：将 `state` 和 `stateDispatch` 直接传递给 `HomeParamControls`，子组件内部按需解构和 dispatch，消除 50+ 内联箭头函数（与 #18 合并实施）
  - **阶段二（后续）**：将 60+ 字段按功能分组为多个独立状态（`videoParams`、`llmParams`、`uploadState`），使用多个 `useReducer`
- **预期效果**：输入框打字流畅度显著提升
- **验证方式**：在提示词输入框快速打字，观察是否卡顿；React DevTools 查看 re-render 次数

---

### #17 HistoryContext 轮询更新导致全局 re-render

- **类别**：性能
- **文件**：`src/context/HistoryContext.js`（L476-491）
- **问题**：`history` 数组在每次轮询更新（每 3 秒）时都会变化，导致所有消费 `useHistoryContext()` 的组件 re-render，即使它们只用了 `homeState` 或 `totalCoinsSpent`
- **修复方案**：
  1. 将 `HistoryContext` 拆分为 3 个独立 Context：
     - `HistoryListContext`：`history`、`addToHistory`、`removeHistoryItems`、`updateHistoryItem`
     - `HomeStateContext`：`homeState`、`saveHomeState`
     - `PollingContext`：`startPolling`、`stopPolling`、`refreshRunningTasks`、`resumeRunningPolling`
  2. 消费者只订阅需要的 Context，避免无关更新
  3. 保持 `HistoryProvider` 作为组合 Provider，内部包裹 3 个子 Provider
- **预期效果**：轮询期间主页不再因历史记录更新而 re-render
- **验证方式**：在主页停留，观察轮询期间页面是否闪烁/重渲染

---

### #24 模型 ID 拼写不一致

- **类别**：功能完整性 / Bug
- **文件**：
  - `src/constants/models.js`（L392, L685）
  - `src/constants/modelMeta.js`（L43-44）
- **问题**：`offcial` 应为 `official`，modelMeta.js 中同时存在两种拼写，导致孤立条目
- **修复方案**：
  1. 确认后端 API 实际使用的 ID 拼写
  2. 统一 `models.js` 中的 ID 为正确拼写
  3. 清理 `modelMeta.js` 中的孤立条目
  4. 检查 `modelStatesRef` 缓存中是否有旧 ID 的残留数据，添加迁移逻辑
- **预期效果**：修复模型调用失败问题
- **验证方式**：使用 `wan-2-7-image-pro-official` 模型提交任务，确认 API 调用成功

---

### #33 HomeScreen.js 超过 800 行限制 + 上传卡片重复

- **类别**：代码质量
- **文件**：`src/screens/HomeScreen.js`（L530-752）
- **问题**：6 个上传卡片（参考图片、尾帧图片、上传视频、首帧图片、首段视频、参考图片）代码高度重复，导致文件超 800 行
- **修复方案**：
  1. 提取通用 `UploadCard` 组件（`src/components/UploadCard.js`）
  2. 组件接口：
     ```typescript
     UploadCard({
       label: string,
       urls: string[],
       onUpload: () => void,
       onRemove: (index: number) => void,
       isUploading: boolean,
       acceptTypes: string,  // 'image' | 'video'
       maxCount: number,
     })
     ```
  3. HomeScreen 中每个上传区域简化为一行调用
- **预期效果**：HomeScreen 代码量减少约 200 行，消除 6 处重复代码
- **验证方式**：ESLint 检查通过；上传功能正常（选择文件、显示缩略图、删除）

---

### #34 homeReducer 50+ 个重复 action type

- **类别**：代码质量
- **文件**：`src/screens/home/homeReducer.js`（L83-218）
- **问题**：50+ 个 action type 几乎全是 `{ ...state, [key]: action.value }`，大量样板代码
- **修复方案**：
  1. 添加通用 `SET_FIELD` action：
     ```javascript
     case 'SET_FIELD':
       return { ...state, [action.field]: action.value };
     ```
  2. 保留需要副作用的 action（`SET_PARAMS`、`RESET` 等）
  3. 其余简单赋值 action 全部替换为 `SET_FIELD`
  4. 更新所有 dispatch 调用处：
     ```javascript
     // 旧：stateDispatch({ type: 'SET_RESOLUTION', value: v })
     // 新：stateDispatch({ type: 'SET_FIELD', field: 'resolution', value: v })
     ```
- **预期效果**：reducer 代码量减少约 60%，新增参数只需修改 `initialState`
- **验证方式**：所有参数控件正常工作，模型切换状态保存/恢复正常

---

### #18 HomeParamControls 50+ 内联 setter 函数

- **类别**：性能（与 #16 合并实施）
- **文件**：
  - `src/screens/HomeScreen.js`（L297-416）
  - `src/components/HomeParamControls.js`
- **问题**：每次渲染创建 50+ 个内联箭头函数作为 setter props，子组件即使 `React.memo` 也无法跳过渲染
- **修复方案**：
  1. HomeScreen 传递 `state` + `stateDispatch` 整体给 HomeParamControls
  2. HomeParamControls 内部按 paramType 解构需要的字段，传递给子控件
  3. 子控件内部直接调用 `dispatch({ type: 'SET_FIELD', field: 'xxx', value })` （配合 #34 的 SET_FIELD）
  4. 为 HomeParamControls 和各子控件添加 `React.memo` + 自定义比较函数
- **预期效果**：减少 50+ 函数重复创建，配合 memo 实现精准渲染
- **验证方式**：React DevTools Profiler 对比优化前后的渲染次数

---

## P1 — 近期修复（10 项）

### #2 缺少 Toast/Snackbar 组件

- **类别**：操作体验
- **文件**：新建 `src/components/Toast.js`；修改 `app/_layout.js`
- **问题**：整个项目没有 Toast 组件，操作成功无即时反馈
- **修复方案**：
  1. 实现轻量级 Toast 组件（基于 `react-native` 的 `Animated` API）
  2. 在根布局添加 `ToastProvider`
  3. 以下场景接入 Toast：
     - API 密钥保存成功/失败
     - 任务提交成功
     - 复制提示词成功
     - 收藏模型保存成功
     - 主题切换
- **预期效果**：操作确认感大幅提升
- **验证方式**：执行上述操作，确认 Toast 显示且自动消失

---

### #3 AppHeader 保存密钥错误被静默吞掉

- **类别**：操作体验
- **文件**：`src/components/AppHeader.js`（L46-51）
- **问题**：`catch (e) {}` 完全吞掉错误，用户无法知道密钥保存失败
- **修复方案**：
  1. catch 中调用 Toast 显示错误信息
  2. 错误信息区分：网络错误 / 密钥无效 / 服务器错误
- **预期效果**：用户能感知密钥保存失败
- **验证方式**：输入无效密钥保存，确认显示错误 Toast

---

### #4 输入框不会根据内容自动增高

- **类别**：操作体验
- **文件**：`src/components/ResizableTextInput.js`
- **问题**：输入框高度需手动拖拽调整，不会根据内容自动增高
- **修复方案**：
  1. 在 `onChangeText` 中使用 `onContentSizeChange` 回调获取内容高度
  2. 当内容高度超出当前高度时，自动增高到 `maxHeight`
  3. 保留手动拖拽调整功能，作为用户微调手段
- **预期效果**：长文本输入无需手动拖拽
- **验证方式**：输入多行文字，确认输入框自动增高

---

### #5 Switch 交互方式不一致

- **类别**：操作体验
- **文件**：
  - `src/components/ParamControls.js`（L52-56）— Pressable 包裹
  - `src/components/VideoParamControls.js` — Pressable 包裹
  - `src/components/LLMControls.js`（L233-237）— 直接 onValueChange
  - `src/components/VisionParamControls.js` — 直接 onValueChange
- **问题**：部分 Switch 整行可点击，部分仅 Switch 本身可点击，触控区域不一致
- **修复方案**：统一为 Pressable 包裹方式，Switch 设置 `pointerEvents="none"`
- **预期效果**：交互一致性提升，触控区域统一
- **验证方式**：在各参数控件的 Switch 行任意位置点击，确认都能切换

---

### #6 键盘交互缺失

- **类别**：操作体验
- **文件**：`src/screens/HomeScreen.js`、`src/components/ResizableTextInput.js`
- **问题**：提示词输入后无键盘"提交"按钮，需手动点击生成按钮；Android 键盘可能遮挡输入区域
- **修复方案**：
  1. 提示词输入框设置 `returnKeyType="done"` + `blurOnSubmit={true}`
  2. 主页 ScrollView 包裹 `KeyboardAvoidingView`（Android: `behavior="height"`）
  3. 点击生成按钮时主动 `Keyboard.dismiss()`
- **预期效果**：输入效率提升，键盘不再遮挡内容
- **验证方式**：在 Android 设备上输入提示词，确认键盘不遮挡生成按钮

---

### #10 ParamLabel 组件重复定义 4 次

- **类别**：UI / 代码质量
- **文件**：
  - `src/components/VisionParamControls.js`（L9-16）
  - `src/components/ParamControls.js`（L9-16）
  - `src/components/VideoParamControls.js`（L8-15）
  - `src/components/TTSControls.js`（L11-18）
- **问题**：同一组件重复定义 4 次
- **修复方案**：
  1. 提取为 `src/components/ParamLabel.js` 公共组件
  2. 4 个文件改为 `import { ParamLabel } from './ParamLabel'`
- **预期效果**：消除 4 处重复代码，修改样式只需改一处
- **验证方式**：各参数控件标签显示正常

---

### #11 createStyles 重复定义 + 样式细微不一致

- **类别**：UI / 代码质量
- **文件**：ParamControls.js、VideoParamControls.js、VisionParamControls.js、LLMControls.js、TTSControls.js
- **问题**：
  - `card`、`label`、`selectorRow`、`selectorButton` 等样式在 5 个文件中重复定义
  - selectorButton fontSize：ParamControls 14 vs VideoParamControls 13
  - Switch trackColor.false：ParamControls `colors.bg` vs LLMControls `colors.disabled`
  - pressed opacity：0.7 vs 0.6（清空按钮）
- **修复方案**：
  1. 提取共享样式为 `src/constants/sharedStyles.js`
  2. 各控件文件的 `createStyles` 继承共享样式，仅覆盖差异部分
  3. 统一不一致项：
     - selectorButton fontSize → 14
     - Switch trackColor.false → `colors.disabled`
     - pressed opacity → 0.7
- **预期效果**：UI 一致性提升，样式维护成本降低
- **验证方式**：对比各控件页面的按钮、Switch、选择器样式

---

### #27 历史记录无"重新提交"功能

- **类别**：功能完整性
- **文件**：`src/screens/HistoryScreen.js`、`src/screens/HomeScreen.js`
- **问题**：查看历史任务详情后，无法一键使用相同参数重新提交
- **修复方案**：
  1. 在历史详情弹窗/预览中添加"重新提交"按钮
  2. 点击后将任务参数写入 `homeState`（通过 `saveHomeState`），切换到主页
  3. 主页检测到 `homeState` 变化后恢复参数到对应控件
  4. 需要处理参数格式转换（历史记录的 snake_case → state 的 camelCase）
- **预期效果**：用户可快速重试失败任务或复用成功参数
- **验证方式**：在历史记录中点击"重新提交"，确认主页参数正确恢复

---

### #38 空 catch 块

- **类别**：代码质量
- **文件**：
  - `src/components/VideoPlayer.js`（L154-170）— 4 处空 catch
  - `src/screens/WebappScreen.js`（L142）— persistSavedApps 空 catch
  - `src/components/AppHeader.js`（L48-49）— 保存密钥空 catch
- **问题**：关键操作的错误被静默吞掉，用户无法感知失败
- **修复方案**：
  1. VideoPlayer 的空 catch：保留（视频操作可能抛出已卸载错误，属于预期行为），添加 `// expected: component may be unmounted` 注释
  2. WebappScreen persistSavedApps：添加 `console.error` + Toast 提示
  3. AppHeader 保存密钥：添加 Toast 错误提示（与 #3 合并）
- **预期效果**：关键操作失败有用户提示，非关键操作有日志记录
- **验证方式**：模拟保存失败场景，确认用户收到提示

---

### #39 FavoritesContext 依赖优化

- **类别**：性能 / 代码质量
- **文件**：`src/context/FavoritesContext.js`（L48-58）
- **问题**：`addFavorite`/`removeFavorite` 依赖 `favorites`，每次收藏变化都重新创建函数，导致所有消费者 re-render
- **修复方案**：
  ```javascript
  // 改用函数式更新，消除对 favorites 的依赖
  const addFavorite = useCallback((modelId) => {
    setFavorites(prev => {
      if (!MODELS[modelId] || prev.includes(modelId)) return prev;
      return [...prev, modelId].slice(0, FAVORITES_MAX_COUNT);
    });
  }, []);

  const removeFavorite = useCallback((modelId) => {
    setFavorites(prev => prev.filter(id => id !== modelId));
  }, []);
  ```
- **预期效果**：`addFavorite`/`removeFavorite` 引用稳定，减少消费者 re-render
- **验证方式**：添加/移除收藏模型，确认功能正常且无多余渲染

---

## P2 — 中期优化（7 项）

### #9 样式细微不一致

- **类别**：UI
- **问题**：selectorButton fontSize、Switch trackColor.false、pressed opacity 等细微差异
- **修复方案**：与 #11 合并实施，在提取共享样式时统一
- **预期效果**：视觉完全一致

---

### #12 模型选择页面固定宽度

- **类别**：UI
- **文件**：`src/screens/ModelSelectScreen.js`（L309）
- **问题**：模型列表使用 `width: 300` 固定宽度，小屏设备挤压左侧分类栏
- **修复方案**：
  1. 改为 `flex: 1` 布局
  2. 使用 `useWindowDimensions` 做响应式适配
  3. 小屏设备（width < 360）时分类栏使用图标模式
- **预期效果**：各尺寸设备布局合理

---

### #13 错误提示方式不统一

- **类别**：UI / 操作体验
- **问题**：关键错误用红色 Text（易忽略），删除操作用 Alert，下载用 Alert，无统一规范
- **修复方案**：
  1. 关键错误（API 密钥无效、余额不足）→ Alert 弹窗
  2. 操作反馈（保存成功、复制成功）→ Toast（配合 #2）
  3. 非关键错误（网络超时）→ 页面内 Toast + 自动消失
  4. 删除确认 → 保持 Alert
- **预期效果**：错误提示层次分明，用户不遗漏关键信息

---

### #15 按钮样式体系化

- **类别**：UI
- **问题**：次要按钮的 padding、fontSize、borderRadius 存在差异
- **修复方案**：
  1. 在 `theme.js` 中定义 3 级按钮样式常量：
     - `buttonPrimary`：paddingVertical: 16, fontSize: 17, borderRadius: Radius.md
     - `buttonSecondary`：paddingVertical: 10, fontSize: 14, borderRadius: Radius.sm
     - `buttonGhost`：paddingVertical: 6, fontSize: 14, borderRadius: Radius.sm, 无背景
  2. 全局替换所有按钮样式
- **预期效果**：按钮视觉体系统一

---

### #20 轮询间隔固定，无渐进策略

- **类别**：性能
- **文件**：`src/context/HistoryContext.js`（L194）
- **问题**：固定 3 秒轮询，长时间运行的视频任务浪费资源
- **修复方案**：
  1. 引入渐进式轮询间隔：3s → 5s → 10s → 15s
  2. 每次 `MAX_POLL_FAILS` 内成功获取 Running 状态时，增加 2 秒间隔
  3. 任务状态变为非 Running 时，重置间隔
- **预期效果**：减少不必要的网络请求

---

### #21 resumeRunningPolling 并发启动

- **类别**：性能
- **文件**：`src/context/HistoryContext.js`（L298-315）
- **问题**：启动时对所有 Running 任务同时启动轮询，大量并发请求
- **修复方案**：
  1. 分批启动，每批最多 3 个任务
  2. 每批间隔 1 秒
  3. 或合并为单次批量查询请求（需后端支持）
- **预期效果**：启动时网络请求更平滑

---

### #37 硬编码模型前缀判断

- **类别**：代码质量
- **文件**：`src/screens/HomeScreen.js`（L492-521）
- **问题**：`modelId.startsWith('seedance')` 等硬编码模型前缀，新增模型需手动添加
- **修复方案**：
  1. 在 `models.js` 中为每个模型添加 `placeholder` 配置（按 mode 分组）
  2. 提取 `getModelPlaceholder(modelId, mode)` 工具函数
  3. HomeScreen 中调用工具函数替代硬编码判断
- **预期效果**：新增模型只需修改配置，无需改 HomeScreen 逻辑

---

## 实施计划

### 第一阶段：P0 修复（功能性 Bug + 性能瓶颈）

| 序号 | 问题编号 | 任务 | 涉及文件 | 前置依赖 |
|:---|:---|:---|:---|:---|
| 1.1 | #24 | 修复模型 ID 拼写错误 | models.js, modelMeta.js | 确认后端 ID |
| 1.2 | #1 | localStorage 替换为 AsyncStorage | VisionParamControls.js, LLMControls.js | 无 |
| 1.3 | #34 | homeReducer 添加 SET_FIELD 通用 action | homeReducer.js | 无 |
| 1.4 | #33 | 提取 UploadCard 通用组件 | 新建 UploadCard.js, HomeScreen.js | 无 |
| 1.5 | #18 | HomeParamControls 传递 state+dispatch | HomeScreen.js, HomeParamControls.js, 各子控件 | #34 |
| 1.6 | #16 | HomeScreen re-render 优化 | HomeScreen.js | #18, #34 |
| 1.7 | #17 | HistoryContext 拆分为 3 个子 Context | HistoryContext.js, 所有消费者 | 无 |

### 第二阶段：P1 修复（体验 + UI 一致性）

| 序号 | 问题编号 | 任务 | 涉及文件 | 前置依赖 |
|:---|:---|:---|:---|:---|
| 2.1 | #2 | 实现 Toast 组件 | 新建 Toast.js, _layout.js | 无 |
| 2.2 | #3 | AppHeader 保存密钥错误提示 | AppHeader.js | #2 |
| 2.3 | #38 | 空 catch 块修复 | VideoPlayer.js, WebappScreen.js, AppHeader.js | #2 |
| 2.4 | #10 | 提取 ParamLabel 公共组件 | 新建 ParamLabel.js, 4 个控件文件 | 无 |
| 2.5 | #11 | 提取共享样式 + 统一不一致项 | 新建 sharedStyles.js, 5 个控件文件 | #10 |
| 2.6 | #9 | 样式细微不一致修复 | 各控件文件 | #11 |
| 2.7 | #4 | 输入框自动增高 | ResizableTextInput.js | 无 |
| 2.8 | #5 | Switch 交互统一 | LLMControls.js, VisionParamControls.js | 无 |
| 2.9 | #6 | 键盘交互优化 | HomeScreen.js, ResizableTextInput.js | 无 |
| 2.10 | #27 | 历史记录"重新提交"功能 | HistoryScreen.js, HomeScreen.js | 无 |
| 2.11 | #39 | FavoritesContext 依赖优化 | FavoritesContext.js | 无 |

### 第三阶段：P2 优化（细节 + 长期改进）

| 序号 | 问题编号 | 任务 | 涉及文件 | 前置依赖 |
|:---|:---|:---|:---|:---|
| 3.1 | #12 | 模型选择页面响应式布局 | ModelSelectScreen.js | 无 |
| 3.2 | #13 | 错误提示方式统一 | 各页面 | #2 |
| 3.3 | #15 | 按钮样式体系化 | theme.js, 各页面 | #11 |
| 3.4 | #20 | 轮询渐进式间隔 | HistoryContext.js | 无 |
| 3.5 | #21 | resumeRunningPolling 分批启动 | HistoryContext.js | 无 |
| 3.6 | #37 | 硬编码模型前缀提取 | models.js, HomeScreen.js | 无 |

---

## 风险评估

| 风险 | 影响 | 缓解措施 |
|:---|:---|:---|
| #24 模型 ID 修改后旧缓存失效 | 已保存的 per-model 状态中包含旧 ID | 添加缓存迁移逻辑，旧 ID 映射到新 ID |
| #17 HistoryContext 拆分后接口变化 | 所有消费者需更新 import | 保持 `useHistoryContext()` 兼容层，逐步迁移 |
| #34 SET_FIELD 替换后 dispatch 调用处多 | 50+ 处 dispatch 需修改 | 全局搜索替换，配合 ESLint 检查 |
| #18 state+dispatch 传递后子控件需重构 | 5 个子控件需修改 props 接口 | 逐个控件迁移，保持旧接口兼容期 |
| #33 UploadCard 提取后上传逻辑变化 | 6 个上传区域需验证 | 逐个上传类型测试，确保功能不变 |

---

## 验证清单

每个阶段完成后需验证：

- [ ] ESLint 检查通过（0 errors）
- [ ] Web 端功能正常（模型选择、参数填写、文件上传、任务提交、历史查看）
- [ ] Android 端功能正常（同上 + OSS 直传）
- [ ] 模型切换后输入内容独立保存
- [ ] 亮/暗主题切换正常
- [ ] 无 console 报错
