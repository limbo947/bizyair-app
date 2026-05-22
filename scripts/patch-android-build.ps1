# scripts/patch-android-build.ps1
# Post-prebuild patching: apply configs not supported by expo-build-properties plugin

param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..")
)

$ErrorActionPreference = "Stop"
$androidDir = Join-Path $ProjectRoot "android"

# ── 1. 写入完整 ProGuard 规则 ──────────────────────────────────
Write-Host "[patch] Writing ProGuard rules..." -ForegroundColor Yellow
$proguardContent = @'
# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.proguard.annotations.KeepGettersAndSetters *;
}
-dontwarn com.facebook.hermes.**
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native New Architecture (TurboModules + Fabric)
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }

# Expo Modules
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# OKHTTP (网络层)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# jssha
-keep class js.** { *; }

# 移除日志 (Release)
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}
'@
Set-Content -Path (Join-Path $androidDir "app\proguard-rules.pro") -Value $proguardContent -NoNewline
Write-Host "  ProGuard rules written" -ForegroundColor Green

# ── 2. 配置 gradle.properties 补充属性 ─────────────────────────
Write-Host "[patch] Configuring gradle.properties..." -ForegroundColor Yellow
$propsPath = Join-Path $androidDir "gradle.properties"

# 读取现有内容
$props = Get-Content $propsPath -Raw

# 清理已弃用的 expo.edgeToEdgeEnabled
$props = $props -replace "expo\.edgeToEdgeEnabled=.*\r?\n?", ""

# 清理旧的不规范 react.nativeArchitectures 命名
$props = $props -replace "react\.nativeArchitectures=.*\r?\n?", ""

# 确保关键属性存在
$appendLines = @()

if ($props -notmatch "android\.versionCode=") {
    $appendLines += "android.versionCode=1"
}

if ($appendLines.Count -gt 0) {
    if (-not $props.EndsWith("`n")) { $props += "`n" }
    $props += ($appendLines -join "`n") + "`n"
    Set-Content -Path $propsPath -Value $props -NoNewline
    Write-Host "  gradle.properties patched: $($appendLines -join ', ')" -ForegroundColor Green
} else {
    Write-Host "  gradle.properties already configured" -ForegroundColor Green
}

# ── 3. 修补 AndroidManifest.xml ─────────────────────────────────
Write-Host "[patch] Patching AndroidManifest.xml..." -ForegroundColor Yellow
$manifestPath = Join-Path $androidDir "app\src\main\AndroidManifest.xml"
$manifest = Get-Content $manifestPath -Raw

# 3a. 修复 android:allowBackup 安全漏洞
$manifest = $manifest -replace 'android:allowBackup="true"', 'android:allowBackup="false"'

# 3b. 添加 tools:replace 确保 allowBackup 覆盖
if ($manifest -notmatch 'tools:replace="android:allowBackup"') {
    $manifest = $manifest -replace '(<application[^>]*?)>', ('$1' + ' tools:replace="android:allowBackup">')
}

Set-Content -Path $manifestPath -Value $manifest -NoNewline
Write-Host "  AndroidManifest.xml patched (allowBackup=false)" -ForegroundColor Green

# ── 4. 配置 Release 签名 ────────────────────────────────────────
Write-Host "[patch] Configuring release signing..." -ForegroundColor Yellow
$buildGradlePath = Join-Path $androidDir "app\build.gradle"
$keystorePropsPath = Join-Path $androidDir "keystore.properties"

if (Test-Path $keystorePropsPath) {
    Write-Host "  keystore.properties found, injecting signing config..." -ForegroundColor Green
    
    $buildGradle = Get-Content $buildGradlePath -Raw
    
    # 4a. 在 android 块之前添加 keystore 读取逻辑
    if ($buildGradle -notmatch "keystorePropertiesFile") {
        $keystoreBlock = @'

def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
'@
        $buildGradle = $buildGradle -replace '(?=android\s*\{)', ($keystoreBlock + "`n`n")
    }
    
    # 4b. 在 signingConfigs 块中添加 release 签名
    if ($buildGradle -match 'signingConfigs\s*\{') {
        if ($buildGradle -notmatch 'signingConfigs\.release') {
            $releaseSigning = @'
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile rootProject.file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
'@
            $buildGradle = $buildGradle -replace '(signingConfigs\s*\{[\s\S]*?)(debug\s*\{[\s\S]*?\})', ('$1$2' + "`n" + $releaseSigning)
        }
    }
    
    # 4c. 修改 buildTypes.release 的 signingConfig
    if ($buildGradle -match 'release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.debug') {
        $buildGradle = $buildGradle -replace 'signingConfig\s+signingConfigs\.debug', 'signingConfig keystorePropertiesFile.exists() ? signingConfigs.release : signingConfigs.debug'
    }
    
    Set-Content -Path $buildGradlePath -Value $buildGradle -NoNewline
    Write-Host "  Release signing configured" -ForegroundColor Green
} else {
    Write-Host "  keystore.properties NOT found, skipping release signing config" -ForegroundColor Yellow
}

# ── 5. 配置版本号管理 ───────────────────────────────────────────
Write-Host "[patch] Configuring version management..." -ForegroundColor Yellow
$buildGradle = Get-Content $buildGradlePath -Raw
if ($buildGradle -match "versionCode\s+\d+") {
    $buildGradle = $buildGradle -replace "versionCode\s+\d+", "versionCode Integer.parseInt(findProperty('android.versionCode') ?: '1')"
    Set-Content -Path $buildGradlePath -Value $buildGradle -NoNewline
    Write-Host "  versionCode now reads from gradle.properties" -ForegroundColor Green
}

Write-Host "[patch] All patches applied successfully!" -ForegroundColor Green
