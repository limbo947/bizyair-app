# BizyAir APK 构建参考文档

> **项目**: BizyAir Assistant | **框架**: Expo SDK 54 + React Native 0.81.5  
> **目标平台**: Android arm64-v8a | **包名**: com.bizyair.assistant  
> **最后更新**: 2026-05-31 | **构建结果**: ✅ 成功 (v1.0.28, versionCode=28)

---

## 目录

- [一、构建环境要求](#一构建环境要求)
- [二、构建配置架构](#二构建配置架构)
- [三、完整构建流程](#三完整构建流程)
- [四、签名密钥管理](#四签名密钥管理)
- [五、版本号管理](#五版本号管理)
- [六、问题排查指南](#六问题排查指南)
- [七、产物验证清单](#七产物验证清单)
- [八、最佳实践与注意事项](#八最佳实践与注意事项)
- [九、快速参考卡片](#九快速参考卡片)

---

## 一、构建环境要求

### 1.1 必备软件

| 软件 | 最低版本 | 验证版本 | 说明 |
|------|---------|---------|------|
| JDK | 17+ | Eclipse Temurin 17.0.19 | Expo 54 + Gradle 8.14.3 要求 |
| Android SDK | — | `%LOCALAPPDATA%\Android\Sdk` | 含 build-tools 36.0.0+ |
| Node.js | 18+ | — | Expo CLI 运行环境 |
| Gradle | 8.14.3 | 8.14.3 (wrapper) | 项目自带 |

### 1.2 Android SDK 组件

```powershell
build-tools;36.0.0
platforms;android-36
ndk;27.1.12297006
cmake;3.31.5        # ≥3.22.1，推荐 3.31.5（修复 NDK 工具链检测缺陷）
```

### 1.3 环境变量

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME    = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\"
```

### 1.4 验证环境

```powershell
java -version
echo $env:ANDROID_HOME
echo $env:JAVA_HOME
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" --list | Select-String "build-tools|cmake|ndk"
```

---

## 二、构建配置架构

### 2.1 配置层次

```
app.json (expo-build-properties 插件)     ← 唯一真实来源
    │
    ├── expo prebuild ──► android/ 目录生成
    │
    ├── build-android.ps1
    │       ├── 检查 PowerShell 7+（PS 5.1 直接报错退出）
    │       ├── [1/8] 验证架构配置
    │       ├── [2/8] 自动递增版本号 + git 提交
    │       ├── [3/8] 备份签名密钥到 keystore-backup/
    │       ├── [4/8] Clean（可选，停止 daemon 后删除 android/）
    │       ├── [5/8] expo prebuild --clean
    │       ├── [5.5/8] 从 keystore-backup/ 恢复签名密钥
    │       ├── [6/8] scripts/patch-android-build.ps1
    │       ├── [7/8] 同步 versionCode 到 gradle.properties
    │       └── [8/8] gradlew assembleRelease
    │
    └── scripts/patch-android-build.ps1
            ├── ProGuard 规则
            ├── gradle.properties 清理
            ├── AndroidManifest.xml (allowBackup=false)
            └── build.gradle (签名 + versionCode + APK 命名)
```

### 2.2 关键配置文件

#### app.json（片段）

```json
{
  "expo": {
    "version": "1.0.6",
    "jsEngine": "hermes",
    "newArchEnabled": true,
    "android": {
      "package": "com.bizyair.assistant",
      "edgeToEdgeEnabled": true
    },
    "plugins": [[
      "expo-build-properties", {
        "android": {
          "reactNativeArchitectures": ["arm64-v8a"],
          "compileSdk": 35, "targetSdk": 35, "minSdk": 26,
          "newArchEnabled": true, "hermesEnabled": true,
          "enableProguardInReleaseBuilds": true,
          "enableShrinkResourcesInReleaseBuilds": true,
          "enablePngCrunchInReleaseBuilds": true
        }
      }
    ]]
  }
}
```

| 字段 | 作用 | 本项目值 |
|------|------|---------|
| `reactNativeArchitectures` | 限定编译架构 | `["arm64-v8a"]` |
| `compileSdk` / `targetSdk` | SDK 级别 | `35` |
| `minSdk` | 最低 API | `26` |
| `enableProguardInReleaseBuilds` | R8 混淆 | `true` |
| `enableShrinkResourcesInReleaseBuilds` | 资源压缩 | `true` |

#### android/keystore.properties（不提交 Git）

```properties
storeFile=app/bizyair-release.keystore
storePassword=<密码>
keyAlias=bizyair
keyPassword=<密码>
```

#### android/gradle.properties（构建后）

```properties
android.versionCode=6
android.enableMinifyInReleaseBuilds=true
android.enableShrinkResourcesInReleaseBuilds=true
reactNativeArchitectures=arm64-v8a
hermesEnabled=true
newArchEnabled=true
```

---

## 三、完整构建流程

### 3.1 一键构建

```powershell
# 要求 PowerShell 7+（pwsh），脚本内置版本检查，PS 5.1 会直接报错退出

# 增量构建（自动递增版本号）
.\build-android.ps1

# 完整清理构建
.\build-android.ps1 -Clean
```

### 3.2 内部执行步骤

```
[1/8] 验证 app.json 架构配置                 → arm64-v8a OK
[2/8] 自动递增版本号 + git 提交               → 1.0.5 → 1.0.6
[3/8] 备份签名密钥到 keystore-backup/          → 防止 prebuild 删除
[4/8] Clean（可选）                            → 停止 daemon → 删除 android/
[5/8] npx expo prebuild --platform android --clean
         ├── 生成 android/ 目录
         ├── 生成 AndroidManifest.xml
         ├── 生成 Kotlin 源文件
         └── 生成 gradle.properties
[5.5/8] 从 keystore-backup/ 恢复密钥            → 恢复到 android/
[6/8] 执行 patch-android-build.ps1
         ├── 写入 ProGuard 规则
         ├── 清理 gradle.properties
         ├── 修复 allowBackup=false
         ├── 注入 Release 签名配置
         ├── versionCode 属性化
         └── 自定义 APK 文件名
[7/8] 同步 versionCode 到 gradle.properties    → android.versionCode=6
[8/8] ./gradlew assembleRelease
         ├── 编译 C++ (expo-modules-core)
         ├── Bundle JS (Metro, Hermes)
         ├── 编译 Kotlin
         ├── R8 代码混淆
         ├── 资源压缩
         ├── APK 签名
         └── 输出 bizyair-assistant-v1.0.6-release.apk
```

### 3.3 仅增量构建（不改原生层）

```powershell
cd android
.\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a
```

### 3.4 手动分步构建

```powershell
npx expo prebuild --platform android --clean
& scripts/patch-android-build.ps1
cd android; .\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a
```

---

## 四、签名密钥管理

### 4.1 生成 Release Keystore

```powershell
$keytool = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\bin\keytool.exe"
& $keytool -genkeypair -v `
  -keystore keystore-backup\bizyair-release.keystore `
  -alias bizyair `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -storepass bizyair2026 -keypass bizyair2026 `
  -dname "CN=BizyAir, OU=Dev, O=BizyAir, L=Shanghai, ST=Shanghai, C=CN"
```

### 4.2 密钥备份机制

| 存储位置 | 说明 |
|---------|------|
| `android/app/bizyair-release.keystore` | 构建时使用（由 prebuild 生成，被 `.gitignore` 忽略） |
| `keystore-backup/bizyair-release.keystore` | **永久备份**（`.gitignore` 忽略，本地保留） |
| `keystore-backup/keystore.properties` | 密码配置备份 |

**自动备份流程**：
- 步骤 `[3/8]`：prebuild 前将 `android/` 下的密钥复制到 `keystore-backup/`
- 步骤 `[5.5/8]`：prebuild 后从 `keystore-backup/` 恢复到新生成的 `android/`

### 4.3 签名验证

```powershell
& "$env:ANDROID_HOME\build-tools\36.0.0\apksigner.bat" verify --print-certs <apk-file>
```

预期输出：
```
Signer #1 certificate DN: CN=BizyAir, OU=Dev, O=BizyAir, L=Shanghai, ST=Shanghai, C=CN
```

### 4.4 密钥安全清单

- [x] `bizyair-release.keystore` 在 `.gitignore`（`/android` 规则）
- [x] `keystore.properties` 在 `.gitignore`（`/android` 规则）
- [x] `keystore-backup/` 在 `.gitignore`（本地保留，不提交）
- [x] 构建脚本自动备份/恢复密钥
- [ ] 额外手动备份到安全位置

---

## 五、版本号管理

### 5.1 版本号体系

| 编号 | 来源 | 用途 | 示例 |
|------|------|------|------|
| `versionName` | `app.json` → `build.gradle` | 面向用户 | `1.0.6` |
| `versionCode` | `app.json` patch → `gradle.properties` | Android 系统升级判断 | `6` |
| APK 文件名 | `build.gradle` 输出重命名 | 分发识别 | `bizyair-assistant-v1.0.6-release.apk` |

### 5.2 自动递增

每次运行 `.\build-android.ps1` 自动：
1. 读取 `app.json` 当前版本
2. patch 位 +1（`1.0.6` → `1.0.7`）
3. 写入 `app.json`
4. `git commit` 版本变更
5. 同步 `versionCode` 到 `gradle.properties`

### 5.3 手动设置版本

```powershell
# 修改 app.json
"version": "1.1.0"
# 修改 gradle.properties
android.versionCode=10
```

---

## 六、问题排查指南

### 问题 1: Gradle daemon 锁文件导致 clean 失败

**现象**：
```
Remove-Item: Failed to move 'android' to recycle bin
```

**根因**：Gradle daemon 持有 `android/` 下文件句柄。

**解决方案**：

```powershell
cd android
.\gradlew.bat --stop
cd ..
Remove-Item -Recurse -Force android
```

> 已在 `build-android.ps1 -Clean` 中自动处理。

### 问题 2: build.gradle 开头有 BOM 字符导致编译失败

**现象**：
```
FAILURE: Build failed with an exception.
> startup failed:
  build file: 1: Unexpected character: '?' @ line 1, column 1.
```

**根因**：PowerShell 的 `Set-Content` 默认写入 UTF-8 with BOM。

**解决方案**：全部改用 `[System.IO.File]::WriteAllText()`。

### 问题 3: expo prebuild 管道重定向吃掉退出码

**现象**：`expo prebuild` 执行失败但脚本继续运行。

**根因**：`npx expo prebuild ... 2>&1 | Write-Host` 管道语法在 PowerShell 中会丢失 `$LASTEXITCODE`。

**解决方案**：

```powershell
# 错误
npx expo prebuild --platform android --clean 2>&1 | Write-Host

# 正确
npx expo prebuild --platform android --clean
if ($LASTEXITCODE -ne 0) { exit 1 }
```

### 问题 4: prebuild 拒绝运行（Git 有未提交更改）

**现象**：
```
! Git branch has uncommitted file changes
```

**根因**：`expo prebuild` 检查 Git 状态。

**解决方案**：`build-android.ps1` 在递增版本号后自动 `git commit`。

### 问题 5: prebuild 删除 keystore 文件

**现象**：
```
Keystore file '...\app\bizyair-release.keystore' not found
```

**根因**：`expo prebuild --clean` 删除并重建 `android/`。

**解决方案**：构建脚本在 prebuild 前备份、prebuild 后恢复。

### 问题 6: CMake 工具链检测错误（NDK 27 + CMake 3.22.1）

**现象**：`ninja: fatal: GetOverlappedResult`

**解决方案**：
```powershell
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" --install "cmake;3.31.5"
```

### 问题 7: PowerShell 5.1 解析脚本报错

**现象**：
```
所在位置 ...\build-android.ps1:101 字符: 1
+ } else {
+ ~
表达式或语句中包含意外的标记"}"。
```

**根因**：Windows PowerShell 5.1（`powershell.exe`）无法正确解析 `try`/`catch` 中的 `2>&1` 重定向语法。

**解决方案**：使用 PowerShell 7+（`pwsh`），脚本已内置版本检查，用 `powershell.exe` 调用会立即报错并提示正确用法。

```powershell
# 正确
pwsh -File .\build-android.ps1
# 或直接在 pwsh 终端中运行
.\build-android.ps1
```

---

### 7.1 APK 基本信息

| 验证项 | 预期值 |
|--------|--------|
| 包名 | `com.bizyair.assistant` |
| 文件名格式 | `bizyair-assistant-v<version>-release.apk` |
| 架构 | 仅 `arm64-v8a` |
| 签名状态 | 已签名 (Scheme v2/v3) |

### 7.2 版本信息验证

```powershell
& "$env:ANDROID_HOME\build-tools\36.0.0\aapt2.exe" dump badging <apk-file>
```

### 7.3 签名验证

```powershell
& "$env:ANDROID_HOME\build-tools\36.0.0\apksigner.bat" verify --verbose <apk-file>
```

### 7.4 架构验证

```powershell
Add-Type -Assembly System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead("<apk-file>")
$zip.Entries | ? { $_.FullName -match "^lib/" } | % { ($_.FullName -split '/')[1] } | Sort -Unique
$zip.Dispose()
# 预期输出: arm64-v8a
```

### 7.5 安装测试

```powershell
adb install -r <apk-file>
adb shell pm list packages | Select-String bizyair
```

### 7.6 功能测试清单

| 测试项 | 验证点 |
|--------|--------|
| 冷启动 | App 正常启动 |
| 首页渲染 | 模型选择器、用户信息、金币/银币余额 |
| Tab 切换 | 首页 ↔ 历史 |
| API 通信 | 模型列表/用户信息接口正常 |
| 参数控件 | 分辨率/比例/质量控件可用 |
| 图片上传 | 图生图模式上传正常 |
| API Key 管理 | 多密钥切换/新增/改名/删除 |
| 异常场景 | 断网提示友好，无崩溃 |

---

## 八、最佳实践与注意事项

### 8.1 配置管理

1. **`app.json` 是唯一真实来源**，不手动修改 `android/` 下生成文件
2. **修补脚本处理插件不支持的配置**：ProGuard、签名、APK 命名
3. **文件编码**：所有写入操作使用 `[System.IO.File]::WriteAllText()` 避免 BOM

### 8.2 构建效率

| 构建类型 | 耗时 | 说明 |
|---------|------|------|
| 完整构建 (`-Clean`) | ~5 分钟 | prebuild + CMake + Metro + R8 |
| 增量构建 | ~5 分钟 | 跳过 prebuild 但重新编译 |
| 仅 JS 变更 | ~2 分钟 | 直接 `gradlew assembleRelease` |

### 8.3 安全

1. `keystore-backup/` 在 `.gitignore`，不提交 Git
2. `android/keystore.properties` 含明文密码，由 `/android` 规则忽视
3. `allowBackup` 强制设为 `false`
4. 无 keystore 时 fallback 到 debug 签名（构建脚本会警告）

### 8.4 版本迭代流程

```
1. 运行 .\build-android.ps1
2. 自动递增 app.json → git commit
3. 自动同步 versionCode
4. 构建 APK（文件名含版本号）
5. 验证版本号
6. adb install -r 覆盖安装测试
```

---

## 九、快速参考卡片

### 命令速查

```powershell
# 一键构建
.\build-android.ps1                       # 增量
.\build-android.ps1 -Clean                # 完整

# 仅增量构建
cd android && .\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a

# 验证 APK
aapt2 dump badging <apk>                  # 版本信息
apksigner verify --verbose <apk>          # 签名验证
adb install -r <apk>                      # 覆盖安装

# 清理
.\gradlew.bat clean                       # Gradle 缓存
.\gradlew.bat --stop                      # 停止 daemon
```

### 常见错误速查

| 错误关键词 | 原因 | 解决 |
|-----------|------|------|
| `Gradle Daemon` + 卡死 | Daemon 持锁 | `gradlew --stop` |
| `Unexpected character: '?'` | BOM 编码 | 使用 `WriteAllText` |
| `GetOverlappedResult` + ninja | CMake 3.22.1 缺陷 | 安装 CMake 3.31.5 |
| `keystore not found` | prebuild 删除文件 | 自动恢复（备份目录） |
| `uncommitted file changes` | Git 不洁 | 自动 commit 版本变更 |
| `Value is null` (versionCode) | Groovy .toInteger() | 改用 `Integer.parseInt()` |
| `意外的标记"}"` (line 101) | PS 5.1 兼容性 | 使用 pwsh 运行 |

### 输出路径

| 构建类型 | 路径 |
|---------|------|
| Release APK | `android/app/build/outputs/apk/release/bizyair-assistant-v{ver}-release.apk` |
| Debug APK | `android/app/build/outputs/apk/debug/bizyair-assistant-v{ver}-debug.apk` |

### 备份目录结构

```
keystore-backup/
├── bizyair-release.keystore    ← 签名密钥（本地保留，不提交 Git）
└── keystore.properties         ← 密码配置（本地保留，不提交 Git）
```

---

> **文档维护**：本文档应在构建流程变更后同步更新。最后更新：2026-05-23。
