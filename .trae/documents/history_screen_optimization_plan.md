# 历史记录页面优化计划

## 研究结论

通过分析 `HistoryScreen.js`，发现以下需要优化的点：

1. **功能按钮显示文字**：当前下载、复制、日志、删除按钮都显示图标+文字，需要改为仅显示图标
2. **失败状态缩略图**：当前失败时显示 ActivityIndicator 加载中，需要改为显示失败图标
3. **总金币统计逻辑**：当前使用 `history.reduce` 实时计算，删除记录后会减少，需要改为独立存储总金币数

## 修改文件清单

1. `src/screens/HistoryScreen.js` - 优化按钮样式、失败图标、总金币显示逻辑
2. `src/context/AppContext.js` - 添加总金币统计（可选，如果采用独立存储方案）
3. `src/constants/models.js` - 添加总金币存储键（可选）

## 详细实现步骤

### 1. 功能按钮优化（仅显示图标）

修改以下按钮样式，移除文字，仅保留图标：

- **下载按钮**：`downloadButton` - 使用 `download-outline` 图标，绿色背景
- **复制按钮**：`copyPromptButton` - 使用 `copy-outline`/`checkmark-circle` 图标，紫色背景
- **日志按钮**：`logButton` - 使用 `document-text-outline` 图标，蓝色背景
- **删除按钮**：`deleteButton` - 使用 `trash-outline` 图标，红色背景

样式调整：
- 按钮尺寸：32x32 或 36x36
- 图标大小：18px
- 圆角：Radius.full（圆形）
- 背景色保持现有的语义化颜色（successBg, purpleBg, primaryBg, errorBg）
- 移除 `flexDirection: 'row'` 和文字相关样式

### 2. 失败状态缩略图

修改 `historyThumbPlaceholder` 逻辑：

当前逻辑：
```javascript
{item.imageUrl ? (
  <Image source={{ uri: item.imageUrl }} style={styles.historyThumb} />
) : (
  <View style={styles.historyThumbPlaceholder}>
    <ActivityIndicator color={Colors.textTertiary} />
  </View>
)}
```

新逻辑：
```javascript
{item.imageUrl ? (
  <Image source={{ uri: item.imageUrl }} style={styles.historyThumb} />
) : item.status === 'Failed' ? (
  <View style={[styles.historyThumbPlaceholder, styles.historyThumbFailed]}>
    <Ionicons name="close-circle-outline" size={32} color={Colors.error} />
  </View>
) : (
  <View style={styles.historyThumbPlaceholder}>
    <ActivityIndicator color={Colors.textTertiary} />
  </View>
)}
```

新增样式 `historyThumbFailed`：
- 背景色：Colors.errorBg（可选，保持与失败状态一致）

### 3. 总金币统计优化

**方案选择**：

方案 A - 简单方案（推荐）：
- 总金币显示改为"累计消费"概念，实时计算所有历史记录（包括已删除的）
- 但这样无法准确反映

方案 B - 独立存储方案：
- 在 `AppContext.js` 中添加 `totalCoinsSpent` 状态
- 每次生成新任务时，累加金币数
- 删除记录不影响总金币数
- 使用 `AsyncStorage` 持久化存储

**采用方案 B 实现步骤**：

1. 在 `models.js` 中添加常量：
   ```javascript
   export const TOTAL_COINS_KEY = '@total_coins_spent';
   ```

2. 在 `AppContext.js` 中：
   - 添加 `totalCoinsSpent` 状态
   - 添加 `loadTotalCoins` 和 `saveTotalCoins` 方法
   - 添加 `addCoinsSpent` 方法，用于生成任务时累加
   - 在 `AppProvider` 的 `value` 中暴露这些方法

3. 在 `HomeScreen.js` 中：
   - 生成任务成功后，调用 `addCoinsSpent(price)`

4. 在 `HistoryScreen.js` 中：
   - 从 `useAppContext` 获取 `totalCoinsSpent`
   - 替换现有的 `history.reduce` 计算方式

### 4. 图标风格一致性

- 所有图标使用 `Ionicons` 组件
- 图标大小统一为 18px（按钮内）或 32px（失败状态）
- 颜色使用现有的语义化颜色常量
- 按钮背景色使用对应的 `*Bg` 颜色

## 样式参考

按钮统一样式：
```javascript
iconButton: {
  width: 36,
  height: 36,
  borderRadius: Radius.full,
  alignItems: 'center',
  justifyContent: 'center',
},
iconButtonSuccess: { backgroundColor: Colors.successBg },
iconButtonPurple: { backgroundColor: Colors.purpleBg },
iconButtonPrimary: { backgroundColor: Colors.primaryBg },
iconButtonError: { backgroundColor: Colors.errorBg },
```

## 风险与注意事项

- **兼容性**：确保在 Android 上正常工作
- **数据迁移**：如果采用方案 B，现有用户的历史金币数据需要处理（可从现有 history 计算初始值）
- **最小改动**：尽量保持现有代码结构，只修改必要的部分
- **代码规范**：单文件不超过 300 行
